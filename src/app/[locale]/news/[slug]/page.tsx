"use client";

import NewsCard from "@/components/newsCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { CiSearch } from "react-icons/ci";

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

interface Tag {
  news_id: number;
  tag_id: number;
  Tag: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

interface Department {
  id: number;
  college_id: number;
  slug: string;
  title: string;
  subtitle: string;
  about: string;
  vision: string;
  mission: string;
  priority: number;
  created_at: string;
  updated_at: string;
  student_number: string;
  staffCount: number;
  leadCount: number;
}

interface NewsDetail {
  id: number;
  author: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  cover_image_id: number;
  center_id: number | null;
  college_id: number | null;
  department_id: number | null;
  created_by_id: number;
  userId: number | null;
  directorate_id: number | null;
  sub_directorate_id: number | null;
  Gallery: Gallery[];
  NewsTags: Tag[];
  NewsCategoryNews: any[];
  CoverImage: Image;
  Center: any | null;
  College: any | null;
  Department: Department | null;
  Directorate: any | null;
  SubDirectorate: any | null;
  CreatedBy: {
    id: number;
  };
}

interface RelatedNewsResponse {
  total: number;
  page: number;
  limit: number;
  data: NewsDetail[];
}

const Page = () => {
  const t = useTranslations("News");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;

  const { data, loading } = useFetch<NewsDetail>(
    `${API_URL}/website/news/${slug}`
  );

  // Fetch related news only when main news data is loaded
  const relatedNewsUrl = data?.id
    ? `${API_URL}/website/news?page=1&limit=4&exclude=${data.id}`
    : "";
  const { data: relatedNews, loading: relatedLoading } =
    useFetch<RelatedNewsResponse>(relatedNewsUrl);

  const isInitialLoading = loading && !data;

  // Get image with fallback logic
  const getNewsImage = (news: NewsDetail | null | undefined) => {
    if (!news) return "/images/news.png";

    return (
      news.CoverImage?.lg ||
      news.CoverImage?.md ||
      news.CoverImage?.original ||
      news.Gallery?.[0]?.Image?.lg ||
      news.Gallery?.[0]?.Image?.md ||
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

  return (
    <div className="my-10 flex_center w-full flex-col gap-10 lg:px-0 px-3 text-secondary">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />

        {isInitialLoading ? (
          <>
            <div className="w-full md:h-[470px] h-[220px] bg-gray-200 animate-pulse rounded-2xl" />
            <div className="h-4 bg-gray-300 rounded w-32" />
            <div className="h-8 bg-gray-200 rounded w-full max-w-[600px]" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="flex gap-2 flex-wrap">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="h-6 w-20 bg-gray-200 rounded-md" />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="w-full md:h-[470px] h-[220px] relative">
              <Image
                src={getNewsImage(data)}
                alt={data?.title || "News"}
                fill
                priority
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            <div className="flex_center gap-2 text-sm">
              <p>{data?.author}</p>
              <span>-</span>
              <span className="opacity-70">
                {formatDate(data?.published_at || data?.created_at || "")}
              </span>
            </div>

            <h1 className="md:text-titleNormal text-base font-semibold">
              {data?.title}
            </h1>

            <div
              className="lg:text-xl md:text-base text-sm opacity-70"
              dangerouslySetInnerHTML={{ __html: data?.content || "" }}
            />

            {data?.NewsTags && data.NewsTags.length > 0 && (
              <div className="w-full flex_start gap-4 flex-wrap">
                {data.NewsTags.map(({ Tag }) => (
                  <span
                    key={Tag.id}
                    className="bg-backgroundSecondary font-medium p-2 rounded-sm md:text-base text-xs"
                  >
                    #{Tag.name}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        <h2 className="md:mt-10 mt-0 md:text-titleNormal text-base font-semibold">
          {t("related_news")}
        </h2>

        <div className="relative w-full">
          <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
            <CiSearch />
          </span>
          <input
            type="text"
            className="sm:py-3 py-2 w-full border-lightBorder sm:text-base text-sm px-8 sm:rounded-lg rounded-md border focus:border-primary outline-none"
            placeholder={t("search_news_hashtag")}
          />
        </div>

        {/* Tags from current news and related news */}
        {data?.NewsTags && data.NewsTags.length > 0 && (
          <div className="w-full flex_start sm:gap-4 gap-2 flex-wrap">
            {data.NewsTags.map(({ Tag }) => (
              <button
                key={Tag.id}
                className="bg-backgroundSecondary font-medium p-2 rounded-sm md:text-base text-xs hover:bg-primary hover:text-white transition-colors cursor-pointer"
              >
                #{Tag.name}
              </button>
            ))}
            {/* Add some placeholder tags if needed */}
            {data.NewsTags.length < 6 && (
              <>
                <button className="bg-backgroundSecondary font-medium p-2 rounded-sm md:text-base text-xs hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  #Education
                </button>
                <button className="bg-backgroundSecondary font-medium p-2 rounded-sm md:text-base text-xs hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  #Research
                </button>
                <button className="bg-backgroundSecondary font-medium p-2 rounded-sm md:text-base text-xs hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  #Innovation
                </button>
              </>
            )}
          </div>
        )}

        {/* Related News */}
        <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8">
          {relatedLoading
            ? // Loading state for related news
              [...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
              ))
            : relatedNews?.data && relatedNews.data.length > 0
            ? relatedNews.data
                .slice(0, 2)
                .map((news) => (
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
            : // Fallback to placeholder cards
              [...Array(2)].map((_, i) => (
                <NewsCard
                  key={`placeholder-${i}`}
                  image="/images/news.png"
                  link="/"
                  author="Craig Bator"
                  createdAt="27 Dec 2020"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                  title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
