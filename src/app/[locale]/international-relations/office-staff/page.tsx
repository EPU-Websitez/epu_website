"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BiMinus } from "react-icons/bi";
import { CiMail } from "react-icons/ci";
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
          <h3 className="absolute z-20 text-white top-10 ltr:left-10 rtl:right-10 lg:text-[28px] text-sm max-w-[710px]">
            {t("international_strategy_text")}
          </h3>
          <div className="absolute z-20 text-white bottom-14 ltr:left-10 rtl:right-10 sm:flex hidden justify-center items-center gap-5">
            <Link
              href={`/${locale}/international-relations`}
              title={t("about")}
            >
              {t("about")}
            </Link>
            <span className="h-[20px] w-[1px] bg-white"></span>
            <Link
              href={`/${locale}/international-relations/exchange-programs`}
              title={t("directory_structure")}
            >
              {t("directory_structure")}
            </Link>
            <span className="h-[20px] w-[1px] bg-white"></span>
            <span>{t("office_staff")}</span>
            <span className="h-[20px] w-[1px] bg-white"></span>
            <Link
              href={`/${locale}/international-relations/contact`}
              title={t("contact")}
            >
              {t("contact")}
            </Link>
          </div>
        </div>
        <h2 className="relative sm:text-titleNormal text-lg text-secondary font-semibold ">
          <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
          <span className="z-10 relative">{t("office_staff")}</span>
        </h2>
        <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 gap-5 text-secondary text-center">
          <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
            <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
              <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                <Image
                  src={"/images/president-alt.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>
            <h3 className="text-lg font-medium px-5">
              Prof. DR. Nadhim Hassan Aziz
            </h3>
            <span className="opacity-80 mb-3 px-5 text-sm">
              The Director of EPU Language Centre
            </span>
            <a
              href="#"
              className="flex_center gap-3 w-full py-5 px-5 border-t border-t-lightBorder"
            >
              <CiMail className="text-xl" />
              <span className="text-sm opacity-80">
                nadhimhassan123@epu.edu.iq
              </span>
            </a>
          </div>
          <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
            <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
              <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                <Image
                  src={"/images/president-alt.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>
            <h3 className="text-lg font-medium px-5">
              Prof. DR. Nadhim Hassan Aziz
            </h3>
            <span className="opacity-80 mb-3 px-5 text-sm">
              The Director of EPU Language Centre
            </span>
            <a
              href="#"
              className="flex_center gap-3 w-full py-5 px-5 border-t border-t-lightBorder"
            >
              <CiMail className="text-xl" />
              <span className="text-sm opacity-80">
                nadhimhassan123@epu.edu.iq
              </span>
            </a>
          </div>
          <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
            <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
              <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                <Image
                  src={"/images/president-alt.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>
            <h3 className="text-lg font-medium px-5">
              Prof. DR. Nadhim Hassan Aziz
            </h3>
            <span className="opacity-80 mb-3 px-5 text-sm">
              The Director of EPU Language Centre
            </span>
            <a
              href="#"
              className="flex_center gap-3 w-full py-5 px-5 border-t border-t-lightBorder"
            >
              <CiMail className="text-xl" />
              <span className="text-sm opacity-80">
                nadhimhassan123@epu.edu.iq
              </span>
            </a>
          </div>
          <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
            <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
              <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                <Image
                  src={"/images/president-alt.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>
            <h3 className="text-lg font-medium px-5">
              Prof. DR. Nadhim Hassan Aziz
            </h3>
            <span className="opacity-80 mb-3 px-5 text-sm">
              The Director of EPU Language Centre
            </span>
            <a
              href="#"
              className="flex_center gap-3 w-full py-5 px-5 border-t border-t-lightBorder"
            >
              <CiMail className="text-xl" />
              <span className="text-sm opacity-80">
                nadhimhassan123@epu.edu.iq
              </span>
            </a>
          </div>
        </div>
        <div className="sm:hidden flex justify-start items-start flex-col gap-4 flex-shrink-0 w-full">
          <Link
            href={`/${locale}/international-relations`}
            title={t("about")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-80 border-lightBorder"
          >
            <span>{t("about")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/exchange-programs`}
            title={t("directory_structure")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-80 border-lightBorder"
          >
            <span>{t("directory_structure")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <div className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
            <span>{t("office_staff")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </div>
          <Link
            href={`/${locale}/international-relations/contact`}
            title={t("contact")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-80 border-lightBorder"
          >
            <span>{t("contact")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Page;
