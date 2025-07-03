"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronRight, FaPlay } from "react-icons/fa6";
import { ImLab } from "react-icons/im";
import { IoBriefcaseOutline } from "react-icons/io5";
import { LiaSwimmerSolid, LiaUserTieSolid } from "react-icons/lia";
import { LuLibraryBig } from "react-icons/lu";
import { MdCoPresent } from "react-icons/md";
import { TbOlympics } from "react-icons/tb";

const Page = () => {
  const t = useTranslations("Students");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-5 w-full">
        <SubHeader title={t("intern_and_career")} alt={false} />
        <div className="w-full lg:h-[373px] h-[290px] relative sm:mt-10 mt-5 rounded-3xl overflow-hidden">
          <Image
            src={"/images/accomodation.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex_center w-full flex-col gap-5 text-center my-10">
          <h2 className="md:text-3xl relative text-lg font-semibold ">
            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
            <span className="z-10 relative">
              {t("career_development_opportunities")}
            </span>
          </h2>
          <p className="font-medium text-lg">
            {t("career_development_opportunities_text")}
          </p>
        </div>
        <div className="flex_center gap-10 w-full text-secondary">
          <div className="flex_start flex-col max-w-[390px] gap-5">
            <h2 className="font-bold text-titleNormal">
              {t("enhance_skills")}
            </h2>
            <span>{t("enhance_skills_text")}</span>
          </div>
          <div className="w-1/2 relative grid grid-cols-2 gap-5">
            <div className="w-[538px] h-[441px] absolute -top-[10px] -left-[39px]">
              <Image
                src={"/images/career-shape.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full bg-white rounded-2xl flex_start flex-col gap-5 p-5 z-10 shadow shadow-[#00000015]">
              <span className="w-10 h-10 rounded bg-secondary bg-opacity-10 text-xl flex_center z-10">
                <LiaUserTieSolid />
              </span>
              <h5 className="text-base font-medium">
                Personalized Career Counseling
              </h5>
              <span className="text-xs">
                Tailored guidance to align academic pursuits with career goals.
              </span>
            </div>
            <div className="w-full bg-white rounded-2xl flex_start flex-col gap-5 p-5 z-10 shadow shadow-[#00000015]">
              <span className="w-10 h-10 rounded bg-secondary bg-opacity-10 text-xl flex_center z-10">
                <MdCoPresent />
              </span>
              <h5 className="text-base font-medium">
                Personalized Career Counseling
              </h5>
              <span className="text-xs">
                Tailored guidance to align academic pursuits with career goals.
              </span>
            </div>
            <div className="w-full bg-white rounded-2xl flex_start flex-col gap-5 p-5 z-10 shadow shadow-[#00000015]">
              <span className="w-10 h-10 rounded bg-secondary bg-opacity-10 text-xl flex_center z-10">
                <IoBriefcaseOutline />
              </span>
              <h5 className="text-base font-medium">
                Personalized Career Counseling
              </h5>
              <span className="text-xs">
                Tailored guidance to align academic pursuits with career goals.
              </span>
            </div>
            <div className="w-full bg-white rounded-2xl flex_start flex-col gap-5 p-5 z-10 shadow shadow-[#00000015]">
              <span className="w-10 h-10 rounded bg-secondary bg-opacity-10 text-xl flex_center z-10">
                <ImLab />
              </span>
              <h5 className="text-base font-medium">
                Personalized Career Counseling
              </h5>
              <span className="text-xs">
                Tailored guidance to align academic pursuits with career goals.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
