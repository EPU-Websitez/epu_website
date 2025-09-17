// src/app/[locale]/colleges/[college]/departments/DepartmentsPageClient.tsx

"use client";

import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  image: ImageFile;
}

interface College {
  id: number;
  subdomain: string;
  title: string;
  // ... other fields
}

interface Department {
  id: number;
  slug: string;
  title: string;
  student_number: string;
  college: College;
  galleries: Gallery[];
  staffCount: number;
  leadCount: number;
}

interface DepartmentsResponse {
  total: number;
  page: number;
  limit: number;
  data: Department[];
}

// Skeleton Components
const DepartmentCardSkeleton = () => (
  <div className="relative border border-lightBorder rounded-3xl p-2 flex_center flex-col gap-3 text-center animate-pulse">
    <div className="w-full h-[165px] bg-gray-300 rounded-3xl"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    <div className="flex_center gap-8 w-full">
      <div className="flex_center gap-2">
        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
        <div className="flex_start flex-col gap-1">
          <div className="h-2 bg-gray-300 rounded w-8"></div>
          <div className="h-2 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
      <div className="flex_center gap-2">
        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
        <div className="flex_start flex-col gap-1">
          <div className="h-2 bg-gray-300 rounded w-8"></div>
          <div className="h-2 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
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
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 w-full flex-shrink-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <DepartmentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

const DepartmentsPageClient = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data: departmentsData,
    loading,
    error,
  } = useFetch<DepartmentsResponse>(
    `${API_URL}/website/departments?page=${page}&limit=${limit}&college_subdomain=${college}`,
    locale
  );

  useEffect(() => {
    if (departmentsData?.data) {
      if (page === 1) {
        setDepartments(departmentsData.data);
      } else {
        setDepartments((prev) => [...prev, ...departmentsData.data]);
      }
    }
  }, [departmentsData]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const getDepartmentImage = (department: Department) => {
    return department.galleries?.[0]?.image?.lg || `/images/campus.png`;
  };

  if (error && page === 1 && !loading) {
    return (
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1024px] px-3 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Departments
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (loading && page === 1) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>

      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full sm:mt-14 mt-10">
        <SubHeader title={t("departments")} alt={false} />

        {departments.length > 0 ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-5 gap-2 w-full flex-shrink-0">
            {departments.map((department, i) => (
              <div
                key={`${department.id}-${i}`}
                className="relative border border-lightBorder rounded-3xl p-2 flex_center flex-col gap-3 text-center"
              >
                <Link
                  href={`/${locale}/colleges/${college}/departments/${department.slug}`}
                  title={department.title}
                  className="w-full h-[165px] relative overflow-hidden rounded-3xl group"
                >
                  <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm transition-all group-hover:scale-110">
                    <IoArrowForwardOutline className="rtl:rotate-180" />
                  </div>
                  <Image
                    src={getDepartmentImage(department)}
                    className="object-cover transition-transform group-hover:scale-105"
                    alt={department.title}
                    fill
                    priority={i < 4}
                  />
                </Link>
                <Link
                  href={`/${locale}/colleges/${college}/departments/${department.slug}`}
                  className="sm:text-sm text-[10px] font-semibold px-2 text-center hover:text-primary transition-colors"
                  title={department.title}
                >
                  {department.title}
                </Link>
                <div className="flex_center gap-8 w-full">
                  <div className="flex_center gap-2">
                    <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                      <GoBriefcase />
                    </div>
                    <div className="flex_start flex-col">
                      <small className="font-medium sm:text-[10px] text-[8px]">
                        +{department.staffCount || "0"}
                      </small>
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
                      <small className="font-medium sm:text-[10px] text-[8px]">
                        +{department.student_number || 0}
                      </small>
                      <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                        {t("students")}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center w-full py-10">
            <div className="flex_center flex-col gap-4">
              <div className="text-4xl">🏢</div>
              <h3 className="text-lg font-medium">
                {t("no_departments_found")}
              </h3>
            </div>
          </div>
        )}

        {departmentsData && departments.length < departmentsData.total && (
          <div className="flex_center w-full my-5">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? t("loading") : t("see_more")}
            </button>
          </div>
        )}

        {error && page > 1 && (
          <div className="text-red-500 text-center w-full">
            {t("error_loading_data")}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPageClient;
