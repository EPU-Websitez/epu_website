import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { IoBriefcaseOutline } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";

const page = () => {
  const t = useTranslations("About");
  return (
    <div className="w-full flex_center my-10">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("history")} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[300px] relative">
          <Image
            src={"/images/campus.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
        </div>
        <p className="text-secondary font-medium">{t("history_text")}</p>
        <div className="flex justify-between items-center gap-3 w-full border-b border-b-golden pb-10 lg:flex-row flex-col lg:px-0 px-3">
          <div className="flex_start flex-col gap-5 lg:w-auto w-full">
            <h5 className="text-sm text-secondary font-medium">
              {t("uni_stages")}
            </h5>
            <div className="flex_start flex-col gap-5 relative after:absolute after:h-[80%] ltr:after:left-0 rtl:after:right-0 after:top-0 after:w-[1px] after:bg-golden ltr:pl-5 rtl:pr-5">
              <div className="flex_start flex-col gap-1 relative">
                <span className="absolute top-0 ltr:-left-[34px] rtl:-right-[34px] z-10 border-2 border-golden w-7 h-7 rounded-full bg-white"></span>
                <span className="absolute top-1.5 ltr:-left-[28px] rtl:-right-[28px] z-20 bg-golden w-4 h-4 rounded-full"></span>
                <h1 className="text-titleNormal text-golden">1993</h1>
                <p className="text-secondary max-w-[380px]">{t("stage_1")}</p>
              </div>
              <div className="flex_start flex-col gap-1 relative">
                <span className="absolute top-1 ltr:-left-[34px] rtl:-right-[34px] z-10 border-2 border-golden w-7 h-7 rounded-full bg-white"></span>
                <span className="absolute top-2.5 ltr:-left-[28px] rtl:-right-[28px] z-20 bg-golden w-4 h-4 rounded-full"></span>
                <h1 className="text-titleNormal text-golden">1996</h1>
                <p className="text-secondary max-w-[380px]">{t("stage_2")}</p>
              </div>
              <div className="flex_start flex-col gap-1 relative">
                <span className="absolute top-1 ltr:-left-[34px] rtl:-right-[34px] z-10 border-2 border-golden w-7 h-7 rounded-full bg-white"></span>
                <span className="absolute top-2.5 ltr:-left-[28px] rtl:-right-[28px] z-20 bg-golden w-4 h-4 rounded-full"></span>
                <h1 className="text-titleNormal text-golden">2012</h1>
                <p className="text-secondary max-w-[380px]">{t("stage_3")}</p>
              </div>
            </div>
          </div>
          <div className="flex_center lg:w-auto w-full">
            <div className="lg:w-[220px] w-1/2 h-[330px] relative">
              <Image
                src={"/images/about-stage-1.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full"
              />
            </div>
            <div className="lg:w-[220px] w-1/2 h-[330px] relative">
              <Image
                src={"/images/about-stage-2.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        <h1 className="sm:text-title text-titleNormal font-semibold text-secondary">
          {t("head")}
        </h1>
        <p className="text-secondary font-semibold">{t("about_text")}</p>
        <div className="sm:px-10 px-0 flex_start flex-col gap-5 text-secondary font-medium">
          <div className="flex_start gap-5">
            <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
            <p>{t("about_list_1")}</p>
          </div>
          <div className="flex_start gap-5">
            <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
            <p>{t("about_list_2")}</p>
          </div>
          <div className="flex_start gap-5">
            <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
            <p>{t("about_list_3")}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-4 grid-cols-2 lg:gap-5 sm:gap-2 gap-5 justify-between w-full my-10 lg:px-10 px-3 text-secondary">
          <div className="flex_center flex-col gap-2">
            <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
              <PiStudent />
            </span>
            <h1 className="text-title font-medium">+ 3.12K</h1>
            <p className="font-medium">{t("students")}</p>
          </div>
          <div className="flex_center flex-col gap-2">
            <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
              <IoBriefcaseOutline />
            </span>
            <h1 className="text-title font-medium">+ 239</h1>
            <p className="font-medium">{t("teachers")}</p>
          </div>
          <div className="flex_center flex-col gap-2">
            <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
              <HiOutlineBuildingOffice />
            </span>
            <h1 className="text-title font-medium">+ 300</h1>
            <p className="font-medium">{t("academics")}</p>
          </div>
          <div className="flex_center flex-col gap-2">
            <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
              <PiStudent />
            </span>
            <h1 className="text-title font-medium">+ 2.4K</h1>
            <p className="font-medium">{t("staff_members")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
