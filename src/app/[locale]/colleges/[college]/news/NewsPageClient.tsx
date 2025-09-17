// src/app/[locale]/colleges/[college]/news/NewsPageClient.tsx

"use client";

import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import NewsCard from "@/components/newsCard";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { FaChevronDown, FaXmark } from "react-icons/fa6";
import { useState, useRef, useEffect, useMemo } from "react";

// --- (Interfaces, DatePicker, and Skeletons remain unchanged) ---
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
  created_at: string;
  updated_at: string;
}
interface Gallery {
  id: number;
  news_id: number;
  image_id: number;
  created_at: string;
  updated_at: string;
  Image: Image;
}
interface cover_image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
  created_at: string;
  updated_at: string;
}
interface News {
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
  data: News[];
}
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  newsCount: number;
}
interface CategoryResponse {
  total: number;
  page: number;
  limit: number;
  data: Category[];
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
            {"apply"}
          </button>
        </div>
      </div>
    </div>
  );
};
const NewsSkeleton = () => (
  <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
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
const CategoriesSkeleton = () => (
  <div className="flex_start w-full sm:gap-5 gap-2 flex-wrap">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="animate-pulse h-8 bg-gray-300 rounded-3xl px-4 py-1 w-20"
      ></div>
    ))}
  </div>
);
// ---

const NewsPageClient = () => {
  const t = useTranslations("Colleges");

  // Hooks for URL management
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const locale = params?.locale as string;
  const college = params?.college as string;

  // --- Read state from URL or set defaults ---
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSearch = searchParams.get("search") || "";
  // --- CHANGE: Read 'category_id' from URL ---
  const currentCategory = searchParams.get("category_slug") || "all";
  const currentDates: DateRange = {
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
  };

  // State for the search input field itself
  const [searchInputValue, setSearchInputValue] = useState(currentSearch);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [totalNews, setTotalNews] = useState<number>(0);

  // Fetch categories
  const { data: categoriesData, loading: categoriesLoading } =
    useFetch<CategoryResponse>(
      `${API_URL}/website/news/categories/list`,
      locale
    );

  const newsApiUrl = useMemo(() => {
    if (!college) return "";
    const urlParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: "8",
      college_slug: college,
    });
    if (currentSearch) urlParams.append("search", currentSearch);
    if (currentDates.from) urlParams.append("date_from", currentDates.from);
    if (currentDates.to) urlParams.append("date_to", currentDates.to);
    // --- CHANGE: Append 'category_id' to the API call ---
    if (currentCategory !== "all")
      urlParams.append("category_slug", currentCategory);

    return `${API_URL}/website/news?${urlParams.toString()}`;
  }, [currentPage, college, currentSearch, currentDates, currentCategory]);

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
  }, [newsData]);

  // --- Handlers now update the URL, which triggers a re-render and data fetch ---
  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete("page");
    // --- CHANGE: Added { scroll: false } to prevent scrolling to top ---
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => updateUrlParams({ search: searchInputValue });

  const handleDateChange = (dates: DateRange) =>
    updateUrlParams({ from: dates.from, to: dates.to });

  // --- CHANGE: Logic updated to use 'category_id' ---
  const handleCategoryChange = (slug: string) =>
    updateUrlParams({ category_slug: slug === "all" ? "" : slug });

  const clearAllFilters = () => router.replace(pathname, { scroll: false }); // --- CHANGE: Added { scroll: false }

  const handleSeeMore = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", (currentPage + 1).toString());
    // --- CHANGE: Added { scroll: false } ---
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const handleClearSearch = () => {
    setSearchInputValue("");
    updateUrlParams({ search: "" });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getNewsImage = (news: News) => {
    return news.cover_image?.md || "/images/news.png";
  };

  const showInitialSkeleton = newsLoading && currentPage === 1;

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full sm:mt-14 mt-10">
        <SubHeader title={t("news")} alt={false} />

        {/* --- FILTER CONTROLS --- */}
        <div className="w-full flex_center gap-5">
          {/* ... Date Picker ... */}
          <div className="relative lg:w-[25%] sm:w-[33%] w-14 text-sm flex-shrink-0 sm:border-none border border-lightBorder sm:p-0 p-2 rounded-md">
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
          {/* ... Search Input ... */}
          <div className="relative w-full">
            <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
              <CiSearch />
            </span>
            <input
              type="text"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="py-2 w-full border-lightBorder sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
              placeholder={t("search_research")}
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
        {/* ... Categories ... */}
        {categoriesLoading ? (
          <CategoriesSkeleton />
        ) : (
          <div className="flex_start w-full sm:gap-5 gap-2 flex-wrap">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`border py-1 px-4 sm:rounded-3xl rounded-lg sm:text-base text-sm transition-colors ${
                currentCategory === "all"
                  ? "bg-golden text-white"
                  : "border-golden text-golden hover:bg-golden hover:text-white"
              }`}
            >
              All
            </button>
            {categoriesData?.data
              ?.filter((category) => category.is_active)
              ?.sort((a, b) => a.priority - b.priority)
              ?.map((category) => (
                <button
                  // --- CHANGE: Pass category.id and check against category.id ---
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`border py-1 px-4 sm:rounded-3xl rounded-lg sm:text-base text-sm transition-colors ${
                    currentCategory === category.slug
                      ? "bg-golden text-white"
                      : "border-golden text-golden hover:bg-golden hover:text-white"
                  }`}
                  title={category.description}
                >
                  {category.name}
                </button>
              ))}
          </div>
        )}

        {/* --- NEWS LIST --- */}
        {showInitialSkeleton ? (
          <NewsSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
            {allNews.length > 0 ? (
              allNews.map((news) => (
                <NewsCard
                  key={news.id}
                  image={getNewsImage(news)}
                  link={`/news/${news.slug}`}
                  author={news.author}
                  createdAt={formatDate(news.published_at)}
                  description={news.excerpt}
                  title={news.title}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-gray-500 text-lg">
                  No news found matching your criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
        {/* --- 'SEE MORE' BUTTON --- */}
        {!showInitialSkeleton && allNews.length < totalNews && (
          <div className="w-full flex_center mt-8">
            <button
              onClick={handleSeeMore}
              disabled={newsLoading}
              className="border border-primary text-primary px-8 py-2 rounded-md hover:bg-primary hover:text-white transition-colors disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-wait"
            >
              {newsLoading && currentPage > 1
                ? `${t("search")}...`
                : t("see_more")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPageClient;
