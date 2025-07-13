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
  FaAward,
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
  const [openedAccordion, setOpenedAccordion] = useState(0);
  const handleAccordion = (e: any) => {
    if (e !== openedAccordion) {
      setOpenedAccordion(e);
    } else {
      setOpenedAccordion(0);
    }
  };

  return (
    <div className="my-10 flex_center w-full flex-col gap-10">
      <div className="w-full flex_center flex-col">
        <div className="w-full flex_start mb-10 lg:px-0 px-3 max-w-[1040px]">
          <SubHeader title={t("head")} alt={false} />
        </div>
        <div className="w-full flex_start lg:px-0 px-3 max-w-[1040px]">
          <div className="w-full bg-primary text-white md:p-10 p-5 flex justify-between md:flex-row flex-col items-start rounded-3xl md:gap-5 gap-10">
            <div className="flex_start md:flex-col flex-row md:flex-nowrap flex-wrap gap-5 md:max-w-[350px] max-w-full">
              <p className="font-medium md:text-sm text-xs md:mb-0 mb-3">
                {t("degrees_text")}
              </p>
              <div className="flex_center gap-3">
                <div className="bg-white text-secondary flex_center md:w-[35px] w-6 md:h-[35px] h-6 md:text-lg text-base rounded-md">
                  <FaAward />
                </div>
                <div className="flex_start flex-col">
                  <small className="md:text-xs text-[10px] text-white opacity-75">
                    {t("degrees")}
                  </small>
                  <p className="md:text-sm text-xs font-medium">
                    High Diploma . Master . PhD
                  </p>
                </div>
              </div>
              <div className="md:w-auto w-full">
                <Link
                  href={""}
                  className="mt-5 rounded-3xl md:h-10 h-8 flex_center px-3 gap-2 bg-white max-w-fit"
                >
                  <span className="text-primary font-bold md:text-sm text-xs mx-2">
                    {t("see_more")}
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
        <div className="w-full bg-backgroundSecondary flex_center text-secondary">
          <div className="w-full flex_center mb-10 lg:px-0 px-3 max-w-[1040px] flex-col gap-10 py-10">
            <h2 className="md:text-xl relative sm:text-lg text-xs font-semibold ">
              <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
              <span className="z-10 relative">
                Application forms for higher education for (2023 - 2024)
              </span>
            </h2>
            <div className="grid md:grid-cols-3 grid-cols-2 lg:gap-10 gap-5 w-full">
              <div className="md:bg-background bg-backgroundSecondary md:p-5 p-0 flex_start flex-col md:gap-5 gap-3 rounded-3xl">
                <div className="bg-golden text-white flex_center md:w-[35px] w-6 md:h-[35px] h-6 md:text-lg text-base rounded-md">
                  <FaAward />
                </div>
                <h4 className="text-secondary font-medium md:text-sm text-xs">
                  High Diploma Degree
                </h4>
                <Link
                  href={""}
                  className="flex justify-between items-center px-1 md:h-[42px] h-7 rounded-3xl border border-lightBorder w-full"
                >
                  <span className="text-golden md:text-sm text-xs mx-2">
                    {t("register")}
                  </span>
                  <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-golden text-white rounded-full">
                    <FaAngleRight className="rtl:rotate-180" />
                  </span>
                </Link>
              </div>
              <div className="md:bg-background bg-backgroundSecondary md:p-5 p-0 flex_start flex-col md:gap-5 gap-3 rounded-3xl">
                <div className="bg-golden text-white flex_center md:w-[35px] w-6 md:h-[35px] h-6 md:text-lg text-base rounded-md">
                  <FaAward />
                </div>
                <h4 className="text-secondary font-medium md:text-sm text-xs">
                  High Diploma Degree
                </h4>
                <Link
                  href={""}
                  className="flex justify-between items-center px-1 md:h-[42px] h-7 rounded-3xl border border-lightBorder w-full"
                >
                  <span className="text-golden md:text-sm text-xs mx-2">
                    {t("register")}
                  </span>
                  <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-golden text-white rounded-full">
                    <FaAngleRight className="rtl:rotate-180" />
                  </span>
                </Link>
              </div>
              <div className="md:bg-background bg-backgroundSecondary md:p-5 p-0 flex_start flex-col md:gap-5 gap-3 rounded-3xl">
                <div className="bg-golden text-white flex_center md:w-[35px] w-6 md:h-[35px] h-6 md:text-lg text-base rounded-md">
                  <FaAward />
                </div>
                <h4 className="text-secondary font-medium md:text-sm text-xs">
                  High Diploma Degree
                </h4>
                <Link
                  href={""}
                  className="flex justify-between items-center px-1 md:h-[42px] h-7 rounded-3xl border border-lightBorder w-full"
                >
                  <span className="text-golden md:text-sm text-xs mx-2">
                    {t("register")}
                  </span>
                  <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-golden text-white rounded-full">
                    <FaAngleRight className="rtl:rotate-180" />
                  </span>
                </Link>
              </div>
              <div className="md:bg-background bg-backgroundSecondary md:p-5 p-0 flex_start flex-col md:gap-5 gap-3 rounded-3xl">
                <div className="bg-golden text-white flex_center md:w-[35px] w-6 md:h-[35px] h-6 md:text-lg text-base rounded-md">
                  <FaAward />
                </div>
                <h4 className="text-secondary font-medium md:text-sm text-xs">
                  High Diploma Degree
                </h4>
                <Link
                  href={""}
                  className="flex justify-between items-center px-1 md:h-[42px] h-7 rounded-3xl border border-lightBorder w-full"
                >
                  <span className="text-golden md:text-sm text-xs mx-2">
                    {t("register")}
                  </span>
                  <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-golden text-white rounded-full">
                    <FaAngleRight className="rtl:rotate-180" />
                  </span>
                </Link>
              </div>
            </div>
            <h2 className="md:text-xl relative sm:text-lg text-xs font-semibold mt-10">
              <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
              <span className="z-10 relative">
                Erbil Technical Health & Medical College
              </span>
            </h2>
            <div className="grid md:grid-cols-3 grid-cols-2 lg:gap-10 gap-5 w-full">
              <div className="md:bg-background bg-backgroundSecondary md:p-5 p-0 flex_start flex-col md:gap-5 gap-3 rounded-3xl">
                <h4 className="text-secondary font-medium md:text-sm text-xs">
                  High Diploma Degree
                </h4>
                <Link
                  href={""}
                  className="flex justify-between items-center px-1 md:h-[42px] h-7 rounded-3xl border border-lightBorder w-full"
                >
                  <span className="text-golden md:text-sm text-xs mx-2">
                    {t("see_details")}
                  </span>
                  <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-golden text-white rounded-full">
                    <FaAngleRight className="rtl:rotate-180" />
                  </span>
                </Link>
              </div>
              <div className="md:bg-background bg-backgroundSecondary md:p-5 p-0 flex_start flex-col md:gap-5 gap-3 rounded-3xl">
                <h4 className="text-secondary font-medium md:text-sm text-xs">
                  High Diploma Degree
                </h4>
                <Link
                  href={""}
                  className="flex justify-between items-center px-1 md:h-[42px] h-7 rounded-3xl border border-lightBorder w-full"
                >
                  <span className="text-golden md:text-sm text-xs mx-2">
                    {t("see_details")}
                  </span>
                  <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-golden text-white rounded-full">
                    <FaAngleRight className="rtl:rotate-180" />
                  </span>
                </Link>
              </div>
              <div className="md:bg-background bg-backgroundSecondary md:p-5 p-0 flex_start flex-col md:gap-5 gap-3 rounded-3xl">
                <h4 className="text-secondary font-medium md:text-sm text-xs">
                  High Diploma Degree
                </h4>
                <Link
                  href={""}
                  className="flex justify-between items-center px-1 md:h-[42px] h-7 rounded-3xl border border-lightBorder w-full"
                >
                  <span className="text-golden md:text-sm text-xs mx-2">
                    {t("see_details")}
                  </span>
                  <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-golden text-white rounded-full">
                    <FaAngleRight className="rtl:rotate-180" />
                  </span>
                </Link>
              </div>
              <div className="md:bg-background bg-backgroundSecondary md:p-5 p-0 flex_start flex-col md:gap-5 gap-3 rounded-3xl">
                <h4 className="text-secondary font-medium md:text-sm text-xs">
                  High Diploma Degree
                </h4>
                <Link
                  href={""}
                  className="flex justify-between items-center px-1 md:h-[42px] h-7 rounded-3xl border border-lightBorder w-full"
                >
                  <span className="text-golden md:text-sm text-xs mx-2">
                    {t("see_details")}
                  </span>
                  <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-golden text-white rounded-full">
                    <FaAngleRight className="rtl:rotate-180" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="w-full flex_center gap-8 mt-10">
              <span className="w-full h-[1px] bg-lightBorder"></span>
              <h2 className="md:text-xl text-sm font-medium text-secondary flex-shrink-0">
                {t("application_requirements")}
              </h2>
              <span className="w-full h-[1px] bg-lightBorder"></span>
            </div>
            <div className="flex_start flex-col gap-5 w-full">
              <div
                className={`w-full flex_start flex-col rounded-2xl text-secondary border ${
                  openedAccordion === 1 ? "border-golden" : "border-lightBorder"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleAccordion(1)}
                  className="flex justify-between items-center w-full p-5"
                >
                  <div className="flex_center gap-4">
                    <span className="w-4 h-4 bg-golden flex-shrink-0 rounded-full relative block"></span>
                    <h3 className="font-medium md:text-base text-sm">
                      Grand and Fundraising
                    </h3>
                  </div>
                  <FaChevronDown
                    className={`duration-200 ${
                      openedAccordion === 1 ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`flex_start duration-300 flex-col gap-5 ${
                    openedAccordion === 1
                      ? "max-h-[700px] p-5"
                      : "max-h-0 overflow-y-hidden"
                  }`}
                >
                  <p className="md:text-sm text-xs">
                    The mission of this section is to support the academic staff
                    or the alumni to study abroad through participation in
                    quality programs in a wide range of disciplines. Also to
                    enable the faculty staff to participate in training and
                    scientific researches. Furthermore, to arrange all issues
                    which are related to participation of faculty and staff
                    members in conferences, workshops and training courses.
                    Moreover, the purpose of this section is to develop the
                    ability of the academic staff of the university
                    internationally, by increasing the awareness and
                    understanding and enrich curricula on every campus of the
                    university, as well as to expand educational opportunities
                    abroad for students from diverse backgrounds. As the most
                    effective and dramatic experience by which students and
                    staff can achieve international and intercultural learning,
                    study abroad will contribute significantly to careers in all
                    fields of specialization and should be an integral part of
                    an education at Erbil Polytechnic University.
                  </p>
                </div>
              </div>
              <div
                className={`w-full flex_start flex-col rounded-2xl text-secondary border ${
                  openedAccordion === 2 ? "border-golden" : "border-lightBorder"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleAccordion(2)}
                  className="flex justify-between items-center w-full p-5"
                >
                  <div className="flex_center gap-4">
                    <span className="w-4 h-4 bg-golden flex-shrink-0 rounded-full relative block"></span>
                    <h3 className="font-medium md:text-base text-sm">
                      Cultural and Academic Relations
                    </h3>
                  </div>
                  <FaChevronDown
                    className={`duration-200 ${
                      openedAccordion === 2 ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`flex_start duration-300 flex-col gap-5 ${
                    openedAccordion === 2
                      ? "max-h-[700px] p-5"
                      : "max-h-0 overflow-y-hidden"
                  }`}
                >
                  <p className="md:text-sm text-xs">
                    The mission of this section is to support the academic staff
                    or the alumni to study abroad through participation in
                    quality programs in a wide range of disciplines. Also to
                    enable the faculty staff to participate in training and
                    scientific researches. Furthermore, to arrange all issues
                    which are related to participation of faculty and staff
                    members in conferences, workshops and training courses.
                    Moreover, the purpose of this section is to develop the
                    ability of the academic staff of the university
                    internationally, by increasing the awareness and
                    understanding and enrich curricula on every campus of the
                    university, as well as to expand educational opportunities
                    abroad for students from diverse backgrounds. As the most
                    effective and dramatic experience by which students and
                    staff can achieve international and intercultural learning,
                    study abroad will contribute significantly to careers in all
                    fields of specialization and should be an integral part of
                    an education at Erbil Polytechnic University.
                  </p>
                </div>
              </div>
              <div
                className={`w-full flex_start flex-col rounded-2xl text-secondary border ${
                  openedAccordion === 3 ? "border-golden" : "border-lightBorder"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleAccordion(3)}
                  className="flex justify-between items-center w-full p-5"
                >
                  <div className="flex_center gap-4">
                    <span className="w-4 h-4 bg-golden flex-shrink-0 rounded-full relative block"></span>
                    <h3 className="font-medium md:text-base text-sm">
                      Delegation and Hospitality Unit
                    </h3>
                  </div>
                  <FaChevronDown
                    className={`duration-200 ${
                      openedAccordion === 2 ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`flex_start duration-300 flex-col gap-5 ${
                    openedAccordion === 3
                      ? "max-h-[700px] p-5"
                      : "max-h-0 overflow-y-hidden"
                  }`}
                >
                  <p className="md:text-sm text-xs">
                    The mission of this section is to support the academic staff
                    or the alumni to study abroad through participation in
                    quality programs in a wide range of disciplines. Also to
                    enable the faculty staff to participate in training and
                    scientific researches. Furthermore, to arrange all issues
                    which are related to participation of faculty and staff
                    members in conferences, workshops and training courses.
                    Moreover, the purpose of this section is to develop the
                    ability of the academic staff of the university
                    internationally, by increasing the awareness and
                    understanding and enrich curricula on every campus of the
                    university, as well as to expand educational opportunities
                    abroad for students from diverse backgrounds. As the most
                    effective and dramatic experience by which students and
                    staff can achieve international and intercultural learning,
                    study abroad will contribute significantly to careers in all
                    fields of specialization and should be an integral part of
                    an education at Erbil Polytechnic University.
                  </p>
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
