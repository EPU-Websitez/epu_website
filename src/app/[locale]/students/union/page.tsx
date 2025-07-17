"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import {
  FaBoltLightning,
  FaChevronRight,
  FaHandHoldingHeart,
  FaMicrophone,
  FaPlay,
} from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

const Page = () => {
  const t = useTranslations("Students");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1024px] md:px-3 px-8 text-secondary flex_start flex-col gap-5 w-full">
        <SubHeader title={t("union")} alt={false} />
        <div className="w-full flex md:flex-row flex-col justify-between md:items-center items-start gap-10">
          <h1 className="lg:text-[70px] sm:text-[55px] text-[40px]">
            {t("teach")} <br className="md:block hidden" /> {t("learn")} <br />
            {t("grow")}
          </h1>
          <div className="flex_center gap-5 md:w-auto w-full md:flex-row flex-col">
            <div className="lg:w-[420px] md:w-[350px] w-full lg:h-[430px] md:h-[360px] h-[245px] relative rounded-3xl overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black to-transparent flex justify-start items-center z-10">
                <h3 className="text-white text-smallTitle font-medium pl-3 pr-1 relative">
                  <span className="relative z-10">{t("collaboration")}</span>
                  <span className="w-full absolute left-0 h-2 bg-golden bottom-1"></span>
                </h3>
              </div>
              <Image
                src={"/images/union.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:w-[250px] md:w-[208px] w-full lg:h-[430px] md:h-[360px] h-[245px] relative rounded-3xl overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black to-transparent flex justify-start items-center z-10">
                <h3 className="text-white text-lg font-medium pl-3 pr-1 relative">
                  <span className="relative z-10">{t("learning")}</span>
                  <span className="w-full absolute left-0 h-2 bg-golden bottom-1"></span>
                </h3>
              </div>
              <Image
                src={"/images/union-1.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex_center w-full mt-10">
          <h3 className="sm:text-titleNormal text-base font-semibold relative text-center">
            <span className="relative z-10">{t("student_achievement")}</span>
            <span className="w-full absolute left-0 h-3 bg-golden bottom-2"></span>
          </h3>
        </div>
        <p className="text-center sm:text-lg text-sm px-10 font-medium">
          {t("student_achievement_text")}
        </p>
        <div className="grid w-full lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 mt-10 mb-20">
          <div className="p-5 rounded-3xl border border-lightBorder text-center flex_center flex-col gap-5">
            <div className="flex_center text-3xl rounded-full w-[50px] h-[50px] text-white bg-golden">
              <FaBoltLightning />
            </div>
            <h4 className="font-semibold">{t("card_union_1")}</h4>
            <small className="text-xs">{t("card_union_1_text")}</small>
          </div>
          <div className="p-5 rounded-3xl border border-lightBorder text-center flex_center flex-col gap-5">
            <div className="flex_center text-3xl rounded-full w-[50px] h-[50px] text-white bg-golden">
              <IoSearch />
            </div>
            <h4 className="font-semibold">{t("card_union_2")}</h4>
            <small className="text-xs">{t("card_union_2_text")}</small>
          </div>
          <div className="p-5 rounded-3xl border border-lightBorder text-center flex_center flex-col gap-5">
            <div className="flex_center text-3xl rounded-full w-[50px] h-[50px] text-white bg-golden">
              <FaMicrophone />
            </div>
            <h4 className="font-semibold">{t("card_union_3")}</h4>
            <small className="text-xs">{t("card_union_3_text")}</small>
          </div>
          <div className="p-5 rounded-3xl border border-lightBorder text-center flex_center flex-col gap-5">
            <div className="flex_center text-3xl rounded-full w-[50px] h-[50px] text-white bg-golden">
              <FaHandHoldingHeart />
            </div>
            <h4 className="font-semibold">{t("card_union_4")}</h4>
            <small className="text-xs">{t("card_union_4_text")}</small>
          </div>
        </div>
        <div className="flex_center md:flex-row flex-col gap-10 w-full mb-10">
          <h2 className="lg:text-titleNormal md:hidden block text-smallTitle font-semibold">
            {t("about_union")}
          </h2>
          <div className="lg:w-[510px] md:w-[475px] w-full flex-shrink-0 lg:h-[328px] md:h-[293px] h-[226px] relative">
            <button className="flex_center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white rounded-full text-xl bg-gradient-to-r from-[#DCC48C] to-[#FFA64D] z-10">
              <FaPlay />
            </button>
            <span className="w-9 h-9 rounded-full bg-primary absolute ltr:-right-5 rtl:-left-5 -bottom-5 z-10"></span>
            <Image
              src={"/images/union-2.png"}
              alt="My Image"
              fill
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex_start flex-col gap-8">
            <h2 className="lg:text-titleNormal md:block hidden text-smallTitle font-semibold">
              {t("about_union")}
            </h2>
            <p className="text-sm">{t("about_union_text")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
