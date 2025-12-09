"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import SubHeader from "@/components/subHeader";
import NoData from "@/components/NoData";

import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa6";
import { API_URL } from "@/libs/env";

interface MainData {
  id: number;
  title: string;
  subdomain: string;
  vision: string;
  about_content: string;
}
interface Response {
  total: number;
  data: MainData[];
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

const CollegesClient = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = (params?.locale as string) ?? "";

  const type = useMemo<"COLLEGE" | "INSTITUTE">(() => {
    const q = (searchParams.get("type") ?? "COLLEGE").toUpperCase();
    return q === "INSTITUTE" ? "INSTITUTE" : "COLLEGE";
  }, [searchParams]);

  const [items, setItems] = useState<MainData[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  const url = `${API_URL}/website/colleges?page=${page}&limit=${limit}&type=${type}`;
  const { data, loading, error } = useFetch<Response>(url, locale);

  useEffect(() => {
    setItems([]);
    setPage(1);
  }, [type]);

  useEffect(() => {
    if (data?.data) {
      setItems((prev) => {
        const existingIds = new Set(prev.map((i) => i.id));
        const newItems = data.data.filter((i) => !existingIds.has(i.id));
        return page === 1 ? newItems : [...prev, ...newItems];
      });
    }
  }, [data, page]);

  const handleLoadMore = () => setPage((p) => p + 1);

  const handleTabChange = (nextType: "COLLEGE" | "INSTITUTE") => {
    if (nextType === type) return;
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("type", nextType);
    router.push(`/${locale}/colleges?${sp.toString()}`, { scroll: false });
  };

  const isInitialLoading = loading && page === 1;

  return (
    <div className="w-full flex justify-center items-start mt-20 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-5 w-full">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full flex_center mt-6">
          <div className="flex justify-center items-center w-full max-w-[920px] h-[45px] relative bg-lightBorder rounded-2xl overflow-hidden gap-5">
            <span
              className={`bg-golden duration-300 absolute ltr:left-0 rtl:right-0 top-0 w-1/2 h-full rounded-2xl transition-all ${
                type === "COLLEGE"
                  ? "ltr:left-0 rtl:right-0"
                  : "ltr:left-1/2 rtl:right-1/2"
              }`}
            />
            <button
              type="button"
              onClick={() => handleTabChange("COLLEGE")}
              className={`flex_center w-1/2 text-lg z-10 text-center h-full ${
                type === "COLLEGE" ? "text-white" : "opacity-70"
              }`}
            >
              {t("head")}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("INSTITUTE")}
              className={`flex_center w-1/2 text-lg z-10 text-center h-full ${
                type === "INSTITUTE" ? "text-white" : "opacity-70"
              }`}
            >
              {t("institutions")}
            </button>
          </div>
        </div>

        <div className="mt-10 w-full flex flex-col gap-6">
          {isInitialLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <div className="w-full flex_center">
              <NoData showButton={true} className="my-10" />
            </div>
          ) : items.length > 0 ? (
            items.map((item) => {
              // Construct the full subdomain URL
              const collegeUrl = `https://${item.subdomain}.epu.edu.iq/${locale}`;

              return (
                <div
                  key={item.id}
                  className="pt-10 pb-10 border-b w-full border-b-lightBorder flex justify-between items-start gap-5"
                >
                  <div className="flex_start flex-col gap-5">
                    <a
                      href={collegeUrl}
                      title={item.title ?? ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="md:text-titleNormal text-lg font-semibold hover:text-primary transition-colors"
                    >
                      {item.title ?? ""}
                    </a>
                    <p className="font-medium md:text-base text-sm text-secondary/80">
                      {item.about_content ?? ""}
                    </p>
                  </div>
                  <a
                    href={collegeUrl}
                    title={item.title ?? ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg w-10 h-10 rounded-full bg-golden flex_center text-white flex-shrink-0 hover:bg-golden/80 transition-colors"
                  >
                    <FaChevronRight className="rtl:rotate-180" />
                  </a>
                </div>
              );
            })
          ) : (
            <div className="w-full flex_center">
              <NoData showButton={false} />
            </div>
          )}
        </div>

        {data && !loading && items.length < (data?.total ?? 0) && (
          <div className="flex_center w-full my-5">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="sm:text-base text-sm border border-primary text-primary px-8 py-2 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              {loading ? t("loading") : t("see_more")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegesClient;
