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
        <CollegeHeader title={t("header_title")} desc={t("header_desc")} />
      </div>
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full">
        <SubHeader title={t("about")} alt={false} />
        <p className="text-sm text-secondary font-medium">{t("about_text")}</p>
        <div className="grid sm:grid-cols-3 grid-cols-2 lg:gap-5 sm:gap-2 gap-5 justify-between w-full my-10 lg:px-10 px-3 text-secondary">
          <div className="flex_center flex-col gap-2">
            <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
              <PiStudent />
            </span>
            <h1 className="text-title font-semibold">+ 3.12K</h1>
            <p className="font-medium text-black text-opacity-60">{t("students")}</p>
          </div>
          <div className="flex_center flex-col gap-2">
            <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
              <IoBriefcaseOutline />
            </span>
            <h1 className="text-title font-semibold">+ 239</h1>
            <p className="font-medium text-black text-opacity-60">{t("teachers")}</p>
          </div>
          <div className="flex_center flex-col gap-2">
            <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
              <HiOutlineBuildingOffice />
            </span>
            <h1 className="text-title font-semibold">+ 300</h1>
            <p className="font-medium text-black text-opacity-60">{t("departments")}</p>
          </div>
        </div>
        <SubHeader title={t("contact")} alt={false} />
        <div className="w-full sm:h-[530px] h-[380px] relative flex justify-center items-start">
          <Image
            src={"/images/map.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
          <div className="bg-primary grid sm:grid-cols-3 grid-cols-1 gap-5 rounded-3xl py-5 lg:px-8 px-5 lg:w-[85%] w-[95%] text-white relative z-10 mt-10">
            <div className="flex justify-start items-center gap-3">
              <IoMdMail className="text-2xl" />
              <div className="flex_start flex-col">
                <span className="text-sm">{t("mail")}</span>
                <p className="font-medium">info@epu.edu.iq</p>
              </div>
            </div>
            <div className="flex justify-start items-center gap-3">
              <FaPhoneAlt className="text-2xl" />
              <div className="flex_start flex-col">
                <span className="text-sm">{t("phone_number")}</span>
                <p className="change_direction font-medium">0750 123 4567</p>
              </div>
            </div>
            <div className="flex justify-start items-center gap-3">
              <IoLocationSharp className="text-2xl" />
              <div className="flex_start flex-col">
                <span className="text-sm">{t("location")}</span>
                <p className="font-medium">Karkuk St, Erbil 44001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
