"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CiCalendar, CiGlobe, CiSearch } from "react-icons/ci";
import { FaChartLine, FaChevronDown } from "react-icons/fa6";
import { FiAward } from "react-icons/fi";
import { HiOutlineLink } from "react-icons/hi2";
import { IoLockOpenOutline } from "react-icons/io5";
import { MdAccessTime, MdCalendarToday, MdLockOpen } from "react-icons/md";
import { VscLibrary } from "react-icons/vsc";

const Page = () => {
  const t = useTranslations("Journal");
  const params = useParams();
  const locale = params?.locale as string;

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full text-secondary flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full relative mb-20  gap-10 md:block hidden change_direction">
          <div className="flex_start flex-col gap-5 mt-44 lg:max-w-[790px] md:max-w-[670px] w-1/2 flex-shrink-0 md:w-full z-10 relative">
            <h2 className="lg:text-titleNormal text-smallTitle font-semibold relative">
              <svg className="card__arc" xmlns="http://www.w3.org/2000/svg">
                <path />
              </svg>
              <span className="h-[103px] w-[360px] absolute right-5 top-0 bg-white rounded-r-3xl"></span>
              <svg className="card__arc_alt" xmlns="http://www.w3.org/2000/svg">
                <path />
              </svg>
              {locale === "en" && (
                <span className="z-10 relative font-semibold">
                  Dive into a diverse range of{" "}
                  <span className="text-golden">peer-reviewed journals</span>,
                  covering various disciplines and offering cutting-edge
                  research.
                </span>
              )}
              {locale === "ku" && (
                <span className="z-10 relative font-semibold">
                  خۆت بخەرە ناو کۆمەڵێک{" "}
                  <span className="text-golden">گۆڤاری هەمەچەشن</span>, کە
                  لەلایەن هاوتاکانەوە پێداچوونەوەیان بۆ کراوە و دیسیپلینە
                  جیاوازەکان دەگرێتەوە و توێژینەوەی پێشکەوتوو پێشکەش دەکەن.
                </span>
              )}
              {locale === "ar" && (
                <span className="z-10 relative font-semibold">
                  انغمس في مجموعة متنوعة{" "}
                  <span className="text-golden">من المجلات المحكمة</span>, التي
                  تغطي مختلف التخصصات وتقدم أبحاثًا متطورة.
                </span>
              )}
            </h2>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
              <div className="flex_center gap-2 rounded-3xl border border-golden py-1 px-2">
                <CiGlobe />
                <span className="lg:text-sm text-[10px]">
                  {t("global_reach")}
                </span>
              </div>

              <div className="flex_center gap-2 rounded-3xl border border-golden py-1 px-2">
                <MdAccessTime />
                <span className="lg:text-sm text-[10px]">
                  {t("historical_significance")}
                </span>
              </div>
              <div className="flex_center gap-2 rounded-3xl border border-golden py-1 px-2">
                <VscLibrary />
                <span className="lg:text-sm text-[10px]">
                  {t("extensive_collection")}
                </span>
              </div>
              <div className="flex_center gap-2 rounded-3xl border border-golden py-1 px-2">
                <FiAward />
                <span className="lg:text-sm text-[10px]">
                  {t("leading_journal")}
                </span>
              </div>
            </div>
            <div className="lg:w-full md:w-[600px] w-full flex_center gap-5 bg-white bg-opacity-30 md:p-5 p-2 ltr:pl-0 rtl:pr-0 rounded-3xl">
              <div className="relative sm:bg-transparent bg-white lg:w-[20%] sm:w-[33%] w-14 text-sm flex-shrink-0 sm:border-none border border-lightBorder sm:p-0 p-2 rounded-md">
                <select
                  name="academic"
                  id="academic"
                  className="sm:block hidden w-full pl-8 pr-8 py-2 border border-lightBorder bg-backgroundSecondary rounded-xl text-[#9E9E9E] focus:border-primary outline-none appearance-none cursor-pointer"
                >
                  <option value="#">{t("select_date")}</option>
                  <option value="#">Academic 1</option>
                  <option value="#">Academic 2</option>
                  <option value="#">Academic 3</option>
                </select>

                {/* Calendar icon - visible on small screens only */}
                <CiCalendar className="sm:hidden block text-2xl" />

                {/* Calendar icon for select - visible on larger screens */}
                <span className="sm:block hidden absolute left-2 top-1/2 -translate-y-1/2 text-[#9E9E9E] pointer-events-none">
                  <CiCalendar className="text-lg" />
                </span>

                {/* Dropdown arrow - visible on larger screens only */}
                <span className="sm:block hidden absolute top-1/2 -translate-y-1/2 right-2 text-secondary pointer-events-none">
                  <FaChevronDown />
                </span>
              </div>
              <div className="relative w-full">
                <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
                  <CiSearch />
                </span>
                <input
                  type="text"
                  className="sm:py-2 py-[9px] w-full border-lightBorder bg-backgroundSecondary md:bg-opacity-50 text-[#9E9E9E] bg-opacity-100 sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
                  placeholder={t("search_journal")}
                />
              </div>
              <button className="sm:px-6 px-2 flex-shrink-0 py-2 sm:rounded-xl rounded-md ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-blue text-white">
                {t("search")}
              </button>
            </div>
          </div>
          <div className="md:w-[402px] w-1/2 md:h-[575px] h-[250px] md:absolute relative top-0 right-0">
            <Image
              src={`/images/journal.jpg`}
              alt="{slide.name}"
              fill
              priority
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          </div>
        </div>

        <div className="flex justify-center items-center md:hidden gap-10 w-full">
          <div className="flex_start flex-col gap-5 w-1/2">
            <h5 className="text-xs">
              {locale === "en" && (
                <span className="z-10 relative">
                  Dive into a diverse range of{" "}
                  <span className="text-golden">peer-reviewed journals</span>,
                  covering various disciplines and offering cutting-edge
                  research.
                </span>
              )}
              {locale === "ku" && (
                <span className="z-10 relative">
                  خۆت بخەرە ناو کۆمەڵێک{" "}
                  <span className="text-golden">گۆڤاری هەمەچەشن</span>, کە
                  لەلایەن هاوتاکانەوە پێداچوونەوەیان بۆ کراوە و دیسیپلینە
                  جیاوازەکان دەگرێتەوە و توێژینەوەی پێشکەوتوو پێشکەش دەکەن.
                </span>
              )}
              {locale === "ar" && (
                <span className="z-10 relative">
                  انغمس في مجموعة متنوعة{" "}
                  <span className="text-golden">من المجلات المحكمة</span>, التي
                  تغطي مختلف التخصصات وتقدم أبحاثًا متطورة.
                </span>
              )}
            </h5>
            <div className="flex_start flex-col gap-2">
              <div className="flex_center gap-2 rounded-3xl border border-golden py-1 px-2">
                <CiGlobe />
                <span className="lg:text-sm text-[10px]">
                  {t("global_reach")}
                </span>
              </div>

              <div className="flex_center gap-2 rounded-3xl border border-golden py-1 px-2">
                <MdAccessTime />
                <span className="lg:text-sm text-[10px]">
                  {t("historical_significance")}
                </span>
              </div>
              <div className="flex_center gap-2 rounded-3xl border border-golden py-1 px-2">
                <VscLibrary />
                <span className="lg:text-sm text-[10px]">
                  {t("extensive_collection")}
                </span>
              </div>
              <div className="flex_center gap-2 rounded-3xl border border-golden py-1 px-2">
                <FiAward />
                <span className="lg:text-sm text-[10px]">
                  {t("leading_journal")}
                </span>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-[250px] relative">
            <Image
              src={`/images/journal.jpg`}
              alt="{slide.name}"
              fill
              priority
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          </div>
        </div>
        <div className="w-full md:hidden flex justify-center items-center gap-5">
          <div className="relative w-14 text-sm flex-shrink-0 border border-lightBorder p-1 rounded-md">
            <CiCalendar className="text-xl" />
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
              className="py-1 w-full border-lightBorder sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
              placeholder={t("search_journal")}
            />
          </div>
          <button className="sm:px-6 px-2 flex-shrink-0 py-1 sm:rounded-xl rounded-md bg-primary text-white text-sm">
            {t("search")}
          </button>
        </div>
        <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-5">
          <div className="flex_start flex-col gap-5 rounded-3xl border border-lightBorder p-5">
            <h2>
              Population Forecasting Till 2050 Using Various Methods and Water
              Supply Strategy for Erbil City
            </h2>
            <small className="text-xs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              facilisis velit eu aliquet blandit. Quisque efficitur, leo nec
              bibendum tincidunt, velit tortor euismod nunc, at euismod tortor
              tortor ut <button className="font-semibold">..More</button>
            </small>
            <div className="w-full flex_start gap-3 flex-wrap">
              <span className="bg-backgroundSecondary text-secondary sm:text-sm text-xs text-opacity-70 p-2 rounded-md">
                Sarwah Othman Ismael
              </span>
              <span className="bg-backgroundSecondary text-secondary sm:text-sm text-xs text-opacity-70 p-2 rounded-md">
                Sarwah Othman Ismael
              </span>
            </div>
            <div className="border-t border-t-lightBorder pt-5 w-full flex justify-between items-center gap-3">
              <div className="flex_center gap-2">
                <span className="w-[30px] h-[30px] rounded-full flex_center bg-backgroundSecondary">
                  <MdCalendarToday />
                </span>
                <div className="flex_start flex-col">
                  <h5 className="text-xs font-semibold">Quarterly</h5>
                  <small className="text-[10px] opacity-70">
                    Publication Frequency
                  </small>
                </div>
              </div>
              <div className="flex_center gap-2">
                <span className="w-[30px] h-[30px] rounded-full flex_center bg-backgroundSecondary">
                  <FaChartLine />
                </span>
                <div className="flex_start flex-col">
                  <h5 className="text-xs font-semibold">5.2</h5>
                  <small className="text-[10px] opacity-70">
                    Impact Factor
                  </small>
                </div>
              </div>
              <div className="flex_center gap-2">
                <span className="w-[30px] h-[30px] rounded-full flex_center bg-backgroundSecondary">
                  <MdLockOpen />
                </span>
                <div className="flex_start flex-col">
                  <h5 className="text-xs font-semibold">Open Access</h5>
                  <small className="text-[10px] opacity-70">Access Type</small>
                </div>
              </div>
            </div>
            <div className="border-t border-t-lightBorder pt-5 w-full flex justify-between items-center gap-3">
              <div className="flex_start flex-col gap-2">
                <span className="text-black opacity-60 text-xs">
                  {t("attachment")}
                </span>
                <button className="border border-lightBorder rounded-3xl flex_center gap-2 px-2 py-1.5 text-sm">
                  <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                    <HiOutlineLink />
                  </span>
                  <span>botancv.PDF</span>
                </button>
              </div>
              <div className="flex_start flex-col gap-2">
                <span className="text-black opacity-60 text-xs">
                  {t("issue_date")}
                </span>
                <span className="text-sm">21 Oct 2023</span>
              </div>
              <div className="flex_start flex-col gap-2">
                <span className="text-black opacity-60 text-xs">
                  {t("latest_issue_date")}
                </span>
                <span className="text-sm">21 Oct 2023</span>
              </div>
            </div>
          </div>
          <div className="flex_start flex-col gap-5 rounded-3xl border border-lightBorder p-5">
            <h2>
              Population Forecasting Till 2050 Using Various Methods and Water
              Supply Strategy for Erbil City
            </h2>
            <small className="text-xs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              facilisis velit eu aliquet blandit. Quisque efficitur, leo nec
              bibendum tincidunt, velit tortor euismod nunc, at euismod tortor
              tortor ut <button className="font-semibold">..More</button>
            </small>
            <div className="w-full flex_start gap-3 flex-wrap">
              <span className="bg-backgroundSecondary text-secondary text-sm text-opacity-70 p-2 rounded-md">
                Sarwah Othman Ismael
              </span>
              <span className="bg-backgroundSecondary text-secondary text-sm text-opacity-70 p-2 rounded-md">
                Sarwah Othman Ismael
              </span>
            </div>
            <div className="border-t border-t-lightBorder pt-5 w-full flex justify-between items-center gap-3">
              <div className="flex_center gap-2">
                <span className="w-[30px] h-[30px] rounded-full flex_center bg-backgroundSecondary">
                  <MdCalendarToday />
                </span>
                <div className="flex_start flex-col">
                  <h5 className="text-xs font-semibold">Quarterly</h5>
                  <small className="text-[10px] opacity-70">
                    Publication Frequency
                  </small>
                </div>
              </div>
              <div className="flex_center gap-2">
                <span className="w-[30px] h-[30px] rounded-full flex_center bg-backgroundSecondary">
                  <FaChartLine />
                </span>
                <div className="flex_start flex-col">
                  <h5 className="text-xs font-semibold">5.2</h5>
                  <small className="text-[10px] opacity-70">
                    Impact Factor
                  </small>
                </div>
              </div>
              <div className="flex_center gap-2">
                <span className="w-[30px] h-[30px] rounded-full flex_center bg-backgroundSecondary">
                  <MdLockOpen />
                </span>
                <div className="flex_start flex-col">
                  <h5 className="text-xs font-semibold">Open Access</h5>
                  <small className="text-[10px] opacity-70">Access Type</small>
                </div>
              </div>
            </div>
            <div className="border-t border-t-lightBorder pt-5 w-full flex justify-between items-center gap-3">
              <div className="flex_start flex-col gap-2">
                <span className="text-black opacity-60 text-xs">
                  {t("attachment")}
                </span>
                <button className="border border-lightBorder rounded-3xl flex_center gap-2 px-2 py-1.5 text-sm">
                  <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                    <HiOutlineLink />
                  </span>
                  <span>botancv.PDF</span>
                </button>
              </div>
              <div className="flex_start flex-col gap-2">
                <span className="text-black opacity-60 text-xs">
                  {t("issue_date")}
                </span>
                <span className="text-sm">21 Oct 2023</span>
              </div>
              <div className="flex_start flex-col gap-2">
                <span className="text-black opacity-60 text-xs">
                  {t("latest_issue_date")}
                </span>
                <span className="text-sm">21 Oct 2023</span>
              </div>
            </div>
          </div>
          <div className="flex_start flex-col gap-5 rounded-3xl border border-lightBorder p-5">
            <h2>
              Population Forecasting Till 2050 Using Various Methods and Water
              Supply Strategy for Erbil City
            </h2>
            <small className="text-xs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              facilisis velit eu aliquet blandit. Quisque efficitur, leo nec
              bibendum tincidunt, velit tortor euismod nunc, at euismod tortor
              tortor ut <button className="font-semibold">..More</button>
            </small>
            <div className="w-full flex_start gap-3 flex-wrap">
              <span className="bg-backgroundSecondary text-secondary text-sm text-opacity-70 p-2 rounded-md">
                Sarwah Othman Ismael
              </span>
              <span className="bg-backgroundSecondary text-secondary text-sm text-opacity-70 p-2 rounded-md">
                Sarwah Othman Ismael
              </span>
            </div>
            <div className="border-t border-t-lightBorder pt-5 w-full flex justify-between items-center gap-3">
              <div className="flex_center gap-2">
                <span className="w-[30px] h-[30px] rounded-full flex_center bg-backgroundSecondary">
                  <MdCalendarToday />
                </span>
                <div className="flex_start flex-col">
                  <h5 className="text-xs font-semibold">Quarterly</h5>
                  <small className="text-[10px] opacity-70">
                    Publication Frequency
                  </small>
                </div>
              </div>
              <div className="flex_center gap-2">
                <span className="w-[30px] h-[30px] rounded-full flex_center bg-backgroundSecondary">
                  <FaChartLine />
                </span>
                <div className="flex_start flex-col">
                  <h5 className="text-xs font-semibold">5.2</h5>
                  <small className="text-[10px] opacity-70">
                    Impact Factor
                  </small>
                </div>
              </div>
              <div className="flex_center gap-2">
                <span className="w-[30px] h-[30px] rounded-full flex_center bg-backgroundSecondary">
                  <MdLockOpen />
                </span>
                <div className="flex_start flex-col">
                  <h5 className="text-xs font-semibold">Open Access</h5>
                  <small className="text-[10px] opacity-70">Access Type</small>
                </div>
              </div>
            </div>
            <div className="border-t border-t-lightBorder pt-5 w-full flex justify-between items-center gap-3">
              <div className="flex_start flex-col gap-2">
                <span className="text-black opacity-60 text-xs">
                  {t("attachment")}
                </span>
                <button className="border border-lightBorder rounded-3xl flex_center gap-2 px-2 py-1.5 text-sm">
                  <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                    <HiOutlineLink />
                  </span>
                  <span>botancv.PDF</span>
                </button>
              </div>
              <div className="flex_start flex-col gap-2">
                <span className="text-black opacity-60 text-xs">
                  {t("issue_date")}
                </span>
                <span className="text-sm">21 Oct 2023</span>
              </div>
              <div className="flex_start flex-col gap-2">
                <span className="text-black opacity-60 text-xs">
                  {t("latest_issue_date")}
                </span>
                <span className="text-sm">21 Oct 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
