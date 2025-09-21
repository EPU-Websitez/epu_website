"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CiMail } from "react-icons/ci";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import useFetch from "@/libs/hooks/useFetch";
import InternationalRelationsHeader from "@/components/InternationalRelationsHeader";

// -------- Interfaces --------

interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface Teacher {
  id: number;
  user_id: number;
  full_name: string;
  title: string;
  profile_image: Image | null;
}

interface StaffItem {
  id: number;
  role_in_international_relations: string;
  teacher: Teacher;
}

interface StaffResponse {
  total: number;
  page: number;
  limit: number;
  data: StaffItem[];
}

// -------- Skeleton Component for Dynamic Content --------

const StaffCardSkeleton = () => (
  <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder p-4 animate-pulse">
    <div className="sm:w-[120px] w-[80px] sm:h-[120px] h-[80px] bg-gray-300 rounded-full"></div>
    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="w-full h-14 border-t border-t-lightBorder flex_center">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("International");
  const params = useParams();
  const searchParams = useSearchParams();

  const locale = params?.locale as string;
  const id = searchParams.get("id");

  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data: staffData,
    loading,
    error,
  } = useFetch<StaffResponse>(
    id
      ? `${process.env.NEXT_PUBLIC_API_URL}/website/international-relations/international-relation/${id}/staff?page=${page}&limit=${limit}`
      : "",
    locale
  );

  useEffect(() => {
    if (staffData?.data) {
      if (page === 1) {
        setStaff(staffData.data);
      } else {
        setStaff((prev) => [...prev, ...staffData.data]);
      }
    }
  }, [staffData]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const getStaffImage = (item: StaffItem) => {
    return (
      item.teacher?.profile_image?.lg ||
      item.teacher?.profile_image?.md ||
      item.teacher?.profile_image?.original ||
      `/images/president-alt.png` // Fallback image
    );
  };

  // Guard clause for error or missing ID
  if (error && page === 1) {
    return (
      <div className="w-full flex_center my-20">
        <p className="text-red-500">{t("error_loading_data")}</p>
      </div>
    );
  }
  if (!id) {
    return (
      <div className="w-full flex_center my-20">
        <p className="text-red-500">{t("missing_id")}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("international_relations")} alt={false} />
        <InternationalRelationsHeader />
        <h2 className="relative sm:text-titleNormal text-lg text-secondary font-semibold ">
          <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
          <span className="z-10 relative">{t("office_staff")}</span>
        </h2>

        {/* Dynamic Grid for Staff */}
        <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 gap-5 text-secondary text-center">
          {loading && page === 1 ? (
            Array.from({ length: limit }).map((_, i) => (
              <StaffCardSkeleton key={i} />
            ))
          ) : staff.length > 0 ? (
            staff.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder overflow-hidden"
              >
                <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center flex-shrink-0">
                  <Link
                    href={`/${locale}/academic-staff/${item.teacher.id}`}
                    title={item.teacher.full_name}
                    className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative"
                  >
                    <Image
                      src={getStaffImage(item)}
                      alt={item.teacher.full_name}
                      fill
                      priority
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.svg";
                      }}
                    />
                  </Link>
                </div>
                <div className="flex_center flex-col gap-2 h-full p-5 pt-0">
                  <Link
                    href={`/${locale}/academic-staff/${item.teacher.id}`}
                    title={item.teacher.full_name}
                    className="text-lg font-medium"
                  >
                    {item.teacher.full_name}
                  </Link>
                  <span className="opacity-80 text-sm">
                    {item.role_in_international_relations}
                  </span>
                </div>
                {/* Note: The API does not provide an email, so this section is omitted to avoid showing incorrect data. */}
                <Link
                  href={`/${locale}/academic-staff/${item.teacher.id}`}
                  title={item.teacher.full_name}
                  className="flex_center gap-3 w-full py-5 px-5 border-t border-t-lightBorder text-gray-400"
                >
                  <span className="text-sm opacity-80">{t("read_more")}</span>
                </Link>
                {/* <div className="flex_center gap-3 w-full py-5 px-5 border-t border-t-lightBorder text-gray-400">
                  <CiMail className="text-xl" />
                  <span className="text-sm opacity-80">
                    {t("email_not_available")}
                  </span>
                </div> */}
              </div>
            ))
          ) : (
            <div className="col-span-full w-full text-center py-10">
              <p>{t("no_staff_found")}</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {staffData && staff.length < staffData.total && (
          <div className="flex_center w-full my-5">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? t("loading") : t("see_more")}
            </button>
          </div>
        )}

        {/* Error State for Load More */}
        {error && page > 1 && (
          <div className="text-red-500 text-center w-full">
            {t("error_loading_data")}
          </div>
        )}

        {/* Mobile Navigation */}
        <div className="sm:hidden flex justify-start items-start flex-col gap-4 flex-shrink-0 w-full">
          <Link
            href={`/${locale}/international-relations?id=${id}`}
            title={t("about")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-80 border-lightBorder"
          >
            <span>{t("about")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/directory-structure?id=${id}`}
            title={t("directory_structure")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-80 border-lightBorder"
          >
            <span>{t("directory_structure")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/news?id=${id}`}
            title={t("news")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("news")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <div className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
            <span>{t("office_staff")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </div>
          {/* <Link
            href={`/${locale}/international-relations/contact?id=${id}`}
            title={t("contact")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-80 border-lightBorder"
          >
            <span>{t("contact")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link> */}
        </div>
      </div>
    </div>
  );
};
export default Page;
