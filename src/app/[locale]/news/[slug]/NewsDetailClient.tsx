// src/app/[locale]/news/[slug]/page.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import NewsCard from "@/components/newsCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";

import useFetch from "@/libs/hooks/useFetch";
import {
  FaPlus,
  FaDownload,
  FaPlay,
  FaSearchPlus,
  FaLink,
  FaFileDownload,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import Link from "next/link";
import { formatDate } from "@/libs/formatDate";

// --- START: Types ---
interface Img {
  id: number;
  original: string;
  lg: string | null;
  md: string | null;
  sm: string | null;
  media_type: "IMAGE" | "VIDEO";
}

interface Gallery {
  id: number;
  image: Img;
}

interface TagData {
  id: number;
  name: string;
}

interface Tag {
  tag: TagData;
}

interface NewsCategory {
  id: number;
  name: string;
}

interface NewsCategoryNews {
  news_category: NewsCategory;
}

interface NewsFile {
  id: number;
  title: string;
  file: {
    path: string;
  };
}

interface NewsLink {
  id: number;
  title: string;
  url: string;
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
  cover_image: Img | null;
  gallery: Gallery[];
  news_tags: Tag[];
  news_category_news: NewsCategoryNews[];
  files: NewsFile[];
  links: NewsLink[];
  scheduled_publish_at: string;
}

interface NewsListResponse {
  total: number;
  page: number;
  limit: number;
  data: NewsDetail[];
}
// --- END: Types ---

const GALLERY_INLINE_COUNT = 5;

// --- Helper Spinner Component ---
const SpinnerIcon = () => (
  <svg
    className="animate-spin h-4 w-4 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const NewsDetailClient = () => {
  const t = useTranslations("News");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const slug = params?.slug as string;

  // --- State ---
  const [newsList, setNewsList] = useState<NewsDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [listLoading, setListLoading] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeGalleryItem, setActiveGalleryItem] = useState<Gallery | null>(
    null,
  );
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());

  // --- Data Fetching ---
  const { data: mainNews, loading: mainNewsLoading } = useFetch<NewsDetail>(
    slug ? `${process.env.NEXT_PUBLIC_API_URL}/website/news/${slug}` : "",
    locale,
  );

  const relatedUrl = useMemo(() => {
    if (!slug) return "";
    const p = new URLSearchParams({
      page: String(currentPage),
      limit: "4",
    });
    return `${
      process.env.NEXT_PUBLIC_API_URL
    }/website/news/${slug}/related?${p.toString()}`;
  }, [slug, currentPage]);

  const { data: relatedNewsData, loading: relatedNewsLoading } =
    useFetch<NewsListResponse>(relatedUrl, locale);

  // --- Effects ---
  useEffect(() => {
    setListLoading(relatedNewsLoading);
    if (relatedNewsData?.data) {
      if (currentPage === 1) {
        setNewsList(relatedNewsData.data);
      } else {
        setNewsList((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = relatedNewsData.data.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...uniqueNewItems];
        });
      }
      setTotalNews(relatedNewsData.total);
    }
  }, [relatedNewsData, relatedNewsLoading, currentPage]);

  // --- Handlers & Helpers ---
  const handleLoadMore = () => {
    if (!listLoading) {
      setCurrentPage((p) => p + 1);
    }
  };

  const handleOpenGallery = (item: Gallery) => {
    setActiveGalleryItem(item);
    setShowGalleryModal(true);
  };

  const handleDownload = async (url: string, filename: string, id: number) => {
    setDownloadingIds((prev) => new Set(prev).add(id));
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok.");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      a.remove();
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank"); // Fallback
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

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

  const allGalleries = mainNews?.gallery ?? [];
  const inlineGalleries = allGalleries.slice(0, GALLERY_INLINE_COUNT);
  const remainingGalleryCount = Math.max(
    0,
    allGalleries.length - GALLERY_INLINE_COUNT,
  );

  return (
    <div className="my-10 flex_center w-full flex-col gap-10 lg:px-0 px-3 text-secondary">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />

        {/* --- Main Article --- */}
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
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.svg";
                  }}
                />
              </div>

              <div className="flex_center gap-2 text-sm">
                <p>{mainNews.author}</p>
                <span>-</span>
                <span className="opacity-70">
                  {formatDate(
                    mainNews.published_at || mainNews.scheduled_publish_at,
                    locale,
                  )}
                </span>
              </div>

              {mainNews.news_category_news?.length > 0 && (
                <div className="w-full flex items-center gap-3 flex-wrap">
                  {mainNews.news_category_news.map(
                    ({ news_category }) =>
                      news_category && (
                        <span
                          key={news_category.id}
                          className="border-primary border text-primary text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {news_category.name}
                        </span>
                      ),
                  )}
                </div>
              )}

              <h1 className="md:text-titleNormal text-base font-semibold">
                {mainNews.title}
              </h1>

              <div
                className="lg:text-xl md:text-base text-sm opacity-70 prose prose-sm max-w-none prose-p:my-2 prose-headings:my-4"
                dangerouslySetInnerHTML={{ __html: mainNews.content || "" }}
              />

              {mainNews.excerpt && (
                <div className="mt-6 p-4 border-l-4 border-golden bg-backgroundSecondary/50 rounded-r-lg">
                  <h3 className="text-lg font-semibold mb-2">{t("summary")}</h3>
                  <p className="text-secondary/80 italic">{mainNews.excerpt}</p>
                </div>
              )}

              {allGalleries.length > 0 && (
                <div className="mt-8 w-full">
                  <h3 className="text-xl font-semibold mb-4">{t("gallery")}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {inlineGalleries.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => handleOpenGallery(g)}
                        className="relative block w-full aspect-square overflow-hidden rounded-lg group focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2"
                      >
                        {g.image?.media_type === "VIDEO" ? (
                          <video
                            src={g.image?.original}
                            className="w-full h-full object-cover"
                            playsInline
                            muted
                            loop
                          />
                        ) : (
                          <Image
                            src={
                              g.image?.md ||
                              g.image?.lg ||
                              g.image?.original ||
                              "/images/news.png"
                            }
                            alt="Gallery thumbnail"
                            fill
                            sizes="150px"
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/images/placeholder.svg";
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex_center">
                          {g.image?.media_type === "VIDEO" ? (
                            <FaPlay className="text-white text-2xl" />
                          ) : (
                            <FaSearchPlus className="text-white text-2xl" />
                          )}
                        </div>
                      </button>
                    ))}
                    {remainingGalleryCount > 0 && (
                      <button
                        type="button"
                        onClick={() => handleOpenGallery(allGalleries[0])}
                        className="relative w-full aspect-square rounded-lg border border-lightBorder flex_center bg-backgroundSecondary/50 hover:bg-lightBorder/40 transition-colors"
                        aria-haspopup="dialog"
                        aria-expanded={showGalleryModal}
                        title={t("see_all")}
                      >
                        <div className="flex_center flex-col gap-2">
                          <FaPlus />
                          <span className="text-sm font-medium">
                            +{remainingGalleryCount} {t("more")}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {mainNews.links && mainNews.links.length > 0 && (
                <div className="mt-8 w-full">
                  <h3 className="text-xl font-semibold mb-4">
                    {t("related_links")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mainNews.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm px-3 py-1.5 bg-backgroundSecondary/50 rounded-full hover:bg-primary hover:text-white transition-colors group"
                      >
                        <FaLink className="text-primary group-hover:text-white" />
                        <span className="font-medium">{link.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {mainNews.files && mainNews.files.length > 0 && (
                <div className="mt-8 w-full">
                  <h3 className="text-xl font-semibold mb-4">
                    {t("attachments")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mainNews.files.map((file) => {
                      const fileName =
                        file.file.path.split("/").pop() || "download";
                      const isDownloading = downloadingIds.has(file.id);
                      return (
                        <button
                          key={file.id}
                          onClick={() =>
                            !isDownloading &&
                            handleDownload(file.file.path, fileName, file.id)
                          }
                          disabled={isDownloading}
                          className="flex items-center gap-2 text-sm px-3 py-1.5 bg-backgroundSecondary/50 rounded-full hover:bg-golden hover:text-secondary transition-colors group disabled:opacity-70 disabled:cursor-wait"
                        >
                          {isDownloading ? (
                            <SpinnerIcon />
                          ) : (
                            <FaFileDownload className="text-golden group-hover:text-secondary" />
                          )}
                          <span className="font-medium">{file.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mainNews.news_tags?.length > 0 && (
                <div className="w-full flex_start gap-4 flex-wrap mt-8">
                  {mainNews.news_tags.map(({ tag }) => (
                    <Link
                      href={`/${locale}/news?tag=${tag.name}`}
                      key={tag.id}
                      title={tag.name}
                      className="bg-backgroundSecondary font-medium p-2 rounded-sm md:text-base text-xs"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )
        )}

        {/* --- Related News Section --- */}
        <h2 className="md:mt-10 mt-0 md:text-titleNormal text-base font-semibold">
          {t("related_news")}
        </h2>

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
                    createdAt={formatDate(
                      news.published_at || news.scheduled_publish_at,
                      locale,
                    )}
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

      {/* --- Gallery Modal --- */}
      {showGalleryModal && activeGalleryItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-modal-title"
          onClick={() => setShowGalleryModal(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div
            className="relative bg-white text-secondary w-full max-w-4xl h-full max-h-[90vh] rounded-2xl shadow-xl p-4 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
              <h4 id="gallery-modal-title" className="text-lg font-semibold">
                {t("gallery")}
              </h4>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="p-2 rounded-lg hover:bg-lightBorder/40"
                aria-label="close modal"
              >
                <FaXmark />
              </button>
            </div>

            {/* Main Content */}
            <div className="relative sm:flex-grow flex-grow-0 h-[300px] w-full bg-black/10 rounded-lg flex items-center justify-center">
              {activeGalleryItem.image.media_type === "VIDEO" ? (
                <video
                  key={activeGalleryItem.id}
                  src={activeGalleryItem.image.original}
                  className="max-w-full max-h-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <Image
                  key={activeGalleryItem.id}
                  src={activeGalleryItem.image.original}
                  alt="Gallery full view"
                  fill
                  className="object-contain"
                  sizes="90vw"
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.svg";
                  }}
                />
              )}
              <button
                onClick={() => {
                  const isDownloading = downloadingIds.has(
                    activeGalleryItem.id,
                  );
                  if (!isDownloading) {
                    handleDownload(
                      activeGalleryItem.image.original,
                      `gallery-item-${activeGalleryItem.id}`,
                      activeGalleryItem.id,
                    );
                  }
                }}
                disabled={downloadingIds.has(activeGalleryItem.id)}
                className="absolute top-3 right-3 z-10 bg-white/80 text-secondary p-2.5 rounded-full hover:bg-white transition-colors disabled:opacity-70 disabled:cursor-wait"
                title="download"
              >
                {downloadingIds.has(activeGalleryItem.id) ? (
                  <SpinnerIcon />
                ) : (
                  <FaDownload />
                )}
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex-shrink-0">
              <div className="flex overflow-x-auto gap-2 py-2">
                {allGalleries.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGalleryItem(g)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ring-2 transition-all ${
                      activeGalleryItem.id === g.id
                        ? "ring-primary"
                        : "ring-transparent hover:ring-primary/50"
                    }`}
                  >
                    {g.image.media_type === "VIDEO" ? (
                      <video
                        src={g.image.original}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={
                          g.image.sm || g.image.original || "/images/news.png"
                        }
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                        sizes="80px"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.svg";
                        }}
                      />
                    )}
                    {g.image.media_type === "VIDEO" && (
                      <div className="absolute inset-0 flex_center bg-black/30">
                        <FaPlay className="text-white/80 text-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetailClient;
