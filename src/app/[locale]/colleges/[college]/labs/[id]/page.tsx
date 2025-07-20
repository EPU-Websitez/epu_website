"use client";

import CollegeHeader from "@/components/collegeHeader";
import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { PiFlaskLight } from "react-icons/pi";
import { RiDashboardHorizontalLine } from "react-icons/ri";

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;
  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full">
        <CollegeHeader />
        <SubHeader title="Medical Laboratory" alt={false} />
        <div className="w-full flex justify-between md:items-center items-start md:flex-row flex-col gap-5 p-5 rounded-3xl bg-golden text-white">
          <div className="flex_center gap-3">
            <span className="w-[60px] h-[60px] flex-shrink-0 rounded-lg flex_center bg-white bg-opacity-30">
              <HiOutlineBuildingOffice className="text-4xl" />
            </span>
            <div className="flex-start flex-col">
              <small className="text-xs">{t("belongs_to")}</small>
              <h4 className="md:text-lg text-base font-medium">
                Medical Microbiology Department
              </h4>
            </div>
          </div>
          <div className="flex_center gap-3">
            <span className="w-[60px] h-[60px] flex-shrink-0 rounded-lg flex_center bg-white bg-opacity-30">
              <PiFlaskLight className="text-4xl" />
            </span>
            <div className="flex-start flex-col">
              <small className="text-xs">{t("lab_number")}</small>
              <h4 className="md:text-lg text-base font-medium">F2H4</h4>
            </div>
          </div>
          <div className="flex_center gap-3">
            <span className="w-[60px] h-[60px] flex-shrink-0 rounded-lg flex_center bg-white bg-opacity-30">
              <RiDashboardHorizontalLine className="text-4xl" />
            </span>
            <div className="flex-start flex-col">
              <small className="text-xs">{t("equipped_with")}</small>
              <h4 className="md:text-lg text-base font-medium">
                Specialized Instruments
              </h4>
            </div>
          </div>
        </div>
        <p className="opacity-70">{t("lab_text")}</p>
        <div className="flex_center gap-10 w-full mt-5 md:flex-row flex-col">
          <div className="flex_start md:w-auto w-full flex-col gap-5">
            <div className="h-10 flex_center gap-2">
              <span className="h-full w-1 bg-golden"></span>
              <span className="h-full w-1 bg-golden"></span>
              <span className="h-full w-1 bg-golden"></span>
            </div>
            {locale === "en" && (
              <h1 className="md:text-[32px] text-xl font-semibold relative">
                Cutting-Edge Medical <br />{" "}
                <span className="text-golden">Research</span> Hub
              </h1>
            )}
            {locale === "ku" && (
              <h1 className="md:text-[32px] text-xl font-semibold relative">
                باشترین ناوەندی پرۆگرامی <br />{" "}
                <span className="text-golden">لێکۆڵینەوەی</span> پزیشکی
              </h1>
            )}
            {locale === "ar" && (
              <h1 className="md:text-[32px] text-xl font-semibold relative">
                مركز الأبحاث <br /> <span className="text-golden">الطبية</span>{" "}
                المتطورة
              </h1>
            )}
          </div>
          <div className="md:h-[360px] h-[260px] md:w-[695px] w-full relative rounded-3xl overflow-hidden">
            <Image
              src={`/images/lab.png`}
              className="object-cover"
              alt="park"
              fill
              priority
            />
            <div className="absolute text-white w-[90%] rounded-3xl md:bottom-5 bottom-1/2 md:translate-y-0 translate-y-1/2 left-1/2 -translate-x-1/2 p-5 bg-primary bg-opacity-70 md:text-base text-sm">
              {t("lab_text")}
            </div>
          </div>
        </div>
        <div className="w-full flex_center gap-10 md:flex-row flex-col-reverse">
          <div className="lg:w-[595px] md:w-[410px] w-full lg:h-[590px] md:h-[420px] h-[340px] relative flex-shrink-0">
            <Image
              src={`/images/lab-1.png`}
              className="object-cover"
              alt="park"
              fill
              priority
            />
          </div>
          <div className="flex_start flex-col gap-5">
            <h1 className="md:text-[32px] text-xl font-semibold">
              {t("ensuring_campus_safety")}
            </h1>
            <p className="md:text-base text-sm">
              {t("ensuring_campus_safety_text")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
