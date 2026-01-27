"use client";
import React, { useEffect, useState } from "react";
import LocalSwitcher from "./local-switcher";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { BsChevronDown } from "react-icons/bs";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useTranslations } from "next-intl";
import {
  IoChevronForward,
  IoChevronBack,
  IoMenu,
  IoChevronDown,
} from "react-icons/io5";

import useSWR from "swr";
import SearchModal from "./Search";

interface MenuItem {
  id: number;
  parent_id: number | null;
  type: "ROUTER_PUSH" | "LINK" | "DROPDOWN" | "EXTERNAL";
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

// --- helpers
const normalizePathname = (pathname: string) => {
  const segments = pathname.split("/");
  let locale = "en"; // Default locale
  if (segments.length > 1 && /^[a-z]{2}$/.test(segments[1])) {
    locale = segments[1];
    segments.splice(1, 1);
  }
  const normalized = segments.join("/") || "/";
  return {
    normalizedPath: normalized.startsWith("/") ? normalized : `/${normalized}`,
    locale,
  };
};

const Navbar = () => {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const params = useParams();
  const college = params?.college as string;
  const { normalizedPath, locale } = normalizePathname(pathname);
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<number | null>(null);

  const fetcher = ([url, lang]: [string, string]) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "website-language": lang,
      },
    }).then((res) => res.json());

  const {
    data: menuData,
    error,
    isLoading: menuLoading,
  } = useSWR<MenuResponse>(
    [`${process.env.NEXT_PUBLIC_API_URL}/website/menus`, locale],
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    document.body.dir = locale === "en" ? "ltr" : "rtl";
    setNavIsOpen(false); // Close mobile nav on route change
  }, [locale, pathname]);

  const handleNav = () => setNavIsOpen((s) => !s);
  const handleMouseEnter = (itemId: number) => setHoveredDropdown(itemId);
  const handleMouseLeave = () => setHoveredDropdown(null);
  if (error) console.error("Failed to load menu data:", error);

  const getMenuItemUrl = (item: MenuItem) => {
    if (item.type === "LINK" && item.link) return item.link;
    if (item.type === "EXTERNAL" && item.link) return item.link;
    if (item.type === "ROUTER_PUSH" && item.routerPushReference) {
      const ref = item.routerPushReference.startsWith("/")
        ? item.routerPushReference
        : `/${item.routerPushReference}`;
      return `/${locale}${ref}`;
    }
    return "#";
  };

  const toLocalPath = (href: string) => {
    if (!href) return "/";
    try {
      const url = new URL(href, window.location.origin);
      let p = url.pathname || "/";
      const segs = p.split("/").filter(Boolean);
      if (segs[0] === locale) {
        segs.shift();
      }
      const out = `/${segs.join("/")}`;
      return out === "" ? "/" : out;
    } catch {
      let p = href.split("?")[0].split("#")[0] || "/";
      if (!p.startsWith("/")) p = `/${p}`;
      const segs = p.split("/").filter(Boolean);
      if (segs[0] === locale) segs.shift();
      const out = `/${segs.join("/")}`;
      return out === "" ? "/" : out;
    }
  };

  const isActiveExact = (href: string) => {
    const local = toLocalPath(href);
    return normalizedPath === local;
  };

  const isActiveStartsWith = (href: string) => {
    const local = toLocalPath(href);
    if (local === "/") return normalizedPath === "/";
    return (
      normalizedPath === local ||
      normalizedPath.startsWith(local.endsWith("/") ? local : `${local}/`)
    );
  };

  const [expandedMobileItems, setExpandedMobileItems] = useState<Set<number>>(
    new Set(),
  );
  const toggleMobileItem = (itemId: number) => {
    setExpandedMobileItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const desktopActiveClass = "border-b-2 border-white pb-1";
  const mobileActiveClass = "border-b-2 !border-primary pb-1";

  // --- Recursive Component for Desktop Submenus ---
  const DesktopSubmenuItem = ({ item }: { item: MenuItem }) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasChildren =
      Array.isArray(item.children) && item.children.length > 0;
    const href = getMenuItemUrl(item);
    const childActive = isActiveStartsWith(href);

    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={href}
          target={item.type === "EXTERNAL" ? "_blank" : undefined}
          rel={item.type === "EXTERNAL" ? "noopener noreferrer" : undefined}
          title={item.title}
          className={`flex justify-between items-center w-full px-4 py-3 text-sm hover:bg-gray-50 hover:text-primary transition-colors ${
            childActive ? "text-primary font-semibold" : "text-gray-700"
          }`}
        >
          <span>{item.title}</span>
          {hasChildren &&
            (locale === "en" ? <IoChevronForward /> : <IoChevronBack />)}
        </Link>
        {hasChildren && isHovered && (
          <div className="absolute top-0 ltr:left-full rtl:right-full w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
            <div className="py-2">
              {item.children.map((child) => (
                <DesktopSubmenuItem key={child.id} item={child} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Main Desktop Menu Item Renderer ---
  const renderDesktopMenuItem = (item: MenuItem) => {
    const hasChildren =
      Array.isArray(item.children) && item.children.length > 0;
    const parentHref = getMenuItemUrl(item);
    const isDropdownOpen = hoveredDropdown === item.id;
    const anyChildActive =
      hasChildren &&
      item.children.some((child) => isActiveStartsWith(getMenuItemUrl(child)));
    const parentItselfActive =
      item.link !== null && isActiveStartsWith(parentHref);
    const parentActive = parentItselfActive || anyChildActive;

    if (hasChildren) {
      return (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={parentHref}
            target={item.type === "EXTERNAL" ? "_blank" : undefined}
            rel={item.type === "EXTERNAL" ? "noopener noreferrer" : undefined}
            title={item.title}
            className={`flex_center gap-2 xl:text-base text-[10px] hover:text-opacity-80 transition-colors ${
              parentActive ? desktopActiveClass : ""
            }`}
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
              {item.children.map((child) => (
                <DesktopSubmenuItem key={child.id} item={child} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        target={item.type === "EXTERNAL" ? "_blank" : undefined}
        rel={item.type === "EXTERNAL" ? "noopener noreferrer" : undefined}
        title={item.title}
        href={parentHref}
        className={`flex_center gap-2 xl:text-base text-[10px] hover:text-opacity-80 transition-colors ${
          isActiveExact(parentHref) && item.type !== "EXTERNAL"
            ? desktopActiveClass
            : ""
        }`}
      >
        <span>{item.title}</span>
      </Link>
    );
  };

  // --- Recursive Mobile Menu Renderer ---
  const renderMobileMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren =
      Array.isArray(item.children) && item.children.length > 0;

    const parentHref = getMenuItemUrl(item);

    // Child active check is still needed for expanding the menu
    const anyChildActive =
      hasChildren &&
      item.children.some((child) => isActiveStartsWith(getMenuItemUrl(child)));

    // FIX: parent should only be active if it has a real link and matches exactly
    const parentActive =
      parentHref !== "#" &&
      isActiveExact(parentHref) &&
      item.type !== "EXTERNAL";

    const isExpanded = expandedMobileItems.has(item.id);

    return (
      <div key={item.id} className="w-full z-10">
        <div
          className={`flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3 ${
            level > 0 ? "pt-3" : ""
          }`}
        >
          <Link
            href={parentHref}
            target={item.type === "EXTERNAL" ? "_blank" : undefined}
            rel={item.type === "EXTERNAL" ? "noopener noreferrer" : undefined}
            title={item.title}
            className={`flex-1 ${parentActive ? mobileActiveClass : ""}`}
          >
            {item.title}
          </Link>

          {hasChildren && (
            <button
              className="text-2xl transition-transform duration-300 p-2 -m-2"
              onClick={() => toggleMobileItem(item.id)}
            >
              <IoChevronDown
                className={`transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {hasChildren && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div className="ltr:pl-4 rtl:pr-4 pt-2 space-y-2">
              {item.children.map((child) =>
                renderMobileMenuItem(child, level + 1),
              )}
            </div>
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
            title="Home"
            className="md:w-[195px] w-[160px] md:h-[53px] h-[45px] relative sm:block hidden"
          >
            <Image
              src="/images/logo.svg"
              alt="Navbar logo"
              fill
              priority
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          </Link>
          <LocalSwitcher />
        </div>
      </div>

      {/* Main Navbar */}
      <div className="flex_center w-full bg-primary text-white lg:py-5 py-3 font-medium sm:px-3 px-3">
        <div className="custom_container flex justify-between items-center xl:gap-5 gap-2">
          <Link
            href={"/"}
            title="Home"
            className="w-[110px] h-[25px] relative sm:hidden block"
          >
            <Image
              src={"/images/logo-alt.png"}
              alt="Logo"
              fill
              priority
              className="w-full h-full"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          </Link>
          {/* Mobile Overlay */}
          {navIsOpen && (
            <button
              type="button"
              onClick={handleNav}
              className="fixed top-0 left-0 w-full h-screen z-30 bg-black bg-opacity-40"
              aria-label="Close menu"
            />
          )}
          {/* Mobile Drawer */}
          {/* Solution: Separate the button from the scrollable content area */}
          <div
            className={`flex_start overflow-visible flex-col gap-5 rounded-3xl bg-white w-[80%] h-screen fixed top-0 ltr:right-0 rtl:left-0 z-40 text-secondary duration-300 ${
              navIsOpen
                ? "max-w-[80%] py-10 px-5"
                : "max-w-0 overflow-hidden p-0"
            }`}
          >
            {/* Close button - positioned absolutely, stays outside overflow context */}
            {navIsOpen && (
              <button
                type="button"
                onClick={handleNav}
                className="flex justify-start items-center text-xl bg-white custom_shape absolute top-1/2 ltr:-left-[50px] rtl:-right-[50px] w-20 h-16 shadow-[12px_0_0_0_white] rounded-full -translate-y-1/2 z-10 text-black"
              >
                {locale === "en" ? (
                  <IoChevronBack className="ltr:ml-5 rtl:mr-5" />
                ) : (
                  <IoChevronForward className="ltr:ml-5 rtl:mr-5" />
                )}
              </button>
            )}

            {/* Scrollable content area */}
            <div className="flex flex-col gap-5 overflow-y-auto overflow-x-hidden w-full">
              {menuData?.data?.map((item) => renderMobileMenuItem(item))}
            </div>
          </div>
          {/* Desktop navbar row */}
          <div className="sm:flex hidden justify-center items-center xl:gap-5 gap-3 flex-grow">
            {menuData?.data?.map((item, index) => (
              <React.Fragment key={item.id}>
                {renderDesktopMenuItem(item)}
                {index < (menuData?.data?.length || 0) - 1 && (
                  <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex_center gap-4">
            <button
              className="sm:text-2xl text-lg"
              aria-label="Open search"
              onClick={() => setIsSearchOpen(true)}
            >
              <FiSearch />
            </button>
            <button
              type="button"
              onClick={handleNav}
              className="sm:hidden block text-lg"
              aria-label="Open menu"
            >
              <IoMenu />
            </button>
          </div>
        </div>
      </div>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default Navbar;
