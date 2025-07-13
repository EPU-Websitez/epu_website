"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BsUpload } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import { GoCalendar } from "react-icons/go";
import { PiGraduationCap, PiHandshake } from "react-icons/pi";
import { TfiShine } from "react-icons/tfi";

const Page = () => {
  const t = useTranslations("Programs");
  const [formData, setFormData] = useState({
    email: "Example@gmail.com",
    fullName: "Kamaran Ali Mhamad",
    gender: "Male",
    birthdate: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (gender: any) => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));
  };
  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1040px] px-3 w-full flex_start flex-col gap-10">
        <SubHeader title={t("application_form")} alt={false} />
        <div className="w-full flex_start flex-col gap-5 py-5 rounded-3xl border border-lightBorder bg-backgroundSecondary">
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0 bg-golden rounded-full flex items-center justify-center text-white font-medium text-sm">
                1
              </div>
              <p className="text-golden font-semibold text-xs max-w-[155px]">
                General Information of the Applicant
              </p>
            </div>
            <div className="w-[60px] h-0.5 bg-black opacity-20"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0 bg-[#B9B9B9] rounded-full flex items-center justify-center text-white font-medium text-lg">
                2
              </div>
              <p className="text-[#B9B9B9] font-medium text-xs max-w-[155px]">
                Applying for Ph.D
              </p>
            </div>

            <div className="w-[60px] h-0.5 bg-black opacity-20"></div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0 bg-[#B9B9B9] rounded-full flex items-center justify-center text-white font-medium text-lg">
                3
              </div>
              <p className="text-[#B9B9B9] font-medium text-xs max-w-[155px]">
                applicant background in bachelor degree
              </p>
            </div>

            <div className="w-[60px] h-0.5 bg-black opacity-20"></div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0 bg-[#B9B9B9] rounded-full flex items-center justify-center text-white font-medium text-lg">
                4
              </div>
              <p className="text-[#B9B9B9] font-medium text-xs max-w-[155px]">
                type of application submission
              </p>
            </div>
          </div>
          <div className="w-full h-1.5 bg-black bg-opacity-15 relative mb-5">
            <span className="absolute w-[15%] h-full left-0 top-0 bg-golden"></span>
          </div>
          <div className="w-full flex_start flex-col gap-5 px-3">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Your Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CiMail className="text-xl text-black text-opacity-60" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block pl-10 pr-3 py-3 border border-lightBorder bg-inherit rounded-lg focus:border-primary outline-none text-black text-opacity-60 text-xs w-[375px] h-[52px]"
                  placeholder="Example@gmail.com"
                />
              </div>
            </div>
            <div className="my-3">
              <label className="block text-sm font-medium text-secondary mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineUser className="text-xl text-black text-opacity-60" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="block pl-10 pr-3 py-3 border border-lightBorder bg-inherit rounded-lg focus:border-primary outline-none text-black text-opacity-60 text-xs w-[375px] h-[52px]"
                  placeholder="Kamaran Ali Mhamad"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-secondary mb-2">
                Personal Photo
              </label>
              <div className="border border-lightBorder rounded-lg p-6 text-center bg-inherit flex items-center justify-start gap-4 text-black text-opacity-60 text-xs w-[375px] h-[52px]">
                <BsUpload className="text-lg" />
                <p className="">Select Photo</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Gender
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleGenderChange("Male")}
                  className={`px-3 py-2 flex_center gap-2 border rounded-2xl text-xs font-medium transition-colors ${
                    formData.gender === "Male"
                      ? "bg-blue border-[#59A4FC50] bg-opacity-10 text-secondary"
                      : "bg-lightBorder border-[#E8E8E850] bg-opacity-10 text-secondary"
                  }`}
                >
                  <span
                    className={`w-[18px] h-[18px] rounded-full flex_center ${
                      formData.gender === "Male" ? "bg-[#0075FF]" : "bg-white"
                    }`}
                  >
                    {formData.gender === "Male" && (
                      <FaCheck className="text-xs text-white" />
                    )}
                  </span>
                  <span>Male</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange("Female")}
                  className={`px-3 py-2 flex_center gap-2 border rounded-2xl text-xs font-medium transition-colors ${
                    formData.gender === "Female"
                      ? "bg-blue border-[#59A4FC50] bg-opacity-10 text-secondary"
                      : "bg-lightBorder border-[#E8E8E850] bg-opacity-10 text-secondary"
                  }`}
                >
                  <span
                    className={`w-[18px] h-[18px] rounded-full flex_center ${
                      formData.gender === "Female" ? "bg-[#0075FF]" : "bg-white"
                    }`}
                  >
                    {formData.gender === "Female" && (
                      <FaCheck className="text-xs text-white" />
                    )}
                  </span>
                  <span>Female</span>
                </button>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birthdate
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GoCalendar className="text-xl text-black text-opacity-60" />
                </div>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
