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
import useFetch from "@/libs/hooks/useFetch";

// Interfaces
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

const normalizePathname = (pathname: string) => {
  const segments = pathname.split("/");
  let locale = "";
  if (segments.length > 1 && segments[1].length === 2) {
    // Assuming locale is a 2-letter code
    locale = segments[1];
    segments.splice(1, 1); // Remove the locale
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

  // Fetch menu data
  const { data: menuData, loading: menuLoading } = useFetch<MenuResponse>(
    `${API_URL}/website/menus`
  );

  useEffect(() => {
    if (locale === "en") {
      document.body.dir = "ltr";
    } else {
      document.body.dir = "rtl";
    }
    if (normalizedPath.includes("colleges")) {
      setIsCollege(true);
    }
  }, [locale, normalizedPath]);

  const handleNav = () => {
    setNavIsOpen(!navIsOpen);
  };

  const handleMouseEnter = (itemId: number) => {
    setHoveredDropdown(itemId);
  };

  const handleMouseLeave = () => {
    setHoveredDropdown(null);
  };

  const getMenuItemUrl = (item: MenuItem) => {
    if (item.type === "LINK" && item.link) {
      return item.link;
    }
    if (item.type === "ROUTER_PUSH" && item.routerPushReference) {
      return `/${locale}${item.routerPushReference}`;
    }
    return "#";
  };

  const renderDesktopMenuItem = (item: MenuItem) => {
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
          {/* Parent Item */}
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

          {/* Dropdown Menu */}
          <div
            className={`absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50 transition-all duration-200 ${
              isDropdownOpen
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible -translate-y-2"
            }`}
          >
            {/* Triangle indicator */}
            <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>

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

  const renderMobileMenuItem = (
    item: MenuItem,
    isExpanded: boolean,
    onToggle: () => void
  ) => {
    const hasChildren = item.children && item.children.length > 0;

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
              onClick={onToggle}
            >
              <FiPlus />
            </button>
          )}
        </div>

        {/* Mobile Submenu */}
        {hasChildren && isExpanded && (
          <div className="ml-4 mt-3 space-y-3">
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

  // Mobile menu state for expandable items
  const [expandedMobileItems, setExpandedMobileItems] = useState<Set<number>>(
    new Set()
  );

  const toggleMobileItem = (itemId: number) => {
    const newExpanded = new Set(expandedMobileItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedMobileItems(newExpanded);
  };

  return (
    <div className="w-full flex-col flex justify-center">
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
      <div className="flex_center w-full bg-primary text-white lg:py-5 py-3 font-medium sm:px-3 px-3">
        <div className="custom_container flex justify-between items-center xl:gap-5 gap-2">
          {/* mobile navbar */}
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
          {navIsOpen && (
            <button
              type="button"
              onClick={handleNav}
              className="fixed top-0 left-0 w-full h-screen z-20 bg-black bg-opacity-40"
            ></button>
          )}

          {/* Mobile Menu Content */}
          {!isCollege ? (
            <div
              className={`flex_start flex-col gap-5 rounded-3xl bg-white w-[80%] h-screen fixed top-0 right-0 z-40 text-secondary duration-300 overflow-y-auto ${
                navIsOpen
                  ? "max-w-[80%] py-10 px-5"
                  : "max-w-0 overflow-hidden p-0"
              }`}
            >
              <button
                type="button"
                onClick={handleNav}
                className="flex justify-start items-center text-xl bg-white custom_shape absolute top-1/2 -left-[50px] w-20 h-16 shadow-[12px_0_0_0_white] rounded-full -translate-y-1/2 z-10 text-black"
              >
                <IoChevronForward className="ml-5" />
              </button>

              {menuLoading ? (
                <div className="w-full space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                menuData?.data?.map((item) =>
                  renderMobileMenuItem(
                    item,
                    expandedMobileItems.has(item.id),
                    () => toggleMobileItem(item.id)
                  )
                )
              )}
            </div>
          ) : (
            // College Mobile Menu (Static)
            <div
              className={`flex_start flex-col gap-5 rounded-3xl bg-white w-[80%] h-screen fixed top-0 right-0 z-40 text-secondary  duration-300 ${
                navIsOpen
                  ? "max-w-[80%] py-10 px-5"
                  : "max-w-0 overflow-hidden p-0"
              }`}
            >
              <button
                type="button"
                onClick={handleNav}
                className="flex justify-start items-center text-xl bg-white custom_shape absolute top-1/2 -left-[50px] w-20 h-16 shadow-[12px_0_0_0_white] rounded-full -translate-y-1/2 z-10 text-black"
              >
                <IoChevronForward className="ml-5" />
              </button>
              <Link
                href={`/${locale}/colleges/${college}`}
                title={t("home")}
                className="flex w-full border-b border-b-lightBorder z-10 font-semibold pb-3"
              >
                {t("home")}
              </Link>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/about`}
                  title={t("about")}
                >
                  {t("about")}
                </Link>
                <button className="text-2xl">
                  <FiPlus />
                </button>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/departments`}
                  title={t("departments")}
                >
                  {t("departments")}
                </Link>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/college-council`}
                  title={t("college_council")}
                >
                  {t("college_council")}
                </Link>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/teachers`}
                  title={t("teachers")}
                >
                  {t("teachers")}
                </Link>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/labs`}
                  title={t("labs")}
                >
                  {t("labs")}
                </Link>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/news`}
                  title={t("news_events")}
                >
                  {t("news_events")}
                </Link>
              </div>
            </div>
          )}

          {/* Desktop navbar */}
          {!isCollege ? (
            <div className="sm:flex hidden justify-center items-center xl:gap-5 gap-3">
              {menuLoading ? (
                <div className="flex gap-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-blue-200 bg-opacity-50 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : (
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
          ) : (
            // College Desktop Menu (Static)
            <div className="sm:flex hidden justify-center items-center xl:gap-5 gap-3">
              <Link
                href={`/${locale}/colleges/${college}`}
                title={t("home")}
                className="flex_center gap-2 xl:text-base text-xs relative"
              >
                <span>{t("home")}</span>
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/colleges/${college}/about`}
                title={t("about")}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("about")}</span>
                <BsChevronDown className="text-white" />
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/colleges/${college}/departments`}
                title={t("departments")}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("departments")}</span>
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/colleges/${college}/college-council`}
                title={t("college_council")}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("college_council")}</span>
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/colleges/${college}/teachers`}
                title={t("teachers")}
                className="lg:flex hidden justify-center items-center gap-2 xl:text-base text-xs"
              >
                <span>{t("teachers")}</span>
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50 lg:block hidden"></span>
              <Link
                href={`/${locale}/colleges/${college}/labs`}
                title={t("labs")}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("labs")}</span>
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/colleges/${college}/news`}
                title={t("news_events")}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("news_events")}</span>
              </Link>
            </div>
          )}

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
