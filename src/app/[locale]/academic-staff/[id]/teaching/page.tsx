"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

// Components & Icons
import AcademicStaffHeader from "@/components/AcademicStaffHeader";
import SubHeader from "@/components/subHeader";

// Utilities
import { API_URL } from "@/libs/env";

// --- TYPE DEFINITIONS ---
interface Teaching {
  id: number;
  subject: string;
  stage: string;
  semester: string;
  year_from: number;
  year_to: number;
}
interface TeachingsResponse {
  total: number;
  data: Teaching[];
}

// --- SKELETON LOADER ---
const TableSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="overflow-x-auto shadow-lg w-full sm:mt-0 -mt-4">
      <div className="w-full bg-gray-200 h-[300px] rounded-lg"></div>
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
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const LIMIT = 10;

  // --- DATA FETCHING ---
  useEffect(() => {
    // Fetch the first page of data when the component mounts
    fetchTeachings(1);
  }, [id]); // Re-fetch if the teacher ID changes

  const fetchTeachings = async (pageNum: number) => {
    if (pageNum > 1) {
      setIsLoadingMore(true);
    } else {
      setIsInitialLoading(true);
    }

    try {
      const res = await fetch(
        `${API_URL}/website/teachers/${id}/teachings?page=${pageNum}&limit=${LIMIT}`
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const newData: TeachingsResponse = await res.json();

      if (newData.data) {
        // Append new data for "See More", or set it for the initial load
        setTeachings((prev) =>
          pageNum === 1 ? newData.data : [...prev, ...newData.data]
        );
        setTotal(newData.total);
      }
    } catch (error) {
      console.error("Failed to fetch teaching records:", error);
      // Optionally set an error state here to show a message to the user
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTeachings(nextPage);
  };

  return (
    <div className="flex_center w-full flex-col">
      <AcademicStaffHeader />
      <div className="mt-14 w-full flex_center flex-col text-secondary">
        {/* Navigation Tabs */}
        <div className="max-w-[1024px] w-full flex_start sm:gap-5 gap-3 overflow-x-auto hide_scroll sm:px-0 px-5">
          <Link
            href={`/${locale}/academic-staff/${id}`}
            title={t("about")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("about")}
          </Link>
          <p className="border-b border-b-secondary px-3 sm:text-base text-sm flex-shrink-0 font-medium">
            {t("teaching")}
          </p>
          <Link
            href={`/${locale}/academic-staff/${id}/education`}
            title={t("education")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("education")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/professional-engagement`}
            title={t("professional_engagement")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
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

        {/* Main Content Area */}
        <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="sm:mt-10 mt-5 flex_start flex-col gap-10 max-w-[1024px] w-full px-2">
            <div className="lg:block hidden">
              <SubHeader title={t("teaching")} alt={true} />
            </div>
            <div className="lg:hidden block">
              <SubHeader title={t("teaching")} alt={false} />
            </div>

            {isInitialLoading ? (
              <TableSkeleton />
            ) : (
              <>
                <div className="overflow-x-auto shadow-lg w-full sm:mt-0 -mt-4 custom_scroll">
                  <table className="w-full bg-white min-w-[700px]">
                    <thead>
                      <tr className="lg:bg-primary bg-golden text-white">
                        <th className="md:px-6 px-3 sm:py-4 py-3 font-medium lg:text-base text-xs text-start tracking-wider ltr:border-r rtl:border-l border-blue-700">
                          {t("subject")}
                        </th>
                        <th className="md:px-6 px-3 sm:py-4 py-3 font-medium lg:text-base text-xs text-center tracking-wider ltr:border-r rtl:border-l border-blue-700">
                          {t("stage")}
                        </th>
                        <th className="md:px-6 px-3 sm:py-4 py-3 font-medium lg:text-base text-xs text-center tracking-wider ltr:border-r rtl:border-l border-blue-700">
                          {t("semester")}
                        </th>
                        <th className="md:px-6 px-3 sm:py-4 py-3 font-medium lg:text-base text-xs text-center tracking-wider">
                          {t("year")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {teachings.length > 0 ? (
                        teachings.map((row) => (
                          <tr
                            key={row.id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="md:px-6 px-3 md:py-4 py-3 lg:text-sm text-xs font-medium ltr:border-r rtl:border-l border-gray-200">
                              {row.subject}
                            </td>
                            <td className="md:px-6 px-3 md:py-4 py-3 lg:text-sm text-xs text-center ltr:border-r rtl:border-l border-gray-200">
                              {row.stage}
                            </td>
                            <td className="md:px-6 px-3 md:py-4 py-3 lg:text-sm text-xs text-center ltr:border-r rtl:border-l border-gray-200">
                              {row.semester}
                            </td>
                            <td className="md:px-6 px-3 md:py-4 py-3 lg:text-sm text-xs text-center">
                              {`${row.year_from} - ${row.year_to}`}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-10 text-gray-500"
                          >
                            {t("no_teaching_records")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* "See More" Button */}
                {teachings.length < total && (
                  <div className="w-full flex justify-center mt-6">
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
  );
};

export default Page;
