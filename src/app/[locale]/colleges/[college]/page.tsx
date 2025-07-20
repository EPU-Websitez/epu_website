"use client";

import CollegeHeader from "@/components/collegeHeader";
import EventCard from "@/components/eventCards";
import NewsCard from "@/components/newsCard";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowRight, FaChevronRight } from "react-icons/fa6";
import { GoArrowRight, GoBriefcase } from "react-icons/go";
import { IoArrowForwardOutline } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useEffect, useState } from "react";

// Interfaces
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
  college_id: number;
  image_id: number;
  created_at: string;
  updated_at: string;
  image: Image;
}

interface Contact {
  id: number;
  college_id: number;
  type: string;
  value: string;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: number;
  college_id: number;
  latitude: string;
  longitude: string;
  location: string;
  created_at: string;
  updated_at: string;
}

interface Department {
  id: number;
  college_id: number;
  slug: string;
  title_en: string;
  title_ku: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ku: string;
  subtitle_ar: string;
  about_en: string;
  about_ku: string;
  about_ar: string;
  vision_en: string;
  vision_ku: string;
  vision_ar: string;
  mission_en: string;
  mission_ku: string;
  mission_ar: string;
  priority: number;
  created_at: string;
  updated_at: string;
  college: {
    id: number;
    subdomain: string;
    title: string;
  };
  title: string;
  subtitle: string;
  about: string;
  vision: string;
  mission: string;
}

interface DepartmentsResponse {
  total: number;
  page: number;
  limit: number;
  data: Department[];
}

interface CollegeData {
  id: number;
  subdomain: string;
  title: string;
  news_title: string;
  news_subtitle: string;
  college_title: string;
  college_subtitle: string;
  teacher_title: string;
  teacher_subtitle: string;
  event_title: string;
  event_subtitle: string;
  about_title: string;
  about_content: string;
  student_number: string;
  vision: string;
  mission: string;
  logo_image_id: number;
  priority: number;
  created_at: string;
  updated_at: string;
  galleries: Gallery[];
  contacts: Contact[];
  addresses: Address[];
  logo: Image;
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

const DepartmentSkeleton = () => (
  <div className="animate-pulse border border-lightBorder rounded-2xl p-2">
    <div className="w-full h-[165px] bg-gray-300 rounded-2xl mb-3"></div>
    <div className="h-3 bg-gray-300 rounded w-3/4 mb-3 mx-auto"></div>
    <div className="flex justify-center gap-8">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
        <div>
          <div className="h-2 bg-gray-300 rounded w-8 mb-1"></div>
          <div className="h-2 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
        <div>
          <div className="h-2 bg-gray-300 rounded w-8 mb-1"></div>
          <div className="h-2 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  </div>
);

const EventSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
    <div className="h-3 bg-gray-300 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
  </div>
);

