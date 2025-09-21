// src/app/[locale]/colleges/[college]/departments/[slug]/course-subjects/carriculum/[id]/[subjectId]/SubjectDetailsPageClient.tsx

"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { GrLinkNext } from "react-icons/gr";
import { HiOutlineLink } from "react-icons/hi2";

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

// ---------------- Types ----------------
interface SemesterLite {
  title: string;
}
interface Subject {
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
  semester: SemesterLite;
  pdf_lectures?: Array<{
    id: number;
    week_title?: string;
    title?: string;
    files?: Array<{
      id: number;
      title?: string;
      file?: { path: string };
      path?: string;
    }>;
  }>;
}

// ---------------- Spinner Component ----------------
const SpinnerIcon = () => (
  <div className="flex_center w-5 h-5">
    <svg
      className="animate-spin h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

// ---------------- Page Client Component ----------------
const SubjectDetailsPageClient = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const subjectId = params?.subjectId as string;
  const locale = params?.locale as string;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );

  const subjectUrl = useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_API_URL}/website/departments/subject/${subjectId}`,
    [subjectId]
  );

  const {
    data: subjectData,
    loading: subjectLoading,
    error: subjectError,
  } = useFetch<Subject>(subjectUrl, locale);

  // Helpers
  const formatStage = (stage?: string | null) =>
    !stage ? "N/A" : stage.replace("STAGE_", "Stage ");

  const formatCourseType = (ct?: string | null) =>
    !ct ? "N/A" : ct === "CORSAT" ? "Coursat" : ct;

  const truncate = (text?: string, max = 200) =>
    !text || text.length <= max ? text || "" : text.slice(0, max) + "...";

  const handleFileDownload = async (
    filePath?: string,
    suggestedName?: string
  ) => {
    if (!filePath) return;
    setDownloadingFiles((prev) => new Set(prev).add(filePath));
    try {
      const fileUrl = new URL(filePath, process.env.NEXT_PUBLIC_API_URL).href;
      const res = await fetch(fileUrl, { mode: "cors" });
      if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const fileName = suggestedName || filePath.split("/").pop() || "download";
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error(e);
      const fileUrl = new URL(filePath, process.env.NEXT_PUBLIC_API_URL).href;
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(filePath);
        return newSet;
      });
    }
  };

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

            <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-5">
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
                      lecture.files.map((file) => {
                        const isDownloading = downloadingFiles.has(file.path);
                        return (
                          <button
                            key={file.id}
                            onClick={() =>
                              !isDownloading &&
                              handleFileDownload(file.path, file.title)
                            }
                            disabled={isDownloading}
                            className="flex justify-between items-center gap-4 w-full hover:bg-white hover:rounded-lg hover:p-2 transition-all disabled:opacity-70 disabled:cursor-wait"
                          >
                            <span className="bg-[#81B1CE] text-white flex_center flex-shrink-0 w-7 h-7 rounded-full">
                              {isDownloading ? (
                                <SpinnerIcon />
                              ) : (
                                <HiOutlineLink />
                              )}
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
                        );
                      })
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

function LabeledValue({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex_start flex-col gap-1">
      <h5 className="text-opacity-25 text-black font-semibold">{label}</h5>
      <h4 className="font-medium">{value || "N/A"}</h4>
    </div>
  );
}

export default SubjectDetailsPageClient;
