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

// --- Interfaces ---
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

// Lead interfaces (for department head)
interface Lead {
  id: number;
  role: string;
  teacher: Teacher;
}

interface LeadsResponse {
  data: Lead[];
}

// Staff interfaces (for other members)
interface StaffMember {
  id: number;
  role_in_department: string;
  teacher: Teacher;
}

interface StaffResponse {
  total: number;
  page: number;
  limit: number;
  data: StaffMember[];
}

// --- Skeletons ---
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

  // State for Department Head (from leads endpoint)
  const [leads, setLeads] = useState<Lead[]>([]);
  const { data: leadsData, loading: leadsLoading } = useFetch<LeadsResponse>(
    `${API_URL}/website/departments/${slug}/leads?page=1&limit=10`,
    locale
  );

  // State for Staff members
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffPage, setStaffPage] = useState(1);
  const {
    data: staffData,
    loading: staffLoading,
    error: staffError,
  } = useFetch<StaffResponse>(
    `${API_URL}/website/departments/${slug}/staff?page=${staffPage}&limit=12`,
    locale
  );

  // Effect to process leads data
  useEffect(() => {
    if (leadsData?.data) {
      setLeads(leadsData.data);
    }
  }, [leadsData]);

  // Effect to process and append staff data
  useEffect(() => {
    if (staffData?.data) {
      if (staffData.page === 1) {
        setStaff(staffData.data);
      } else {
        setStaff((prev) => [...prev, ...staffData.data]);
      }
    }
  }, [staffData]);

  const handleLoadMoreStaff = () => {
    setStaffPage((prev) => prev + 1);
  };

  // Find the department head from the leads data
  const departmentHead = leads.find((lead) =>
    ["head", "رئيس", "dean", "عميد", "ڕاگر", "سەرۆک"].some((role) =>
      lead.role.toLowerCase().includes(role)
    )
  );

  // Helper function to safely get the best available image with fallbacks
  const getProfileImage = (teacher: Teacher | undefined) => {
    if (!teacher?.profile_image) return "/images/president-alt.png";
    return (
      teacher.profile_image.lg ||
      teacher.profile_image.md ||
      teacher.profile_image.original ||
      "/images/president-alt.png"
    );
  };

  const isInitialLoading =
    leadsLoading && staff.length === 0 && staffPage === 1;

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
            {isInitialLoading ? (
              <DepartmentHeadSkeleton />
            ) : (
              departmentHead && (
                <Link
                  title={departmentHead.teacher?.full_name}
                  href={`/${locale}/academic-staff/${departmentHead.teacher?.id}`}
                  className="flex_start gap-10 sm:w-auto w-full border sm:border-none sm:p-0 p-5 sm:rounded-none rounded-3xl border-lightBorder"
                >
                  <div className="sm:w-[200px] w-[125px] sm:h-[190px] h-[125px] relative">
                    <Image
                      src={getProfileImage(departmentHead.teacher)}
                      alt={
                        departmentHead.teacher?.full_name || "Department Head"
                      }
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
                        {departmentHead.teacher?.full_name}
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
                </Link>
              )
            )}
            <div className="grid w-full lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-8">
              {isInitialLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <MemberCardSkeleton key={i} />
                  ))
                : staff.map((member) => (
                    <MemberCard
                      key={member.id}
                      description={member.role_in_department}
                      image={getProfileImage(member.teacher)}
                      link={`/${locale}/academic-staff/${member.teacher?.id}`}
                      staticText={t("view_profile")}
                      title={member.teacher?.full_name}
                    />
                  ))}
            </div>

            {/* No Data Found Message */}
            {!staffLoading && staff.length === 0 && !staffError && (
              <div className="w-full text-center py-10 text-gray-500">
                {t("no_data_found")}
              </div>
            )}

            {/* Error Message */}
            {staffError && staff.length === 0 && (
              <div className="w-full text-center py-10 text-red-500">
                Failed to load staff members.
              </div>
            )}

            {/* Load More Button */}
            {staffData && staff.length < staffData.total && (
              <div className="flex_center w-full my-5">
                <button
                  onClick={handleLoadMoreStaff}
                  disabled={staffLoading}
                  className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                >
                  {staffLoading ? t("loading") : t("see_more")}
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
                <div className="grid w-full lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-8 mt-7">
                  <MemberCardSkeleton />
                  <MemberCardSkeleton />
                </div>
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
