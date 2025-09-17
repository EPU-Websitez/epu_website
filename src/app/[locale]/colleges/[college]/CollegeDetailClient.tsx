"use client";

import { useEffect, useState } from "react";
import CollegeHeader from "@/components/collegeHeader";
import EventCard from "@/components/eventCards";
import NewsCard from "@/components/newsCard";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowRight, FaChevronRight } from "react-icons/fa6";
import { GoBriefcase } from "react-icons/go";
import { IoArrowForwardOutline } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// Interfaces
interface ImageFile {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}
interface Gallery {
  id: number;
  image: ImageFile;
}
interface CollegeData {
  id: number;
  title: string;
  news_title: string;
  news_subtitle: string;
  college_title: string;
  college_subtitle: string;
  teacher_title: string;
  teacher_subtitle: string;
  event_title: string;
  event_subtitle: string;
  about_content: string;
  galleries: Gallery[];
  logo: ImageFile;
}
interface Department {
  id: number;
  slug: string;
  title: string;
  student_number: string;
  teachers_count: string;
}
interface DepartmentsResponse {
  data: Department[];
}
interface Teacher {
  full_name: string;
}
interface ApiStaffMember {
  role: string;
  teacher: Teacher;
}
interface StaffApiResponse {
  data: ApiStaffMember[];
}
interface News {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  published_at: string;
  cover_image: ImageFile;
}
interface NewsResponse {
  data: News[];
}
interface Event {
  id: number;
  slug: string;
  title: string;
  created_at: string;
  galleries: { image: ImageFile }[];
  schedule: { time_string: string } | null;
  event_tag: { tag: { name: string } }[];
}
interface EventsResponse {
  data: Event[];
}

