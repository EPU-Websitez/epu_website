"use client";

import InternationalStrategyHeader from "@/components/InternationalStrategyHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------
interface GoalListItem {
  id: number;
  title: string;
  description: string;
}
interface Goal {
  id: number;
  title: string;
  description: string;
  lists: GoalListItem[];
}

interface GoalsResponse {
  total: number;
  page: number;
  limit: number;
  data: Goal[];
}

// -------- Skeleton for Dynamic Content --------
const GoalCardSkeleton = () => (
  <div className="w-full p-5 flex flex-col gap-5 rounded-3xl border border-lightBorder animate-pulse">
    <div className="h-7 bg-gray-300 rounded w-1/2"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("International");
  const params = useParams();
  const locale = params?.locale as string;
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Fetch the goals for this strategy
  const { data, error, loading } = useFetch<GoalsResponse>(
    id
      ? `${API_URL}/website/international-strategies/international-strategy/${id}/goals`
      : ""
  );

  const goals = data?.data || [];

  // Handle error or missing ID
  if (error || !id) {
    return (
      <div className="w-full text-center my-20 text-red-500">
        {t("error_loading_data")}
      </div>
    );
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
                <Link
                  href={`/${locale}/international-strategy?id=${id}`}
                  title={t("strategy")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("strategy")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                  <span>{t("goals")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </div>
                <Link
                  href={`/${locale}/international-strategy/activities?id=${id}`}
                  title={t("activities")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("activities")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <Link
                  href={`/${locale}/international-strategy/outcomes?id=${id}`}
                  title={t("outcomes")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("outcomes")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <Link
                  href={`/${locale}/international-strategy/actions?id=${id}`}
                  title={t("actions")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("actions")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
              </div>

              <div className="lg:border-l border-l-none lg:border-b-0 border-b text-secondary border-black border-opacity-30 lg:pl-10 lg:pb-0 pb-10 flex_start flex-col gap-7 w-full">
                <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
                  <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                  <span className="z-10 relative">{t("goals")}</span>
                </h2>
                <div className="flex flex-col gap-5 w-full">
                  {loading ? (
                    <>
                      <GoalCardSkeleton />
                      <GoalCardSkeleton />
                    </>
                  ) : goals.length > 0 ? (
                    goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="p-5 flex_start flex-col gap-5 rounded-3xl border border-lightBorder"
                      >
                        <h3 className="text-xl font-semibold text-golden">
                          {goal.title}
                        </h3>
                        <p className="text-opacity-70 text-sm text-secondary">
                          {goal.description}
                        </p>
                        {goal.lists && goal.lists.length > 0 && (
                          <div className="w-full pt-5 border-t border-t-lightBorder flex flex-col gap-3">
                            {goal.lists.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-2"
                              >
                                <span className="w-2 h-2 rounded-full bg-golden flex-shrink-0"></span>
                                <p className="text-sm font-medium">
                                  {item.title}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center py-10">
                      <p>{t("no_data_found")}</p>
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
export default Page;
