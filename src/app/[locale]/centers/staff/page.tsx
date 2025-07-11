"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BsFillTriangleFill } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { FaChevronRight } from "react-icons/fa6";

const Page = () => {
  const t = useTranslations("Centers");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex justify-center items-start sm:my-10 my-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <div className="w-full flex_start">
          <SubHeader title={t("lang_center")} alt={false} />
        </div>
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative sm:mt-14 mt-6">
          <div className="absolute lg:-top-14 top-10 ltr:left-10 right-10 sm:flex hidden flex-col max-w-[520px] z-10 p-4">
            <h2 className="bg-primary  text-white text-xl font-semibold z-10 p-5">
              {t("build_edu")}
            </h2>
            {/* <BsFillTriangleFill className="text-8xl -mt-14 rotate-90 -ml-1.5" /> */}
            <div className="triangle -mt-14 rotate-90"></div>
          </div>
          <Image
            src={"/images/center.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
        </div>
        <div className="md:w-[720px] w-full sm:h-[50px] my-10 h-[35px] grid grid-cols-3 justify-center items-center bg-lightBorder text-secondary rounded-3xl">
          <Link
            title={t("vision_mission")}
            href={`/${locale}/centers/vision-and-mission`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("vision_mission")}
          </Link>
          <p className="bg-primary text-white rounded-3xl h-full flex_center sm:text-lg text-sm font-medium">
            {t("staff")}
          </p>
          <Link
            title={t("news")}
            href={`/${locale}/centers/news`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("news")}
          </Link>
        </div>
        <div className="flex_start w-full flex-col gap-10">
          <h2 className="md:text-3xl relative text-lg font-semibold ">
            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
            <span className="z-10 relative">{t("staff_members")}</span>
          </h2>
          <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 gap-5 text-secondary text-center">
            <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
              <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
                <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                  <Image
                    src={"/images/president-alt.png"}
                    alt="My Image"
                    fill
                    priority
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold px-5">
                Prof. DR. Nadhim Hassan Aziz
              </h3>
              <span className="opacity-70 mb-3 px-5 text-sm">
                The Director of EPU Language Centre
              </span>
              <a
                href="#"
                className="flex_center gap-3 w-full py-5 px-5 border-t border-t-lightBorder"
              >
                <CiMail className="text-xl" />
                <span className="text-sm opacity-70">
                  nadhimhassan123@epu.edu.iq
                </span>
              </a>
            </div>
            <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
              <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
                <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                  <Image
                    src={"/images/president-alt.png"}
                    alt="My Image"
                    fill
                    priority
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold px-5">
                Prof. DR. Nadhim Hassan Aziz
              </h3>
              <span className="opacity-70 mb-3 px-5 text-sm">
                The Director of EPU Language Centre
              </span>
              <a
                href="#"
                className="flex_center gap-3 w-full py-5 px-5 border-t border-t-lightBorder"
              >
                <CiMail className="text-xl" />
                <span className="text-sm opacity-70">
                  nadhimhassan123@epu.edu.iq
                </span>
              </a>
            </div>
            <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
              <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
                <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                  <Image
                    src={"/images/president-alt.png"}
                    alt="My Image"
                    fill
                    priority
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold px-5">
                Prof. DR. Nadhim Hassan Aziz
              </h3>
              <span className="opacity-70 mb-3 px-5 text-sm">
                The Director of EPU Language Centre
              </span>
              <a
                href="#"
                className="flex_center gap-3 w-full py-5 px-5 border-t border-t-lightBorder"
              >
                <CiMail className="text-xl" />
                <span className="text-sm opacity-70">
                  nadhimhassan123@epu.edu.iq
                </span>
              </a>
            </div>
            <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
              <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
                <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                  <Image
                    src={"/images/president-alt.png"}
                    alt="My Image"
                    fill
                    priority
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold px-5">
                Prof. DR. Nadhim Hassan Aziz
              </h3>
              <span className="opacity-70 mb-3 px-5 text-sm">
                The Director of EPU Language Centre
              </span>
              <a
                href="#"
                className="flex_center gap-3 w-full py-5 px-5 border-t border-t-lightBorder"
              >
                <CiMail className="text-xl" />
                <span className="text-sm opacity-70">
                  nadhimhassan123@epu.edu.iq
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
