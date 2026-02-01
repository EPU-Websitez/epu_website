"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import useFetch from "@/libs/hooks/useFetch";
import NewsCard from "@/components/newsCard";
import DirectorateHeader from "@/components/DirectorateHeader";
import DirectorateSidebar from "@/components/DirectorateSidebar";
import SubUnits from "@/components/SubUnits";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { FaChevronDown, FaXmark } from "react-icons/fa6";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}
interface NewsItem {
  id: number;
  slug: string;
  title: string;
  author: string;
  published_at: string;
  excerpt: string;
  cover_image: ImageFile;
}
interface NewsResponse {
  total: number;
  data: NewsItem[];
}
interface DirectorateParentInfo {
  id: number;
  title: string;
  parent_id: number | null;
  parent?: { slug: string };
  directorate_type: { name: string };
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

// -------- Skeleton Component --------
const ContentSkeleton = () => (
  <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse animate-pulse">
    <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-[250px] w-full">
      <div className="h-12 bg-gray-200 rounded-3xl"></div>
      <div className="h-12 bg-gray-200 rounded-3xl"></div>
      <div className="h-12 bg-gray-200 rounded-3xl"></div>
      <div className="h-12 bg-gray-200 rounded-3xl"></div>
    </div>
    <div className="lg:border-l border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
      <div className="h-10 w-1/3 bg-gray-200 rounded-full"></div>
      <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 w-full gap-8">
        <div className="h-40 w-full bg-gray-200 rounded-3xl"></div>
        <div className="h-40 w-full bg-gray-200 rounded-3xl"></div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Directorate");
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const locale = params?.locale as string;
  const id = params?.id as string;
  const parentId = searchParams.get("parent_id");

  // --- State from URL ---
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSearch = searchParams.get("search") || "";
  const currentDates: DateRange = {
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
  };

  // --- Local UI State ---
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [totalNews, setTotalNews] = useState(0);
  const [searchInputValue, setSearchInputValue] = useState(currentSearch);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // --- Data Fetching ---
  const { data: directorateInfo, loading: directorateLoading } =
    useFetch<DirectorateParentInfo>(
      id ? `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}` : "",
      locale,
    );

  const newsApiUrl = useMemo(() => {
    if (!id) return "";
    const urlParams = new URLSearchParams({
      directorate_slug: id,
      page: currentPage.toString(),
      limit: "10",
    });
    if (currentSearch) urlParams.append("search", currentSearch);
    if (currentDates.from) urlParams.append("date_from", currentDates.from);
    if (currentDates.to) urlParams.append("date_to", currentDates.to);
    return `${
      process.env.NEXT_PUBLIC_API_URL
    }/website/news?${urlParams.toString()}`;
  }, [id, currentPage, currentSearch, currentDates]);

  const { data: newsData, loading: newsLoading } = useFetch<NewsResponse>(
    newsApiUrl,
    locale,
  );

  const isInitialLoading =
    (directorateLoading || newsLoading) && currentPage === 1;

  // --- Handlers to Update URL ---
  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      value ? params.set(key, value) : params.delete(key);
    });
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
  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("from");
    params.delete("to");
    params.delete("page");
    // Preserve parent_id if it exists
    const currentParentId = searchParams.get("parent_id");
    if (currentParentId) {
      params.set("parent_id", currentParentId);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const handleSeeMore = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", (currentPage + 1).toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // --- Data Aggregation ---
  useEffect(() => {
    if (newsData?.data) {
      setTotalNews(newsData.total);
      if (currentPage === 1) {
        setNewsList(newsData.data);
      } else {
        setNewsList((prev) => [...prev, ...newsData.data]);
      }
    } else if (currentPage === 1) {
      setNewsList([]);
    }
  }, [newsData, currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const parentTitle = directorateInfo?.title || "";

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        {!isInitialLoading && <SubHeader title={parentTitle} alt={false} />}
        <DirectorateHeader />

        {!isInitialLoading && (
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
        )}

        <div className="flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            {isInitialLoading ? (
              <ContentSkeleton />
            ) : (
              <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
                <DirectorateSidebar
                  activeTab="news"
                  id={id}
                  parentId={parentId}
                  hasParent={!!directorateInfo?.parent}
                  isLoading={directorateLoading}
                />
                <div className="lg:border-l text-secondary border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                  <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
                    <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                    <span className="z-10 relative">{t("news")}</span>
                  </h2>
                  <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 w-full gap-8">
                    {newsList.length > 0 ? (
                      newsList.map((newsItem) => (
                        <NewsCard
                          key={newsItem.id}
                          image={newsItem.cover_image?.lg}
                          link={`/${locale}/news/${newsItem.slug}`}
                          author={newsItem.author}
                          createdAt={formatDate(newsItem.published_at)}
                          description={newsItem.excerpt}
                          title={newsItem.title}
                        />
                      ))
                    ) : (
                      <div className="text-center py-10 w-full col-span-full">
                        <p className="text-gray-500">{t("no_data_found")}</p>
                        {(searchInputValue || currentDates.from) && (
                          <button
                            onClick={clearAllFilters}
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                          >
                            {t("clear")}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {newsList.length < totalNews && (
                    <div className="w-full flex_center mt-4">
                      <button
                        onClick={handleSeeMore}
                        disabled={newsLoading}
                        className="bg-primary text-white px-6 py-2 rounded-full disabled:bg-opacity-70"
                      >
                        {newsLoading ? t("loading") : t("see_more")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
