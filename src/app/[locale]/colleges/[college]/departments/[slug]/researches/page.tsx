"use client";

import CollegeHeader from "@/components/collegeHeader";
import DepartmentHeader from "@/components/departmentHeader";
import EventCard from "@/components/eventCards";
import NewsCard from "@/components/newsCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { CiCalendar, CiSearch } from "react-icons/ci";
import {
  FaArrowRightLong,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa6";
import { GoArrowRight, GoBriefcase } from "react-icons/go";
import { HiOutlineBuildingOffice, HiOutlineLink } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { IoArrowForwardOutline, IoBriefcaseOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

interface Department {
  id: number;
  college_id: number;
  slug: string;
  title: string;
  subtitle: string;
  about: string;
  vision: string;
  mission: string;
  priority: number;
  created_at: string;
  updated_at: string;
  student_number: string;
  college: {
    id: number;
    subdomain: string;
    slug: string | null;
    title: string;
  };
  staffCount: number;
  leadCount: number;
}

interface File {
  id: number;
  path: string;
  created_at: string;
  updated_at: string;
}

interface Student {
  id: number;
  research_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Research {
  id: number;
  department_id: number;
  title: string;
  date: string;
  supervisor: string | null;
  file_id: number;
  created_at: string;
  updated_at: string;
  department: Department;
  file: File;
  students: Student[];
}

interface ResearchResponse {
  total: number;
  page: number;
  limit: number;
  data: Research[];
}

// Date Picker Component Types
interface DateRange {
  from: string;
  to: string;
}

interface DatePickerProps {
  onDateChange: (dates: DateRange) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  selectedDates: DateRange;
}

const DatePicker = ({
  onDateChange,
  isOpen,
  onToggle,
  selectedDates,
}: DatePickerProps) => {
  const [startDate, setStartDate] = useState(selectedDates.from || "");
  const [endDate, setEndDate] = useState(selectedDates.to || "");
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleApply = () => {
    if (startDate && endDate) {
      onDateChange({ from: startDate, to: endDate });
      onToggle(false);
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    onDateChange({ from: "", to: "" });
    onToggle(false);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={datePickerRef}
      className="absolute top-full left-0 mt-2 bg-white border border-lightBorder rounded-xl shadow-lg p-4 z-50 min-w-[280px]"
    >
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-lightBorder rounded-lg focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="w-full px-3 py-2 border border-lightBorder rounded-lg focus:border-primary outline-none"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleClear}
            className="flex-1 px-3 py-2 text-sm border border-lightBorder rounded-lg hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

// Research Skeleton Component
const ResearchSkeleton = () => (
  <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="animate-pulse flex_start flex-col gap-3 p-3 rounded-3xl bg-gray-200 w-full"
      >
        <div className="flex_start gap-3 border-b border-b-gray-300 pb-4 w-full">
          <div className="w-10 h-10 rounded-lg bg-gray-300"></div>
          <div className="flex_start flex-col flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="flex_start w-full gap-5 lg:flex-row flex-col">
          <div className="flex_start flex-col w-full">
            <div className="h-3 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-full mb-3"></div>
            <div className="h-8 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;
  const college = params?.college as string;

  // State management
  const [modalId, setModalId] = useState<number | null>(null);
  const [selectedResearch, setSelectedResearch] = useState<Research | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<DateRange>({
    from: "",
    to: "",
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Build API URL with filters
  const buildApiUrl = () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "15",
    });

    if (appliedSearchQuery.trim()) {
      params.append("search", appliedSearchQuery.trim());
    }

    if (selectedDates.from) {
      params.append("date_from", selectedDates.from);
    }

    if (selectedDates.to) {
      params.append("date_to", selectedDates.to);
    }

    return `${API_URL}/website/departments/${slug}/researches?${params.toString()}`;
  };

  // Fetch research data
  const {
    data: researchData,
    loading: researchLoading,
    refetch,
  } = useFetch<ResearchResponse>(buildApiUrl());

  // Handle modal
  const handleModal = (research: Research | null) => {
    setSelectedResearch(research);
    setModalId(research?.id || null);
  };

  // Handle search - only when button is clicked
  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery);
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  // Handle date change
  const handleDateChange = (dates: DateRange) => {
    setSelectedDates(dates);
    setCurrentPage(1);
    // Auto-refetch when dates change
    setTimeout(() => refetch(), 100);
  };

  // Handle Enter key in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get file name from path
  const getFileName = (filePath: string) => {
    const parts = filePath.split("/");
    const fileName = parts[parts.length - 1];
    // Remove timestamp prefix and return clean filename
    const cleanName = fileName.replace(/^\d+-\d+\./, "");
    return cleanName || "research.pdf";
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setAppliedSearchQuery("");
    setSelectedDates({ from: "", to: "" });
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader />
      <div className="max-w-[1040px] px-3 flex_start w-full">
        <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-0">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px]  lg:flex-row flex-col-reverse">
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}`}
                title={t("about_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("about_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/vision-and-mission`}
                title={t("vision_mission")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("vision_mission")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/staff`}
                title={t("council_staff")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("council_staff")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/news`}
                title={t("news_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("news_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                <span>{t("researches")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </div>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/course-subjects`}
                title={t("course_subjects")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("course_subjects")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/guide-lines`}
                title={t("guide_lines")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("guide_lines")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
            </div>

            <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
              <div className="md:block hidden">
                <SubHeader title={t("researches")} alt={false} />
              </div>
              <h2 className="md:hidden block relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                <span className="z-10 relative">{t("researches")}</span>
              </h2>

              {/* Search and Filter Section */}
              <div className="w-full flex_center gap-5">
                {/* Date Picker */}
                <div className="relative lg:w-[20%] sm:w-[33%] w-14 text-sm flex-shrink-0 sm:border-none border border-lightBorder sm:p-0 p-2 rounded-md">
                  <button
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="text-start sm:block hidden w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    {selectedDates.from && selectedDates.to
                      ? `${selectedDates.from} to ${selectedDates.to}`
                      : t("select_date")}
                  </button>
                  <CiCalendar
                    className="sm:hidden block text-2xl cursor-pointer"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  />
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown
                      className={`transition-transform ${
                        isDatePickerOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>

                  <DatePicker
                    isOpen={isDatePickerOpen}
                    onToggle={setIsDatePickerOpen}
                    onDateChange={handleDateChange}
                    selectedDates={selectedDates}
                  />
                </div>

                {/* Search Input */}
                <div className="relative w-full">
                  <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
                    <CiSearch />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="py-2 w-full border-lightBorder sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
                    placeholder={t("search_research")}
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="sm:px-6 px-2 flex-shrink-0 py-2 sm:rounded-xl rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  {t("search")}
                </button>
              </div>

              {/* Results Info */}
              {/* {!researchLoading && researchData && (
                <div className="text-sm text-gray-600">
                  Showing {researchData.data.length} of {researchData.total}{" "}
                  results
                  {appliedSearchQuery && ` for "${appliedSearchQuery}"`}
                  {(selectedDates.from || selectedDates.to) &&
                    " in selected date range"}
                </div>
              )} */}

              {/* Research Grid */}
              {researchLoading ? (
                <ResearchSkeleton />
              ) : (
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  {researchData?.data && researchData.data.length > 0 ? (
                    researchData.data.map((research) => (
                      <div
                        key={research.id}
                        className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full"
                      >
                        <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                          <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-lg">
                            <CiSearch className="text-2xl" />
                          </div>
                          <div className="flex_start flex-col">
                            <h4 className="font-medium">{research.title}</h4>
                            <span className="text-black opacity-60 text-sm">
                              {formatDate(research.date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                          <div className="flex_start flex-col w-full">
                            <span className="text-black opacity-60 text-xs">
                              {t("attachment")}
                            </span>
                            <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm mb-3">
                              <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                                <HiOutlineLink />
                              </span>
                              <span>{getFileName(research.file.path)}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleModal(research)}
                              className="flex justify-between items-center w-full gap-4 px-2 text-sm text-golden border-t border-t-lightBorder py-3"
                            >
                              <p>{t("read_more")}</p>
                              <FaArrowRightLong className="rtl:rotate-180" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-gray-500 text-lg">
                        No research found matching your criteria.
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {researchData && researchData.total > 15 && (
                <div className="flex_center gap-2 mt-8">
                  {Array.from(
                    { length: Math.ceil(researchData.total / 15) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        setTimeout(() => refetch(), 100);
                      }}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "border border-lightBorder hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalId && selectedResearch && (
        <div className="flex_center fixed top-0 left-0 w-full h-full z-20">
          <div className="bg-white flex_start flex-col gap-5 z-10 md:w-[778px] w-[90%] rounded-3xl overflow-hidden">
            <div className="flex justify-between items-center gap-2 w-full bg-golden text-white p-6">
              <h3 className="md:text-smallTitle text-lg font-semibold">
                {t("research_detail")}
              </h3>
              <button
                type="button"
                onClick={() => handleModal(null)}
                className="text-3xl"
              >
                <IoMdClose />
              </button>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full p-6">
              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {t("research_title")}
                </span>
                <p className="text-secondary font-medium">
                  {selectedResearch.title}
                </p>
              </div>
              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {t("supervisor")}
                </span>
                <p className="text-secondary font-medium">
                  {selectedResearch.supervisor || "N/A"}
                </p>
              </div>

              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {t("attachment")}
                </span>
                <p className="text-secondary font-medium">
                  {formatDate(selectedResearch.date)}
                </p>
                <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                  <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                    <HiOutlineLink />
                  </span>
                  <span>{getFileName(selectedResearch.file.path)}</span>
                </button>
              </div>
              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {t("students")}
                </span>
                {selectedResearch.students &&
                selectedResearch.students.length > 0 ? (
                  selectedResearch.students.map((student) => (
                    <li
                      key={student.id}
                      className="text-secondary font-medium list-disc"
                    >
                      {student.name}
                    </li>
                  ))
                ) : (
                  <p className="text-secondary font-medium">
                    No students assigned
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleModal(null)}
            className="w-full fixed h-full left-0 top-0 bg-black bg-opacity-60"
          ></button>
        </div>
      )}
    </div>
  );
};

export default Page;
