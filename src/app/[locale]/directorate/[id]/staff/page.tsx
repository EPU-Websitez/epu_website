"use client";

import DirectorateHeader from "@/components/DirectorateHeader";
import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiMinus } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import useFetch from "@/libs/hooks/useFetch";
import Image from "next/image";
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

interface DirectorateChild {
  id: number;
  slug: string;
  directorate_type: {
    name: string;
  };
}

interface DirectorateDetail {
  children: DirectorateChild[];
}
interface DirectorateParentInfo {
  id: number;
  parent_id: number | null;
  parent?: {
    slug: string;
  };
  directorate_type: {
    name: string;
  };
}

// -------- Skeleton Component --------
const ContentSkeleton = () => (
  <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse animate-pulse">
    {/* Sidebar Skeleton */}
    <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-[250px] w-full">
      <div className="h-12 w-full bg-gray-200 rounded-3xl"></div>
      <div className="h-12 w-full bg-gray-200 rounded-3xl"></div>
      <div className="h-12 w-full bg-gray-200 rounded-3xl"></div>
      <div className="h-12 w-full bg-gray-200 rounded-3xl"></div>
    </div>
    {/* Main Content Skeleton */}
    <div className="lg:border-l border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
      <div className="h-10 w-1/3 bg-gray-200 rounded-full"></div>
      <div className="w-full h-48 bg-gray-200 rounded-3xl"></div>
      <div className="grid w-full lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-8">
        <div className="h-40 w-full bg-gray-200 rounded-3xl"></div>
        <div className="h-40 w-full bg-gray-200 rounded-3xl"></div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Directorate");
  const params = useParams();
  const locale = params?.locale as string;
  const id = params?.id as string; // This is the slug

  const [staffIsOpen, setStaffIsOpen] = useState(false);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [staffPage, setStaffPage] = useState(1);
  const [totalStaff, setTotalStaff] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parent_id"); // This can be string or null
  const handleOpenStaff = () => {
    setStaffIsOpen(!staffIsOpen);
  };
  // Fetch parent info for sidebar navigation
  const { data: directorateInfo } = useFetch<DirectorateParentInfo>(
    id ? `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}` : "",
    locale
  );

  // Fetch data for the lead member
  const { data: leadsData, loading: leadsLoading } = useFetch<LeadsResponse>(
    id
      ? `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}/leads?page=1&limit=1`
      : "",
    locale
  );

  // Manually handle fetching for paginated staff list
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchStaff(1);
    }
  }, [id]);

  const fetchStaff = async (page: number) => {
    if (page > 1) setIsLoadingMore(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}/staff?page=${page}&limit=4`,
        {
          headers: {
            "website-language": locale || "en",
          },
        }
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
    const nextPage = staffPage + 1;
    setStaffPage(nextPage);
    fetchStaff(nextPage);
  };

  const leadMember = leadsData?.data?.[0];
  const parentTitle = directorateInfo?.directorate_type?.name || id;

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        {!isLoading && <SubHeader title={parentTitle} alt={false} />}
        <DirectorateHeader />
        <div className="flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            {isLoading ? (
              <ContentSkeleton />
            ) : (
              <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
                <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-[250px] w-full">
                  <Link
                    href={`/${locale}/directorate/${id}?parent_id=${parentId}`}
                    title={t("about")}
                    className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                  >
                    <span>{t("about")}</span>
                    <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                  </Link>
                  <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                    <span>{t("staff")}</span>
                    <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                  </div>
                  <SubUnits />
                  <Link
                    href={`/${locale}/directorate/${id}/news?parent_id=${parentId}`}
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
                    <span className="z-10 relative">{t("staff")}</span>
                  </h2>

                  {leadMember && (
                    <Link
                      href={`/${locale}/academic-staff/${leadMember?.teacher?.id}`}
                      title={leadMember.teacher?.full_name}
                      className="flex justify-start items-center sm:gap-10 gap-5 w-full border p-5 rounded-3xl border-lightBorder"
                    >
                      <div className="sm:w-[200px] w-[125px] sm:h-[190px] h-[125px] relative flex-shrink-0">
                        <Image
                          src={
                            leadMember.teacher?.profile_image?.lg ||
                            leadMember.teacher?.profile_image?.original ||
                            "/images/placeholder.svg"
                          }
                          alt={leadMember.teacher?.full_name}
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
                          {leadMember.role}
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
                        key={member.teacher.id}
                        description={member.role}
                        image={member?.teacher?.profile_image?.lg}
                        link={`/${locale}/academic-staff/${member.teacher.id}`}
                        staticText={t("view_profile")}
                        title={member.teacher.full_name}
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
                        {isLoadingMore ? t("loading") : t("see_more")}
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
