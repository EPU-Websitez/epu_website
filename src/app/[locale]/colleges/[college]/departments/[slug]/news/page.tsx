// src/app/[locale]/colleges/[college]/departments/[slug]/news/page.tsx

"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import DepartmentHeader from "@/components/departmentHeader";
import NewsCard from "@/components/newsCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import useFetch from "@/libs/hooks/useFetch";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { FaChevronDown, FaXmark } from "react-icons/fa6";

// --- Interfaces ---
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}
interface CoverImage extends Image {}
interface GalleryItem {
  id: number;
  image: Image;
}
interface News {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  published_at: string | null;
  created_at: string | null;
  cover_image: CoverImage | null;
  gallery: GalleryItem[];
}
interface NewsResponse {
  total: number;
  page: number;
  limit: number;
  data: News[];
}
interface DateRange {
  from: string;
  to: string;
}
interface DatePickerProps {
  onDateChange: (dates: DateRange) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  selectedDates: DateRange;
}

// --- DatePicker Component ---
const DatePicker = ({
  onDateChange,
  isOpen,
  onToggle,
  selectedDates,
}: DatePickerProps) => {
  const t = useTranslations("Colleges");
  const [startDate, setStartDate] = useState(selectedDates.from || "");
  const [endDate, setEndDate] = useState(selectedDates.to || "");
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        onToggle(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleApply = () => {
    if (startDate && endDate) {
      onDateChange({ from: startDate, to: endDate });
      onToggle(false);
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    onDateChange({ from: "", to: "" });
    onToggle(false);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={datePickerRef}
      className="absolute top-full left-0 mt-2 bg-white border border-lightBorder rounded-xl shadow-lg p-4 z-50 min-w-[280px]"
    >
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t("from_date")}
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-lightBorder rounded-lg focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t("to_date")}
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="w-full px-3 py-2 border border-lightBorder rounded-lg focus:border-primary outline-none"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleClear}
            className="flex-1 px-3 py-2 text-sm border border-lightBorder rounded-lg hover:bg-gray-50"
          >
            {t("clear")}
          </button>
          <button
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t("apply")}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Skeleton Components ---
const NewsSkeleton = () => (
  <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 w-full gap-8">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
      </div>
    ))}
  </div>
);

const NavigationSkeleton = () => (
  <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
    {Array.from({ length: 7 }).map((_, i) => (
      <div
        key={i}
        className="lg:w-[250px] w-full h-[45px] bg-gray-300 animate-pulse rounded-xl"
      />
    ))}
  </div>
);

