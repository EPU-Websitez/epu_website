"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Page = () => {
  const t = useTranslations("Mission");
  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] sm:px-3 px-5 w-full flex_start flex-col gap-10">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative">
          <Image
            src={"/images/campus.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
        </div>
        <h3 className="font-semibold text-secondary sm:text-base text-sm">
          {t("title")}
        </h3>
        <div className="flex_start gap-5 w-full">
          <span className="w-5 h-5 rounded-full bg-golden flex-shrink-0"></span>
          <p className="text-secondary text-opacity-70 text-sm">
            {t("list_1")}
          </p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-5 h-5 rounded-full bg-golden flex-shrink-0"></span>
          <p className="text-secondary text-opacity-70 text-sm">
            {t("list_2")}
          </p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-5 h-5 rounded-full bg-golden flex-shrink-0"></span>
          <p className="text-secondary text-opacity-70 text-sm">
            {t("list_1")}
          </p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-5 h-5 rounded-full bg-golden flex-shrink-0"></span>
          <p className="text-secondary text-opacity-70 text-sm">
            {t("list_2")}
          </p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-5 h-5 rounded-full bg-golden flex-shrink-0"></span>
          <p className="text-secondary text-opacity-70 text-sm">
            {t("list_1")}
          </p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-5 h-5 rounded-full bg-golden flex-shrink-0"></span>
          <p className="text-secondary text-opacity-70 text-sm">
            {t("list_2")}
          </p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-5 h-5 rounded-full bg-golden flex-shrink-0"></span>
          <p className="text-secondary text-opacity-70 text-sm">
            {t("list_1")}
          </p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-5 h-5 rounded-full bg-golden flex-shrink-0"></span>
          <p className="text-secondary text-opacity-70 text-sm">
            {t("list_2")}
          </p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-5 h-5 rounded-full bg-golden flex-shrink-0"></span>
          <p className="text-secondary text-opacity-70 text-sm">
            {t("list_1")}
          </p>
        </div>
        <div className="flex_start gap-5 w-full">
          <span className="w-5 h-5 rounded-full bg-golden flex-shrink-0"></span>
          <p className="text-secondary text-opacity-70 text-sm">
            {t("list_2")}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Page;
