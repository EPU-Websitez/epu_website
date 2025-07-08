"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BiMinus } from "react-icons/bi";
import { FaChevronDown } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import { GoBook, GoPlus } from "react-icons/go";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const Page = () => {
  const t = useTranslations("International");
  const params = useParams();
  const locale = params?.locale as string;
  const id = params?.id as string;
  const [openedAccordion, setOpenedAccordion] = useState(0);
  const handleAccordion = (e: any) => {
    if (e !== openedAccordion) {
      setOpenedAccordion(e);
    } else {
      setOpenedAccordion(0);
    }
  };

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("international_relations")} alt={false} />
        <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] relative overflow-hidden rounded-3xl">
          <Image
            src={"/images/international-lg.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
          <div className="ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-transparent absolute top-0 left-0 w-full h-full z-10"></div>
          <h3 className="absolute z-20 text-white top-10 ltr:left-10 rtl:right-10 lg:text-[28px] text-[20px] max-w-[710px]">
            {t("international_strategy_text")}
          </h3>
          <div className="absolute z-20 text-white bottom-10 ltr:left-10 rtl:right-10 sm:flex hidden justify-center items-center gap-5">
            <span>{t("about")}</span>
            <span className="h-[20px] w-[1px] bg-white"></span>
            <Link
              href={`/${locale}/international-relations/directory-structure`}
              title={t("directory_structure")}
            >
              {t("directory_structure")}
            </Link>
            <span className="h-[20px] w-[1px] bg-white"></span>
            <Link
              href={`/${locale}/international-relations/office-staff`}
              title={t("office_staff")}
            >
              {t("office_staff")}
            </Link>
            <span className="h-[20px] w-[1px] bg-white"></span>
            <Link
              href={`/${locale}/international-relations/contact`}
              title={t("contact")}
            >
              {t("contact")}
            </Link>
          </div>
        </div>
        <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
          <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
          <span className="z-10 relative">{t("about")}</span>
        </h2>
        <p className="text-opacity-70 text-secondary text-sm">
          {t("international_relations_about_text")}
        </p>
        <div className="flex_center w-full gap-5 mt-5">
          <span className="bg-lightBorder w-full h-[1px]"></span>
          <h3 className="text-secondary text-xl font-semibold">{t("units")}</h3>
          <span className="bg-lightBorder w-full h-[1px]"></span>
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
                <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full relative block"></span>
                <h3 className="font-semibold">Grand and Fundraising</h3>
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
              <p>
                The mission of this section is to support the academic staff or
                the alumni to study abroad through participation in quality
                programs in a wide range of disciplines. Also to enable the
                faculty staff to participate in training and scientific
                researches. Furthermore, to arrange all issues which are related
                to participation of faculty and staff members in conferences,
                workshops and training courses. Moreover, the purpose of this
                section is to develop the ability of the academic staff of the
                university internationally, by increasing the awareness and
                understanding and enrich curricula on every campus of the
                university, as well as to expand educational opportunities
                abroad for students from diverse backgrounds. As the most
                effective and dramatic experience by which students and staff
                can achieve international and intercultural learning, study
                abroad will contribute significantly to careers in all fields of
                specialization and should be an integral part of an education at
                Erbil Polytechnic University.
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
                <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full relative block"></span>
                <h3 className="font-semibold">
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
              <p>
                The mission of this section is to support the academic staff or
                the alumni to study abroad through participation in quality
                programs in a wide range of disciplines. Also to enable the
                faculty staff to participate in training and scientific
                researches. Furthermore, to arrange all issues which are related
                to participation of faculty and staff members in conferences,
                workshops and training courses. Moreover, the purpose of this
                section is to develop the ability of the academic staff of the
                university internationally, by increasing the awareness and
                understanding and enrich curricula on every campus of the
                university, as well as to expand educational opportunities
                abroad for students from diverse backgrounds. As the most
                effective and dramatic experience by which students and staff
                can achieve international and intercultural learning, study
                abroad will contribute significantly to careers in all fields of
                specialization and should be an integral part of an education at
                Erbil Polytechnic University.
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
                <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full relative block"></span>
                <h3 className="font-semibold">
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
              <p>
                The mission of this section is to support the academic staff or
                the alumni to study abroad through participation in quality
                programs in a wide range of disciplines. Also to enable the
                faculty staff to participate in training and scientific
                researches. Furthermore, to arrange all issues which are related
                to participation of faculty and staff members in conferences,
                workshops and training courses. Moreover, the purpose of this
                section is to develop the ability of the academic staff of the
                university internationally, by increasing the awareness and
                understanding and enrich curricula on every campus of the
                university, as well as to expand educational opportunities
                abroad for students from diverse backgrounds. As the most
                effective and dramatic experience by which students and staff
                can achieve international and intercultural learning, study
                abroad will contribute significantly to careers in all fields of
                specialization and should be an integral part of an education at
                Erbil Polytechnic University.
              </p>
            </div>
          </div>
          <div className="flex_center w-full gap-5 mt-5">
            <span className="bg-lightBorder w-full h-[1px]"></span>
            <h3 className="text-secondary text-xl font-semibold">
              {t("programs")}
            </h3>
            <span className="bg-lightBorder w-full h-[1px]"></span>
          </div>
          <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-5">
            <Link
              href={`/${locale}/international-relations/exchange-programs`}
              title={t("exchange_programs")}
              className="flex_start gap-5 rounded-3xl p-5 bg-primary text-white"
            >
              <span className="flex-shrink-0 text-xl w-10 h-10 rounded-full lg:flex hidden justify-center items-center bg-white text-secondary">
                <GoBook />
              </span>
              <div className="flex_start flex-col gap-3">
                <h3 className="lg:text-2xl text-lg">
                  {t("exchange_programs")}
                </h3>
                <div className="flex_center gap-3">
                  <span className="w-[10px] h-[10px] flex-shrink-0 rounded-full bg-golden"></span>
                  <small className="text-xs">
                    {t("student_exchange_programs")}
                  </small>
                  <FiArrowRight className="text-golden text-lg rtl:rotate-180" />
                </div>
                <div className="flex_center gap-3">
                  <span className="w-[10px] h-[10px] flex-shrink-0 rounded-full bg-golden"></span>
                  <small className="text-xs">
                    {t("academic_exchange_programs")}
                  </small>
                  <FiArrowRight className="text-golden text-lg rtl:rotate-180" />
                </div>
                <div className="flex_center gap-3">
                  <span className="w-[10px] h-[10px] flex-shrink-0 rounded-full bg-golden"></span>
                  <small className="text-xs">
                    {t("schools_exchange_programs")}
                  </small>
                  <FiArrowRight className="text-golden text-lg rtl:rotate-180" />
                </div>
                <div className="flex_center gap-3">
                  <span className="w-[10px] h-[10px] flex-shrink-0 rounded-full bg-golden"></span>
                  <small className="text-xs">
                    {t("staff_exchange_programs")}
                  </small>
                  <FiArrowRight className="text-golden text-lg rtl:rotate-180" />
                </div>
              </div>
            </Link>
            <Link
              href={`/${locale}/international-relations/exchange-programs`}
              title={t("programs_staff_researchers")}
              className="flex_start gap-5 rounded-3xl p-5 bg-primary text-white"
            >
              <span className="flex-shrink-0 text-xl w-10 h-10 rounded-full lg:flex hidden justify-center items-center bg-white text-secondary">
                <GoBook />
              </span>
              <div className="flex_start flex-col gap-3">
                <h3 className="lg:text-2xl text-lg">
                  {t("programs_staff_researchers")}
                </h3>
                <div className="flex_center gap-3">
                  <span className="w-[10px] h-[10px] flex-shrink-0 rounded-full bg-golden"></span>
                  <small className="text-xs">{t("scholarship")}</small>
                  <FiArrowRight className="text-golden text-lg rtl:rotate-180" />
                </div>
                <div className="flex_center gap-3">
                  <span className="w-[10px] h-[10px] flex-shrink-0 rounded-full bg-golden"></span>
                  <small className="text-xs">{t("fellowship")}</small>
                  <FiArrowRight className="text-golden text-lg rtl:rotate-180" />
                </div>
                <div className="flex_center gap-3">
                  <span className="w-[10px] h-[10px] flex-shrink-0 rounded-full bg-golden"></span>
                  <small className="text-xs">{t("internship")}</small>
                  <FiArrowRight className="text-golden text-lg rtl:rotate-180" />
                </div>
              </div>
            </Link>
          </div>
          <div className="sm:hidden flex justify-start items-start flex-col gap-4 flex-shrink-0 w-full">
            <div className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
              <span>{t("about")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </div>
            <Link
              href={`/${locale}/international-relations/directory-structure`}
              title={t("directory_structure")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("directory_structure")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/international-relations/office-staff`}
              title={t("office_staff")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("office_staff")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/international-relations/contact`}
              title={t("contact")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("contact")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
