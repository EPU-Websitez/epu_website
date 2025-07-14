"use client";

import { useEffect, useState } from "react";
import SubHeader from "@/components/subHeader";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronRight } from "react-icons/fa6";

interface Center {
  id: number;
  title: string;
  slug: string;
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

const SkeletonCard = () => (
  <div className="w-full animate-pulse flex justify-between items-end">
    <div className="w-[75%]">
    <div className="h-20 bg-gray-300 rounded w-1/2 mb-2" />
    <div className="h-10 bg-gray-200 rounded w-2/3" />
    </div>
    <div className="h-10 bg-gray-200 rounded 10" />
  </div>
);

const Page = () => {
  const t = useTranslations("Centers");
  const params = useParams();
  const locale = params?.locale as string;

  const [centers, setCenters] = useState<Center[]>([]);
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    data,
    loading,
    error,
    refetch,
  } = useFetch<CenterResponse>(
    `${API_URL}/website/centers?page=${page}&limit=${limit}`
  );

  useEffect(() => {
    if (data?.data) {
      setCenters((prev) => [...prev, ...data.data]);
    }
  }, [data]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="w-full flex justify-center items-start mt-20 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-5 w-full">
        <SubHeader title={t("head")} alt={false} />

        {/* Dynamic Centers */}
        <div className="mt-10 w-full flex flex-col gap-6">
          {loading && !data ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            centers.map((center) => (
              <div key={center.id} className="mt-10 pb-10 border-b w-full border-b-lightBorder flex justify-between items-start gap-5">
          <div className="flex_start flex-col gap-5">
            <h2 className="md:text-titleNormal text-lg font-semibold">
              {center.title}
            </h2>
            <p className="font-medium md:text-base text-sm">{center.mission}</p>
          </div>
          <Link
            href={`/${locale}/centers/${center.slug}`}
            className="text-lg w-10 h-10 rounded-full bg-golden flex_center text-white flex-shrink-0"
          >
            <FaChevronRight className="rtl:rotate-180" />
          </Link>
        </div>
            ))
          )}
        </div>

        {/* Load more button */}
        {data && centers.length < data.total && (
          <div className="flex_center w-full my-5">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg"
            >
              {loading ? t("loading") : t("see_more")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
