"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { GrLinkNext } from "react-icons/gr";
import { HiOutlineLink } from "react-icons/hi2";

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const subjectId = params?.subjectId as string;

  return (
    <div className="w-full flex_center my-10">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8 text-secondary">
        <SubHeader title={t("see_details")} alt={false} />
        <div className="w-full flex_start flex-col gap-5 bg-backgroundSecondary border border-lightBorder rounded-3xl p-5">
          <h5 className="text-opacity-25 text-black font-semibold">
            {t("subject_name")}
          </h5>
          <h4 className="font-medium">
            Innovative Approaches to Renewable Energy Integration in Urban
            Infrastructure.
          </h4>
          <h5 className="text-opacity-25 text-black font-semibold">
            {t("subject_description")}
          </h5>
          <p>
            The department’s objective is to deliver high-quality education and
            foster sustainable research endeavors, aiming to equip individuals
            with the essential knowledge, skills, and capabilities needed to
            contribute to the progress of engineering{" "}
            <button className="text-golden font-semibold">...More</button>
          </p>
          <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-5">
            <div className="flex_start flex-col gap-5 bg-white rounded-3xl p-5">
              <h3 className="pb-5 text-golden text-sm font-semibold border-b border-b-lightBorder w-full">
                {t("course_info")}
              </h3>
              <div className="flex_start lg:flex-col flex-row lg:gap-5 sm:gap-20 gap-10 w-full sm:flex-nowrap flex-wrap">
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("stage")}
                  </h5>
                  <h4 className="font-medium">Stage 4</h4>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("semester")}
                  </h5>
                  <h4 className="font-medium">Second semester</h4>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("course_type")}
                  </h5>
                  <h4 className="font-medium">Coursat</h4>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("credit")}
                  </h5>
                  <h4 className="font-medium">2</h4>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("code")}
                  </h5>
                  <h4 className="font-medium">IBs753Ks</h4>
                </div>
              </div>
            </div>
            <div className="flex_start flex-col gap-5 bg-white rounded-3xl p-5">
              <h3 className="pb-5 text-golden text-sm font-semibold border-b border-b-lightBorder w-full">
                {t("assessment_scheme")}
              </h3>
              <div className="flex_start lg:flex-col flex-row lg:gap-5 sm:gap-20 gap-10 w-full sm:flex-nowrap flex-wrap">
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("attendance")}
                  </h5>
                  <h4 className="font-medium">5%</h4>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("class_tests")}
                  </h5>
                  <h4 className="font-medium">10 %</h4>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("midterm_exam")}
                  </h5>
                  <h4 className="font-medium">20 %</h4>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("practical_exam ")}
                  </h5>
                  <h4 className="font-medium">NLI</h4>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("final_exam")}
                  </h5>
                  <h4 className="font-medium">60 %</h4>
                </div>
              </div>
            </div>
            <div className="flex_start flex-col gap-5 bg-white rounded-3xl p-5">
              <h3 className="pb-5 text-golden text-sm font-semibold border-b border-b-lightBorder w-full">
                {t("subject_schedule")}
              </h3>
              <div className="flex_start lg:flex-col flex-row lg:gap-5 sm:gap-20 gap-10 w-full sm:flex-nowrap flex-wrap">
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("duration")}
                  </h5>
                  <h4 className="font-medium">14 Weeks</h4>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("lectures")}
                  </h5>
                  <h4 className="font-medium">10 Lectures</h4>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("language")}
                  </h5>
                  <h4 className="font-medium">English</h4>
                </div>
                <div className="flex_start flex-col gap-1">
                  <h5 className="text-opacity-25 text-black font-semibold">
                    {t("hours_per_week")}
                  </h5>
                  <h4 className="font-medium">4 hours per week</h4>
                </div>
              </div>
            </div>
          </div>
          <h5 className="text-opacity-25 text-black font-semibold">
            {t("PDF_lectures")}
          </h5>
          <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5">
            <div className="flex_start flex-col gap-5 p-5 rounded-3xl bg-background w-full">
              <h4 className="font-semibold text-sm text-golden">Week 1</h4>
              <button className="flex justify-between items-center gap-4 w-full">
                <span className="bg-[#81B1CE] text-white flex_center flex-shrink-0 w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span className="text-secondary text-opacity-70 text-sm text-start max-w-[200px]">
                  Innovative Approaches to Renewable Energy ...
                </span>
                <div className="flex-1 flex justify-end">
                  <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                    <GrLinkNext className="-rotate-45" />
                  </span>
                </div>
              </button>
              <button className="flex justify-between items-center gap-4 w-full">
                <span className="bg-[#81B1CE] text-white flex_center flex-shrink-0 w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span className="text-secondary text-opacity-70 text-sm text-start max-w-[200px]">
                  Innovative Approaches to Renewable Energy ...
                </span>
                <div className="flex-1 flex justify-end">
                  <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                    <GrLinkNext className="-rotate-45" />
                  </span>
                </div>
              </button>
            </div>
            <div className="flex_start flex-col gap-5 p-5 rounded-3xl bg-background w-full">
              <h4 className="font-semibold text-sm text-golden">Week 1</h4>
              <button className="flex justify-between items-center gap-4 w-full">
                <span className="bg-[#81B1CE] text-white flex_center flex-shrink-0 w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span className="text-secondary text-opacity-70 text-sm text-start max-w-[200px]">
                  Innovative Approaches to Renewable Energy ...
                </span>
                <div className="flex-1 flex justify-end">
                  <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                    <GrLinkNext className="-rotate-45" />
                  </span>
                </div>
              </button>
              <button className="flex justify-between items-center gap-4 w-full">
                <span className="bg-[#81B1CE] text-white flex_center flex-shrink-0 w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span className="text-secondary text-opacity-70 text-sm text-start max-w-[200px]">
                  Innovative Approaches to Renewable Energy ...
                </span>
                <div className="flex-1 flex justify-end">
                  <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                    <GrLinkNext className="-rotate-45" />
                  </span>
                </div>
              </button>
            </div>
            <div className="flex_start flex-col gap-5 p-5 rounded-3xl bg-background w-full">
              <h4 className="font-semibold text-sm text-golden">Week 1</h4>
              <button className="flex justify-between items-center gap-4 w-full">
                <span className="bg-[#81B1CE] text-white flex_center flex-shrink-0 w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span className="text-secondary text-opacity-70 text-sm text-start max-w-[200px]">
                  Innovative Approaches to Renewable Energy ...
                </span>
                <div className="flex-1 flex justify-end">
                  <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                    <GrLinkNext className="-rotate-45" />
                  </span>
                </div>
              </button>
              <button className="flex justify-between items-center gap-4 w-full">
                <span className="bg-[#81B1CE] text-white flex_center flex-shrink-0 w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span className="text-secondary text-opacity-70 text-sm text-start max-w-[200px]">
                  Innovative Approaches to Renewable Energy ...
                </span>
                <div className="flex-1 flex justify-end">
                  <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                    <GrLinkNext className="-rotate-45" />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
