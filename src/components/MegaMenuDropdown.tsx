"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { API_URL } from "@/libs/env";
import { FaChevronRight } from "react-icons/fa6";
import { useTranslations } from "next-intl";

interface MegaMenuProps {
  itemKey: string; // e.g. "GET_COLLEGES"
  locale: string;
  positionClass?: string;
}

interface MegaMenuItem {
  id: number;
  title: string;
  link: string; // Constructed link
  description?: string;
}

interface ApiResponse {
  data: any[];
  total: number;
}

const MegaMenuDropdown: React.FC<MegaMenuProps> = ({
  itemKey,
  locale,
  positionClass,
}) => {
  const t = useTranslations("Common");
  const [items, setItems] = useState<MegaMenuItem[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  // Determine API Endpoint based on key
  const getEndpoint = () => {
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

  const { data, error, isLoading } = useSWR<ApiResponse>(
    endpoint ? [`${API_URL}${endpoint}`, locale] : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (data?.data) {
      const mappedItems: MegaMenuItem[] = data.data.map((item: any) => {
        let title = item.title;
        let link = "#";

        if (itemKey === "GET_COLLEGES" || itemKey === "GET_INSTITUTES") {
          // Colleges structure
          // Assuming existing logic from CollegesClient: subdomains
          const subdomain = item.subdomain;
          link = subdomain ? `https://${subdomain}.epu.edu.iq/${locale}` : "#";
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
        };
      });

      setItems((prev) => {
        if (page === 1) return mappedItems;
        const existingIds = new Set(prev.map((i) => i.id));
        const newItems = mappedItems.filter((i) => !existingIds.has(i.id));
        return [...prev, ...newItems];
      });

      setHasMore(items.length + mappedItems.length < (data.total || 0));
    }
  }, [data, itemKey, locale, page]);

  // --- Smart Positioning Logic ---
  useEffect(() => {
    const adjustPosition = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newStyle: React.CSSProperties = {};

        // 1. Horizontal Overflow Detection
        // Default is usually aligned somewhat to left or right. We check if it goes off screen.

        // Reset left/right first to measure "natural" position if we want,
        // but here we are measuring where it rendered *with* the default classes.

        const overflowRight = rect.right > viewportWidth;
        const overflowLeft = rect.left < 0;

        if (overflowRight) {
          // If it overflows right, we anchor it to the right edge of the screen (with some margin)
          // OR we switch to scaling relative to parent.
          // Since we are absolute relative to parent, `right: 0` aligns with parent right edge.
          // We might need a negative right value if the parent is far left but the menu is huge.

          // Simple strategy: If slightly overflowing, shift it.
          // A more robust strategy for "Mega Menu" is often to center it on the screen
          // OR limit width. Our width is fixed 500px.

          // If standard "right:0" (rtl) or "left:0" (ltr) isn't enough, we might need manual offset.

          // Let's try attempting to center it if it's hitting an edge,
          // BUT keeping it `absolute` makes centering relative to viewport hard without `fixed`.

          // Strategy: If overflow Right, set `left: auto`, `right: 0`.
          // If that is still not enough (e.g. parent is far right), we might need negative right.
          if (rect.right > viewportWidth - 20) {
            const diff = rect.right - viewportWidth + 20;
            // We can't easily modify 'right' pixel value without knowing current computed 'right'.
            // Whatever, let's just force it to align right of parent if in LTR,
            // or shift it by translation.
            newStyle.transform = `translateX(-${diff}px)`;
          }
        }

        if (overflowLeft) {
          if (rect.left < 20) {
            const diff = 20 - rect.left;
            newStyle.transform = `translateX(${diff}px)`;
          }
        }

        // 2. Vertical Overflow / Max Height
        const spaceBelow = viewportHeight - rect.top - 20; // 20px buffer
        // Set max-height to fit in visible space, but at least some reasonable min (e.g. 200px)
        // If space is widely available, cap it at something reasonable (e.g. 80vh)
        const activeMaxHeight = Math.max(
          200,
          Math.min(spaceBelow, viewportHeight * 0.8),
        );
        newStyle.maxHeight = `${activeMaxHeight}px`;

        setStyle(newStyle);
      }
    };

    // Run on mount and resize
    adjustPosition();
    window.addEventListener("resize", adjustPosition);
    window.addEventListener("scroll", adjustPosition); // Scroll might change viewport relative position

    return () => {
      window.removeEventListener("resize", adjustPosition);
      window.removeEventListener("scroll", adjustPosition);
    };
  }, [items /* Re-calc if items change (though height is main factor) */]); // We assume it's always "open" if rendered

  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPage((p) => p + 1);
  };

  if (!endpoint) return null;
  // We can pass `isOpen` prop if we want to conditionally render inside, but usually parent handles it.

  return (
    <div
      ref={dropdownRef}
      style={style}
      className={`absolute ${positionClass || "top-full ltr:-left-10 rtl:-right-10 mt-2"} w-[500px] bg-white shadow-xl rounded-lg border border-gray-200 z-50 p-6 cursor-default overflow-y-auto transition-all duration-200`}
    >
      {/* Arrow - Hide if we have a custom transform maybe? Or just keep it. 
          If we shift the box, the arrow might detach from the trigger visually. 
          For now, let's hide arrow if we detect we are shifting significantly, OR just keep it. 
      */}
      {!positionClass && !style.transform && (
        <div className="absolute -top-2 ltr:left-16 rtl:right-16 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => {
          const isExternal =
            itemKey === "GET_COLLEGES" || itemKey === "GET_INSTITUTES";

          const content = (
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm text-gray-800 group-hover:text-primary line-clamp-2 leading-tight">
                {item.title}
              </span>
              <FaChevronRight className="text-xs text-gray-400 group-hover:text-primary flex-shrink-0 rtl:rotate-180" />
            </div>
          );

          const className =
            "flex flex-col p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group";

          if (isExternal) {
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

      {hasMore && (
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
        <div className="col-span-2 text-center py-10 text-gray-500">
          No items found.
        </div>
      )}
    </div>
  );
};
export default MegaMenuDropdown;
