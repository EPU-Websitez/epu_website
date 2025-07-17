"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronRight, FaPlay } from "react-icons/fa6";
import { LiaSwimmerSolid } from "react-icons/lia";
import { LuLibraryBig } from "react-icons/lu";
import { TbOlympics } from "react-icons/tb";

const Page = () => {
  const t = useTranslations("Students");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-5 w-full">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full lg:h-[373px] h-[290px] relative sm:mt-10 mt-5 rounded-3xl overflow-hidden">
          <Image
            src={"/images/campus.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full object-cover"
          />
          <div className="absolute left-0 top-0 w-full bg-secondary text-white bg-opacity-70 h-full sm:p-10 p-7 flex_start flex-col sm:gap-20 gap-5">
            <h2 className="lg:text-smallTitle sm:text-lg text-sm font-semibold">
              {t("text")}
            </h2>
            <div className="flex_start gap-5 w-full flex-wrap">
              <div className="flex_center gap-3">
                <span className="w-[35px] h-[35px] flex_center rounded-md bg-white text-secondary text-lg">
                  <TbOlympics />
                </span>
                <div className="flex_start flex-col">
                  <span className="opacity-75 text-xs">{t("stadiums")}</span>
                  <p className="text-sm">+ 18 {t("stadiums")}</p>
                </div>
              </div>
              <div className="flex_center gap-3">
                <span className="w-[35px] h-[35px] flex_center rounded-md bg-white text-secondary text-lg">
                  <LiaSwimmerSolid />
                </span>
                <div className="flex_start flex-col">
                  <span className="opacity-75 text-xs">{t("pools")}</span>
                  <p className="text-sm">+ 18 {t("pools")}</p>
                </div>
              </div>
              <div className="flex_center gap-3">
                <span className="w-[35px] h-[35px] flex_center rounded-md bg-white text-secondary text-lg">
                  <LuLibraryBig />
                </span>
                <div className="flex_start flex-col">
                  <span className="opacity-75 text-xs">{t("libraries")}</span>
                  <p className="text-sm">+ 18 {t("libraries")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex_center md:flex-row flex-col lg:gap-10 gap-6 my-10 text-secondary">
          <div className="flex_start flex-col gap-3">
            <h1 className="lg:text-titleNormal text-xl font-semibold relative">
              {t("libraries_at_EPU")}
              <div className="sm:w-[50px] w-[30px] sm:h-[40px] h-[20px] absolute ltr:lg:-right-7 rtl:lg:-left-7 ltr:right-0 rtl:left-0 lg:-top-7 sm:-top-9 -top-5">
                <Image
                  src="/images/alumni-shape.svg"
                  alt="shape"
                  fill
                  sizes="100px"
                  priority
                />
              </div>
            </h1>
            <span className="text-sm max-w-[440px] opacity-70">
              {t("library_text")}
            </span>
            <div className="flex_start flex-col gap-3 mt-7">
              <div className="flex_center gap-3">
                <span className="w-4 h-4 flex-shrink-0 bg-golden rounded-full"></span>
                <p className="text-sm">{t("study_spaces")}</p>
              </div>
              <div className="flex_center gap-3">
                <span className="w-4 h-4 flex-shrink-0 bg-golden rounded-full"></span>
                <p className="text-sm">{t("technology_access")}</p>
              </div>
              <div className="flex_center gap-3">
                <span className="w-4 h-4 flex-shrink-0 bg-golden rounded-full"></span>
                <p className="text-sm">{t("library_house")}</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full lg:h-[460px] sm:h-[400px] h-[340px] relative mt-10 rounded-3xl overflow-hidden">
            <Image
              src={"/images/libraries.png"}
              alt="My Image"
              fill
              priority
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="w-full flex_center md:flex-row flex-col-reverse gap-5 sm:my-10 my-5 text-secondary">
          <div className="md:w-[400px] w-full lg:h-[460px] sm:h-[400px] h-[340px] relative mt-10 rounded-3xl flex-shrink-0">
            <Image
              src={"/images/bycicle.png"}
              alt="My Image"
              fill
              priority
              className="w-full h-full object-cover"
            />
            <span className="w-10 h-10 bg-golden absolute top-8 rotate-[-14deg] right-7"></span>
            <span className="w-10 h-10 bg-primary absolute bottom-12 rotate-[-16deg] right-0"></span>
          </div>
          <div className="flex_start flex-col gap-3">
            <span className="text-xs relative">
              {t("university_sports_stadiums")}
            </span>
            <h2 className="lg:text-titleNormal text-xl font-semibold">
              {t("university_sports_stadiums_text")}
            </h2>
          </div>
        </div>
        <div className="w-full flex_center md:flex-row flex-col gap-10 sm:my-10 my-5 text-secondary">
          <div className="flex_start flex-col gap-3">
            <h1 className="lg:text-titleNormal text-lg font-semibold relative">
              {t("beautiful_campus_parks")}
              <div className="w-full sm:h-[30px] h-[20px] absolute left-0 -bottom-4">
                <Image
                  src="/images/title-shape.svg"
                  alt="shape"
                  fill
                  sizes="100px"
                  priority
                />
              </div>
            </h1>
            <span className="sm:text-base text-sm max-w-[440px] opacity-70">
              {t("beautiful_campus_parks_text")}
            </span>
            <a
              href="#"
              className="flex_center gap-5 bg-gradient-to-r from-blue to-primary rounded-3xl py-3 px-10 text-white mt-10"
            >
              <span>{t("see_on_map")}</span>
              <FaChevronRight className="text-xl" />
            </a>
          </div>
          <div className="md:w-[60%] w-full lg:h-[314px] md:h-[200px] h-[220px] relative mt-10 rounded-3xl overflow-hidden">
            <Image
              src="/images/park.png"
              alt="title"
              fill
              priority
              className="w-full h-auto object-cover"
            />
            <button className="flex_center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white rounded-full text-xl bg-gradient-to-r from-[#DCC48C] to-[#FFA64D] z-10">
              <FaPlay />
            </button>
          </div>
        </div>
        <div className="w-full relative md:h-[550px] h-[500px] sm:my-10 my-5 text-white">
          <div className="absolute left-0 top-0 w-full h-full bg-black opacity-35 z-10"></div>
          <Image
            src="/images/group.png"
            alt="title"
            fill
            priority
            className="w-full h-auto object-cover "
          />
          <div className="flex_start flex-col gap-5 z-20 absolute ltr:sm:left-10 ltr:left-5 rtl:sm:right-10 rtl:right-5 md:top-[30%] top-5">
            <h1 className="font-semibold md:text-titleNormal text-xl">
              {t("campus_life_through_the_lens")}
            </h1>
            <span className="md:text-lg text-sm max-w-[380px]">
              {t("campus_life_through_the_lens_text")}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full sm:h-[760px] h-auto relative flex justify-center items-start my-10 bg-[#fff] ">
        <div className="w-full sm:h-full h-[300px] absolute top-0 left-0">
          <Image src="/images/map.png" alt="map" fill priority />
        </div>
        <div className="  flex_start z-10 w-[1024px] h-full text-secondary overflow-y-auto">
          <div className="flex_start flex-col sm:gap-3 gap-2 bg-white p-5  bg-opacity-75 max-w-[405px] h-full">
            <h5>{t("campuses")}</h5>
            <h1 className="text-xl font-semibold border-b border-b-lightBorder pb-5">
              {t("campuses_text")}
            </h1>
            <div className="grid grid-cols-2 gap-5 w-full mt-5">
              <div className="w-full h-[240px] relative">
                <Image
                  src="/images/about-stage-2.png"
                  alt="map"
                  fill
                  priority
                />
              </div>
              <div className="w-full h-[240px] relative">
                <Image
                  src="/images/about-stage-2.png"
                  alt="map"
                  fill
                  priority
                />
              </div>
              <div className="w-full h-[240px] relative">
                <Image
                  src="/images/about-stage-2.png"
                  alt="map"
                  fill
                  priority
                />
              </div>
              <div className="w-full h-[240px] relative">
                <Image
                  src="/images/about-stage-2.png"
                  alt="map"
                  fill
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
