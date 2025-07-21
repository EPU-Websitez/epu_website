"use client";
import React, { useEffect, useState } from "react";
import LocalSwitcher from "./local-switcher";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { BsChevronDown } from "react-icons/bs";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { IoChevronForward, IoMenu } from "react-icons/io5";

const normalizePathname = (pathname: string) => {
  const segments = pathname.split("/");
  let locale = "";
  if (segments.length > 1 && segments[1].length === 2) {
    // Assuming locale is a 2-letter code
    locale = segments[1];
    segments.splice(1, 1); // Remove the locale
  }
  return { normalizedPath: segments.join("/") || "/", locale };
};

const Navbar = () => {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const normalizePathname = (pathname: string) => {
    const segments = pathname.split("/");
    let locale = "";
    if (segments.length > 1 && segments[1].length === 2) {
      // Assuming locale is a 2-letter code
      locale = segments[1];
      segments.splice(1, 1); // Remove the locale
    }
    return { normalizedPath: segments.join("/") || "/", locale };
  };
  const params = useParams();
  const college = params?.college as string;
  const { normalizedPath, locale } = normalizePathname(pathname);
  const [isCollege, setIsCollege] = useState(false);

  useEffect(() => {
    if (locale === "en") {
      document.body.dir = "ltr";
    } else {
      document.body.dir = "rtl";
    }
    if (normalizedPath.includes("colleges")) {
      setIsCollege(true);
    }
  }, [locale, normalizedPath]);

  const [navIsOpen, setNavIsOpen] = useState(false);
  const handleNav = () => {
    setNavIsOpen(!navIsOpen);
  };

  return (
    <div className="w-full flex-col flex justify-center">
      <div className="flex_center w-full">
        <div className="flex justify-between items-center custom_container px-3 py-2">
          <div className="flex_center gap-2 text-secondary sm:text-sm text-xs">
            <span>Conference (IEC2023)</span>
            <span>|</span>
            <span>Journals</span>
          </div>
          <Link
            href="/"
            className="w-[195px] h-[53px] relative sm:block hidden"
          >
            <Image src="/images/logo.svg" alt="Navbar" fill priority />
          </Link>
          <LocalSwitcher />
        </div>
      </div>
      <div className="flex_center w-full bg-primary text-white lg:py-5 py-3 font-medium sm:px-3 px-3">
        <div className="custom_container flex justify-between items-center xl:gap-5 gap-2">
          {/* mobile navbar */}
          <Link
            href={"/"}
            className="w-[110px] h-[25px] relative sm:hidden block"
          >
            <Image
              src={"/images/logo-alt.png"}
              alt="My Image"
              fill
              priority
              className="w-full h-full"
            />
          </Link>
          {navIsOpen && (
            <button
              type="button"
              onClick={handleNav}
              className="fixed top-0 left-0 w-full h-screen z-20 bg-black bg-opacity-40"
            ></button>
          )}
          {!isCollege ? (
            <div
              className={`flex_start flex-col gap-5 rounded-3xl bg-white w-[80%] h-screen fixed top-0 right-0 z-40 text-secondary  duration-300 ${
                navIsOpen
                  ? "max-w-[80%] py-10 px-5"
                  : "max-w-0 overflow-hidden p-0"
              }`}
            >
              <button
                type="button"
                onClick={handleNav}
                className="flex justify-start items-center text-xl bg-white custom_shape absolute top-1/2 -left-[50px] w-20 h-16 shadow-[12px_0_0_0_white] rounded-full -translate-y-1/2 z-10 text-black"
              >
                <IoChevronForward className="ml-5" />
              </button>
              <Link
                href="/"
                className="flex w-full border-b border-b-lightBorder z-10 font-semibold pb-3"
              >
                {t("home")}
              </Link>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link href={"about"}>{t("about")}</Link>
                <button className="text-2xl">
                  <FiPlus />
                </button>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link href={"about"}>{t("academics")}</Link>
                <button className="text-2xl">
                  <FiPlus />
                </button>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link href={"about"}>{t("relation")}</Link>
                <button className="text-2xl">
                  <FiPlus />
                </button>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link href={"about"}>{t("studyProgram")}</Link>
                <button className="text-2xl">
                  <FiPlus />
                </button>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link href={"about"}>{t("students")}</Link>
                <button className="text-2xl">
                  <FiPlus />
                </button>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link href={"about"}>{t("portals")}</Link>
                <button className="text-2xl">
                  <FiPlus />
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`flex_start flex-col gap-5 rounded-3xl bg-white w-[80%] h-screen fixed top-0 right-0 z-40 text-secondary  duration-300 ${
                navIsOpen
                  ? "max-w-[80%] py-10 px-5"
                  : "max-w-0 overflow-hidden p-0"
              }`}
            >
              <button
                type="button"
                onClick={handleNav}
                className="flex justify-start items-center text-xl bg-white custom_shape absolute top-1/2 -left-[50px] w-20 h-16 shadow-[12px_0_0_0_white] rounded-full -translate-y-1/2 z-10 text-black"
              >
                <IoChevronForward className="ml-5" />
              </button>
              <Link
                href={`/${locale}/colleges/${college}`}
                title={t("home")}
                className="flex w-full border-b border-b-lightBorder z-10 font-semibold pb-3"
              >
                {t("home")}
              </Link>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/about`}
                  title={t("about")}
                >
                  {t("about")}
                </Link>
                <button className="text-2xl">
                  <FiPlus />
                </button>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/departments`}
                  title={t("departments")}
                >
                  {t("departments")}
                </Link>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/college-council`}
                  title={t("college_council")}
                >
                  {t("college_council")}
                </Link>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/teachers`}
                  title={t("teachers")}
                >
                  {t("teachers")}
                </Link>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/labs`}
                  title={t("labs")}
                >
                  {t("labs")}
                </Link>
              </div>
              <div className="flex justify-between items-center w-full border-b border-b-lightBorder z-10 font-semibold pb-3">
                <Link
                  href={`/${locale}/colleges/${college}/news`}
                  title={t("news_events")}
                >
                  {t("news_events")}
                </Link>
              </div>
            </div>
          )}

          {/* desktop navbar */}
          {!isCollege ? (
            <div className="sm:flex hidden justify-center items-center xl:gap-5 gap-3">
              <Link
                href={`/${locale}`}
                className="flex_center gap-2 xl:text-base text-xs relative"
              >
                <span>{t("home")}</span>
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/about`}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("about")}</span>
                <BsChevronDown className="text-white" />
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/about`}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("academics")}</span>
                <BsChevronDown className="text-white" />
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/about`}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("relation")}</span>
                <BsChevronDown className="text-white" />
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/centers`}
                className="lg:flex hidden justify-center items-center gap-2 xl:text-base text-xs"
              >
                <span>{t("centers")}</span>
                <BsChevronDown className="text-white" />
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50 lg:block hidden"></span>
              <Link
                href={`/${locale}/about`}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("studyProgram")}</span>
                <BsChevronDown className="text-white" />
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/students`}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("students")}</span>
                <BsChevronDown className="text-white" />
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/about`}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("portals")}</span>
                <BsChevronDown className="text-white" />
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50 lg:block hidden"></span>
              <Link
                href={`/${locale}/academic-staff`}
                className="lg:flex hidden justify-center items-center gap-2 xl:text-base text-xs"
              >
                <span>{t("academicStaff")}</span>
                <BsChevronDown className="text-white" />
              </Link>
            </div>
          ) : (
            <div className="sm:flex hidden justify-center items-center xl:gap-5 gap-3">
              <Link
                href={`/${locale}/colleges/${college}`}
                title={t("home")}
                className="flex_center gap-2 xl:text-base text-xs relative"
              >
                <span>{t("home")}</span>
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/colleges/${college}/about`}
                title={t("about")}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("about")}</span>
                <BsChevronDown className="text-white" />
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/colleges/${college}/departments`}
                title={t("departments")}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("departments")}</span>
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/colleges/${college}/college-council`}
                title={t("college_council")}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("college_council")}</span>
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/colleges/${college}/teachers`}
                title={t("teachers")}
                className="lg:flex hidden justify-center items-center gap-2 xl:text-base text-xs"
              >
                <span>{t("teachers")}</span>
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50 lg:block hidden"></span>
              <Link
                href={`/${locale}/colleges/${college}/labs`}
                title={t("labs")}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("labs")}</span>
              </Link>
              <span className="h-[30px] w-[1px] bg-[#81B1CE] bg-opacity-50"></span>
              <Link
                href={`/${locale}/colleges/${college}/news`}
                title={t("news_events")}
                className="flex_center gap-2 xl:text-base text-xs"
              >
                <span>{t("news_events")}</span>
              </Link>
            </div>
          )}
          <div className="flex_center gap-4">
            <button className="sm:text-2xl text-lg">
              <FiSearch />
            </button>
            <button
              type="button"
              onClick={handleNav}
              className="sm:hidden block text-lg"
            >
              <IoMenu />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
