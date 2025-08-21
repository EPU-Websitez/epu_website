"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaAngleRight, FaGraduationCap } from "react-icons/fa6";
import { GoBriefcase } from "react-icons/go";
import { IoArrowForwardOutline } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}

interface ProgramMain {
  id: number;
  description: string;
  college_number: string;
  institute_number: string;
  bg_image: ImageFile;
}

interface ProgramMainResponse {
  data: ProgramMain[];
}

interface Department {
  id: number;
  slug: string;
  title: string;
  student_number: string;
}

interface College {
  id: number;
  type: "COLLEGE" | "INSTITUTE";
  title: string;
  subdomain: string;
  logo: ImageFile;
  departments: Department[];
}

interface CollegeData {
  college: College;
}

interface CollegeApiResponse {
  total: number;
  data: CollegeData[];
}

// -------- Granular Skeleton Components --------
const HeaderSkeleton = () => (
  <div className="w-full h-[276px] bg-gray-200 animate-pulse rounded-3xl"></div>
);

const ProgramsListSkeleton = () => (
  <div className="w-full bg-backgroundSecondary flex_center flex-col pt-10 animate-pulse">
    <div className="max-w-[1040px] w-full flex_center flex-col gap-10 lg:px-0 px-3">
      <div className="sm:w-[500px] w-full h-[50px] bg-gray-300 rounded-2xl"></div>
      <div className="h-8 w-1/2 bg-gray-300 rounded-full"></div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 w-full border-b border-b-lightBorder pb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-300 rounded-2xl"></div>
        ))}
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Programs");
  const params = useParams();
  const locale = params?.locale as string;
  const [tab, setTab] = useState("colleges");
  const programsListRef = useRef<HTMLDivElement>(null);

  // State for pagination
  const [listData, setListData] = useState<CollegeData[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 1. Fetch main program info for the header
  const { data: mainProgramResponse, loading: mainLoading } =
    useFetch<ProgramMainResponse>(
      `${API_URL}/website/programs?page=1&limit=1&is_active=true`
    );

  // 2. Manually fetch paginated colleges/departments
  useEffect(() => {
    fetchPrograms(1);
  }, []);

  const fetchPrograms = async (pageNum: number) => {
    if (pageNum > 1) setIsLoadingMore(true);
    try {
      const res = await fetch(
        `${API_URL}/website/programs/departments-by-college?limit=4&page=${pageNum}`
      );
      // Assuming the response is an array directly
      const newData: CollegeData[] = await res.json();

      // This is a fallback since the API doesn't return a total count.
      // We will use the total from the other API call.
      const metaRes = await fetch(`${API_URL}/website/programs?limit=1`);
      const metaData: ProgramMainResponse & { total: number } =
        await metaRes.json();

      if (newData) {
        setListData((prev) =>
          pageNum === 1 ? newData : [...prev, ...newData]
        );
        if (metaData.total) setTotal(metaData.total);
      }
    } catch (error) {
      console.error("Failed to fetch programs", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPrograms(nextPage);
  };

  const handleScrollToPrograms = () => {
    programsListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isLoading = mainLoading || (listData.length === 0 && !isLoadingMore);
  const mainProgramInfo = mainProgramResponse?.data?.[0];

  const colleges = listData.filter((item) => item.college.type === "COLLEGE");
  const institutes = listData.filter(
    (item) => item.college.type === "INSTITUTE"
  );

  const dataToDisplay = tab === "colleges" ? colleges : institutes;

  return (
    <div className="my-10 flex_center w-full flex-col">
      <div className="max-w-[1040px] w-full flex_center flex-col gap-10 lg:px-0 px-3">
        <div className="w-full flex_start">
          <SubHeader title={t("head")} alt={false} />
        </div>
        {isLoading ? (
          <HeaderSkeleton />
        ) : (
          mainProgramInfo && (
            <div className="w-full bg-primary text-white md:p-10 p-5 flex justify-between md:flex-row flex-col items-start rounded-3xl md:gap-5 gap-10">
              <div className="flex_start md:flex-col flex-row md:flex-nowrap flex-wrap gap-5 md:max-w-[350px] max-w-full">
                <p className="font-medium md:text-sm text-xs md:mb-0 mb-3 tracking-wide">
                  {mainProgramInfo.description}
                </p>
                {/* ... counts for colleges and institutes ... */}
                <div className="md:w-auto w-full">
                  <button
                    onClick={handleScrollToPrograms}
                    className="mt-5 rounded-3xl md:h-10 h-8 flex_center sm:px-3 px-2 gap-2 bg-white max-w-fit"
                  >
                    <span className="text-primary font-bold md:text-sm text-xs mx-2">
                      {t("see_programs")}
                    </span>
                    <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-primary text-white rounded-full">
                      <FaAngleRight className="rtl:rotate-180" />
                    </span>
                  </button>
                </div>
              </div>
              <div className="relative md:h-[276px] h-[192px] md:w-[420px] w-full">
                <Image
                  src={mainProgramInfo.bg_image.lg}
                  alt={mainProgramInfo.description}
                  fill
                  priority
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          )
        )}
      </div>

      <div
        ref={programsListRef}
        className="w-full bg-backgroundSecondary flex_center flex-col pt-10 mt-10"
      >
        {isLoading ? (
          <ProgramsListSkeleton />
        ) : (
          <div className="max-w-[1040px] w-full flex_center flex-col gap-10 lg:px-0 px-3">
            <div className="flex justify-center items-center sm:w-[500px] w-full md:h-[50px] h-[36px] relative bg-lightBorder rounded-2xl overflow-hidden gap-5">
              <span
                className={`bg-primary duration-300 absolute ltr:left-0 rtl:right-0 top-0 w-1/2 h-full rounded-2xl transition-all ${
                  tab === "colleges"
                    ? "ltr:left-0 rtl:right-0"
                    : "ltr:left-1/2 rtl:right-1/2"
                }`}
              ></span>
              <button
                type="button"
                onClick={() => setTab("colleges")}
                className={`flex_center w-1/2 md:text-lg text-sm z-10 text-center h-full ${
                  tab === "colleges"
                    ? "text-white"
                    : "text-secondary opacity-70"
                }`}
              >
                {t("colleges")}
              </button>
              <button
                type="button"
                onClick={() => setTab("institution")}
                className={`flex_center w-1/2 md:text-lg text-sm z-10 text-center h-full ${
                  tab === "institution"
                    ? "text-white"
                    : "text-secondary opacity-70"
                }`}
              >
                {t("institution")}
              </button>
            </div>

            {dataToDisplay.map((item, index) => (
              <div
                key={item.college.id}
                className="w-full flex flex-col items-center"
              >
                <h2 className="md:text-xl relative text-lg font-semibold mb-6">
                  <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                  <span className="z-10 relative">{item.college.title}</span>
                </h2>
                <div
                  className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 w-full pb-10 ${
                    index < dataToDisplay.length - 1 &&
                    "border-b border-b-lightBorder"
                  }`}
                >
                  {item.college.departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="relative border border-lightBorder rounded-2xl p-2 flex_center flex-col gap-3 text-center"
                    >
                      <Link
                        href={`/${locale}/colleges/${item.college.subdomain}/departments/${dept.slug}`}
                        className="w-full h-[165px] relative overflow-hidden rounded-2xl group"
                      >
                        <div className="text-secondary bg-white h-5 w-5 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                          <IoArrowForwardOutline className="rtl:rotate-180" />
                        </div>
                        <Image
                          src={item.college.logo.lg}
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          alt={dept.title}
                          fill
                          priority
                        />
                      </Link>
                      <Link
                        href={`/${locale}/department/${dept.slug}`}
                        className="sm:text-sm text-[10px] font-semibold hover:text-primary transition-colors h-10 flex items-center"
                      >
                        {dept.title}
                      </Link>
                      <div className="flex_center gap-8 w-full">
                        <div className="flex_center gap-2">
                          <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                            <PiStudent />
                          </div>
                          <div className="flex_start flex-col">
                            <small className="font-medium sm:text-[10px] text-[8px]">
                              {dept.student_number}
                            </small>
                            <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                              Students
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {listData.length < total && (
              <div className="w-full flex_center pb-10">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-primary text-white px-6 py-2 rounded-full disabled:bg-opacity-70"
                >
                  {isLoadingMore ? t("loading") : t("load_more")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Page;
