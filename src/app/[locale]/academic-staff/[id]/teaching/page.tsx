"use client";

import { useEffect, useState } from "react"; // --- CHANGE: Re-added useState and useEffect
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

// Components & Hooks
import AcademicStaffHeader from "@/components/AcademicStaffHeader";
import SubHeader from "@/components/subHeader";
import NoData from "@/components/NoData";
import useFetch from "@/libs/hooks/useFetch"; // --- CHANGE: Using your primary useFetch hook

// --- TYPE DEFINITIONS ---
interface Teaching {
  id: number;
  subject: string;
  stage: string;
  semester: string;
  year_from: number;
  year_to: number;
}
// --- CHANGE: This interface is now for the useFetch hook's expected return type ---
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

  // --- CHANGE: State management now mirrors your centers page ---
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // --- CHANGE: Data fetching uses useFetch with the page state in the URL ---
  const { data, loading, error } = useFetch<TeachingsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/teachers/${id}/teachings?page=${page}&limit=${LIMIT}`,
    locale // Pass locale for the header
  );

  // --- CHANGE: useEffect to append new data when it arrives ---
  useEffect(() => {
    // Check if new data is available and is not empty
    if (data?.data) {
      // Append new items to the existing list
      setTeachings((prev) => [...prev, ...data.data]);
    }
  }, [data]); // This effect runs only when the `data` object from useFetch changes

  // --- CHANGE: Handler to increment the page, triggering a refetch ---
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const isInitialLoading = loading && teachings.length === 0;

  return (
    <div className="flex_center w-full flex-col">
      <AcademicStaffHeader />
      <div className="mt-14 w-full flex_center flex-col text-secondary">
        {/* Navigation Tabs (No changes) */}
        <div className="max-w-[1024px] w-full flex_start sm:gap-5 gap-3 overflow-x-auto hide_scroll sm:px-0 px-5">
          {/* ...links... */}
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
            ) : error ? (
              <div className="w-full flex_center">
                <NoData showButton={true} className="my-10" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto shadow-lg w-full sm:mt-0 -mt-4 custom_scroll">
                  <table className="w-full bg-white min-w-[700px]">
                    <thead>{/* ...thead... */}</thead>
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
                            className="text-center py-10"
                          >
                            <NoData showButton={false} />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* "See More" Button */}
                {data && teachings.length < data.total && (
                  <div className="w-full flex justify-center mt-6">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50 disabled:cursor-wait"
                    >
                      {loading ? t("loading") : t("see_more")}
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
