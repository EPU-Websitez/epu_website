"use client";

import NewsCard from "@/components/newsCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { CiSearch } from "react-icons/ci";

interface Tag {
  Tag: {
    id: number;
    name_en: string;
    name_ku: string;
    name_ar: string;
  };
}

interface NewsDetail {
  id: number;
  slug: string;
  [`title_en`]: string;
  [`title_ku`]: string;
  [`title_ar`]: string;
  [`excerpt_en`]: string;
  [`excerpt_ku`]: string;
  [`excerpt_ar`]: string;
  [`author_en`]: string;
  [`author_ku`]: string;
  [`author_ar`]: string;
  [`content_en`]: string;
  [`content_ku`]: string;
  [`content_ar`]: string;
  created_at: string;
  NewsTags: Tag[];
  CoverImage: {
    lg: string;
  };
}

const Page = () => {
  const t = useTranslations("News");
  const params = useParams();
  const locale = params?.locale as "en" | "ku" | "ar";
  const slug = params?.slug as string;

  const { data, loading } = useFetch<NewsDetail>(
    `${API_URL}/website/news/${slug}`
  );

  const isInitialLoading = loading && !data;

  const title = data?.[`title_${locale}`] || "";
  const author = data?.[`author_${locale}`] || "";
  const content = data?.[`content_${locale}`] || "";
  const tags = data?.NewsTags || [];

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
                src={`${API_URL}/${data?.CoverImage?.lg}`}
                alt={title}
                fill
                priority
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            <div className="flex_center gap-2 text-sm">
              <p>{author}</p>
              <span>-</span>
              <span className="opacity-70">
                {new Date(data?.created_at || "").toLocaleDateString(locale)}
              </span>
            </div>

            <h1 className="md:text-titleNormal text-base font-semibold">
              {title}
            </h1>

            <div
              className="lg:text-xl md:text-base text-sm opacity-70"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {tags.length > 0 && (
              <div className="w-full flex_start gap-4 flex-wrap">
                {tags.map(({ Tag }) => (
                  <span
                    key={Tag.id}
                    className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs"
                  >
                    #{Tag[`name_${locale}`]}
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
            className="py-3 w-full border-lightBorder sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
            placeholder={t("search_news_hashtag")}
          />
        </div>

        {/* Placeholder Tags */}
        <div className="w-full flex_start gap-4 flex-wrap">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs"
            >
              #Kurdistan
            </span>
          ))}
        </div>

        {/* Placeholder Related News */}
        <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8">
          {[...Array(2)].map((_, i) => (
            <NewsCard
              key={i}
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
