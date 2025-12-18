"use client";
import AcademicStaffHeader from "@/components/AcademicStaffHeader";
import NoData from "@/components/NoData";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";

// --- Interfaces ---

interface ImageType {
  lg: string;
}

interface AcademicStaff {
  id: number;
  full_name: string;
  title: string;
  general_spec: string;
  specific_spec: string;
  biography: string;
  profile_image: ImageType;
  bg_image: ImageType;
}

// Department Positions API Response Structure
interface DepartmentPosition {
  department_id: number;
  department_name: string;
  department_slug: string;
  role: string;
  position_type: string;
}

interface CollegeWithDepartments {
  college_id: number;
  college_name: string;
  subdomain: string;
  departments: DepartmentPosition[];
}

interface DepartmentPositionsResponse {
  total: number;
  page: number;
  limit: number;
  data: CollegeWithDepartments[];
}

// --- Helper Functions ---

const getExternalUrl = (
  subdomain: string | undefined,
  departmentSlug: string | undefined,
  locale: string
) => {
  if (!subdomain || !departmentSlug) return "#";
  return `https://${subdomain}.epu.edu.iq/${locale}/departments/${departmentSlug}`;
};

// --- Sub-Components ---

const Skeleton = () => (
  <div className="w-full flex flex-col gap-4 animate-pulse">
    <div className="w-full h-[276px] bg-gray-300 rounded-2xl"></div>
    <div className="w-[115px] h-[115px] sm:w-[215px] sm:h-[215px] bg-gray-300 rounded-full -mt-[100px] mx-auto"></div>
    <div className="h-6 w-40 bg-gray-300 rounded mt-4 mx-auto"></div>
    <div className="h-4 w-80 bg-gray-200 rounded mx-auto"></div>
    <div className="h-40 w-full bg-gray-100 rounded mt-6"></div>
  </div>
);

