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
  const limit = 9;
  const [hasMore, setHasMore] = useState(false);

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

  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPage((p) => p + 1);
  };

  if (!endpoint) return null;

  return (
    <div
      className={`absolute ${positionClass || "top-full ltr:-left-10 rtl:-right-10 mt-2"} w-[500px] bg-white shadow-xl rounded-lg border border-gray-200 z-50 p-6 cursor-default max-h-[60vh] overflow-y-auto`}
    >
      {/* Arrow */}
      {!positionClass && (
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

      {data?.total === 0 && !isLoading && !error && (
        <div className="col-span-2 text-center py-10 text-gray-500">
          No items found.
        </div>
      )}
    </div>
  );
};
export default MegaMenuDropdown;
