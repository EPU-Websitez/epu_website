"use client";
import AcademicStaffHeader from "@/components/AcademicStaffHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

// Icons
import { AiOutlineRise } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { GoArrowRight } from "react-icons/go";
import { HiOutlineLink } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { MdCoPresent, MdKeyboardDoubleArrowRight } from "react-icons/md";

// Utilities
import { API_URL } from "@/libs/env";

// --- TYPE DEFINITIONS ---
interface File {
  id: number;
  path: string;
}
interface FileEntry {
  id: number;
  file: File;
}

// Data types for each tab
interface Book {
  id: number;
  name: string;
  year: string;
  file: File | null;
}
interface Publication {
  id: number;
  title: string;
  published_date: string;
  journal_title: string;
  impact_factor: string;
  doi_link: string | null;
  files: FileEntry[];
}
interface Research {
  id: number;
  title: string;
  created_at: string;
  file: File | null;
}
interface Student {
  id: number;
  name: string;
}
interface SupervisingResearch {
  id: number;
  title: string;
  year_from: string;
  year_to: string;
  files: FileEntry[];
  students: Student[];
}
interface Seminar {
  id: number;
  title: string;
  year: string;
  attendance_number: number;
  files: FileEntry[];
}
interface Conference {
  id: number;
  title: string;
  year: string;
  attendance_number: number;
  files: FileEntry[];
}
interface Training {
  id: number;
  title: string;
  year: string;
  level: string;
  type: string;
  files: FileEntry[];
}

// A union type for all possible data items
type DataItem =
  | Book
  | Publication
  | Research
  | SupervisingResearch
  | Seminar
  | Conference
  | Training;

