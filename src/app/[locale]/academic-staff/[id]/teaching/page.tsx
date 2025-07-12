"use client";
import Breadcrumb from "@/components/breadcrumb";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaFacebookF, FaGoogleScholar, FaResearchgate } from "react-icons/fa6";
import { HiOutlineLink } from "react-icons/hi2";
import { IoMdArrowUp } from "react-icons/io";

const Page = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;
  const tableData = [
    {
      subject: "Academic Computing",
      stage: "First Stage",
      semester: "First Semester",
      year: "2022 - 2023",
    },
    {
      subject: "Academic Computing",
      stage: "First Stage",
      semester: "First Semester",
      year: "2022 - 2023",
    },
    {
      subject: "Academic Computing",
      stage: "First Stage",
      semester: "First Semester",
      year: "2022 - 2023",
    },
    {
      subject: "Academic Computing",
      stage: "First Stage",
      semester: "First Semester",
      year: "2022 - 2023",
    },
  ];
  return (
    <div className="flex_center w-full flex-col">
      <div className="max-w-[1380px] w-full relative flex_center flex-col gap-5 sm:px-2 px-5 text-secondary">
        <div className="relative w-full h-[276px]">
          <div className="absolute left-5 top-5 z-10">
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
          <div className="flex w-full justify-between lg:items-center items-start lg:gap-2 xl:gap-6 gap-3 mt-3 lg:flex-row flex-col">
            <div className="flex sm:justify-center flex-shrink-0 justify-start sm:items-center items-start gap-3 sm:flex-row flex-col">
              <div className="flex_center gap-3 rounded-xl border-golden border text-golden px-3 py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden"></span>
                <p className="text-sm">Vice President for Scientific</p>
              </div>
              <div className="flex_center gap-3 flex-shrink-0 rounded-xl border-golden border text-golden px-3 py-1.5">
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
          <p className=" border-b border-b-secondary px-3 sm:text-base text-sm flex-shrink-0 font-medium">
            {t("teaching")}
          </p>
          <Link
            href={`/${locale}/academic-staff/${id}/education`}
            title={t("education")}
            className=" opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
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
          <Link
            href={`/${locale}/academic-staff/${id}/academics`}
            title={t("academics")}
            className="  opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("academics")}
          </Link>
        </div>
        <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center  sm:px-0 px-5">
          <div className="sm:mt-10 mt-5 flex_start flex-col gap-10 max-w-[1024px] w-full px-2">
            <div className="lg:block hidden">
              <SubHeader title={t("teaching")} alt={true} />
            </div>
            <div className="lg:hidden block">
              <SubHeader title={t("teaching")} alt={false} />
            </div>
            <div className="overflow-x-auto shadow-lg w-full sm:mt-0 -mt-4">
              <table className="w-full bg-white">
                <thead>
                  <tr className="lg:bg-primary bg-golden text-white">
                    <th className="md:px-6 px-3 sm:py-4 py-3 font-medium text-xs text-center tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                      {t("subject")}
                    </th>
                    <th className="md:px-6 px-3 sm:py-4 py-3 font-medium text-xs text-center tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                      {t("stage")}
                    </th>
                    <th className="md:px-6 px-3 sm:py-4 py-3 font-medium text-xs text-center tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                      {t("semester")}
                    </th>
                    <th className="md:px-6 px-3 sm:py-4 py-3 font-medium text-xs text-center tracking-wider md:min-w-max min-w-[170px]">
                      {t("year")}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {tableData.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="md:px-6 px-3 md:py-4 py-3 text-xs text-center font-medium ltr:border-r rtl:border-l border-gray-200">
                        {row.subject}
                      </td>
                      <td className="md:px-6 px-3 md:py-4 py-3 text-xs text-center ltr:border-r rtl:border-l border-gray-200">
                        {row.stage}
                      </td>
                      <td className="md:px-6 px-3 md:py-4 py-3 text-xs text-center ltr:border-r rtl:border-l border-gray-200">
                        {row.semester}
                      </td>
                      <td className="md:px-6 px-3 md:py-4 py-3 text-xs text-center">
                        {row.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
