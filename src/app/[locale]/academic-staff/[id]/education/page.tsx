"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

// Components & Icons
import AcademicStaffHeader from "@/components/AcademicStaffHeader";
import SubHeader from "@/components/subHeader";
import { GoBriefcase } from "react-icons/go";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

// Utilities

import useFetch from "@/libs/hooks/useFetch";

// --- TYPE DEFINITIONS ---
interface Qualification {
  id: number;
  title: string;
  year: number;
  degree: string;
  department: string;
}
interface QualificationResponse {
  total: number;
  data: Qualification[];
}

interface Experience {
  id: number;
  title: string;
  year: string; // This is a Date string
  scientific_title: string;
}
interface ExperienceResponse {
  total: number;
  data: Experience[];
}

// --- SKELETON LOADER ---
const CardSkeleton = () => (
  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full animate-pulse">
    <div className="flex_start gap-3 border-b border-b-lightBorder pb-5 w-full">
      <div className="w-10 h-10 rounded-lg bg-gray-300"></div>
      <div className="flex_start flex-col gap-1 w-full">
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="flex_start w-full gap-5">
      <div className="flex_start flex-col w-full gap-1">
        <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

const SectionSkeleton = () => (
  <div className="w-full flex flex-col gap-7">
    <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
    <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-10 gap-5">
      {[...Array(2)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const Page = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;

  // --- STATE MANAGEMENT ---
  const [tab, setTab] = useState("qualifications");
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [page, setPage] = useState(1);
  const LIMIT = 6;

  // --- Centralized data fetching with useFetch ---
  const endpoint = tab === "qualifications" ? "qualifications" : "experiences";
  const url = `${process.env.NEXT_PUBLIC_API_URL}/website/teachers/${id}/${endpoint}?page=${page}&limit=${LIMIT}`;

  const { data, loading } = useFetch<
    QualificationResponse | ExperienceResponse
  >(url, locale);

  // useEffect to reset state when the tab changes
  useEffect(() => {
    setPage(1);
    setQualifications([]);
    setExperiences([]);
  }, [tab, id]);

  // useEffect to append new data when it arrives from the hook
  useEffect(() => {
    if (data?.data) {
      if (tab === "qualifications") {
        setQualifications((prev) => [
          ...prev,
          ...(data.data as Qualification[]),
        ]);
      } else {
        setExperiences((prev) => [...prev, ...(data.data as Experience[])]);
      }
    }
  }, [data]); // Runs whenever new data is fetched

  // Simplified load more handler
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // --- FIX: Corrected the typo from toLocaleDateDateString to toLocaleDateString ---
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Loading states are now derived from the hook
  const isInitialLoading = loading && page === 1;
  const isLoadingMore = loading && page > 1;

  const currentList = tab === "qualifications" ? qualifications : experiences;

  return (
    <div className="flex_center w-full flex-col">
      <AcademicStaffHeader />
      <div className="mt-14 w-full flex_center flex-col text-secondary">
        {/* Navigation */}
        <div className="max-w-[1024px] w-full flex_start sm:gap-5 gap-3 overflow-x-auto hide_scroll sm:px-0 px-5">
          <Link
            href={`/${locale}/academic-staff/${id}`}
            title={t("about")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("about")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/teaching`}
            title={t("teaching")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("teaching")}
          </Link>
          <p className="border-b border-b-secondary px-3 sm:text-base text-sm flex-shrink-0 font-medium">
            {t("education")}
          </p>
          <Link
            href={`/${locale}/academic-staff/${id}/professional-engagement`}
            title={t("professional_engagement")}
            className=" opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("professional_engagement")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/academics`}
            title={t("academics")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("academics")}
          </Link>
        </div>

        {/* Main Content */}
        <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
            {/* Tab Buttons */}
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              <button
                type="button"
                onClick={() => setTab("qualifications")}
                className={`lg:w-[250px] w-full lg:h-[45px] h-[40px] flex items-center justify-between border px-3 bg-background rounded-lg transition-all ${
                  tab === "qualifications"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span className="text-sm">{t("qualifications")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180 text-xl" />
              </button>
              <button
                type="button"
                onClick={() => setTab("experience")}
                className={`lg:w-[250px] w-full lg:h-[45px] h-[40px] flex items-center justify-between border px-3 bg-background rounded-lg transition-all ${
                  tab === "experience"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span className="text-sm">{t("experience")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180 text-xl" />
              </button>
            </div>

            <div className="lg:border-l lg:pl-10 w-full">
              {isInitialLoading ? (
                <SectionSkeleton />
              ) : (
                <>
                  {tab === "qualifications" && (
                    <div className="flex_start flex-col gap-7 w-full">
                      <SubHeader title={t("qualifications")} alt={false} />
                      <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-10 gap-5">
                        {qualifications.map((item) => (
                          <div
                            key={item.id}
                            className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full"
                          >
                            <div className="flex_start gap-3 border-b border-b-lightBorder pb-5 w-full">
                              <div className="w-10 h-10 rounded-lg bg-golden flex_center flex-shrink-0">
                                <Image
                                  src="/images/education.svg"
                                  alt="education icon"
                                  width={24}
                                  height={24}
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/images/placeholder.svg";
                                  }}
                                />
                              </div>
                              <div className="flex_start flex-col">
                                <h4 className="font-medium text-sm">
                                  {item.title}
                                </h4>
                                <span className="text-black opacity-60 text-xs">
                                  {item.year}
                                </span>
                              </div>
                            </div>
                            <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                              <div className="flex_start flex-col lg:w-1/2 w-full">
                                <span className="text-black opacity-60 text-xs">
                                  Degree
                                </span>
                                <p className="lg:text-sm text-xs">
                                  {item.degree}
                                </p>
                              </div>
                              <div className="flex_start flex-col lg:w-1/2 w-full">
                                <span className="text-black opacity-60 text-xs">
                                  Department
                                </span>
                                <p className="lg:text-sm text-xs">
                                  {item.department}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {qualifications.length === 0 && !loading && (
                        <p className="text-center text-gray-500 py-10">
                          {t("no_data")}
                        </p>
                      )}
                    </div>
                  )}

                  {tab === "experience" && (
                    <div className="flex_start flex-col gap-7 w-full">
                      <SubHeader title={t("experience")} alt={false} />
                      <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                        {experiences.map((item) => (
                          <div
                            key={item.id}
                            className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full"
                          >
                            <div className="flex_start gap-3 border-b border-b-lightBorder pb-5 w-full">
                              <div className="w-10 h-10 rounded-lg bg-golden flex_center flex-shrink-0">
                                <GoBriefcase className="text-white text-xl" />
                              </div>
                              <div className="flex_start flex-col">
                                <h4 className="font-medium text-sm">
                                  {item.title}
                                </h4>
                                <span className="text-black opacity-60 text-xs">
                                  {formatDate(item.year)}
                                </span>
                              </div>
                            </div>
                            <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                              <div className="flex_start flex-col w-full">
                                <span className="text-black opacity-60 text-xs">
                                  Scientific Title
                                </span>
                                <p className="lg:text-sm text-xs">
                                  {item.scientific_title}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {experiences.length === 0 && !loading && (
                        <p className="text-center text-gray-500 py-10">
                          {t("no_data")}
                        </p>
                      )}
                    </div>
                  )}

                  {/* "See More" Button */}
                  {data && currentList.length < data.total && (
                    <div className="w-full flex justify-center mt-8">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50 disabled:cursor-wait"
                      >
                        {isLoadingMore ? t("loading") : t("see_more")}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
