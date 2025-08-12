"use client";

import React, { useState, useEffect } from "react";
import DepartmentHeader from "@/components/departmentHeader";
import NewsCard from "@/components/newsCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// --- Interfaces (Updated for the new API response) ---
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface GalleryItem {
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

// --- Skeleton Components ---
const NewsSkeleton = () => (
  <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 w-full gap-8">
    {[1, 2].map((i) => (
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

// --- Main Content Component (receives guaranteed props) ---
const DepartmentNewsContent = ({
  slug,
  college,
  locale,
}: {
  slug: string;
  college: string;
  locale: string;
}) => {
  const t = useTranslations("Colleges");
  const [news, setNews] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 8; // Using the new limit from the endpoint

  // This hook is now safe to call because `slug` is guaranteed to be a string
  const {
    data: newsData,
    loading: newsLoading,
    error,
  } = useFetch<NewsResponse>(
    `${API_URL}/website/departments/${slug}/news?page=${currentPage}&limit=${limit}`
  );

  useEffect(() => {
    if (newsData?.data) {
      setNews((prevNews) =>
        currentPage === 1 ? newsData.data : [...prevNews, ...newsData.data]
      );
      setTotalNews(newsData.total);
    }
    setLoadingMore(false);
  }, [newsData]); // Dependency array is correct

  const handleLoadMore = () => {
    setLoadingMore(true);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date unavailable";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getNewsImage = (newsItem: News) => {
    return (
      newsItem.cover_image?.md ||
      newsItem.cover_image?.lg ||
      newsItem.cover_image?.original ||
      newsItem.gallery?.[0]?.image?.md ||
      newsItem.gallery?.[0]?.image?.lg ||
      newsItem.gallery?.[0]?.image?.original ||
      "/images/news.png"
    );
  };

  const isInitialLoading = newsLoading && news.length === 0;

  return (
    <div className="max-w-[1040px] flex_start w-full">
      <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
        <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
          <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
            <Link
              href={`/${locale}/colleges/${college}/departments/${slug}`}
              className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("about_button")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/colleges/${college}/departments/${slug}/vision-and-mission`}
              className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("vision_mission")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/colleges/${college}/departments/${slug}/staff`}
              className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("council_staff")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
              <span>{t("news_button")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </div>
            <Link
              href={`/${locale}/colleges/${college}/departments/${slug}/researches`}
              className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("researches")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/colleges/${college}/departments/${slug}/course-subjects`}
              className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("course_subjects")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/colleges/${college}/departments/${slug}/guide-lines`}
              className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("guide_lines")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
          </div>
          <div className="lg:border-l border-l-none lg:border-b-0 border-b lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
            <SubHeader title={t("news_button")} alt={false} />
            {isInitialLoading ? (
              <NewsSkeleton />
            ) : error ? (
              <div className="text-red-500 text-center w-full py-10">
                Failed to load news.
              </div>
            ) : news.length > 0 ? (
              <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 w-full gap-8">
                {news.map((newsItem) => (
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
              <div className="text-gray-500 text-center w-full py-10">
                {t("no_news_found")}
              </div>
            )}
            {!isInitialLoading && news.length < totalNews && (
              <div className="flex_center w-full mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                  {loadingMore ? t("loading") : t("see_more")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Wrapper Component ---
const Page = () => {
  const params = useParams();
  const slug = params?.slug;
  const college = params?.college;
  const locale = params?.locale;

  // Render a full-page skeleton if URL params are not ready.
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
      <DepartmentNewsContent
        slug={slug as string}
        college={college as string}
        locale={locale as string}
      />
    </div>
  );
};

export default Page;
