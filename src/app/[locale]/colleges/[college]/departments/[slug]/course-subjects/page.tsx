"use client";

import CollegeHeader from "@/components/collegeHeader";
import DepartmentHeader from "@/components/departmentHeader";
import EventCard from "@/components/eventCards";
import NewsCard from "@/components/newsCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BsBook } from "react-icons/bs";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { GoArrowRight, GoBriefcase } from "react-icons/go";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { IoArrowForwardOutline, IoBriefcaseOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { PiStudent } from "react-icons/pi";

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const id = params?.id as string;
  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader />
      <div className="max-w-[1040px] px-3 flex_start w-full">
        <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              <Link
                href={`/${locale}/colleges/departments/${id}`}
                title={t("about_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("about_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/departments/${id}/vision-and-mission`}
                title={t("vision_mission")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("vision_mission")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/departments/${id}/staff`}
                title={t("council_staff")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("council_staff")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/departments/${id}/news`}
                title={t("news_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("news_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/departments/${id}/researches`}
                title={t("researches")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("researches")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                <span>{t("course_subjects")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </div>
              <Link
                href={`/${locale}/colleges/departments/${id}/guide-lines`}
                title={t("guide_lines")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("guide_lines")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
            </div>

            <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 text-secondary pb-10 flex_start flex-col gap-7 w-full">
              <div className="md:block hidden">
                <SubHeader title={t("course_subjects")} alt={false} />
              </div>
              <h2 className="md:hidden block relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                <span className="z-10 relative">{t("course_subjects")}</span>
              </h2>
              <Link
                href={`/${locale}/colleges/departments/${id}/course-subjects/carriculum`}
                className="w-full flex justify-between items-center gap-5 rounded-xl border border-lightBorder px-3 p-2 font-semibold"
              >
                <span>{t("see_course_curriculum")}</span>
                <span className="w-[30px] h-[30px] text-white bg-golden rounded-full flex_center">
                  <FaChevronRight className="rtl:rotate-180" />
                </span>
              </Link>
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-5">
                <div className="relative w-full text-sm flex-shrink-0">
                  <select
                    name="academic"
                    id="academic"
                    className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    <option value="#">{t("select_stage")}</option>
                    <option value="#">Academic 1</option>
                    <option value="#">Academic 2</option>
                    <option value="#">Academic 3</option>
                  </select>
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>
                <div className="relative w-full text-sm flex-shrink-0">
                  <select
                    name="academic"
                    id="academic"
                    className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    <option value="#">{t("select_semester")}</option>
                    <option value="#">Academic 1</option>
                    <option value="#">Academic 2</option>
                    <option value="#">Academic 3</option>
                  </select>
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>
                <div className="relative w-full text-sm flex-shrink-0">
                  <select
                    name="academic"
                    id="academic"
                    className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    <option value="#">{t("select_system")}</option>
                    <option value="#">Academic 1</option>
                    <option value="#">Academic 2</option>
                    <option value="#">Academic 3</option>
                  </select>
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>
                <button className="sm:px-6 px-2 flex-shrink-0 sm:py-2 py-1 sm:rounded-xl rounded-md bg-primary text-white">
                  {t("search")}
                </button>
              </div>
              <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                  <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                    <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-lg">
                      <BsBook className="text-2xl" />
                    </div>
                    <div className="flex_start flex-col">
                      <h4 className="font-medium">University Of Mosul</h4>
                      <span className="text-black opacity-60 text-sm">
                        Dr. Zana Ahmed Rauf
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/${locale}/colleges/departments/${id}/course-subjects/1`}
                    title={t("course_subjects")}
                    className="w-full flex text-golden justify-between items-center gap-5 rounded-3xl border border-lightBorder p-2 font-medium"
                  >
                    <span>{t("see_details")}</span>
                    <span className="w-[30px] h-[30px] text-white bg-golden rounded-full flex_center">
                      <FaChevronRight className="rtl:rotate-180" />
                    </span>
                  </Link>
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
