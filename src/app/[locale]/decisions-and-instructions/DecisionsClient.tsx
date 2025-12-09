"use client";

import SubHeader from "@/components/subHeader";
import NoData from "@/components/NoData";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { GrLinkNext } from "react-icons/gr";
import { HiOutlineLink } from "react-icons/hi2";

import useFetch from "@/libs/hooks/useFetch";
import { useParams } from "next/navigation";

// --- Interfaces reflecting the full API response ---
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}

interface FileDetails {
  id: number;
  path: string;
}

interface FileItem {
  id: number;
  file: FileDetails;
}

interface DecisionListItem {
  id: number;
  title: string;
  description: string;
  files: FileItem[];
}

interface DecisionSection {
  id: number;
  title: string;
  section_type: "DECISION" | "INSTRUCTION" | "GUIDELINE" | "POLICY";
  lists: DecisionListItem[];
}

interface DecisionType {
  id: number;
  title: string;
  sections: DecisionSection[];
}

interface DecisionsApiResponse {
  id: number;
  title: string;
  description: string;
  bg_image: ImageFile;
  types: DecisionType[];
}

// --- Skeleton Component ---
const PageSkeleton = () => (
  <div className="my-10 flex_center w-full animate-pulse">
    <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <div className="w-full lg:h-[500px] h-[300px] bg-gray-200 rounded-3xl"></div>
      <div className="w-full max-w-[920px] h-[85px] bg-gray-200 rounded-2xl mx-auto"></div>
      <div className="h-10 w-1/3 bg-gray-200 rounded-full mt-4"></div>
      <div className="w-full space-y-4">
        <div className="h-16 w-full bg-gray-200 rounded-2xl"></div>
        <div className="h-16 w-full bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  </div>
);

// --- Main Client Component ---
const DecisionsClient = () => {
  const t = useTranslations("Decisions");
  const params = useParams();
  const locale = params?.locale as string;

  const [activeTab, setActiveTab] = useState<number>(0);
  const [openedAccordion, setOpenedAccordion] = useState<number | null>(null);

  const { data: pageData, loading: isLoading, error } = useFetch<DecisionsApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/universities/decisions-and-instructions`,
    locale
  );

  const handleAccordion = (id: number) => {
    setOpenedAccordion(openedAccordion === id ? null : id);
  };

  const getFileName = (path: string) => path?.split("/")?.pop() || "download";

  const activeTypeData = pageData?.types?.[activeTab];

  if (isLoading) return <PageSkeleton />;
  if (error) return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] w-full flex_center">
        <NoData showButton={true} className="my-10" />
      </div>
    </div>
  );
  if (!pageData) return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] w-full flex_center">
        <NoData showButton={false} />
      </div>
    </div>
  );

  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={pageData.title || t("head")} alt={false} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[300px] relative rounded-3xl overflow-hidden">
          <Image
            src={pageData.bg_image.lg}
            alt={pageData.title}
            fill
            priority
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>

        {/* Tabs - Now always visible */}
        <div className="w-full flex_center">
          <div className="flex justify-center items-center w-full max-w-[920px] sm:h-[85px] h-[55px] relative bg-lightBorder rounded-2xl overflow-hidden gap-5">
            {pageData.types && pageData.types.length > 0 && (
              <span
                className="bg-primary duration-300 absolute top-0 h-full rounded-2xl transition-all left-0"
                style={{
                  width: `${100 / pageData.types.length}%`,
                  transform: `translateX(${activeTab * 100}%)`,
                }}
              ></span>
            )}
            {pageData.types?.map((type, index) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`flex_center w-1/2 sm:text-lg z-10 text-center h-full text-sm ${
                  activeTab === index
                    ? "text-white"
                    : "text-secondary opacity-70"
                }`}
              >
                {type.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - Renders content for the active tab or a "no data" message */}
        {activeTypeData &&
        activeTypeData.sections.some((s) => s.lists.length > 0) ? (
          activeTypeData.sections.map((section) => {
            if (section.lists.length === 0) return null;

            return (
              <div key={section.id} className="w-full flex flex-col gap-5 mt-5">
                <div className="relative w-fit">
                  <span className="absolute left-1/2 -translate-x-1/2 w-full bottom-0 h-[55%] bg-golden"></span>
                  <h3 className="sm:text-3xl text-2xl z-10 relative font-semibold">
                    {section.title}
                  </h3>
                </div>
                {section.lists.map((item) => (
                  <div
                    key={item.id}
                    className={`w-full flex_start flex-col rounded-2xl text-secondary border ${
                      openedAccordion === item.id
                        ? "border-golden"
                        : "border-lightBorder"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleAccordion(item.id)}
                      className="flex justify-between items-center w-full p-5 text-left"
                    >
                      <div className="flex_center gap-4">
                        <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full"></span>
                        <h3 className="font-semibold">{item.title}</h3>
                      </div>
                      <FaChevronDown
                        className={`duration-200 ${
                          openedAccordion === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`flex_start duration-300 flex-col gap-5 w-full overflow-hidden ${
                        openedAccordion === item.id
                          ? "max-h-[700px] p-5 pt-0"
                          : "max-h-0"
                      }`}
                    >
                      <p className="opacity-70">{item.description}</p>
                      {item.files[0]?.file?.path && (
                        <a
                          href={item.files[0].file.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-backgroundSecondary rounded-3xl flex items-center gap-4 p-2 max-w-fit"
                        >
                          <span className="bg-[#81B1CE] text-white flex_center w-7 h-7 rounded-full flex-shrink-0">
                            <HiOutlineLink />
                          </span>
                          <span className="text-sm truncate">
                            {getFileName(item.files[0].file.path)}
                          </span>
                          <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm ml-2 flex-shrink-0">
                            <GrLinkNext className="-rotate-45" />
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 w-full py-10">
            {t("no_data_found")}
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionsClient;
