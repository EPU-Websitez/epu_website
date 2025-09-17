"use client";

import CenterHeader from "@/components/CenterHeader";
import NewsCard from "@/components/newsCard";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useEffect, useState, useMemo, useRef } from "react";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { FaChevronDown, FaXmark } from "react-icons/fa6";
import InternationalRelationsHeader from "@/components/InternationalRelationsHeader";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

// --- Interfaces ---
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}
interface cover_image extends Image {}
interface Gallery {
  id: number;
  Image: Image;
}
interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  cover_image_id: number;
  Gallery: Gallery[];
  cover_image: cover_image;
}
interface NewsResponse {
  total: number;
  page: number;
  limit: number;
  data: NewsItem[];
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

const Page = () => {
  const t = useTranslations("International");
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get 'id' from the query string, e.g., .../directory-structure?id=2
  const id = searchParams.get("id");

  const locale = params?.locale as string;
  const slug = params?.slug as string;

  // --- State from URL ---
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSearch = searchParams.get("search") || "";
  const currentDates: DateRange = {
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
  };

  // --- Local UI State ---
  const [centers, setCenters] = useState<NewsItem[]>([]);
  const [searchInputValue, setSearchInputValue] = useState(currentSearch);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [totalNews, setTotalNews] = useState(0);

  // --- Reactive API URL ---
  const apiUrl = useMemo(() => {
    if (!id) return "";
    const urlParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: "12",
      international_relations_id: id,
    });
    if (currentSearch) urlParams.append("search", currentSearch);
    if (currentDates.from) urlParams.append("date_from", currentDates.from);
    if (currentDates.to) urlParams.append("date_to", currentDates.to);
    return `${API_URL}/website/news?${urlParams.toString()}`;
  }, [id, currentPage, currentSearch, currentDates]);

  // --- Data Fetching ---
  const { data, loading } = useFetch<NewsResponse>(apiUrl, locale);
  const isInitialLoading = loading && currentPage === 1;

  // --- Handlers to Update URL ---
  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      value ? params.set(key, value) : params.delete(key);
    });
    params.delete("page"); // Reset page on filter change
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

  // --- Data aggregation ---
  useEffect(() => {
    if (data?.data) {
      setTotalNews(data.total);
      if (currentPage === 1) {
        setCenters(data.data);
      } else {
        setCenters((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const unique = data.data.filter((d) => !ids.has(d.id));
          return [...prev, ...unique];
        });
      }
    }
  }, [data, currentPage]);

  // --- Helper Functions ---
  const getNewsImage = (news: NewsItem) => {
    return (
      news.cover_image?.md || news.Gallery?.[0]?.Image?.md || "/images/news.png"
    );
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full flex justify-center items-start sm:my-10 my-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <InternationalRelationsHeader />

        {/* --- FILTER CONTROLS --- */}
        <div className="w-full flex_center gap-5 md:w-[720px] mt-8">
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
                aria-label="Clear search"
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

        {/* News Section */}
        <div className="flex_start w-full flex-col gap-10">
          <h2 className="md:text-3xl relative text-lg font-semibold ">
            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
            <span className="z-10 relative">{t("news")}</span>
          </h2>

          {isInitialLoading ? (
            <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-gray-100 animate-pulse w-full h-[300px] flex flex-col"
                >
                  <div className="w-full h-40 bg-gray-300 rounded-t-lg" />
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : centers.length > 0 ? (
            <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8">
              {centers.map((item) => (
                <NewsCard
                  key={item.id}
                  image={getNewsImage(item)}
                  link={`/${locale}/news/${item.slug}`}
                  title={item.title}
                  description={item.excerpt}
                  createdAt={formatDate(item.published_at)}
                  author={item.author}
                />
              ))}
            </div>
          ) : (
            <div className="text-center w-full py-10 col-span-2">
              <p className="text-gray-500 text-lg">{t("no_news_found")}</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                {t("clear")}
              </button>
            </div>
          )}
        </div>

        {!isInitialLoading && centers.length < totalNews && (
          <div className="flex_center w-full my-5">
            <button
              onClick={handleSeeMore}
              disabled={loading}
              className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? t("loading") : t("see_more")}
            </button>
          </div>
        )}
        <div className="sm:hidden flex justify-start items-start flex-col gap-4 flex-shrink-0 w-full">
          <Link
            href={`/${locale}/international-relations?id=${id}`}
            title={t("about")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("about")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations?id=${id}`}
            title={t("directory_structure")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("directory_structure")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <div className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
            <span>{t("news")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </div>
          <Link
            href={`/${locale}/international-relations/office-staff?id=${id}`}
            title={t("office_staff")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("office_staff")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          {/* <Link
              href={`/${locale}/international-relations/contact?id=${id}`}
              title={t("contact")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("contact")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
