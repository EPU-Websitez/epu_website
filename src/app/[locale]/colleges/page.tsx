"use client";

import { useEffect, useState } from "react";
import SubHeader from "@/components/subHeader";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronRight } from "react-icons/fa6";

interface MainData {
  id: number;
  title: string;
  subdomain: string;
  vision: string;
  about_content: string;
  created_at: string;
  updated_at: string;
  priority: number;
}

interface Response {
  total: number;
  page: number;
  limit: number;
  data: MainData[];
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
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;

  const [items, setItems] = useState<MainData[]>([]);
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, loading, error, refetch } = useFetch<Response>(
    `${API_URL}/website/colleges?page=${page}&limit=${limit}`
  );

  useEffect(() => {
    if (data?.data) {
      setItems((prev) => [...prev, ...data.data]);
    }
  }, [data]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="w-full flex justify-center items-start mt-20 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-5 w-full">
        <SubHeader title={t("head")} alt={false} />

        {/* Dynamic Data */}
        <div className="mt-10 w-full flex flex-col gap-6">
          {loading && !data
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item) => (
                <div
                  key={item.id}
                  className="mt-10 pb-10 border-b w-full border-b-lightBorder flex justify-between items-start gap-5"
                >
                  <div className="flex_start flex-col gap-5">
                    <Link
                      href={`/${locale}/colleges/${item.subdomain}`}
                      title={item.title}
                      className="md:text-titleNormal text-lg font-semibold"
                    >
                      {item.title}
                    </Link>
                    <p className="font-medium md:text-base text-sm">
                      {item.about_content}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/colleges/${item.subdomain}`}
                    title={item.title}
                    className="text-lg w-10 h-10 rounded-full bg-golden flex_center text-white flex-shrink-0"
                  >
                    <FaChevronRight className="rtl:rotate-180" />
                  </Link>
                </div>
              ))}
        </div>

        {/* Load more button */}
        {data && items.length < data.total && (
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
