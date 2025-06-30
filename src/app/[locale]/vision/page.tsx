"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Page = () => {
  const t = useTranslations("Vision");
  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[300px] relative">
          <Image
            src={"/images/campus.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
        </div>
        <h3 className="font-medium text-secondary">{t("title")}</h3>
        <div className="flex_start gap-5 w-full">
          <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
          <p>{t("list_1")}</p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
          <p>{t("list_2")}</p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
          <p>{t("list_1")}</p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
          <p>{t("list_2")}</p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
          <p>{t("list_1")}</p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
          <p>{t("list_2")}</p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
          <p>{t("list_1")}</p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
          <p>{t("list_2")}</p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
          <p>{t("list_1")}</p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-6 h-6 rounded-full bg-golden flex-shrink-0"></span>
          <p>{t("list_2")}</p>
        </div>
      </div>
    </div>
  );
};
export default Page;
