"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { GrLinkNext } from "react-icons/gr";
import { HiOutlineLink } from "react-icons/hi2";
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

// Skeleton Components
const SubjectDetailSkeleton = () => (
  <div className="w-full flex_start flex-col gap-5 bg-backgroundSecondary border border-lightBorder rounded-3xl p-5">
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      </div>
    </div>
    <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 rounded-3xl p-5 h-64"
        ></div>
      ))}
    </div>
    <div className="animate-pulse h-4 bg-gray-300 rounded w-1/4"></div>
    <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 rounded-3xl p-5 h-32"
        ></div>
      ))}
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const subjectId = params?.subjectId as string;
  const slug = params?.slug as string;

  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch subject data
  const {
    data: subjectData,
    loading: subjectLoading,
    error: subjectError,
  } = useFetch<Subject>(
    `${API_URL}/website/departments/${slug}/course-subjects/${subjectId}`
  );

  // Helper functions
  const formatStage = (stage: string | null | undefined) => {
    if (!stage) return "N/A";
    return stage.replace("STAGE_", "Stage ");
  };

  const formatSemester = (semester: string | null | undefined) => {
    if (!semester) return "N/A";
    const semesterMap: { [key: string]: string } = {
      FIRST: "First",
      SECOND: "Second",
      THIRD: "Third",
      FOURTH: "Fourth",
      FIFTH: "Fifth",
      SIXTH: "Sixth",
      SEVENTH: "Seventh",
      EIGHTH: "Eighth",
      NINTH: "Ninth",
      TENTH: "Tenth",
    };
    return semesterMap[semester] || semester;
  };

  const formatCourseType = (courseType: string | null | undefined) => {
    if (!courseType) return "N/A";
    return courseType === "CORSAT" ? "Coursat" : courseType;
  };

  const getFileName = (filePath: string) => {
    const parts = filePath.split("/");
    const fileName = parts[parts.length - 1];
    return fileName || "lecture.pdf";
  };

  const truncateDescription = (
    text: string | undefined,
    maxLength: number = 200
  ) => {
    if (!text || text.length <= maxLength) return text || "";
    return text.substring(0, maxLength) + "...";
  };

  const handleFileDownload = (filePath: string, fileName: string) => {
    // Handle file download/view logic here
    window.open(`${API_URL}${filePath}`, "_blank");
  };

  if (subjectError) {
    return (
      <div className="w-full flex_center my-10">
        <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Subject Data
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!subjectData && !subjectLoading) {
    return (
      <div className="w-full flex_center my-10">
        <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8 text-center">
          <h1 className="text-2xl font-bold text-gray-500 mb-4">
            Subject Not Found
          </h1>
          <p className="text-gray-600">
            The requested subject could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex_center my-10">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8 text-secondary">
        <SubHeader title={t("see_details")} alt={false} />

        {subjectLoading ? (
          <SubjectDetailSkeleton />
        ) : (
          <div className="w-full flex_start flex-col gap-5 bg-backgroundSecondary border border-lightBorder rounded-3xl p-5">
            <h5 className="text-opacity-25 text-black font-semibold">
              {t("subject_name")}
            </h5>
            <h4 className="font-medium">{subjectData?.name}</h4>
            <h5 className="text-opacity-25 text-black font-semibold">
              {t("subject_description")}
            </h5>
            <p>
              {showFullDescription
                ? subjectData?.description
                : truncateDescription(subjectData?.description || "")}
              {subjectData?.description &&
                subjectData.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-golden font-semibold ml-1"
                  >
                    {showFullDescription ? "...Less" : "...More"}
                  </button>
                )}
            </p>

            <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-5">
              {/* Course Info */}
              <div className="flex_start flex-col gap-5 bg-white rounded-3xl p-5">
                <h3 className="pb-5 text-golden text-sm font-semibold border-b border-b-lightBorder w-full">
                  {t("course_info")}
                </h3>
                <div className="flex_start lg:flex-col flex-row lg:gap-5 sm:gap-20 gap-10 w-full sm:flex-nowrap flex-wrap">
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("stage")}
                    </h5>
                    <h4 className="font-medium">
                      {formatStage(subjectData?.courseInfo?.stage)}
                    </h4>
                  </div>
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("semester")}
                    </h5>
                    <h4 className="font-medium">
                      {formatSemester(subjectData?.courseInfo?.semester)}
                    </h4>
                  </div>
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("course_type")}
                    </h5>
                    <h4 className="font-medium">
                      {formatCourseType(subjectData?.courseInfo?.course_type)}
                    </h4>
                  </div>
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("credit")}
                    </h5>
                    <h4 className="font-medium">
                      {subjectData?.courseInfo?.credit || "N/A"}
                    </h4>
                  </div>
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("code")}
                    </h5>
                    <h4 className="font-medium">
                      {subjectData?.courseInfo?.code || "N/A"}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Assessment Scheme */}
              <div className="flex_start flex-col gap-5 bg-white rounded-3xl p-5">
                <h3 className="pb-5 text-golden text-sm font-semibold border-b border-b-lightBorder w-full">
                  {t("assessment_scheme")}
                </h3>
                <div className="flex_start lg:flex-col flex-row lg:gap-5 sm:gap-20 gap-10 w-full sm:flex-nowrap flex-wrap">
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("attendance")}
                    </h5>
                    <h4 className="font-medium">
                      {subjectData?.assessmentScheme?.attendance || "N/A"}
                    </h4>
                  </div>
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("class_tests")}
                    </h5>
                    <h4 className="font-medium">
                      {subjectData?.assessmentScheme?.class_tests_quizzes ||
                        "N/A"}
                    </h4>
                  </div>
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("midterm_exam")}
                    </h5>
                    <h4 className="font-medium">
                      {subjectData?.assessmentScheme?.midterm_exam || "N/A"}
                    </h4>
                  </div>
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("practical_exam")}
                    </h5>
                    <h4 className="font-medium">
                      {subjectData?.assessmentScheme?.practical_exam || "N/A"}
                    </h4>
                  </div>
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("final_exam")}
                    </h5>
                    <h4 className="font-medium">
                      {subjectData?.assessmentScheme?.final_exam || "N/A"}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Subject Schedule */}
              <div className="flex_start flex-col gap-5 bg-white rounded-3xl p-5">
                <h3 className="pb-5 text-golden text-sm font-semibold border-b border-b-lightBorder w-full">
                  {t("subject_schedule")}
                </h3>
                <div className="flex_start lg:flex-col flex-row lg:gap-5 sm:gap-20 gap-10 w-full sm:flex-nowrap flex-wrap">
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("duration")}
                    </h5>
                    <h4 className="font-medium">
                      {subjectData?.subjectSchedule?.duration || "N/A"}
                    </h4>
                  </div>
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("lectures")}
                    </h5>
                    <h4 className="font-medium">
                      {subjectData?.subjectSchedule?.lectures || "N/A"}
                    </h4>
                  </div>
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("language")}
                    </h5>
                    <h4 className="font-medium">
                      {subjectData?.subjectSchedule?.language || "N/A"}
                    </h4>
                  </div>
                  <div className="flex_start flex-col gap-1">
                    <h5 className="text-opacity-25 text-black font-semibold">
                      {t("hours_per_week")}
                    </h5>
                    <h4 className="font-medium">
                      {subjectData?.subjectSchedule?.hours_per_week || "N/A"}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Lectures */}
            <h5 className="text-opacity-25 text-black font-semibold">
              {t("PDF_lectures")}
            </h5>
            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5">
              {subjectData?.pdfLectures &&
              subjectData.pdfLectures.length > 0 ? (
                subjectData.pdfLectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="flex_start flex-col gap-5 p-5 rounded-3xl bg-background w-full"
                  >
                    <h4 className="font-semibold text-sm text-golden">
                      {lecture.week_title}
                    </h4>
                    {lecture.files.map((file) => (
                      <button
                        key={file.id}
                        onClick={() =>
                          handleFileDownload(file.file.path, file.title)
                        }
                        className="flex justify-between items-center gap-4 w-full hover:bg-white hover:rounded-lg hover:p-2 transition-all"
                      >
                        <span className="bg-[#81B1CE] text-white flex_center flex-shrink-0 w-7 h-7 rounded-full">
                          <HiOutlineLink />
                        </span>
                        <span className="text-secondary text-opacity-70 text-sm text-start max-w-[200px] truncate">
                          {file.title}
                        </span>
                        <div className="flex-1 flex justify-end">
                          <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                            <GrLinkNext className="-rotate-45" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">
                    No PDF lectures available for this subject.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
