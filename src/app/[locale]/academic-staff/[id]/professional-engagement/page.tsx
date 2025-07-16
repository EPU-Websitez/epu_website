"use client";
import Breadcrumb from "@/components/breadcrumb";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AiOutlineRise } from "react-icons/ai";
import { BsBarChart, BsBook } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import {
  FaFacebookF,
  FaGoogleScholar,
  FaResearchgate,
  FaUsers,
} from "react-icons/fa6";
import { FiUser, FiUsers } from "react-icons/fi";
import { GoArrowRight } from "react-icons/go";
import { HiOutlineLink } from "react-icons/hi2";
import { IoMdArrowUp, IoMdClose } from "react-icons/io";
import { MdCoPresent, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { PiHandHeart, PiSealCheck } from "react-icons/pi";

const Page = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;

  const [tab, setTab] = useState("acknowledgment");
  const handleTab = (e: string) => {
    setTab(e);
  };

  const [modalId, setModalId] = useState(null);
  const handleModal = (id: any) => {
    setModalId(id);
  };

  return (
    <div className="flex_center w-full flex-col">
      <div className="max-w-[1380px] w-full relative flex_center flex-col gap-5 sm:px-2 px-5 text-secondary">
        <div className="relative w-full h-[276px]">
          <div className="absolute ltr:left-5 rtl:right-5 top-5 z-10">
            <Breadcrumb title="" alt={false} />
          </div>
          <Image
            src="/images/academic-bg.png"
            alt="title"
            fill
            priority
            className="w-full h-auto rounded-2xl"
          />
        </div>
        <div className="flex_start lg:w-[1024px] w-auto absolute lg:left-1/2 md:left-[12%] sm:left-[18%] left-[22%] -translate-x-1/2 sm:top-[180px] top-[220px]">
          <div className="sm:w-[215px] w-[115px] sm:h-[215px] h-[115px] flex_center relative rounded-full bg-white">
            <div className="flex_center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-[200px] w-[100px] sm:h-[200px] h-[100px] rounded-full">
              <Image
                src="/images/president-alt.png"
                alt="title"
                fill
                priority
                className="w-full h-auto object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="flex_start max-w-[1024px] px-2 sm:mt-32 mt-16 w-full flex-col gap-4">
          <span className="text-sm font-medium">
            Assistant Professor Doctor
          </span>
          <h3 className="text-xl font-semibold">Kayhan Zrar Ghafoor</h3>
          <div className="flex w-full justify-between lg:items-center items-start lg:gap-2 gap-6 mt-3 lg:flex-row flex-col">
            <div className="flex sm:justify-center justify-start sm:items-center items-start gap-3 sm:flex-row flex-col">
              <div className="flex_center gap-3 rounded-xl border-golden border text-golden px-3 py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden text-sm"></span>
                <p className="text-sm">Vice President for Scientific</p>
              </div>
              <div className="flex_center gap-3 rounded-xl border-golden border text-golden px-3 py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden text-sm"></span>
                <p className="text-sm"> Postgraduate Affairs</p>
              </div>
            </div>
            <div className="flex sm:justify-center justify-start sm:items-center items-start gap-3 sm:flex-nowrap flex-wrap">
              <Link
                href=""
                className="flex_center gap-2 rounded-xl sm:px-3 px-2 py-1.5 border border-lightBorder text-sm"
              >
                <span>Academic Staff Portal</span>
                <IoMdArrowUp className="rotate-45" />
              </Link>
              <a
                href=""
                className="rounded-xl sm:px-3 px-2 py-1.5 border border-lightBorder text-sm"
              >
                botan@epu.edu.iq
              </a>
              <a
                href=""
                className="rounded-full flex_center w-10 h-10 border border-lightBorder hover:bg-lightBorder"
              >
                <FaFacebookF />
              </a>
              <a
                href=""
                className="rounded-full flex_center w-10 h-10 border border-lightBorder hover:bg-lightBorder"
              >
                <FaGoogleScholar />
              </a>
              <a
                href=""
                className="rounded-full flex_center w-10 h-10 border border-lightBorder hover:bg-lightBorder"
              >
                <FaResearchgate />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-14 w-full flex_center flex-col text-secondary">
        <div className="max-w-[1024px] w-full flex_start sm:gap-5 gap-3 overflow-x-auto hide_scroll sm:px-0 px-5">
          <Link
            href={`/${locale}/academic-staff/${id}`}
            title={t("about")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("about")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/teaching`}
            title={t("teaching")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("teaching")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/education`}
            title={t("education")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("education")}
          </Link>
          <p className="border-b border-b-secondary px-3 sm:text-base text-sm flex-shrink-0 font-medium">
            {t("professional_engagement")}
          </p>
          <Link
            href={`/${locale}/academic-staff/${id}/academics`}
            title={t("academics")}
            className="opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("academics")}
          </Link>
        </div>
        <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              <button
                type="button"
                onClick={() => handleTab("acknowledgment")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "acknowledgment"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("acknowledgment")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("committees")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "committees"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("committees")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("memberships")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "memberships"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("memberships")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("activities")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "activities"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("activities")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("researchEvaluation")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "researchEvaluation"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("research_evaluation")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("committeesEvaluation")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "committeesEvaluation"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("committees_evaluation")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("grants")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "grants"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("grants")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
            </div>
            {tab === "acknowledgment" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("acknowledgment")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-lg">
                        <PiSealCheck className="text-2xl" />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium">Organization Level</h4>
                        <span className="text-black opacity-60 text-xs">
                          2020 - 2024
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                      <div className="flex_start flex-col lg:w-1/2 w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("certificate")}
                        </span>
                        <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                          <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                            <HiOutlineLink />
                          </span>
                          <span>botancv.PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab === "committees" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("committees")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-2xl">
                        <FaUsers className="text-2xl" />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium text-sm">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-xs">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-5">
                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("level")}
                        </span>
                        <p className="lg:text-base text-sm">Department</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab === "memberships" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("memberships")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full px-3 pt-3">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                        <FiUser />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium text-sm">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-xs">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col px-3">
                      <div className="flex_start flex-col lg:w-1/2 w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("level")}
                        </span>
                        <p className="lg:text-base text-sm">International</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleModal(1)}
                      className="w-full py-3 text-golden border-t border-lightBorder flex justify-between items-center px-3"
                    >
                      <span className="text-sm font-semibold">{t("read_more")}</span>
                      <GoArrowRight className="text-2xl rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {tab === "activities" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("activities")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                        <BsBarChart className="text-2xl" />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium text-sm">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-xs">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("attachment")}
                        </span>
                        <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                          <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                            <HiOutlineLink />
                          </span>
                          <span>botancv.PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab === "researchEvaluation" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("research_evaluation")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                        <MdCoPresent />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium text-sm">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-xs">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-5">
                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("type")}
                        </span>
                        <p className="lg:text-base text-sm">International</p>
                      </div>

                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("attachment")}
                        </span>
                        <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                          <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                            <HiOutlineLink />
                          </span>
                          <span>botancv.PDF</span>
                        </button>
                      </div>
                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("number_of_audience")}
                        </span>
                        <p className="lg:text-base text-sm">+ 325 Audience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab === "committeesEvaluation" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("committees_evaluation")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                        <FiUsers />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium text-sm">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-xs">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-5">
                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("number_of_present")}
                        </span>
                        <p className="lg:text-base text-sm">+ 25 Presents</p>
                      </div>

                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("attachment")}
                        </span>
                        <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                          <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                            <HiOutlineLink />
                          </span>
                          <span>botancv.PDF</span>
                        </button>
                      </div>
                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("number_of_audience")}
                        </span>
                        <p className="lg:text-base text-sm">+ 325 Audience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab === "grants" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("grants")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-2xl">
                        <PiHandHeart className="text-2xl" />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium text-sm">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-xs">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-5">
                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("type")}
                        </span>
                        <p className="lg:text-base text-sm">International</p>
                      </div>

                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("attachment")}
                        </span>
                        <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                          <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                            <HiOutlineLink />
                          </span>
                          <span>botancv.PDF</span>
                        </button>
                      </div>
                      <div className="flex_start flex-col w-full col-span-2">
                        <span className="text-black opacity-60 text-xs">
                          {t("achievement")}
                        </span>
                        <p className="lg:text-base text-sm">
                          Developed a new model for sustainable energy usage in
                          urban areas, published in major journals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {modalId && (
        <div className="flex_center fixed top-0 left-0 w-full h-full">
          <div className="bg-white flex_start flex-col gap-5 z-10 sm:w-[550px] w-[90%] rounded-3xl overflow-hidden">
            <div className="flex justify-between items-center gap-2 w-full bg-golden text-white p-6">
              <h3 className="text-smallTitle font-medium">Research Detail</h3>
              <button
                type="button"
                onClick={() => handleModal(null)}
                className="text-3xl"
              >
                <IoMdClose />
              </button>
            </div>
            <div className="flex_start flex-col gap-7 w-full p-6">
              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {t("research_title")}
                </span>
                <p className="text-secondary font-medium">
                  Innovative Approaches to Renewable Energy Integration in Urban
                  Infrastructure
                </p>
              </div>
              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {t("students")}
                </span>
                <li className="text-secondary font-medium list-disc">
                  Sanarya Hamakarim Ali
                </li>
                <li className="text-secondary font-medium list-disc">
                  Sanarya Hamakarim Ali
                </li>
                <li className="text-secondary font-medium list-disc">
                  Sanarya Hamakarim Ali
                </li>
              </div>
              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {t("attachment")}
                </span>
                <p className="text-secondary font-medium">2018 - 2019</p>
                <button className="border border-lightBorder rounded-3xl flex_center gap-3 px-1 py-1.5 text-sm">
                  <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                    <HiOutlineLink />
                  </span>
                  <span>botancv.PDF</span>
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleModal(null)}
            className="w-full fixed h-full left-0 top-0 bg-black bg-opacity-60"
          ></button>
        </div>
      )}
    </div>
  );
};
export default Page;
