"use client";

import CollegeHeader from "@/components/collegeHeader";
import MemberCard from "@/components/memberCard";
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
        <CollegeHeader title={t("header_title")} desc={t("header_desc")} />
      </div>
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full">
        <SubHeader title={t("teachers")} alt={false} />

        <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
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
  );
};
export default Page;
