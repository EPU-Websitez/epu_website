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

// --- Interfaces and Skeletons (no changes here) ---
interface ProfileImage {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}
interface Teacher {
  id: number;
  full_name: string;
  title: string;
  profile_image: ProfileImage;
}
interface Department {
  id: number;
  slug: string;
  title: string;
}
interface Lead {
  id: number;
  role: string;
  department: Department;
  teacher: Teacher;
}
interface LeadsResponse {
  total: number;
  page: number;
  limit: number;
  data: Lead[];
}

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
    {Array.from({ length: 7 }).map((_, i) => (
      <div
        key={i}
        className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] bg-gray-300 animate-pulse sm:rounded-3xl rounded-xl"
      />
    ))}
  </div>
);

// --- Main component that fetches and displays data ---
const DepartmentCouncilPage = ({
  slug,
  college,
  locale,
}: {
  slug: string;
  college: string;
  locale: string;
}) => {
  const t = useTranslations("Colleges");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  // Now, `slug` is guaranteed to be a string, so we can safely build the URL.
  const {
    data: leadsData,
    loading: leadsLoading,
    error: leadsError,
  } = useFetch<LeadsResponse>(
    `${API_URL}/website/departments/${slug}/leads?page=${page}&limit=${limit}`
  );

  useEffect(() => {
    if (leadsData?.data) {
      // Logic to append data for "Load More"
      if (leadsData.page === 1) {
        setLeads(leadsData.data);
      } else {
        setLeads((prev) => [...prev, ...leadsData.data]);
      }
    }
  }, [leadsData]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const departmentHead = leads.find((lead) =>
    ["head", "رئيس", "dean", "عميد"].some((role) =>
      lead.role.toLowerCase().includes(role)
    )
  );
  const otherLeads = leads.filter((lead) => lead.id !== departmentHead?.id);

  if (leadsError && leads.length === 0) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load staff data.
      </div>
    );
  }

  // --- JSX for the main content ---
  return (
    <div className="max-w-[1040px] flex_start w-full">
      <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
        <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] lg:flex-row flex-col-reverse">
          {/* Navigation Sidebar */}
          <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
            <Link
              href={`/${locale}/colleges/${college}/departments/${slug}`}
              className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("about_button")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/colleges/${college}/departments/${slug}/vision-and-mission`}
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
              className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("news_button")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/colleges/${college}/departments/${slug}/researches`}
              className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("researches")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/colleges/${college}/departments/${slug}/course-subjects`}
              className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("course_subjects")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/colleges/${college}/departments/${slug}/guide-lines`}
              className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("guide_lines")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
          </div>

          {/* Content Area */}
          <div className="lg:border-l text-secondary border-l-none lg:border-b-0 border-b lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
            <SubHeader title={t("department_staff")} alt={false} />
            {departmentHead && (
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
                </div>
              </div>
            )}
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
            </div>
            {leadsData && leads.length < leadsData.total && (
              <div className="flex_center w-full my-5">
                <button
                  onClick={handleLoadMore}
                  disabled={leadsLoading}
                  className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                >
                  {leadsLoading ? t("loading") : t("see_more")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Wrapper component that handles loading states and slug validation ---
const Page = () => {
  const params = useParams();
  // We get the params here but don't cast them yet.
  const slug = params?.slug;
  const college = params?.college;
  const locale = params?.locale;

  // Show a full page skeleton if the params aren't ready yet.
  if (!slug || !college || !locale) {
    return (
      <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
        <div className="animate-pulse w-full h-[335px] bg-gray-300"></div>
        <div className="max-w-[1040px] px-3 flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] lg:flex-row flex-col-reverse">
              <NavigationSkeleton />
              <div className="lg:border-l text-secondary border-l-none lg:border-b-0 border-b lg:pl-10 pb-10 w-full">
                <div className="animate-pulse h-8 bg-gray-300 rounded w-48 mb-7"></div>
                <DepartmentHeadSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Once params are ready, render the main page with guaranteed string props.
  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader />
      <DepartmentCouncilPage
        slug={slug as string}
        college={college as string}
        locale={locale as string}
      />
    </div>
  );
};

export default Page;
