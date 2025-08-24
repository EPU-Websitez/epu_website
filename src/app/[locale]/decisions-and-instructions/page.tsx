"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { GrLinkNext } from "react-icons/gr";
import { HiOutlineLink } from "react-icons/hi2";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// -------- FIX 1: Updated Interfaces to match the new API response --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}

// Represents the nested 'file' object with the path
interface FileDetails {
  id: number;
  path: string;
}

// Represents the item inside the 'files' array
interface FileItem {
  id: number;
  file: FileDetails;
}

interface DecisionListItem {
  id: number;
  title: string;
  description: string;
  files: FileItem[]; // Updated
}

interface DecisionSection {
  id: number;
  title: string;
  section_type: "DECISION" | "INSTRUCTION" | "GUIDELINE" | "POLICY"; // Added new types
  lists: DecisionListItem[];
}

interface DecisionType {
  id: number;
  title: string;
  sections: DecisionSection[];
}

// This is now the top-level response type
interface DecisionsData {
  id: number;
  bg_image: ImageFile;
  types: DecisionType[];
}
// --------------------------------------------------------------------------

// -------- Skeleton Component (Unchanged) --------
const PageSkeleton = () => (
  <div className="my-10 flex_center w-full animate-pulse">
    <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <div className="w-full lg:h-[500px] h-[300px] bg-gray-200 rounded-3xl"></div>
      <div className="w-[920px] h-[85px] bg-gray-200 rounded-2xl mx-auto"></div>
      <div className="h-10 w-1/3 bg-gray-200 rounded-full"></div>
      <div className="w-full space-y-4">
        <div className="h-16 w-full bg-gray-200 rounded-2xl"></div>
        <div className="h-16 w-full bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Decisions");
  const [tab, setTab] = useState("higherEdu");
  const [openedAccordion, setOpenedAccordion] = useState<number | null>(null);
  const [openedAccordionDecision, setOpenedAccordionDecision] = useState<
    number | null
  >(null);

  // -------- FIX 2: Changed the generic type for useFetch --------
  const { data: mainData, loading: isLoading } = useFetch<DecisionsData>(
    `${API_URL}/website/universities/decisions-and-instructions?page=1&limit=2`
  );
  // -----------------------------------------------------------------

  const handleAccordion = (id: number, type: "instruction" | "decision") => {
    if (type === "instruction") {
      setOpenedAccordion(openedAccordion === id ? null : id);
    } else {
      setOpenedAccordionDecision(openedAccordionDecision === id ? null : id);
    }
  };

  // -------- FIX 3: Simplified data access --------
  const activeType =
    tab === "higherEdu" ? mainData?.types?.[0] : mainData?.types?.[1];
  // -----------------------------------------------

  const instructions =
    activeType?.sections.filter((s) => s.section_type === "INSTRUCTION") || [];
  const decisions =
    activeType?.sections.filter((s) => s.section_type === "DECISION") || [];

  const getFileName = (path: string) => path.split("/").pop();

  if (isLoading) return <PageSkeleton />;
  if (!mainData) return <div>No data found.</div>;

  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[300px] relative rounded-3xl overflow-hidden">
          <Image
            src={mainData.bg_image.lg}
            alt="Decisions"
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tabs */}
        <div className="w-full flex_center">
          <div className="sm:flex hidden justify-center items-center w-full max-w-[920px] h-[85px] relative bg-lightBorder rounded-2xl overflow-hidden gap-5">
            <span
              className={`bg-primary duration-300 absolute ltr:left-0 rtl:right-0 top-0 w-1/2 h-full rounded-2xl transition-all ${
                tab === "higherEdu"
                  ? "ltr:left-0 rtl:right-0"
                  : "ltr:left-1/2 rtl:right-1/2"
              }`}
            ></span>
            {/* -------- FIX 4: Corrected Tab Titles -------- */}
            <button
              type="button"
              onClick={() => setTab("higherEdu")}
              className={`flex_center w-1/2 text-lg z-10 text-center h-full ${
                tab === "higherEdu" ? "text-white" : "text-secondary opacity-70"
              }`}
            >
              {mainData.types?.[0]?.title || t("higher_edu")}
            </button>
            <button
              type="button"
              onClick={() => setTab("polyUni")}
              className={`flex_center w-1/2 text-lg z-10 text-center h-full ${
                tab === "polyUni" ? "text-white" : "text-secondary opacity-70"
              }`}
            >
              {mainData.types?.[1]?.title || t("uni")}
            </button>
            {/* ------------------------------------------- */}
          </div>
        </div>

        {/* Instructions */}
        {instructions.length > 0 && (
          <>
            <div className="relative">
              <span className="absolute left-1/2 -translate-x-1/2 w-full bottom-0 h-[55%] bg-golden"></span>
              <h3 className="sm:text-3xl text-2xl z-10 relative font-semibold">
                {t("intructions")}
              </h3>
            </div>
            <div className="flex_start flex-col gap-5 w-full">
              {instructions.map((section) =>
                section.lists.map((item) => (
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
                      onClick={() => handleAccordion(item.id, "instruction")}
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
                      {/* -------- FIX 5: Updated File Path Access -------- */}
                      {item.files[0]?.file && (
                        <a
                          href={item.files[0].file.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-backgroundSecondary rounded-3xl flex_center gap-4 p-2 max-w-fit"
                        >
                          <span className="bg-[#81B1CE] text-white flex_center w-7 h-7 rounded-full">
                            <HiOutlineLink />
                          </span>
                          <span className="text-sm">
                            {getFileName(item.files[0].file.path)}
                          </span>
                          <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                            <GrLinkNext className="-rotate-45" />
                          </span>
                        </a>
                      )}
                      {/* ----------------------------------------------- */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Decisions */}
        {decisions.length > 0 && (
          <>
            <div className="relative">
              <span className="absolute left-1/2 -translate-x-1/2 w-full bottom-0 h-[55%] bg-golden"></span>
              <h3 className="sm:text-3xl text-2xl z-10 relative font-semibold">
                {t("decision")}
              </h3>
            </div>
            <div className="flex_start flex-col gap-5 w-full">
              {decisions.map((section) =>
                section.lists.map((item) => (
                  <div
                    key={item.id}
                    className={`w-full flex_start flex-col rounded-2xl text-secondary border ${
                      openedAccordionDecision === item.id
                        ? "border-golden"
                        : "border-lightBorder"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleAccordion(item.id, "decision")}
                      className="flex justify-between items-center w-full p-5 text-left"
                    >
                      <div className="flex_center gap-4">
                        <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full"></span>
                        <h3 className="font-semibold">{item.title}</h3>
                      </div>
                      <FaChevronDown
                        className={`duration-200 ${
                          openedAccordionDecision === item.id
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`flex_start duration-300 flex-col gap-5 w-full overflow-hidden ${
                        openedAccordionDecision === item.id
                          ? "max-h-[700px] p-5 pt-0"
                          : "max-h-0"
                      }`}
                    >
                      <p className="opacity-70">{item.description}</p>
                      {/* -------- FIX 5: Updated File Path Access -------- */}
                      {item.files[0]?.file && (
                        <a
                          href={item.files[0].file.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-backgroundSecondary rounded-3xl flex_center gap-4 p-2 max-w-fit"
                        >
                          <span className="bg-[#81B1CE] text-white flex_center w-7 h-7 rounded-full">
                            <HiOutlineLink />
                          </span>
                          <span className="text-sm">
                            {getFileName(item.files[0].file.path)}
                          </span>
                          <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                            <GrLinkNext className="-rotate-45" />
                          </span>
                        </a>
                      )}
                      {/* ----------------------------------------------- */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
