"use client";
import React, { useEffect, useState } from "react";
import LocalSwitcher from "./local-switcher";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { BsChevronDown } from "react-icons/bs";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { IoChevronForward, IoMenu } from "react-icons/io5";
import { API_URL } from "@/libs/env";
import useSWR from "swr";

// Interfaces (kept for the dynamic part of the menu)
interface MenuItem {
  id: number;
  parent_id: number | null;
  type: "ROUTER_PUSH" | "LINK" | "DROPDOWN";
  title: string;
  link: string | null;
  routerPushReference: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  children: MenuItem[];
}

interface MenuResponse {
  success: boolean;
  data: MenuItem[];
  message: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// (The rest of the helper functions and component setup remains the same)
const normalizePathname = (pathname: string) => {
  const segments = pathname.split("/");
  let locale = "";
  if (segments.length > 1 && segments[1].length === 2) {
    locale = segments[1];
    segments.splice(1, 1);
  }
  return { normalizedPath: segments.join("/") || "/", locale };
};

const Navbar = () => {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const params = useParams();
  const college = params?.college as string;
  const { normalizedPath, locale } = normalizePathname(pathname);
  const [isCollege, setIsCollege] = useState(false);
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<number | null>(null);

  const {
    data: menuData,
    error,
    isLoading: menuLoading,
  } = useSWR<MenuResponse>(`${API_URL}/website/menus`, fetcher, {
    dedupingInterval: 1000 * 60 * 60,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (locale === "en") {
      document.body.dir = "ltr";
    } else {
      document.body.dir = "rtl";
    }
    setIsCollege(normalizedPath.includes("colleges"));
    setNavIsOpen(false);
  }, [locale, normalizedPath]);

  const handleNav = () => setNavIsOpen(!navIsOpen);
  const handleMouseEnter = (itemId: number) => setHoveredDropdown(itemId);
  const handleMouseLeave = () => setHoveredDropdown(null);

  if (error) console.error("Failed to load menu data:", error);

  const getMenuItemUrl = (item: MenuItem) => {
    if (item.type === "LINK" && item.link) return item.link;
    if (item.type === "ROUTER_PUSH" && item.routerPushReference)
      return `/${locale}${item.routerPushReference}`;
    return "#";
  };

  const [expandedMobileItems, setExpandedMobileItems] = useState<Set<number>>(
    new Set()
  );

  const toggleMobileItem = (itemId: number) => {
    setExpandedMobileItems((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      return newExpanded;
    });
  };

  // --- Reusable render functions for DYNAMIC menu ---
  const renderDesktopMenuItem = (item: MenuItem) => {
    // ... (This function is now only used for the main dynamic menu)
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = hoveredDropdown === item.id;

    if (hasChildren) {
      return (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={getMenuItemUrl(item)}
            className="flex_center gap-2 xl:text-base text-xs hover:text-opacity-80 transition-colors"
          >
            <span>{item.title}</span>
            <BsChevronDown
              className={`text-white transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </Link>
          <div
            className={`absolute top-full ltr:left-0 rtl:right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50 transition-all duration-200 ${
              isDropdownOpen
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible -translate-y-2"
            }`}
          >
            <div className="absolute -top-2 ltr:left-4 rtl:right-4 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
            <div className="py-2">
              {item.children.map((child, index) => (
                <div key={child.id}>
                  <Link
                    href={getMenuItemUrl(child)}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    {child.title}
                  </Link>
                  {index < item.children.length - 1 && (
                    <div className="border-b border-gray-100 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <Link
        key={item.id}
        href={getMenuItemUrl(item)}
        className="flex_center gap-2 xl:text-base text-xs hover:text-opacity-80 transition-colors"
      >
        <span>{item.title}</span>
      </Link>
    );
  };
  const renderMobileMenuItem = (item: MenuItem) => {
    // ... (This function is now only used for the main dynamic menu)
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMobileItems.has(item.id);
    return (
      <div key={item.id} className="w-full">
        <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
          <Link href={getMenuItemUrl(item)} className="flex-1">
            {item.title}
          </Link>
          {hasChildren && (
            <button
              className={`text-2xl transition-transform duration-200 ${
                isExpanded ? "rotate-45" : ""
              }`}
              onClick={() => toggleMobileItem(item.id)}
            >
              <FiPlus />
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="ltr:ml-4 rtl:mr-4 mt-3 space-y-3">
            {item.children.map((child) => (
              <Link
                key={child.id}
                href={getMenuItemUrl(child)}
                className="block text-sm text-gray-600 hover:text-primary transition-colors py-2 border-b border-gray-100 last:border-b-0"
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex-col flex justify-center">
      {/* Top Bar */}
      <div className="flex_center w-full">
        <div className="flex justify-between items-center custom_container px-3 py-2">
          <div className="flex_center gap-2 text-secondary sm:text-sm text-xs">
            <span>Conference (IEC2023)</span>
            <span>|</span>
            <span>Journals</span>
          </div>
          <Link
            href="/"
            className="w-[195px] h-[53px] relative sm:block hidden"
          >
            <Image src="/images/logo.svg" alt="Navbar" fill priority />
          </Link>
          <LocalSwitcher />
        </div>
      </div>

      {/* Main Navbar */}
      <div className="flex_center w-full bg-primary text-white lg:py-5 py-3 font-medium sm:px-3 px-3">
        <div className="custom_container flex justify-between items-center xl:gap-5 gap-2">
          <Link
            href={"/"}
            className="w-[110px] h-[25px] relative sm:hidden block"
          >
            <Image
              src={"/images/logo-alt.png"}
              alt="My Image"
              fill
              priority
              className="w-full h-full"
            />
          </Link>

          {/* Mobile Menu Overlay & Content */}
          {navIsOpen && (
            <button
              type="button"
              onClick={handleNav}
              className="fixed top-0 left-0 w-full h-screen z-20 bg-black bg-opacity-40"
            ></button>
          )}
          <div
            className={`flex_start flex-col gap-5 rounded-3xl bg-white w-[80%] h-screen fixed top-0 ltr:right-0 rtl:left-0 z-40 text-secondary duration-300 ${
              navIsOpen
                ? "max-w-[80%] py-10 px-5 overflow-visible"
                : "max-w-0 overflow-hidden p-0"
            }`}
          >
            <button
              type="button"
              onClick={handleNav}
              className="flex justify-start items-center text-xl bg-white custom_shape absolute top-1/2 ltr:-left-[50px] rtl:-right-[50px] w-20 h-16 shadow-[12px_0_0_0_white] rounded-full -translate-y-1/2 z-10 text-black"
            >
              <IoChevronForward className="ltr:ml-5 rtl:mr-5" />
            </button>

            {isCollege ? (
              // --- STATIC COLLEGE MOBILE MENU ---
              <>
                <Link
                  href={`/${locale}/colleges/${college}`}
                  className="flex w-full border-b border-b-lightBorder z-10 font-semibold pb-3"
                >
                  {t("home")}
                </Link>
                {/* About Dropdown */}
                <div className="w-full">
                  <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                    <Link href={`/${locale}/colleges/${college}/about`}>
                      {t("about")}
                    </Link>
                    <button
                      className={`text-2xl transition-transform duration-200 ${
                        expandedMobileItems.has(102) ? "rotate-45" : ""
                      }`}
                      onClick={() => toggleMobileItem(102)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                  {expandedMobileItems.has(102) && (
                    <div className="ltr:ml-4 rtl:mr-4 mt-3 space-y-3">
                      <Link
                        href={`/${locale}/colleges/${college}/about`}
                        className="block text-sm text-gray-600"
                      >
                        {t("about_us")}
                      </Link>
                      <Link
                        href={`/${locale}/colleges/${college}/vision-mission`}
                        className="block text-sm text-gray-600"
                      >
                        {t("vision_mission")}
                      </Link>
                    </div>
                  )}
                </div>
                <Link
                  href={`/${locale}/colleges/${college}/departments`}
                  className="flex w-full border-b border-b-lightBorder z-10 font-semibold pb-3"
                >
                  {t("departments")}
                </Link>
                <Link
                  href={`/${locale}/colleges/${college}/college-council`}
                  className="flex w-full border-b border-b-lightBorder z-10 font-semibold pb-3"
                >
                  {t("college_council")}
                </Link>
                <Link
                  href={`/${locale}/colleges/${college}/teachers`}
                  className="flex w-full border-b border-b-lightBorder z-10 font-semibold pb-3"
                >
                  {t("teachers")}
                </Link>
                <Link
                  href={`/${locale}/colleges/${college}/labs`}
                  className="flex w-full border-b border-b-lightBorder z-10 font-semibold pb-3"
                >
                  {t("labs")}
                </Link>
                {/* News & Events Dropdown */}
                <div className="w-full z-10">
                  <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                    <Link href={`/${locale}/colleges/${college}/news`}>
                      {t("news_events")}
                    </Link>
                    <button
                      className={`text-2xl transition-transform duration-200 ${
                        expandedMobileItems.has(107) ? "rotate-45" : ""
                      }`}
                      onClick={() => toggleMobileItem(107)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                  {expandedMobileItems.has(107) && (
                    <div className="ltr:ml-4 rtl:mr-4 mt-3 space-y-3">
                      <Link
                        href={`/${locale}/colleges/${college}/news`}
                        className="block text-sm text-gray-600"
                      >
                        {t("news")}
                      </Link>
                      <Link
                        href={`/${locale}/colleges/${college}/events`}
                        className="block text-sm text-gray-600"
                      >
                        {t("events")}
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // DYNAMIC MAIN MOBILE MENU
              menuData?.data?.map(renderMobileMenuItem)
            )}
          </div>

          {/* Desktop Navbar */}
          <div className="sm:flex hidden justify-center items-center xl:gap-5 gap-3 flex-grow">
            {isCollege ? (
              // --- STATIC COLLEGE DESKTOP MENU ---
              <>
                <Link
                  href={`/${locale}/colleges/${college}`}
                  className="flex_center gap-2 xl:text-base text-xs"
                >
                  <span>{t("home")}</span>
                </Link>
                <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
                {/* About Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(102)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={`/${locale}/colleges/${college}/about`}
                    className="flex_center gap-2 xl:text-base text-xs"
                  >
                    <span>{t("about")}</span>
                    <BsChevronDown
                      className={`text-white transition-transform duration-200 ${
                        hoveredDropdown === 102 ? "rotate-180" : ""
                      }`}
                    />
                  </Link>
                  <div
                    className={`absolute top-full ltr:left-0 rtl:right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border z-50 transition-all ${
                      hoveredDropdown === 102
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                  >
                    <div className="py-2">
                      <Link
                        href={`/${locale}/colleges/${college}/about`}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {t("about_us")}
                      </Link>
                      <Link
                        href={`/${locale}/colleges/${college}/vision-mission`}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {t("vision_mission")}
                      </Link>
                    </div>
                  </div>
                </div>
                <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
                <Link
                  href={`/${locale}/colleges/${college}/departments`}
                  className="flex_center gap-2 xl:text-base text-xs"
                >
                  <span>{t("departments")}</span>
                </Link>
                <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
                <Link
                  href={`/${locale}/colleges/${college}/college-council`}
                  className="flex_center gap-2 xl:text-base text-xs"
                >
                  <span>{t("college_council")}</span>
                </Link>
                <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
                <Link
                  href={`/${locale}/colleges/${college}/teachers`}
                  className="lg:flex hidden_center gap-2 xl:text-base text-xs"
                >
                  <span>{t("teachers")}</span>
                </Link>
                <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50 lg:block hidden"></span>
                <Link
                  href={`/${locale}/colleges/${college}/labs`}
                  className="flex_center gap-2 xl:text-base text-xs"
                >
                  <span>{t("labs")}</span>
                </Link>
                <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
                {/* News & Events Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(107)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={`/${locale}/colleges/${college}/news`}
                    className="flex_center gap-2 xl:text-base text-xs"
                  >
                    <span>{t("news_events")}</span>
                    <BsChevronDown
                      className={`text-white transition-transform duration-200 ${
                        hoveredDropdown === 107 ? "rotate-180" : ""
                      }`}
                    />
                  </Link>
                  <div
                    className={`absolute top-full ltr:left-0 rtl:right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border z-50 transition-all ${
                      hoveredDropdown === 107
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                  >
                    <div className="py-2">
                      <Link
                        href={`/${locale}/colleges/${college}/news`}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {t("news")}
                      </Link>
                      <Link
                        href={`/${locale}/colleges/${college}/events`}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {t("events")}
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // DYNAMIC MAIN DESKTOP MENU
              menuData?.data?.map((item, index) => (
                <React.Fragment key={item.id}>
                  {renderDesktopMenuItem(item)}
                  {index < (menuData?.data?.length || 0) - 1 && (
                    <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
                  )}
                </React.Fragment>
              ))
            )}
          </div>

          <div className="flex_center gap-4">
            <button className="sm:text-2xl text-lg">
              <FiSearch />
            </button>
            <button
              type="button"
              onClick={handleNav}
              className="sm:hidden block text-lg"
            >
              <IoMenu />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
