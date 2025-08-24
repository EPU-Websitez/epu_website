"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// Interfaces
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
  created_at: string;
  updated_at: string;
}

interface Memorandum {
  id: number;
  slug: string;
  title: string;
  description: string;
  link: string;
  logo_image_id: number;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  logo_image: Image;
}

interface MouResponse {
  total: number;
  page: number;
  limit: number;
  data: Memorandum[];
}

// Skeleton Components
const MouCardSkeleton = () => (
  <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3 animate-pulse">
    <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] bg-gray-300 rounded-lg"></div>
    <div className="absolute bottom-0 left-0 w-full sm:h-[52px] h-[40px] bg-gray-300"></div>
  </div>
);

const PageSkeleton = () => {
  const t = useTranslations("MemorandumOfUnderstanding");
  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <div className="sm:block hidden w-full">
          <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
        </div>
        <div className="sm:hidden block w-full">
          <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
        </div>
        <div className="flex_center flex-col gap-10 w-full">
          <div className="flex_center w-full gap-5 mt-5">
            <span className="bg-lightBorder w-full h-[1px]"></span>
            <h3 className="text-secondary lg:text-xl sm:text-lg text-xs font-medium flex-shrink-0">
              {t("local_universities")}
            </h3>
            <span className="bg-lightBorder w-full h-[1px]"></span>
          </div>
          <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <MouCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const t = useTranslations("MemorandumOfUnderstanding");
  const params = useParams();
  const locale = params?.locale as string;

  const [mous, setMous] = useState<Memorandum[]>([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data: mousData,
    loading,
    error,
  } = useFetch<MouResponse>(
    `${API_URL}/website/memorandum-of-understanding?page=${page}&limit=${limit}`
  );

  useEffect(() => {
    if (mousData?.data) {
      if (page === 1) {
        setMous(mousData.data);
      } else {
        setMous((prev) => [...prev, ...mousData.data]);
      }
    }
  }, [mousData]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const getMouImage = (mou: Memorandum) => {
    return (
      mou.logo_image?.lg ||
      mou.logo_image?.md ||
      mou.logo_image?.original ||
      `/images/placeholder.png` // Fallback image
    );
  };

  // This condition shows the skeleton ONLY on the first page load
  if (loading && page === 1) {
    return <PageSkeleton />;
  }

  // This condition handles initial load error
  if (error && page === 1 && !loading) {
    return (
      <div className="w-full flex_center my-10">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-2">Error occuered</h2>
          <p>error loading data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <div className="sm:block hidden">
          <SubHeader title={t("head")} alt={false} />
        </div>
        <div className="sm:hidden block">
          <SubHeader title={"MOUs"} alt={false} />
        </div>
        <div className="flex_center flex-col gap-10 w-full">
          <div className="flex_center w-full gap-5 mt-5">
            <span className="bg-lightBorder w-full h-[1px]"></span>
            <h3 className="text-secondary lg:text-xl sm:text-lg text-xs font-medium flex-shrink-0">
              {t("local_universities")}
            </h3>
            <span className="bg-lightBorder w-full h-[1px]"></span>
          </div>

          {mous.length > 0 ? (
            <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-8">
              {mous.map((mou, i) => (
                <Link
                  key={`${mou.id}-${i}`}
                  href={mou.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden group"
                >
                  <div className="w-full h-full flex justify-center items-start pt-3">
                    <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                      <Image
                        src={getMouImage(mou)}
                        alt={mou.title}
                        fill
                        priority={i < 6}
                        className="w-full h-full object-cover rounded-md transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white transition-colors group-hover:bg-secondary">
                    {mou.title}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center w-full py-10">
              <div className="flex_center flex-col gap-4">
                <div className="text-4xl">📄</div>
                <h3 className="text-lg font-medium">{t("no_mous_found")}</h3>
              </div>
            </div>
          )}

          {/* Load More Button */}
          {mousData && mous.length < mousData.total && (
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

          {/* Error State for Load More */}
          {error && !loading && page > 1 && (
            <div className="text-red-500 text-center w-full">
              error loading data
            </div>
          )}

          {/* <div className="flex_center w-full gap-5 mt-5">
            <span className="bg-lightBorder w-full h-[1px]"></span>
            <h3 className="text-secondary lg:text-xl sm:text-lg text-xs flex-shrink-0">
              {t("international_universities")}
            </h3>
            <span className="bg-lightBorder w-full h-[1px]"></span>
          </div> */}
          {/* <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-5"> ... </div> */}
        </div>
      </div>
    </div>
  );
};
export default Page;
