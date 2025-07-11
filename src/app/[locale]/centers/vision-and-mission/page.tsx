"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BsFillTriangleFill, BsTelephoneFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";

const Page = () => {
  const t = useTranslations("Centers");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex justify-center items-start sm:mt-10 mt-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <div className="w-full flex_start">
          <SubHeader title={t("lang_center")} alt={false} />
        </div>
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative sm:mt-14 mt-6">
          <div className="absolute lg:-top-14 top-10 ltr:left-10 right-10 sm:flex hidden flex-col max-w-[520px] z-10 p-4">
            <h2 className="bg-primary  text-white text-xl font-semibold z-10 p-5">
              {t("build_edu")}
            </h2>
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
        <div className="md:w-[720px] w-full my-10 sm:h-[50px] h-[35px] grid grid-cols-3 justify-center items-center bg-lightBorder text-secondary rounded-3xl">
          <p className="bg-primary text-white rounded-3xl h-full flex_center sm:text-lg text-sm font-medium">
            {t("vision_mission")}
          </p>
          <Link
            href={`/${locale}/centers/staff`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("staff")}
          </Link>
          <Link
            href={`/${locale}/centers/news`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("news")}
          </Link>
        </div>
        <div className="w-full flex_start flex-col gap-10">
          <div className="w-full flex_start flex-col gap-10">
            <div className="mt-10 pb-10 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
              <h2 className="md:text-3xl relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-[6ch]"></span>
                <span className="z-10 relative">{t("vision_statement")}</span>
              </h2>
              <p className="font-medium md:text-base text-sm">
                {t("vision_statement_text")}
              </p>
            </div>
            <div className="mt-10 pb-10 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
              <h2 className="md:text-3xl relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-[7ch]"></span>
                <span className="z-10 relative">{t("mission_statement")}</span>
              </h2>
              <p className="font-medium md:text-base text-sm">
                {t("mission_statement_text")}
              </p>
            </div>
            <div className="mt-10 pb-10 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
              <h2 className="md:text-3xl relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                <span className="z-10 relative">{t("contact")}</span>
              </h2>
              <div className="flex_center sm:flex-row flex-col gap-10 text-secondary">
                <a href="#" className="flex_center gap-3">
                  <IoMdMail className="text-2xl" />
                  <div className="flex_start flex-col">
                    <span className="opacity-70 text-xs">{t("email")}</span>
                    <p className="font-semibold">languagecanter@epu.edu.iq</p>
                  </div>
                </a>

                <a
                  href="#"
                  className="flex sm:justify-center justify-start items-center sm:w-auto w-full gap-3"
                >
                  <BsTelephoneFill className="text-2xl" />
                  <div className="flex_start flex-col">
                    <span className="opacity-70 text-xs">
                      {t("phone_number")}
                    </span>
                    <p className="font-semibold change_direction flex-end flex">
                      0750 123 4567
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
