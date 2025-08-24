"use client";
import AcademicStaffHeader from "@/components/AcademicStaffHeader";
import Acknowledgment from "@/components/Acknowledgment";
import Activities from "@/components/Activities";
import Breadcrumb from "@/components/breadcrumb";
import Committees from "@/components/Committees";
import Grants from "@/components/Grants";
import Memberships from "@/components/Memberships";
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
      <AcademicStaffHeader />
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
              {/* <button
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
              </button> */}
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
            {tab === "acknowledgment" && <Acknowledgment teacherId={id} />}
            {tab === "committees" && <Committees teacherId={id} />}
            {tab === "memberships" && <Memberships teacherId={id} />}
            {tab === "activities" && <Activities teacherId={id} />}
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
                        <h4 className="font-medium text-sm">
                          University Of Mosul
                        </h4>
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
                        <h4 className="font-medium text-sm">
                          University Of Mosul
                        </h4>
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
            {tab === "grants" && <Grants teacherId={id} />}
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
