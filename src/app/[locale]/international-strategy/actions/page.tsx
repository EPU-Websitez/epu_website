"use client";

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
  const t = useTranslations("International");
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
        <SubHeader title={t("international_strategy")} alt={false} />
        <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] relative overflow-hidden rounded-3xl">
          <Image
            src={"/images/international-lg.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
          <div className="ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-transparent absolute top-0 left-0 w-full h-full z-10"></div>
          <h3 className="absolute z-20 text-white top-10 ltr:left-10 rtl:right-10 md:text-titleNormal text-sm max-w-[710px]">
            {t("international_strategy_text")}
          </h3>
        </div>
        <div className="flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
              <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
                <Link
                  href={`/${locale}/international-strategy`}
                  title={t("strategy")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("strategy")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <Link
                  href={`/${locale}/international-strategy/goals`}
                  title={t("goals")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("goals")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <Link
                  href={`/${locale}/international-strategy/activities`}
                  title={t("activities")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("activities")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <Link
                  href={`/${locale}/international-strategy/outcomes`}
                  title={t("outcomes")}
                  className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                >
                  <span>{t("outcomes")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </Link>
                <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                  <span>{t("actions")}</span>
                  <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                </div>
              </div>

              <div className="lg:border-l border-l-none lg:border-b-0 border-b text-secondary border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
                  <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                  <span className="z-10 relative">{t("actions")}</span>
                </h2>
                <div className="flex_start gap-5 w-full">
                  <span className="w-[18px] h-[18px] rounded-full flex-shrink-0 bg-golden"></span>
                  <p className="text-secondary text-opacity-70 sm:text-base text-sm">
                    {t("list_1")}
                  </p>
                </div>
                <div className="flex_start gap-5 w-full">
                  <span className="w-[18px] h-[18px] rounded-full flex-shrink-0 bg-golden"></span>
                  <p className="text-secondary text-opacity-70 sm:text-base text-sm">
                    {t("list_2")}
                  </p>
                </div>
                <div className="flex_start gap-5 w-full">
                  <span className="w-[18px] h-[18px] rounded-full flex-shrink-0 bg-golden"></span>
                  <p className="text-secondary text-opacity-70 sm:text-base text-sm">
                    {t("list_3")}
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
