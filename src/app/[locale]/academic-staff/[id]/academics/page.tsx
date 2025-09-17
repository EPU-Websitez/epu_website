"use client";
import AcademicStaffHeader from "@/components/AcademicStaffHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import useFetch from "@/libs/hooks/useFetch";

// Icons
import { AiOutlineRise } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { GoArrowRight } from "react-icons/go";
import { HiOutlineLink } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

// Utilities
import { API_URL } from "@/libs/env";

/* ============================
  TypeScript Types
============================ */
interface FileRef {
  id: number;
  path: string;
}
interface FileEntry {
  id: number;
  file: FileRef | null;
}
interface Book {
  id: number;
  name: string | null;
  year: string | null;
  file: FileRef | null;
}
interface Publication {
  id: number;
  title: string | null;
  published_date: string | null;
  journal_title: string | null;
  impact_factor: string | null;
  doi_link: string | null;
  files: FileEntry[] | null;
}
interface Research {
  id: number;
  title: string | null;
  created_at: string | null;
  file: FileRef | null;
}
interface Student {
  id: number;
  name: string | null;
}
interface SupervisingResearch {
  id: number;
  title: string | null;
  year_from: string | null;
  year_to: string | null;
  files: FileEntry[] | null;
  students: Student[] | null;
}
interface Seminar {
  id: number;
  title: string | null;
  year: string | null;
  attendance_number: number | null;
  files: FileEntry[] | null;
}
interface Conference {
  id: number;
  title: string | null;
  year: string | null;
  attendance_number: number | null;
  files: FileEntry[] | null;
}
interface Training {
  id: number;
  title: string | null;
  year: string | null;
  level: string | null;
  type: string | null;
  files: FileEntry[] | null;
}
interface ThesisFileEntry {
  id: number;
  thesis_id: number;
  file_id: number;
  file: FileRef | null;
}
type ThesisType = "PHD" | "MASTER" | string;
interface Thesis {
  id: number;
  teacher_id: number;
  title: string | null;
  specialization: string | null;
  type: ThesisType | null;
  year: string | null;
  status: string | null;
  files: ThesisFileEntry[] | null;
}
interface PagedResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}
type DataItem =
  | Book
  | Publication
  | Research
  | SupervisingResearch
  | Seminar
  | Conference
  | Training
  | Thesis;

