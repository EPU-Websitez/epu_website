"use client";

import CenterHeader from "@/components/CenterHeader";
import NewsCard from "@/components/newsCard";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useEffect, useState } from "react";

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
  CoverImage: CoverImage;
}

interface NewsResponse {
  total: number;
  page: number;
  limit: number;
  data: NewsItem[];
}

const Page = () => {
  const t = useTranslations("Centers");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;
  const [centers, setCenters] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const limit = 1;
  const { data, loading } = useFetch<NewsResponse>(
    `${API_URL}/website/news?page=${page}&limit=${limit}&centerSlug=${slug}`
  );
  const isInitialLoading = loading && page === 1;

  // Get image with fallback logic
  const getNewsImage = (news: NewsItem) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Append new data
  useEffect(() => {
    if (data?.data) {
      setCenters((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const unique = data.data.filter((d) => !ids.has(d.id));
        return [...prev, ...unique];
      });
    }
  }, [data]);
  // Reset on slug/locale change
  useEffect(() => {
    setCenters([]);
    setPage(1);
  }, [slug, locale]);
  const handleLoadMore = () => setPage((prev) => prev + 1);

  return (
    <div className="w-full flex justify-center items-start sm:my-10 my-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <CenterHeader />

        {/* Navigation Tabs */}
        <div className="md:w-[720px] w-full my-10 sm:h-[50px] h-[35px] grid grid-cols-3 justify-center items-center bg-lightBorder text-secondary rounded-3xl">
          <Link
            title={t("vision_mission")}
            href={`/${locale}/centers/${slug}`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("vision_mission")}
          </Link>
          <Link
            title={t("staff")}
            href={`/${locale}/centers/${slug}/staff`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("staff")}
          </Link>
          <p className="bg-primary text-white rounded-3xl h-full flex_center sm:text-lg text-sm font-medium">
            {t("news")}
          </p>
        </div>

        {/* News Section */}
        <div className="flex_start w-full flex-col gap-10">
          <h2 className="md:text-3xl relative text-lg font-semibold ">
            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
            <span className="z-10 relative">{t("center_news")}</span>
          </h2>

          {isInitialLoading ? (
            <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8">
              {[...Array(2)].map((_, i) => (
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
          ) : (
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
          )}
        </div>
        {!isInitialLoading && data && centers.length < data.total && (
          <div className="flex_center w-full my-5">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg"
            >
              {loading ? t("loading") : t("see_more")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
