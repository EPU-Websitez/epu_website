"use client";

import InternationalRelationsHeader from "@/components/InternationalRelationsHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import { GoBook } from "react-icons/go";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------

interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface InternationalRelation {
  id: number;
  slug: string;
  about: string;
  bg_image: Image;
  bg_title: string;
  bg_description: string;
}

interface InternationalRelationResponse {
  total: number;
  page: number;
  limit: number;
  data: InternationalRelation[];
}

interface Unit {
  id: number;
  title: string;
  description: string;
}

interface UnitsResponse {
  total: number;
  page: number;
  limit: number;
  data: Unit[];
}

interface SectionList {
  id: number;
  title: string;
  description: string;
}

interface Section {
  id: number;
  title: string;
  description: string;
  lists: SectionList[];
}

interface SectionsResponse {
  total: number;
  page: number;
  limit: number;
  data: Section[];
}

// -------- Granular Skeleton Components --------

const AboutTextSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
  </div>
);

const AccordionSkeleton = () => (
  <div className="w-full h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
);

const ProgramCardSkeleton = () => (
  <div className="w-full h-[180px] bg-gray-200 rounded-3xl animate-pulse"></div>
);

const Page = () => {
  const t = useTranslations("International");
  const params = useParams();
  const locale = params?.locale as string;

  const [openedAccordion, setOpenedAccordion] = useState<number | null>(null);
  const [internationalRelationId, setInternationalRelationId] = useState<
    number | null
  >(null);

  const handleAccordion = (id: number) => {
    if (id !== openedAccordion) {
      setOpenedAccordion(id);
    } else {
      setOpenedAccordion(null);
    }
  };

  // 1. Fetch main International Relations data to get the ID
  const {
    data: relationData,
    loading: relationLoading,
    error: relationError,
  } = useFetch<InternationalRelationResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/international-relations?page=1&limit=1`,
    locale
  );

  // Set the ID once the main data is fetched
  useEffect(() => {
    if (relationData?.data?.[0]?.id) {
      setInternationalRelationId(relationData.data[0].id);
    }
  }, [relationData]);

  // 2. Fetch Units data using the ID from the first call
  const {
    data: unitsData,
    loading: unitsLoading,
    error: unitsError,
  } = useFetch<UnitsResponse>(
    internationalRelationId
      ? `${process.env.NEXT_PUBLIC_API_URL}/website/international-relations/international-relation/${internationalRelationId}/units`
      : "",
    locale
  );

  // 3. Fetch Sections data using the ID from the first call
  const {
    data: sectionsData,
    loading: sectionsLoading,
    error: sectionsError,
  } = useFetch<SectionsResponse>(
    internationalRelationId
      ? `${process.env.NEXT_PUBLIC_API_URL}/website/international-relations/international-relation/${internationalRelationId}/sections`
      : "",
    locale
  );

  const isLoading = relationLoading || unitsLoading || sectionsLoading;
  const hasError = relationError || unitsError || sectionsError;
  const mainRelation = relationData?.data?.[0];
  const units = unitsData?.data || [];
  const sections = sectionsData?.data || [];

  if (hasError) {
    return (
      <div className="w-full flex_center my-20">
        <p className="text-red-500">{t("error_loading_data")}</p>
      </div>
    );
  }

  // This check ensures we don't render a blank page if the initial fetch fails after loading
  if (!isLoading && !mainRelation) {
    return (
      <div className="w-full flex_center my-20">
        <p>{t("no_data_found")}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("international_relations")} alt={false} />
        <InternationalRelationsHeader />
        <h2 className="relative sm:text-[32px] text-lg font-semibold ">
          <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
          <span className="z-10 relative">{t("about")}</span>
        </h2>

        {/* About Text: Skeleton vs Content */}
        {isLoading ? (
          <AboutTextSkeleton />
        ) : (
          <p className="text-opacity-70 text-secondary text-sm sm:rounded-none rounded-lg sm:border-none border border-lightBorder sm:p-0 p-3">
            {mainRelation?.about}
          </p>
        )}

        {/* Units Section */}
        {units.length > 0 && (
          <div className="flex_center w-full gap-5 mt-5">
            <span className="bg-lightBorder w-full h-[1px]"></span>
            <h3 className="text-secondary text-xl font-medium">{t("units")}</h3>
            <span className="bg-lightBorder w-full h-[1px]"></span>
          </div>
        )}
        <div className="flex_start flex-col gap-5 w-full">
          {isLoading ? (
            <>
              <AccordionSkeleton />
              <AccordionSkeleton />
            </>
          ) : (
            units.map((unit) => (
              <div
                key={unit.id}
                className={`w-full flex_start flex-col rounded-2xl text-secondary border ${
                  openedAccordion === unit.id
                    ? "border-golden"
                    : "border-lightBorder"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleAccordion(unit.id)}
                  className="flex justify-between items-center w-full p-5 text-left"
                >
                  <div className="flex_center gap-4">
                    <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full relative block"></span>
                    <h3 className="font-semibold">{unit.title}</h3>
                  </div>
                  <FaChevronDown
                    className={`duration-200 flex-shrink-0 ${
                      openedAccordion === unit.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`flex_start duration-300 flex-col gap-5 ${
                    openedAccordion === unit.id
                      ? "max-h-[700px] p-5 pt-0"
                      : "max-h-0 overflow-y-hidden"
                  }`}
                >
                  <p className="sm:text-base text-sm opacity-70">
                    {unit.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Programs Section */}
        {sections.length > 0 && (
          <div className="flex_center w-full gap-5 mt-5">
            <span className="bg-lightBorder w-full h-[1px]"></span>
            <h3 className="text-secondary text-xl font-medium">
              {t("programs")}
            </h3>
            <span className="bg-lightBorder w-full h-[1px]"></span>
          </div>
        )}
        <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-5">
          {isLoading ? (
            <>
              <ProgramCardSkeleton />
              <ProgramCardSkeleton />
            </>
          ) : (
            sections.map((section) => (
              <div
                key={section.id}
                className="flex_start gap-5 rounded-3xl p-5 bg-primary text-white"
              >
                <span className="flex-shrink-0 text-xl w-10 h-10 rounded-full lg:flex hidden justify-center items-center bg-white text-secondary">
                  <GoBook />
                </span>
                <div className="flex_start flex-col gap-3 w-full">
                  <h3 className="lg:text-xl text-lg">{section.title}</h3>
                  {section.lists.map((item) => (
                    <Link
                      href={`/${locale}/international-relations/exchange-programs`} // Assuming this is a generic link, adjust if needed
                      title={item.title}
                      key={item.id}
                      className="flex items-center gap-3 w-full justify-between hover:text-golden transition-colors"
                    >
                      <div className="flex_center gap-3">
                        <span className="w-[10px] h-[10px] flex-shrink-0 rounded-full bg-golden"></span>
                        <small className="text-xs">{item.title}</small>
                      </div>
                      <FiArrowRight className="text-golden text-lg rtl:rotate-180" />
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Static Mobile Navigation */}
        <div className="sm:hidden flex justify-start items-start flex-col gap-4 flex-shrink-0 w-full sm:border-none border-t border-t-lightBorder sm:pt-0 pt-5">
          <div className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
            <span>{t("about")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </div>
          <Link
            href={`/${locale}/international-relations/directory-structure?id=${mainRelation?.id}`}
            title={t("directory_structure")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("directory_structure")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/news?id=${mainRelation?.id}`}
            title={t("news")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("news")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/office-staff?id=${mainRelation?.id}`}
            title={t("office_staff")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("office_staff")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Page;