// --- SKELETON LOADER ---
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
const SectionSkeleton = ({ cardCount = 4 }) => (
  <div className="w-full">
    <div className="grid lg:max-w-[710px] w-full lg:grid-cols-2 gap-5">
      {[...Array(cardCount)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;

  const [tab, setTab] = useState("books");
  const [modalId, setModalId] = useState<number | null>(null);
  const LIMIT = 6;

  // --- UNIFIED STATE MANAGEMENT ---
  const [data, setData] = useState<DataItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // --- UNIFIED DATA FETCHING ---
  useEffect(() => {
    const activeTabs = [
      "books",
      "publications",
      "researchIntrest",
      "supervisingResearch",
      "seminars",
      "conferences",
      "trainings",
    ];
    if (activeTabs.includes(tab)) {
      setData([]);
      setPage(1);
      setTotal(0);
      fetchData(1, tab);
    }
  }, [tab, id]);

  useEffect(() => {
    if (page > 1) {
      fetchData(page, tab);
    }
  }, [page]);

  const fetchData = async (pageNum: number, currentTab: string) => {
    const endpoints: { [key: string]: string } = {
      books: "books",
      publications: "research-papers",
      researchIntrest: "researches",
      supervisingResearch: "supervising-researches",
      seminars: "seminars",
      conferences: "conferences",
      trainings: "trainings",
    };
    const endpoint = endpoints[currentTab];
    if (!endpoint) return;

    if (pageNum === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const res = await fetch(
        `${API_URL}/website/teachers/${id}/${endpoint}?page=${pageNum}&limit=${LIMIT}`
      );
      if (!res.ok) throw new Error(`Failed to fetch ${currentTab}`);
      const newData = await res.json();
      if (newData.data) {
        setData((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = newData.data.filter(
            (item: DataItem) => !existingIds.has(item.id)
          );
          return pageNum === 1 ? newData.data : [...prev, ...newItems];
        });
        setTotal(newData.total);
      }
    } catch (error) {
      console.error(`Error fetching ${currentTab}:`, error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => setPage((p) => p + 1);

  // --- HELPERS & MODAL ---
  const handleModal = (researchId: number | null) => setModalId(researchId);
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
    });
  const formatYearRange = (from: string, to: string) =>
    `${new Date(from).getFullYear()} - ${new Date(to).getFullYear()}`;
  const getFileName = (path: string | undefined) =>
    path ? path.substring(path.lastIndexOf("/") + 1) : "document.pdf";
  const selectedItemForModal =
    modalId && (tab === "supervisingResearch" || tab === "researchIntrest")
      ? (data.find((item) => item.id === modalId) as
          | SupervisingResearch
          | Research
          | undefined)
      : undefined;

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

  return (
    <div className="flex_center w-full flex-col">
      <AcademicStaffHeader />
      <div className="mt-14 w-full flex_center flex-col text-secondary">
        {/* Navigation */}
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
            className=" opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("professional_engagement")}
          </Link>
          <p className="border-b border-b-secondary px-3 sm:text-base text-sm flex-shrink-0 font-semibold">
            {t("academics")}
          </p>
        </div>

        <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
            {/* Tab Buttons */}
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              <button
                type="button"
                onClick={() => setTab("books")}
                className={`lg:w-[250px] w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-xl transition-all ${
                  tab === "books"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("books")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => setTab("publications")}
                className={`lg:w-[250px] w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-xl transition-all ${
                  tab === "publications"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("publications")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => setTab("researchIntrest")}
                className={`lg:w-[250px] w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-xl transition-all ${
                  tab === "researchIntrest"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("research_intrest")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => setTab("supervisingResearch")}
                className={`lg:w-[250px] w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-xl transition-all ${
                  tab === "supervisingResearch"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("supervising_research")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => setTab("seminars")}
                className={`lg:w-[250px] w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-xl transition-all ${
                  tab === "seminars"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("seminars")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              {/* <button type="button" onClick={() => setTab("workshops")} className={`lg:w-[250px] w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-xl transition-all ${tab === "workshops" ? "text-primary border-primary" : "text-secondary opacity-70 border-transparent"}`}><span>{t("workshops")}</span><MdKeyboardDoubleArrowRight className="rtl:rotate-180" /></button> */}
              <button
                type="button"
                onClick={() => setTab("conferences")}
                className={`lg:w-[250px] w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-xl transition-all ${
                  tab === "conferences"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("conferences")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => setTab("trainings")}
                className={`lg:w-[250px] w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-xl transition-all ${
                  tab === "trainings"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("trainings")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              {/* <button
                type="button"
                onClick={() => setTab("awards")}
                className={`lg:w-[250px] w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-xl transition-all ${
                  tab === "awards"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("awards")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => setTab("professionalActs")}
                className={`lg:w-[250px] w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-xl transition-all ${
                  tab === "professionalActs"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("professional_acts")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button> */}
            </div>

            {/* Content Area */}
            <div className="lg:border-l lg:pl-10 w-full min-h-[400px]">
              {isLoading ? (
                <SectionSkeleton />
              ) : (
                <>
                  <div className="grid lg:max-w-[710px] w-full lg:grid-cols-2 gap-5">
                    {/* --- Books --- */}
                    {tab === "books" &&
                      (data as Book[]).map((item) => (
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
                                {item.name}
                              </h4>
                              <span className="text-black/60 text-xs">
                                {formatDate(item.year)}
                              </span>
                            </div>
                          </div>
                          {item.file && (
                            <div className="flex">
                              <div className="flex flex-col">
                                <span className="text-black/60 text-xs">
                                  {t("attachment")}
                                </span>
                                {/* <a
                                  href={item.file.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="border rounded-full flex_center gap-2 px-2 py-1.5 text-xs mt-1 hover:bg-gray-50"
                                >
                                  <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                    <HiOutlineLink />
                                  </span>
                                  <span className="max-w-[20ch] truncate">
                                    {getFileName(item.file.path)}
                                  </span>
                                </a> */}
                                <button
                                  onClick={() =>
                                    handleFileDownload(
                                      item?.file?.path,
                                      item?.file?.path
                                    )
                                  }
                                  className="border rounded-full flex_center gap-2 px-2 py-1.5 text-xs mt-1 hover:bg-gray-50"
                                >
                                  <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                    <HiOutlineLink />
                                  </span>
                                  <span className="max-w-[20ch] truncate">
                                    {getFileName(item.file.path)}
                                  </span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                    {/* --- Publications --- */}
                    {tab === "publications" &&
                      (data as Publication[]).map((item) => (
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
                                {item.title}
                              </h4>
                              <span className="text-black/60 text-xs">
                                {formatDate(item.published_date)}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 w-full gap-y-3 gap-x-2 text-xs">
                            <div className="flex flex-col">
                              <span className="opacity-60">{t("journal")}</span>
                              <p className="font-medium text-sm">
                                {item.journal_title}
                              </p>
                            </div>
                            <div className="flex flex-col">
                              <span className="opacity-60">
                                {t("impact_factor")}
                              </span>
                              <p className="font-medium text-sm">
                                {item.impact_factor}
                              </p>
                            </div>
                            {item.doi_link && (
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
                            {item.files?.[0]?.file && (
                              // <a
                              //   href={item.files[0].file.path}
                              //   target="_blank"
                              //   rel="noopener noreferrer"
                              //   download
                              //   className="border rounded-full flex_center gap-2 px-2 py-1.5 mt-1 hover:bg-gray-50 w-fit"
                              // >
                              //   <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                              //     <HiOutlineLink />
                              //   </span>
                              //   <span className="max-w-[15ch] truncate">
                              //     {getFileName(item.files[0].file.path)}
                              //   </span>
                              // </a>
                              <button
                                onClick={() =>
                                  handleFileDownload(
                                    item.files[0].file.path,
                                    getFileName(item.files[0].file.path)
                                  )
                                }
                                className="border rounded-full flex_center gap-2 px-2 py-1.5 mt-1 hover:bg-gray-50 w-fit"
                              >
                                <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                  <HiOutlineLink />
                                </span>
                                <span className="max-w-[15ch] truncate">
                                  {getFileName(item.files[0].file.path)}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                    {/* --- Research Interest --- */}
                    {tab === "researchIntrest" &&
                      (data as Research[]).map((item) => (
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
                                {item.title}
                              </h4>
                              <span className="text-black/60 text-xs">
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                          </div>
                          {item.file && (
                            <div className="flex w-full p-3">
                              <div className="flex flex-col">
                                <span className="text-black/60 text-xs">
                                  {t("attachment")}
                                </span>
                                {/* <a
                                  href={item.file.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="border rounded-full flex_center gap-2 px-2 py-1.5 text-xs mt-1 hover:bg-gray-50"
                                >
                                  <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                    <HiOutlineLink />
                                  </span>
                                  <span className="max-w-[20ch] truncate">
                                    {getFileName(item.file.path)}
                                  </span>
                                </a> */}
                                <button
                                  onClick={() =>
                                    handleFileDownload(
                                      item?.file?.path,
                                      getFileName(item?.file?.path)
                                    )
                                  }
                                  className="border rounded-full flex_center gap-2 px-2 py-1.5 text-xs mt-1 hover:bg-gray-50"
                                >
                                  <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                    <HiOutlineLink />
                                  </span>
                                  <span className="max-w-[15ch] truncate">
                                    {getFileName(item?.file?.path)}
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
                      ))}

                    {/* --- Supervising Research --- */}
                    {tab === "supervisingResearch" &&
                      (data as SupervisingResearch[]).map((item) => (
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
                                {item.title}
                              </h4>
                              <span className="text-black/60 text-xs">
                                {formatYearRange(item.year_from, item.year_to)}
                              </span>
                            </div>
                          </div>
                          <div className="flex w-full p-3 h-16 items-center">
                            <span className="text-black/60 text-sm">
                              {item?.students?.length || 0} {t("students")}
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

                    {/* --- Seminars --- */}
                    {tab === "seminars" &&
                      (data as Seminar[]).map((item) => (
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
                                {item.title}
                              </h4>
                              <span className="text-black/60 text-xs">
                                {formatDate(item.year)}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 w-full gap-y-3 gap-x-2 text-xs">
                            <div className="flex flex-col">
                              <span className="opacity-60">
                                {t("number_of_audience")}
                              </span>
                              <p className="font-medium text-sm">
                                + {item.attendance_number}
                              </p>
                            </div>
                            {item.files?.[0]?.file && (
                              <div className="flex flex-col">
                                <span className="opacity-60">
                                  {t("attachment")}
                                </span>
                                <a
                                  href={item.files[0].file.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="border rounded-full flex_center gap-2 px-2 py-1.5 mt-1 hover:bg-gray-50 w-fit"
                                >
                                  <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                    <HiOutlineLink />
                                  </span>
                                  <span className="max-w-[15ch] truncate">
                                    {getFileName(item.files[0].file.path)}
                                  </span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                    {/* --- Conferences --- */}
                    {tab === "conferences" &&
                      (data as Conference[]).map((item) => (
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
                                {item.title}
                              </h4>
                              <span className="text-black/60 text-xs">
                                {formatDate(item.year)}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 w-full gap-y-3 gap-x-2 text-xs">
                            <div className="flex flex-col">
                              <span className="opacity-60">
                                {t("number_of_audience")}
                              </span>
                              <p className="font-medium text-sm">
                                + {item.attendance_number}
                              </p>
                            </div>
                            {item.files?.[0]?.file && (
                              <div className="flex flex-col">
                                <span className="opacity-60">
                                  {t("attachment")}
                                </span>
                                <a
                                  href={item.files[0].file.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="border rounded-full flex_center gap-2 px-2 py-1.5 mt-1 hover:bg-gray-50 w-fit"
                                >
                                  <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                    <HiOutlineLink />
                                  </span>
                                  <span className="max-w-[15ch] truncate">
                                    {getFileName(item.files[0].file.path)}
                                  </span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                    {/* --- Trainings --- */}
                    {tab === "trainings" &&
                      (data as Training[]).map((item) => (
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
                                {item.title}
                              </h4>
                              <span className="text-black/60 text-xs">
                                {formatDate(item.year)}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 w-full gap-y-3 gap-x-2 text-xs">
                            <div className="flex flex-col">
                              <span className="opacity-60">{t("level")}</span>
                              <p className="font-medium text-sm">
                                {item.level}
                              </p>
                            </div>
                            <div className="flex flex-col">
                              <span className="opacity-60">{t("type")}</span>
                              <p className="font-medium text-sm">{item.type}</p>
                            </div>
                            {item.files?.[0]?.file && (
                              <div className="flex flex-col col-span-2">
                                <span className="opacity-60">
                                  {t("attachment")}
                                </span>
                                <a
                                  href={item.files[0].file.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="border rounded-full flex_center gap-2 px-2 py-1.5 mt-1 hover:bg-gray-50 w-fit"
                                >
                                  <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                                    <HiOutlineLink />
                                  </span>
                                  <span className="max-w-[20ch] truncate">
                                    {getFileName(item.files[0].file.path)}
                                  </span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                  {data.length < total && (
                    <div className="w-full flex justify-center mt-8">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50 disabled:cursor-wait"
                      >
                        {isLoadingMore ? t("loading") : t("see_more")}
                      </button>
                    </div>
                  )}

                  {!isLoading && data.length === 0 && (
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

      {/* DYNAMIC MODAL */}
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
                  {selectedItemForModal.title}
                </p>
              </div>
              {"students" in selectedItemForModal &&
                (selectedItemForModal.students?.length || 0) > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-black/60 text-sm">
                      {t("students")}
                    </span>
                    <ul className="list-disc pl-5 text-secondary font-medium">
                      {selectedItemForModal.students.map((s) => (
                        <li key={s.id}>{s.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              {"files" in selectedItemForModal &&
                (selectedItemForModal.files?.length || 0) > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-black/60 text-sm">
                      {t("attachment")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedItemForModal.files.map((f) => (
                        <a
                          key={f.id}
                          href={f.file.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="border rounded-full flex_center gap-2 px-2 py-1.5 text-xs mt-1 hover:bg-gray-50"
                        >
                          <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                            <HiOutlineLink />
                          </span>
                          <span className="max-w-[20ch] truncate">
                            {getFileName(f.file.path)}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
          <button
            onClick={() => handleModal(null)}
            className="w-full h-full fixed left-0 top-0"
          ></button>
        </div>
      )}
    </div>
  );
};
export default Page;
