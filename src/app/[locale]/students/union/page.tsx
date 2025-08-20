"use client";

import SubHeader from "@/components/subHeader";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa6";

// -------- Interfaces --------

interface ImageFile {
  id: number;
  original: string;
  lg: string;
}

interface StudentUnionMain {
  id: number;
  slug: string;
  title: string;
  achievements_title: string;
  achievements_description: string;
}

interface StudentUnionMainResponse {
  data: StudentUnionMain[];
}

interface SectionItem {
  id: number;
  title: string;
  description: string;
  image: ImageFile;
}

interface SectionsResponse {
  data: SectionItem[];
}

interface AchievementItem {
  id: number;
  title: string;
  description: string;
  icon_image: ImageFile;
}

interface AchievementsResponse {
  data: AchievementItem[];
}

// -------- Granular Skeleton Components --------

const AchievementsSkeleton = () => (
  <div className="w-full animate-pulse mt-10 mb-20">
    <div className="flex_center w-full">
      <div className="h-8 w-1/3 bg-gray-200 rounded-full"></div>
    </div>
    <div className="h-4 w-2/3 mx-auto bg-gray-200 rounded-full mt-4"></div>
    <div className="grid w-full lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 mt-10">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-48 bg-gray-200 rounded-3xl"></div>
      ))}
    </div>
  </div>
);

