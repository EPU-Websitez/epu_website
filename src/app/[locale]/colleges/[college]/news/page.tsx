"use client";

import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import NewsCard from "@/components/newsCard";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
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
  department_id: number;
  image_id: number;
  created_at: string;
  updated_at: string;
  image: Image;
}

// Add News interface
interface News {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  cover_image_id: number;
  galleries: Gallery[];
}

interface NewsResponse {
  total: number;
  page: number;
  limit: number;
  data: News[];
}
// Skeleton Components
const NewsSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
  </div>
);
const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;
  // Fetch news data
  const { data: newsData, loading: newsLoading } = useFetch<NewsResponse>(
    `${API_URL}/website/news?page=1&limit=20&collegeSlug=${college}`
  );
  console.log(newsData);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full sm:mt-14 mt-10">
        <SubHeader title={t("news")} alt={false} />
        {newsLoading ? (
          <NewsSkeleton />
        ) : (
          <>
            <div className="w-full flex_center gap-5">
              <div className="relative lg:w-[20%] sm:w-[33%] w-14 text-sm flex-shrink-0 sm:border-none border border-lightBorder sm:p-0 p-2 rounded-md">
                <select
                  name="academic"
                  id="academic"
                  className="text-start sm:block hidden w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                >
                  <option value="#">{t("select_date")}</option>
                  <option value="#">Academic 1</option>
                  <option value="#">Academic 2</option>
                  <option value="#">Academic 3</option>
                </select>
                <CiCalendar className="sm:hidden block text-2xl" />
                <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                  <FaChevronDown />
                </span>
              </div>
              <div className="relative w-full">
                <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
                  <CiSearch />
                </span>
                <input
                  type="text"
                  className="py-2 w-full border-lightBorder sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
                  placeholder={t("search_research")}
                />
              </div>
              <button className="sm:px-6 px-2 flex-shrink-0 py-2 sm:rounded-xl rounded-md bg-primary text-white">
                {t("search")}
              </button>
            </div>
            <div className="flex_start w-full sm:gap-5 gap-2 flex-wrap">
              <button className="bg-golden border py-1 px-4 sn:rounded-3xl rounded-lg sm:text-base text-sm text-white">
                All
              </button>
              <button className="border-golden border py-1 px-4 sn:rounded-3xl rounded-lg sm:text-base text-sm text-golden">
                Technology
              </button>
              <button className="border-golden border py-1 px-4 sn:rounded-3xl rounded-lg sm:text-base text-sm text-golden">
                Technology
              </button>
              <button className="border-golden border py-1 px-4 sn:rounded-3xl rounded-lg sm:text-base text-sm text-golden">
                Technology
              </button>
            </div>
            {/* News Section - Now dynamically populated */}
            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
              {newsData?.data
                ?.slice(0, 2)
                .map((news, i) => (
                  <NewsCard
                    key={i}
                    image={news?.galleries?.[0]?.image?.md}
                    link={`/news/${news.slug}`}
                    author={news.author}
                    createdAt={formatDate(news.published_at)}
                    description={news.excerpt}
                    title={news.title}
                  />
                )) || [
                // Fallback to static news if no data
                <NewsCard
                  key="static1"
                  image={"/images/news.png"}
                  link="/"
                  author="Craig Bator"
                  createdAt="27 Dec 2020"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
                  title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
                />,
                <NewsCard
                  key="static2"
                  image={"/images/news.png"}
                  link="/"
                  author="Craig Bator"
                  createdAt="27 Dec 2020"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
                  title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
                />,
              ]}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
