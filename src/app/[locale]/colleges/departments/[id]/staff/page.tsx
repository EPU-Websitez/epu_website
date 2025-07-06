"use client";

import CollegeHeader from "@/components/collegeHeader";
import DepartmentHeader from "@/components/departmentHeader";
import EventCard from "@/components/eventCards";
import MemberCard from "@/components/memberCard";
import NewsCard from "@/components/newsCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronRight } from "react-icons/fa6";
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
      <DepartmentHeader
        title="Civil Engineering Department"
        email="Email"
        emailValue="info@epu.edu.iq"
        location="Location"
        locationValue="Karkuk St, Erbil 44001"
        desc="founded in 2008, offers BSc, higher diploma, MSc, and PhD degrees, focusing on modern information, computer technology, and software developments to support economic growth in developing countries."
      />
      <div className="max-w-[1040px] px-3 flex_start w-full">
        <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
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
                href={`/${locale}/colleges/departments/${id}/about`}
                title={t("about_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("vision_mission")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
                <span>{t("council_staff")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </div>
              <Link
                href={`/${locale}/colleges/departments/${id}/news`}
                title={t("news_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("news_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/departments/${id}/researches`}
                title={t("researches")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
              >
                <span>{t("researches")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
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

            <div className="lg:border-l text-secondary border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
              <div className="md:block hidden">
                <SubHeader title={t("department_staff")} alt={false} />
              </div>
              <h2 className="md:hidden block relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                <span className="z-10 relative">{t("department_staff")}</span>
              </h2>
              <div className="flex_center gap-10 sm:w-auto w-full border sm:border-none sm:p-0 p-5 sm:rounded-none rounded-3xl border-lightBorder">
                <div className="sm:w-[200px] w-[125px] sm:h-[190px] h-[125px] relative">
                  <Image
                    src="/images/president-alt.png"
                    alt="title"
                    fill
                    priority
                    className="w-full h-auto object-cover sm:rounded-3xl rounded-lg"
                  />
                </div>
                <div className="flex_start flex-col gap-5">
                  <h3 className="text-golden sm:text-lg text-sm font-semibold">
                    {t("dean_of_college")}
                  </h3>
                  <h1 className="max-w-[250px] lg:text-xl sm:text-lg text-xs font-semibold relative">
                    <span className="relative z-10">{t("name")}</span>
                    <span className="absolute ltr:left-0 rtl:right-0 -bottom-3 w-[80%] h-6">
                      <Image
                        src="/images/title-shape.svg"
                        alt="park"
                        fill
                        priority
                      />
                    </span>
                  </h1>
                </div>
              </div>
              <div className="grid w-full lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-8">
                <MemberCard
                  description="Vice President for Scientific & Postgraduate Affairs"
                  image="/images/president-alt.png"
                  link={`/${locale}/academic-staff/1`}
                  staticText={t("view_profile")}
                  title="Asst. Prof. Dr. Kayhan Zrar Ghafur"
                />
                <MemberCard
                  description="Vice President for Scientific & Postgraduate Affairs"
                  image="/images/president-alt.png"
                  link="/"
                  staticText={t("view_profile")}
                  title="Asst. Prof. Dr. Kayhan Zrar Ghafur"
                />
                <MemberCard
                  description="Vice President for Scientific & Postgraduate Affairs"
                  image="/images/president-alt.png"
                  link="/"
                  staticText={t("view_profile")}
                  title="Asst. Prof. Dr. Kayhan Zrar Ghafur"
                />
                <MemberCard
                  description="Vice President for Scientific & Postgraduate Affairs"
                  image="/images/president-alt.png"
                  link="/"
                  staticText={t("view_profile")}
                  title="Asst. Prof. Dr. Kayhan Zrar Ghafur"
                />
                <MemberCard
                  description="Vice President for Scientific & Postgraduate Affairs"
                  image="/images/president-alt.png"
                  link="/"
                  staticText={t("view_profile")}
                  title="Asst. Prof. Dr. Kayhan Zrar Ghafur"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
