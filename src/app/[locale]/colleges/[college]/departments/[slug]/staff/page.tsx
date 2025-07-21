"use client";

import DepartmentHeader from "@/components/departmentHeader";
import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

// Interfaces
interface ProfileImage {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
  created_at: string;
  updated_at: string;
}

interface Teacher {
  id: number;
  user_id: number;
  full_name: string;
  title: string;
  general_spec: string;
  specific_spec: string;
  biography: string;
  social_link: string | null;
  profile_image_id: number;
  bg_image_id: number;
  created_at: string;
  updated_at: string;
  profile_image: ProfileImage;
  bg_image: ProfileImage;
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
}

interface Lead {
  id: number;
  department_id: number;
  teacher_id: number;
  priority: number;
  role: string;
  created_at: string;
  updated_at: string;
  department: Department;
  teacher: Teacher;
}

interface LeadsResponse {
  total: number;
  page: number;
  limit: number;
  data: Lead[];
}

// Skeleton Components
const MemberCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const DepartmentHeadSkeleton = () => (
  <div className="flex_center gap-10 sm:w-auto w-full border sm:border-none sm:p-0 p-5 sm:rounded-none rounded-3xl border-lightBorder animate-pulse">
    <div className="sm:w-[200px] w-[125px] sm:h-[190px] h-[125px] bg-gray-300 sm:rounded-3xl rounded-lg"></div>
    <div className="flex_start flex-col gap-5">
      <div className="h-4 bg-gray-300 rounded w-32"></div>
      <div className="h-6 bg-gray-300 rounded w-48"></div>
    </div>
  </div>
);

const NavigationSkeleton = () => (
  <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] bg-gray-300 animate-pulse sm:rounded-3xl rounded-xl"
      />
    ))}
  </div>
);

const PageSkeleton = () => (
  <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
    <div className="animate-pulse w-full h-32 bg-gray-300"></div>
    <div className="max-w-[1040px] px-3 flex_start w-full">
      <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
        <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
          <NavigationSkeleton />
          <div className="lg:border-l text-secondary border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48"></div>
            </div>
            <DepartmentHeadSkeleton />
            <div className="grid w-full lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <MemberCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;
  const college = params?.college as string;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const limit = 15;

  // Fetch department leads with pagination
  const {
    data: leadsData,
    loading: leadsLoading,
    error: leadsError,
  } = useFetch<LeadsResponse>(
    `${API_URL}/website/departments/${slug}/leads?page=${page}&limit=${limit}`
  );

  useEffect(() => {
    if (leadsData?.data) {
      if (page === 1) {
        setLeads(leadsData.data);
      } else {
        setLeads((prev) => [...prev, ...leadsData.data]);
      }
    }
  }, [leadsData, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Get the department head from leads data
  const departmentHead = leads.find(
    (lead) =>
      lead.role.toLowerCase().includes("head") ||
      lead.role.toLowerCase().includes("رئيس") ||
      lead.role.toLowerCase().includes("dean") ||
      lead.role.toLowerCase().includes("عميد")
  );

  // Get other leads (excluding the department head)
  const otherLeads = leads.filter(
    (lead) =>
      !lead.role.toLowerCase().includes("head") &&
      !lead.role.toLowerCase().includes("رئيس") &&
      !lead.role.toLowerCase().includes("dean") &&
      !lead.role.toLowerCase().includes("عميد")
  );

  const loading = leadsLoading && page === 1;
  const error = leadsError && page === 1;

  if (error) {
    return (
      <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
        <DepartmentHeader />
        <div className="max-w-[1040px] px-3 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Department Staff Data
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader />
      <div className="max-w-[1040px] px-3 flex_start w-full">
        <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
            {/* Navigation Sidebar */}
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
              <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                <span>{t("council_staff")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </div>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/news`}
                title={t("news_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("news_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
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

            {/* Content Area */}

            {loading ? (
              <PageSkeleton />
            ) : (
              <div className="lg:border-l text-secondary border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <div className="md:block hidden">
                  <SubHeader title={t("department_staff")} alt={false} />
                </div>
                <h2 className="md:hidden block relative text-lg font-semibold ">
                  <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                  <span className="z-10 relative">{t("department_staff")}</span>
                </h2>

                {/* Department Head Section */}
                {departmentHead ? (
                  <div className="flex_start gap-10 sm:w-auto w-full border sm:border-none sm:p-0 p-5 sm:rounded-none rounded-3xl border-lightBorder">
                    <div className="sm:w-[200px] w-[125px] sm:h-[190px] h-[125px] relative">
                      <Image
                        src={
                          departmentHead.teacher.profile_image?.md ||
                          "/images/president-alt.png"
                        }
                        alt={departmentHead.teacher.full_name}
                        fill
                        priority
                        className="w-full h-auto object-cover sm:rounded-3xl rounded-lg"
                      />
                    </div>
                    <div className="flex_start flex-col gap-5">
                      <h3 className="text-golden sm:text-lg text-sm font-semibold">
                        {departmentHead.role}
                      </h3>
                      <h1 className="max-w-[250px] lg:text-xl sm:text-lg text-xs font-semibold relative">
                        <span className="relative z-10">
                          {departmentHead.teacher.full_name}
                        </span>
                        <span className="absolute ltr:left-0 rtl:right-0 -bottom-3 w-[80%] h-6">
                          <Image
                            src="/images/title-shape.svg"
                            alt="shape"
                            fill
                            priority
                          />
                        </span>
                      </h1>
                      {departmentHead.teacher.title && (
                        <p className="text-sm text-gray-600 font-medium">
                          {departmentHead.teacher.title}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  // Show message if no department head found
                  <div className="text-gray-500 text-center w-full py-5">
                    {t("no_department_head_found")}
                  </div>
                )}

                {/* Other Staff Members Grid */}
                <div className="grid w-full lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-8">
                  {otherLeads.map((lead) => (
                    <MemberCard
                      key={lead.id}
                      description={lead.role}
                      image={
                        lead.teacher.profile_image?.md ||
                        "/images/president-alt.png"
                      }
                      link={`/${locale}/academic-staff/${lead.teacher.id}`}
                      staticText={t("view_profile")}
                      title={lead.teacher.full_name}
                    />
                  ))}

                  {/* Loading skeletons while fetching more data */}
                  {leadsLoading &&
                    page > 1 &&
                    Array.from({ length: 2 }).map((_, i) => (
                      <MemberCardSkeleton key={`skeleton-${i}`} />
                    ))}
                </div>

                {/* Load More Button */}
                {leadsData && leads.length < leadsData.total && (
                  <div className="flex_center w-full my-5">
                    <button
                      onClick={handleLoadMore}
                      disabled={leadsLoading}
                      className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      {leadsLoading ? t("loading") : t("see_more")}
                    </button>
                  </div>
                )}

                {/* Error State for Load More */}
                {leadsError && page > 1 && (
                  <div className="text-red-500 text-center w-full">
                    {t("error_loading_data")}
                  </div>
                )}

                {/* No Data State */}
                {!loading && leadsData && leads.length === 0 && (
                  <div className="text-gray-500 text-center w-full py-10">
                    {t("no_department_staff_found")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
