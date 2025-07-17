"use client";
import ResearchModal from "@/components/researchDetail";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";

const Page = () => {
  const t = useTranslations("ResearchesAndPublications");
  const params = useParams();
  const locale = params?.locale as string;
  const [tab, setTab] = useState("researches");
  const handleTab = (e: string) => {
    setTab(e);
  };
  const [modalId, setModalId] = useState(null);
  const handleModal = (id: any) => {
    setModalId(id);
    document.body.style.overflowY = "hidden";
  };
  const handleClose = () => {
    document.body.style.overflowY = "auto";
    setModalId(null);
  };
  return (
    <div className="my-10 flex_center w-full flex-col gap-10 sm:px-0 px-3">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />
      </div>
      <div className="w-full flex_start gap-20 relative">
        {locale === "en" && (
          <div className="md:w-1/2 w-[90%] z-10 md:relative absolute md:left-auto left-0 flex md:justify-end justify-start md:items-start items-center md:top-auto top-1/2 md:-translate-y-0 -translate-y-1/2 lg:px-0 px-3">
            <h1 className="lg:text-[52px] md:text-title text-titleNormal font-bold md:text-secondary text-white sm:max-w-[450px] max-w-full">
              <span className="text-golden">Innovative</span>{" "}
              <br className="sm:block hidden" /> Research and Publications
            </h1>
          </div>
        )}
        {locale === "ku" && (
          <div className="md:w-1/2 w-[90%] z-10 md:relative absolute md:left-auto left-0 flex md:justify-end justify-start md:items-start items-center md:top-auto top-1/2 md:-translate-y-0 -translate-y-1/2 lg:px-0 px-3">
            <h1 className="lg:text-[52px] md:text-title text-titleNormal font-bold md:text-secondary text-white sm:max-w-[450px] max-w-full">
              <span className="text-golden">توێژینەوە</span>{" "}
              <br className="sm:block hidden" /> و بڵاوکراوەی داهێنەرانە
            </h1>
          </div>
        )}
        {locale === "ar" && (
          <div className="md:w-1/2 w-[90%] z-10 md:relative absolute md:left-auto left-0 flex md:justify-end justify-start md:items-start items-center md:top-auto top-1/2 md:-translate-y-0 -translate-y-1/2 lg:px-0 px-3">
            <h1 className="lg:text-[52px] md:text-title text-titleNormal font-bold md:text-secondary text-white sm:max-w-[450px] max-w-full">
              <span className="text-golden">الأبحاث</span>{" "}
              <br className="sm:block hidden" /> والمنشورات المبتكرة
            </h1>
          </div>
        )}
        <div className="md:w-1/2 w-full md:h-[370px] h-[250px] relative rounded-3xl overflow-hidden">
          <Image
            src={"/images/innovative.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:w-[1024px] w-full h-[60px] absolute left-1/2 md:bottom-10 bottom-2 z-10 -translate-x-1/2 flex_start">
          <div className="lg:w-[800px] md:w-[600px] w-full flex_center sm:gap-5 gap-3 bg-white bg-opacity-30 md:p-5 p-2 rounded-3xl">
            <div className="relative sm:bg-transparent bg-white lg:w-[20%] sm:w-[33%] w-14 text-sm flex-shrink-0 sm:border-none border border-lightBorder sm:p-0 p-2 rounded-md">
              <select
                name="academic"
                id="academic"
                className="text-start sm:block hidden w-full sm:px-2 px-1 sm:py-3 py-1 border border-lightBorder bg-backgroundSecondary sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
              >
                <option value="#">{t("select_date")}</option>
                <option value="#">Academic 1</option>
                <option value="#">Academic 2</option>
                <option value="#">Academic 3</option>
              </select>
              <CiCalendar className="sm:hidden block text-xl" />
              <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                <FaChevronDown />
              </span>
            </div>
            <div className="relative w-full">
              <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
                <CiSearch />
              </span>
              <input
                type="text"
                className="sm:py-3 py-[9px] w-full border-lightBorder bg-backgroundSecondary md:bg-opacity-50 bg-opacity-100 sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
                placeholder={t("search_research")}
              />
            </div>
            <button className="sm:px-6 px-2 flex-shrink-0 sm:py-3 p-1 sm:rounded-xl rounded-md ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-blue text-white">
              {t("search")}
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center sm:w-[500px] w-full sm:h-[50px] h-[40px] relative bg-lightBorder rounded-2xl overflow-hidden gap-5 sm:mt-10 mt-5">
        <span
          className={`bg-primary duration-200 text-white absolute ltr:left-0 rtl:right-0 top-0 w-1/2 h-full rounded-2xl ${
            tab === "researches"
              ? "ltr:left-0 rtl:right-0"
              : "-translate-x-0 ltr:left-1/2 rtl:right-1/2"
          }`}
        ></span>
        <button
          type="button"
          onClick={() => handleTab("researches")}
          className={`flex_center w-1/2 md:text-lg text-sm z-10 text-center h-full ${
            tab === "researches" ? "text-white" : "text-secondary opacity-70"
          }`}
        >
          {t("researches")}
        </button>
        <button
          type="button"
          onClick={() => handleTab("publications")}
          className={`flex_center w-1/2 md:text-lg text-sm z-10 text-center h-full ${
            tab === "publications" ? "text-white" : "text-secondary opacity-70"
          }`}
        >
          {t("publications")}
        </button>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5 max-w-[1040px]">
        <button
          onClick={() => handleModal(1)}
          className="flex_center gap-5 md:p-7 p-3 rounded-3xl border border-lightBorder"
        >
          <div className="relative bg-golden p-2 flex-shrink-0 rounded-2xl">
            <div className="relative md:w-[118px] w-[70px] md:h-[150px] h-[85px]">
              <Image
                src={"/images/researches_card.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="absolute md:w-[92px] w-[72px] md:h-[42px] h-[32px] md:-left-4 -left-3 bottom-5 text-white flex justify-center items-start">
              <Image
                src={"/images/researches_shape.png"}
                alt="My Image"
                fill
                priority
                className="w-full h-full object-cover"
              />
              <h3 className="text-xs z-10 md:mt-2 mt-1">{t("researches")}</h3>
            </div>
          </div>
          <div className="flex_start flex-col gap-4 text-secondary text-start">
            <h2 className="md:text-base text-[10px] font-medium">
              Innovative Approaches to Renewable Energy Integration in Urban
              Infrastructure
            </h2>
            <small className="md:text-xs text-[8px] opacity-70">
              Lorem ipsum dolor sit amet consectetur. Elit in ullamcorper
              porttitor facilisis neq ...
              <button className="opacity-100 font-semibold"> More</button>
            </small>
            <div className="flex_center py-1 px-2 gap-4 rounded-lg border border-lightBorder">
              <AiOutlineUser />
              <small className="opacity-70 md:text-xs text-[8px]">
                Prof. Dr. Edrees Kamaran Ali
              </small>
            </div>
          </div>
        </button>
      </div>
      {modalId && <ResearchModal handleClick={handleClose} />}
    </div>
  );
};
export default Page;
