"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";

const Page = () => {
  const t = useTranslations("MemorandumOfUnderstanding");
  const params = useParams();
  const locale = params?.locale as string;

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <div className="sm:block hidden">
          <SubHeader title={t("head")} alt={false} />
        </div>
        <div className="sm:hidden block">
          <SubHeader title={"MOUs"} alt={false} />
        </div>
        <div className="flex_center flex-col gap-10 w-full">
          <div className="flex_center w-full gap-5 mt-5">
            <span className="bg-lightBorder w-full h-[1px]"></span>
            <h3 className="text-secondary lg:text-xl sm:text-lg text-xs font-medium flex-shrink-0">
              {t("local_universities")}
            </h3>
            <span className="bg-lightBorder w-full h-[1px]"></span>
          </div>
          <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-8">
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
          </div>
          <div className="flex_center w-full gap-5 mt-5">
            <span className="bg-lightBorder w-full h-[1px]"></span>
            <h3 className="text-secondary lg:text-xl sm:text-lg text-xs flex-shrink-0">
              {t("international_universities")}
            </h3>
            <span className="bg-lightBorder w-full h-[1px]"></span>
          </div>
          <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-5">
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
            <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3">
              <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] relative">
                <Image
                  src={"/images/cihan.png"}
                  alt="My Image"
                  fill
                  priority
                  className="w-full h-full"
                />
              </div>
              <h3 className="bg-primary absolute bottom-0 left-0 w-full sm:py-4 py-3 text-center sm:text-base text-xs font-semibold text-white">
                Cihan University
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
