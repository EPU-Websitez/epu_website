"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { GrLinkNext } from "react-icons/gr";
import { HiOutlineLink } from "react-icons/hi2";

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const tableData = [
    {
      subject: "Academic Computing",
      code: "1BC43a",
      theory_hours: "4 Hours",
      practical_hours: "4 Hours",
      ECTS: "4",
      module_description: "2022 - 2023",
      language: "Kurdish",
    },
    {
      subject: "Academic Computing",
      code: "1BC43a",
      theory_hours: "4 Hours",
      practical_hours: "4 Hours",
      ECTS: "4",
      module_description: "2022 - 2023",
      language: "Kurdish",
    },
    {
      subject: "Academic Computing",
      code: "1BC43a",
      theory_hours: "4 Hours",
      practical_hours: "4 Hours",
      ECTS: "4",
      module_description: "2022 - 2023",
      language: "Kurdish",
    },
    {
      subject: "Academic Computing",
      code: "1BC43a",
      theory_hours: "4 Hours",
      practical_hours: "4 Hours",
      ECTS: "4",
      module_description: "2022 - 2023",
      language: "Kurdish",
    },
  ];
  return (
    <div className="w-full flex_center my-10">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8 text-secondary">
        <SubHeader title={t("course_carriculum")} alt={false} />
        <h3 className="text-lg text-golden font-semibold">
          {t("first_semester")}
        </h3>
        <div className="overflow-x-auto shadow-sm custom_scroll rounded-lg w-full">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-golden text-white">
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("subject")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("code")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 text-nowrap py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("theory_hours")}
                </th>
                <th className="md:px-6 text-nowrap px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("practical_hours")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("ECTS")}
                </th>
                <th className="md:px-6 px-3 text-nowrap sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("module_description")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider md:min-w-max min-w-[170px]">
                  {t("language")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 font-medium ltr:border-r rtl:border-l border-gray-200 text-nowrap">
                    {row.subject}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 ltr:border-r rtl:border-l border-gray-200">
                    {row.code}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.theory_hours}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.practical_hours}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.ECTS}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.module_description}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900">
                    {row.language}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-lg text-golden font-semibold">
          {t("second_semester")}
        </h3>
        <div className="overflow-x-auto shadow-sm custom_scroll rounded-lg w-full">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-golden text-white">
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("subject")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("code")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 text-nowrap py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("theory_hours")}
                </th>
                <th className="md:px-6 text-nowrap px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("practical_hours")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("ECTS")}
                </th>
                <th className="md:px-6 px-3 text-nowrap sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("module_description")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider md:min-w-max min-w-[170px]">
                  {t("language")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 font-medium ltr:border-r rtl:border-l border-gray-200 text-nowrap">
                    {row.subject}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 ltr:border-r rtl:border-l border-gray-200">
                    {row.code}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.theory_hours}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.practical_hours}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.ECTS}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.module_description}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900">
                    {row.language}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-lg text-golden font-semibold">
          {t("third_semester")}
        </h3>
        <div className="overflow-x-auto shadow-sm custom_scroll rounded-lg w-full">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-golden text-white">
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("subject")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("code")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 text-nowrap py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("theory_hours")}
                </th>
                <th className="md:px-6 text-nowrap px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("practical_hours")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("ECTS")}
                </th>
                <th className="md:px-6 px-3 text-nowrap sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                  {t("module_description")}
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider md:min-w-max min-w-[170px]">
                  {t("language")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 font-medium ltr:border-r rtl:border-l border-gray-200 text-nowrap">
                    {row.subject}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 ltr:border-r rtl:border-l border-gray-200">
                    {row.code}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.theory_hours}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.practical_hours}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.ECTS}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.module_description}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900">
                    {row.language}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Page;