/* ============================
  Skeletons
============================ */
const CardSkeleton = () => (
  <div className="flex flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full animate-pulse">
    <div className="flex items-center gap-3 border-b border-b-lightBorder pb-4 w-full">
      <div className="w-10 h-10 rounded-lg bg-gray-300"></div>
      <div className="flex flex-col gap-2 w-full">
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mt-2">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);
const SectionSkeleton = ({ cardCount = 4 }: { cardCount?: number }) => (
  <div className="w-full">
    <div className="grid lg:max-w-[710px] w-full lg:grid-cols-2 gap-5">
      {[...Array(cardCount)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

/* ============================
  Helpers
============================ */
const safeArray = <T,>(arr: T[] | null | undefined): T[] =>
  Array.isArray(arr) ? arr : [];
const isValidDate = (value: string | null | undefined) => {
  if (!value) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
};
const formatMonthYear = (value: string | null | undefined, locale: string) => {
  if (!isValidDate(value)) return "";
  try {
    return new Date(value!).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
    });
  } catch {
    return "";
  }
};
const formatYearOnly = (value: string | null | undefined) => {
  if (!isValidDate(value)) return "";
  try {
    return String(new Date(value!).getFullYear());
  } catch {
    return "";
  }
};
const fileNameFromPath = (path?: string | null) => {
  if (!path) return "document.pdf";
  try {
    const clean = path.split("?")[0];
    const last = clean.substring(clean.lastIndexOf("/") + 1);
    return last || "document.pdf";
  } catch {
    return "document.pdf";
  }
};

/* ============================
  Spinner Component
============================ */
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

/* ============================
  Page Component
============================ */
const Page = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const id = String(params?.id || "");
  const locale = String(params?.locale || "en");

  const [tab, setTab] = useState<
    | "books"
    | "publications"
    | "researchIntrest"
    | "supervisingResearch"
    | "seminars"
    | "conferences"
    | "trainings"
    | "theses"
  >("books");

  const [modalId, setModalId] = useState<number | null>(null);
  const LIMIT = 6;
  const [data, setData] = useState<DataItem[]>([]);
  const [page, setPage] = useState(1);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );

  const endpoints: Record<typeof tab, string> = {
    books: "books",
    publications: "research-papers",
    researchIntrest: "researches",
    supervisingResearch: "supervising-researches",
    seminars: "seminars",
    conferences: "conferences",
    trainings: "trainings",
    theses: "theses",
  };

  const endpoint = endpoints[tab];
  const url = `${API_URL}/website/teachers/${id}/${endpoint}?page=${page}&limit=${LIMIT}`;
  const { data: hookData, loading } = useFetch<PagedResponse<DataItem>>(
    url,
    locale
  );

  useEffect(() => {
    setData([]);
    setPage(1);
  }, [tab, id]);

  useEffect(() => {
    if (hookData?.data) {
      setData((prev) => [...prev, ...hookData.data]);
    }
  }, [hookData]);

  const handleLoadMore = () => setPage((p) => p + 1);
  const handleModal = (researchId: number | null) => setModalId(researchId);

  const selectedItemForModal =
    modalId && (tab === "supervisingResearch" || tab === "researchIntrest")
      ? (data.find((item: any) => item?.id === modalId) as
          | SupervisingResearch
          | Research
          | undefined)
      : undefined;

  const handleFileDownload = async (
    filePath?: string | null,
    suggestedName?: string | null
  ) => {
    if (!filePath) return;
    setDownloadingFiles((prev) => new Set(prev).add(filePath));
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
      const clean = (suggestedName || "").trim();
      const hasExt = !!clean && /\.[a-z0-9]{1,8}$/i.test(clean);
      const fileName =
        (hasExt && clean) ||
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
      const fileUrl = new URL(filePath, API_URL).href;
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(filePath);
        return newSet;
      });
    }
  };

  return (
    <div className="flex_center w-full flex-col">
      <AcademicStaffHeader />
      <div className="mt-14 w-full flex_center flex-col text-secondary">
        <div className="max-w-[1024px] w-full flex_start sm:gap-5 gap-3 overflow-x-auto hide_scroll sm:px-0 px-5">
          <Link
            href={`/${locale}/academic-staff/${id}`}
            title={t("about")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("about")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/teaching`}
            title={t("teaching")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("teaching")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/education`}
            title={t("education")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("education")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/professional-engagement`}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("professional_engagement")}
          </Link>
          <p className="border-b border-b-secondary px-3 sm:text-base text-sm flex-shrink-0 font-semibold">
            {t("academics")}
          </p>
        </div>
        <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              {(
                [
                  ["books", t("books")],
                  ["publications", t("publications")],
                  ["researchIntrest", t("research_intrest")],
                  ["supervisingResearch", t("supervising_research")],
                  ["seminars", t("seminars")],
                  ["conferences", t("conferences")],
                  ["trainings", t("trainings")],
                  ["theses", t("theses")],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`lg:w-[250px] w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-xl transition-all ${
                    tab === key
                      ? "text-primary border-primary"
                      : "text-secondary opacity-70 border-transparent"
                  }`}
                >
                  <span>{label}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </button>
              ))}
            </div>
            <div className="lg:border-l lg:pl-10 w-full min-h-[400px]">
              {loading && page === 1 ? (
                <SectionSkeleton />
              ) : (
                <>
                  <div className="grid lg:max-w-[710px] w-full lg:grid-cols-2 gap-5">
                    {tab === "books" &&
                      safeArray<Book>(data as Book[]).map((item) => {
                        const file = item?.file?.path || null;
                        const isDownloading =
                          !!file && downloadingFiles.has(file);
                        return (
                          <div
                            key={item.id}
                            className="flex flex-col gap-3 p-3 rounded-3xl bg-background text-secondary"
                          >
                            <div className="flex items-center gap-3 border-b pb-4">
                              <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-2xl shrink-0">
                                <BsBook />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">
                                  {item?.name || t("untitled")}
                                </h4>
                                <span className="text-black/60 text-xs">
                                  {formatMonthYear(item?.year, locale)}
                                </span>
                              </div>
                            </div>
                            {file && (
                              <div className="flex">
                                <div className="flex flex-col">
                                  <span className="text-black/60 text-xs">
                                    {t("attachment")}
                                  </span>
                                  <button
                                    onClick={() =>
                                      !isDownloading &&
                                      handleFileDownload(
                                        file,
                                        fileNameFromPath(file)
                                      )
                                    }
                                    disabled={isDownloading}
                                    className="border rounded-full flex_center gap-2 px-2 py-1.5 text-xs mt-1 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-wait"
                                  >
                                    <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                      {isDownloading ? (
                                        <SpinnerIcon />
                                      ) : (
                                        <HiOutlineLink />
                                      )}
                                    </span>
                                    <span className="max-w-[20ch] truncate">
                                      {fileNameFromPath(file)}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    {tab === "publications" &&
                      safeArray<Publication>(data as Publication[]).map(
                        (item) => {
                          const firstFile =
                            safeArray(item?.files)[0]?.file?.path || null;
                          const isDownloading =
                            !!firstFile && downloadingFiles.has(firstFile);
                          return (
                            <div
                              key={item.id}
                              className="flex flex-col gap-3 p-3 rounded-3xl bg-background text-secondary"
                            >
                              <div className="flex items-center gap-3 border-b pb-4">
                                <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-2xl shrink-0">
                                  <CiSearch />
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">
                                    {item?.title || t("untitled")}
                                  </h4>
                                  <span className="text-black/60 text-xs">
                                    {formatMonthYear(
                                      item?.published_date,
                                      locale
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 w-full gap-y-3 gap-x-2 text-xs">
                                <div className="flex flex-col">
                                  <span className="opacity-60">
                                    {t("journal")}
                                  </span>
                                  <p className="font-medium text-sm">
                                    {item?.journal_title || "-"}
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <span className="opacity-60">
                                    {t("impact_factor")}
                                  </span>
                                  <p className="font-medium text-sm">
                                    {item?.impact_factor || "-"}
                                  </p>
                                </div>
                                {item?.doi_link && (
                                  <a
                                    href={item.doi_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border rounded-full flex_center gap-2 px-2 py-1.5 mt-1 hover:bg-gray-50 w-fit"
                                  >
                                    <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                      <HiOutlineLink />
                                    </span>
                                    <span className="max-w-[15ch] truncate">
                                      DOI Link
                                    </span>
                                  </a>
                                )}
                                {firstFile && (
                                  <button
                                    onClick={() =>
                                      !isDownloading &&
                                      handleFileDownload(
                                        firstFile,
                                        fileNameFromPath(firstFile)
                                      )
                                    }
                                    disabled={isDownloading}
                                    className="border rounded-full flex_center gap-2 px-2 py-1.5 mt-1 hover:bg-gray-50 w-fit disabled:opacity-70 disabled:cursor-wait"
                                  >
                                    <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                      {isDownloading ? (
                                        <SpinnerIcon />
                                      ) : (
                                        <HiOutlineLink />
                                      )}
                                    </span>
                                    <span className="max-w-[15ch] truncate">
                                      {fileNameFromPath(firstFile)}
                                    </span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    {tab === "researchIntrest" &&
                      safeArray<Research>(data as Research[]).map((item) => {
                        const file = item?.file?.path || null;
                        const isDownloading =
                          !!file && downloadingFiles.has(file);
                        return (
                          <div
                            key={item.id}
                            className="flex flex-col gap-3 rounded-3xl bg-background text-secondary"
                          >
                            <div className="flex items-center gap-3 border-b pb-4 w-full px-3 pt-3">
                              <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl shrink-0">
                                <CiSearch className="text-2xl" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">
                                  {item?.title || t("untitled")}
                                </h4>
                                <span className="text-black/60 text-xs">
                                  {formatMonthYear(item?.created_at, locale)}
                                </span>
                              </div>
                            </div>
                            {file && (
                              <div className="flex w-full p-3">
                                <div className="flex flex-col">
                                  <span className="text-black/60 text-xs">
                                    {t("attachment")}
                                  </span>
                                  <button
                                    onClick={() =>
                                      !isDownloading &&
                                      handleFileDownload(
                                        file,
                                        fileNameFromPath(file)
                                      )
                                    }
                                    disabled={isDownloading}
                                    className="border rounded-full flex_center gap-2 px-2 py-1.5 text-xs mt-1 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-wait"
                                  >
                                    <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                      {isDownloading ? (
                                        <SpinnerIcon />
                                      ) : (
                                        <HiOutlineLink />
                                      )}
                                    </span>
                                    <span className="max-w-[15ch] truncate">
                                      {fileNameFromPath(file)}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            )}
                            <button
                              onClick={() => handleModal(item.id)}
                              className="w-full mt-auto py-3 text-golden border-t flex justify-between items-center px-3 hover:bg-gray-50"
                            >
                              <span className="text-sm">{t("read_more")}</span>
                              <GoArrowRight className="text-xl rtl:rotate-180" />
                            </button>
                          </div>
                        );
                      })}
                    {tab === "supervisingResearch" &&
                      safeArray<SupervisingResearch>(
                        data as SupervisingResearch[]
                      ).map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 rounded-3xl bg-background text-secondary"
                        >
                          <div className="flex items-center gap-3 border-b pb-4 w-full px-3 pt-3">
                            <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl shrink-0">
                              <CiSearch className="text-2xl" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">
                                {item?.title || t("untitled")}
                              </h4>
                              {`${formatYearOnly(item?.year_from)}${
                                item?.year_to
                                  ? ` - ${formatYearOnly(item?.year_to)}`
                                  : ""
                              }`.trim() && (
                                <span className="text-black/60 text-xs">
                                  {`${formatYearOnly(item?.year_from)}${
                                    item?.year_to
                                      ? ` - ${formatYearOnly(item?.year_to)}`
                                      : ""
                                  }`}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex w-full p-3 h-16 items-center">
                            <span className="text-black/60 text-sm">
                              {safeArray(item?.students).length} {t("students")}
                            </span>
                          </div>
                          <button
                            onClick={() => handleModal(item.id)}
                            className="w-full mt-auto py-3 text-golden border-t flex justify-between items-center px-3 hover:bg-gray-50"
                          >
                            <span className="text-sm">{t("read_more")}</span>
                            <GoArrowRight className="text-xl rtl:rotate-180" />
                          </button>
                        </div>
                      ))}
                    {tab === "seminars" &&
                      safeArray<Seminar>(data as Seminar[]).map((item) => {
                        const file =
                          safeArray(item?.files)[0]?.file?.path || null;
                        const isDownloading =
                          !!file && downloadingFiles.has(file);
                        return (
                          <div
                            key={item.id}
                            className="flex flex-col gap-3 p-3 rounded-3xl bg-background text-secondary"
                          >
                            <div className="flex items-center gap-3 border-b pb-4 w-full">
                              <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl shrink-0">
                                <div className="h-6 w-6 relative">
                                  <Image
                                    src="/images/seminar.svg"
                                    alt="seminar icon"
                                    fill
                                    priority
                                  />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">
                                  {item?.title || t("untitled")}
                                </h4>
                                <span className="text-black/60 text-xs">
                                  {formatMonthYear(item?.year, locale)}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 w-full gap-y-3 gap-x-2 text-xs">
                              <div className="flex flex-col">
                                <span className="opacity-60">
                                  {t("number_of_audience")}
                                </span>
                                <p className="font-medium text-sm">
                                  + {item?.attendance_number ?? 0}
                                </p>
                              </div>
                              {file && (
                                <div className="flex flex-col">
                                  <span className="opacity-60">
                                    {t("attachment")}
                                  </span>
                                  <button
                                    onClick={() =>
                                      !isDownloading &&
                                      handleFileDownload(
                                        file,
                                        fileNameFromPath(file)
                                      )
                                    }
                                    disabled={isDownloading}
                                    className="border rounded-full flex_center gap-2 px-2 py-1.5 mt-1 hover:bg-gray-50 w-fit disabled:opacity-70 disabled:cursor-wait"
                                  >
                                    <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                      {isDownloading ? (
                                        <SpinnerIcon />
                                      ) : (
                                        <HiOutlineLink />
                                      )}
                                    </span>
                                    <span className="max-w-[15ch] truncate">
                                      {fileNameFromPath(file)}
                                    </span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    {tab === "conferences" &&
                      safeArray<Conference>(data as Conference[]).map(
                        (item) => {
                          const file =
                            safeArray(item?.files)[0]?.file?.path || null;
                          const isDownloading =
                            !!file && downloadingFiles.has(file);
                          return (
                            <div
                              key={item.id}
                              className="flex flex-col gap-3 p-3 rounded-3xl bg-background text-secondary"
                            >
                              <div className="flex items-center gap-3 border-b pb-4 w-full">
                                <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-2xl shrink-0">
                                  <FiUsers />
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">
                                    {item?.title || t("untitled")}
                                  </h4>
                                  <span className="text-black/60 text-xs">
                                    {formatMonthYear(item?.year, locale)}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 w-full gap-y-3 gap-x-2 text-xs">
                                <div className="flex flex-col">
                                  <span className="opacity-60">
                                    {t("number_of_audience")}
                                  </span>
                                  <p className="font-medium text-sm">
                                    + {item?.attendance_number ?? 0}
                                  </p>
                                </div>
                                {file && (
                                  <div className="flex flex-col">
                                    <span className="opacity-60">
                                      {t("attachment")}
                                    </span>
                                    <button
                                      onClick={() =>
                                        !isDownloading &&
                                        handleFileDownload(
                                          file,
                                          fileNameFromPath(file)
                                        )
                                      }
                                      disabled={isDownloading}
                                      className="border rounded-full flex_center gap-2 px-2 py-1.5 mt-1 hover:bg-gray-50 w-fit disabled:opacity-70 disabled:cursor-wait"
                                    >
                                      <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                        {isDownloading ? (
                                          <SpinnerIcon />
                                        ) : (
                                          <HiOutlineLink />
                                        )}
                                      </span>
                                      <span className="max-w-[15ch] truncate">
                                        {fileNameFromPath(file)}
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    {tab === "trainings" &&
                      safeArray<Training>(data as Training[]).map((item) => {
                        const file =
                          safeArray(item?.files)[0]?.file?.path || null;
                        const isDownloading =
                          !!file && downloadingFiles.has(file);
                        return (
                          <div
                            key={item.id}
                            className="flex flex-col gap-3 p-3 rounded-3xl bg-background text-secondary"
                          >
                            <div className="flex items-center gap-3 border-b pb-4 w-full">
                              <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-2xl shrink-0">
                                <AiOutlineRise />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">
                                  {item?.title || t("untitled")}
                                </h4>
                                <span className="text-black/60 text-xs">
                                  {formatMonthYear(item?.year, locale)}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 w-full gap-y-3 gap-x-2 text-xs">
                              <div className="flex flex-col">
                                <span className="opacity-60">{t("level")}</span>
                                <p className="font-medium text-sm">
                                  {item?.level || "-"}
                                </p>
                              </div>
                              <div className="flex flex-col">
                                <span className="opacity-60">{t("type")}</span>
                                <p className="font-medium text-sm">
                                  {item?.type || "-"}
                                </p>
                              </div>
                              {file && (
                                <div className="flex flex-col col-span-2">
                                  <span className="opacity-60">
                                    {t("attachment")}
                                  </span>
                                  <button
                                    onClick={() =>
                                      !isDownloading &&
                                      handleFileDownload(
                                        file,
                                        fileNameFromPath(file)
                                      )
                                    }
                                    disabled={isDownloading}
                                    className="border rounded-full flex_center gap-2 px-2 py-1.5 mt-1 hover:bg-gray-50 w-fit disabled:opacity-70 disabled:cursor-wait"
                                  >
                                    <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                      {isDownloading ? (
                                        <SpinnerIcon />
                                      ) : (
                                        <HiOutlineLink />
                                      )}
                                    </span>
                                    <span className="max-w-[20ch] truncate">
                                      {fileNameFromPath(file)}
                                    </span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    {tab === "theses" &&
                      safeArray<Thesis>(data as Thesis[]).map((item) => {
                        const firstFile =
                          safeArray(item?.files)[0]?.file?.path || null;
                        const isDownloading =
                          !!firstFile && downloadingFiles.has(firstFile);
                        return (
                          <div
                            key={item.id}
                            className="flex flex-col gap-3 p-3 rounded-3xl bg-background text-secondary"
                          >
                            <div className="flex items-center gap-3 border-b pb-4 w-full">
                              <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl shrink-0">
                                <CiSearch className="text-2xl" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">
                                  {item?.title || t("untitled")}
                                </h4>
                                <div className="text-black/60 text-xs flex gap-2 flex-wrap">
                                  {formatYearOnly(item?.year) && (
                                    <span>{formatYearOnly(item?.year)}</span>
                                  )}
                                  <span>•</span>
                                  <span>{item?.type || "-"}</span>
                                  <span>•</span>
                                  <span>{item?.specialization || "-"}</span>
                                </div>
                              </div>
                            </div>
                            {firstFile && (
                              <div className="flex p-3">
                                <div className="flex flex-col">
                                  <span className="text-black/60 text-xs">
                                    {t("attachment")}
                                  </span>
                                  <button
                                    onClick={() =>
                                      !isDownloading &&
                                      handleFileDownload(
                                        firstFile,
                                        fileNameFromPath(firstFile)
                                      )
                                    }
                                    disabled={isDownloading}
                                    className="border rounded-full flex_center gap-2 px-2 py-1.5 text-xs mt-1 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-wait"
                                  >
                                    <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                      {isDownloading ? (
                                        <SpinnerIcon />
                                      ) : (
                                        <HiOutlineLink />
                                      )}
                                    </span>
                                    <span className="max-w-[20ch] truncate">
                                      {fileNameFromPath(firstFile)}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                  {hookData && data.length < hookData.total && (
                    <div className="w-full flex justify-center mt-8">
                      <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50 disabled:cursor-wait"
                      >
                        {loading ? t("loading") : t("see_more")}
                      </button>
                    </div>
                  )}
                  {!loading && data.length === 0 && (
                    <p className="text-center text-gray-500 py-10 w-full">
                      {t("no_data")}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedItemForModal && (
        <div className="flex_center fixed inset-0 z-50 bg-black/60 p-4">
          <div className="bg-white flex flex-col gap-5 z-10 sm:w-[550px] w-full rounded-3xl overflow-hidden max-h-[90vh]">
            <div className="flex justify-between items-center gap-2 w-full bg-golden text-white p-6 shrink-0">
              <h3 className="text-lg font-medium">Research Detail</h3>
              <button
                type="button"
                onClick={() => handleModal(null)}
                className="text-2xl"
              >
                <IoMdClose />
              </button>
            </div>
            <div className="flex flex-col gap-5 w-full p-6 overflow-y-auto">
              <div className="flex flex-col gap-1">
                <span className="text-black/60 text-sm">
                  {t("research_title")}
                </span>
                <p className="text-secondary font-medium">
                  {selectedItemForModal?.title || t("untitled")}
                </p>
              </div>
              {"students" in selectedItemForModal &&
                safeArray(selectedItemForModal?.students).length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-black/60 text-sm">
                      {t("students")}
                    </span>
                    <ul className="list-disc pl-5 text-secondary font-medium">
                      {safeArray(selectedItemForModal.students).map((s) => (
                        <li key={s.id}>{s?.name || "-"}</li>
                      ))}
                    </ul>
                  </div>
                )}
              {"files" in selectedItemForModal &&
                safeArray(selectedItemForModal?.files).length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-black/60 text-sm">
                      {t("attachment")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {safeArray(selectedItemForModal.files).map((f) => {
                        const path = f?.file?.path || null;
                        if (!path) return null;
                        const isDownloading = downloadingFiles.has(path);
                        return (
                          <button
                            key={f.id}
                            onClick={() =>
                              !isDownloading &&
                              handleFileDownload(path, fileNameFromPath(path))
                            }
                            disabled={isDownloading}
                            className="border rounded-full flex_center gap-2 px-2 py-1.5 text-xs mt-1 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-wait"
                          >
                            <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                              {isDownloading ? (
                                <SpinnerIcon />
                              ) : (
                                <HiOutlineLink />
                              )}
                            </span>
                            <span className="max-w-[20ch] truncate">
                              {fileNameFromPath(path)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          </div>
          <button
            onClick={() => handleModal(null)}
            className="w-full h-full fixed left-0 top-0"
            aria-label="Close modal"
          />
        </div>
      )}
    </div>
  );
};

export default Page;