// Reusable Sidebar List Component for Department Positions
const DepartmentPositionSidebarList = ({
  title,
  colleges,
  loading,
  onShowMore,
  locale,
  icon: Icon,
}: {
  title: string;
  colleges: CollegeWithDepartments[];
  loading: boolean;
  onShowMore: () => void;
  locale: string;
  icon: any;
}) => {
  if (loading || !colleges || colleges.length === 0) return null;

  // Flatten all departments from all colleges
  const allDepartments = colleges.flatMap((college) =>
    (college.departments || []).map((dept) => ({
      ...dept,
      subdomain: college.subdomain,
      college_name: college.college_name,
    }))
  );

  if (allDepartments.length === 0) return null;

  const previewCount = 2;
  const visibleItems = allDepartments.slice(0, previewCount);
  const remainingCount = Math.max(0, allDepartments.length - previewCount);

  return (
    <div className="flex_start flex-col gap-3 w-full border-t border-gray-100 pt-4">
      <span className="text-xs text-black text-opacity-60 uppercase tracking-wider">
        {title}
      </span>

      <div className="flex flex-col gap-2 w-full">
        {visibleItems.map((dept, index) => (
          <a
            key={`${dept.department_id}-${index}`}
            href={getExternalUrl(
              dept.subdomain,
              dept.department_slug,
              locale
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
          >
            <div className="bg-blue-50 text-blue-600 p-1.5 rounded-md group-hover:bg-blue-100 transition-colors shrink-0">
              <Icon className="text-sm" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-secondary truncate block">
                {dept.department_name}
              </span>
              <span className="text-[10px] text-lightText truncate block">
                {dept.college_name || dept.role}
              </span>
            </div>
          </a>
        ))}
      </div>

      {remainingCount > 0 && (
        <button
          onClick={onShowMore}
          className="w-full mt-1 py-2 text-xs font-medium text-primary bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
        >
          +{remainingCount} {title}
        </button>
      )}
    </div>
  );
};

// --- Main Page Component ---

const Page = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;

  // Modal State: stores if department positions modal is open
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);

  // 1. Fetch Main Staff Data
  const { data, loading, error } = useFetch<AcademicStaff>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/teachers/${id}`,
    locale
  );

  // 2. Fetch Department Positions
  const { data: deptPositions, loading: deptLoading } =
    useFetch<DepartmentPositionsResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/website/teachers/${id}/lecturing-departments`,
      locale
    );

  const biography = data?.biography || "Biography not available.";
  const generalSpec = data?.general_spec || "Civil Engineering";
  const specificSpec =
    data?.specific_spec || "Transportation Planning and Design";

  // Grouping logic for the modal (Memoized)
  const groupedDepartmentPositions = useMemo(() => {
    if (!deptPositions?.data) return {};

    const groups: Record<string, { title: string; colleges: CollegeWithDepartments }> = {};

    deptPositions.data.forEach((college) => {
      const groupKey = `col-${college.college_id}`;
      groups[groupKey] = {
        title: college.college_name,
        colleges: college,
      };
    });

    return groups;
  }, [deptPositions?.data]);

  return (
    <div className="flex_center w-full flex-col">
      <AcademicStaffHeader />

      {/* Tabs */}
      <div className="mt-14 w-full flex_center flex-col text-secondary">
        <div className="max-w-[1024px] w-full flex_start sm:gap-5 gap-3 overflow-x-auto hide_scroll sm:px-0 px-5">
          <p className="border-b border-b-secondary px-3 sm:text-base text-xs flex-shrink-0 font-medium">
            {t("about")}
          </p>
          <Link
            href={`/${locale}/academic-staff/${id}/teaching`}
            className="opacity-70 px-3 sm:text-base text-xs flex-shrink-0"
          >
            {t("teaching")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/education`}
            className="opacity-70 px-3 sm:text-base text-xs flex-shrink-0"
          >
            {t("education")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/professional-engagement`}
            className="opacity-70 px-3 sm:text-base text-xs flex-shrink-0"
          >
            {t("professional_engagement")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/academics`}
            className="opacity-70 px-3 sm:text-base text-xs flex-shrink-0"
          >
            {t("academics")}
          </Link>
        </div>

        {/* Main Content */}
        {loading && !data ? (
          <Skeleton />
        ) : error ? (
          <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            <div className="mt-10 max-w-[1024px] w-full flex_center">
              <NoData showButton={true} className="my-10" />
            </div>
          </div>
        ) : (
          <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            <div className="mt-10 flex_start lg:flex-row flex-col gap-10 max-w-[1024px] w-full px-2">
              {/* Sidebar Info Card */}
              <div className="bg-background p-6 rounded-3xl gap-6 lg:max-w-[335px] w-full flex_start lg:flex-col flex-row flex-wrap shadow-sm h-fit">
                {/* Specs */}
                <div className="flex_start flex-col gap-2 w-full">
                  <span className="text-xs text-black text-opacity-60 uppercase tracking-wider">
                    {t("general_specialization")}
                  </span>
                  <p className="text-sm font-semibold text-gray-800">
                    {generalSpec}
                  </p>
                </div>

                <div className="flex_start flex-col gap-2 w-full">
                  <span className="text-xs text-black text-opacity-60 uppercase tracking-wider">
                    {t("specific_specialization")}
                  </span>
                  <p className="text-sm font-semibold text-gray-800">
                    {specificSpec}
                  </p>
                </div>

                {/* Department Positions List */}
                <DepartmentPositionSidebarList
                  title={t("department_positions") || "Department Positions"}
                  colleges={deptPositions?.data || []}
                  loading={deptLoading}
                  locale={locale}
                  onShowMore={() => setShowDepartmentModal(true)}
                  icon={HiOutlineBuildingLibrary}
                />
              </div>

              {/* Biography Text */}
              <div className="flex_start flex-col gap-8 flex-1">
                <h2 className="sm:text-2xl text-lg font-semibold text-gray-900">
                  {t("biography")}
                </h2>
                <div
                  className="lg:text-lg sm:text-base text-sm text-gray-600 leading-relaxed text-justify"
                  dangerouslySetInnerHTML={{ __html: biography }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Department Positions Modal */}
      {showDepartmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-lightBorder shrink-0">
              <h3 className="text-lg font-bold text-primary">
                {t("department_positions") || "Department Positions"}
              </h3>
              <button
                onClick={() => setShowDepartmentModal(false)}
                className="p-2 text-gray-400 hover:text-red hover:bg-red/30 rounded-full transition-all"
              >
                <IoMdClose size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-6">
                {Object.keys(groupedDepartmentPositions).length > 0 ? (
                  Object.values(groupedDepartmentPositions).map((group: any, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-lightBorder">
                        <span className="text-sm font-bold text-secondary uppercase tracking-wide">
                          {group.title}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {group.colleges.departments.map((dept: DepartmentPosition, pIdx: number) => (
                          <a
                            key={`${dept.department_id}-${pIdx}`}
                            href={getExternalUrl(
                              group.colleges.subdomain,
                              dept.department_slug,
                              locale
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col gap-1 p-3 rounded-xl border border-lightBorder hover:border-blue/10 hover:bg-blue/10 transition-all group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                                {dept.department_name}
                              </span>
                              <HiOutlineBuildingLibrary className="text-secondary group-hover:text-blue-400 shrink-0 mt-0.5" />
                            </div>
                            <span className="text-xs text-lightText bg-backgroundSecondary self-start px-2 py-0.5 rounded-md mt-1 group-hover:bg-white transition-colors">
                              {dept.role}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-10">
                    {t("no_data_found") || "No positions found."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
