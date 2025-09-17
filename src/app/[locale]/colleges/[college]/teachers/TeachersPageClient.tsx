"use client";

import CollegeHeader from "@/components/collegeHeader";
import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// --- Interfaces (Updated for the new API response) ---
interface ProfileImage {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface Teacher {
  id: number;
  user_id: number;
  full_name: string;
  title: string; // This will be used as the description in the MemberCard
  general_spec: string;
  specific_spec: string;
  biography: string;
  social_link: string | null;
  profile_image: ProfileImage;
}

interface TeachersResponse {
  total: number;
  page: number;
  limit: number;
  data: Teacher[];
}

// --- Skeleton Components (Unchanged) ---
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

const TeachersPageClient = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  // --- CHANGE: Updated API endpoint ---
  const {
    data: teachersData,
    loading: teachersLoading,
    error: teachersError,
  } = useFetch<TeachersResponse>(
    `${API_URL}/website/colleges/${college}/teachers?page=${page}&limit=${limit}`,
    locale
  );

  useEffect(() => {
    if (teachersData?.data) {
      if (page === 1) {
        setTeachers(teachersData.data);
      } else {
        // Prevent adding duplicate entries on re-renders
        setTeachers((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const newTeachers = teachersData.data.filter(
            (t) => !existingIds.has(t.id)
          );
          return [...prev, ...newTeachers];
        });
      }
    }
  }, [teachersData, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const loading = teachersLoading && page === 1;
  const error = teachersError && page === 1;

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

          <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            {/* --- CHANGE: Mapping over 'teachers' with new data structure --- */}
            {teachers.map((teacher) => (
              <MemberCard
                key={teacher.id}
                description={teacher.title}
                image={teacher.profile_image?.md || "/images/president-alt.png"}
                link={`/${locale}/academic-staff/${teacher.id}`}
                staticText={t("view_profile")}
                title={teacher.full_name}
              />
            ))}
          </div>

          {teachersData && teachers.length < teachersData.total && (
            <div className="flex_center w-full my-5">
              <button
                onClick={handleLoadMore}
                disabled={teachersLoading}
                className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                {teachersLoading ? t("loading") : t("see_more")}
              </button>
            </div>
          )}

          {teachersError && page > 1 && (
            <div className="text-red-500 text-center w-full">
              {t("error_loading_data")}
            </div>
          )}

          {!loading && teachersData && teachers.length === 0 && (
            <div className="text-gray-500 text-center w-full py-10">
              {t("no_teachers_found")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeachersPageClient;
