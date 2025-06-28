"use client";
import React from "react";
import LocalSwitcher from "./local-switcher";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsChevronDown } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { useTranslations } from "next-intl";

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
  const { normalizedPath, locale } = normalizePathname(pathname);
  return (
    <div className="w-full flex-col flex justify-center">
      <div className="flex_center w-full">
        <div className="flex justify-between items-center custom_container px-3 py-2">
          <div className="flex_center gap-2 text-secondary font-semibold text-sm">
            <span>Conference (IEC2023)</span>
            <span>|</span>
            <span>Journals</span>
          </div>
          <Link href="/" className="w-[195px] h-[53px] relative">
            <Image
              src="/images/logo.svg"
              alt="Navbar"
              fill
              sizes="100px"
              priority
            />
          </Link>
          <LocalSwitcher />
        </div>
      </div>
      <div className="flex_center w-full bg-primary text-white py-5 font-medium px-3">
        <div className="custom_container flex justify-between items-center gap-5">
          <div className="flex_center gap-5">
            <Link href={`/${locale}`} className="flex_center gap-2 relative">
              <span>{t("home")}</span>
              {/* <span className="absolute bg-white w-full h-full bg-opacity-25 p-5"></span> */}
            </Link>
            <span className="h-[30px] w-[1px] bg-[#81B1CE]"></span>
            <Link href={`/${locale}/about`} className="flex_center gap-2">
              <span>About Us</span>
              <BsChevronDown className="text-white" />
            </Link>
            <span className="h-[30px] w-[1px] bg-[#81B1CE]"></span>
            <Link href={`/${locale}/about`} className="flex_center gap-2">
              <span>Academics</span>
              <BsChevronDown className="text-white" />
            </Link>
            <span className="h-[30px] w-[1px] bg-[#81B1CE]"></span>
            <Link href={`/${locale}/about`} className="flex_center gap-2">
              <span>Relation</span>
              <BsChevronDown className="text-white" />
            </Link>
            <span className="h-[30px] w-[1px] bg-[#81B1CE]"></span>
            <Link href={`/${locale}/about`} className="flex_center gap-2">
              <span>Centers</span>
              <BsChevronDown className="text-white" />
            </Link>
            <span className="h-[30px] w-[1px] bg-[#81B1CE]"></span>
            <Link href={`/${locale}/about`} className="flex_center gap-2">
              <span>Study Programs</span>
              <BsChevronDown className="text-white" />
            </Link>
            <span className="h-[30px] w-[1px] bg-[#81B1CE]"></span>
            <Link href={`/${locale}/about`} className="flex_center gap-2">
              <span>Students</span>
              <BsChevronDown className="text-white" />
            </Link>
            <span className="h-[30px] w-[1px] bg-[#81B1CE]"></span>
            <Link href={`/${locale}/about`} className="flex_center gap-2">
              <span>Portals</span>
              <BsChevronDown className="text-white" />
            </Link>
            <span className="h-[30px] w-[1px] bg-[#81B1CE]"></span>
            <Link href={`/${locale}/about`} className="flex_center gap-2">
              <span>Academic Staff</span>
              <BsChevronDown className="text-white" />
            </Link>
          </div>
          <button className="text-2xl">
            <FiSearch />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
