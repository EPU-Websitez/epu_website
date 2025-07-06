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
import { useState } from "react";
import { CiCalendar, CiSearch } from "react-icons/ci";
import {
  FaArrowRightLong,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa6";
import { GoArrowRight, GoBriefcase } from "react-icons/go";
import { HiOutlineBuildingOffice, HiOutlineLink } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { IoArrowForwardOutline, IoBriefcaseOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { PiStudent } from "react-icons/pi";

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const id = params?.id as string;
  const [modalId, setModalId] = useState(null);
  const handleModal = (id: any) => {
    setModalId(id);
  };
  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader
        title="Civil Engineering Department"
        email="Email"
        emailValue="info@epu.edu.iq"
        location="Location"
        locationValue="Karkuk St, Erbil 44001"
        desc="founded in 2008, offers BSc, higher diploma, MSc, and PhD degrees, focusing on modern information, computer technology, and software developments to support economic growth in developing countries."
      />
      <div className="max-w-[1040px] px-3 flex_start w-full">
        <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-0">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px]  lg:flex-row flex-col-reverse">
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              <Link
                href={`/${locale}/colleges/departments/${id}`}
                title={t("about_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("about_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/departments/${id}/vision-and-mission`}
                title={t("vision_mission")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("vision_mission")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/departments/${id}/staff`}
                title={t("council_staff")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("council_staff")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/departments/${id}/news`}
                title={t("news_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("news_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
                <span>{t("researches")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </div>
              <Link
                href={`/${locale}/colleges/departments/${id}/course-subjects`}
                title={t("course_subjects")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("course_subjects")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/departments/${id}/guide-lines`}
                title={t("guide_lines")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("guide_lines")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
            </div>

            <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
              <div className="md:block hidden">
                <SubHeader title={t("researches")} alt={false} />
              </div>
              <h2 className="md:hidden block relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                <span className="z-10 relative">{t("researches")}</span>
              </h2>
              <div className="w-full flex_center gap-5">
                <div className="relative lg:w-[20%] sm:w-[33%] w-14 text-sm flex-shrink-0 sm:border-none border border-lightBorder sm:p-0 p-2 rounded-md">
                  <select
                    name="academic"
                    id="academic"
                    className="text-start sm:block hidden w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    <option value="#">{t("select_date")}</option>
                    <option value="#">Academic 1</option>
                    <option value="#">Academic 2</option>
                    <option value="#">Academic 3</option>
                  </select>
                  <CiCalendar className="sm:hidden block text-2xl" />
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>
                <div className="relative w-full">
                  <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
                    <CiSearch />
                  </span>
                  <input
                    type="text"
                    className="py-2 w-full border-lightBorder sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
                    placeholder={t("search_research")}
                  />
                </div>
                <button className="sm:px-6 px-2 flex-shrink-0 py-2 sm:rounded-xl rounded-md bg-primary text-white">
                  {t("search")}
                </button>
              </div>
              <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                  <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                    <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-lg">
                      <CiSearch className="text-2xl" />
                    </div>
                    <div className="flex_start flex-col">
                      <h4 className="font-medium">University Of Mosul</h4>
                      <span className="text-black opacity-60 text-sm">
                        25 - 06 - 1992
                      </span>
                    </div>
                  </div>
                  <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                    <div className="flex_start flex-col w-full">
                      <span className="text-black opacity-60 text-xs">
                        {t("attachment")}
                      </span>
                      <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm mb-3">
                        <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                          <HiOutlineLink />
                        </span>
                        <span>botancv.PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModal(1)}
                        className="flex justify-between items-center w-full gap-4 px-2 text-sm text-golden border-t border-t-lightBorder py-3"
                      >
                        <p>{t("read_more")}</p>
                        <FaArrowRightLong className="rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalId && (
        <div className="flex_center fixed top-0 left-0 w-full h-full z-20">
          <div className="bg-white flex_start flex-col gap-5 z-10 md:w-[778px] w-[90%] rounded-3xl overflow-hidden">
            <div className="flex justify-between items-center gap-2 w-full bg-golden text-white p-6">
              <h3 className="md:text-smallTitle text-lg font-semibold">
                {t("research_detail")}
              </h3>
              <button
                type="button"
                onClick={() => handleModal(null)}
                className="text-3xl"
              >
                <IoMdClose />
              </button>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full p-6">
              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {t("research_title")}
                </span>
                <p className="text-secondary font-medium">
                  Innovative Approaches to Renewable Energy Integration in Urban
                  Infrastructure
                </p>
              </div>
              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {t("supervisor")}
                </span>
                <p className="text-secondary font-medium">
                  Profs. Dr. Ahmad Adnan Kamaran
                </p>
              </div>

              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {t("attachment")}
                </span>
                <p className="text-secondary font-medium">2018 - 2019</p>
                <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                  <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                    <HiOutlineLink />
                  </span>
                  <span>botancv.PDF</span>
                </button>
              </div>
              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {t("students")}
                </span>
                <li className="text-secondary font-medium list-disc">
                  Sanarya Hamakarim Ali
                </li>
                <li className="text-secondary font-medium list-disc">
                  Sanarya Hamakarim Ali
                </li>
                <li className="text-secondary font-medium list-disc">
                  Sanarya Hamakarim Ali
                </li>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleModal(null)}
            className="w-full fixed h-full left-0 top-0 bg-black bg-opacity-60"
          ></button>
        </div>
      )}
    </div>
  );
};
export default Page;
