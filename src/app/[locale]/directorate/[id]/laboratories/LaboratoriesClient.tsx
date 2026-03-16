"use client";

import SubHeader from "@/components/subHeader";
import DirectorateHeader from "@/components/DirectorateHeader";
import DirectorateSidebar from "@/components/DirectorateSidebar";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import useFetch from "@/libs/hooks/useFetch";

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

interface Laboratory {
  id: number;
  slug: string;
  name: string;
  lab_number: string;
  equipped_with: string;
  description: string;
  created_at: string;
  updated_at: string;
  images: ImageFile[];
}

interface LaboratoriesResponse {
  total: number;
  page: number;
  limit: number;
  data: Laboratory[];
}

interface DirectorateDetail {
  id: number;
  title: string;
  parent: any | null;
  news_count: number;
  staff_count: number;
  centers_count: number;
  children_count: number;
  labs_count: number;
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

const LaboratoriesClient = () => {
  const t = useTranslations("Colleges");
  const tDir = useTranslations("Directorate");
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params?.locale as string;
  const id = params?.id as string;
  const parentId = searchParams.get("parent_id");

  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data: labsData,
    loading: labsLoading,
    error: labsError,
  } = useFetch<LaboratoriesResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}/laboratories?page=${page}&limit=${limit}`,
    locale,
  );

  const { data: directorateData, loading: dirLoading } =
    useFetch<DirectorateDetail>(
      `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}`,
      locale,
    );

  useEffect(() => {
    if (labsData?.data) {
      if (page === 1) {
        setLaboratories(labsData.data);
      } else {
        setLaboratories((prev) => {
          const existingIds = new Set(prev.map((lab) => lab.id));
          const newLabs = labsData.data.filter(
            (lab) => !existingIds.has(lab.id),
          );
          return [...prev, ...newLabs];
        });
      }
    }
  }, [labsData, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("labs")} alt={false} />
        <DirectorateHeader />

        <div className="flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
              <DirectorateSidebar
                activeTab="laboratories"
                id={id}
                parentId={parentId}
                hasParent={!!directorateData?.parent}
                isLoading={dirLoading}
                newsCount={directorateData?.news_count}
                staffCount={directorateData?.staff_count}
                centersCount={directorateData?.centers_count}
                unitsCount={directorateData?.children_count}
                labsCount={directorateData?.labs_count}
              />

              <div className="lg:border-l w-full border-l-none lg:border-b-0 border-b text-secondary border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7">
                {/* <div className="relative sm:text-titleNormal text-lg font-semibold ">
                  <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                  <span className="z-10 relative">{t("labs")}</span>
                </div> */}

                <div className="grid w-full md:grid-cols-2 grid-cols-1 gap-5">
                  {labsLoading && page === 1
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <LabCardSkeleton key={i} />
                      ))
                    : laboratories.length > 0
                      ? laboratories.map((lab) => (
                          <Link
                            key={lab.id}
                            href={`/${locale}/directorate/${id}/laboratories/${lab.slug}?parent_id=${parentId}`}
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
                        ))
                      : !labsLoading && (
                          <div className="col-span-full py-10 text-center text-gray-500">
                            {t("no_laboratories_found")}
                          </div>
                        )}

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
                      className="sm:text-base text-sm border border-primary text-primary px-8 py-2 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                      {labsLoading ? t("loading") : t("see_more")}
                    </button>
                  </div>
                )}

                {labsError && (
                  <div className="text-red-500 text-center w-full py-5">
                    {t("error_loading_data")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoriesClient;
