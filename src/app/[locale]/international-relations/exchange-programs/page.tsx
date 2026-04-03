"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BiMinus } from "react-icons/bi";
import { FaChevronDown } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import { GoBook, GoPlus } from "react-icons/go";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import InternationalRelationsHeader from "@/components/InternationalRelationsHeader";

const Page = () => {
  const t = useTranslations("International");
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params?.locale as string;
  const id = searchParams.get("id");

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("international_relations")} alt={false} />
        <InternationalRelationsHeader />
        <h2 className="relative sm:text-titleNormal text-lg text-secondary font-semibold ">
          <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
          <span className="z-10 relative">{t("exchange_programs")}</span>
        </h2>
        <p className="p-5 border border-lightBorder rounded-3xl text-sm text-secondary text-opacity-70">
          {t("exchange_programs_text")}
        </p>

        {/* Static Mobile Navigation */}
        <div className="sm:hidden flex justify-start items-start flex-col gap-4 flex-shrink-0 w-full mt-4">
          <Link
            href={`/${locale}/international-relations?id=${id}`}
            title={t("about")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("about")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/directory-structure?id=${id}`}
            title={t("directory_structure")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("directory_structure")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/news?id=${id}`}
            title={t("news")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("news")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/office-staff?id=${id}`}
            title={t("office_staff")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("office_staff")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/contact?id=${id}`}
            title={t("contact")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
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
