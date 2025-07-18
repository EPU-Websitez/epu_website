"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PiGraduationCap, PiHandshake } from "react-icons/pi";
import { TfiShine } from "react-icons/tfi";

const Page = () => {
  const t = useTranslations("Apply");
  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-10">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full sm:h-[410px] h-[225px] relative">
          <Image
            src="/images/apply.png"
            alt="title"
            fill
            priority
            className="w-full h-auto object-cover sm:rounded-3xl rounded-lg"
          />
          <div className="absolute ltr:left-0 rtl:right-0 top-0 sm:w-[580px] w-[90%] sm:h-[400px] h-full rtl:rotate-180">
            <Image
              src="/images/circle-shape.png"
              alt="title"
              fill
              priority
              className="w-full h-full"
            />
          </div>
          <p className="z-10 absolute top-[30%] text-white ltr:left-[5%] rtl:right-[5%] font-semibold sm:text-lg text-sm sm:max-w-[600px] max-w-[80%]">
            {t("text")}
          </p>
        </div>
        <div className="w-full flex_start flex-col lg:p-10 p-5 rounded-3xl gap-3 bg-gradient-to-r from-primary to-blue text-white">
          <span className="text-sm">{t("question")}</span>
          <h1 className="sm:text-titleNormal text-lg font-semibold relative mb-3">
            {t("why_apply")}
            <span className="absolute right-0 -bottom-2 w-[40%] sm:h-[16px] h-[10px]">
              <Image
                src="/images/title-shape.svg"
                alt="title"
                fill
                priority
                className="w-full h-full"
              />
            </span>
          </h1>
          <div className="flex_center lg:gap-8 gap-3 w-full sm:flex-row flex-col">
            <div className="flex_start flex-col gap-3 sm:w-auto w-full sm:border-none border-b border-b-white sm:pb-0 pb-4">
              <div className="flex_center gap-4">
                <PiGraduationCap className="lg:text-4xl sm:text-2xl text-4xl" />
                <p className="font-medium lg:text-sm text-xs">
                  {t("reason_1")}
                </p>
              </div>
              <p className="sm:max-w-[250px] max-w-full lg:text-xs text-[8px] text-start opacity-75">
                {t("reason_text_1")}
              </p>
            </div>
            <div className="w-[1px] h-[100px] bg-white opacity-75 sm:block hidden"></div>
            <div className="flex_start flex-col gap-3 sm:w-auto w-full sm:border-none border-b border-b-white sm:pb-0 pb-4">
              <div className="flex_center gap-4">
                <PiHandshake className="lg:text-4xl sm:text-2xl text-4xl" />
                <p className="font-medium lg:text-sm text-xs">
                  {t("reason_2")}
                </p>
              </div>
              <p className="sm:max-w-[250px] max-w-full lg:text-xs text-[8px] text-start opacity-75">
                {t("reason_text_1")}
              </p>
            </div>
            <div className="w-[1px] h-[100px] bg-white opacity-75 sm:block hidden"></div>
            <div className="flex_start flex-col gap-3">
              <div className="flex_center gap-4">
                <TfiShine className="lg:text-4xl sm:text-2xl text-4xl" />
                <p className="font-medium lg:text-sm text-xs">
                  {t("reason_3")}
                </p>
              </div>
              <p className="sm:max-w-[250px] max-w-full lg:text-xs text-[8px] text-start opacity-75">
                {t("reason_text_1")}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full bg-backgroundSecondary mt-3 flex_start flex-col gap-8 sm:p-10 p-5 rounded-3xl border border-lightBorder">
          <h4 className="opacity-35 font-semibold">{t("to_apply")}</h4>
          <div className="flex_start gap-5 text-secondary font-medium">
            <span className="flex-shrink-0 w-6 h-6 bg-golden rounded-full"></span>
            <p className="sm:text-base text-sm">{t("list_1")}</p>
          </div>
          <div className="flex_start gap-5 text-secondary font-medium">
            <span className="flex-shrink-0 w-6 h-6 bg-golden rounded-full"></span>
            <p className="sm:text-base text-sm">{t("list_2")}</p>
          </div>
          <div className="flex_start gap-5 text-secondary font-medium">
            <span className="flex-shrink-0 w-6 h-6 bg-golden rounded-full"></span>
            <p className="sm:text-base text-sm">{t("list_2")}</p>
          </div>
          <div className="flex_start gap-5 text-secondary font-medium">
            <span className="flex-shrink-0 w-6 h-6 bg-golden rounded-full"></span>
            <p className="sm:text-base text-sm">{t("list_1")}</p>
          </div>
          <div className="flex_start gap-5 text-secondary font-medium">
            <span className="flex-shrink-0 w-6 h-6 bg-golden rounded-full"></span>
            <p className="sm:text-base text-sm">{t("list_2")}</p>
          </div>
          <div className="flex_start gap-5 text-secondary font-medium">
            <span className="flex-shrink-0 w-6 h-6 bg-golden rounded-full"></span>
            <p className="sm:text-base text-sm">{t("list_1")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
