"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { GrLinkNext } from "react-icons/gr";
import { HiOutlineLink } from "react-icons/hi2";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// ---------------- Skeleton ----------------
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
        />
      ))}
    </div>
    <div className="animate-pulse h-4 bg-gray-300 rounded w-1/4"></div>
    <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 rounded-3xl p-5 h-32"
        />
      ))}
    </div>
  </div>
);

// ---------------- Types (aligned with new API) ----------------
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
}

interface SemesterLite {
  id: number;
  curriculum_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  curriculum: CurriculumLite;
}

// The subject is now flattened (no courseInfo/assessmentScheme/subjectSchedule wrappers)
interface Subject {
  id: number;
  semester_id: number;
  name: string;
  description: string;
  code: string;
  credit: string;
  ects: string;
  stage: string; // e.g., "STAGE_1"
  course_type: string; // e.g., "CORSAT" | "BOLOGNA"
  theory_hours: string;
  practical_hours: string;
  duration: string;
  lectures: string;
  language: string; // e.g., "English"
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
  // API returns array; shape for files not shown, so keep it flexible
  pdf_lectures?: Array<{
    id: number;
    week_title?: string;
    title?: string;
    // files may be present, keep optional + minimal
    files?: Array<{
      id: number;
      title?: string;
      file?: { id: number; path: string };
      // some APIs may inline path
      path?: string;
    }>;
  }>;
}

