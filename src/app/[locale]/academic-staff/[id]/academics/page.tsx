"use client";
import Breadcrumb from "@/components/breadcrumb";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AiOutlineRise } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FaFacebookF, FaGoogleScholar, FaResearchgate } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { GoArrowRight, GoBriefcase } from "react-icons/go";
import { HiOutlineLink } from "react-icons/hi2";
import { IoMdArrowUp, IoMdClose } from "react-icons/io";
import { MdCoPresent, MdKeyboardDoubleArrowRight } from "react-icons/md";

const Page = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;

  const [tab, setTab] = useState("books");
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
                <p>Vice President for Scientific</p>
              </div>
              <div className="flex_center gap-3 rounded-xl border-golden border text-golden px-3 py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden text-sm"></span>
                <p> Postgraduate Affairs</p>
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
          <Link
            href={`/${locale}/academic-staff/${id}/professional-engagement`}
            title={t("professional_engagement")}
            className=" opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("professional_engagement")}
          </Link>
          <p className="border-b border-b-secondary px-3 sm:text-base text-sm flex-shrink-0 font-semibold">
            {t("academics")}
          </p>
        </div>
        <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              <button
                type="button"
                onClick={() => handleTab("books")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "books"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("books")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("publications")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "publications"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("publications")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("researchIntrest")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "researchIntrest"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("research_intrest")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("supervisingResearch")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "supervisingResearch"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("supervising_research")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("seminars")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "seminars"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("seminars")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("workshops")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "workshops"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("workshops")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("conferences")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "conferences"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("conferences")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("trainings")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "trainings"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("trainings")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("awards")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "awards"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("awards")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleTab("professionalActs")}
                className={`lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl ${
                  tab === "professionalActs"
                    ? "text-primary border-primary"
                    : "text-secondary opacity-70 border-transparent"
                }`}
              >
                <span>{t("professional_acts")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </button>
            </div>
            {tab === "books" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("books")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-lg">
                        <BsBook className="text-2xl" />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-sm">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                      <div className="flex_start flex-col lg:w-1/2 w-full">
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
            {tab === "publications" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("publications")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-lg">
                        <CiSearch className="text-2xl" />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-sm">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                      <div className="flex_start flex-col lg:w-1/2 w-full">
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
            {tab === "researchIntrest" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("research_intrest")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full px-3 pt-3">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                        <CiSearch className="text-2xl" />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-sm">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col px-3">
                      <div className="flex_start flex-col lg:w-1/2 w-full">
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
                    <button
                      onClick={() => handleModal(1)}
                      className="w-full py-3 text-golden border-t border-lightBorder flex justify-between items-center px-3"
                    >
                      <span className="text-sm">{t("read_more")}</span>
                      <GoArrowRight className="text-xl rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {tab === "supervisingResearch" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("supervising_research")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full px-3 pt-3">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                        <CiSearch className="text-2xl" />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-sm">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col px-3">
                      <div className="flex_start flex-col lg:w-1/2 w-full">
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
                    <button
                      onClick={() => handleModal(1)}
                      className="w-full py-3 text-golden border-t border-lightBorder flex justify-between items-center px-3"
                    >
                      <span className="text-sm">{t("read_more")}</span>
                      <GoArrowRight className="text-xl rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {tab === "seminars" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("seminars")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                        <div className="h-6 w-6 relative">
                          <Image
                            src="/images/seminar.svg"
                            alt="title"
                            fill
                            priority
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-sm">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                      <div className="flex_start flex-col lg:w-1/2 w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("number_of_audience")}
                        </span>
                        <p className="lg:text-base text-sm">+ 325 Audience</p>
                      </div>
                      <div className="flex_start flex-col lg:w-1/2 w-full">
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
            {tab === "workshops" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("workshops")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                        <MdCoPresent className="text-2xl" />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-sm">
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
            {tab === "conferences" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("conferences")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                        <FiUsers className="text-2xl" />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-sm">
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
            {tab === "trainings" && (
              <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                <SubHeader title={t("trainings")} alt={false} />
                <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
                  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full">
                    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                      <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                        <AiOutlineRise className="text-2xl" />
                      </div>
                      <div className="flex_start flex-col">
                        <h4 className="font-medium">University Of Mosul</h4>
                        <span className="text-black opacity-60 text-sm">
                          25 - 06 - 1992
                        </span>
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-5">
                      <div className="flex_start flex-col w-full">
                        <span className="text-black opacity-60 text-xs">
                          {t("level")}
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
                          {t("type")}
                        </span>
                        <p className="lg:text-base text-sm">Online Course</p>
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
              <h3 className="text-smallTitle font-semibold">Research Detail</h3>
              <button
                type="button"
                onClick={() => handleModal(null)}
                className="text-3xl"
              >
                <IoMdClose />
              </button>
            </div>
            <div className="flex_start flex-col gap-5 w-full p-6">
              <div className="flex_start gap-1 flex-col">
                <span className="text-black opacity-60 text-sm">
                  {"research_title"}
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
                <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
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
