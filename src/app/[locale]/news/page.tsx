"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";
import { LuArrowRight } from "react-icons/lu";
import { CiCalendar, CiSearch } from "react-icons/ci";
import NewsCard from "@/components/newsCard";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// --- (TypeScript Interfaces and DatePicker Component remain the same) ---
// TypeScript Interfaces for API Response
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface Gallery {
  id: number;
  image: Image;
}

interface CoverImage {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface News {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  published_at: string;
  cover_image: CoverImage;
  gallery: Gallery[];
}

interface NewsResponse {
  total: number;
  page: number;
  limit: number;
  data: News[];
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

// Reusable DatePicker Component
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
            className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
// --- (Skeleton components remain the same) ---
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

const Page = () => {
  const t = useTranslations("News");
  const params = useParams();
  const locale = params?.locale as string;
  const swiperRef = useRef<SwiperCore>();

  // State management
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<DateRange>({
    from: "",
    to: "",
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [totalNews, setTotalNews] = useState<number>(0);
  const [isAppending, setIsAppending] = useState<boolean>(false);

  // Fetch slider news (first 10)
  const { data: sliderData, loading: sliderLoading } = useFetch<NewsResponse>(
    `${API_URL}/website/news?limit=10&page=1`
  );

  // Build API URL for the news list with filters
  const buildApiUrl = () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "4", // Fetch 4 items per page for the list
    });
    if (appliedSearchQuery.trim())
      params.append("search", appliedSearchQuery.trim());
    if (selectedDates.from) params.append("date_from", selectedDates.from);
    if (selectedDates.to) params.append("date_to", selectedDates.to);
    return `${API_URL}/website/news?${params.toString()}`;
  };

  // Fetch news list data
  const {
    data: newsData,
    loading: newsLoading,
    refetch,
  } = useFetch<NewsResponse>(buildApiUrl());

  // Effect to append or reset news list
  useEffect(() => {
    if (newsData?.data) {
      setTotalNews(newsData.total);
      if (currentPage === 1) {
        setAllNews(newsData.data);
      } else {
        setAllNews((prevNews) => [...prevNews, ...newsData.data]);
      }
      setIsAppending(false);
    }
  }, [newsData]);

  // Handlers for filters
  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedSearchQuery(searchQuery);
  };

  const handleDateChange = (dates: DateRange) => {
    setCurrentPage(1);
    setSelectedDates(dates);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // Refetch data when filters or page change
  useEffect(() => {
    refetch();
  }, [appliedSearchQuery, selectedDates, currentPage, refetch]);

  const handleSeeMore = () => {
    setIsAppending(true);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getNewsImage = (news: News) => {
    return (
      news.cover_image?.md ||
      news.cover_image?.lg ||
      news.cover_image?.original ||
      news.gallery?.[0]?.image?.md ||
      news.gallery?.[0]?.image?.lg ||
      news.gallery?.[0]?.image?.original ||
      "/images/news.png" // Fallback image
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setAppliedSearchQuery("");
    setSelectedDates({ from: "", to: "" });
    setCurrentPage(1);
  };

  const showInitialSkeleton = newsLoading && allNews.length === 0;

  return (
    <div className="my-10 flex_center w-full flex-col gap-10">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8 lg:px-0 px-3">
        <SubHeader title={t("head")} alt={false} />
      </div>

      {/* --- (Slider Section remains the same) --- */}
      <div className="w-full relative">
        {sliderLoading ? (
          <SliderSkeleton />
        ) : (
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={true}
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
                  <div className="lg:top-20 md:top-10 top-5 lg:left-32 md:left-14 left-6 absolute flex_start flex-col gap-5">
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
                      className="border-b border-b-white text-white flex_center gap-3"
                    >
                      <p className="md:text-base text-xs">{t("see_details")}</p>
                      <LuArrowRight className="md:text-xl text-base rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* News List Section */}
      <div className="max-w-[1040px] w-full text-secondary flex_start flex-col gap-8 mt-10 lg:px-0 px-3">
        <div className="w-full flex_center gap-5">
          <h1 className="md:text-titleNormal text-base font-semibold flex-shrink-0">
            {t("release_news")}
          </h1>
          <span className="w-full h-1 bg-golden"></span>
        </div>

        {/* --- (Filters Section remains the same) --- */}
        <div className="w-full flex_center gap-5">
          <div className="relative lg:w-[20%] sm:w-[33%] w-14 text-sm flex-shrink-0">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="text-start sm:block hidden w-full px-4 py-2 border border-lightBorder bg-lightBorder bg-opacity-50 rounded-xl text-gray-500 focus:border-primary outline-none"
            >
              {selectedDates.from && selectedDates.to
                ? `${selectedDates.from} to ${selectedDates.to}`
                : t("select_date")}
            </button>
            <CiCalendar
              className="sm:hidden block text-2xl cursor-pointer border border-lightBorder p-2 rounded-md w-14 h-10 box-content"
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

          <div className="relative w-full">
            <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
              <CiSearch />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="py-2 w-full border-lightBorder bg-lightBorder bg-opacity-50 sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
              placeholder={t("search_news")}
            />
          </div>
          <button
            onClick={handleSearch}
            className="sm:px-6 px-2 flex-shrink-0 py-2 sm:rounded-xl rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            {t("search")}
          </button>
        </div>

        {/* News Grid */}
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
              <div className="col-span-2 text-center py-10 w-full">
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
          </>
        )}
      </div>

      {/* "See More" Button */}
      {!showInitialSkeleton && allNews.length < totalNews && (
        <div className="w-full flex_center mt-8">
          <button
            onClick={handleSeeMore}
            disabled={isAppending}
            className="border border-primary text-primary px-8 py-2 rounded-md hover:bg-primary hover:text-white transition-colors disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-wait"
          >
            {isAppending ? `${t("search")}...` : t("see_more")}
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
