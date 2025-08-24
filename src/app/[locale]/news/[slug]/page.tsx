"use client";

import { useState, useEffect } from "react";
import NewsCard from "@/components/newsCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { CiSearch } from "react-icons/ci";

// --- TypeScript Interfaces ---

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

interface TagData {
  id: number;
  name: string;
}

interface Tag {
  tag: TagData;
}

interface NewsDetail {
  id: number;
  author: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string | null;
  created_at: string;
  cover_image: Image;
  gallery: Gallery[];
  news_tags: Tag[];
}

interface NewsListResponse {
  total: number;
  page: number;
  limit: number;
  data: NewsDetail[];
}

// --- React Component ---

const Page = () => {
  const t = useTranslations("News");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;

  // --- State Management ---
  const { data: mainNews, loading: mainNewsLoading } = useFetch<NewsDetail>(
    `${API_URL}/website/news/${slug}`
  );

  const [newsList, setNewsList] = useState<NewsDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // For the input field
  const [searchedTag, setSearchedTag] = useState(""); // The tag currently being queried
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [listLoading, setListLoading] = useState(false);

  // --- Effects for Data Fetching ---

  // Effect to set the initial search tag from the main article
  useEffect(() => {
    if (mainNews) {
      const initialTag = mainNews.news_tags?.[0]?.tag?.name || "innovation";
      setSearchedTag(initialTag);
      setSearchTerm(initialTag); // Pre-fill search bar
    }
  }, [mainNews]);

  // Effect to fetch news when the searched tag or page changes
  useEffect(() => {
    if (!searchedTag || !mainNews?.id) return;

    const fetchNews = async () => {
      setListLoading(true);
      const limit = 4; // Fetch 4 items per page
      const url = `${API_URL}/website/news?tag=${searchedTag.trim()}&page=${currentPage}&limit=${limit}&exclude=${
        mainNews.id
      }`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch news");
        const result: NewsListResponse = await response.json();

        setNewsList((prev) =>
          currentPage === 1 ? result.data : [...prev, ...result.data]
        );
        setTotalNews(result.total);
      } catch (error) {
        console.error("Error fetching news list:", error);
        setNewsList([]);
        setTotalNews(0);
      } finally {
        setListLoading(false);
      }
    };

    fetchNews();
  }, [searchedTag, currentPage, mainNews?.id]);

  // --- Event Handlers ---

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newTag = searchTerm.trim();
    if (newTag && newTag !== searchedTag) {
      setSearchedTag(newTag);
      setCurrentPage(1);
      setNewsList([]);
    }
  };

  const handleTagClick = (tagName: string) => {
    if (tagName !== searchedTag) {
      setSearchTerm(tagName);
      setSearchedTag(tagName);
      setCurrentPage(1);
      setNewsList([]);
    }
  };

  const handleLoadMore = () => {
    if (!listLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // --- Helper Functions ---
  const getNewsImage = (news: NewsDetail | null | undefined) => {
    if (!news) return "/images/news.png";
    return (
      news.cover_image?.lg ||
      news.cover_image?.original ||
      news.gallery?.[0]?.image?.lg ||
      news.gallery?.[0]?.image?.original ||
      "/images/news.png"
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const clickableTags: TagData[] = [
    { id: 1001, name: "Education" },
    { id: 1002, name: "Research" },
    { id: 1003, name: "Innovation" },
    ...(mainNews?.news_tags?.map((t) => t.tag) || []),
  ].filter(
    (tag, index, self) => index === self.findIndex((t) => t.name === tag.name) // Remove duplicates
  );

  return (
    <div className="my-10 flex_center w-full flex-col gap-10 lg:px-0 px-3 text-secondary">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />

        {/* --- Main News Article --- */}
        {mainNewsLoading ? (
          <>
            <div className="w-full md:h-[470px] h-[220px] bg-gray-200 animate-pulse rounded-2xl" />
            <div className="h-4 bg-gray-300 rounded w-32 mt-4" />
            <div className="h-8 bg-gray-200 rounded w-full max-w-[600px]" />
            <div className="h-4 bg-gray-100 rounded w-full mt-2" />
          </>
        ) : (
          mainNews && (
            <>
              <div className="w-full md:h-[470px] h-[220px] relative">
                <Image
                  src={getNewsImage(mainNews)}
                  alt={mainNews.title}
                  fill
                  priority
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="flex_center gap-2 text-sm">
                <p>{mainNews.author}</p>
                <span>-</span>
                <span className="opacity-70">
                  {formatDate(mainNews.published_at || mainNews.created_at)}
                </span>
              </div>
              <h1 className="md:text-titleNormal text-base font-semibold">
                {mainNews.title}
              </h1>
              <div
                className="lg:text-xl md:text-base text-sm opacity-70"
                dangerouslySetInnerHTML={{ __html: mainNews.content || "" }}
              />

              {/* Display of original article's tags (read-only) */}
              {mainNews.news_tags && mainNews.news_tags.length > 0 && (
                <div className="w-full flex_start gap-4 flex-wrap">
                  {mainNews.news_tags.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="bg-backgroundSecondary font-medium p-2 rounded-sm md:text-base text-xs"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </>
          )
        )}

        {/* --- Related News & Search Section --- */}
        <h2 className="md:mt-10 mt-0 md:text-titleNormal text-base font-semibold">
          {t("related_news")}
        </h2>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full">
          <button
            type="submit"
            className="text-black opacity-50 absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 z-10 text-xl p-1"
          >
            <CiSearch />
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:py-3 py-2 w-full border-lightBorder sm:text-base text-sm ltr:pl-10 rtl:pr-10 px-4 sm:rounded-lg rounded-md border focus:border-primary outline-none"
            placeholder={t("search_news_hashtag")}
          />
        </form>

        {/* Clickable Tags */}
        <div className="w-full flex_start sm:gap-4 gap-2 flex-wrap">
          {clickableTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.name)}
              className={`font-medium p-2 rounded-sm md:text-base text-xs transition-colors cursor-pointer ${
                searchedTag === tag.name
                  ? "bg-primary text-white"
                  : "bg-backgroundSecondary hover:bg-primary/80 hover:text-white"
              }`}
            >
              #{tag.name}
            </button>
          ))}
        </div>

        {/* --- Dynamic News List --- */}
        <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8 min-h-[200px]">
          {listLoading && currentPage === 1
            ? [...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            : newsList.length > 0
            ? newsList.map((news) => (
                <NewsCard
                  key={news.id}
                  image={getNewsImage(news)}
                  link={`/${locale}/news/${news.slug}`}
                  author={news.author || "Unknown"}
                  createdAt={formatDate(news.published_at || news.created_at)}
                  description={news.excerpt || ""}
                  title={news.title || ""}
                />
              ))
            : !listLoading && (
                <p className="col-span-full text-center opacity-70">
                  {t("no_news_found")}
                </p>
              )}
        </div>

        {/* --- Load More Button --- */}
        {newsList.length < totalNews && (
          <div className="flex_center w-full my-5">
            <button
              onClick={handleLoadMore}
              disabled={listLoading}
              className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {listLoading ? t("loading") : t("see_more")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
