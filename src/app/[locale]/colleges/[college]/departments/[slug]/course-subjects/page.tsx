"use client";

import DepartmentHeader from "@/components/departmentHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BsBook } from "react-icons/bs";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// ---------------- Types ----------------

interface College {
  id: number;
  subdomain: string;
  slug: string | null;
  type: string;
  title: string;
  description: string;
  news_title: string;
  news_subtitle: string;
  college_title: string;
  college_subtitle: string;
  teacher_title: string;
  teacher_subtitle: string;
  event_title: string;
  event_subtitle: string;
  about_title: string;
  about_content: string;
  student_number: string;
  vision: string;
  mission: string;
  logo_image_id: number;
  priority: number;
  created_at: string;
  updated_at: string;
}

interface DepartmentLite {
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
  college: College;
}

interface CurriculumLite {
  id: number;
  department_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  department: DepartmentLite;
  _count: { semesters: number };
  semesters_count: number;
}
interface CurriculumResponse {
  total: number;
  page: number;
  limit: number;
  data: CurriculumLite[];
}

interface SemesterLite {
  id: number;
  curriculum_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  curriculum: {
    id: number;
    department_id: number;
    title: string;
    created_at: string;
    updated_at: string;
    department: DepartmentLite;
  };
}

interface Subject {
  id: number;
  semester_id: number;
  name: string;
  description: string;
  code: string;
  credit: string;
  ects: string;
  stage: string;
  course_type: string;
  theory_hours: string;
  practical_hours: string;
  duration: string;
  lectures: string;
  language: string;
  hours_per_week: string;
  attendance: string;
  class_tests_quizzes: string;
  midterm_exam: string;
  practical_exam: string;
  final_exam: string;
  module_description: string;
  created_at: string;
  updated_at: string;
  semester: SemesterLite;
  _count: { pdf_lectures: number };
  lectures_count: number;
}
interface SubjectsResponse {
  total: number;
  page: number;
  limit: number;
  data: Subject[];
}

// ---------------- UI ----------------

const SubjectsSkeleton = () => (
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
        <div className="w-full h-12 bg-gray-300 rounded-3xl"></div>
      </div>
    ))}
  </div>
);

const STAGE_OPTIONS = [
  { value: "", label: "All Stages" },
  { value: "STAGE_1", label: "Stage 1" },
  { value: "STAGE_2", label: "Stage 2" },
  { value: "STAGE_3", label: "Stage 3" },
  { value: "STAGE_4", label: "Stage 4" },
  { value: "STAGE_5", label: "Stage 5" },
];

const COURSE_TYPE_OPTIONS = [
  { value: "", label: "All Systems" },
  { value: "CORSAT", label: "CORSAT" },
  { value: "BOLOGNA", label: "BOLOGNA" },
];

const LANGUAGE_OPTIONS = [
  { value: "", label: "All Languages" },
  { value: "English", label: "English" },
  { value: "Arabic", label: "Arabic" },
  { value: "Kurdish", label: "Kurdish" },
];