const SectionSkeleton = () => (
  <div className="flex items-center md:flex-row flex-col gap-10 w-full mb-10 animate-pulse">
    <div className="lg:w-[510px] md:w-[475px] w-full flex-shrink-0 lg:h-[328px] md:h-[293px] h-[226px] bg-gray-200 rounded-lg"></div>
    <div className="flex_start flex-col gap-8 w-full">
      <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
      <div className="h-4 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Students");
  const [studentUnionSlug, setStudentUnionSlug] = useState<string | null>(null);

  // 1. Fetch main data to get slug
  const { data: mainData, loading: mainLoading } =
    useFetch<StudentUnionMainResponse>(
      `${API_URL}/website/student-union?page=1&limit=1`
    );

  useEffect(() => {
    if (mainData?.data?.[0]?.slug) {
      setStudentUnionSlug(mainData.data[0].slug);
    }
  }, [mainData]);

  // 2. Fetch related data using the slug
  const { data: sectionsData, loading: sectionsLoading } =
    useFetch<SectionsResponse>(
      studentUnionSlug
        ? `${API_URL}/website/student-union/${studentUnionSlug}/sections`
        : ""
    );
  const { data: achievementsData, loading: achievementsLoading } =
    useFetch<AchievementsResponse>(
      studentUnionSlug
        ? `${API_URL}/website/student-union/${studentUnionSlug}/achievements`
        : ""
    );

  const isLoading = mainLoading || sectionsLoading || achievementsLoading;
  const mainInfo = mainData?.data?.[0];
  const sections = sectionsData?.data || [];
  const achievements = achievementsData?.data || [];

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1024px] md:px-3 px-8 text-secondary flex_start flex-col gap-5 w-full">
        <SubHeader title={t("union")} alt={false} />

        {/* --- Static Header Section --- */}
        <div className="w-full flex md:flex-row flex-col justify-between md:items-center items-start gap-10">
          <h1 className="lg:text-[70px] sm:text-[55px] text-[40px]">
            {t("teach")} <br className="md:block hidden" /> {t("learn")} <br />
            {t("grow")}
          </h1>
          <div className="flex_center gap-5 md:w-auto w-full md:flex-row flex-col">
            <div className="lg:w-[420px] md:w-[350px] w-full lg:h-[430px] md:h-[360px] h-[245px] relative rounded-3xl overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black to-transparent flex justify-start items-center z-10">
                <h3 className="text-white text-smallTitle font-medium pl-3 pr-1 relative">
                  <span className="relative z-10">{t("collaboration")}</span>
                  <span className="w-full absolute left-0 h-2 bg-golden bottom-1"></span>
                </h3>
              </div>
              <Image
                src={"/images/union.png"}
                alt="Collaboration"
                fill
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:w-[250px] md:w-[208px] w-full lg:h-[430px] md:h-[360px] h-[245px] relative rounded-3xl overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black to-transparent flex justify-start items-center z-10">
                <h3 className="text-white text-lg font-medium pl-3 pr-1 relative">
                  <span className="relative z-10">{t("learning")}</span>
                  <span className="w-full absolute left-0 h-2 bg-golden bottom-1"></span>
                </h3>
              </div>
              <Image
                src={"/images/union-1.png"}
                alt="Learning"
                fill
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* --- Dynamic Achievements Section --- */}
        {isLoading ? (
          <AchievementsSkeleton />
        ) : (
          <>
            <div className="flex_center w-full mt-10">
              <h3 className="sm:text-titleNormal text-base font-semibold relative text-center">
                <span className="relative z-10">
                  {mainInfo?.achievements_title}
                </span>
                <span className="w-full absolute left-0 h-3 bg-golden bottom-2"></span>
              </h3>
            </div>
            <p className="text-center sm:text-lg text-sm px-10 font-medium">
              {mainInfo?.achievements_description}
            </p>
            <div className="grid w-full lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 mt-10 mb-20">
              {achievements.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl border border-lightBorder text-center flex_center flex-col gap-5"
                >
                  <div className="flex_center text-3xl rounded-full w-[50px] h-[50px] text-white bg-golden">
                    <Image
                      src={item.icon_image.lg}
                      alt={item.title}
                      width={28}
                      height={28}
                    />
                  </div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <small className="text-xs">{item.description}</small>
                </div>
              ))}
            </div>
          </>
        )}

        {/* --- Static "About Union" Section (Video) --- */}
        {/* <div className="flex_center md:flex-row flex-col gap-10 w-full mb-10">
          <h2 className="lg:text-titleNormal md:hidden block text-smallTitle font-semibold">
            {t("about_union")}
          </h2>
          <div className="lg:w-[510px] md:w-[475px] w-full flex-shrink-0 lg:h-[328px] md:h-[293px] h-[226px] relative">
            <button className="flex_center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white rounded-full text-xl bg-gradient-to-r from-[#DCC48C] to-[#FFA64D] z-10">
              <FaPlay />
            </button>
            <span className="w-9 h-9 rounded-full bg-primary absolute ltr:-right-5 rtl:-left-5 -bottom-5 z-10"></span>
            <Image
              src={"/images/union-2.png"}
              alt="About the Union"
              fill
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex_start flex-col gap-8">
            <h2 className="lg:text-titleNormal md:block hidden text-smallTitle font-semibold">
              {t("about_union")}
            </h2>
            <p className="text-sm">{t("about_union_text")}</p>
          </div>
        </div> */}

        {/* --- New Dynamic Sections from API --- */}
        {isLoading ? (
          <SectionSkeleton />
        ) : (
          sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex md:justify-between justify-center items-center md:flex-row flex-col gap-10 w-full mb-10 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="lg:w-[510px] md:w-[475px] w-full flex-shrink-0 lg:h-[328px] md:h-[293px] h-[226px] relative">
                <Image
                  src={section.image.lg}
                  alt={section.title}
                  fill
                  priority
                  className="w-full h-full object-cover rounded-lg z-10"
                />
                <div className="w-full h-full absolute top-2 left-2 border-4 border-golden border-dashed"></div>
                <span className="w-9 h-9 rounded-full bg-primary absolute ltr:-right-5 rtl:-left-5 -bottom-5 z-10"></span>
              </div>
              <div className="flex_start flex-col gap-8">
                <h2 className="lg:text-titleNormal text-smallTitle font-semibold">
                  {section.title}
                </h2>
                <p className="text-sm">{section.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
