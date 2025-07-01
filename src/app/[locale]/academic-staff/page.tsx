"use client";

import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";

interface Teachers {
  id: number;
  name: string;
  email: string;
}

const Page = () => {
  const t = useTranslations("AcademicStaff");
  const { data, loading, error, refetch } = useFetch<Teachers[]>(
    "https://api-dev-v1.epu.edu.iq/website/teachers?page=1&limit=10"
  );
  console.log(data);
  const params = useParams();
  const locale = params.locale;

  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />
        <div className="relative w-full lg:h-[530px] sm:h-[488px] h-[305px]">
          <Image
            src="/images/campus.png"
            alt="title"
            fill
            priority
            className="w-full h-auto object-cover sm:rounded-3xl rounded-lg"
          />
          <div className="absolute w-[95%] left-1/2 -translate-x-1/2 sm:bottom-24 bottom-[30%] bg-white lg:hidden flex gap-5 sm:p-3 p-1 sm:rounded-3xl rounded-lg">
            <div className="relative w-full">
              <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
                <CiSearch />
              </span>
              <input
                type="text"
                className="py-2 w-full border-lightBorder px-8 sm:rounded-3xl rounded-lg border focus:border-primary outline-none"
                placeholder={t("search_by_name")}
              />
            </div>
            <button className="sm:px-6 px-4 flex-shrink-0 p-2 rounded-2xl bg-gradient-to-r from-primary to-blue text-white sm:block hidden">
              {t("search")}
            </button>
          </div>
          <div className="absolute w-[95%] left-1/2 -translate-x-1/2 sm:bottom-5 bottom-2 bg-white flex_center sm:gap-5 gap-2 sm:p-3 p-1 sm:rounded-3xl rounded-lg sm:flex-nowrap flex-wrap">
            <div className="relative lg:w-[20%] sm:w-[33%] w-[45%] text-sm">
              <select
                name="academic"
                id="academic"
                className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-3xl rounded-lg text-black text-opacity-50 focus:border-primary outline-none"
              >
                <option value="#">{t("select_academics")}</option>
                <option value="#">Academic 1</option>
                <option value="#">Academic 2</option>
                <option value="#">Academic 3</option>
              </select>
              <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                <FaChevronDown />
              </span>
            </div>
            <div className="relative lg:w-[20%] sm:w-[33%] w-[45%] text-sm">
              <select
                name="academic"
                id="academic"
                className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-3xl rounded-lg text-black text-opacity-50 focus:border-primary outline-none"
              >
                <option value="#">{t("select_department")}</option>
                <option value="#">Academic 1</option>
                <option value="#">Academic 2</option>
                <option value="#">Academic 3</option>
              </select>
              <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                <FaChevronDown />
              </span>
            </div>
            <div className="relative lg:w-[20%] sm:w-[33%] w-[63%] text-sm">
              <select
                name="academic"
                id="academic"
                className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-3xl rounded-lg text-black text-opacity-50 focus:border-primary outline-none"
              >
                <option value="#">{t("select_position")}</option>
                <option value="#">Academic 1</option>
                <option value="#">Academic 2</option>
                <option value="#">Academic 3</option>
              </select>
              <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                <FaChevronDown />
              </span>
            </div>
            <div className="relative w-[30%] lg:block hidden">
              <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
                <CiSearch />
              </span>
              <input
                type="text"
                className="py-2 w-full border-lightBorder px-8 sm:rounded-3xl rounded-lg border focus:border-primary outline-none"
                placeholder={t("search_by_name")}
              />
            </div>
            <button className="sm:px-6 px-2 flex-shrink-0 sm:p-2 p-1 sm:rounded-3xl rounded-lg bg-gradient-to-r from-primary to-blue text-white lg:block sm:hidden block">
              {t("search")}
            </button>
          </div>
        </div>
        <h3 className="text-lg opacity-60 font-semibold">
          {t("results")} (45)
        </h3>
        <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
          <MemberCard
            description="Vice President for Scientific & Postgraduate Affairs"
            image="/images/president-alt.png"
            link={`/${locale}/academic-staff/1`}
            staticText={t("view_profile")}
            title="Asst. Prof. Dr. Kayhan Zrar Ghafur"
          />
          <MemberCard
            description="Vice President for Scientific & Postgraduate Affairs"
            image="/images/president-alt.png"
            link="/"
            staticText={t("view_profile")}
            title="Asst. Prof. Dr. Kayhan Zrar Ghafur"
          />
          <MemberCard
            description="Vice President for Scientific & Postgraduate Affairs"
            image="/images/president-alt.png"
            link="/"
            staticText={t("view_profile")}
            title="Asst. Prof. Dr. Kayhan Zrar Ghafur"
          />
          <MemberCard
            description="Vice President for Scientific & Postgraduate Affairs"
            image="/images/president-alt.png"
            link="/"
            staticText={t("view_profile")}
            title="Asst. Prof. Dr. Kayhan Zrar Ghafur"
          />
          <MemberCard
            description="Vice President for Scientific & Postgraduate Affairs"
            image="/images/president-alt.png"
            link="/"
            staticText={t("view_profile")}
            title="Asst. Prof. Dr. Kayhan Zrar Ghafur"
          />
        </div>
        <div className="flex_center w-full">
          <button className="custom_button px-20 py-2">{t("see_more")}</button>
        </div>
      </div>
    </div>
  );
};

export default Page;
