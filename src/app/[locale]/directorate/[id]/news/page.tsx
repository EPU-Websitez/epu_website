"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import NewsCard from "@/components/newsCard";
import SubUnits from "@/components/SubUnits";
import DirectorateHeader from "@/components/DirectorateHeader";

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
  parent_id: number | null;
  parent?: {
    slug: string;
  };
}

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
  const locale = params?.locale as string;
  const id = params?.id as string; // This is the directorate's slug
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parent_id"); // This can be string or null
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [newsPage, setNewsPage] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch parent info for sidebar navigation
  const { data: directorateInfo } = useFetch<DirectorateParentInfo>(
    id ? `${API_URL}/website/directorates/${id}` : ""
  );

  // Manually handle fetching for paginated news list
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchNews(1);
    }
  }, [id]);

  const fetchNews = async (page: number) => {
    if (page > 1) setIsLoadingMore(true);
    try {
      const res = await fetch(
        `${API_URL}/website/directorates/${id}/news?page=${page}&limit=10`
      );
      const newData: NewsResponse = await res.json();
      if (newData.data) {
        setNewsList((prev) =>
          page === 1 ? newData.data : [...prev, ...newData.data]
        );
        setTotalNews(newData.total);
      }
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = newsPage + 1;
    setNewsPage(nextPage);
    fetchNews(nextPage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const parentSlug = directorateInfo?.parent?.slug || id;
  const parentIdForSubUnits = directorateInfo?.parent_id || directorateInfo?.id;

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("university_directory")} alt={false} />
        <DirectorateHeader />
        <div className="flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            {isLoading ? (
              <ContentSkeleton />
            ) : (
              <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
                <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
                  <Link
                    href={`/${locale}/directorate/${id}?parent_id=${parentId}`}
                    title={t("about")}
                    className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                  >
                    <span>{t("about")}</span>
                    <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                  </Link>
                  <Link
                    href={`/${locale}/directorate/${id}/staff?parent_id=${parentId}`}
                    title={t("staff")}
                    className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                  >
                    <span>{t("staff")}</span>
                    <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                  </Link>
                  <SubUnits />
                  <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                    <span>{t("news")}</span>
                    <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                  </div>
                </div>

                <div className="lg:border-l text-secondary border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                  <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
                    <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                    <span className="z-10 relative">{t("news")}</span>
                  </h2>
                  <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 w-full gap-8">
                    {newsList.map((newsItem) => (
                      <NewsCard
                        key={newsItem.id}
                        image={newsItem.cover_image.lg}
                        link={`/${locale}/news/${newsItem.slug}`}
                        author={newsItem.author}
                        createdAt={formatDate(newsItem.published_at)}
                        description={newsItem.excerpt}
                        title={newsItem.title}
                      />
                    ))}
                  </div>
                  {newsList.length < totalNews && (
                    <div className="w-full flex_center mt-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="bg-primary text-white px-6 py-2 rounded-full disabled:bg-opacity-70"
                      >
                        {isLoadingMore ? t("loading") : t("see_more")}
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