// ---------------- Page ----------------
const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const subjectId = params?.subjectId as string;

  const [showFullDescription, setShowFullDescription] = useState(false);

  // New endpoint: /website/departments/subject/{subjectId}
  const subjectUrl = useMemo(
    () => `${API_URL}/website/departments/subject/${subjectId}`,
    [subjectId]
  );

  const {
    data: subjectData,
    loading: subjectLoading,
    error: subjectError,
  } = useFetch<Subject>(subjectUrl);

  // Helpers
  const formatStage = (stage?: string | null) =>
    !stage ? "N/A" : stage.replace("STAGE_", "Stage ");

  const formatCourseType = (ct?: string | null) =>
    !ct ? "N/A" : ct === "CORSAT" ? "Coursat" : ct;

  const truncate = (text?: string, max = 200) =>
    !text || text.length <= max ? text || "" : text.slice(0, max) + "...";

  // Robust cross-origin file download via Blob
  const handleFileDownload = async (
    filePath?: string,
    suggestedName?: string
  ) => {
    if (!filePath) return;
    try {
      const fileUrl = new URL(filePath, API_URL).href;
      const res = await fetch(fileUrl, { mode: "cors" });
      if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const pathName = filePath.split("?")[0];
      const ext = pathName.includes(".")
        ? `.${pathName.split(".").pop()!}`
        : "";
      const clean = suggestedName?.trim();
      const hasExt = !!clean && /\.[a-z0-9]{1,8}$/i.test(clean);
      const fileName =
        (hasExt && (clean as string)) ||
        (clean && `${clean}${ext}`) ||
        pathName.split("/").pop() ||
        "download";

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error(e);
      // Fallback: open in new tab
      const fileUrl = new URL(filePath, API_URL).href;
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Normalize pdf_lectures to a renderable structure
  const normalizedLectures = (subjectData?.pdf_lectures || []).map((lec) => {
    const title = lec.week_title || lec.title || "Lecture";
    const files =
      lec.files?.map((f) => ({
        id: f.id,
        title: f.title || "File",
        path: f.file?.path || f.path || "",
      })) || [];
    return { id: lec.id, title, files };
  });

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
            {/* Names & Description */}
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
                : truncate(subjectData?.description)}
              {subjectData?.description &&
                subjectData.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription((s) => !s)}
                    className="text-golden font-semibold ml-1"
                  >
                    {showFullDescription ? "...Less" : "...More"}
                  </button>
                )}
            </p>

            {/* Cards */}
            <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-5">
              {/* Course Info (flattened) */}
              <div className="flex_start flex-col gap-5 bg-white rounded-3xl p-5">
                <h3 className="pb-5 text-golden text-sm font-semibold border-b border-b-lightBorder w-full">
                  {t("course_info")}
                </h3>
                <div className="flex_start lg:flex-col flex-row lg:gap-5 sm:gap-20 gap-10 w-full sm:flex-nowrap flex-wrap">
                  <LabeledValue
                    label={t("stage")}
                    value={formatStage(subjectData?.stage)}
                  />
                  <LabeledValue
                    label={t("semester")}
                    value={subjectData?.semester?.title || "N/A"}
                  />
                  <LabeledValue
                    label={t("course_type")}
                    value={formatCourseType(subjectData?.course_type)}
                  />
                  <LabeledValue
                    label={t("credit")}
                    value={subjectData?.credit || "N/A"}
                  />
                  <LabeledValue
                    label={t("code")}
                    value={subjectData?.code || "N/A"}
                  />
                  <LabeledValue
                    label={t("ects")}
                    value={subjectData?.ects || "N/A"}
                  />
                </div>
              </div>

              {/* Assessment Scheme (flattened) */}
              <div className="flex_start flex-col gap-5 bg-white rounded-3xl p-5">
                <h3 className="pb-5 text-golden text-sm font-semibold border-b border-b-lightBorder w-full">
                  {t("assessment_scheme")}
                </h3>
                <div className="flex_start lg:flex-col flex-row lg:gap-5 sm:gap-20 gap-10 w-full sm:flex-nowrap flex-wrap">
                  <LabeledValue
                    label={t("attendance")}
                    value={subjectData?.attendance || "N/A"}
                  />
                  <LabeledValue
                    label={t("class_tests")}
                    value={subjectData?.class_tests_quizzes || "N/A"}
                  />
                  <LabeledValue
                    label={t("midterm_exam")}
                    value={subjectData?.midterm_exam || "N/A"}
                  />
                  <LabeledValue
                    label={t("practical_exam")}
                    value={subjectData?.practical_exam || "N/A"}
                  />
                  <LabeledValue
                    label={t("final_exam")}
                    value={subjectData?.final_exam || "N/A"}
                  />
                </div>
              </div>

              {/* Subject Schedule (flattened) */}
              <div className="flex_start flex-col gap-5 bg-white rounded-3xl p-5">
                <h3 className="pb-5 text-golden text-sm font-semibold border-b border-b-lightBorder w-full">
                  {t("subject_schedule")}
                </h3>
                <div className="flex_start lg:flex-col flex-row lg:gap-5 sm:gap-20 gap-10 w-full sm:flex-nowrap flex-wrap">
                  <LabeledValue
                    label={t("duration")}
                    value={subjectData?.duration || "N/A"}
                  />
                  <LabeledValue
                    label={t("lectures")}
                    value={subjectData?.lectures || "N/A"}
                  />
                  <LabeledValue
                    label={t("language")}
                    value={subjectData?.language || "N/A"}
                  />
                  <LabeledValue
                    label={t("hours_per_week")}
                    value={subjectData?.hours_per_week || "N/A"}
                  />
                  <LabeledValue
                    label={t("theory_hours")}
                    value={subjectData?.theory_hours || "N/A"}
                  />
                  <LabeledValue
                    label={t("practical_hours")}
                    value={subjectData?.practical_hours || "N/A"}
                  />
                </div>
              </div>
            </div>

            {/* Module Description (optional long text from API) */}
            {subjectData?.module_description && (
              <>
                <h5 className="text-opacity-25 text-black font-semibold">
                  Module Description
                </h5>
                <p className="text-sm text-black/70">
                  {subjectData.module_description}
                </p>
              </>
            )}

            {/* PDF Lectures */}
            <h5 className="text-opacity-25 text-black font-semibold">
              {t("PDF_lectures")}
            </h5>
            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5">
              {normalizedLectures.length > 0 ? (
                normalizedLectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="flex_start flex-col gap-5 p-5 rounded-3xl bg-background w-full"
                  >
                    <h4 className="font-semibold text-sm text-golden">
                      {lecture.title}
                    </h4>

                    {lecture.files.length > 0 ? (
                      lecture.files.map((file) => (
                        <button
                          key={file.id}
                          onClick={() =>
                            handleFileDownload(file.path, file.title)
                          }
                          className="flex justify-between items-center gap-4 w-full hover:bg-white hover:rounded-lg hover:p-2 transition-all"
                        >
                          <span className="bg-[#81B1CE] text-white flex_center flex-shrink-0 w-7 h-7 rounded-full">
                            <HiOutlineLink />
                          </span>
                          <span className="text-secondary text-opacity-70 text-sm text-start max-w-[200px] truncate">
                            {file.title || "File"}
                          </span>
                          <div className="flex-1 flex justify-end">
                            <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                              <GrLinkNext className="-rotate-45" />
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <span className="text-sm text-black/50">No files</span>
                    )}
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

// Small helper for consistent label/value rendering
function LabeledValue({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex_start flex-col gap-1">
      <h5 className="text-opacity-25 text-black font-semibold">{label}</h5>
      <h4 className="font-medium">{value || "N/A"}</h4>
    </div>
  );
}

export default Page;
