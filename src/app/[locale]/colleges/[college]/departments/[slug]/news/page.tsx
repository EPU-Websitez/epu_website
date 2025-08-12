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

// --- Updated Interfaces to match new API response ---
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface GalleryItem {
  id: number;
  image: Image; // Changed from 'Image' to 'image'
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
  gallery: GalleryItem[]; // Changed from 'Gallery' to 'gallery'
}

interface NewsResponse {
  total: number;
  page: number;
  limit: number;
  data: News[];
}

// --- Skeleton Component ---
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

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;
  const college = params?.college as string;

  // --- State for pagination and data aggregation ---
  const [news, setNews] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 4; // You can adjust how many items to load per page

  const {
    data: newsData,
    loading: newsLoading,
    error,
  } = useFetch<NewsResponse>(
    `${API_URL}/website/news?page=${currentPage}&departmentSlug=${slug}&limit=${limit}`
  );

  // --- Effect to handle incoming data and append for pagination ---
  useEffect(() => {
    if (newsData?.data) {
      // Append new data to the existing list for subsequent pages
      setNews((prevNews) =>
        currentPage === 1 ? newsData.data : [...prevNews, ...newsData.data]
      );
      setTotalNews(newsData.total);
    }
    setLoadingMore(false);
  }, [newsData]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // --- Updated image getter with correct property names ---
  const getNewsImage = (news: News) => {
    return (
      news.cover_image?.md ||
      news.cover_image?.lg ||
      news.cover_image?.original ||
      news.gallery?.[0]?.image?.md || // Corrected from Gallery and Image
      news.gallery?.[0]?.image?.lg ||
      news.gallery?.[0]?.image?.original ||
      "/images/news.png"
    );
  };

  const isInitialLoading = newsLoading && news.length === 0;

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader />
      <div className="max-w-[1040px] flex_start w-full">
        <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
            {/* Sidebar Navigation */}
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

            {/* Content Area */}
            <div className="lg:border-l border-l-none lg:border-b-0 border-b lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
              <SubHeader title={t("news_button")} alt={false} />

              {isInitialLoading ? (
                <NewsSkeleton />
              ) : error ? (
                <div className="text-red-500 text-center w-full">
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
                      createdAt={formatDate(newsItem.published_at)}
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

              {/* "See More" Button */}
              {!newsLoading && news.length < totalNews && (
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
    </div>
  );
};

export default Page;
