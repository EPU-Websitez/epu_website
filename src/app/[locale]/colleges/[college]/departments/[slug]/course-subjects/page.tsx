"use client";

import DepartmentHeader from "@/components/departmentHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BsBook } from "react-icons/bs";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
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
    description: string;
  };
  staffCount: number;
  leadCount: number;
}

interface CourseInfo {
  id: number;
  subject_id: number;
  stage: string | null;
  semester: string | null;
  course_type: string | null;
  credit: string;
  code: string;
  created_at: string;
  updated_at: string;
}

interface AssessmentScheme {
  id: number;
  subject_id: number;
  attendance: string;
  class_tests_quizzes: string;
  midterm_exam: string;
  practical_exam: string;
  final_exam: string;
  created_at: string;
  updated_at: string;
}

interface SubjectSchedule {
  id: number;
  subject_id: number;
  duration: string;
  lectures: string;
  language: string;
  hours_per_week: string;
  created_at: string;
  updated_at: string;
}

interface File {
  id: number;
  path: string;
  created_at: string;
  updated_at: string;
}

interface LectureFile {
  id: number;
  lecture_id: number;
  file_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  file: File;
}

interface PdfLecture {
  id: number;
  subject_id: number;
  week_title: string;
  created_at: string;
  updated_at: string;
  files: LectureFile[];
}

interface Subject {
  id: number;
  department_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  department: Department;
  courseInfo: CourseInfo;
  assessmentScheme: AssessmentScheme;
  subjectSchedule: SubjectSchedule;
  pdfLectures: PdfLecture[];
}

interface CurriculumSubject {
  id: number;
  semester_id: number;
  subject: string;
  code: string;
  theory_hours: string;
  practical_hours: string;
  ects: string;
  module_description: string;
  language: string;
  created_at: string;
  updated_at: string;
}

interface CurriculumSemester {
  id: number;
  curriculum_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  subjects: CurriculumSubject[];
}

interface Curriculum {
  id: number;
  department_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  department: Department;
  semesters: CurriculumSemester[];
}

interface CurriculumResponse {
  total: number;
  page: number;
  limit: number;
  data: Curriculum[];
}

interface SubjectsResponse {
  total: number;
  page: number;
  limit: number;
  data: Subject[];
}
const STAGE_OPTIONS = [
  { value: "", label: "All Stages" },
  { value: "STAGE_1", label: "Stage 1" },
  { value: "STAGE_2", label: "Stage 2" },
  { value: "STAGE_3", label: "Stage 3" },
  { value: "STAGE_4", label: "Stage 4" },
  { value: "STAGE_5", label: "Stage 5" },
];

const SEMESTER_OPTIONS = [
  { value: "", label: "All Semesters" },
  { value: "FIRST", label: "First" },
  { value: "SECOND", label: "Second" },
  { value: "THIRD", label: "Third" },
  { value: "FOURTH", label: "Fourth" },
  { value: "FIFTH", label: "Fifth" },
  { value: "SIXTH", label: "Sixth" },
  { value: "SEVENTH", label: "Seventh" },
  { value: "EIGHTH", label: "Eighth" },
  { value: "NINTH", label: "Ninth" },
  { value: "TENTH", label: "Tenth" },
];

const COURSE_TYPE_OPTIONS = [
  { value: "", label: "All Systems" },
  { value: "CORSAT", label: "CORSAT" },
  { value: "BOLOGNA", label: "BOLOGNA" },
];

