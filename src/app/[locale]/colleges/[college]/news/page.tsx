"use client";

import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import NewsCard from "@/components/newsCard";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";

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

interface CoverImage {
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
  CoverImage: CoverImage;
}

interface NewsResponse {
  total: number;
  page: number;
  limit: number;
  data: News[];
}

interface Category {
  id: number;
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

// Date Picker Component Types
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
          <label className="block text-xs text-gray-600 mb-1">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-lightBorder rounded-lg focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">To Date</label>
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
            Clear
          </button>
          <button
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

// Skeleton Components
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

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;

  // State management
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<DateRange>({
    from: "",
    to: "",
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch categories
  const { data: categoriesData, loading: categoriesLoading } =
    useFetch<CategoryResponse>(`${API_URL}/website/news/categories`);

  // Build API URL with filters
  const buildApiUrl = () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "20",
      collegeSlug: college,
    });

    if (appliedSearchQuery.trim()) {
      params.append("search", appliedSearchQuery.trim());
    }

    if (selectedDates.from) {
      params.append("date_from", selectedDates.from);
    }

    if (selectedDates.to) {
      params.append("date_to", selectedDates.to);
    }

    if (selectedCategory !== "all") {
      params.append("categorySlug", selectedCategory);
    }

    return `${API_URL}/website/colleges/${college}/news?${params.toString()}`;
  };

  // Fetch news data
  const {
    data: newsData,
    loading: newsLoading,
    refetch,
  } = useFetch<NewsResponse>(buildApiUrl());

  // Handle search - only when button is clicked
  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery);
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  // Handle date change
  const handleDateChange = (dates: DateRange) => {
    setSelectedDates(dates);
    setCurrentPage(1);
    // Auto-refetch when dates change
    setTimeout(() => refetch(), 100);
  };

  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  // Handle Enter key in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get image with fallback logic
  const getNewsImage = (news: News) => {
    return (
      news.CoverImage?.md ||
      news.CoverImage?.lg ||
      news.CoverImage?.original ||
      news.Gallery?.[0]?.Image?.md ||
      news.Gallery?.[0]?.Image?.lg ||
      news.Gallery?.[0]?.Image?.original ||
      "/images/news.png"
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setAppliedSearchQuery("");
    setSelectedDates({ from: "", to: "" });
    setSelectedCategory("all");
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full sm:mt-14 mt-10">
        <SubHeader title={t("news")} alt={false} />

        {/* Search and Filter Section */}
        <div className="w-full flex_center gap-5">
          {/* Date Picker */}
          <div className="relative lg:w-[20%] sm:w-[33%] w-14 text-sm flex-shrink-0 sm:border-none border border-lightBorder sm:p-0 p-2 rounded-md">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="text-start sm:block hidden w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
            >
              {selectedDates.from && selectedDates.to
                ? `${selectedDates.from} to ${selectedDates.to}`
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
              selectedDates={selectedDates}
            />
          </div>

          {/* Search Input */}
          <div className="relative w-full">
            <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
              <CiSearch />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="py-2 w-full border-lightBorder sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
              placeholder={t("search_research")}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="sm:px-6 px-2 flex-shrink-0 py-2 sm:rounded-xl rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            {t("search")}
          </button>
        </div>

        {/* Category Filter */}
        {categoriesLoading ? (
          <CategoriesSkeleton />
        ) : (
          <div className="flex_start w-full sm:gap-5 gap-2 flex-wrap">
            {/* All Categories Button */}
            <button
              onClick={() => handleCategoryChange("all")}
              className={`border py-1 px-4 sm:rounded-3xl rounded-lg sm:text-base text-sm transition-colors ${
                selectedCategory === "all"
                  ? "bg-golden text-white"
                  : "border-golden text-golden hover:bg-golden hover:text-white"
              }`}
            >
              All
            </button>

            {/* Dynamic Categories */}
            {categoriesData?.data
              ?.filter((category) => category.is_active)
              ?.sort((a, b) => a.priority - b.priority)
              ?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`border py-1 px-4 sm:rounded-3xl rounded-lg sm:text-base text-sm transition-colors ${
                    selectedCategory === category.slug
                      ? "bg-golden text-white"
                      : "border-golden text-golden hover:bg-golden hover:text-white"
                  }`}
                  title={category.description}
                >
                  {category.name}
                  {/* {category.newsCount > 0 && (
                    <span className="ml-1 text-xs opacity-75">
                      ({category.newsCount})
                    </span>
                  )} */}
                </button>
              ))}
          </div>
        )}

        {/* Results Info */}
        {/* {!newsLoading && newsData && (
          <div className="text-sm text-gray-600">
            Showing {newsData.data.length} of {newsData.total} results
            {appliedSearchQuery && ` for "${appliedSearchQuery}"`}
            {selectedCategory !== "all" && (
              <span>
                {" "}
                in category "
                {categoriesData?.data?.find(
                  (cat) => cat.slug === selectedCategory
                )?.name || selectedCategory}
                "
              </span>
            )}
            {(selectedDates.from || selectedDates.to) &&
              " in selected date range"}
          </div>
        )} */}

        {/* News Section */}
        {newsLoading ? (
          <NewsSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
            {newsData?.data && newsData.data.length > 0 ? (
              newsData.data.map((news, i) => (
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

        {/* Pagination */}
        {newsData && newsData.total > 20 && (
          <div className="flex_center gap-2 mt-8">
            {Array.from(
              { length: Math.ceil(newsData.total / 20) },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  setTimeout(() => refetch(), 100);
                }}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "border border-lightBorder hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
