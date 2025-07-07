"use client";

import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BiMinus } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const Page = () => {
  const t = useTranslations("Directorate");
  const params = useParams();
  const locale = params?.locale as string;
  const id = params?.id as string;
  const [staffIsOpen, setStaffIsOpen] = useState(false);
  const handleOpenStaff = () => {
    setStaffIsOpen(!staffIsOpen);
  };

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("university_directory")} alt={false} />
        <div className="w-full lg:h-[570px] sm:h-[400px] h-[220px] relative">
          <Image
            src={"/images/directorate.jpg"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
        </div>
        <div className="flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
              <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
                <Link
                  href={`/${locale}/directorate/${id}`}
                  title={t("about")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("about")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
                  <span>{t("staff")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </div>
                <div
                  className={`lg:w-[250px] flex justify-between items-center flex-col w-full border px-3 bg-background rounded-3xl  ${
                    staffIsOpen
                      ? "border-primary max-h-[400px] text-secondary py-3"
                      : "text-secondary opacity-70 border-lightBorder lg:h-[45px] sm:h-[60px] h-[45px]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={handleOpenStaff}
                    className={`w-full flex items-center justify-between h-full ${
                      staffIsOpen ? "pb-3" : ""
                    }`}
                  >
                    <span>{t("units")}</span>
                    {!staffIsOpen ? <GoPlus className="" /> : <BiMinus />}
                  </button>
                  {staffIsOpen && (
                    <div
                      className={`flex_start flex-col gap-5 w-full ${
                        staffIsOpen
                          ? "max-h-[500px]"
                          : "max-h-0 overflow-y-hidden"
                      }`}
                    >
                      <Link
                        href={{
                          pathname: `/${locale}/directorate/${id}/units`,
                          query: { type: "registry_university" },
                        }}
                        title={t("registry_university")}
                        className="w-full gap-3 flex items-center justify-between opacity-70"
                      >
                        <span className="max-w-full truncate">
                          {t("registry_university")}
                        </span>
                        <MdKeyboardDoubleArrowRight className="rtl:rotate-180 flex-shrink-0" />
                      </Link>
                      <Link
                        href={{
                          pathname: `/${locale}/directorate/${id}/units`,
                          query: { type: "university_secrtariat" },
                        }}
                        title={t("university_secrtariat")}
                        className="w-full gap-3 pt-3 flex items-center text-opacity-70 opacity-70 justify-between border-t border-t-lightBorder"
                      >
                        <span>{t("university_secrtariat")}</span>
                        <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                      </Link>
                    </div>
                  )}
                </div>
                <Link
                  href={`/${locale}/directorate/${id}/news`}
                  title={t("news")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
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
    </div>
  );
};
export default Page;
