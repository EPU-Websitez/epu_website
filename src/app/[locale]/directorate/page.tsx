"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";

const Page = () => {
  const t = useTranslations("Directorate");
  const params = useParams();
  const locale = params?.locale as string;
  const [tab, setTab] = useState("administrativeStructure");
  const handleTab = (e: string) => {
    setTab(e);
  };
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "avatar1",
      initials: "SJ",
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "avatar2",
      initials: "MC",
    },
    {
      id: 3,
      name: "Emily Davis",
      avatar: "avatar3",
      initials: "ED",
    },
    {
      id: 4,
      name: "Alex Rivera",
      avatar: "avatar4",
      initials: "AR",
    },
  ];
  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("university_directory")} alt={false} />
        <div className="w-full lg:h-[570px] sm:h-[400px] h-[300px] relative">
          <Image
            src={"/images/directorate.jpg"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
        </div>
        <div className="w-full flex_center flex-col gap-10 text-secondary">
          <div className="flex justify-center items-center lg:w-[920px] w-full lg:h-[55px] h-[65px] relative bg-lightBorder rounded-3xl overflow-hidden">
            <span
              className={`bg-gradient-to-r from-primary to-blue duration-200 text-white absolute ltr:left-0 rtl:right-0 top-0 w-[33%] text-wrap h-full rounded-3xl ${
                tab === "administrativeStructure"
                  ? "ltr:left-0 rtl:right-0"
                  : tab === "scientificStructure"
                  ? "ltr:left-[33%] rtl:right-[33%]"
                  : "ltr:left-[67%] rtl:right-[67%]"
              }`}
            ></span>
            <button
              type="button"
              onClick={() => handleTab("administrativeStructure")}
              className={`flex_center w-[33%] text-wrap lg:text-lg text-sm z-10 text-center h-full ${
                tab === "administrativeStructure"
                  ? "text-white"
                  : "text-secondary opacity-70"
              }`}
            >
              {t("administrative_structure")}
            </button>
            <button
              type="button"
              onClick={() => handleTab("scientificStructure")}
              className={`flex_center w-[33%] text-wrap lg:text-lg text-sm z-10 text-center h-full ${
                tab === "scientificStructure"
                  ? "text-white"
                  : "text-secondary opacity-70"
              }`}
            >
              {t("scientific_structure")}
            </button>
            <button
              type="button"
              onClick={() => handleTab("studentAffairs")}
              className={`flex_center w-[33%] text-wrap lg:text-lg text-sm z-10 text-center h-full ${
                tab === "studentAffairs"
                  ? "text-white"
                  : "text-secondary opacity-70"
              }`}
            >
              {t("student_affairs")}
            </button>
          </div>
          <h1 className="md:text-title text-smallTitle font-semibold">
            {t("scientific_structure")}
          </h1>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 w-full">
            <Link
              href={`/${locale}/directorate/1`}
              title="title"
              className="flex_start flex-col gap-5 bg-backgroundSecondary rounded-lg p-5"
            >
              <h3 className="md:text-lg text-base font-semibold">
                Follow up & Audit Directory
              </h3>
              <div className="flex w-full justify-between items-center gap-4 text-white">
                <div className="flex -space-x-3">
                  {users.map((user, index) => (
                    <div
                      key={user.id}
                      className="relative group"
                      style={{ zIndex: users.length - index }}
                    >
                      <Image
                        src={`/images/${user.avatar}.png`}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-3 border-white shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                      />
                      {/* Fallback initials */}
                      <div className="w-8 h-8 rounded-full border-3 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white font-semibold text-sm hover:scale-110 transition-transform duration-200 cursor-pointer hidden absolute top-0 left-0">
                        {user.initials}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {user.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-5 h-5 rounded-full flex_center bg-white">
                  <FiChevronRight className="text-sm text-secondary rtl:rotate-180" />
                </div>
              </div>
            </Link>
            <Link
              href={`/${locale}/directorate/1`}
              title="title"
              className="flex_start flex-col gap-3 bg-backgroundSecondary rounded-lg p-3"
            >
              <h3 className="text-lg font-semibold">
                Follow up & Audit Directory
              </h3>
              <div className="flex w-full justify-between items-center gap-4 text-white">
                <div className="flex -space-x-3">
                  {users.map((user, index) => (
                    <div
                      key={user.id}
                      className="relative group"
                      style={{ zIndex: users.length - index }}
                    >
                      <Image
                        src={`/images/${user.avatar}.png`}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-3 border-white shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                      />
                      {/* Fallback initials */}
                      <div className="w-8 h-8 rounded-full border-3 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white font-semibold text-sm hover:scale-110 transition-transform duration-200 cursor-pointer hidden absolute top-0 left-0">
                        {user.initials}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {user.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-5 h-5 rounded-full flex_center bg-white">
                  <FiChevronRight className="text-sm text-secondary rtl:rotate-180" />
                </div>
              </div>
            </Link>
            <Link
              href={`/${locale}/directorate/1`}
              title="title"
              className="flex_start flex-col gap-3 bg-backgroundSecondary rounded-lg p-3"
            >
              <h3 className="text-lg font-semibold">
                Follow up & Audit Directory
              </h3>
              <div className="flex w-full justify-between items-center gap-4 text-white">
                <div className="flex -space-x-3">
                  {users.map((user, index) => (
                    <div
                      key={user.id}
                      className="relative group"
                      style={{ zIndex: users.length - index }}
                    >
                      <Image
                        src={`/images/${user.avatar}.png`}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-3 border-white shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                      />
                      {/* Fallback initials */}
                      <div className="w-8 h-8 rounded-full border-3 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white font-semibold text-sm hover:scale-110 transition-transform duration-200 cursor-pointer hidden absolute top-0 left-0">
                        {user.initials}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {user.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-5 h-5 rounded-full flex_center bg-white">
                  <FiChevronRight className="text-sm text-secondary rtl:rotate-180" />
                </div>
              </div>
            </Link>
            <Link
              href={`/${locale}/directorate/1`}
              title="title"
              className="flex_start flex-col gap-5 bg-backgroundSecondary rounded-lg p-5"
            >
              <h3 className="text-lg font-semibold">
                Follow up & Audit Directory
              </h3>
              <div className="flex w-full justify-between items-center gap-4 text-white">
                <div className="flex -space-x-3">
                  {users.map((user, index) => (
                    <div
                      key={user.id}
                      className="relative group"
                      style={{ zIndex: users.length - index }}
                    >
                      <Image
                        src={`/images/${user.avatar}.png`}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-3 border-white shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                      />
                      {/* Fallback initials */}
                      <div className="w-8 h-8 rounded-full border-3 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white font-semibold text-sm hover:scale-110 transition-transform duration-200 cursor-pointer hidden absolute top-0 left-0">
                        {user.initials}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {user.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-5 h-5 rounded-full flex_center bg-white">
                  <FiChevronRight className="text-sm text-secondary rtl:rotate-180" />
                </div>
              </div>
            </Link>
            <Link
              href={`/${locale}/directorate/1`}
              title="title"
              className="flex_start flex-col gap-3 bg-backgroundSecondary rounded-lg p-3"
            >
              <h3 className="text-lg font-semibold">
                Follow up & Audit Directory
              </h3>
              <div className="flex w-full justify-between items-center gap-4 text-white">
                <div className="flex -space-x-3">
                  {users.map((user, index) => (
                    <div
                      key={user.id}
                      className="relative group"
                      style={{ zIndex: users.length - index }}
                    >
                      <Image
                        src={`/images/${user.avatar}.png`}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-3 border-white shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                      />
                      {/* Fallback initials */}
                      <div className="w-8 h-8 rounded-full border-3 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white font-semibold text-sm hover:scale-110 transition-transform duration-200 cursor-pointer hidden absolute top-0 left-0">
                        {user.initials}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {user.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-5 h-5 rounded-full flex_center bg-white">
                  <FiChevronRight className="text-sm text-secondary rtl:rotate-180" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