// Filter options
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

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;
  const college = params?.college as string;

  // State management
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedCourseType, setSelectedCourseType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Build API URL with filters
  const buildApiUrl = () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "10",
    });

    if (selectedStage) {
      params.append("stage", selectedStage);
    }

    if (selectedSemester) {
      params.append("semester", selectedSemester);
    }

    if (selectedCourseType) {
      params.append("course_type", selectedCourseType);
    }

    return `${API_URL}/website/departments/${slug}/course-subjects?${params.toString()}`;
  };

  // Fetch curriculums data
  const { data: curriculumsData, loading: curriculumsLoading } =
    useFetch<CurriculumResponse>(
      `${API_URL}/website/departments/${slug}/course-curriculums?page=1&limit=10`
    );

  // Fetch subjects data
  const {
    data: subjectsData,
    loading: subjectsLoading,
    refetch,
  } = useFetch<SubjectsResponse>(buildApiUrl());

  // Handle filter changes
  const handleStageChange = (stage: string) => {
    setSelectedStage(stage);
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  const handleCourseTypeChange = (courseType: string) => {
    setSelectedCourseType(courseType);
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  // Handle search button
  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedStage("");
    setSelectedSemester("");
    setSelectedCourseType("");
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  // Get instructor name (you might need to add this field to your API)
  const getInstructorName = (subject: Subject) => {
    // This would come from your API if you have instructor data
    return "Dr. Zana Ahmed Rauf"; // Placeholder
  };

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader />
      <div className="max-w-[1040px] px-3 flex_start w-full">
        <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
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
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/researches`}
                title={t("researches")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("researches")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
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

            <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 text-secondary pb-10 flex_start flex-col gap-7 w-full">
              <div className="md:block hidden">
                <SubHeader title={t("course_subjects")} alt={false} />
              </div>
              <h2 className="md:hidden block relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                <span className="z-10 relative">{t("course_subjects")}</span>
              </h2>

              {/* Dynamic Curriculum Links */}
              {/* {curriculumsLoading ? (
                <CurriculumSkeleton />
              ) : ( */}
              <div className="w-full flex_start flex-col gap-5">
                {curriculumsData?.data && curriculumsData.data.length > 0 ? (
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
              {/* )} */}

              {/* Filter Section */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-5">
                {/* Stage Filter */}
                <div className="relative w-full text-sm flex-shrink-0">
                  <select
                    value={selectedStage}
                    onChange={(e) => handleStageChange(e.target.value)}
                    className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    {STAGE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>

                {/* Semester Filter */}
                <div className="relative w-full text-sm flex-shrink-0">
                  <select
                    value={selectedSemester}
                    onChange={(e) => handleSemesterChange(e.target.value)}
                    className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    {SEMESTER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>

                {/* Course Type Filter */}
                <div className="relative w-full text-sm flex-shrink-0">
                  <select
                    value={selectedCourseType}
                    onChange={(e) => handleCourseTypeChange(e.target.value)}
                    className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    {COURSE_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="sm:px-6 px-2 flex-shrink-0 sm:py-2 py-1 sm:rounded-xl rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  {t("search")}
                </button>
              </div>

              {/* Results Info */}
              {!subjectsLoading && subjectsData && (
                <div className="text-sm text-gray-600">
                  Showing {subjectsData.data.length} of {subjectsData.total}{" "}
                  subjects
                  {selectedStage &&
                    ` in ${
                      STAGE_OPTIONS.find((o) => o.value === selectedStage)
                        ?.label
                    }`}
                  {selectedSemester &&
                    ` • ${
                      SEMESTER_OPTIONS.find((o) => o.value === selectedSemester)
                        ?.label
                    } semester`}
                  {selectedCourseType &&
                    ` • ${
                      COURSE_TYPE_OPTIONS.find(
                        (o) => o.value === selectedCourseType
                      )?.label
                    } system`}
                </div>
              )}

              {/* Subjects Grid */}
              {subjectsLoading ? (
                <SubjectsSkeleton />
              ) : (
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  {subjectsData?.data && subjectsData.data.length > 0 ? (
                    subjectsData.data.map((subject) => (
                      <div
                        key={subject.id}
                        className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full"
                      >
                        <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                          <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-lg">
                            <BsBook className="text-2xl" />
                          </div>
                          <div className="flex_start flex-col">
                            <h4 className="font-medium">{subject.name}</h4>
                            <span className="text-black opacity-60 text-sm">
                              {getInstructorName(subject)}
                            </span>
                            {subject.courseInfo.code && (
                              <span className="text-black opacity-60 text-xs">
                                {subject.courseInfo.code}
                              </span>
                            )}
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
              )}

              {/* Pagination */}
              {subjectsData && subjectsData.total > 10 && (
                <div className="flex_center gap-2 mt-8">
                  {Array.from(
                    { length: Math.ceil(subjectsData.total / 10) },
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
    </div>
  );
};

export default Page;
