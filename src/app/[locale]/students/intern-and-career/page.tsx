"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronRight, FaPlay } from "react-icons/fa6";
import { ImLab } from "react-icons/im";
import { IoBriefcaseOutline, IoLocationSharp } from "react-icons/io5";
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
        <div className="flex md:justify-center justify-start md:items-center items-start w-full flex-col gap-5 md:text-center text-start my-10">
          <h2 className="lg:text-3xl relative text-lg font-semibold ">
            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
            <span className="z-10 relative">
              {t("career_development_opportunities")}
            </span>
          </h2>
          <p className="font-medium lg:text-lg text-base">
            {t("career_development_opportunities_text")}
          </p>
        </div>
        <div className="flex md:justify-center justify-start md:items-center items-start gap-10 w-full text-secondary md:flex-row flex-col">
          <div className="flex_start flex-col md:max-w-[390px] max-w-full gap-5">
            <h2 className="font-bold lg:text-titleNormal text-xl">
              {t("enhance_skills")}
            </h2>
            <span>{t("enhance_skills_text")}</span>
          </div>
          <div className="lg:w-1/2 md:w-[60%] w-full flex-shrink-0 relative grid grid-cols-2 gap-5">
            <div className="w-[538px] h-[441px] absolute md:-top-[10px] top-0 md:-left-[39px] left-0">
              <Image
                src={"/images/career-shape.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full bg-white rounded-2xl flex_start flex-col sm:gap-5 gap-2 sm:p-5 p-2 z-10 shadow shadow-[#00000015]">
              <span className="w-10 h-10 rounded bg-secondary bg-opacity-10 text-xl flex_center z-10">
                <LiaUserTieSolid />
              </span>
              <h5 className="sm:text-base text-sm font-medium">
                {t("card_1")}
              </h5>
              <span className="text-xs">{t("card_1_text")}</span>
            </div>
            <div className="w-full bg-white rounded-2xl flex_start flex-col sm:gap-5 gap-2 sm:p-5 p-2 z-10 shadow shadow-[#00000015]">
              <span className="w-10 h-10 rounded bg-secondary bg-opacity-10 text-xl flex_center z-10">
                <MdCoPresent />
              </span>
              <h5 className="sm:text-base text-sm font-medium">
                {t("card_2")}
              </h5>
              <span className="text-xs">{t("card_2_text")}</span>
            </div>
            <div className="w-full bg-white rounded-2xl flex_start flex-col sm:gap-5 gap-2 sm:p-5 p-2 z-10 shadow shadow-[#00000015]">
              <span className="w-10 h-10 rounded bg-secondary bg-opacity-10 text-xl flex_center z-10">
                <IoBriefcaseOutline />
              </span>
              <h5 className="sm:text-base text-sm font-medium">
                {t("card_3")}
              </h5>
              <span className="text-xs">{t("card_3_text")}</span>
            </div>
            <div className="w-full bg-white rounded-2xl flex_start flex-col sm:gap-5 gap-2 sm:p-5 p-2 z-10 shadow shadow-[#00000015]">
              <span className="w-10 h-10 rounded bg-secondary bg-opacity-10 text-xl flex_center z-10">
                <ImLab />
              </span>
              <h5 className="sm:text-base text-sm font-medium">
                {t("card_4")}
              </h5>
              <span className="text-xs">{t("card_4_text")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex_center bg-primary mt-20 text-white flex-col gap-10 relative px-3 md:py-20 py-14">
        <div className="absolute lg:left-40 left-10 md:top-20 top-[20%] w-[58px] h-[47px]">
          <Image
            src={"/images/dialog.svg"}
            alt="My Image"
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -right-5 top-[22%] w-[90px] h-[90px] md:hidden block">
          <Image
            src={"/images/rotate.svg"}
            alt="My Image"
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute right-10 lg:bottom-10 md:bottom-5 bottom-1 lg:w-[70px] w-[50px] lg:h-[80px] h-[60px]">
          <Image
            src={"/images/dialog.svg"}
            alt="My Image"
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>
        {locale === "en" && (
          <h1 className="lg:max-w-[740px] md:max-w-[490px] max-w-[90%] lg:text-title md:text-titleNormal text-2xl text-center">
            Empowering Students to Navigate <br />
            <span className="text-golden">
              Career Paths with Expert Counseling
            </span>{" "}
            Support
          </h1>
        )}
        {locale === "ku" && (
          <h1 className="lg:max-w-[740px] md:max-w-[490px] max-w-[90%] lg:text-title md:text-titleNormal text-2xl text-center">
            پاڵپشتی کردنی خوێندکاران بۆ گەڕان <br />
            <span className="text-golden">
              بە ڕێگاکانی پیشەیی بە پشتگیری ڕاوێژکاری
              <br />
            </span>
            پسپۆڕ
          </h1>
        )}
        {locale === "ar" && (
          <h1 className="lg:max-w-[740px] md:max-w-[490px] max-w-[90%] lg:text-title md:text-titleNormal text-2xl text-center">
            تمكين الطلاب من تحديد
            <br />
            <span className="text-golden">
              مساراتهم المهنية من خلال دعم الاستشارات من
              <br />
            </span>
            الخبراء
          </h1>
        )}
        <div className="grid md:grid-cols-4 grid-cols-2 gap-5 w-full mt-10 max-w-[1040px]">
          <div className="w-full flex_center flex-col gap-3">
            <div className="md:w-[160px] w-[120px] md:h-[175px] h-[130px] relative">
              <div className="absolute ltr:left-0 rtl:right-0 -top-10 w-[70px] h-[45px] md:block hidden">
                <Image
                  src={"/images/dots.svg"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <Image
                src={"/images/img-shape.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full object-cover z-10"
              />
            </div>
            <h4 className="font-semibold mt-2">Prof. Elnnd Selman</h4>
            <span className="text-sm opacity-80 -mt-2">Team Leader</span>
          </div>
          <div className="w-full flex_center flex-col gap-3">
            <div className="md:w-[160px] w-[120px] md:h-[175px] h-[130px] relative">
              <Image
                src={"/images/img-shape.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full object-cover z-10"
              />
            </div>
            <h4 className="font-semibold mt-2">Prof. Elnnd Selman</h4>
            <span className="text-sm opacity-80 -mt-2">Team Leader</span>
          </div>
          <div className="w-full flex_center flex-col gap-3">
            <div className="md:w-[160px] w-[120px] md:h-[175px] h-[130px] relative">
              <div className="absolute ltr:-left-10 rtl:-right-10 -top-10 w-[90px] h-[90px] md:block hidden">
                <Image
                  src={"/images/rotate.svg"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute ltr:-right-10 rtl:-left-10 md:-top-10 top-0 w-[90px] h-[90px] md:hidden block">
                <Image
                  src={"/images/dots.svg"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <Image
                src={"/images/img-shape.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full object-cover z-10"
              />
            </div>
            <h4 className="font-semibold mt-2">Prof. Elnnd Selman</h4>
            <span className="text-sm opacity-80 -mt-2">Team Leader</span>
          </div>
          <div className="w-full flex_center flex-col gap-3">
            <div className="md:w-[160px] w-[120px] md:h-[175px] h-[130px] relative">
              <Image
                src={"/images/img-shape.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full object-cover z-10"
              />
            </div>
            <h4 className="font-semibold mt-2">Prof. Elnnd Selman</h4>
            <span className="text-sm opacity-80 -mt-2">Team Leader</span>
          </div>
        </div>
      </div>
      <div className="max-w-[1040px] px-3 w-full text-secondary flex_start gap-10 flex-col mt-14">
        <h1 className="font-semibold lg:text-titleNormal text-xl">
          {t("explore_jobs")}
        </h1>
        <p className="lg:text-base text-sm">{t("explore_jobs_text")}</p>
        <div className="p-5 rounded-3xl bg-backgroundSecondary w-full">
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-5">
            <div className="p-5 bg-background rounded-3xl w-full flex_start items-center flex-col gap-4">
              <div className="flex_center gap-5">
                <div className="w-[82px] h-[82px] flex_center rounded-xl border border-lightBorder">
                  <div className="w-[60px] h-[60px] relative">
                    <Image
                      src={"/images/career.png"}
                      alt="My Image"
                      fill
                      priority
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h4 className="font-semibold text-lg">UI Designer</h4>
                  <small className="text-xs">Company Name</small>
                </div>
              </div>
              <div className="flex_center gap-3">
                <IoLocationSharp className="text-2xl" />
                <div className="flex_start flex-col">
                  <small className="text-xs opacity-70">Location</small>
                  <p className="text-sm">Karkuk St, Erbil 44001</p>
                </div>
              </div>
              <div className="w-full flex sm:justify-start justify-center sm:items-start items-center gap-3">
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Full Time
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Internship
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Remote
                </p>
              </div>
            </div>
            <div className="p-5 bg-background rounded-3xl w-full flex_start items-center flex-col gap-4">
              <div className="flex_center gap-5">
                <div className="w-[82px] h-[82px] flex_center rounded-xl border border-lightBorder">
                  <div className="w-[60px] h-[60px] relative">
                    <Image
                      src={"/images/career.png"}
                      alt="My Image"
                      fill
                      priority
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h4 className="font-semibold text-lg">UI Designer</h4>
                  <small className="text-xs">Company Name</small>
                </div>
              </div>
              <div className="flex_center gap-3">
                <IoLocationSharp className="text-2xl" />
                <div className="flex_start flex-col">
                  <small className="text-xs opacity-70">Location</small>
                  <p className="text-sm">Karkuk St, Erbil 44001</p>
                </div>
              </div>
              <div className="w-full flex sm:justify-start justify-center sm:items-start items-center gap-3">
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Full Time
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Internship
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Remote
                </p>
              </div>
            </div>
            <div className="p-5 bg-background rounded-3xl w-full flex_start items-center flex-col gap-4">
              <div className="flex_center gap-5">
                <div className="w-[82px] h-[82px] flex_center rounded-xl border border-lightBorder">
                  <div className="w-[60px] h-[60px] relative">
                    <Image
                      src={"/images/career.png"}
                      alt="My Image"
                      fill
                      priority
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h4 className="font-semibold text-lg">UI Designer</h4>
                  <small className="text-xs">Company Name</small>
                </div>
              </div>
              <div className="flex_center gap-3">
                <IoLocationSharp className="text-2xl" />
                <div className="flex_start flex-col">
                  <small className="text-xs opacity-70">Location</small>
                  <p className="text-sm">Karkuk St, Erbil 44001</p>
                </div>
              </div>
              <div className="w-full flex sm:justify-start justify-center sm:items-start items-center gap-3">
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Full Time
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Internship
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Remote
                </p>
              </div>
            </div>
            <div className="p-5 bg-background rounded-3xl w-full flex_start items-center flex-col gap-4">
              <div className="flex_center gap-5">
                <div className="w-[82px] h-[82px] flex_center rounded-xl border border-lightBorder">
                  <div className="w-[60px] h-[60px] relative">
                    <Image
                      src={"/images/career.png"}
                      alt="My Image"
                      fill
                      priority
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h4 className="font-semibold text-lg">UI Designer</h4>
                  <small className="text-xs">Company Name</small>
                </div>
              </div>
              <div className="flex_center gap-3">
                <IoLocationSharp className="text-2xl" />
                <div className="flex_start flex-col">
                  <small className="text-xs opacity-70">Location</small>
                  <p className="text-sm">Karkuk St, Erbil 44001</p>
                </div>
              </div>
              <div className="w-full flex sm:justify-start justify-center sm:items-start items-center gap-3">
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Full Time
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Internship
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Remote
                </p>
              </div>
            </div>
            <div className="p-5 bg-background rounded-3xl w-full flex_start items-center flex-col gap-4">
              <div className="flex_center gap-5">
                <div className="w-[82px] h-[82px] flex_center rounded-xl border border-lightBorder">
                  <div className="w-[60px] h-[60px] relative">
                    <Image
                      src={"/images/career.png"}
                      alt="My Image"
                      fill
                      priority
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h4 className="font-semibold text-lg">UI Designer</h4>
                  <small className="text-xs">Company Name</small>
                </div>
              </div>
              <div className="flex_center gap-3">
                <IoLocationSharp className="text-2xl" />
                <div className="flex_start flex-col">
                  <small className="text-xs opacity-70">Location</small>
                  <p className="text-sm">Karkuk St, Erbil 44001</p>
                </div>
              </div>
              <div className="w-full flex sm:justify-start justify-center sm:items-start items-center gap-3">
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Full Time
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Internship
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Remote
                </p>
              </div>
            </div>
            <div className="p-5 bg-background rounded-3xl w-full flex_start items-center flex-col gap-4">
              <div className="flex_center gap-5">
                <div className="w-[82px] h-[82px] flex_center rounded-xl border border-lightBorder">
                  <div className="w-[60px] h-[60px] relative">
                    <Image
                      src={"/images/career.png"}
                      alt="My Image"
                      fill
                      priority
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h4 className="font-semibold text-lg">UI Designer</h4>
                  <small className="text-xs">Company Name</small>
                </div>
              </div>
              <div className="flex_center gap-3">
                <IoLocationSharp className="text-2xl" />
                <div className="flex_start flex-col">
                  <small className="text-xs opacity-70">Location</small>
                  <p className="text-sm">Karkuk St, Erbil 44001</p>
                </div>
              </div>
              <div className="w-full flex sm:justify-start justify-center sm:items-start items-center gap-3">
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Full Time
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Internship
                </p>
                <p className="px-2 py-1.5 bg-black bg-opacity-15 text-xs rounded-lg">
                  Remote
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-10 flex_center flex-col gap-10 w-full">
        <h4 className="font-semibold text-lg text-golden">
          {t("successful_stories")}
        </h4>
        <h2 className="lg:text-3xl text-xl font-bold lg:max-w-[840px] sm:max-w-[500px] max-w-[90%] text-center text-secondary">
          {t("successful_stories_text")}
        </h2>
        <div className="relative w-full lg:h-[500px] sm:h-[300px] h-[200px]">
          <Image
            src={"/images/story.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
export default Page;
