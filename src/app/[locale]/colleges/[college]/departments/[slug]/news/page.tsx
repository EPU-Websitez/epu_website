"use client";

import CollegeHeader from "@/components/collegeHeader";
import DepartmentHeader from "@/components/departmentHeader";
import EventCard from "@/components/eventCards";
import NewsCard from "@/components/newsCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronRight } from "react-icons/fa6";
import { GoArrowRight, GoBriefcase } from "react-icons/go";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { IoArrowForwardOutline, IoBriefcaseOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

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

interface News {
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
  data: News[];
}

// News Skeleton Component
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

  // Fetch news data for this department
  const { data: newsData, loading: newsLoading } = useFetch<NewsResponse>(
    `${API_URL}/website/news?page=1&departmentSlug=${slug}&limit=100`
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get image with fallback logic
  const getNewsImage = (news: News) => {
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

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader />
      <div className="max-w-[1040px] px-3 flex_start w-full">
        <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}`}
                title={t("about_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("about_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/vision-and-mission`}
                title={t("vision_mission")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("vision_mission")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/staff`}
                title={t("council_staff")}
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
                title={t("researches")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("researches")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/course-subjects`}
                title={t("course_subjects")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("course_subjects")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/guide-lines`}
                title={t("guide_lines")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("guide_lines")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
            </div>

            <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
              <div className="md:block hidden">
                <SubHeader title={t("news_button")} alt={false} />
              </div>
              <h2 className="md:hidden block relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                <span className="z-10 relative">{t("news_button")}</span>
              </h2>

              {/* Dynamic News Section */}
              {newsLoading ? (
                <NewsSkeleton />
              ) : (
                <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 w-full gap-8">
                  {newsData?.data && newsData.data.length > 0 ? (
                    newsData.data
                      .slice(0, 2)
                      .map((news) => (
                        <NewsCard
                          key={news.id}
                          image={getNewsImage(news)}
                          link={`/${locale}/news/${news.slug}`}
                          author={news.author}
                          createdAt={formatDate(news.published_at)}
                          description={news.excerpt}
                          title={news.title}
                        />
                      ))
                  ) : (
                    // Fallback to static news if no data
                    <>
                      <NewsCard
                        image="/images/news.png"
                        link="/"
                        author="Craig Bator"
                        createdAt="27 Dec 2020"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
                        title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
                      />
                      <NewsCard
                        image="/images/news.png"
                        link="/"
                        author="Craig Bator"
                        createdAt="27 Dec 2020"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
                        title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
                      />
                    </>
                  )}
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
