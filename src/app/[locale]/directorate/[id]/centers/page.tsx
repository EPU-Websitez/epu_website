"use client";

import { useEffect, useState } from "react";
import SubHeader from "@/components/subHeader";
import DirectorateHeader from "@/components/DirectorateHeader";
import DirectorateSidebar from "@/components/DirectorateSidebar";
import SubUnits from "@/components/SubUnits";

import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { FaChevronRight } from "react-icons/fa6";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

interface Center {
  id: number;
  title: string;
  slug: string;
  description: string;
  vision: string;
  mission: string;
  created_at: string;
  updated_at: string;
  priority: number;
}

interface CenterResponse {
  total: number;
  page: number;
  limit: number;
  data: Center[];
}

interface DirectorateParentInfo {
  id: number;
  title: string;
  parent_id: number | null;
  parent?: {
    slug: string;
  };
  directorate_type: {
    name: string;
  };
}

const SkeletonCard = () => (
  <div className="w-full animate-pulse flex justify-between items-end pb-10 border-b border-b-lightBorder">
    <div className="w-[75%] flex flex-col gap-5">
      <div className="h-8 bg-gray-300 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-full" />
    </div>
    <div className="h-10 w-10 bg-gray-300 rounded-full flex-shrink-0" />
  </div>
);

const CentersClient = () => {
  const t = useTranslations("Centers");
  const tDir = useTranslations("Directorate");
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params?.locale as string;
  const parentId = searchParams.get("parent_id");
  const id = params?.id as string;

  const [centers, setCenters] = useState<Center[]>([]);
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, loading } = useFetch<CenterResponse>(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/website/centers?page=${page}&limit=${limit}&directorate_id=${
      parentId || ""
    }`,
    locale,
  );

  const { data: directorateInfo, loading: directorateLoading } =
    useFetch<DirectorateParentInfo>(
      id ? `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}` : "",
      locale,
    );

  useEffect(() => {
    if (data?.data) {
      setCenters((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const newCenters = data.data.filter((c) => !existingIds.has(c.id));
        return [...prev, ...newCenters];
      });
    }
  }, [data]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const isInitialLoading = loading && centers.length === 0;

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />
        <DirectorateHeader />

        <div className="flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
              <DirectorateSidebar
                activeTab="centers"
                id={params?.id as string}
                parentId={parentId}
                hasParent={!!directorateInfo?.parent}
                isLoading={directorateLoading}
              />

              <div className="lg:border-l w-full border-l-none lg:border-b-0 border-b text-secondary border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7">
                <div className="relative sm:text-titleNormal text-lg font-semibold ">
                  <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                  <span className="z-10 relative">{tDir("centers")}</span>
                </div>

                <div className="flex_start flex-col gap-5 w-full">
                  {/* Centers list */}
                  <div className="mt-0 w-full flex flex-col gap-6">
                    {isInitialLoading
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <SkeletonCard key={i} />
                        ))
                      : centers.map((center) => (
                          <div
                            key={center.id}
                            className="pt-10 pb-10 border-b w-full border-b-lightBorder flex justify-between items-start gap-5"
                          >
                            <div className="flex_start flex-col gap-5">
                              <Link
                                href={`/${locale}/centers/${center.slug}`}
                                title={center.title}
                                className="md:text-titleNormal text-lg font-semibold hover:text-primary transition-colors"
                              >
                                {center.title}
                              </Link>
                              <div
                                className="font-medium md:text-base text-sm text-secondary/80"
                                dangerouslySetInnerHTML={{
                                  __html: center.description,
                                }}
                              />
                            </div>
                            <Link
                              href={`/${locale}/centers/${center.slug}`}
                              title={center.title}
                              className="text-lg w-10 h-10 rounded-full bg-golden flex_center text-white flex-shrink-0 hover:bg-golden/80 transition-colors"
                            >
                              <FaChevronRight className="rtl:rotate-180" />
                            </Link>
                          </div>
                        ))}
                  </div>

                  {data && centers.length < data.total && (
                    <div className="flex_center w-full my-5">
                      <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="sm:text-base text-sm border border-primary text-primary px-8 py-2 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-wait"
                      >
                        {loading ? t("loading") : t("see_more")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentersClient;
