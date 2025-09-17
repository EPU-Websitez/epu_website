"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { IoArrowForwardOutline } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

/* ============================
    Types
============================ */

interface ImageFile {
  id: number;
  original: string | null;
  lg: string | null;
  md?: string | null;
  sm?: string | null;
  thumbnail?: string | null;
}

interface ProgramMain {
  id: number;
  slug: string;
  title: string;
  description: string;
  college_number: string;
  institute_number: string;
  contact_phone?: string | null;
  contact_email?: string | null;
  contact_address?: string | null;
  bg_image: ImageFile | null;
}

interface ProgramListResponse {
  total: number;
  page: number;
  limit: number;
  data: ProgramMain[];
}

interface Department {
  id: number;
  slug: string;
  title: string;
  student_number: string;
}

type CollegeType = "COLLEGE" | "INSTITUTE";

interface College {
  id: number;
  type: CollegeType;
  title: string;
  subdomain: string;
  logo: ImageFile | null;
  departments?: Department[];
}

interface CollegeBlock {
  college: College;
  departments?: Department[];
}

/* ============================
    Skeletons
============================ */

const HeaderSkeleton = () => (
  <div className="w-full h-[276px] bg-gray-200 animate-pulse rounded-3xl"></div>
);

const CardGridSkeleton = () => (
  <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 w-full pb-10 animate-pulse">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-[280px] bg-gray-300 rounded-2xl"></div>
    ))}
  </div>
);

/* ============================
    Page
============================ */

