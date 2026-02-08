"use client";
import React, { useEffect, useState } from "react";
import LocalSwitcher from "./local-switcher";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/navigation";
import { BsChevronDown } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { useTranslations, useLocale } from "next-intl";
import {
  IoChevronForward,
  IoChevronBack,
  IoMenu,
  IoChevronDown,
} from "react-icons/io5";

import useSWR from "swr";
import SearchModal from "./Search";
import MegaMenuDropdown from "./MegaMenuDropdown";
import { API_URL } from "@/libs/env";

interface MenuItem {
  id: number;
  parent_id: number | null;
  type: "ROUTER_PUSH" | "LINK" | "DROPDOWN" | "EXTERNAL";
  title: string;
  title_en?: string;
  title_ku?: string;
  title_ar?: string;
  link: string | null;
  routerPushReference: string | null;
  order_index: number;
  key?: string;
  created_at: string;
  updated_at: string;
  children: MenuItem[];
}
interface MenuResponse {
  success: boolean;
  data: MenuItem[];
  message: string;
}

const Navbar = () => {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<number | null>(null);

  // Mobile pagination tracking
  const [mobilePages, setMobilePages] = useState<Record<number, number>>({});
  const [mobileHasMore, setMobileHasMore] = useState<Record<number, boolean>>(
    {},
  );

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
  } = useSWR<MenuResponse>([`${API_URL}/website/new-menus`, locale], fetcher, {
    dedupingInterval: 1000 * 60 * 60,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    document.body.dir = locale === "en" ? "ltr" : "rtl";
    setNavIsOpen(false); // Close mobile nav on route change
  }, [locale, pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (navIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [navIsOpen]);

  const handleNav = () => setNavIsOpen((s) => !s);
  const handleMouseEnter = (itemId: number) => setHoveredDropdown(itemId);
  const handleMouseLeave = () => setHoveredDropdown(null);
  if (error) console.error("Failed to load menu data:", error);

  // Helper to get localized title if available, fallback to title
  const getTitle = (item: MenuItem) => {
    if (locale === "ku" && item.title_ku) return item.title_ku;
    if (locale === "ar" && item.title_ar) return item.title_ar;
    if (locale === "en" && item.title_en) return item.title_en;
    return item.title;
  };

  const getMenuItemUrl = (item: MenuItem) => {
    if (item.type === "LINK" && item.link) return item.link;
    if (item.type === "EXTERNAL" && item.link) return item.link;
    if (item.type === "ROUTER_PUSH" && item.routerPushReference) {
      const ref = item.routerPushReference.startsWith("/")
        ? item.routerPushReference
        : `/${item.routerPushReference}`;
      return ref;
    }
    return "#";
  };

  const isActiveExact = (href: string) => {
    if (href === "#") return false;
    const current = pathname;
    const normalize = (p: string) => (p.startsWith("/") ? p : `/${p}`);
    // href from getMenuItemUrl might not have slash if external or something, but internal ones do
    return (
      normalize(current) === normalize(href) ||
      normalize(current) === normalize(href) + "/"
    );
  };

  // Helper to check if any child is active (recursive)
  const isChildActive = (item: MenuItem): boolean => {
    const href = getMenuItemUrl(item);
    if (isActiveExact(href)) return true;
    if (item.children && item.children.length > 0) {
      return item.children.some((child) => isChildActive(child));
    }
    return false;
  };

  const [expandedMobileItems, setExpandedMobileItems] = useState<Set<number>>(
    new Set(),
  );

  const [mobileDynamicChildren, setMobileDynamicChildren] = useState<
    Record<number, any[]>
  >({});
  const [loadingMobileChildren, setLoadingMobileChildren] = useState<
    Record<number, boolean>
  >({});

  const loadMobileDynamicData = async (item: MenuItem, isLoadMore = false) => {
    if (!item.key) return;

    // Initial load check
    if (!isLoadMore && mobileDynamicChildren[item.id]) return;

    setLoadingMobileChildren((prev) => ({ ...prev, [item.id]: true }));

    const currentPage = isLoadMore ? (mobilePages[item.id] || 1) + 1 : 1;
    const limit = 10; // Smaller limit for mobile pagination

    try {
      let url = "";
      if (item.key === "GET_COLLEGES")
        url = `${API_URL}/website/colleges?type=COLLEGE&limit=${limit}&page=${currentPage}`;
      else if (item.key === "GET_INSTITUTES")
        url = `${API_URL}/website/colleges?type=INSTITUTE&limit=${limit}&page=${currentPage}`;
      else if (item.key === "GET_CENTERS")
        url = `${API_URL}/website/centers?limit=${limit}&page=${currentPage}`;
      else if (item.key === "GET_DIRECTORATES")
        url = `${API_URL}/website/directorates?limit=${limit}&page=${currentPage}`;

      if (url) {
        const res = await fetch(url, {
          headers: { "website-language": locale as string },
        });
        const json = await res.json();

        if (json.data) {
          // Transform to MenuItems
          const mapped = json.data.map((d: any) => ({
            id: d.id + 99999 + Math.random(), // Unique ID
            title: d.title,
            type:
              item.key?.includes("COLLEGE") || item.key?.includes("INSTITUTE")
                ? "EXTERNAL"
                : "ROUTER_PUSH",
            link:
              (item.key?.includes("COLLEGE") ||
                item.key?.includes("INSTITUTE")) &&
              d.subdomain
                ? `https://${d.subdomain}.epu.edu.iq/${locale}`
                : null,
            routerPushReference:
              item.key === "GET_CENTERS"
                ? `/centers/${d.slug}`
                : item.key === "GET_DIRECTORATES"
                  ? `/directorate/${d.id}`
                  : null,
            children: [],
          }));

          setMobileDynamicChildren((prev) => {
            const existing = prev[item.id] || [];
            return {
              ...prev,
              [item.id]: isLoadMore ? [...existing, ...mapped] : mapped,
            };
          });

          setMobilePages((prev) => ({ ...prev, [item.id]: currentPage }));

          // Check if we have more pages
          // Assuming API returns total or we can infer from length
          const currentCount =
            (isLoadMore ? mobileDynamicChildren[item.id]?.length || 0 : 0) +
            mapped.length;
          const total = json.total || 0;
          setMobileHasMore((prev) => ({
            ...prev,
            [item.id]: currentCount < total,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load mobile dynamic menu", err);
    } finally {
      setLoadingMobileChildren((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const toggleMobileItem = (item: MenuItem) => {
    const itemId = item.id;
    setExpandedMobileItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else {
        next.add(itemId);
        // Trigger fetch if needed
        if (item.key && !mobileDynamicChildren[itemId]) {
          loadMobileDynamicData(item);
        }
      }
      return next;
    });
  };

  const desktopActiveClass = "border-b-2 border-white pb-1";
  const mobileActiveClass = "border-b-2 !border-primary pb-1";

  const DesktopSubmenuItem = ({ item }: { item: MenuItem }) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasChildren =
      (Array.isArray(item.children) && item.children.length > 0) || !!item.key;

    const href = getMenuItemUrl(item);
    const title = getTitle(item);
    const childActive = isActiveExact(href); // Simplified check

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
          title={title}
          className={`flex justify-between items-center w-full px-4 py-3 text-sm hover:bg-gray-50 hover:text-primary transition-colors ${
            childActive ? "text-primary font-semibold" : "text-gray-700"
          }`}
        >
          <span>{title}</span>
          {hasChildren &&
            (locale === "en" ? <IoChevronForward /> : <IoChevronBack />)}
        </Link>
        {hasChildren && isHovered && (
          <div
            className={`absolute top-0 ltr:left-full rtl:right-full z-50 transition-all duration-200 ${item.key ? "" : "w-64 bg-white shadow-lg rounded-lg border border-gray-200"}`}
          >
            {item.key ? (
              <div className="relative">
                <MegaMenuDropdown
                  itemKey={item.key}
                  locale={locale as string}
                  positionClass="top-0 ltr:left-0 rtl:right-0"
                />
              </div>
            ) : (
              <div className="py-2">
                {item.children.map((child) => (
                  <DesktopSubmenuItem key={child.id} item={child} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // --- Main Desktop Menu Item Renderer ---
  const renderDesktopMenuItem = (item: MenuItem) => {
    const hasChildren =
      (Array.isArray(item.children) && item.children.length > 0) || !!item.key;
    const parentHref = getMenuItemUrl(item);
    const isDropdownOpen = hoveredDropdown === item.id;
    const title = getTitle(item);

    // Active check
    const parentItselfActive = isActiveExact(parentHref);
    // Deep check for children
    const anyChildActive = isChildActive(item);
    const parentActive = parentItselfActive || anyChildActive;

    if (hasChildren) {
      return (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center">
            {/* If it's a dropdown/toggle, clicking it might not navigate if it has no link. 
                API says DROPDOWN has no link. LINK/ROUTER_PUSH has link.
            */}
            {item.type === "DROPDOWN" ? (
              <button
                className={`flex_center gap-2 xl:text-base text-[10px] hover:text-opacity-80 transition-colors ${
                  parentActive ? desktopActiveClass : ""
                }`}
              >
                <span>{title}</span>
                <BsChevronDown
                  className={`text-white transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : (
              <Link
                href={parentHref}
                target={item.type === "EXTERNAL" ? "_blank" : undefined}
                rel={
                  item.type === "EXTERNAL" ? "noopener noreferrer" : undefined
                }
                title={title}
                className={`flex_center gap-2 xl:text-base text-[10px] hover:text-opacity-80 transition-colors ${
                  parentActive ? desktopActiveClass : ""
                }`}
              >
                <span>{title}</span>
                <BsChevronDown
                  className={`text-white transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Link>
            )}
          </div>

          {/* Dropdown Content */}
          <div
            className={`absolute top-full ltr:left-0 rtl:right-0 mt-2 transition-all duration-200 ${
              isDropdownOpen
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible -translate-y-2"
            }`}
          >
            {/* If item has a KEY, use Mega Menu */}
            {item.key ? (
              <MegaMenuDropdown itemKey={item.key} locale={locale as string} />
            ) : (
              // Standard Recursive Dropdown
              <div className="w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50 relative">
                <div className="absolute -top-2 ltr:left-4 rtl:right-4 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
                <div className="py-2">
                  {item.children.map((child) => (
                    <DesktopSubmenuItem key={child.id} item={child} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        target={item.type === "EXTERNAL" ? "_blank" : undefined}
        rel={item.type === "EXTERNAL" ? "noopener noreferrer" : undefined}
        title={title}
        href={parentHref}
        className={`flex_center gap-2 xl:text-base text-[10px] hover:text-opacity-80 transition-colors ${
          parentActive ? desktopActiveClass : ""
        }`}
      >
        <span>{title}</span>
      </Link>
    );
  };

  // --- Recursive Mobile Menu Renderer ---
  const renderMobileMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren =
      (Array.isArray(item.children) && item.children.length > 0) || !!item.key;

    const parentHref = getMenuItemUrl(item);
    const title = getTitle(item);

    // Check active
    const parentActive =
      isActiveExact(parentHref) &&
      item.type !== "EXTERNAL" &&
      item.type !== "DROPDOWN";

    const isExpanded = expandedMobileItems.has(item.id);

    // Determine children source
    let childrenToRender = item.children;
    if (item.key && mobileDynamicChildren[item.id]) {
      childrenToRender = [...item.children, ...mobileDynamicChildren[item.id]];
    }
    const isLoadingDynamic = item.key && loadingMobileChildren[item.id];

    return (
      <div key={item.id} className="w-full z-50">
        <div
          className={`flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3 ${
            level > 0 ? "pt-3" : ""
          }`}
        >
          {item.type === "DROPDOWN" ? (
            <span className={`flex-1 ${parentActive ? mobileActiveClass : ""}`}>
              {title}
            </span>
          ) : (
            <Link
              href={parentHref}
              target={item.type === "EXTERNAL" ? "_blank" : undefined}
              rel={item.type === "EXTERNAL" ? "noopener noreferrer" : undefined}
              title={title}
              className={`flex-1 ${parentActive ? mobileActiveClass : ""}`}
              onClick={() => setNavIsOpen(false)}
            >
              {title}
            </Link>
          )}

          {hasChildren && (
            <button
              className="text-2xl transition-transform duration-300 p-2 -m-2"
              onClick={() => toggleMobileItem(item)}
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
              isExpanded ? "max-h-[2000px]" : "max-h-0" // Increased max-height for dynamic content
            }`}
          >
            <div className="ltr:pl-4 rtl:pr-4 pt-2 space-y-2">
              {childrenToRender?.map((child) =>
                renderMobileMenuItem(child, level + 1),
              )}

              {item.key && mobileHasMore[item.id] && !isLoadingDynamic && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    loadMobileDynamicData(item, true);
                  }}
                  className="mx-4 my-2 text-sm text-primary font-medium hover:underline flex items-center gap-1"
                >
                  {t("load_more") || "Load More"}
                </button>
              )}

              {isLoadingDynamic && (
                <div className="space-y-2 px-4 py-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-100/50 animate-pulse rounded w-3/4"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex-col flex justify-center z-40">
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
          <div
            className={`flex_start overflow-visible flex-col gap-5 rounded-3xl bg-white w-[80%] h-screen fixed top-0 ltr:right-0 rtl:left-0 z-40 text-secondary duration-300 ${
              navIsOpen
                ? "max-w-[80%] py-10 px-5"
                : "max-w-0 overflow-hidden p-0"
            }`}
          >
            {/* Close button */}
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
            <div className="flex flex-col gap-5 overflow-y-auto overflow-x-hidden w-full h-full pb-20">
              {menuData?.data?.map((item) => renderMobileMenuItem(item))}
            </div>
          </div>

          {/* Desktop navbar row */}
          <div className="sm:flex hidden justify-center items-center xl:gap-5 gap-3 flex-grow relative">
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
