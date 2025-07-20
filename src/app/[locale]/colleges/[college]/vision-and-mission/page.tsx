"use client";

import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { IoMdMail } from "react-icons/io";
import { IoBriefcaseOutline, IoLocationSharp } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full sm:mt-14 mt-10">
        <div className="lg:grid-cols-2 grid-cols-1 grid w-full gap-10">
          <div className="flex_start flex-col gap-5">
            <SubHeader title={t("vision")} alt={false} />
            <p className="text-sm">{t("vision_text")}</p>
          </div>
          <div className="flex_start flex-col gap-5">
            <SubHeader title={t("mission")} alt={false} />
            <p className="text-sm">{t("mission_text")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
