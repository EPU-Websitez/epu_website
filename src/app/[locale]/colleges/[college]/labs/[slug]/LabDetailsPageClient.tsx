// src/app/[locale]/colleges/[college]/labs/[slug]/LabDetailsPageClient.tsx

"use client";

import { useState } from "react";
import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";

import useFetch from "@/libs/hooks/useFetch";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { PiFlaskLight } from "react-icons/pi";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";

// --- INTERFACES ---
interface ImageFile {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface Section {
  id: number;
  title: string;
  description: string;
  images: ImageFile[];
}

interface LabDepartment {
  department: {
    id: number;
    title: string;
    college: {
      title: string;
    };
  };
}

interface LabImage {
  id: number;
  image: ImageFile;
}

interface Laboratory {
  id: number;
  slug: string;
  name: string;
  lab_number: string;
  equipped_with: string;
  description: string;
  departments: LabDepartment[];
  images: LabImage[];
  sections: Section[];
}

// --- MODAL COMPONENT ---
const DepartmentsModal = ({
  isOpen,
  onClose,
  departments,
}: {
  isOpen: boolean;
  onClose: () => void;
  departments: LabDepartment[];
}) => {
  const t = useTranslations("Colleges");
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex_center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg relative text-secondary"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-800 transition-colors"
        >
          <IoClose />
        </button>
        <h3 className="text-xl font-semibold mb-4 border-b pb-3">
          {t("associated_departments")}
        </h3>
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto custom_scroll pr-2">
          {departments?.map((dept) => (
            <li
              key={dept.department.id}
              className="p-3 rounded-lg bg-gray-50 border border-gray-200"
            >
              <p className="font-medium">{dept.department.title}</p>
              <p className="text-sm text-gray-500">
                {dept.department.college.title}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- SKELETON COMPONENTS ---
const InfoCardSkeleton = () => (
  <div className="w-full flex justify-between md:items-center items-start md:flex-row flex-col gap-5 p-5 rounded-3xl bg-gray-300 animate-pulse">
    <div className="flex_center gap-3">
      <div className="w-[60px] h-[60px] bg-gray-400 rounded-lg"></div>
      <div className="flex-start flex-col gap-2">
        <div className="h-3 bg-gray-400 rounded w-16"></div>
        <div className="h-4 bg-gray-400 rounded w-32"></div>
      </div>
    </div>
    <div className="flex_center gap-3">
      <div className="w-[60px] h-[60px] bg-gray-400 rounded-lg"></div>
      <div className="flex-start flex-col gap-2">
        <div className="h-3 bg-gray-400 rounded w-16"></div>
        <div className="h-4 bg-gray-400 rounded w-20"></div>
      </div>
    </div>
    <div className="flex_center gap-3">
      <div className="w-[60px] h-[60px] bg-gray-400 rounded-lg"></div>
      <div className="flex-start flex-col gap-2">
        <div className="h-3 bg-gray-400 rounded w-20"></div>
        <div className="h-4 bg-gray-400 rounded w-28"></div>
      </div>
    </div>
  </div>
);

const PageSkeleton = () => (
  <div className="w-full flex_center flex-col sm:my-10 my-5">
    <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full">
      <div className="animate-pulse w-full h-20 bg-gray-300 rounded-lg"></div>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-48"></div>
      </div>
      <InfoCardSkeleton />
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="flex_center gap-10 w-full mt-5 md:flex-row flex-col">
        <div className="flex_start md:w-auto w-full flex-col gap-5">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64"></div>
          </div>
        </div>
        <div className="md:h-[360px] h-[260px] md:w-[695px] w-full bg-gray-300 animate-pulse rounded-3xl"></div>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const LabDetailsPageClient = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const slug = params?.slug as string;
  const locale = params?.locale as string;
  const college = params?.college as string;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: labData,
    loading: labLoading,
    error: labError,
  } = useFetch<Laboratory>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/colleges/${college}/laboratories/${slug}`,
    locale
  );

  if (labLoading) {
    return <PageSkeleton />;
  }

  if (labError) {
    return (
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1024px] px-3 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Laboratory Data
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!labData) {
    return (
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1024px] px-3 text-center">
          <h1 className="text-2xl font-bold text-gray-500 mb-4">
            Laboratory Not Found
          </h1>
          <p className="text-gray-600">
            The requested laboratory could not be found.
          </p>
        </div>
      </div>
    );
  }

  const hasMultipleDepts = labData.departments?.length > 1;

  return (
    <>
      <DepartmentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        departments={labData.departments}
      />
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full">
          <CollegeHeader />
          <SubHeader title={labData.name} alt={false} />

          {/* Info Card */}
          <div className="w-full flex justify-between md:items-center items-start md:flex-row flex-col gap-5 p-5 rounded-3xl bg-golden text-white">
            <div className="flex_center gap-3">
              <span className="w-[60px] h-[60px] flex-shrink-0 rounded-lg flex_center bg-white bg-opacity-30">
                <HiOutlineBuildingOffice className="text-4xl" />
              </span>
              <div className="flex-start flex-col">
                <div className="flex items-center gap-2">
                  <small className="text-xs">{t("belongs_to")}</small>
                  {hasMultipleDepts && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-8 h-8 flex_center bg-white text-golden rounded-md hover:bg-opacity-80 transition-opacity"
                      title="View all departments"
                    >
                      <span className="text-sm">
                        {labData.departments?.length}
                      </span>
                      <GoPlus />
                    </button>
                  )}
                </div>
                <h4 className="md:text-lg text-base font-medium">
                  {labData.departments?.[0]?.department?.title || labData.name}
                </h4>
              </div>
            </div>
            <div className="flex_center gap-3">
              <span className="w-[60px] h-[60px] flex-shrink-0 rounded-lg flex_center bg-white bg-opacity-30">
                <PiFlaskLight className="text-4xl" />
              </span>
              <div className="flex-start flex-col">
                <small className="text-xs">{t("lab_number")}</small>
                <h4 className="md:text-lg text-base font-medium">
                  {labData.lab_number || "N/A"}
                </h4>
              </div>
            </div>
            <div className="flex_center gap-3">
              <span className="w-[60px] h-[60px] flex-shrink-0 rounded-lg flex_center bg-white bg-opacity-30">
                <RiDashboardHorizontalLine className="text-4xl" />
              </span>
              <div className="flex-start flex-col">
                <small className="text-xs">{t("equipped_with")}</small>
                <h4 className="md:text-lg text-base font-medium">
                  {labData.equipped_with || t("specialized_instruments")}
                </h4>
              </div>
            </div>
          </div>

          {/* Laboratory Description */}
          <p className="opacity-70">{labData.description || t("lab_text")}</p>

          {/* Redesigned Main Section */}
          <div className="flex_center gap-10 w-full mt-5 md:flex-row flex-col">
            <div className="flex_start md:w-1/2 w-full flex-col gap-5">
              <div className="h-10 flex_center gap-2">
                <span className="h-full w-1 bg-golden"></span>
                <span className="h-full w-1 bg-golden"></span>
                <span className="h-full w-1 bg-golden"></span>
              </div>
              {locale === "en" && (
                <h1 className="md:text-[32px] text-xl font-semibold relative">
                  Explore the <br />{" "}
                  <span className="text-golden">{labData.name}</span>
                </h1>
              )}
              {locale === "ku" && (
                <h1 className="md:text-[32px] text-xl font-semibold relative">
                  {labData.name} <br />{" "}
                  <span className="text-golden">بگەڕێ</span>
                </h1>
              )}
              {locale === "ar" && (
                <h1 className="md:text-[32px] text-xl font-semibold relative">
                  استكشف <br />{" "}
                  <span className="text-golden">{labData.name}</span>
                </h1>
              )}
            </div>
            <div className="md:h-[360px] h-[260px] md:w-[695px] w-full relative rounded-3xl overflow-hidden">
              <Image
                src={
                  labData.images?.[0]?.image?.lg ||
                  labData.images?.[0]?.image?.original ||
                  "/images/lab.png"
                }
                className="object-cover"
                alt={labData.name}
                fill
                priority
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.svg";
                }}
              />
              <div className="absolute text-white w-[90%] rounded-3xl md:bottom-5 bottom-1/2 md:translate-y-0 translate-y-1/2 left-1/2 -translate-x-1/2 p-5 bg-primary bg-opacity-70 md:text-base text-sm">
                {labData.description || t("lab_text")}
              </div>
            </div>
          </div>

          {/* DYNAMIC SECTIONS with alternating layout */}
          {labData.sections?.map((section, index) => (
            <div
              key={section.id}
              className={`w-full flex_center mt-10 gap-10 md:flex-row flex-col-reverse ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="lg:w-[555px] md:w-[410px] w-full lg:h-[500px] md:h-[420px] h-[340px] relative flex-shrink-0">
                <Image
                  src={
                    section.images?.[0]?.md ||
                    section.images?.[0]?.original ||
                    "/images/lab-1.png"
                  }
                  className="object-cover rounded-3xl"
                  alt={section.title}
                  fill
                  priority
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.svg";
                  }}
                />
              </div>
              <div className="flex_start flex-col gap-5">
                <h1 className="md:text-[32px] text-xl font-semibold">
                  {section.title}
                </h1>
                <p className="md:text-base text-sm opacity-70">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LabDetailsPageClient;
