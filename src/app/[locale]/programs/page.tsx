"use client";
import ResearchModal from "@/components/researchDetail";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { CiCalendar, CiSearch } from "react-icons/ci";
import {
  FaAngleRight,
  FaChevronDown,
  FaChevronRight,
  FaGraduationCap,
} from "react-icons/fa6";
import { GoBriefcase } from "react-icons/go";
import { IoArrowForwardOutline } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";

const Page = () => {
  const t = useTranslations("Programs");
  const params = useParams();
  const locale = params?.locale as string;
  const [tab, setTab] = useState("colleges");
  const handleTab = (e: string) => {
    setTab(e);
  };

  return (
    <div className="my-10 flex_center w-full flex-col">
      <div className="max-w-[1040px] w-full flex_center flex-col gap-10 lg:px-0 px-3">
        <div className="w-full flex_start">
          <SubHeader title={t("head")} alt={false} />
        </div>
        <div className="w-full bg-primary text-white md:p-10 p-5 flex justify-between md:flex-row flex-col items-start rounded-3xl md:gap-5 gap-10">
          <div className="flex_start md:flex-col flex-row md:flex-nowrap flex-wrap gap-5 md:max-w-[350px] max-w-full">
            <p className="font-medium md:text-sm text-xs md:mb-0 mb-3 tracking-wide">
              {t("text")}
            </p>
            <div className="flex_center gap-3">
              <div className="bg-white text-secondary flex_center md:w-[35px] w-6 md:h-[35px] h-6 md:text-lg text-base rounded-md">
                <FaGraduationCap />
              </div>
              <div className="flex_start flex-col">
                <small className="md:text-xs text-[8px] text-white opacity-75">
                  {t("colleges")}
                </small>
                <p className="md:text-sm text-[10px] font-medium">
                  + 23 Colleges
                </p>
              </div>
            </div>
            <div className="flex_center gap-3">
              <div className="bg-white text-secondary flex_center md:w-[35px] w-6 md:h-[35px] h-6 md:text-lg text-base rounded-md">
                <FaGraduationCap />
              </div>
              <div className="flex_start flex-col">
                <small className="md:text-xs text-[8px] text-white opacity-75">
                  {t("institution")}
                </small>
                <p className="md:text-sm text-[10px] font-medium">
                  + 23 Colleges
                </p>
              </div>
            </div>
            <div className="md:w-auto w-full">
              <Link
                href={""}
                className="mt-5 rounded-3xl md:h-10 h-8 flex_center sm:px-3 px-2 gap-2 bg-white max-w-fit"
              >
                <span className="text-primary font-bold md:text-sm text-xs mx-2">
                  {t("see_programs")}
                </span>
                <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-primary text-white rounded-full">
                  <FaAngleRight className="rtl:rotate-180" />
                </span>
              </Link>
            </div>
          </div>
          <div className="relative md:h-[276px] h-[192px] md:w-[420px] w-full">
            <Image
              src={"/images/graduation.png"}
              alt="My Image"
              fill
              priority
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
      <div className="w-full bg-backgroundSecondary flex_center flex-col pt-10">
        <div className="max-w-[1040px] w-full flex_center flex-col gap-10 lg:px-0 px-3">
          <div className="flex justify-center items-center sm:w-[500px] w-full md:h-[50px] h-[36px] relative bg-lightBorder rounded-2xl overflow-hidden gap-5 md:mt-10 mt-5">
            <span
              className={`bg-primary duration-200 text-white absolute ltr:left-0 rtl:right-0 top-0 w-1/2 h-full rounded-2xl ${
                tab === "colleges"
                  ? "ltr:left-0 rtl:right-0"
                  : "-translate-x-0 ltr:left-1/2 rtl:right-1/2"
              }`}
            ></span>
            <button
              type="button"
              onClick={() => handleTab("colleges")}
              className={`flex_center w-1/2 md:text-lg text-sm z-10 text-center h-full ${
                tab === "colleges" ? "text-white" : "text-secondary opacity-70"
              }`}
            >
              {t("colleges")}
            </button>
            <button
              type="button"
              onClick={() => handleTab("institution")}
              className={`flex_center w-1/2 md:text-lg text-sm z-10 text-center h-full ${
                tab === "institution"
                  ? "text-white"
                  : "text-secondary opacity-70"
              }`}
            >
              {t("institution")}
            </button>
          </div>
          <h2 className="md:text-xl relative text-lg font-semibold ">
            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
            <span className="z-10 relative">
              {t("erbil_technical_engineering_college")}
            </span>
          </h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 w-full border-b border-b-lightBorder pb-10">
            <div className="relative border border-lightBorder rounded-2xl p-2 flex_center flex-col gap-3 text-center">
              <Link
                href={""}
                className="w-full h-[165px] relative overflow-hidden rounded-2xl"
              >
                <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                  <IoArrowForwardOutline className="rtl:rotate-180" />
                </div>
                <Image
                  src={`/images/campus.png`}
                  className="object-cover"
                  alt="park"
                  fill
                  priority
                />
              </Link>
              <Link href={""} className="sm:text-sm text-[10px] font-semibold">
                Architectural Engineering Department
              </Link>
              <div className="flex_center gap-8 w-full">
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <GoBriefcase />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-medium sm:text-[10px] text-[8px]">
                      +12.4 K
                    </small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Teachers
                    </small>
                  </div>
                </div>
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <PiStudent />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-medium sm:text-[10px] text-[8px]">
                      +12.4 K
                    </small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Alumni
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative border border-lightBorder rounded-3xl p-2 flex_center flex-col gap-3 text-center">
              <Link
                href={""}
                className="w-full h-[165px] relative overflow-hidden rounded-3xl"
              >
                <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                  <IoArrowForwardOutline className="rtl:rotate-180" />
                </div>
                <Image
                  src={`/images/campus.png`}
                  className="object-cover"
                  alt="park"
                  fill
                  priority
                />
              </Link>
              <Link href={""} className="sm:text-sm text-[10px] font-semibold">
                Architectural Engineering Department
              </Link>
              <div className="flex_center gap-8 w-full">
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <GoBriefcase />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-medium sm:text-[10px] text-[8px]">
                      +12.4 K
                    </small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Teachers
                    </small>
                  </div>
                </div>
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <PiStudent />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-medium text-xs">+12.4 K</small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Alumni
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2 className="md:text-xl relative text-lg font-semibold ">
            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
            <span className="z-10 relative">
              Erbil Technical Health & Medical College
            </span>
          </h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 w-full">
            <div className="relative border border-lightBorder rounded-2xl p-2 flex_center flex-col gap-3 text-center">
              <Link
                href={""}
                className="w-full h-[165px] relative overflow-hidden rounded-2xl"
              >
                <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                  <IoArrowForwardOutline className="rtl:rotate-180" />
                </div>
                <Image
                  src={`/images/campus.png`}
                  className="object-cover"
                  alt="park"
                  fill
                  priority
                />
              </Link>
              <Link href={""} className="sm:text-sm text-[10px] font-semibold">
                Architectural Engineering Department
              </Link>
              <div className="flex_center gap-8 w-full">
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <GoBriefcase />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-medium sm:text-[10px] text-[8px]">
                      +12.4 K
                    </small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Teachers
                    </small>
                  </div>
                </div>
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <PiStudent />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-medium sm:text-[10px] text-[8px]">
                      +12.4 K
                    </small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Alumni
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative border border-lightBorder rounded-3xl p-2 flex_center flex-col gap-3 text-center">
              <Link
                href={""}
                className="w-full h-[165px] relative overflow-hidden rounded-3xl"
              >
                <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                  <IoArrowForwardOutline className="rtl:rotate-180" />
                </div>
                <Image
                  src={`/images/campus.png`}
                  className="object-cover"
                  alt="park"
                  fill
                  priority
                />
              </Link>
              <Link href={""} className="sm:text-sm text-[10px] font-semibold">
                Architectural Engineering Department
              </Link>
              <div className="flex_center gap-8 w-full">
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <GoBriefcase />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-medium sm:text-[10px] text-[8px]">
                      +12.4 K
                    </small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Teachers
                    </small>
                  </div>
                </div>
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <PiStudent />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-medium text-xs">+12.4 K</small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Alumni
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
