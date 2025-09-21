// src/app/[locale]/colleges/[college]/labs/LabsPageClient.tsx

"use client";

import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import useFetch from "@/libs/hooks/useFetch";
import { FaArrowRight } from "react-icons/fa6";

// Interfaces
interface ImageFile {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
  created_at: string;
  updated_at: string;
}

interface College {
  id: number;
  subdomain: string;
  title: string;
  description: string | null;
  // ... other fields
}

interface Department {
  id: number;
  college_id: number;
  slug: string;
  title: string;
  // ... other fields
}

interface LaboratoryDepartment {
  laboratory_id: number;
  department_id: number;
  department: Department;
}

interface Laboratory {
  id: number;
  slug: string;
  name: string;
  lab_number: string;
  equipped_with: string;
  description: string;
  created_at: string;
  updated_at: string;
  departments: LaboratoryDepartment[];
  images: ImageFile[];
  sections: any[];
}

interface LaboratoriesResponse {
  total: number;
  page: number;
  limit: number;
  data: Laboratory[];
}

// Skeleton Components
const LabCardSkeleton = () => (
  <div className="w-full group lg:h-[385px] md:h-[320px] h-[240px] relative rounded-3xl overflow-hidden animate-pulse">
    <div className="w-full h-full bg-gray-300"></div>
    <div className="absolute bottom-5 left-5 right-5">
      <div className="h-6 bg-gray-400 rounded w-3/4"></div>
    </div>
  </div>
);

const PageSkeleton = () => (
  <div className="w-full flex_center flex-col sm:my-10 my-5">
    <div className="max-w-[1379px] px-3 flex_start w-full">
      <div className="animate-pulse w-full h-20 bg-gray-300 rounded-lg"></div>
    </div>
    <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full sm:mt-14 mt-10">
      <SubHeader title="Laboratories" alt={false} />
      <div className="grid w-full md:grid-cols-2 grid-cols-1 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <LabCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

const LabsPageClient = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;

  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data: labsData,
    loading: labsLoading,
    error: labsError,
  } = useFetch<LaboratoriesResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/colleges/${college}/laboratories?page=${page}&limit=${limit}`,
    locale
  );

  useEffect(() => {
    if (labsData?.data) {
      if (page === 1) {
        setLaboratories(labsData.data);
      } else {
        setLaboratories((prev) => [...prev, ...labsData.data]);
      }
    }
  }, [labsData]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const showInitialSkeleton = labsLoading && page === 1;
  const initialError = labsError && page === 1;

  if (initialError) {
    return (
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1024px] px-3 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Laboratories Data
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (showInitialSkeleton) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>
      <div className="max-w-[1024px] sm:mt-14 mt-10 px-3 text-secondary flex_start flex-col gap-10 w-full">
        <SubHeader title={t("labs")} alt={false} />

        <div className="grid w-full md:grid-cols-2 grid-cols-1 gap-5">
          {laboratories.map((lab) => (
            <Link
              key={lab.id}
              href={`/${locale}/colleges/${college}/labs/${lab.slug}`}
              title={lab.name}
              className="w-full text-white group lg:h-[385px] md:h-[320px] h-[240px] relative rounded-3xl overflow-hidden"
            >
              <Image
                src={lab.images?.[0]?.md || "/images/lab.png"}
                className="object-cover w-full h-full"
                alt={lab.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.svg";
                }}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#1B417B8A] to-transparent z-10 group-hover:bg-primary duration-200 group-hover:bg-opacity-40"></div>
              <div className="flex_center text-sm rounded-lg border border-white gap-3 z-20 absolute ltr:left-10 rtl:right-10 bottom-5 px-4 py-2 opacity-0 group-hover:opacity-100 duration-300">
                <span>{t("read_more")}</span>
                <FaArrowRight className="text-lg rtl:rotate-180" />
              </div>
              <h3 className="z-20 absolute ltr:left-5 rtl:right-5 bottom-5 leading-normal md:group-hover:bottom-[70%] group-hover:bottom-[60%] px-4 py-2 md:text-smallTitle text-base group-hover:text-titleNormal group-hover:sm:max-w-[350px] group-hover:max-w-full duration-300">
                {lab.name}
              </h3>
            </Link>
          ))}

          {labsLoading &&
            page > 1 &&
            Array.from({ length: 2 }).map((_, i) => (
              <LabCardSkeleton key={`skeleton-${i}`} />
            ))}
        </div>

        {labsData && laboratories.length < labsData.total && (
          <div className="flex_center w-full my-5">
            <button
              onClick={handleLoadMore}
              disabled={labsLoading}
              className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {labsLoading ? t("loading") : t("see_more")}
            </button>
          </div>
        )}

        {labsError && page > 1 && (
          <div className="text-red-500 text-center w-full">
            {t("error_loading_data")}
          </div>
        )}

        {!labsLoading && laboratories.length === 0 && (
          <div className="text-gray-500 text-center w-full py-10">
            {t("no_laboratories_found")}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabsPageClient;