const CollegeSkeleton = () => (
  <div className="w-full flex_center flex-col sm:my-10 my-5">
    <div className="max-w-[1379px] px-3 flex_start w-full">
      <div className="animate-pulse w-full h-20 bg-gray-300 rounded-lg"></div>
    </div>
    <div className="max-w-[1040px] px-3 text-secondary sm:mt-14 mt-10 flex_start flex-col gap-5 w-full">
      {/* News Section Skeleton */}
      <div className="animate-pulse">
        <div className="h-12 bg-gray-300 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
        <NewsSkeleton />
        <NewsSkeleton />
      </div>

      {/* Department Section Skeleton */}
      <div className="w-full flex_center gap-10 md:my-24 my-10 md:flex-row flex-col-reverse">
        <div className="grid grid-cols-2 md:gap-10 gap-3 lg:w-1/2 md:w-[60%] w-full flex-shrink-0">
          <DepartmentSkeleton />
          <DepartmentSkeleton />
        </div>
        <div className="animate-pulse lg:w-1/2 md:w-[40%] w-full">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5 mb-6"></div>
          <div className="h-10 bg-gray-300 rounded-3xl w-48"></div>
        </div>
      </div>

      {/* Events Section Skeleton */}
      <div className="animate-pulse mb-8">
        <div className="h-8 bg-gray-300 rounded w-56 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8">
        <EventSkeleton />
        <EventSkeleton />
        <EventSkeleton />
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string; // Assuming college comes from params

  const {
    data: collegeData,
    loading,
    error,
  } = useFetch<CollegeData>(`${API_URL}/website/colleges/${college}`);

  const { data: departmentsData, loading: departmentsLoading } =
    useFetch<DepartmentsResponse>(
      `${API_URL}/website/colleges/${college}/departments?page=1&limit=2`
    );

  // Get localized content function
  const getLocalizedContent = (item: any, field: string) => {
    const suffix = locale === "ku" ? "_ku" : locale === "ar" ? "_ar" : "_en";
    return item[`${field}${suffix}`] || item[`${field}_en`] || "";
  };

  if (loading || departmentsLoading) {
    return <CollegeSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1040px] px-3 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading College Data
          </h1>
          <p className="text-gray-600">Please try again later.</p>
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
        <h1 className="lg:text-[50px] md:text-title text-xl text-start font-bold lg:max-w-[840px] md:max-w-[700px] max-w-[90%] relative">
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
        </h1>
        <span className="text-sm max-w-[730px] opacity-70 mt-3">
          {collegeData?.news_subtitle || t("news_text")}
        </span>

        {/* News Section - Keep static for now since news data not in API */}
        <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
          <NewsCard
            image={collegeData?.galleries?.[0]?.image?.md || "/images/news.png"}
            link="/"
            author="Craig Bator"
            createdAt="27 Dec 2020"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
            title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
          />
          <NewsCard
            image={collegeData?.galleries?.[1]?.image?.md || "/images/news.png"}
            link="/"
            author="Craig Bator"
            createdAt="27 Dec 2020"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
            title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
          />
        </div>

        {/* Departments Section */}
        <div className="w-full flex_center gap-10 md:my-24 my-10 md:flex-row flex-col-reverse">
          <div className="grid grid-cols-2 md:gap-10 gap-3 lg:w-1/2 md:w-[60%] w-full flex-shrink-0">
            {departmentsData?.data?.slice(0, 2).map((department, index) => (
              <div
                key={department.id}
                className={`relative border border-lightBorder ${
                  index === 0 ? "rounded-2xl" : "rounded-3xl"
                } p-2 flex_center flex-col gap-3 text-center`}
              >
                <Link
                  href={`/departments/${department.slug}`}
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
                  href={`/departments/${department.slug}`}
                  className="sm:text-sm text-[10px] font-semibold px-2 text-center"
                >
                  {getLocalizedContent(department, "title")}
                </Link>
                <div className="flex_center gap-8 w-full">
                  <div className="flex_center gap-2">
                    <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                      <GoBriefcase />
                    </div>
                    <div className="flex_start flex-col">
                      <small className="font-semibold sm:text-[10px] text-[8px]">
                        +12.4 K
                      </small>
                      <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                        Teachers
                      </small>
                    </div>
                  </div>
                  <div className="flex_center gap-2">
                    <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                      <PiStudent />
                    </div>
                    <div className="flex_start flex-col">
                      <small
                        className={`font-semibold ${
                          index === 0 ? "sm:text-[10px] text-[8px]" : "text-xs"
                        }`}
                      >
                        {index === 0
                          ? collegeData?.student_number || "+12.4 K"
                          : "+15.1 K"}
                      </small>
                      <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                        {index === 0 ? "Students" : "Students"}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            )) || [
              // Fallback to static departments if no API data
              <div
                key="dept1"
                className="relative border border-lightBorder rounded-2xl p-2 flex_center flex-col gap-3 text-center"
              >
                <Link
                  href={""}
                  className="w-full h-[165px] relative overflow-hidden rounded-2xl"
                >
                  <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                    <IoArrowForwardOutline className="rtl:rotate-180" />
                  </div>
                  <Image
                    src={
                      collegeData?.galleries?.[0]?.image?.md ||
                      `/images/campus.png`
                    }
                    className="object-cover"
                    alt="department"
                    fill
                    priority
                  />
                </Link>
                <Link
                  href={""}
                  className="sm:text-sm text-[10px] font-semibold"
                >
                  Architectural Engineering Department
                </Link>
                <div className="flex_center gap-8 w-full">
                  <div className="flex_center gap-2">
                    <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                      <GoBriefcase />
                    </div>
                    <div className="flex_start flex-col">
                      <small className="font-semibold sm:text-[10px] text-[8px]">
                        +12.4 K
                      </small>
                      <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                        Teachers
                      </small>
                    </div>
                  </div>
                  <div className="flex_center gap-2">
                    <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                      <PiStudent />
                    </div>
                    <div className="flex_start flex-col">
                      <small className="font-semibold sm:text-[10px] text-[8px]">
                        {collegeData?.student_number || "+12.4 K"}
                      </small>
                      <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                        Students
                      </small>
                    </div>
                  </div>
                </div>
              </div>,
              <div
                key="dept2"
                className="relative border border-lightBorder rounded-3xl p-2 flex_center flex-col gap-3 text-center"
              >
                <Link
                  href={""}
                  className="w-full h-[165px] relative overflow-hidden rounded-3xl"
                >
                  <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                    <IoArrowForwardOutline className="rtl:rotate-180" />
                  </div>
                  <Image
                    src={
                      collegeData?.galleries?.[1]?.image?.md ||
                      `/images/campus.png`
                    }
                    className="object-cover"
                    alt="department"
                    fill
                    priority
                  />
                </Link>
                <Link
                  href={""}
                  className="sm:text-sm text-[10px] font-semibold"
                >
                  Computer Engineering Department
                </Link>
                <div className="flex_center gap-8 w-full">
                  <div className="flex_center gap-2">
                    <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                      <GoBriefcase />
                    </div>
                    <div className="flex_start flex-col">
                      <small className="font-semibold sm:text-[10px] text-[8px]">
                        +8.2 K
                      </small>
                      <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                        Teachers
                      </small>
                    </div>
                  </div>
                  <div className="flex_center gap-2">
                    <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                      <PiStudent />
                    </div>
                    <div className="flex_start flex-col">
                      <small className="font-medium text-xs">+15.1 K</small>
                      <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                        Students
                      </small>
                    </div>
                  </div>
                </div>
              </div>,
            ]}
          </div>
          <div className="flex_start gap-5 flex-col lg:w-1/2 md:w-[40%] w-full">
            <h1 className="md:max-w-[280px] max-w-full leading-snug font-semibold lg:text-title text-titleNormal relative">
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
              href={""}
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
              {collegeData?.about_title || t("creating_future")}
            </h1>
            <p className="opacity-70 sm:text-base text-sm">
              {collegeData?.about_content ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Gravida dictum fusce ut placerat."}
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

            <div className="max-w-[125px] sm:text-smallTitle text-xl relative">
              <div className="absolute w-[30px] h-[30px] ltr:-right-3 rtl:-left-3 -top-7">
                <Image
                  src={`/images/star.png`}
                  className="object-cover"
                  alt="star"
                  fill
                  priority
                />
              </div>
              {collegeData?.teacher_title || t("great_teacher")}
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
        <div className="max-w-[1040px] w-full flex-col flex_start gap-8 mt-10 px-3">
          <Link
            href={"events"}
            className="flex_center gap-5 text-primary font-semibold"
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
            <FaArrowRight className="sm:text-2xl text-xl rtl:rotate-180" />
          </Link>
          <p className="sm:text-paragraph text-sm text-primary font-medium">
            {collegeData?.event_subtitle || t("new_events_text")}
          </p>

          {/* Events Grid - Keep static for now since events data not in API */}
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8">
            <EventCard
              image={
                collegeData?.galleries?.[0]?.image?.md || "/images/event.png"
              }
              link="/"
              type="Computation"
              createdAt="27 Dec 2020"
              time="1:14 PM"
              title="Innovate & Compete: Annual Student Innovation Challenge."
            />
            <EventCard
              image={
                collegeData?.galleries?.[1]?.image?.md || "/images/event.png"
              }
              link="/"
              type="Computation"
              createdAt="27 Dec 2020"
              time="1:14 PM"
              title="Innovate & Compete: Annual Student Innovation Challenge."
            />
            <EventCard
              image="/images/event.png"
              link="/"
              type="Computation"
              createdAt="27 Dec 2020"
              time="1:14 PM"
              title="Innovate & Compete: Annual Student Innovation Challenge."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
