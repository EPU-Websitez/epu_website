// file: app/[locale]/international-strategy/page.tsx

"use client";

import InternationalStrategyHeader from "@/components/InternationalStrategyHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // Updated import
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
// import useSWR from "swr"; // Removed useSWR

// --- Type Definitions ---
interface ImageType {
  lg: string;
}
interface StrategyData {
  id: number;
  strategy_title: string;
  strategy_description: string;
  bg_title: string;
  bg_description: string;
  bg_image: ImageType;
}
interface ApiResponse {
  data: StrategyData[];
}

// --- Fetcher function removed ---

// --- Skeleton for dynamic content ---
const ContentSkeleton = () => (
  <div className="flex_start flex-col gap-7 w-full animate-pulse">
    <div className="h-10 bg-gray-300 rounded w-48"></div>
    <div className="space-y-3 w-full">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("International");
  const params = useParams();
  const locale = params?.locale as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // --- State management for data fetching ---
  const [strategyData, setStrategyData] = useState<StrategyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching with useEffect ---
  useEffect(() => {
    const fetchStrategyData = async () => {
      // Guard against running fetch if locale is not yet available
      if (!locale) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/website/international-strategies?page=1&limit=1`,
          {
            headers: {
              "website-language": locale,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch strategy data.");
        }

        const response: ApiResponse = await res.json();
        if (response.data && response.data.length > 0) {
          setStrategyData(response.data[0]);
        } else {
          // No data found, can set to null or handle as an error
          setStrategyData(null);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrategyData();
  }, [locale]);

  // --- Effect to update URL with fetched ID ---
  useEffect(() => {
    if (strategyData) {
      const newId = strategyData.id;
      const currentId = searchParams.get("id");
      const pathname = window.location.pathname;

      if (currentId !== newId.toString()) {
        router.replace(`${pathname}?id=${newId}`);
      }
    }
  }, [strategyData, router, searchParams]);

  if (error) {
    return <div className="text-red-500 text-center my-20">{error}</div>;
  }

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("international_strategy")} alt={false} />
        <InternationalStrategyHeader />
        <div className="flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-2">
            <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
              <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
                <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                  <span>{t("strategy")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </div>
                <Link
                  href={`/${locale}/international-strategy/news?id=${id || ""}`}
                  title={t("news")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("news")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <Link
                  href={`/${locale}/international-strategy/goals?id=${
                    id || ""
                  }`}
                  title={t("goals")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("goals")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <Link
                  href={`/${locale}/international-strategy/activities?id=${
                    id || ""
                  }`}
                  title={t("activities")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("activities")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <Link
                  href={`/${locale}/international-strategy/outcomes?id=${
                    id || ""
                  }`}
                  title={t("outcomes")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("outcomes")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <Link
                  href={`/${locale}/international-strategy/actions?id=${
                    id || ""
                  }`}
                  title={t("actions")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("actions")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
              </div>
              <div className="lg:border-l border-l-none lg:border-b-0 border-b text-secondary border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                {isLoading ? (
                  <ContentSkeleton />
                ) : (
                  <>
                    <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
                      <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                      <span className="z-10 relative">
                        {strategyData?.strategy_title}
                      </span>
                    </h2>
                    <p className="text-opacity-70 text-secondary text-base">
                      {strategyData?.strategy_description}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
