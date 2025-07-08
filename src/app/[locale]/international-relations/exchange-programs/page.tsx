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

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("exchange_programs")} alt={false} />
        <p className="p-5 border border-lightBorder rounded-3xl text-sm text-secondary text-opacity-70">
          {t("exchange_programs_text")}
        </p>
      </div>
    </div>
  );
};
export default Page;
