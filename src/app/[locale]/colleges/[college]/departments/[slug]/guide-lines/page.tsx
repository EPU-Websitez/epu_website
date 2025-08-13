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
import { FaChevronRight } from "react-icons/fa6";
import { GoArrowRight, GoBriefcase } from "react-icons/go";
import { GrLinkNext } from "react-icons/gr";
import { HiOutlineDownload } from "react-icons/hi";
import { HiOutlineBuildingOffice, HiOutlineLink } from "react-icons/hi2";
import { IoArrowForwardOutline, IoBriefcaseOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// Updated CollegeDetails interface to match the new response
interface CollegeDetails {
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

// Updated Department interface
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
  college: CollegeDetails; // Using the updated, more detailed interface
}

interface File {
  id: number;
  path: string;
  created_at: string;
  updated_at: string;
}

interface GuideFile {
  id: number;
  section_id: number;
  file_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  file: File;
}

interface GuideSection {
  id: number;
  guide_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  files: GuideFile[];
}

interface GraduationGuide {
  id: number;
  department_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  department: Department;
  sections: GuideSection[];
}

interface GraduationGuideResponse {
  total: number;
  page: number;
  limit: number;
  data: GraduationGuide[];
}

// Skeleton Components
const GuidesSkeleton = () => (
  <div className="w-full grid grid-cols-1 lg:max-w-[708px] max-w-full gap-5">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="w-full border border-lightBorder rounded-3xl sm:p-5 p-2 animate-pulse"
      >
        <div className="flex_start flex-col gap-5">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="w-full sm:p-5 p-2 rounded-3xl h-16 bg-gray-200"></div>
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

  // Fetch graduation guides data with the UPDATED endpoint
  const {
    data: guidesData,
    loading: guidesLoading,
    error: guidesError,
  } = useFetch<GraduationGuideResponse>(
    `${API_URL}/website/departments/${slug}/graduation-guides?page=1&limit=10`
  );

  // Helper functions
  const getFileName = (filePath: string) => {
    const parts = filePath.split("/");
    const fileName = parts[parts.length - 1];
    return fileName || "guide.pdf";
  };

  // FIXED: robust cross-origin download via blob
  const handleFileDownload = async (
    filePath: string,
    suggestedName?: string
  ) => {
    try {
      const fileUrl = new URL(filePath, API_URL).href;

      const res = await fetch(fileUrl, { mode: "cors" });
      if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      // build a safe filename, preserving/adding extension
      const pathName = filePath.split("?")[0];
      const extFromPath = pathName.includes(".")
        ? `.${pathName.split(".").pop()!}`
        : "";
      const cleanSuggested = suggestedName?.trim();
      const hasExt =
        !!cleanSuggested && /\.[a-z0-9]{1,8}$/i.test(cleanSuggested);
      const fileName =
        (hasExt && (cleanSuggested as string)) ||
        (cleanSuggested && `${cleanSuggested}${extFromPath}`) ||
        pathName.split("/").pop() ||
        "download";

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error(err);
      alert("Sorry, the file couldn't be downloaded.");
    }
  };

  // FIXED: safer absolute URL for preview
  const handleFilePreview = (filePath: string) => {
    const fileUrl = new URL(filePath, API_URL).href;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader />
      <div className="max-w-[1040px] flex_start w-full">
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
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/course-subjects`}
                title={t("course_subjects")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("course_subjects")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                <span>{t("guide_lines")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </div>
            </div>

            <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
              <div className="md:block hidden">
                <SubHeader title={t("guide_lines_title")} alt={false} />
              </div>
              <h2 className="md:hidden block relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                <span className="z-10 relative">{t("guide_lines")}</span>
              </h2>

              {/* Error Handling */}
              {guidesError && (
                <div className="w-full text-center py-8">
                  <p className="text-red-500">
                    Error loading graduation guides. Please try again later.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {guidesLoading && <GuidesSkeleton />}

              {/* Dynamic Guides Content */}
              {!guidesLoading && !guidesError && (
                <div className="w-full grid grid-cols-1 lg:max-w-[708px] max-w-full gap-5">
                  {guidesData?.data && guidesData.data.length > 0 ? (
                    guidesData.data.map((guide) => (
                      <div
                        key={guide.id}
                        className="w-full flex_start flex-col gap-5"
                      >
                        {/* Guide Title */}
                        <h3 className="text-lg font-semibold text-golden">
                          {guide.title}
                        </h3>

                        {/* Guide Sections */}
                        {guide.sections.map((section) => (
                          <div
                            key={section.id}
                            className="w-full border border-lightBorder rounded-3xl sm:p-5 p-2 flex_start flex-col gap-5"
                          >
                            <span className="text-sm text-black opacity-60">
                              {section.description}
                            </span>

                            {/* Files for this section */}
                            {section.files.map((fileItem) => (
                              <div
                                key={fileItem.id}
                                className="w-full sm:p-5 p-2 rounded-3xl flex justify-between items-center border border-lightBorder hover:border-golden transition-colors"
                              >
                                <button
                                  onClick={() =>
                                    handleFilePreview(fileItem.file.path)
                                  }
                                  className="flex justify-start items-center sm:gap-4 gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 rounded-lg transition-colors flex-1"
                                >
                                  <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                                    <HiOutlineLink />
                                  </span>
                                  <span className="text-secondary text-opacity-70 lg:max-w-[200px] sm:max-w-full max-w-[130px] truncate sm:text-base text-sm">
                                    {fileItem.title}
                                  </span>
                                  <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                                    <GrLinkNext className="-rotate-45" />
                                  </span>
                                </button>

                                <button
                                  onClick={() =>
                                    handleFileDownload(
                                      fileItem.file.path,
                                      fileItem.title
                                    )
                                  }
                                  className="py-2 sm:text-sm text-xs sm:px-5 px-1 rounded-md flex_center gap-3 bg-gradient-to-r from-primary to-blue text-white hover:from-primary/90 hover:to-blue/90 transition-all"
                                >
                                  <p>{t("download")}</p>
                                  <HiOutlineDownload />
                                </button>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    // Fallback content when no guides available
                    <div className="w-full border border-lightBorder rounded-3xl sm:p-5 p-2 flex_start flex-col gap-5">
                      <span className="text-sm text-black opacity-60">
                        Students of final stage must ensure that their project
                        paper is written based on the Guideline that can be
                        downloaded below.
                      </span>
                      <div className="w-full sm:p-5 p-2 rounded-3xl flex justify-between items-center border border-lightBorder">
                        <div className="flex_center sm:gap-4 gap-2 px-2 py-1.5 text-sm">
                          <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                            <HiOutlineLink />
                          </span>
                          <span className="text-secondary text-opacity-70">
                            No graduation guides available
                          </span>
                          <span className="w-5 flex_center h-5 rounded-full border border-gray-300 text-gray-300 text-sm">
                            <GrLinkNext className="-rotate-45" />
                          </span>
                        </div>
                        <div className="py-2 sm:text-sm text-xs sm:px-5 px-2 rounded-md flex_center gap-3 bg-gray-300 text-gray-500">
                          <p>Unavailable</p>
                          <HiOutlineDownload />
                        </div>
                      </div>
                    </div>
                  )}
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
