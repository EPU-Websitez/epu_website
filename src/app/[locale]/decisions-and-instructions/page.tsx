"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { GrLinkNext } from "react-icons/gr";
import { HiOutlineLink } from "react-icons/hi2";

const Page = () => {
  const t = useTranslations("Decisions");
  const [tab, setTab] = useState("higherEdu");
  const handleTab = (e: string) => {
    setTab(e);
  };
  const [openedAccordion, setOpenedAccordion] = useState(0);
  const [openedAccordionDecision, setOpenedAccordionDecision] = useState(0);
  const handleAccordion = (e: any, type: string) => {
    if (type === "instruction") {
      if (e !== openedAccordion) {
        setOpenedAccordion(e);
      } else {
        setOpenedAccordion(0);
      }
    } else {
      if (e !== openedAccordionDecision) {
        setOpenedAccordionDecision(e);
      } else {
        setOpenedAccordionDecision(0);
      }
    }
  };
  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[300px] relative">
          <div className="absolute bottom-3 w-[95%] left-1/2 -translate-x-1/2 bg-lightBorder bg-opacity-25 z-10 rounded-3xl flex sm:hidden flex-col">
            <button
              type="button"
              onClick={() => handleTab("higherEdu")}
              className={`flex_center w-full p-5 rounded-3xl z-10 text-center h-full ${
                tab === "higherEdu"
                  ? "bg-primary text-white"
                  : "text-secondary opacity-70"
              }`}
            >
              {t("higher_edu")}
            </button>
            <button
              type="button"
              onClick={() => handleTab("polyUni")}
              className={`flex_center w-full p-5 rounded-3xl z-10 text-center h-full ${
                tab === "polyUni"
                  ? "bg-primary text-white"
                  : "text-secondary opacity-70"
              }`}
            >
              {t("uni")}
            </button>
          </div>
          <Image
            src={"/images/campus.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
        </div>
        <div className="w-full flex_center">
          <div className="sm:flex hidden justify-center items-center w-[920px] h-[85px] relative bg-lightBorder rounded-2xl overflow-hidden gap-5">
            <span
              className={`bg-gradient-to-r from-primary to-blue duration-200 text-white absolute ltr:left-0 rtl:right-0 top-0 w-1/2 h-full rounded-2xl ${
                tab === "higherEdu"
                  ? "ltr:left-0 rtl:right-0"
                  : "-translate-x-0 ltr:left-1/2 rtl:right-1/2"
              }`}
            ></span>
            <button
              type="button"
              onClick={() => handleTab("higherEdu")}
              className={`flex_center w-1/2 text-lg z-10 text-center h-full ${
                tab === "higherEdu" ? "text-white" : "text-secondary opacity-70"
              }`}
            >
              {t("higher_edu")}
            </button>
            <button
              type="button"
              onClick={() => handleTab("polyUni")}
              className={`flex_center w-1/2 text-lg z-10 text-center h-full ${
                tab === "polyUni" ? "text-white" : "text-secondary opacity-70"
              }`}
            >
              {t("uni")}
            </button>
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-1/2 -translate-x-1/2 w-full bottom-0 h-[55%] bg-golden"></span>
          <h3 className="sm:text-3xl text-2xl z-10 relative font-semibold">
            {t("intructions")}
          </h3>
        </div>
        <div className="flex_start flex-col gap-5 w-full">
          <div className="w-full flex_start flex-col rounded-2xl text-secondary border border-lightBorder">
            <button
              type="button"
              onClick={() => handleAccordion(1, "instruction")}
              className="flex justify-between items-center w-full p-5"
            >
              <div className="flex_center gap-4">
                <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full relative block"></span>
                <h3 className="font-semibold">2023</h3>
              </div>
              <FaChevronDown
                className={`duration-200 ${
                  openedAccordion === 1 ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`flex_start duration-300 flex-col gap-5 ${
                openedAccordion === 1
                  ? "max-h-[700px] p-5"
                  : "max-h-0 overflow-y-hidden"
              }`}
            >
              <p>
                The mission of this section is to support the academic staff or
                the alumni to study abroad through participation in quality
                programs in a wide range of disciplines. Also to enable the
                faculty staff to participate in training and scientific
                researches. Furthermore, to arrange all issues which are related
                to participation of faculty and staff members in conferences,
                workshops and training courses. Moreover, the purpose of this
                section is to develop the ability of the academic staff of the
                university internationally, by increasing the awareness and
                understanding and enrich curricula on every campus of the
                university, as well as to expand educational opportunities
                abroad for students from diverse backgrounds. As the most
                effective and dramatic experience by which students and staff
                can achieve international and intercultural learning, study
                abroad will contribute significantly to careers in all fields of
                specialization and should be an integral part of an education at
                Erbil Polytechnic University.
              </p>
              <button className="bg-backgroundSecondary rounded-3xl flex_center gap-4 p-2">
                <span className="bg-[#81B1CE] text-white flex_center w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span>Guidelinepdf.PDF</span>
                <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                  <GrLinkNext className="-rotate-45" />
                </span>
              </button>
            </div>
          </div>
          <div className="w-full flex_start flex-col rounded-2xl text-secondary border border-lightBorder">
            <button
              type="button"
              onClick={() => handleAccordion(2, "instruction")}
              className="flex justify-between items-center w-full p-5"
            >
              <div className="flex_center gap-4">
                <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full relative block"></span>
                <h3 className="font-semibold">2023</h3>
              </div>
              <FaChevronDown
                className={`duration-200 ${
                  openedAccordion === 2 ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`flex_start duration-300 flex-col gap-5 ${
                openedAccordion === 2
                  ? "max-h-[700px] p-5"
                  : "max-h-0 overflow-y-hidden"
              }`}
            >
              <p>
                The mission of this section is to support the academic staff or
                the alumni to study abroad through participation in quality
                programs in a wide range of disciplines. Also to enable the
                faculty staff to participate in training and scientific
                researches. Furthermore, to arrange all issues which are related
                to participation of faculty and staff members in conferences,
                workshops and training courses. Moreover, the purpose of this
                section is to develop the ability of the academic staff of the
                university internationally, by increasing the awareness and
                understanding and enrich curricula on every campus of the
                university, as well as to expand educational opportunities
                abroad for students from diverse backgrounds. As the most
                effective and dramatic experience by which students and staff
                can achieve international and intercultural learning, study
                abroad will contribute significantly to careers in all fields of
                specialization and should be an integral part of an education at
                Erbil Polytechnic University.
              </p>
              <button className="bg-backgroundSecondary rounded-3xl flex_center gap-4 p-2">
                <span className="bg-[#81B1CE] text-white flex_center w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span>Guidelinepdf.PDF</span>
                <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                  <GrLinkNext className="-rotate-45" />
                </span>
              </button>
            </div>
          </div>
          <div className="w-full flex_start flex-col rounded-2xl text-secondary border border-lightBorder">
            <button
              type="button"
              onClick={() => handleAccordion(3, "instruction")}
              className="flex justify-between items-center w-full p-5"
            >
              <div className="flex_center gap-4">
                <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full relative block"></span>
                <h3 className="font-semibold">2023</h3>
              </div>
              <FaChevronDown
                className={`duration-200 ${
                  openedAccordion === 2 ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`flex_start duration-300 flex-col gap-5 ${
                openedAccordion === 3
                  ? "max-h-[700px] p-5"
                  : "max-h-0 overflow-y-hidden"
              }`}
            >
              <p>
                The mission of this section is to support the academic staff or
                the alumni to study abroad through participation in quality
                programs in a wide range of disciplines. Also to enable the
                faculty staff to participate in training and scientific
                researches. Furthermore, to arrange all issues which are related
                to participation of faculty and staff members in conferences,
                workshops and training courses. Moreover, the purpose of this
                section is to develop the ability of the academic staff of the
                university internationally, by increasing the awareness and
                understanding and enrich curricula on every campus of the
                university, as well as to expand educational opportunities
                abroad for students from diverse backgrounds. As the most
                effective and dramatic experience by which students and staff
                can achieve international and intercultural learning, study
                abroad will contribute significantly to careers in all fields of
                specialization and should be an integral part of an education at
                Erbil Polytechnic University.
              </p>
              <button className="bg-backgroundSecondary rounded-3xl flex_center gap-4 p-2">
                <span className="bg-[#81B1CE] text-white flex_center w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span>Guidelinepdf.PDF</span>
                <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                  <GrLinkNext className="-rotate-45" />
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-1/2 -translate-x-1/2 w-full bottom-0 h-[55%] bg-golden"></span>
          <h3 className="sm:text-3xl text-2xl z-10 relative font-semibold">
            {t("decision")}
          </h3>
        </div>
        <div className="flex_start flex-col gap-5 w-full">
          <div className="w-full flex_start flex-col rounded-2xl text-secondary border border-lightBorder">
            <button
              type="button"
              onClick={() => handleAccordion(4, "decision")}
              className="flex justify-between items-center w-full p-5"
            >
              <div className="flex_center gap-4">
                <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full relative block"></span>
                <h3 className="font-semibold">2023</h3>
              </div>
              <FaChevronDown
                className={`duration-200 ${
                  openedAccordionDecision === 4 ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`flex_start duration-300 flex-col gap-5 ${
                openedAccordionDecision === 4
                  ? "max-h-[700px] p-5"
                  : "max-h-0 overflow-y-hidden"
              }`}
            >
              <p>
                The mission of this section is to support the academic staff or
                the alumni to study abroad through participation in quality
                programs in a wide range of disciplines. Also to enable the
                faculty staff to participate in training and scientific
                researches. Furthermore, to arrange all issues which are related
                to participation of faculty and staff members in conferences,
                workshops and training courses. Moreover, the purpose of this
                section is to develop the ability of the academic staff of the
                university internationally, by increasing the awareness and
                understanding and enrich curricula on every campus of the
                university, as well as to expand educational opportunities
                abroad for students from diverse backgrounds. As the most
                effective and dramatic experience by which students and staff
                can achieve international and intercultural learning, study
                abroad will contribute significantly to careers in all fields of
                specialization and should be an integral part of an education at
                Erbil Polytechnic University.
              </p>
              <button className="bg-backgroundSecondary rounded-3xl flex_center gap-4 p-2">
                <span className="bg-[#81B1CE] text-white flex_center w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span>Guidelinepdf.PDF</span>
                <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                  <GrLinkNext className="-rotate-45" />
                </span>
              </button>
            </div>
          </div>
          <div className="w-full flex_start flex-col rounded-2xl text-secondary border border-lightBorder">
            <button
              type="button"
              onClick={() => handleAccordion(5, "decision")}
              className="flex justify-between items-center w-full p-5"
            >
              <div className="flex_center gap-4">
                <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full relative block"></span>
                <h3 className="font-semibold">2023</h3>
              </div>
              <FaChevronDown
                className={`duration-200 ${
                  openedAccordionDecision === 5 ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`flex_start duration-300 flex-col gap-5 ${
                openedAccordionDecision === 5
                  ? "max-h-[700px] p-5"
                  : "max-h-0 overflow-y-hidden"
              }`}
            >
              <p>
                The mission of this section is to support the academic staff or
                the alumni to study abroad through participation in quality
                programs in a wide range of disciplines. Also to enable the
                faculty staff to participate in training and scientific
                researches. Furthermore, to arrange all issues which are related
                to participation of faculty and staff members in conferences,
                workshops and training courses. Moreover, the purpose of this
                section is to develop the ability of the academic staff of the
                university internationally, by increasing the awareness and
                understanding and enrich curricula on every campus of the
                university, as well as to expand educational opportunities
                abroad for students from diverse backgrounds. As the most
                effective and dramatic experience by which students and staff
                can achieve international and intercultural learning, study
                abroad will contribute significantly to careers in all fields of
                specialization and should be an integral part of an education at
                Erbil Polytechnic University.
              </p>
              <button className="bg-backgroundSecondary rounded-3xl flex_center gap-4 p-2">
                <span className="bg-[#81B1CE] text-white flex_center w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span>Guidelinepdf.PDF</span>
                <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                  <GrLinkNext className="-rotate-45" />
                </span>
              </button>
            </div>
          </div>
          <div className="w-full flex_start flex-col rounded-2xl text-secondary border border-lightBorder">
            <button
              type="button"
              onClick={() => handleAccordion(6, "decision")}
              className="flex justify-between items-center w-full p-5"
            >
              <div className="flex_center gap-4">
                <span className="w-6 h-6 bg-golden flex-shrink-0 rounded-full relative block"></span>
                <h3 className="font-semibold">2023</h3>
              </div>
              <FaChevronDown
                className={`duration-200 ${
                  openedAccordionDecision === 6 ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`flex_start duration-300 flex-col gap-5 ${
                openedAccordionDecision === 6
                  ? "max-h-[700px] p-5"
                  : "max-h-0 overflow-y-hidden"
              }`}
            >
              <p>
                The mission of this section is to support the academic staff or
                the alumni to study abroad through participation in quality
                programs in a wide range of disciplines. Also to enable the
                faculty staff to participate in training and scientific
                researches. Furthermore, to arrange all issues which are related
                to participation of faculty and staff members in conferences,
                workshops and training courses. Moreover, the purpose of this
                section is to develop the ability of the academic staff of the
                university internationally, by increasing the awareness and
                understanding and enrich curricula on every campus of the
                university, as well as to expand educational opportunities
                abroad for students from diverse backgrounds. As the most
                effective and dramatic experience by which students and staff
                can achieve international and intercultural learning, study
                abroad will contribute significantly to careers in all fields of
                specialization and should be an integral part of an education at
                Erbil Polytechnic University.
              </p>
              <button className="bg-backgroundSecondary rounded-3xl flex_center gap-4 p-2">
                <span className="bg-[#81B1CE] text-white flex_center w-7 h-7 rounded-full">
                  <HiOutlineLink />
                </span>
                <span>Guidelinepdf.PDF</span>
                <span className="w-5 flex_center h-5 rounded-full border border-golden text-golden text-sm">
                  <GrLinkNext className="-rotate-45" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