// --- Main Page Component ---
const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const slug = params?.slug as string;
  const college = params?.college as string;
  const locale = params?.locale as string;

  // --- State from URL ---
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSearch = searchParams.get("search") || "";
  const currentDates: DateRange = {
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
  };

  // --- Local UI State ---
  const [searchInputValue, setSearchInputValue] = useState(currentSearch);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [totalNews, setTotalNews] = useState(0);

  // --- Reactive API URL ---
  const newsApiUrl = useMemo(() => {
    if (!slug) return "";
    const urlParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: "8",
      department_slug: slug,
    });
    if (currentSearch) urlParams.append("search", currentSearch);
    if (currentDates.from) urlParams.append("date_from", currentDates.from);
    if (currentDates.to) urlParams.append("date_to", currentDates.to);
    return `${
      process.env.NEXT_PUBLIC_API_URL
    }/website/news?${urlParams.toString()}`;
  }, [currentPage, slug, currentSearch, currentDates]);

  // --- Data Fetching ---
  const { data: newsData, loading: newsLoading } = useFetch<NewsResponse>(
    newsApiUrl,
    locale
  );

  useEffect(() => {
    if (newsData?.data) {
      setTotalNews(newsData.total);
      if (currentPage === 1) {
        setAllNews(newsData.data);
      } else {
        setAllNews((prevNews) => {
          const newNews = newsData.data.filter(
            (n) => !prevNews.some((p) => p.id === n.id)
          );
          return [...prevNews, ...newNews];
        });
      }
    }
  }, [newsData, currentPage]); // Added currentPage dependency to reset on filter change

  // --- Handlers to Update URL ---
  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // Reset page to 1 on any filter change
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => updateUrlParams({ search: searchInputValue });
  const handleDateChange = (dates: DateRange) =>
    updateUrlParams({ from: dates.from, to: dates.to });
  const handleClearSearch = () => {
    setSearchInputValue("");
    updateUrlParams({ search: "" });
  };
  const clearAllFilters = () => router.replace(pathname, { scroll: false });
  const handleSeeMore = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", (currentPage + 1).toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // --- Helper Functions ---
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date unavailable";
    return new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const getNewsImage = (newsItem: News) => {
    return (
      newsItem.cover_image?.md ||
      newsItem.gallery?.[0]?.image?.md ||
      "/images/news.png"
    );
  };

  // --- Loading States ---
  const showInitialSkeleton = newsLoading && currentPage === 1;

  if (!slug || !college || !locale) {
    return (
      <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
        <div className="animate-pulse w-full h-[335px] bg-gray-200"></div>
        <div className="max-w-[1040px] flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
              <NavigationSkeleton />
              <div className="lg:border-l border-l-none lg:pl-10 w-full">
                <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mb-7"></div>
                <NewsSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader />
      <div className="max-w-[1040px] flex_start w-full">
        <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] lg:flex-row flex-col-reverse">
            {/* --- Left Navigation --- */}
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}`}
                title={t("about_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("about_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              {/* Other links... */}
              <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                <span>{t("news_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </div>
            </div>
            {/* --- Main Content --- */}
            <div className="lg:border-l border-l-none lg:border-b-0 border-b lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
              <SubHeader title={t("news_button")} alt={false} />

              {/* --- FILTER CONTROLS --- */}
              <div className="w-full flex_center gap-5">
                <div className="relative lg:w-[35%] sm:w-[40%] w-14 text-sm flex-shrink-0 sm:border-none border border-lightBorder sm:p-0 p-2 rounded-md">
                  <button
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="text-start sm:block hidden w-full sm:px-2 px-1 sm:py-2.5 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    {currentDates.from && currentDates.to
                      ? `${currentDates.from} to ${currentDates.to}`
                      : t("select_date")}
                  </button>
                  <CiCalendar
                    className="sm:hidden block text-2xl cursor-pointer"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  />
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown
                      className={`transition-transform ${
                        isDatePickerOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                  <DatePicker
                    isOpen={isDatePickerOpen}
                    onToggle={setIsDatePickerOpen}
                    onDateChange={handleDateChange}
                    selectedDates={currentDates}
                  />
                </div>
                <div className="relative w-full">
                  <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
                    <CiSearch />
                  </span>
                  <input
                    type="text"
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="sm:py-2 py-2.5 w-full border-lightBorder sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
                    placeholder={t("search")}
                  />
                  {searchInputValue && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute ltr:right-2 rtl:left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-secondary z-10"
                    >
                      <FaXmark />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="sm:px-6 px-2 flex-shrink-0 py-2 sm:rounded-xl rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  {t("search")}
                </button>
              </div>

              {/* --- NEWS LIST --- */}
              {showInitialSkeleton ? (
                <NewsSkeleton />
              ) : allNews.length > 0 ? (
                <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 w-full gap-8">
                  {allNews.map((newsItem) => (
                    <NewsCard
                      key={newsItem.id}
                      image={getNewsImage(newsItem)}
                      link={`/${locale}/news/${newsItem.slug}`}
                      author={newsItem.author}
                      createdAt={formatDate(
                        newsItem.published_at || newsItem.created_at
                      )}
                      description={newsItem.excerpt}
                      title={newsItem.title}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center w-full py-10">
                  <p className="text-gray-500 text-lg">{t("no_news_found")}</p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    {t("clear")}
                  </button>
                </div>
              )}

              {/* --- 'SEE MORE' BUTTON --- */}
              {!showInitialSkeleton && allNews.length < totalNews && (
                <div className="flex_center w-full mt-8">
                  <button
                    onClick={handleSeeMore}
                    disabled={newsLoading}
                    className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
                  >
                    {newsLoading ? t("loading") : t("see_more")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
