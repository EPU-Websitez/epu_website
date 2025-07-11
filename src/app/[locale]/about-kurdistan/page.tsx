"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Page = () => {
  const t = useTranslations("AboutKurdistan");
  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-10">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[300px] relative">
          <Image
            src={"/images/kurdistan.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="font-semibold sm:text-titleNormal text-xl text-secondary">
          {t("general_background")}
        </h2>
        <span className="text-secondary text-opacity-70 sm:text-smallParagraph text-xs -mt-5">
          {t("general_text")}
        </span>
        <div className="flex_start gap-10 w-full md:flex-row flex-col mt-20">
          <div className="w-1/2 h-[380px] relative md:block hidden">
            <Image
              src={"/images/kurdistan-nature.png"}
              alt="My Image"
              fill
              priority
              className="w-full h-full"
            />
          </div>
          <div className="flex_start flex-col mt-5 gap-5 text-secondary md:w-1/2 w-full">
            <h3 className="relative font-semibold z-10 sm:text-titleNormal text-xl md:ltr:-ml-5 ltr:ml-5 md:rtl:-mr-5 rtl:m-5">
              <span className="z-10 relative">{t("nature")}</span>
              <span className="md:w-full w-[110%] h-[14px] absolute md:ltr:right-[30%] ltr:right-0 md:rtl:left-[30%] rtl:right-0 bottom-2 bg-golden"></span>
            </h3>
            <div className="w-full sm:h-[380px] h-[300px] md:hidden block relative">
              <Image
                src={"/images/kurdistan-nature.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full"
              />
            </div>
            <span className="sm:text-sm text-xs opacity-70 font-medium">
              {t("general_text")}
            </span>
          </div>
        </div>
        <div className="flex_center gap-10 w-full md:flex-row flex-col mt-10">
          <div className="flex_start flex-col gap-5 text-secondary md:w-1/2 w-full">
            <h3 className="relative font-semibold z-10 sm:text-titleNormal text-xl">
              {t("culture")}
            </h3>
            <div className="w-full sm:h-[380px] h-[300px] md:hidden block relative">
              <Image
                src={"/images/kurdistan-nature.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full"
              />
            </div>
            <span className="sm:text-sm text-xs font-medium opacity-70">
              {t("general_text")}
            </span>
          </div>
          <div className="w-1/2 h-[380px] relative md:block hidden">
            <Image
              src={"/images/kurdistan-culture.png"}
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
