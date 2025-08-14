"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------

interface DirectoryStructureItem {
  id: number;
  title: string;
  description: string;
}

interface DirectoryStructureResponse {
  total: number;
  page: number;
  limit: number;
  data: DirectoryStructureItem[];
}

// -------- Skeleton Component for Dynamic Content --------

const AccordionSkeleton = () => (
  <div className="w-full h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
);

const Page = () => {
  const t = useTranslations("International");
  const params = useParams();
  const searchParams = useSearchParams();

  const locale = params?.locale as string;
  // Get 'id' from the query string, e.g., .../directory-structure?id=2
  const id = searchParams.get("id");

  const [openedAccordion, setOpenedAccordion] = useState<number | null>(null);

  const handleAccordion = (accordionId: number) => {
    if (accordionId !== openedAccordion) {
      setOpenedAccordion(accordionId);
    } else {
      setOpenedAccordion(null);
    }
  };

  const {
    data: directoryData,
    loading,
    error,
  } = useFetch<DirectoryStructureResponse>(
    id
      ? `${API_URL}/website/international-relations/international-relation/${id}/directory-structure`
      : ""
  );

  const structures = directoryData?.data || [];

  if (error || !id) {
    return (
      <div className="w-full flex_center my-20">
        <p className="text-red-500">{t("error_loading_data")}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("international_relations")} alt={false} />
        {/* This header is static and will render immediately */}
        <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] relative overflow-hidden rounded-3xl">
          <Image
            src={"/images/international-lg.png"}
            alt="International Relations"
            fill
            priority
            className="w-full h-full object-cover"
          />
          <div className="ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-transparent absolute top-0 left-0 w-full h-full z-10"></div>
          <h3 className="absolute z-20 text-white top-10 ltr:left-10 rtl:right-10 lg:text-[28px] text-sm max-w-[710px]">
            {t("international_strategy_text")}
          </h3>
          <div className="absolute z-20 text-white bottom-10 ltr:left-10 rtl:right-10 sm:flex hidden justify-center items-center gap-5">
            <Link
              href={`/${locale}/international-relations?id=${id}`}
              title={t("about")}
            >
              {t("about")}
            </Link>
            <span className="h-[20px] w-[1px] bg-white"></span>
            <span className="text-golden font-semibold">
              {t("directory_structure")}
            </span>
            <span className="h-[20px] w-[1px] bg-white"></span>
            <Link
              href={`/${locale}/international-relations/office-staff?id=${id}`}
              title={t("office_staff")}
            >
              {t("office_staff")}
            </Link>
            <span className="h-[20px] w-[1px] bg-white"></span>
            <Link
              href={`/${locale}/international-relations/contact?id=${id}`}
              title={t("contact")}
            >
              {t("contact")}
            </Link>
          </div>
        </div>
        <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
          <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
          <span className="z-10 relative">{t("directory_structure")}</span>
        </h2>
        <div className="flex_start flex-col gap-5 w-full">
          {loading ? (
            // While loading, show several accordion skeletons
            <>
              <AccordionSkeleton />
              <AccordionSkeleton />
              <AccordionSkeleton />
            </>
          ) : structures.length > 0 ? (
            // After loading, map the actual data
            structures.map((item) => (
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
                    <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full relative block"></span>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <FaChevronDown
                    className={`duration-200 ${
                      openedAccordion === item.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`flex_start duration-300 flex-col gap-5 ${
                    openedAccordion === item.id
                      ? "max-h-[700px] p-5 pt-0"
                      : "max-h-0 overflow-y-hidden"
                  }`}
                >
                  <p className="opacity-70">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            // If there's no data after loading, show a message
            <div className="w-full text-center py-10">
              <p>{t("no_data_found")}</p>
            </div>
          )}

          {/* Static Mobile Navigation */}
          <div className="sm:hidden flex justify-start items-start flex-col gap-4 flex-shrink-0 w-full">
            <Link
              href={`/${locale}/international-relations?id=${id}`}
              title={t("about")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("about")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <div className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
              <span>{t("directory_structure")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </div>
            <Link
              href={`/${locale}/international-relations/office-staff?id=${id}`}
              title={t("office_staff")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("office_staff")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/international-relations/contact?id=${id}`}
              title={t("contact")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("contact")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
