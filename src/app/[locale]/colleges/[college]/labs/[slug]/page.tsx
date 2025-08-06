"use client";

import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { PiFlaskLight } from "react-icons/pi";
import { RiDashboardHorizontalLine } from "react-icons/ri";

// --- INTERFACES ---
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
  created_at: string;
  updated_at: string;
}

interface Section {
  id: number;
  laboratory_id: number;
  title: string;
  description: string; // The API uses 'description', not 'content'
  images: Image[]; // Each section has its own images
}

interface LabDepartment {
  department: {
    id: number;
    title: string;
  };
}

// Wrapper for the main laboratory images array
interface LabImage {
  id: number;
  image: Image;
}

interface Laboratory {
  id: number;
  slug: string;
  name: string;
  lab_number: string;
  equipped_with: string;
  description: string;
  departments: LabDepartment[]; // Added departments array
  images: LabImage[]; // Corrected image array structure
  sections: Section[];
}

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
const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const slug = params?.slug as string;
  const locale = params?.locale as string;
  const college = params?.college as string;

  const {
    data: labData,
    loading: labLoading,
    error: labError,
  } = useFetch<Laboratory>(
    `${API_URL}/website/colleges/${college}/laboratories/${slug}`
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

  return (
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
              <small className="text-xs">{t("belongs_to")}</small>
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
        <div className="flex_center gap-10 w-full mt-5 md:flex-row flex-col">
          <div className="flex_start md:w-auto w-full flex-col gap-5">
            <div className="h-10 flex_center gap-2">
              <span className="h-full w-1 bg-golden"></span>
              <span className="h-full w-1 bg-golden"></span>
              <span className="h-full w-1 bg-golden"></span>
            </div>
            {locale === "en" && (
              <h1 className="md:text-[32px] text-xl font-semibold relative">
                Cutting-Edge Laboratory <br />{" "}
                <span className="text-golden">Research</span> Hub
              </h1>
            )}
            {locale === "ku" && (
              <h1 className="md:text-[32px] text-xl font-semibold relative">
                باشترین ناوەندی <br />{" "}
                <span className="text-golden">لێکۆڵینەوەی</span> تاقیگە
              </h1>
            )}
            {locale === "ar" && (
              <h1 className="md:text-[32px] text-xl font-semibold relative">
                مختبر الأبحاث <br />{" "}
                <span className="text-golden">المتطورة</span>
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
            className={`w-full flex_center gap-10 md:flex-row flex-col-reverse ${
              index % 2 !== 0 ? "md:flex-row-reverse" : "" // Alternates layout on desktop
            }`}
          >
            <div className="lg:w-[555px] md:w-[410px] w-full lg:h-[500px] md:h-[420px] h-[340px] relative flex-shrink-0">
              <Image
                src={
                  section.images?.[0]?.md ||
                  section.images?.[0]?.original ||
                  "/images/lab-1.png" // Fallback image
                }
                className="object-cover rounded-3xl"
                alt={section.title}
                fill
                priority
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
  );
};

export default Page;
