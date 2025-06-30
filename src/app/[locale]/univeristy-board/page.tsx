"use client";
import MemberCard from "@/components/memberCard";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Page = () => {
  const t = useTranslations("UniversityBoard");
  return (
    <div className="mb-10 -mt-5 flex_center w-full flex-col">
      <div className="w-full lg:h-[610px] sm:h-[500px] h-[560px] relative bg-primary flex justify-center items-start">
        <span className="w-5 h-5 bg-golden absolute left-[10%] top-[20%] rounded-full z-10"></span>
        <span className="w-8 h-8 bg-golden absolute left-[20%] bottom-[15%] rounded-full z-10"></span>
        <span className="w-5 h-5 bg-golden absolute left-[45%] bottom-[40%] rounded-full z-10"></span>
        <span className="w-5 h-5 bg-golden absolute right-[10%] bottom-[50%] rounded-full z-10"></span>
        <span className="w-8 h-8 bg-golden absolute right-[30%] top-[6%] rounded-full z-10"></span>
        <Image
          src="/images/bg.png"
          alt="title"
          fill
          priority
          className="w-full h-auto object-cover"
        />
        <div className="max-w-[1024px] w-full flex justify-between items-start sm:gap-10 gap-5 sm:mt-20 mt-10 text-white z-10 px-3 sm:flex-row flex-col">
          <div className="flex_start flex-col sm:gap-10 gap-5">
            <div className="flex_center gap-3">
              <span className="w-14 h-[2px] bg-golden rounded-md"></span>
              <h2 className="text-golden font-medium lg:text-titleNormal sm:text-smallTitle text-base">
                {t("head")}
              </h2>
            </div>
            <h1 className="max-w-[450px] lg:text-title text-titleNormal font-bold">
              {t("title")}
            </h1>
            <h4 className="lg:text-xl text-base sm:block hidden">
              {t("name")}
            </h4>
          </div>
          <div className="relative lg:w-[520px] sm:w-[396px] w-full lg:h-[465px] sm:h-[330px] h-[225px]">
            <Image
              src="/images/president-alt.png"
              alt="title"
              fill
              priority
              className="w-full h-auto object-cover"
            />
          </div>
          <h4 className="lg:text-xl text-base sm:hidden block">{t("name")}</h4>
        </div>
      </div>
      <div className="max-w-[1024px] w-full flex_center flex-col gap-10 my-10 px-3">
        <div className="flex_center gap-5 w-full">
          <div className="w-full h-[1px] bg-primary relative"></div>
          <h2 className="sm:text-titleNormal text-xl font-medium text-primary text-center flex-shrink-0">
            {t("council_members")}
          </h2>
          <div className="w-full h-[1px] bg-primary relative"></div>
        </div>

        <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
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
