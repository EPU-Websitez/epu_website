"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import Link from "next/link";
import { FaChevronDown, FaXmark } from "react-icons/fa6";
import { LuArrowRight } from "react-icons/lu";
import { CiCalendar, CiSearch } from "react-icons/ci";
import NewsCard from "@/components/newsCard";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// --- INTERFACE DEFINITIONS ---
interface ImageFile {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}
interface Gallery {
  id: number;
  image: ImageFile;
}
interface News {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  published_at: string;
  cover_image: ImageFile;
  gallery: Gallery[];
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
  priority: number;
  is_active: boolean;
}
interface CategoryResponse {
  total: number;
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

// --- REUSABLE COMPONENTS ---
const DatePicker = ({
  onDateChange,
  isOpen,
  onToggle,
  selectedDates,
}: DatePickerProps) => {
  const t = useTranslations("News");
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
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            {t("clear")}
          </button>
          <button
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300"
          >
            {t("apply")}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SKELETON COMPONENTS ---
const SliderSkeleton = () => (
  <div className="w-full md:h-[470px] h-[220px] bg-gray-300 animate-pulse relative">
    <div className="lg:top-20 md:top-10 top-5 lg:left-32 md:left-14 left-6 absolute flex_start flex-col gap-5">
      <div className="h-10 w-48 bg-gray-400 rounded-3xl"></div>
      <div className="h-6 md:w-[625px] w-72 bg-gray-400 rounded-lg"></div>
      <div className="h-5 md:w-[580px] w-64 bg-gray-400 rounded-lg"></div>
      <div className="h-6 w-32 bg-gray-400 rounded-lg mt-2"></div>
    </div>
  </div>
);

const NewsListSkeleton = () => (
  <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8">
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

// --- MAIN CLIENT COMPONENT ---
const NewsClient = () => {
  const t = useTranslations("News");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const swiperRef = useRef<SwiperCore>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for UI elements
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [totalNews, setTotalNews] = useState<number>(0);
  const [isAppending, setIsAppending] = useState<boolean>(false);

  // --- Derived values from URL ---
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentCategory = searchParams.get("category_slug") || "all";
  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tag") || ""; // <<< NEW: Get tag from URL
  const currentDates: DateRange = {
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
  };

  // --- Data Fetching ---
  const { data: sliderData, loading: sliderLoading } = useFetch<NewsResponse>(
    `${API_URL}/website/news?limit=10&page=1`,
    locale
  );

  const { data: categoriesData, loading: categoriesLoading } =
    useFetch<CategoryResponse>(
      `${API_URL}/website/news/categories/list`,
      locale
    );

  // --- UPDATED: API URL now automatically includes any existing search params (including tag) ---
  const newsApiUrl = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", currentPage.toString());
    params.set("limit", "4");
    return `${API_URL}/website/news?${params.toString()}`;
  }, [searchParams, currentPage]);

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
        // Prevent duplicate items on "See More"
        setAllNews((prevNews) => {
          const existingIds = new Set(prevNews.map((n) => n.id));
          const newItems = newsData.data.filter((n) => !existingIds.has(n.id));
          return [...prevNews, ...newItems];
        });
      }
      setIsAppending(false);
    }
  }, [newsData, currentPage]);

  const updateUrlParams = (newParams: Record<string, string | number>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, String(value));
      } else {
        current.delete(key);
      }
    });
    // Always reset to page 1 when any filter changes
    current.set("page", "1");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const handleSearch = () => updateUrlParams({ search: searchQuery });
  const handleDateChange = (dates: DateRange) =>
    updateUrlParams({ from: dates.from, to: dates.to });
  const handleCategoryChange = (slug: string) =>
    updateUrlParams({ category_slug: slug === "all" ? "" : slug });

  // <<< NEW: Handler to clear the tag filter
  const handleClearTag = () => updateUrlParams({ tag: "" });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSeeMore = () => {
    setIsAppending(true);
    const nextPage = currentPage + 1;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", nextPage.toString());
    const search = current.toString();
    // Use router.push with scroll: false to prevent jumping to top
    router.push(`${pathname}?${search}`, { scroll: false });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    updateUrlParams({ search: "" });
  };
  const clearAllFilters = () => router.push(pathname);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getNewsImage = (news: News) =>
    news.cover_image?.md ||
    news.cover_image?.lg ||
    news.cover_image?.original ||
    "/images/placeholder.svg";

  const showInitialSkeleton = newsLoading && currentPage === 1;

  return (
    <div className="my-10 flex_center w-full flex-col gap-10">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8 lg:px-0 px-3">
        <SubHeader title={t("head")} alt={false} />
      </div>

      <div className="w-full relative">
        {sliderLoading ? (
          <SliderSkeleton />
        ) : (
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={sliderData?.data && sliderData.data.length > 1}
            onBeforeInit={(swiper) => (swiperRef.current = swiper)}
          >
            {sliderData?.data?.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="w-full md:h-[470px] h-[220px] relative">
                  <Image
                    src={getNewsImage(slide)}
                    alt={slide.title}
                    fill
                    priority
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute left-0 top-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-[#1b417bc7] to-transparent w-full h-full"></div>

                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className="max-w-[1042px] mx-auto w-full h-full sm:flex sm:items-start sm:justify-start flex items-start">
                      <div className="lg:mt-20 md:mt-10 mt-5 lg:px-0 px-3 flex_start flex-col gap-5">
                        <div className="flex_center gap-3 bg-golden text-white px-4 py-2 rounded-3xl">
                          <span className="w-3 h-3 rounded-full flex-shrink-0 bg-white"></span>
                          <p className="font-semibold md:text-base text-xs">
                            {t("most_viewed_news")}
                          </p>
                        </div>
                        <h3 className="lg:text-[26px] md:text-smallTitle text-sm md:max-w-[625px] max-w-full md:px-0 px-3 text-white text-opacity-90">
                          {slide.title}
                        </h3>
                        <Link
                          href={`/${locale}/news/${slide.slug}`}
                          title={slide.title}
                          className="border-b border-b-white text-white flex_center gap-3 pointer-events-auto"
                        >
                          <p className="md:text-base text-xs">
                            {t("see_details")}
                          </p>
                          <LuArrowRight className="md:text-xl text-base rtl:rotate-180" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="max-w-[1040px] w-full text-secondary flex_start flex-col gap-8 mt-10 lg:px-0 px-3">
        <div className="w-full flex_center gap-5">
          <h1 className="md:text-titleNormal text-base font-semibold flex-shrink-0">
            {t("release_news")}
          </h1>
          <span className="w-full h-1 bg-golden"></span>
        </div>
        <div className="w-full flex_center gap-5">
          <div className="relative lg:w-[20%] sm:w-[33%] w-14 text-sm flex-shrink-0">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="text-start sm:block hidden w-full px-4 py-2.5 border border-lightBorder bg-lightBorder bg-opacity-50 rounded-xl text-gray-500 focus:border-primary outline-none"
            >
              {currentDates.from && currentDates.to
                ? `${formatDate(currentDates.from)} to ${formatDate(
                    currentDates.to
                  )}`
                : t("select_date")}
            </button>
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="sm:hidden block text-xl cursor-pointer border border-lightBorder p-2 rounded-md w-10 flex_center h-6 box-content"
            >
              <CiCalendar />
            </button>
            <span className="absolute top-1/2 sm:block hidden -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="py-2.5 w-full border-lightBorder bg-lightBorder bg-opacity-50 sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
              placeholder={t("search_news")}
            />
            {searchQuery && (
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
            className="sm:px-6 px-2 flex-shrink-0 py-2.5 sm:rounded-xl rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            {t("search")}
          </button>
        </div>
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
              {t("all")}
            </button>
            {categoriesData?.data
              ?.filter((category) => category.is_active)
              ?.sort((a, b) => a.priority - b.priority)
              ?.map((category) => (
                <button
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
        {/* --- NEW: Active Tag Filter Display --- */}
        {currentTag && (
          <div className="flex items-center justify-start gap-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-2 text-sm">
            <span>
              {t("filtering_by_tag")}: <strong>{currentTag}</strong>
            </span>
            <button
              onClick={handleClearTag}
              className="text-primary hover:text-secondary"
              aria-label="clear tag filter"
            >
              <FaXmark />
            </button>
          </div>
        )}
        {showInitialSkeleton ? (
          <NewsListSkeleton />
        ) : (
          <>
            {allNews.length > 0 ? (
              <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8">
                {allNews.map((news) => (
                  <NewsCard
                    key={news.id}
                    image={getNewsImage(news)}
                    link={`/${locale}/news/${news.slug}`}
                    author={news.author}
                    createdAt={formatDate(news.published_at)}
                    description={news.excerpt}
                    title={news.title}
                  />
                ))}
              </div>
            ) : (
              <div className="col-span-full text-center py-10 w-full">
                <p className="text-gray-500 text-lg">{t("no_news_found")}</p>
                {(currentSearch ||
                  currentDates.from ||
                  currentTag ||
                  currentCategory !== "all") && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    {t("clear_all_filters")}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {!showInitialSkeleton && allNews.length < totalNews && (
        <div className="w-full flex_center mt-8">
          <button
            onClick={handleSeeMore}
            disabled={isAppending || newsLoading}
            className="border border-primary text-primary px-8 py-2 rounded-md hover:bg-primary hover:text-white transition-colors disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-wait"
          >
            {isAppending || newsLoading ? `${t("loading")}...` : t("see_more")}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsClient;
