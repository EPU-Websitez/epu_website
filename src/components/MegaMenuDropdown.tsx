"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";
import { Link } from "@/navigation";
import { API_URL } from "@/libs/env";
import { FaChevronRight } from "react-icons/fa6";
import { useTranslations } from "next-intl";

interface MegaMenuProps {
  itemKey?: string;
  locale: string;
  positionClass?: string;
  customItems?: MegaMenuItem[];
  title?: string; // heading shown at the top of the dropdown
}

interface MegaMenuItem {
  id: number;
  title: string;
  link: string;
  description?: string;
  target?: string;
  itemKey?: string;
  children?: MegaMenuItem[];
}

interface ApiResponse {
  data: any[];
  total: number;
}

// ── NestedItem: renders flyout via Portal so it's never clipped ──
const NestedItem = ({
  item,
  locale,
}: {
  item: MegaMenuItem;
  locale: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [portalPos, setPortalPos] = useState({ top: 0, left: 0 });
  const hasChildren =
    !!item.itemKey || (item.children && item.children.length > 0);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const isRtl = document.documentElement.dir === "rtl";
      setPortalPos({
        top: rect.top - 16, // offset up slightly so the flyout title aligns
        left: isRtl ? rect.left : rect.right,
      });
    }
    setIsHovered(true);
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.target === "_blank" ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors group/nested"
        >
          <span className="text-sm font-medium text-white/90 group-hover/nested:text-white transition-colors line-clamp-2 leading-tight">
            {item.title}
          </span>
          {hasChildren && (
            <FaChevronRight className="text-[10px] text-white/50 group-hover/nested:text-white flex-shrink-0 rtl:rotate-180" />
          )}
        </a>
      ) : (
        <Link
          href={item.link}
          className="flex items-center justify-between gap-3 px-4 py-3 rounded-md hover:bg-white/10 transition-colors group/nested"
        >
          <span className="text-sm font-medium text-white/90 group-hover/nested:text-white transition-colors line-clamp-2 leading-tight">
            {item.title}
          </span>
          {hasChildren && (
            <FaChevronRight className="text-[10px] text-white/50 group-hover/nested:text-white flex-shrink-0 rtl:rotate-180" />
          )}
        </Link>
      )}

      {/* Portal-based flyout – rendered into document.body */}
      {hasChildren &&
        isHovered &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[9999]"
            style={{
              top: portalPos.top,
              ...(document.documentElement.dir === "rtl"
                ? { right: window.innerWidth - portalPos.left }
                : { left: portalPos.left }),
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="ltr:pl-3 rtl:pr-3">
              <MegaMenuDropdown
                itemKey={item.itemKey}
                locale={locale}
                customItems={item.itemKey ? undefined : item.children}
                positionClass="relative"
                title={item.title}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

// ── Main MegaMenuDropdown ──
const MegaMenuDropdown: React.FC<MegaMenuProps> = ({
  itemKey,
  locale,
  positionClass,
  customItems,
  title,
}) => {
  const t = useTranslations("Common");
  const [fetchedItems, setFetchedItems] = useState<MegaMenuItem[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const items = customItems || fetchedItems;
  const isLarge = items.length > 12;

  // ── API endpoint ──
  const getEndpoint = () => {
    if (!itemKey) return null;
    switch (itemKey) {
      case "GET_COLLEGES":
        return `/website/colleges?type=COLLEGE&page=${page}&limit=${limit}`;
      case "GET_INSTITUTES":
        return `/website/colleges?type=INSTITUTE&page=${page}&limit=${limit}`;
      case "GET_CENTERS":
        return `/website/centers?page=${page}&limit=${limit}&is_main=true`;
      case "GET_DIRECTORATES":
        return `/website/directorates?page=${page}&limit=${limit}&is_main=true`;
      default:
        return null;
    }
  };

  const endpoint = getEndpoint();

  const fetcher = ([url, lang]: [string, string]) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "website-language": lang,
      },
    }).then((res) => res.json());

  const {
    data,
    error,
    isLoading: isSwrLoading,
  } = useSWR<ApiResponse>(
    endpoint && !customItems ? [`${API_URL}${endpoint}`, locale] : null,
    fetcher,
    { keepPreviousData: true, revalidateOnFocus: false },
  );

  const isLoading = !customItems && isSwrLoading;

  // ── Map fetched data ──
  useEffect(() => {
    if (data?.data && !customItems) {
      const mappedItems: MegaMenuItem[] = data.data.map((item: any) => {
        let title = item.title;
        let link = "#";
        let target = undefined;

        if (itemKey === "GET_COLLEGES" || itemKey === "GET_INSTITUTES") {
          const subdomain = item.subdomain;
          link = subdomain ? `https://${subdomain}.epu.edu.iq/${locale}` : "#";
          target = "_blank";
        } else if (itemKey === "GET_CENTERS") {
          link = `/centers/${item.slug}`;
        } else if (itemKey === "GET_DIRECTORATES") {
          link = `/directorate/${item.slug}`;
        }

        return {
          id: item.id,
          title,
          link,
          description: item.about_content || item.description || "",
          target,
        };
      });

      setFetchedItems((prev) => {
        if (page === 1) return mappedItems;
        const existingIds = new Set(prev.map((i) => i.id));
        const newItems = mappedItems.filter((i) => !existingIds.has(i.id));
        return [...prev, ...newItems];
      });

      setHasMore(fetchedItems.length + mappedItems.length < (data.total || 0));
    }
  }, [data, itemKey, locale, page, customItems]);

  // ── Positioning logic (only for top-level absolute dropdowns) ──
  useEffect(() => {
    if (!dropdownRef.current) return;
    if (positionClass === "relative") return;

    const adjustPosition = () => {
      if (!dropdownRef.current) return;
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      const newStyle: React.CSSProperties = {};

      if (items.length > 12) {
        const offsetParent = dropdownRef.current.offsetParent;
        if (offsetParent) {
          const parentRect = offsetParent.getBoundingClientRect();
          const targetWidth = 800;
          const targetLeft = (viewportWidth - targetWidth) / 2;
          newStyle.left = `${targetLeft - parentRect.left}px`;
          newStyle.right = "auto";
          newStyle.width = `${targetWidth}px`;
          newStyle.maxWidth = "95vw";
        }
      } else {
        if (rect.right > viewportWidth - 20) {
          const diff = rect.right - viewportWidth + 20;
          newStyle.transform = `translateX(-${diff}px)`;
        } else if (rect.left < 20) {
          const diff = 20 - rect.left;
          newStyle.transform = `translateX(${diff}px)`;
        }
      }

      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.top - 20;
      newStyle.maxHeight = `${Math.max(200, Math.min(spaceBelow, viewportHeight * 0.8))}px`;

      setStyle((prev) => {
        if (
          prev.left !== newStyle.left ||
          prev.maxHeight !== newStyle.maxHeight ||
          prev.transform !== newStyle.transform ||
          prev.width !== newStyle.width
        )
          return newStyle;
        return prev;
      });
    };

    adjustPosition();
    window.addEventListener("resize", adjustPosition);
    window.addEventListener("scroll", adjustPosition);
    return () => {
      window.removeEventListener("resize", adjustPosition);
      window.removeEventListener("scroll", adjustPosition);
    };
  }, [items.length, positionClass]);

  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPage((p) => p + 1);
  };

  if (!endpoint && !customItems) return null;

  // ── Layout helpers ──
  let widthClass = "w-72";
  if (items.length > 12) widthClass = "w-[800px]";
  else if (items.length > 6) widthClass = "w-[500px]";

  let gridClass = "grid-cols-1";
  if (items.length > 12) gridClass = "grid-cols-3";
  else if (items.length > 6) gridClass = "grid-cols-2";

  const isRelative = positionClass === "relative";

  return (
    <div
      ref={dropdownRef}
      style={isRelative ? undefined : style}
      className={`
        ${isRelative ? "relative" : `absolute ${positionClass || "top-full ltr:-left-4 rtl:-right-4 mt-2"}`}
        ${!style.width ? widthClass : ""}
        bg-primary shadow-2xl rounded-xl z-50 p-5
        cursor-default overflow-y-auto transition-all duration-200
        border border-white/10
      `}
    >
      {/* Arrow triangle – only for top-level non-shifted dropdowns */}
      {!isRelative && !style.transform && !isLarge && (
        <div className="absolute -top-2 ltr:left-8 rtl:right-8 w-4 h-4 bg-primary rotate-45 border-l border-t border-white/10" />
      )}

      {/* Title heading */}
      {title && (
        <div className="mb-3 pb-2 border-b border-white/20">
          <h3 className="text-white text-lg font-bold">{title}</h3>
        </div>
      )}

      <div className={`grid ${gridClass} gap-1`}>
        {items.map((item) => {
          // Items with children or a data key → NestedItem (portal flyout)
          if (item.itemKey || (item.children && item.children.length > 0)) {
            return <NestedItem key={item.id} item={item} locale={locale} />;
          }

          // Leaf items – underlined link style
          const inner = (
            <span className="text-sm text-white/90 group-hover/leaf:text-white underline decoration-white/30 group-hover/leaf:decoration-white transition-colors line-clamp-2 leading-tight">
              {item.title}
            </span>
          );

          const cls =
            "flex items-center px-4 py-3 rounded-md hover:bg-white/10 transition-colors group/leaf";

          if (item.target === "_blank") {
            return (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {inner}
              </a>
            );
          }

          return (
            <Link key={item.id} href={item.link} className={cls}>
              {inner}
            </Link>
          );
        })}

        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="p-3 animate-pulse">
              <div className="h-4 bg-white/20 rounded w-3/4 mb-2" />
            </div>
          ))}
      </div>

      {hasMore && !customItems && (
        <div className="mt-3 pt-2 border-t border-white/20 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="text-white text-xs font-medium hover:bg-white/10 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {items.length === 0 && !isLoading && !error && (
        <div className="col-span-full text-center py-8 text-white/50 text-sm">
          No items found.
        </div>
      )}
    </div>
  );
};

export default MegaMenuDropdown;
