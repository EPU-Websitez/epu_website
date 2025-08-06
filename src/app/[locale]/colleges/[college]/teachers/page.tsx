"use client";

import CollegeHeader from "@/components/collegeHeader";
import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { IoMdMail } from "react-icons/io";
import { IoBriefcaseOutline, IoLocationSharp } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";

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

interface College {
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
}

interface StaffMember {
  id: number;
  college_id: number;
  teacher_id: number;
  role_in_college: string;
  created_at: string;
  updated_at: string;
  college: College;
  teacher: Teacher;
}

interface StaffResponse {
  total: number;
  page: number;
  limit: number;
  data: StaffMember[];
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

const PageSkeleton = () => (
  <div className="w-full flex_center flex-col sm:my-10 my-5">
    <div className="max-w-[1379px] px-3 flex_start w-full">
      <div className="animate-pulse w-full h-20 bg-gray-300 rounded-lg"></div>
    </div>
    <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full sm:mt-14 mt-10">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-48"></div>
      </div>
      <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <MemberCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch staff members
  const {
    data: staffData,
    loading: staffLoading,
    error: staffError,
  } = useFetch<StaffResponse>(
    `${API_URL}/website/colleges/${college}/staff?page=${page}&limit=${limit}`
  );

  useEffect(() => {
    if (staffData?.data) {
      if (page === 1) {
        setStaffMembers(staffData.data);
      } else {
        setStaffMembers((prev) => [...prev, ...staffData.data]);
      }
    }
  }, [staffData, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const loading = staffLoading && page === 1;
  const error = staffError && page === 1;

  if (error) {
    return (
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1024px] px-3 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Teachers Data
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
      {loading ? (
        <PageSkeleton />
      ) : (
        <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full sm:mt-14 mt-10">
          <SubHeader title={t("teachers")} alt={false} />

          {/* Teachers Grid */}
          <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            {staffMembers.map((member, i) => (
              <MemberCard
                key={i}
                description={member.role_in_college}
                image={
                  member.teacher.profile_image?.md ||
                  "/images/president-alt.png"
                }
                link={`/${locale}/academic-staff/${member.teacher.id}`}
                staticText={t("view_profile")}
                title={member.teacher.full_name}
              />
            ))}

            {/* Loading skeletons while fetching more data */}
            {staffLoading &&
              page > 1 &&
              Array.from({ length: 3 }).map((_, i) => (
                <MemberCardSkeleton key={`skeleton-${i}`} />
              ))}
          </div>

          {/* Load More Button */}
          {staffData && staffMembers.length < staffData.total && (
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

          {/* Error State for Load More */}
          {staffError && page > 1 && (
            <div className="text-red-500 text-center w-full">
              {t("error_loading_data")}
            </div>
          )}

          {/* No Data State */}
          {!loading && staffData && staffMembers.length === 0 && (
            <div className="text-gray-500 text-center w-full py-10">
              {t("no_teachers_found")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
