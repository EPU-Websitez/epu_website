"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import useFetch from "@/libs/hooks/useFetch";
import DirectorateHeader from "@/components/DirectorateHeader";
import MemberCard from "@/components/memberCard";
import SubUnits from "@/components/SubUnits";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}

interface Teacher {
  id: number;
  full_name: string;
  profile_image: ImageFile;
}

interface LeadItem {
  role: string;
  teacher: Teacher;
}

interface LeadsResponse {
  data: LeadItem[];
}

interface StaffItem {
  role: string;
  teacher: Teacher;
}

interface StaffResponse {
  total: number;
  data: StaffItem[];
}

interface UnitDetail {
  id: number;
  title: string;
  slug: string;
  vision: string;
  mission: string;
  about: string;
  parent_id: number;
  directorate_type: {
    name: string;
  };
  parent: {
    slug: string;
  };
}

// -------- Skeleton Component --------
const ContentSkeleton = () => (
  <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse animate-pulse">
    <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-[250px] w-full">
      <div className="h-12 bg-gray-200 rounded-3xl"></div>
      <div className="h-12 bg-gray-200 rounded-3xl"></div>
      <div className="h-12 bg-gray-200 rounded-3xl"></div>
      <div className="h-12 bg-gray-200 rounded-3xl"></div>
    </div>
    <div className="lg:border-l border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
      <div className="h-10 w-1/2 bg-gray-200 rounded-full"></div>
      <div className="w-full h-40 bg-gray-200 rounded-3xl"></div>
      <div className="h-8 w-1/3 bg-gray-200 rounded-full"></div>
      <div className="w-full h-48 bg-gray-200 rounded-3xl"></div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Directorate");
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params?.locale as string;
  const id = params?.id as string;
  const parentId = searchParams.get("parent_id");

  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [staffPage, setStaffPage] = useState(1);
  const [totalStaff, setTotalStaff] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch unit's main data
  const { data: unitData } = useFetch<UnitDetail>(
    id
      ? `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}?parent_id=${parentId}`
      : "",
    locale
  );

  // Fetch the lead member of this unit
  const { data: leadsData } = useFetch<LeadsResponse>(
    id
      ? `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}/leads?page=1&limit=1`
      : "",
    locale
  );

  // Manually handle paginated staff list
  useEffect(() => {
    if (id) {
      // Don't reset loading if it's just a page change
      if (staffPage === 1) {
        setIsLoading(true);
      }
      fetchStaff(staffPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, staffPage]); // Re-fetch if id or page changes

  const fetchStaff = async (page: number) => {
    if (page > 1) setIsLoadingMore(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}/staff?page=${page}&limit=4`,
        { headers: { "website-language": locale || "en" } }
      );
      const newData: StaffResponse = await res.json();
      if (newData.data) {
        setStaffList((prev) =>
          page === 1 ? newData.data : [...prev, ...newData.data]
        );
        setTotalStaff(newData.total);
      }
    } catch (error) {
      console.error("Failed to fetch staff", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    setStaffPage((prevPage) => prevPage + 1);
  };

  const leadMember = leadsData?.data?.[0];

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={unitData?.title || t("units")} alt={false} />
        <DirectorateHeader />
        <div className="flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            {isLoading || !unitData ? (
              <ContentSkeleton />
            ) : (
              <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
                <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
                  <Link
                    href={
                      unitData?.parent?.slug
                        ? `/${locale}/directorate/${unitData.parent.slug}`
                        : `/${locale}/directorate/${unitData.slug}`
                    }
                    title={t("about")}
                    className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                  >
                    <span>{t("about")}</span>
                    <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                  </Link>
                  <Link
                    href={
                      unitData?.parent?.slug
                        ? `/${locale}/directorate/${unitData.parent.slug}/staff`
                        : `/${locale}/directorate/${unitData.slug}`
                    }
                    title={t("staff")}
                    className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                  >
                    <span>{t("staff")}</span>
                    <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                  </Link>
                  <SubUnits />
                  <Link
                    href={`/${locale}/directorate/${id}/centers?parent_id=${parentId}`}
                    title={t("centers")}
                    className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                  >
                    <span>{t("centers")}</span>
                    <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                  </Link>
                  <Link
                    href={`/${locale}/directorate/${id}/news`}
                    title={t("news")}
                    className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                  >
                    <span>{t("news")}</span>
                    <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                  </Link>
                </div>

                <div className="lg:border-l text-secondary border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                  <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
                    <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                    <span className="z-10 relative">
                      {unitData?.title || t("units")}
                    </span>
                  </h2>
                  <div className="p-5 w-full flex_start flex-col gap-5 rounded-3xl border border-lightBorder">
                    <h4 className="sm:text-base text-sm font-semibold">
                      {t("about")}
                    </h4>
                    {/* <p className="opacity-70 sm:text-sm text-xs">
                      {unitData?.about || t("no_description_available")}
                    </p> */}
                    <div
                      className="text-opacity-70 text-secondary text-sm prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: unitData.about,
                      }}
                    />
                  </div>
                  {unitData.mission && (
                    <>
                      <h2 className="relative text-lg font-semibold ">
                        <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                        <span className="z-10 relative">{t("mission")}</span>
                      </h2>
                      <div className="p-5 flex_start flex-col gap-5 rounded-3xl border border-lightBorder w-full">
                        {/* --- FIXED SECTION STARTS HERE --- */}
                        {/* Changed from <p> to <div> and added dangerouslySetInnerHTML */}
                        <div
                          className="text-opacity-70 text-secondary text-sm prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: unitData.mission,
                          }}
                        />
                      </div>
                    </>
                  )}
                  {unitData.vision && (
                    <>
                      <h2 className="relative text-lg font-semibold ">
                        <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                        <span className="z-10 relative">{t("vision")}</span>
                      </h2>
                      <div className="p-5 flex_start flex-col gap-5 rounded-3xl border border-lightBorder w-full">
                        {/* --- FIXED SECTION STARTS HERE --- */}
                        {/* Changed from <p> to <div> and added dangerouslySetInnerHTML */}
                        <div
                          className="text-opacity-70 text-secondary text-sm prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: unitData.vision,
                          }}
                        />
                      </div>
                    </>
                  )}
                  <h2 className="relative text-lg font-semibold ">
                    <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                    <span className="z-10 relative">{t("staff_members")}</span>
                  </h2>

                  {leadMember && (
                    <Link
                      href={`/${locale}/academic-staff/${leadMember?.teacher?.id}`}
                      title={leadMember?.teacher?.full_name}
                      className="flex justify-start items-start sm:gap-10 gap-5 w-full border p-5 rounded-3xl border-lightBorder"
                    >
                      <div className="sm:w-[200px] w-[125px] sm:h-[190px] h-[125px] relative flex-shrink-0">
                        <Image
                          src={
                            leadMember?.teacher?.profile_image?.lg ||
                            leadMember?.teacher?.profile_image?.original ||
                            "/images/placeholder.svg"
                          }
                          alt={leadMember?.teacher?.full_name || "Lead Member"}
                          fill
                          priority
                          className="w-full h-auto object-cover sm:rounded-3xl rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="flex_start flex-col gap-5">
                        <h3 className="text-golden sm:text-lg text-sm font-semibold">
                          {leadMember?.role}
                        </h3>
                        <h1 className="max-w-[250px] lg:text-xl sm:text-lg text-xs font-semibold relative">
                          <span className="relative z-10">
                            {leadMember?.teacher?.full_name}
                          </span>
                          <span className="absolute ltr:left-0 rtl:right-0 -bottom-3 w-[80%] h-6">
                            <Image
                              src="/images/title-shape.svg"
                              alt="shape"
                              fill
                              priority
                              onError={(e) => {
                                e.currentTarget.src = "/images/placeholder.svg";
                              }}
                            />
                          </span>
                        </h1>
                      </div>
                    </Link>
                  )}

                  <div className="grid w-full lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-8">
                    {staffList.map((member) => (
                      <MemberCard
                        key={member?.teacher?.id}
                        description={member?.role || ""}
                        image={
                          member?.teacher?.profile_image?.lg ||
                          member?.teacher?.profile_image?.original ||
                          "/images/placeholder.svg"
                        }
                        link={
                          member?.teacher?.id
                            ? `/${locale}/academic-staff/${member.teacher.id}`
                            : "#"
                        }
                        staticText={t("view_profile")}
                        title={member?.teacher?.full_name || "Staff Member"}
                      />
                    ))}
                  </div>

                  {staffList.length < totalStaff && (
                    <div className="w-full flex_center mt-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="bg-primary text-white px-6 py-2 rounded-full disabled:bg-opacity-70"
                      >
                        {isLoadingMore ? t("loading") : t("load_more")}
                      </button>
                    </div>
                  )}
                  {staffList.length === 0 && !isLoading && (
                    <div className="text-center text-gray-500">
                      {t("no_data_found")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
