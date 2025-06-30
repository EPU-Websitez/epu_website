"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { FaPlay } from "react-icons/fa6";

const Page = () => {
  const t = useTranslations("Tutorials");
  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} />
        <div className="w-full flex_center sm:gap-10 gap-3">
          <div className="relative w-full h-14">
            <span className="pointer-events-none text-black opacity-50 absolute ltr:left-5 right-5 top-1/2 -translate-y-1/2 z-10 text-2xl">
              <CiSearch />
            </span>
            <input
              type="text"
              className="h-full w-full bg-lightBorder px-14 rounded-2xl  focus:border-primary outline-none focus:outline-primary"
              placeholder={t("search")}
            />
          </div>
          <button className="sm:px-8 px-4 flex-shrink-0 h-14 rounded-2xl bg-gradient-to-r from-primary to-blue text-white">
            {t("search_button")}
          </button>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-10 mt-10">
          <div className="w-full flex_start flex-col md:gap-4 gap-2 group relative">
            <Link
              href={"/"}
              className="relative w-full md:h-[330px] h-[200px] rounded-xl overflow-hidden"
            >
              <div className=" w-32 h-7 flex_center rounded-full z-10 absolute top-2 ltr:left-2 rtl:right-2">
                <Image
                  src="/images/logo.svg"
                  alt="title"
                  fill
                  priority
                  className="w-full h-auto object-cover group-hover:scale-105 duration-300"
                />
              </div>
              <Image
                src="/images/park.png"
                alt="title"
                fill
                priority
                className="w-full h-auto object-cover group-hover:scale-105 duration-300"
              />
              <button className="flex_center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white rounded-full text-xl bg-gradient-to-r from-[#DCC48C] to-[#FFA64D] z-10">
                <FaPlay />
              </button>
              <a
                href="#"
                title="title"
                className="absolute bottom-3 ltr:left-0 right-0 ltr:rounded-r-full rounded-l-full bg-black bg-opacity-35 px-3 py-2 text-white text-sm"
              >
                {t("watch")}
              </a>
            </Link>
            <h3 className="md:text-lg text-base font-medium hover:text-primary text-secondary duration-300">
              Introduction to Moodle
            </h3>
          </div>
          <div className="w-full flex_start flex-col md:gap-4 gap-2 group relative">
            <Link
              href={"/"}
              className="relative w-full md:h-[330px] h-[200px] rounded-xl overflow-hidden"
            >
              <div className=" w-32 h-7 flex_center rounded-full z-10 absolute top-2 ltr:left-2 rtl:right-2">
                <Image
                  src="/images/logo.svg"
                  alt="title"
                  fill
                  priority
                  className="w-full h-auto object-cover group-hover:scale-105 duration-300"
                />
              </div>
              <Image
                src="/images/park.png"
                alt="title"
                fill
                priority
                className="w-full h-auto object-cover group-hover:scale-105 duration-300"
              />
              <button className="flex_center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white rounded-full text-xl bg-gradient-to-r from-[#DCC48C] to-[#FFA64D] z-10">
                <FaPlay />
              </button>
              <a
                href="#"
                title="title"
                className="absolute bottom-3 left-0 rounded-r-full bg-black bg-opacity-35 px-3 py-2 text-white text-sm"
              >
                Watch On Youtube
              </a>
            </Link>
            <h3 className="md:text-lg text-base font-medium hover:text-primary text-secondary duration-300">
              Introduction to Moodle
            </h3>
          </div>
          <div className="w-full flex_start flex-col md:gap-4 gap-2 group relative">
            <Link
              href={"/"}
              className="relative w-full md:h-[330px] h-[200px] rounded-xl overflow-hidden"
            >
              <div className=" w-32 h-7 flex_center rounded-full z-10 absolute top-2 ltr:left-2 rtl:right-2">
                <Image
                  src="/images/logo.svg"
                  alt="title"
                  fill
                  priority
                  className="w-full h-auto object-cover group-hover:scale-105 duration-300"
                />
              </div>
              <Image
                src="/images/park.png"
                alt="title"
                fill
                priority
                className="w-full h-auto object-cover group-hover:scale-105 duration-300"
              />
              <button className="flex_center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white rounded-full text-xl bg-gradient-to-r from-[#DCC48C] to-[#FFA64D] z-10">
                <FaPlay />
              </button>
              <a
                href="#"
                title="title"
                className="absolute bottom-3 left-0 rounded-r-full bg-black bg-opacity-35 px-3 py-2 text-white text-sm"
              >
                Watch On Youtube
              </a>
            </Link>
            <h3 className="md:text-lg text-base font-medium hover:text-primary text-secondary duration-300">
              Introduction to Moodle
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
