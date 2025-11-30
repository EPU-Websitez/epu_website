"use client";
import AcademicStaffHeader from "@/components/AcademicStaffHeader";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import {
  HiOutlineBuildingLibrary,
  HiOutlineAcademicCap,
} from "react-icons/hi2";

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

// Nested Objects in the API Response
interface CollegeData {
  id: number;
  subdomain: string;
  title: string;
  slug: string;
}

interface DepartmentData {
  id: number;
  college_id?: number; // Optional in case university positions don't have college
  slug: string;
  title: string;
  college?: CollegeData;
}

interface PositionItem {
  position_type: string;
  department_id: number;
  role: string;
  department: DepartmentData;
}

interface PositionsResponse {
  data: PositionItem[];
  total: number;
}

// --- Helper Functions ---

const getExternalUrl = (
  subdomain: string | undefined,
  departmentId: number | undefined,
  locale: string
) => {
  if (!subdomain || !departmentId) return "#";
  return `https://${subdomain}.epu.edu.iq/${locale}/departments/${departmentId}`;
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

// Reusable Sidebar List Component
const PositionSidebarList = ({
  title,
  items,
  loading,
  onShowMore,
  locale,
  icon: Icon,
}: {
  title: string;
  items: PositionItem[];
  loading: boolean;
  onShowMore: () => void;
  locale: string;
  icon: any;
}) => {
  if (loading || !items || items.length === 0) return null;

  const previewCount = 2;
  const visibleItems = items.slice(0, previewCount);
  const remainingCount = Math.max(0, items.length - previewCount);

  return (
    <div className="flex_start flex-col gap-3 w-full border-t border-gray-100 pt-4">
      <span className="text-xs text-black text-opacity-60 uppercase tracking-wider">
        {title}
      </span>

      <div className="flex flex-col gap-2 w-full">
        {visibleItems.map((pos, index) => (
          <a
            key={`${pos?.department?.id}-${index}`}
            href={getExternalUrl(
              pos?.department?.college?.subdomain,
              pos?.department?.id,
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
                {pos?.department?.title}
              </span>
              <span className="text-[10px] text-lightText truncate block">
                {pos?.department?.college?.title || pos?.role}
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

  // Modal State: stores which list is currently open ('university' | 'department' | null)
  const [modalType, setModalType] = useState<
    "university" | "department" | null
  >(null);

  // 1. Fetch Main Staff Data
  const { data, loading } = useFetch<AcademicStaff>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/teachers/${id}`,
    locale
  );

  // 2. Fetch Department Positions
  const { data: deptPositions, loading: deptLoading } =
    useFetch<PositionsResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/website/teachers/${id}/department-positions`,
      locale
    );

  // 3. Fetch University Positions
  const { data: uniPositions, loading: uniLoading } =
    useFetch<PositionsResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/website/teachers/${id}/university-positions`,
      locale
    );

  const biography = data?.biography || "Biography not available.";
  const generalSpec = data?.general_spec || "Civil Engineering";
  const specificSpec =
    data?.specific_spec || "Transportation Planning and Design";

  // Get current modal data based on state
  const currentModalData =
    modalType === "university" ? uniPositions?.data : deptPositions?.data;
  const currentModalTitle =
    modalType === "university"
      ? t("university_positions") || "University Positions"
      : t("department_positions") || "Department Positions";

  // Grouping logic for the modal (Memoized)
  const groupedModalPositions = useMemo(() => {
    if (!currentModalData) return {};

    const groups: Record<string, { title: string; positions: PositionItem[] }> =
      {};

    currentModalData.forEach((pos) => {
      // Group by College ID if available, otherwise 'General' (for uni positions without college)
      const groupKey = pos?.department?.college?.id
        ? `col-${pos.department.college.id}`
        : "general";

      const groupTitle = pos?.department?.college?.title || "General / Other";

      if (!groups[groupKey]) {
        groups[groupKey] = {
          title: groupTitle,
          positions: [],
        };
      }
      groups[groupKey].positions.push(pos);
    });

    return groups;
  }, [currentModalData]);

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

                {/* 1. University Positions List */}
                <PositionSidebarList
                  title={t("university_positions") || "University Positions"}
                  items={uniPositions?.data || []}
                  loading={uniLoading}
                  locale={locale}
                  onShowMore={() => setModalType("university")}
                  icon={HiOutlineAcademicCap}
                />

                {/* 2. Department Positions List */}
                <PositionSidebarList
                  title={t("department_positions") || "Department Positions"}
                  items={deptPositions?.data || []}
                  loading={deptLoading}
                  locale={locale}
                  onShowMore={() => setModalType("department")}
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

      {/* Shared Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-lightBorder shrink-0">
              <h3 className="text-lg font-bold text-primary">
                {currentModalTitle}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-2 text-gray-400 hover:text-red hover:bg-red/30 rounded-full transition-all"
              >
                <IoMdClose size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-6">
                {Object.keys(groupedModalPositions).length > 0 ? (
                  Object.values(groupedModalPositions).map((group, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      {/* Only show header if it's not the generic 'general' bucket or if we have multiple groups */}
                      {(group.title !== "General / Other" ||
                        Object.keys(groupedModalPositions).length > 1) && (
                        <div className="flex items-center gap-2 pb-2 border-b border-lightBorder">
                          <span className="text-sm font-bold text-secondary uppercase tracking-wide">
                            {group.title}
                          </span>
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-3">
                        {group.positions.map((pos, pIdx) => (
                          <a
                            key={`${pos?.department?.id}-${pIdx}`}
                            href={getExternalUrl(
                              pos?.department?.college?.subdomain,
                              pos?.department?.id,
                              locale
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col gap-1 p-3 rounded-xl border border-lightBorder hover:border-blue/10 hover:bg-blue/10 transition-all group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                                {pos?.department?.title}
                              </span>
                              {modalType === "university" ? (
                                <HiOutlineAcademicCap className="text-secondary group-hover:text-blue-400 shrink-0 mt-0.5" />
                              ) : (
                                <HiOutlineBuildingLibrary className="text-secondary group-hover:text-blue-400 shrink-0 mt-0.5" />
                              )}
                            </div>
                            <span className="text-xs text-lightText bg-backgroundSecondary self-start px-2 py-0.5 rounded-md mt-1 group-hover:bg-white transition-colors">
                              {pos?.role}
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
