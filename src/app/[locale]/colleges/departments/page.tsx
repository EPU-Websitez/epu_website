"use client";

import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaPhoneAlt } from "react-icons/fa";
import { GoBriefcase } from "react-icons/go";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { IoMdMail } from "react-icons/io";
import {
  IoArrowForwardOutline,
  IoBriefcaseOutline,
  IoLocationSharp,
} from "react-icons/io5";
import { PiStudent } from "react-icons/pi";

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full">
        <CollegeHeader title={t("header_title")} desc={t("header_desc")} />
        <SubHeader title={t("departments")} alt={false} />
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 w-full flex-shrink-0">
          <div className="relative border border-lightBorder rounded-3xl p-2 flex_center flex-col gap-3 text-center">
            <Link
              href={""}
              className="w-full h-[165px] relative overflow-hidden rounded-3xl"
            >
              <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                <IoArrowForwardOutline className="rtl:rotate-180" />
              </div>
              <Image
                src={`/images/campus.png`}
                className="object-cover"
                alt="park"
                fill
                priority
              />
            </Link>
            <Link href={""} className="sm:text-sm text-[10px] font-semibold">
              Architectural Engineering Department
            </Link>
            <div className="flex_center gap-8 w-full">
              <div className="flex_center gap-2">
                <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                  <GoBriefcase />
                </div>
                <div className="flex_start flex-col">
                  <small className="font-medium sm:text-[10px] text-[8px]">
                    +12.4 K
                  </small>
                  <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                    Teachers
                  </small>
                </div>
              </div>
              <div className="flex_center gap-2">
                <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                  <PiStudent />
                </div>
                <div className="flex_start flex-col">
                  <small className="font-medium sm:text-[10px] text-[8px]">
                    +12.4 K
                  </small>
                  <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                    Alumni
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="relative border border-lightBorder rounded-3xl p-2 flex_center flex-col gap-3 text-center">
            <Link
              href={""}
              className="w-full h-[165px] relative overflow-hidden rounded-3xl"
            >
              <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                <IoArrowForwardOutline className="rtl:rotate-180" />
              </div>
              <Image
                src={`/images/campus.png`}
                className="object-cover"
                alt="park"
                fill
                priority
              />
            </Link>
            <Link href={""} className="sm:text-sm text-[10px] font-semibold">
              Architectural Engineering Department
            </Link>
            <div className="flex_center gap-8 w-full">
              <div className="flex_center gap-2">
                <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                  <GoBriefcase />
                </div>
                <div className="flex_start flex-col">
                  <small className="font-medium sm:text-[10px] text-[8px]">
                    +12.4 K
                  </small>
                  <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                    Teachers
                  </small>
                </div>
              </div>
              <div className="flex_center gap-2">
                <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                  <PiStudent />
                </div>
                <div className="flex_start flex-col">
                  <small className="font-medium sm:text-[10px] text-[8px]">
                    +12.4 K
                  </small>
                  <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                    Alumni
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="relative border border-lightBorder rounded-3xl p-2 flex_center flex-col gap-3 text-center">
            <Link
              href={""}
              className="w-full h-[165px] relative overflow-hidden rounded-3xl"
            >
              <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                <IoArrowForwardOutline className="rtl:rotate-180" />
              </div>
              <Image
                src={`/images/campus.png`}
                className="object-cover"
                alt="park"
                fill
                priority
              />
            </Link>
            <Link href={""} className="sm:text-sm text-[10px] font-semibold">
              Architectural Engineering Department
            </Link>
            <div className="flex_center gap-8 w-full">
              <div className="flex_center gap-2">
                <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                  <GoBriefcase />
                </div>
                <div className="flex_start flex-col">
                  <small className="font-medium sm:text-[10px] text-[8px]">
                    +12.4 K
                  </small>
                  <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                    Teachers
                  </small>
                </div>
              </div>
              <div className="flex_center gap-2">
                <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                  <PiStudent />
                </div>
                <div className="flex_start flex-col">
                  <small className="font-medium sm:text-[10px] text-[8px]">
                    +12.4 K
                  </small>
                  <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                    Alumni
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="relative border border-lightBorder rounded-3xl p-2 flex_center flex-col gap-3 text-center">
            <Link
              href={""}
              className="w-full h-[165px] relative overflow-hidden rounded-3xl"
            >
              <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                <IoArrowForwardOutline className="rtl:rotate-180" />
              </div>
              <Image
                src={`/images/campus.png`}
                className="object-cover"
                alt="park"
                fill
                priority
              />
            </Link>
            <Link href={""} className="sm:text-sm text-[10px] font-semibold">
              Architectural Engineering Department
            </Link>
            <div className="flex_center gap-8 w-full">
              <div className="flex_center gap-2">
                <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                  <GoBriefcase />
                </div>
                <div className="flex_start flex-col">
                  <small className="font-medium sm:text-[10px] text-[8px]">
                    +12.4 K
                  </small>
                  <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                    Teachers
                  </small>
                </div>
              </div>
              <div className="flex_center gap-2">
                <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                  <PiStudent />
                </div>
                <div className="flex_start flex-col">
                  <small className="font-medium sm:text-[10px] text-[8px]">
                    +12.4 K
                  </small>
                  <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                    Alumni
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="relative border border-lightBorder rounded-3xl p-2 flex_center flex-col gap-3 text-center">
            <Link
              href={""}
              className="w-full h-[165px] relative overflow-hidden rounded-3xl"
            >
              <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                <IoArrowForwardOutline className="rtl:rotate-180" />
              </div>
              <Image
                src={`/images/campus.png`}
                className="object-cover"
                alt="park"
                fill
                priority
              />
            </Link>
            <Link href={""} className="sm:text-sm text-[10px] font-semibold">
              Architectural Engineering Department
            </Link>
            <div className="flex_center gap-8 w-full">
              <div className="flex_center gap-2">
                <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                  <GoBriefcase />
                </div>
                <div className="flex_start flex-col">
                  <small className="font-medium sm:text-[10px] text-[8px]">
                    +12.4 K
                  </small>
                  <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                    Teachers
                  </small>
                </div>
              </div>
              <div className="flex_center gap-2">
                <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                  <PiStudent />
                </div>
                <div className="flex_start flex-col">
                  <small className="font-medium text-xs">+12.4 K</small>
                  <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                    Alumni
                  </small>
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
