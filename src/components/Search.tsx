"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CiSearch,
  CiPaperplane,
  CiCalendar,
  CiShop,
  CiBank,
} from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { API_URL } from "@/libs/env";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

// -------- Helper Hook for Debouncing --------
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

// -------- Interfaces for API Response --------
interface ImageInfo {
  lg: string;
  original: string;
}

interface SearchResult {
  id: number;
  type: string;
  title: string;
  slug: string;
  description: string;
  image?: ImageInfo | null;
  organization?: {
    name: string;
  };
}

// Data shape when type=all
interface SearchResponseData {
  news?: SearchResult[];
  events?: SearchResult[];
  centers?: SearchResult[];
  departments?: SearchResult[];
  colleges?: SearchResult[];
  institutes?: SearchResult[];
  directorates?: SearchResult[];
  laboratories?: SearchResult[];
}

// Top-level response. `data` can be an object or an array.
interface GlobalSearchResponse {
  total: number;
  data: SearchResponseData | SearchResult[];
}

// -------- Type Definitions --------
type SearchTab =
  | "all"
  | "news"
  | "event"
  | "department"
  | "center"
  | "college"
  | "institute"
  | "directorate"
  | "laboratory";

const TABS: { key: SearchTab; icon: React.ElementType }[] = [
  { key: "all", icon: CiSearch },
  { key: "news", icon: CiPaperplane },
  { key: "event", icon: CiCalendar },
  // { key: "department", icon: CiShop },
  { key: "center", icon: CiBank },
  { key: "college", icon: CiBank },
  { key: "institute", icon: CiBank },
  { key: "directorate", icon: CiBank },
  // { key: "laboratory", icon: CiBank },
];

const SearchModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const t = useTranslations("Search");
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [results, setResults] = useState<SearchResponseData>({});
  const [pages, setPages] = useState<Record<string, number>>({});
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const fetchResults = useCallback(
    async (term: string, tab: SearchTab, page = 1, loadMore = false) => {
      if (!term.trim()) {
        setResults({});
        return;
      }

      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const limit = tab === "all" ? 5 : 10;
      const url = `${API_URL}/website/global-search?search=${term}&type=${tab}&page=${page}&limit=${limit}`;

      try {
        const response = await fetch(url, {
          headers: { "website-language": locale },
        });
        const apiResponse: GlobalSearchResponse = await response.json();

        if (tab === "all") {
          const newResults = (apiResponse.data as SearchResponseData) || {};
          setResults(
            loadMore ? (prev) => ({ ...prev, ...newResults }) : newResults
          );
        } else {
          const newItems = (
            Array.isArray(apiResponse.data) ? apiResponse.data : []
          ) as SearchResult[];
          const pluralKey = (
            tab === "news" ? "news" : `${tab}s`
          ) as keyof SearchResponseData;

          if (loadMore) {
            setResults((prev) => ({
              ...prev,
              [pluralKey]: [...(prev[pluralKey] || []), ...newItems],
            }));
          } else {
            setResults({ [pluralKey]: newItems });
          }
        }

        setTotals((prev) => ({ ...prev, [tab]: apiResponse.total }));
        setPages((prev) => ({ ...prev, [tab]: page }));
      } catch (error) {
        console.error("Search failed:", error);
        setResults({});
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [locale]
  );

  useEffect(() => {
    fetchResults(debouncedSearchTerm, activeTab, 1);
  }, [debouncedSearchTerm, activeTab, fetchResults]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoadMore = () => {
    const nextPage = (pages[activeTab] || 1) + 1;
    fetchResults(debouncedSearchTerm, activeTab, nextPage, true);
  };

  const hasResults = Object.values(results).some(
    (arr) => arr && arr.length > 0
  );

  const pluralActiveTabKey = (
    activeTab === "news" ? "news" : `${activeTab}s`
  ) as keyof SearchResponseData;
  const currentResultsForTab = results[pluralActiveTabKey] || [];
  const canLoadMore =
    activeTab !== "all" &&
    currentResultsForTab.length < (totals[activeTab] || 0);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-start p-4 pt-[10vh]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col min-h-[50vh] max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center p-4 border-b border-lightBorder">
          <CiSearch className="text-lightText text-2xl flex-shrink-0" />
          <input
            type="text"
            placeholder={t("search")}
            className="w-full bg-transparent px-4 lg:text-lg text-sm focus:outline-none text-secondary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary"
            aria-label="Close search"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex-shrink-0 border-b border-lightBorder px-2 sm:px-4">
          <nav className="flex space-x-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center flex-shrink-0 gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-secondary hover:text-zinc-800"
                }`}
              >
                {t(tab.key)}
              </button>
            ))}
          </nav>
        </div>

        <div className="overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <CgSpinner className="animate-spin text-primary text-4xl" />
            </div>
          ) : !hasResults && debouncedSearchTerm ? (
            <div className="text-center py-10">
              <p className="text-lightText">{t("no_result")}</p>
            </div>
          ) : !debouncedSearchTerm ? (
            <div className="text-center py-10">
              <p className="text-lightText">{t("start_search")}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(results).map(([type, items]) =>
                items && items.length > 0 ? (
                  <div key={type}>
                    <h2 className="text-xs font-semibold text-secondary tracking-wider mb-3 capitalize">
                      {type}
                    </h2>
                    {activeTab === "college" || activeTab === "institute" ? (
                      <div className="space-y-2">
                        {items.map((item: SearchResult) => {
                          const collegeUrl = `https://${item.slug}.epu.edu.iq/${locale}`;
                          return (
                            <a
                              href={collegeUrl}
                              title={item.title ?? ""}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={`${item.type}-${item.id}`}
                              onClick={onClose}
                              className="block group"
                            >
                              <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-zinc-100 transition-colors">
                                <div>
                                  <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">
                                    {item.title}
                                  </h3>
                                  <p className="text-sm text-black opacity-70 line-clamp-1">
                                    {item.organization?.name || ""}
                                  </p>
                                </div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {items.map((item: SearchResult) => (
                          <Link
                            href={`/${locale}/${item.type}/${item.slug}`}
                            key={`${item.type}-${item.id}`}
                            onClick={onClose}
                            className="block group"
                          >
                            <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-zinc-100 transition-colors">
                              <div>
                                <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-black opacity-70 line-clamp-1">
                                  {item.organization?.name || ""}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null
              )}

              {canLoadMore && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoadingMore ? (
                      <CgSpinner className="animate-spin text-lg" />
                    ) : (
                      t("see_more")
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
