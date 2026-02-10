"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { API_URL } from "@/libs/env";
import { FaChevronRight } from "react-icons/fa6";
import { useTranslations } from "next-intl";

interface MegaMenuProps {
  itemKey?: string; // Optional now
  locale: string;
  positionClass?: string;
  customItems?: MegaMenuItem[]; // For standard dropdowns
}

interface MegaMenuItem {
  id: number;
  title: string;
  link: string;
  description?: string;
  target?: string;
}

interface ApiResponse {
  data: any[];
  total: number;
}

const MegaMenuDropdown: React.FC<MegaMenuProps> = ({
  itemKey,
  locale,
  positionClass,
  customItems,
}) => {
  const t = useTranslations("Common");
  const [fetchedItems, setFetchedItems] = useState<MegaMenuItem[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  // Use custom items if provided
  const items = customItems || fetchedItems;
  const isLarge = items.length > 12;
  const isMsg = items.length > 6 && items.length <= 12;

  // Determine API Endpoint based on key
  const getEndpoint = () => {
    if (!itemKey) return null;
    switch (itemKey) {
      case "GET_COLLEGES":
        return `/website/colleges?type=COLLEGE&page=${page}&limit=${limit}`;
      case "GET_INSTITUTES":
        return `/website/colleges?type=INSTITUTE&page=${page}&limit=${limit}`;
      case "GET_CENTERS":
        return `/website/centers?page=${page}&limit=${limit}`;
      case "GET_DIRECTORATES":
        return `/website/directorates?page=${page}&limit=${limit}`;
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
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  const isLoading = !customItems && isSwrLoading;

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
          link = `/${locale}/centers/${item.slug}`;
        } else if (itemKey === "GET_DIRECTORATES") {
          link = `/${locale}/directorate/${item.id}`;
        }

        return {
          id: item.id,
          title: title,
          link: link,
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
  }, [data, itemKey, locale, page, customItems]); // removed items dependency to avoid loop

  // --- Smart Positioning Logic ---
  useEffect(() => {
    const adjustPosition = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        let newStyle: React.CSSProperties = {};

        // If Large (3 cols), Center on Page
        if (items.length > 12) {
          // We want to be centered in viewport.
          // Since we are absolute relative to `offsetParent`, we need to compensate.
          const offsetParent = dropdownRef.current.offsetParent;
          if (offsetParent) {
            const parentRect = offsetParent.getBoundingClientRect();
            const targetWidth = 800; // Fixed width for large
            const targetLeft = (viewportWidth - targetWidth) / 2;

            // Calculate left relative to offsetParent
            const relativeLeft = targetLeft - parentRect.left;

            newStyle.left = `${relativeLeft}px`;
            newStyle.right = "auto"; // Reset right if set by classes
            newStyle.width = `${targetWidth}px`;
            newStyle.maxWidth = "95vw"; // Safety
          }
        } else {
          const overflowRight = rect.right > viewportWidth;
          const overflowLeft = rect.left < 0;

          if (overflowRight) {
            if (rect.right > viewportWidth - 20) {
              const diff = rect.right - viewportWidth + 20;
              newStyle.transform = `translateX(-${diff}px)`;
            }
          }
          if (overflowLeft) {
            if (rect.left < 20) {
              const diff = 20 - rect.left;
              newStyle.transform = `translateX(${diff}px)`;
            }
          }
        }

        // Vertical overflow logic (shared)
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.top - 20;
        const activeMaxHeight = Math.max(
          200,
          Math.min(spaceBelow, viewportHeight * 0.8),
        );
        newStyle.maxHeight = `${activeMaxHeight}px`;

        setStyle((prev) => {
          // Only update if changed to avoid loop?
          // Simple check
          if (
            prev.left !== newStyle.left ||
            prev.maxHeight !== newStyle.maxHeight ||
            prev.transform !== newStyle.transform ||
            prev.width !== newStyle.width
          ) {
            return newStyle;
          }
          return prev;
        });
      }
    };

    // Run on mount and resize

    adjustPosition();
    window.addEventListener("resize", adjustPosition);
    window.addEventListener("scroll", adjustPosition);

    return () => {
      window.removeEventListener("resize", adjustPosition);
      window.removeEventListener("scroll", adjustPosition);
    };
  }, [items.length]);

  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPage((p) => p + 1);
  };

  if (!endpoint && !customItems) return null;

  // Width classes
  let widthClass = "w-64";
  if (items.length > 12) widthClass = "w-[800px]";
  else if (items.length > 6) widthClass = "w-[500px]";

  // Grid classes
  let gridClass = "grid-cols-1";
  if (items.length > 12) gridClass = "grid-cols-3";
  else if (items.length > 6) gridClass = "grid-cols-2";

  return (
    <div
      ref={dropdownRef}
      style={style}
      className={`absolute ${positionClass || "top-full ltr:-left-10 rtl:-right-10 mt-2"} ${!style.width ? widthClass : ""} bg-white shadow-xl rounded-lg border border-gray-200 z-50 p-6 cursor-default overflow-y-auto transition-all duration-200`}
    >
      {/* Arrow - Hide if centered (isLarge) or if explicitly shifting? */}
      {!positionClass && !style.transform && !isLarge && (
        <div className="absolute -top-2 ltr:left-16 rtl:right-16 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
      )}

      <div className={`grid ${gridClass} gap-4`}>
        {items.map((item) => {
          const content = (
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm text-gray-800 group-hover:text-primary line-clamp-2 leading-tight">
                {item.title}
              </span>
              <FaChevronRight className="text-xs text-gray-400 group-hover:text-primary flex-shrink-0 rtl:rotate-180" />
            </div>
          );

          const className =
            "flex flex-col p-3 font-semibold rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group";

          if (item.target === "_blank") {
            return (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={item.id} href={item.link} className={className}>
              {content}
            </Link>
          );
        })}

        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="p-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            </div>
          ))}
      </div>

      {hasMore && !customItems && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="text-primary text-sm font-medium hover:bg-primary/5 px-4 py-2 rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {items.length === 0 && !isLoading && !error && (
        <div className="col-span-full text-center py-10 text-gray-500">
          No items found.
        </div>
      )}
    </div>
  );
};
export default MegaMenuDropdown;
