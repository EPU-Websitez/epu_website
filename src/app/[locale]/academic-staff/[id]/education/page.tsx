"use client";
import Breadcrumb from "@/components/breadcrumb";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaFacebookF, FaGoogleScholar, FaResearchgate } from "react-icons/fa6";
import { GoBriefcase } from "react-icons/go";
import { HiOutlineLink } from "react-icons/hi2";
import { IoMdArrowUp } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const Page = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;

  const [tab, setTab] = useState("qualifications");
  const handleTab = (e: string) => {
    setTab(e);
  };

  return (
    <div className="flex_center w-full flex-col">
      <div className="max-w-[1380px] w-full relative flex_center flex-col gap-5 sm:px-2 px-5 text-secondary">
        <div className="relative w-full h-[276px]">
          <div className="absolute ltr:left-5 rtl:right-5 top-5 z-10">
            <Breadcrumb title="" alt={false} />
          </div>
          <Image
            src="/images/academic-bg.png"
            alt="title"
            fill
            priority
            className="w-full h-auto rounded-2xl"
          />
        </div>
        <div className="flex_start lg:w-[1024px] w-auto absolute lg:left-1/2 md:left-[12%] sm:left-[18%] left-[22%] -translate-x-1/2 sm:top-[180px] top-[220px]">
          <div className="sm:w-[215px] w-[115px] sm:h-[215px] h-[115px] flex_center relative rounded-full bg-white">
            <div className="flex_center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-[200px] w-[100px] sm:h-[200px] h-[100px] rounded-full">
              <Image
                src="/images/president-alt.png"
                alt="title"
                fill
                priority
                className="w-full h-auto object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="flex_start max-w-[1024px] px-2 sm:mt-32 mt-16 w-full flex-col gap-4">
          <span className="text-sm font-medium">
            Assistant Professor Doctor
          </span>
          <h3 className="text-xl font-semibold">Kayhan Zrar Ghafoor</h3>
          <div className="flex w-full justify-between lg:items-center items-start lg:gap-2 gap-6 mt-3 lg:flex-row flex-col">
            <div className="flex sm:justify-center justify-start sm:items-center items-start gap-3 sm:flex-row flex-col">
              <div className="flex_center gap-3 rounded-xl border-golden border text-golden px-3 py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden text-sm"></span>
                <p className="text-sm">Vice President for Scientific</p>
              </div>
              <div className="flex_center gap-3 rounded-xl border-golden border text-golden px-3 py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden text-sm"></span>
                <p className="text-sm"> Postgraduate Affairs</p>
              </div>
            </div>
            <div className="flex sm:justify-center justify-start sm:items-center items-start gap-3 sm:flex-nowrap flex-wrap">
              <Link
                href=""
                className="flex_center gap-2 rounded-xl sm:px-3 px-2 py-1.5 border border-lightBorder text-sm"
              >
                <span>Academic Staff Portal</span>
                <IoMdArrowUp className="rotate-45" />
              </Link>
              <a
                href=""
                className="rounded-xl sm:px-3 px-2 py-1.5 border border-lightBorder text-sm"
              >
                botan@epu.edu.iq
              </a>
              <a
                href=""
                className="rounded-full flex_center w-10 h-10 border border-lightBorder hover:bg-lightBorder"
              >
                <FaFacebookF />
              </a>
              <a
                href=""
                className="rounded-full flex_center w-10 h-10 border border-lightBorder hover:bg-lightBorder"
              >
                <FaGoogleScholar />
              </a>
              <a
                href=""
                className="rounded-full flex_center w-10 h-10 border border-lightBorder hover:bg-lightBorder"
              >
                <FaResearchgate />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-14 w-full flex_center flex-col text-secondary">
        <div className="max-w-[1024px] w-full flex_start sm:gap-5 gap-3 overflow-x-auto hide_scroll sm:px-0 px-5">
          <Link
            href={`/${locale}/academic-staff/${id}`}
            title={t("about")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("about")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/teaching`}
            title={t("teaching")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("teaching")}
          </Link>
          <p className="border-b border-b-secondary px-3 sm:text-base text-sm flex-shrink-0 font-medium">
            {t("education")}
          </p>
          <Link
            href={`/${locale}/academic-staff/${id}/professional-engagement`}
            title={t("professional_engagement")}
            className=" opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("professional_engagement")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/academics`}
            title={t("academics")}
            className="  opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("academics")}
          </Link>
        </div>
        <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              <button
                type="button"
                onClick={() => handleTab("qualifications")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[40px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-lg ${
                  tab === "qualifications"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span className="text-sm">{t("qualifications")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180 text-xl" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("experience")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[40px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-lg ${
                  tab === "experience"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span className="text-sm">{t("experience")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180 text-xl" />
              </button>
            </div>
            {tab === "qualifications" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("qualifications")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-10 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-5 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center">
                        <div className="h-6 w-6 relative">
                          <Image
                            src="/images/education.svg"
                            alt="title"
                            fill
                            priority
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                      <div className="flex_start flex-col lg:gap-0 gap-1">
                        <h4 className="font-medium text-sm">
                          University Of Mosul
                        </h4>
                        <span className="text-black opacity-60 text-xs">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                      <div className="flex_start flex-col lg:w-1/2 w-full">
                        <span className="text-black opacity-60 text-xs">
                          Degree
                        </span>
                        <p className="lg:text-sm text-xs">
                          Bachelor Of Science
                        </p>
                      </div>
                      <div className="flex_start flex-col lg:w-1/2 w-full">
                        <span className="text-black opacity-60 text-xs">
                          Department
                        </span>
                        <p className="lg:text-sm text-xs">Civil Engineering</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-5 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center">
                        <div className="h-6 w-6 relative">
                          <Image
                            src="/images/education.svg"
                            alt="title"
                            fill
                            priority
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                      <div className="flex_start flex-col lg:gap-0 gap-1">
                        <h4 className="font-medium text-sm">
                          University Of Mosul
                        </h4>
                        <span className="text-black opacity-60 text-xs">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                      <div className="flex_start flex-col lg:w-1/2 w-full">
                        <span className="text-black opacity-60 text-xs">
                          Degree
                        </span>
                        <p className="lg:text-sm text-xs">
                          Bachelor Of Science
                        </p>
                      </div>
                      <div className="flex_start flex-col lg:w-1/2 w-full">
                        <span className="text-black opacity-60 text-xs">
                          Department
                        </span>
                        <p className="lg:text-sm text-xs">Civil Engineering</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-5 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center">
                        <div className="h-6 w-6 relative">
                          <Image
                            src="/images/education.svg"
                            alt="title"
                            fill
                            priority
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                      <div className="flex_start flex-col lg:gap-0 gap-1">
                        <h4 className="font-medium text-sm">
                          University Of Mosul
                        </h4>
                        <span className="text-black opacity-60 text-xs">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                      <div className="flex_start flex-col lg:w-1/2 w-full">
                        <span className="text-black opacity-60 text-xs">
                          Degree
                        </span>
                        <p className="lg:text-sm text-xs">
                          Bachelor Of Science
                        </p>
                      </div>
                      <div className="flex_start flex-col lg:w-1/2 w-full">
                        <span className="text-black opacity-60 text-xs">
                          Department
                        </span>
                        <p className="lg:text-sm text-xs">Civil Engineering</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab === "experience" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("experience")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-5 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center">
                        <GoBriefcase className="text-white text-xl" />
                      </div>
                      <div className="flex_start flex-col lg:gap-0 gap-1">
                        <h4 className="font-medium text-sm">
                          University Of Mosul
                        </h4>
                        <span className="text-black opacity-60 text-xs">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          Scientific Title
                        </span>
                        <p className="lg:text-sm text-xs">
                          Bachelor Of Science
                        </p>
                      </div>
                    </div>
                  </div>
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