const ProgramsClient = () => {
  const t = useTranslations("Programs");
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [tab, setTab] = useState<"colleges" | "institution">("colleges");
  const programsListRef = useRef<HTMLDivElement>(null);

  const [listData, setListData] = useState<CollegeBlock[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialListFetchDone, setIsInitialListFetchDone] = useState(false);

  const LIMIT = 50;

  const { data: mainProgramsResponse, loading: mainLoading } =
    useFetch<ProgramListResponse>(
      `${API_URL}/website/programs?page=1&limit=1`,
      locale
    );

  const mainProgramInfo = mainProgramsResponse?.data?.[0] ?? null;

  const tabToCollegeType = (t: "colleges" | "institution"): CollegeType =>
    t === "colleges" ? "COLLEGE" : "INSTITUTE";

  const getDepartments = (b: CollegeBlock): Department[] => {
    const fromCollege = Array.isArray(b?.college?.departments)
      ? b.college.departments
      : [];
    const fromTop = Array.isArray(b?.departments) ? b.departments : [];
    return fromCollege.length ? fromCollege : fromTop;
  };

  const fetchPrograms = async (pageNum: number, type: CollegeType) => {
    if (pageNum > 1) {
      setIsLoadingMore(true);
    } else {
      setIsInitialListFetchDone(false);
    }

    try {
      const res = await fetch(
        `${API_URL}/website/programs/departments-by-college?college_type=${type}&limit=${LIMIT}&page=${pageNum}`,
        {
          headers: {
            "website-language": locale || "en",
          },
        }
      );
      if (!res.ok)
        throw new Error(
          `Failed to fetch programs list (page ${pageNum}, type ${type})`
        );
      const newData: CollegeBlock[] = await res.json();

      setListData((prev) => {
        const next = pageNum === 1 ? newData : [...prev, ...newData];
        const seen = new Set<number>();
        return next.filter((blk) => {
          const id = blk?.college?.id ?? -1;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
      });

      setHasMore(Array.isArray(newData) && newData.length === LIMIT);
    } catch (error) {
      console.error("Failed to fetch programs", error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
      setIsInitialListFetchDone(true);
    }
  };

  useEffect(() => {
    setListData([]);
    setPage(1);
    setHasMore(true);
    void fetchPrograms(1, tabToCollegeType(tab));
  }, [tab]);

  const handleLoadMore = () => {
    if (!hasMore || isLoadingMore) return;
    const next = page + 1;
    setPage(next);
    void fetchPrograms(next, tabToCollegeType(tab));
  };

  const handleScrollToPrograms = () => {
    programsListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isHeaderLoading = mainLoading && !mainProgramInfo;

  return (
    <div className="my-10 flex_center w-full flex-col">
      <div className="max-w-[1040px] w-full flex_center flex-col gap-10 lg:px-0 px-3">
        <div className="w-full flex_start">
          <SubHeader title={t("head")} alt={false} />
        </div>

        {isHeaderLoading ? (
          <HeaderSkeleton />
        ) : (
          mainProgramInfo && (
            <div className="w-full bg-primary text-white md:p-10 p-5 flex justify-between md:flex-row flex-col items-start rounded-3xl md:gap-5 gap-10">
              <div className="flex_start md:flex-col flex-row md:flex-nowrap flex-wrap gap-5 md:max-w-[350px] max-w-full">
                {mainProgramInfo?.description && (
                  <p className="font-medium md:text-sm text-xs md:mb-0 mb-3 tracking-wide">
                    {mainProgramInfo.description}
                  </p>
                )}
                <div className="flex gap-6">
                  {mainProgramInfo?.college_number && (
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">
                        {mainProgramInfo.college_number}
                      </span>
                      <small className="opacity-80">{t("colleges")}</small>
                    </div>
                  )}
                  {mainProgramInfo?.institute_number && (
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">
                        {mainProgramInfo.institute_number}
                      </span>
                      <small className="opacity-80">{t("institution")}</small>
                    </div>
                  )}
                </div>
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
                {mainProgramInfo?.bg_image?.lg ? (
                  <Image
                    src={mainProgramInfo.bg_image.lg}
                    alt={mainProgramInfo?.title || "Programs"}
                    fill
                    priority
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 rounded-2xl" />
                )}
              </div>
            </div>
          )
        )}
      </div>

      <div
        ref={programsListRef}
        className="w-full bg-backgroundSecondary flex_center flex-col pt-10 mt-10"
      >
        <div className="max-w-[1040px] w-full flex_center flex-col gap-10 lg:px-0 px-3">
          <div className="flex justify-center items-center sm:w-[500px] w-full md:h-[50px] h-[36px] relative bg-lightBorder rounded-2xl overflow-hidden gap-5">
            <span
              className={`bg-primary duration-300 absolute ltr:left-0 rtl:right-0 top-0 w-1/2 h-full rounded-2xl transition-all ${
                tab === "colleges"
                  ? "ltr:left-0 rtl:right-0"
                  : "ltr:left-1/2 rtl:right-1/2"
              }`}
            />
            <button
              type="button"
              onClick={() => setTab("colleges")}
              className={`flex_center w-1/2 md:text-lg text-sm z-10 text-center h-full ${
                tab === "colleges" ? "text-white" : "text-secondary opacity-70"
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

          {!isInitialListFetchDone ? (
            <CardGridSkeleton />
          ) : listData.length > 0 ? (
            <>
              {listData.map((block, index) => {
                const college = block?.college;
                if (!college) return null;

                const title = college.title || "";
                const logo = college.logo?.lg || college.logo?.original || "";
                const departments = getDepartments(block);

                return (
                  <div
                    key={college.id}
                    className="w-full flex flex-col items-center"
                  >
                    <h2 className="md:text-xl relative text-lg font-semibold mb-6">
                      <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                      <span className="z-10 relative">{title}</span>
                    </h2>

                    <div
                      className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 w-full pb-10 ${
                        index < listData.length - 1 &&
                        "border-b border-b-lightBorder"
                      }`}
                    >
                      {departments.map((dept) => {
                        const deptLink = `/${locale}/colleges/${college.subdomain}/departments/${dept.slug}`;

                        return (
                          <div
                            key={dept.id}
                            className="relative border border-lightBorder rounded-2xl p-2 flex_center flex-col gap-3 text-center"
                          >
                            <Link
                              href={deptLink}
                              className="w-full h-[165px] relative overflow-hidden rounded-2xl group"
                            >
                              <div className="text-secondary bg-white h-5 w-5 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                <IoArrowForwardOutline className="rtl:rotate-180" />
                              </div>

                              {logo ? (
                                <Image
                                  src={logo}
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  alt={dept.title}
                                  fill
                                  priority
                                />
                              ) : (
                                <div className="w-full h-full bg-white/50" />
                              )}
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
                                    {dept.student_number || "-"}
                                  </small>
                                  <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                                    Students
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {hasMore && (
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
            </>
          ) : (
            <p className="text-center text-gray-500 pb-10">
              {t("no_programs_list") ?? "No programs found."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramsClient;
