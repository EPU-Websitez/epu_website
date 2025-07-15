"use client";
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
    `${API_URL}/website/teachers/${id}`
  );

  const fullName = data?.full_name || "Kayhan Zrar Ghafoor";
  const title = data?.title || "Assistant Professor Doctor";
  const biography = data?.biography || "Biography not available.";
  const profileImage = data?.profile_image?.lg || "/images/president-alt.png";
  const bgImage = data?.bg_image?.lg || "/images/academic-bg.png";
  const generalSpec = data?.general_spec || "Civil Engineering";
  const specificSpec =
    data?.specific_spec || "Transportation Planning and Design";

  if (loading && !data) return <Skeleton />;

  return (
    <div className="flex_center w-full flex-col">
      <div className="max-w-[1380px] w-full relative flex_center flex-col gap-5 sm:px-2 px-5 text-secondary">
        <div className="relative w-full h-[276px]">
          <Image
            src={bgImage}
            alt={fullName}
            fill
            priority
            className="w-full h-auto rounded-2xl object-cover"
          />
        </div>
        <div className="flex_start lg:w-[1024px] w-auto absolute lg:left-1/2 md:left-[12%] sm:left-[18%] left-[22%] -translate-x-1/2 sm:top-[150px] top-[220px]">
          <div className="sm:w-[215px] w-[115px] sm:h-[215px] h-[115px] flex_center relative rounded-full bg-white">
            <div className="flex_center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-[200px] w-[100px] sm:h-[200px] h-[100px] rounded-full">
              <Image
                src={profileImage}
                alt={fullName}
                fill
                priority
                className="w-full h-auto object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="flex_start max-w-[1024px] px-2 sm:mt-32 mt-16 w-full flex-col gap-4">
          <span className="text-sm font-medium">{title}</span>
          <h3 className="sm:text-xl text-lg font-medium">{fullName}</h3>
          <div className="flex w-full justify-between lg:items-center items-start lg:gap-2 gap-6 mt-3 lg:flex-row flex-col">
            <div className="flex sm:justify-center justify-start sm:items-center items-start gap-3 sm:flex-row flex-col">
              <div className="flex_center gap-3 sm:rounded-xl rounded-lg border-golden border text-golden sm:px-3 px-2 sm:text-base text-sm py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden text-sm"></span>
                <p className="text-sm">Vice President for Scientific</p>
              </div>
              <div className="flex_center gap-3 sm:rounded-xl rounded-lg border-golden border text-golden sm:px-3 px-2 sm:text-base text-sm py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden"></span>
                <p className="text-sm"> Postgraduate Affairs</p>
              </div>
            </div>
            <div className="flex sm:justify-center justify-start sm:items-center items-start sm:flex-row flex-col gap-3 sm:flex-nowrap flex-wrap">
              <Link
                href=""
                className="flex_center gap-2 sm:rounded-xl rounded-lg sm:px-3 px-2 py-1.5 border border-lightBorder text-sm"
              >
                <span>Academic Staff Portal</span>
                <IoMdArrowUp className="rotate-45" />
              </Link>
              <a
                href=""
                className="sm:rounded-xl rounded-lg sm:px-3 px-2 py-1.5 border border-lightBorder text-sm"
              >
                botan@epu.edu.iq
              </a>
              <div className="flex_start gap-3">
                <a
                  href=""
                  className="rounded-full sm:text-base text-sm flex_center sm:w-10 w-8 sm:h-10 h-8 border border-lightBorder hover:bg-lightBorder"
                >
                  <FaFacebookF />
                </a>
                <a
                  href=""
                  className="rounded-full sm:text-base text-sm flex_center sm:w-10 w-8 sm:h-10 h-8 border border-lightBorder hover:bg-lightBorder"
                >
                  <FaGoogleScholar />
                </a>
                <a
                  href=""
                  className="rounded-full sm:text-base text-sm flex_center sm:w-10 w-8 sm:h-10 h-8 border border-lightBorder hover:bg-lightBorder"
                >
                  <FaResearchgate />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="mt-10 flex_start lg:flex-row flex-col gap-10 max-w-[1024px] w-full px-2">
            <div className="bg-background p-4 rounded-3xl gap-5 lg:max-w-[335px] w-full flex_start flex-col">
              <div className="flex_start flex-col gap-2">
                <span className="text-xs text-black text-opacity-60">
                  {t("general_specialization")}
                </span>
                <p className="text-sm sm:font-semibold font-medium">
                  {generalSpec}
                </p>
              </div>
              <div className="sm:hidden flex flex-col gap-2">
                <span className="text-xs text-black text-opacity-60">
                  {t("curriculum_vitae")}
                </span>
                <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                  <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                    <HiOutlineLink />
                  </span>
                  <span>botancv.PDF</span>
                </button>
              </div>
              <div className="flex_start flex-col gap-2">
                <span className="text-xs text-black text-opacity-60">
                  {t("specific_specialization")}
                </span>
                <p className="text-sm sm:font-semibold font-medium">
                  {specificSpec}
                </p>
              </div>
              <div className="flex_start flex-col gap-2">
                <span className="text-xs text-black text-opacity-60">
                  {t("lecturer_at")}
                </span>
                <p className="text-sm sm:font-semibold font-medium">
                  Erbil Technology College - Department of Road Construction
                </p>
              </div>
              <div className="sm:flex hidden flex-col gap-2">
                <span className="text-xs text-black text-opacity-60">
                  {t("curriculum_vitae")}
                </span>
                <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                  <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                    <HiOutlineLink />
                  </span>
                  <span>botancv.PDF</span>
                </button>
              </div>
            </div>

            <div className="flex_start flex-col gap-8">
              <h2 className="sm:text-2xl text-lg font-semibold">
                {t("biography")}
              </h2>
              <p className="lg:text-lg sm:text-base text-xs sm:text-black text-primary text-opacity-60 tracking-normal text-justify lg:max-w-[635px] max-w-full">
                {biography}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
