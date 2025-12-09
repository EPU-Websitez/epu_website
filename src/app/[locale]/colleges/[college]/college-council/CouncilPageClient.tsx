// src/app/[locale]/colleges/[college]/council/CouncilPageClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import CollegeHeader from "@/components/collegeHeader";
import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import useFetch from "@/libs/hooks/useFetch";
import Image from "next/image";
import Link from "next/link";

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
  profile_image: ProfileImage;
}

interface Lead {
  id: number;
  role: string;
  teacher: Teacher;
}

interface LeadsResponse {
  data: Lead[];
}

interface StaffMember {
  teacher_id: number;
  role: string;
  teacher: Teacher;
}

interface StaffResponse {
  total: number;
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

const DeanSkeleton = () => (
  <div className="flex md:justify-start justify-center md:items-start items-center gap-10 w-full border p-5 rounded-3xl border-lightBorder animate-pulse">
    <div className="sm:w-[310px] w-[125px] sm:h-[285px] h-[125px] bg-gray-300 rounded-3xl"></div>
    <div className="flex_start flex-col gap-5">
      <div className="h-4 bg-gray-300 rounded w-32"></div>
      <div className="h-8 bg-gray-300 rounded w-64"></div>
    </div>
  </div>
);

const PageSkeleton = () => (
  <div className="w-full flex_center flex-col sm:my-10 my-5">
    <div className="max-w-[1379px] px-3 flex_start w-full">
      <div className="animate-pulse w-full h-20 bg-gray-300 rounded-lg"></div>
    </div>
    <div className="max-w-[1024px] sm:mt-14 mt-10 px-3 text-secondary flex_start flex-col gap-10 w-full">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-48"></div>
      </div>
      <DeanSkeleton />
      <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <MemberCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

const CouncilPageClient = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffPage, setStaffPage] = useState(1);
  const staffLimit = 15;

  const {
    data: leadData,
    loading: leadLoading,
    error: leadError,
  } = useFetch<LeadsResponse>(
    college
      ? `${process.env.NEXT_PUBLIC_API_URL}/website/colleges/${college}/leads?page=1&limit=1`
      : "",
    locale
  );

  const {
    data: staffData,
    loading: staffLoading,
    error: staffError,
  } = useFetch<StaffResponse>(
    college
      ? `${process.env.NEXT_PUBLIC_API_URL}/website/colleges/${college}/staff?page=${staffPage}&limit=${staffLimit}`
      : "",
    locale
  );

  useEffect(() => {
    if (staffData?.data) {
      setStaff((prev) => {
        const existingIds = new Set(prev.map((p) => p.teacher.id));
        const newStaff = staffData.data.filter(
          (s) => !existingIds.has(s.teacher.id)
        );
        return [...prev, ...newStaff];
      });
    }
  }, [staffData]);

  const handleLoadMore = () => {
    setStaffPage((prev) => prev + 1);
  };

  const mainLead = leadData?.data?.[0];

  const isInitialLoading = leadLoading && staffPage === 1;
  const initialError = leadError && staffPage === 1;

  if (initialError) {
    return (
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1024px] px-3 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Page Data
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

      {isInitialLoading ? (
        <PageSkeleton />
      ) : (
        <div className="max-w-[1024px] sm:mt-14 mt-10 px-3 text-secondary flex_start flex-col gap-10 w-full">
          <SubHeader title={t("college_council")} alt={false} />

          {mainLead ? (
            <Link
              href={`/${locale}/academic-staff/${mainLead.teacher?.id}`}
              title={mainLead.teacher?.full_name}
              className="flex justify-start md:items-start items-center gap-10 w-full border p-5 rounded-3xl border-lightBorder"
            >
              <div className="sm:w-[310px] w-[125px] sm:h-[285px] h-[125px] relative">
                <Image
                  src={
                    mainLead.teacher?.profile_image?.md ||
                    "/images/placeholder.svg"
                  }
                  alt={mainLead.teacher?.full_name}
                  fill
                  priority
                  className="w-full h-auto object-cover sm:rounded-3xl rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.svg";
                  }}
                />
              </div>
              <div className="flex_start flex-col gap-5">
                <h3 className="text-golden sm:text-lg text-sm font-semibold">
                  {mainLead.role}
                </h3>
                <h1 className="max-w-[350px] lg:text-title sm:text-smallTitle text-xs font-medium relative">
                  <span className="relative z-10 font-medium">
                    {mainLead.teacher?.full_name}
                  </span>
                  <span className="absolute ltr:left-0 rtl:right-0 -bottom-3 w-[80%] h-6">
                    <Image
                      src="/images/title-shape.svg"
                      alt="shape"
                      fill
                      priority
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.svg";
                      }}
                    />
                  </span>
                </h1>
              </div>
            </Link>
          ) : (
            !leadLoading && (
              <div className="text-gray-500 text-center w-full py-5">
                {t("no_dean_found")}
              </div>
            )
          )}

          <div className="grid w-full lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8">
            {staff.map((member) => (
              <MemberCard
                key={`${member.teacher?.id}-${member.role}`}
                description={member.role}
                image={
                  member.teacher?.profile_image?.md || "/images/placeholder.svg"
                }
                link={`/${locale}/academic-staff/${member.teacher?.id}`}
                staticText={t("view_profile")}
                title={member.teacher?.full_name}
              />
            ))}

            {staffLoading &&
              staffPage > 1 &&
              Array.from({ length: 3 }).map((_, i) => (
                <MemberCardSkeleton key={`skeleton-${i}`} />
              ))}
          </div>

          {staffData && staff.length < staffData.total && (
            <div className="flex_center w-full my-5">
              <button
                onClick={handleLoadMore}
                disabled={staffLoading}
                className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                {staffLoading ? t("loading") : t("see_more")}
              </button>
            </div>
          )}

          {staffError && staffPage > 1 && (
            <div className="text-red-500 text-center w-full">
              {t("error_loading_data")}
            </div>
          )}

          {!leadLoading && !mainLead && staff.length === 0 && (
            <div className="text-gray-500 text-center w-full py-10">
              {t("no_council_members_found")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouncilPageClient;