// ---------------- Page ----------------

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;
  const college = params?.college as string;

  // Filters
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchText, setSearchText] = useState("");

  // Paging
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Accumulated list + flags
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [total, setTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Track seen IDs to prevent duplicates
  const seenIdsRef = useRef<Set<number>>(new Set());

  // Build URL
  const subjectsUrl = useMemo(() => {
    const qp = new URLSearchParams({
      page: String(currentPage),
      limit: String(pageSize),
    });
    if (selectedStage) qp.set("stage", selectedStage);
    if (selectedCourseType) qp.set("course_type", selectedCourseType);
    if (selectedLanguage) qp.set("language", selectedLanguage);
    if (searchText.trim()) qp.set("search", searchText.trim());
    return `${API_URL}/website/departments/${slug}/subjects?${qp.toString()}`;
  }, [
    slug,
    currentPage,
    pageSize,
    selectedStage,
    selectedCourseType,
    selectedLanguage,
    searchText,
  ]);

  // Curriculums
  const { data: curriculumsData, loading: curriculumsLoading } =
    useFetch<CurriculumResponse>(
      `${API_URL}/website/departments/${slug}/curriculums?page=1&limit=20`,
      locale
    );

  // Subjects fetch
  const {
    data: subjectsData,
    loading: subjectsLoading,
    refetch,
  } = useFetch<SubjectsResponse>(subjectsUrl, locale);

  // Drive refetches by URL changes
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectsUrl]);

  // Merge data safely (no duplicates, ignore stale pages)
  useEffect(() => {
    if (subjectsLoading || !subjectsData) return;

    // Ignore stale responses (e.g., a slower request for an older page)
    if (
      typeof subjectsData.page === "number" &&
      subjectsData.page !== currentPage
    ) {
      return;
    }

    setTotal(subjectsData.total ?? 0);

    const incoming = subjectsData.data ?? [];

    const newOnes = incoming.filter((it) => !seenIdsRef.current.has(it.id));

    if (newOnes.length > 0) {
      setSubjects((prev) => [...prev, ...newOnes]); // always append at the end
      newOnes.forEach((it) => seenIdsRef.current.add(it.id));
    }

    if (currentPage === 1) {
      setInitialLoading(false);
    } else {
      setLoadingMore(false);
    }
  }, [subjectsLoading, subjectsData, currentPage]);

  // Helpers
  const resetAndSearch = () => {
    setCurrentPage(1);
    setSubjects([]);
    setTotal(0);
    setInitialLoading(true);
    setLoadingMore(false);
    seenIdsRef.current = new Set();
  };

  const handleStageChange = (v: string) => {
    setSelectedStage(v);
    resetAndSearch();
  };
  const handleCourseTypeChange = (v: string) => {
    setSelectedCourseType(v);
    resetAndSearch();
  };
  const handleLanguageChange = (v: string) => {
    setSelectedLanguage(v);
    resetAndSearch();
  };
  const handleSearch = () => {
    resetAndSearch();
  };
  const clearAllFilters = () => {
    setSelectedStage("");
    setSelectedCourseType("");
    setSelectedLanguage("");
    setSearchText("");
    resetAndSearch();
  };

  const loadMore = () => {
    if (loadingMore) return;
    if (subjects.length >= total) return;
    setLoadingMore(true);
    setCurrentPage((p) => p + 1); // triggers refetch via subjectsUrl effect
  };

  const getInstructorName = (_subject: Subject) => "Dr. Zana Ahmed Rauf";
  const canSeeMore = subjects.length < total;

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader />
      <div className="max-w-[1040px] flex_start w-full">
        <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-3 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] lg:flex-row flex-col-reverse">
            {/* Left nav */}
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
              {/* <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/researches`}
                title={t("researches")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("researches")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link> */}
              <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                <span>{t("course_subjects")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </div>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/guide-lines`}
                title={t("guide_lines")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("guide_lines")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
            </div>

            {/* Main */}
            <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 text-secondary pb-10 flex_start flex-col gap-7 w-full">
              <div className="md:block hidden">
                <SubHeader title={t("course_subjects")} alt={false} />
              </div>
              <h2 className="md:hidden block relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                <span className="z-10 relative">{t("course_subjects")}</span>
              </h2>

              {/* Curriculums */}
              <div className="w-full flex_start flex-col gap-5">
                {curriculumsLoading ? (
                  <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse" />
                ) : curriculumsData?.data && curriculumsData.data.length > 0 ? (
                  curriculumsData.data.map((curriculum) => (
                    <Link
                      key={curriculum.id}
                      href={`/${locale}/colleges/${college}/departments/${slug}/course-subjects/carriculum/${curriculum.id}`}
                      className="w-full flex justify-between items-center gap-5 rounded-xl border border-lightBorder px-3 p-2 font-semibold hover:border-golden hover:bg-golden hover:text-white transition-all"
                    >
                      <span>{curriculum.title}</span>
                      <span className="w-[30px] h-[30px] text-white bg-golden rounded-full flex_center">
                        <FaChevronRight className="rtl:rotate-180" />
                      </span>
                    </Link>
                  ))
                ) : (
                  <Link
                    href={`/${locale}/colleges/${college}/departments/${slug}/course-subjects/carriculum`}
                    className="w-full flex justify-between items-center gap-5 rounded-xl border border-lightBorder px-3 p-2 font-semibold"
                  >
                    <span>{t("see_course_curriculum")}</span>
                    <span className="w-[30px] h-[30px] text-white bg-golden rounded-full flex_center">
                      <FaChevronRight className="rtl:rotate-180" />
                    </span>
                  </Link>
                )}
              </div>

              {/* Filters */}
              <div className="w-full flex_start gap-5">
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search subjects..."
                  className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-70 focus:border-primary outline-none col-span-2 sm:col-span-1"
                />
                <button
                  onClick={handleSearch}
                  className="sm:px-6 flex px-2 flex-shrink-0 sm:py-2 py-1 sm:rounded-xl rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  {t("search")}
                </button>
              </div>
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-5">
                <div className="relative w-full text-sm flex-shrink-0">
                  <select
                    value={selectedStage}
                    onChange={(e) => handleStageChange(e.target.value)}
                    className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    {STAGE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>

                <div className="relative w-full text-sm flex-shrink-0">
                  <select
                    value={selectedCourseType}
                    onChange={(e) => handleCourseTypeChange(e.target.value)}
                    className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    {COURSE_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>

                <div className="relative w-full text-sm flex-shrink-0">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    {LANGUAGE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>
              </div>

              {/* List */}
              {initialLoading ? (
                <SubjectsSkeleton />
              ) : (
                <>
                  <div className="grid lg:max-w-[710px] max-w/full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                    {subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full"
                        >
                          <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                            <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-golden flex_center text-white text-lg">
                              <BsBook className="text-2xl" />
                            </div>
                            <div className="flex_start flex-col">
                              <h4 className="font-medium sm:text-base text-sm">
                                {subject.name}
                              </h4>
                              <span className="text-black opacity-60 text-sm">
                                {getInstructorName(subject)}
                              </span>
                              {subject.code && (
                                <span className="text-black opacity-60 text-xs">
                                  {subject.code} • {subject.credit} Cr •{" "}
                                  {subject.ects} ECTS
                                </span>
                              )}
                              <span className="text-black opacity-50 text-xs">
                                {subject.semester?.title ?? ""} •{" "}
                                {subject.language}
                              </span>
                            </div>
                          </div>

                          <Link
                            href={`/${locale}/colleges/${college}/departments/${slug}/course-subjects/${subject.id}`}
                            title={t("course_subjects")}
                            className="w-full flex text-golden justify-between items-center gap-5 rounded-3xl border border-lightBorder p-2 font-medium hover:bg-golden hover:text-white transition-colors"
                          >
                            <span>{t("see_details")}</span>
                            <span className="w-[30px] h-[30px] text-white bg-golden rounded-full flex_center">
                              <FaChevronRight className="rtl:rotate-180" />
                            </span>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10">
                        <p className="text-gray-500 text-lg">
                          No subjects found matching your criteria.
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

                  {subjects.length < total && (
                    <div className="flex_center mt-8 w-full">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="px-4 py-2 rounded-lg border border-lightBorder hover:bg-gray-50 disabled:opacity-60"
                      >
                        {loadingMore
                          ? t("loading") || "Loading..."
                          : t("see_more") || "See more"}
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
