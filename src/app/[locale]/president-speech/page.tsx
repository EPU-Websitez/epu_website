"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Page = () => {
  const t = useTranslations("PresidentSpeech");
  return (
    <div className="w-full flex_center my-10">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-10">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[250px] relative rounded-2xl overflow-hidden sm:block hidden">
          <Image
            src={"/images/president.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
          <p className="absolute bg-golden lg:bg-primary border-white border-4 right-0 sm:bottom-0 -bottom-1 rounded-2xl text-white w-[33%] py-4 text-center lg:text-base md:text-sm text-xs">
            {t("name")}
          </p>
        </div>
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[250px] relative rounded-2xl overflow-hidden sm:hidden block">
          <Image
            src={"/images/president-mobile.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
          <p className="absolute bg-golden border-white border-4 right-0 rounded-2xl text-white sm:bottom-0 -bottom-1 w-[65%] py-2 text-center lg:text-base md:text-sm text-xs">
            {t("name")}
          </p>
        </div>
        <div className="sm:w-[111px] w-14 sm:h-[111px] h-14 relative">
          <Image
            src={"/images/quote.svg"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
        </div>
        <h3 className="text-[#4A4A4A] sm:text-base text-sm">{t("header")}</h3>
        <span className="text-[#4A4A4A] sm:text-base text-sm">{t("text")}</span>
        <div className="w-full flex items-end justify-end">
          <div className="sm:w-[111px] w-14 sm:h-[111px] h-14 relative rotate-180">
            <Image
              src={"/images/quote.svg"}
              alt="My Image"
              fill
              priority
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