// Skeletons
const CollegeSkeleton = () => (
  <div className="w-full flex_center flex-col sm:my-10 my-5">
    <div className="max-w-[1379px] px-3 flex_start w-full">
      <div className="animate-pulse w-full h-20 bg-gray-300 rounded-lg"></div>
    </div>
    <div className="max-w-[1040px] px-3 text-secondary sm:mt-14 mt-10 flex_start flex-col gap-5 w-full">
      <div className="animate-pulse w-full">
        <div className="h-12 bg-gray-300 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
        <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
          <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
          <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

const CollegeDetailClient = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;

  const {
    data: collegeData,
    loading: collegeLoading,
    error,
  } = useFetch<CollegeData>(`${API_URL}/website/colleges/${college}`, locale);
  const { data: departmentsData, loading: departmentsLoading } =
    useFetch<DepartmentsResponse>(
      `${API_URL}/website/colleges/${college}/departments`,
      locale
    );
  const { data: staffData, loading: staffLoading } = useFetch<StaffApiResponse>(
    `${API_URL}/website/colleges/${college}/staff`,
    locale
  );
  const { data: newsData } = useFetch<NewsResponse>(
    `${API_URL}/website/colleges/${college}/news`,
    locale
  );
  const { data: eventsData } = useFetch<EventsResponse>(
    `${API_URL}/website/colleges/${college}/events`,
    locale
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (staffData?.data?.length) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % staffData.data.length);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [staffData]);

  const renderContent = () => {
    if (staffLoading || !staffData?.data?.length)
      return collegeData?.teacher_title || "Great Teachers";
    const currentStaff = staffData.data[currentIndex];
    return (
      <div>
        <p
          className="font-semibold truncate"
          title={currentStaff.teacher.full_name}
        >
          {currentStaff.teacher.full_name}
        </p>
        <p className="text-base font-normal">{currentStaff.role}</p>
      </div>
    );
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const getNewsImage = (news: News) =>
    news.cover_image?.md || "/images/news.png";
  const getEventImage = (event: Event) =>
    event.galleries?.[0]?.image?.md || "/images/event.png";

  if (collegeLoading || departmentsLoading) return <CollegeSkeleton />;

  if (error) {
    return (
      <div className="w-full flex_center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading College Data
          </h1>
          <p className="text-gray-600">
            Please check the URL or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>

      <div className="max-w-[1040px] px-3 text-secondary sm:mt-14 mt-10 flex_start flex-col gap-5 w-full">
        {/* News Section */}
        {newsData?.data && newsData.data.length > 0 && (
          <div className="w-full flex_start flex-col gap-5">
            {/* <h1 className="lg:text-[50px] md:text-title text-xl font-bold lg:max-w-[840px] relative">
              <span>{collegeData?.news_title || t("news")}</span>
              <span className="absolute ltr:left-0 rtl:right-0 sm:-bottom-4 -bottom-1 md:w-[12ch] w-[120px] sm:h-10 h-3">
                <Image
                  src={`/images/title-shape.svg`}
                  className="object-contain"
                  alt="shape"
                  fill
                  priority
                />
              </span>
            </h1> */}
            <Link
              href={`/${locale}/colleges/${college}/news`}
              className="flex_center gap-5 text-primary font-semibold"
            >
              <div className="relative">
                <h1 className="sm:text-title text-xl">
                  {collegeData?.news_title || t("news")}
                </h1>
                <span className="absolute ltr:right-0 rtl:left-0 sm:bottom-0 -bottom-2 w-28 h-3">
                  <Image
                    src={`/images/title-shape.svg`}
                    alt="park"
                    fill
                    priority
                  />
                </span>
              </div>
              <FaArrowRight className="sm:text-2xl text-xl rtl:rotate-180" />
            </Link>
            <span className="text-sm max-w-[730px] opacity-70 mt-3">
              {collegeData?.news_subtitle || t("news_text")}
            </span>
            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
              {newsData.data.slice(0, 2).map((news) => (
                <NewsCard
                  key={news.id}
                  image={getNewsImage(news)}
                  link={`/${locale}/news/${news.slug}`}
                  author={news.author}
                  createdAt={formatDate(news.published_at)}
                  description={news.excerpt}
                  title={news.title}
                />
              ))}
            </div>
          </div>
        )}

        {/* Departments Section */}
        <div className="w-full flex_center gap-10 md:my-24 my-10 md:flex-row flex-col-reverse">
          <div className="grid grid-cols-2 md:gap-10 gap-3 lg:w-1/2 md:w-[60%] w-full flex-shrink-0">
            {departmentsData && departmentsData.data.length > 0 ? (
              departmentsData.data.slice(0, 2).map((department, index) => (
                <div
                  key={department.id}
                  className={`relative border border-lightBorder ${
                    index === 0 ? "rounded-2xl" : "rounded-3xl"
                  } p-2 flex_center flex-col gap-3 text-center`}
                >
                  <Link
                    href={`/${locale}/colleges/${college}/departments/${department.slug}`}
                    className={`w-full h-[165px] relative overflow-hidden ${
                      index === 0 ? "rounded-2xl" : "rounded-3xl"
                    }`}
                  >
                    <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                      <IoArrowForwardOutline className="rtl:rotate-180" />
                    </div>
                    <Image
                      src={
                        collegeData?.galleries?.[index]?.image?.md ||
                        `/images/campus.png`
                      }
                      className="object-cover"
                      alt="department"
                      fill
                      priority
                    />
                  </Link>
                  <Link
                    href={`/${locale}/colleges/${college}/departments/${department.slug}`}
                    className="sm:text-sm text-[10px] font-semibold px-2 text-center hover:text-primary transition-colors"
                  >
                    {department.title}
                  </Link>
                  <div className="flex_center gap-8 w-full">
                    <div className="flex_center gap-2">
                      <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                        <GoBriefcase />
                      </div>
                      <div className="flex_start flex-col">
                        <small className="font-semibold text-xs">{`+${
                          department.teachers_count || "0"
                        }`}</small>
                        <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                          {t("teachers")}
                        </small>
                      </div>
                    </div>
                    <div className="flex_center gap-2">
                      <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                        <PiStudent />
                      </div>
                      <div className="flex_start flex-col">
                        <small className="font-semibold text-xs">{`+${
                          department.student_number || "0"
                        }`}</small>
                        <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                          {t("students")}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-500">
                {t("no_departments_found")}
              </p>
            )}
          </div>
          <div className="flex_start gap-5 flex-col lg:w-1/2 md:w-[40%] w-full">
            <h1 className="md:max-w-[310px] max-w-full leading-snug font-semibold lg:text-title text-titleNormal relative">
              <span>
                {collegeData?.college_title || t("college_departments")}
              </span>
              <span className="absolute ltr:-right-3 rtl:-left-3 bottom-9 w-14 h-10">
                <Image
                  src="/images/alumni-shape.svg"
                  alt="shape"
                  fill
                  priority
                />
              </span>
            </h1>
            <p className="lg:text-base text-sm text-opacity-70">
              {collegeData?.college_subtitle || t("college_departments_text")}
            </p>
            <Link
              href={`/${locale}/colleges/${college}/departments`}
              className="flex_center gap-5 bg-gradient-to-r from-blue to-primary rounded-3xl lg:py-3 text-sm py-2 lg:px-10 px-5 text-white"
            >
              <span>{t("see_all_departments")}</span>
              <FaChevronRight className="text-lg rtl:rotate-180" />
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div className="flex_center md:flex-row flex-col gap-10 w-full text-secondary">
          <div className="md:w-1/2 w-full flex_start flex-col gap-10">
            <h1 className="lg:text-title md:text-titleNormal text-xl font-semibold ">
              {collegeData?.teacher_title || t("creating_future")}
            </h1>
            <p className="opacity-70 sm:text-base text-sm">
              {collegeData?.about_content || "..."}
            </p>
          </div>
          <div className="md:w-1/2 w-full grid grid-cols-2 gap-1">
            <div className="relative w-[152px] h-[152px]">
              <Image
                src={
                  collegeData?.galleries?.[0]?.image?.sm ||
                  `/images/student-2.png`
                }
                className="object-cover rounded-full"
                alt="student"
                fill
                priority
              />
            </div>
            <div className="max-w-[176px] sm:text-smallTitle text-xl relative">
              <div className="absolute w-[30px] h-[30px] ltr:-right-3 rtl:-left-3 -top-7">
                <Image
                  src={`/images/star.png`}
                  className="object-cover"
                  alt="star"
                  fill
                  priority
                />
              </div>
              {renderContent()}
            </div>
            <div className="max-w-[225px] text-lg text-golden flex justify-center items-center">
              <h1 className="text-start max-w-[125px] -mt-8">
                {t("useful_labs")}
              </h1>
            </div>
            <div className="relative sm:w-[200px] w-[152px] sm:h-[200px] h-[152px]">
              <div className="absolute top-5 -left-5 sm:w-[200px] w-[152px] sm:h-[200px] h-[152px] border-4 border-golden rounded-full"></div>
              <Image
                src={
                  collegeData?.galleries?.[1]?.image?.sm ||
                  `/images/student-1.png`
                }
                className="object-cover rounded-full"
                alt="student"
                fill
                priority
              />
            </div>
          </div>
        </div>

        {/* Events Section */}
        {eventsData?.data && eventsData.data.length > 0 && (
          <div className="w-full flex-col flex_start gap-8 mt-10">
            <Link
              href={`/${locale}/colleges/${college}/events`}
              className="flex items-center gap-5 text-primary font-semibold"
            >
              <div className="relative">
                <h1 className="sm:text-title text-2xl">
                  {collegeData?.event_title || t("new_events")}
                </h1>
                <span className="absolute sm:ltr:-right-6 ltr:-right-8 sm:rtl:-left-6 rtl:-left-7 -top-4 w-14 h-10">
                  <Image
                    src="/images/alumni-shape.svg"
                    alt="shape"
                    fill
                    priority
                  />
                </span>
              </div>
              <FaChevronRight className="sm:text-2xl text-xl rtl:rotate-180" />
            </Link>
            <p className="sm:text-paragraph text-sm text-primary font-medium">
              {collegeData?.event_subtitle || t("new_events_text")}
            </p>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8">
              {eventsData.data.slice(0, 3).map((event) => (
                <EventCard
                  key={event.id}
                  image={getEventImage(event)}
                  link={`/${locale}/events/${event.slug}`}
                  type={event.event_tag?.[0]?.tag?.name || "General"}
                  createdAt={formatDate(event.created_at)}
                  time={event.schedule?.time_string || ""}
                  title={event.title}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeDetailClient;
