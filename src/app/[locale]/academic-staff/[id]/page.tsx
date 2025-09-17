"use client";
import AcademicStaffHeader from "@/components/AcademicStaffHeader";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaFacebookF, FaGoogleScholar, FaResearchgate } from "react-icons/fa6";
import { HiOutlineLink } from "react-icons/hi2";
import { IoMdArrowUp } from "react-icons/io";

interface ImageType {
  lg: string;
}
interface AcademicStaff {
  id: number;
  full_name: string;
  title: string;
  general_spec: string;
  specific_spec: string;
  biography: string;
  profile_image: ImageType;
  bg_image: ImageType;
}

const Skeleton = () => (
  <div className="w-full flex flex-col gap-4 animate-pulse">
    <div className="w-full h-[276px] bg-gray-300 rounded-2xl"></div>
    <div className="w-[115px] h-[115px] sm:w-[215px] sm:h-[215px] bg-gray-300 rounded-full -mt-[100px] mx-auto"></div>
    <div className="h-6 w-40 bg-gray-300 rounded mt-4 mx-auto"></div>
    <div className="h-4 w-80 bg-gray-200 rounded mx-auto"></div>
    <div className="h-40 w-full bg-gray-100 rounded mt-6"></div>
  </div>
);

const Page = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;

  const { data, loading } = useFetch<AcademicStaff>(
    `${API_URL}/website/teachers/${id}`,
    locale
  );

  const biography = data?.biography || "Biography not available.";
  const generalSpec = data?.general_spec || "Civil Engineering";
  const specificSpec =
    data?.specific_spec || "Transportation Planning and Design";

  return (
    <div className="flex_center w-full flex-col">
      <AcademicStaffHeader />
      {/* Tabs */}
      <div className="mt-14 w-full flex_center flex-col text-secondary">
        <div className="max-w-[1024px] w-full flex_start sm:gap-5 gap-3 overflow-x-auto hide_scroll sm:px-0 px-5">
          <p className="border-b border-b-secondary px-3 sm:text-base text-xs flex-shrink-0 font-medium">
            {t("about")}
          </p>
          <Link
            href={`/${locale}/academic-staff/${id}/teaching`}
            className="opacity-70 px-3 sm:text-base text-xs flex-shrink-0"
          >
            {t("teaching")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/education`}
            className="opacity-70 px-3 sm:text-base text-xs flex-shrink-0"
          >
            {t("education")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/professional-engagement`}
            className="opacity-70 px-3 sm:text-base text-xs flex-shrink-0"
          >
            {t("professional_engagement")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/academics`}
            className="opacity-70 px-3 sm:text-base text-xs flex-shrink-0"
          >
            {t("academics")}
          </Link>
        </div>

        {/* Main Bio Section */}
        {loading && !data ? (
          <Skeleton />
        ) : (
          <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            <div className="mt-10 flex_start lg:flex-row flex-col gap-10 max-w-[1024px] w-full px-2">
              <div className="bg-background p-4 rounded-3xl gap-5 lg:max-w-[335px] w-full flex_start lg:flex-col flex-row flex-wrap">
                <div className="flex_start flex-col gap-2">
                  <span className="text-xs text-black text-opacity-60">
                    {t("general_specialization")}
                  </span>
                  <p className="text-sm font-medium">{generalSpec}</p>
                </div>
                {/* <div className="sm:hidden flex flex-col gap-2">
                  <span className="text-xs text-black text-opacity-60">
                    {t("curriculum_vitae")}
                  </span>
                  <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                    <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                      <HiOutlineLink />
                    </span>
                    <span>botancv.PDF</span>
                  </button>
                </div> */}
                <div className="flex_start flex-col gap-2">
                  <span className="text-xs text-black text-opacity-60">
                    {t("specific_specialization")}
                  </span>
                  <p className="text-sm font-medium">{specificSpec}</p>
                </div>
                {/* <div className="flex_start flex-col gap-2">
                  <span className="text-xs text-black text-opacity-60">
                    {t("lecturer_at")}
                  </span>
                  <p className="text-sm font-medium">
                    Erbil Technology College - Department of Road Construction
                  </p>
                </div> */}
                {/* <div className="sm:flex hidden flex-col gap-2">
                  <span className="text-xs text-black text-opacity-60">
                    {t("curriculum_vitae")}
                  </span>
                  <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                    <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                      <HiOutlineLink />
                    </span>
                    <span>botancv.PDF</span>
                  </button>
                </div> */}
              </div>

              <div className="flex_start flex-col gap-8">
                <h2 className="sm:text-2xl text-lg font-semibold">
                  {t("biography")}
                </h2>
                <p className="lg:text-lg sm:text-base text-xs text-black opacity-60 tracking-normal text-justify lg:max-w-[635px] max-w-full">
                  {biography}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
