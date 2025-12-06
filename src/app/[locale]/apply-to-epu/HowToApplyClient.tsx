"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PiGraduationCap, PiHandshake } from "react-icons/pi";
import { TfiShine } from "react-icons/tfi";

import useFetch from "@/libs/hooks/useFetch";
import { useParams } from "next/navigation";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}
interface QuestionSection {
  id: number;
  title: string;
  description: string;
  icon_image: ImageFile;
}
interface ListItem {
  id: number;
  description: string;
}
interface HowToApplyData {
  description: string;
  bg_image: ImageFile;
  question_title: string;
  question_description: string;
  question_sections: QuestionSection[];
  lists: ListItem[];
}

// -------- Skeleton Component --------
const PageSkeleton = () => (
  <div className="my-10 flex_center w-full animate-pulse">
    <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-10">
      <div className="h-8 w-40 bg-gray-200 rounded-lg"></div>
      <div className="w-full sm:h-[410px] h-[225px] bg-gray-200 rounded-3xl"></div>
      <div className="w-full h-64 bg-gray-200 rounded-3xl"></div>
      <div className="w-full h-96 bg-gray-200 rounded-3xl"></div>
    </div>
  </div>
);

const HowToApplyClient = () => {
  const t = useTranslations("Apply");
  const locale = useParams()?.locale as string;

  const { data: applyData, loading: isLoading } = useFetch<HowToApplyData>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/universities/how-to-apply`,
    locale
  );

  if (isLoading) return <PageSkeleton />;
  if (!applyData) return <div>No data available.</div>;

  const reasonsToDisplay = applyData.question_sections;

  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-10">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full sm:h-[410px] h-[225px] relative">
          <Image
            src={applyData.bg_image.lg}
            alt={t("head")}
            fill
            priority
            className="w-full h-auto object-cover sm:rounded-3xl rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
          <div className="absolute ltr:left-0 rtl:right-0 top-0 sm:w-[580px] w-[90%] sm:h-[400px] h-full rtl:rotate-180">
            <Image
              src="/images/circle-shape.png"
              alt="Shape"
              fill
              priority
              className="w-full h-full"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          </div>
          {applyData.description && (
            <p className="z-10 absolute top-[30%] text-white ltr:left-[5%] rtl:right-[5%] font-semibold sm:text-lg text-sm sm:max-w-[600px] max-w-[80%]">
              {applyData.description}
            </p>
          )}
        </div>

        <div className="w-full flex_start flex-col lg:p-10 p-5 rounded-3xl gap-3 bg-gradient-to-r from-primary to-blue text-white">
          <span className="text-sm">{applyData.question_title}</span>
          <h1 className="sm:text-titleNormal text-lg font-semibold relative mb-3">
            {applyData.question_description}
            <span className="absolute right-0 -bottom-2 w-[40%] sm:h-[16px] h-[10px]">
              <Image
                src="/images/title-shape.svg"
                alt="shape"
                fill
                priority
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.svg";
                }}
              />
            </span>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
            {reasonsToDisplay.map((reason) => (
              <div key={reason.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <span className="relative sm:w-12 sm:h-12 w-9 h-9 flex-shrink-0">
                    <Image
                      src={reason?.icon_image?.lg}
                      alt={reason.title}
                      fill
                      priority
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.svg";
                      }}
                    />
                  </span>
                  <p className="font-medium lg:text-sm text-xs">
                    {reason.title}
                  </p>
                </div>
                <p className="lg:text-xs text-[8px] text-start opacity-75">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full bg-backgroundSecondary mt-3 flex_start flex-col gap-8 sm:p-10 p-5 rounded-3xl border border-lightBorder">
          <h4 className="opacity-35 font-semibold">{t("to_apply")}</h4>
          {applyData.lists.map((item) => (
            <div
              key={item.id}
              className="flex_start gap-5 text-secondary font-medium"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-golden rounded-full"></span>
              <p className="sm:text-base text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default HowToApplyClient;
