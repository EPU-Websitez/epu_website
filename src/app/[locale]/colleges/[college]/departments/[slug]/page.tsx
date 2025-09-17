"use client";

import DepartmentHeader from "@/components/departmentHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoBriefcaseOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// Interfaces
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
  created_at: string;
  updated_at: string;
}

interface Gallery {
  id: number;
  department_id: number;
  image_id: number;
  created_at: string;
  updated_at: string;
  image: Image;
}

interface Contact {
  id: number;
  department_id: number;
  type: string;
  value: string;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: number;
  department_id: number;
  latitude: string;
  longitude: string;
  location: string;
  created_at: string;
  updated_at: string;
}

interface College {
  id: number;
  subdomain: string;
  title: string;
  news_title: string;
  news_subtitle: string;
  college_title: string;
  college_subtitle: string;
  teacher_title: string;
  teacher_subtitle: string;
  event_title: string;
  event_subtitle: string;
  about_title: string;
  about_content: string;
  student_number: string;
  vision: string;
  mission: string;
  logo_image_id: number;
  priority: number;
  created_at: string;
  updated_at: string;
}

interface Department {
  id: number;
  college_id: number;
  slug: string;
  title: string;
  subtitle: string;
  about: string;
  vision: string;
  mission: string;
  priority: number;
  created_at: string;
  updated_at: string;
  student_number: string;
  staffCount: string;
  leadCount: string;
  college: College;
  galleries: Gallery[];
  contacts: Contact[];
  addresses: Address[];
}

// Skeleton Components for dynamic content only
const AboutContentSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-11/12"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-10/12"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-9/12"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-8/12"></div>
  </div>
);

const StatsSkeleton = () => (
  <div className="flex_center flex-col sm:gap-2 gap-1 animate-pulse">
    <div className="w-[50px] h-[50px] rounded-full bg-gray-300"></div>
    <div className="h-6 bg-gray-300 rounded w-16"></div>
    <div className="h-4 bg-gray-200 rounded w-20"></div>
  </div>
);

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;
  const college = params?.college as string;

  const {
    data: departmentData,
    loading,
    error,
  } = useFetch<Department>(`${API_URL}/website/departments/${slug}`, locale);

  // Generate consistent stats based on department ID
  const generateStats = (departmentId?: number) => {
    if (!departmentId) return { students: 0, teachers: 0, staff: 0 };

    const seed = departmentId * 1000;
    const students = Math.floor((seed % 2000) + 500); // 500-2500 students
    const teachers = Math.floor((seed % 80) + 20); // 20-100 teachers
    const staff = Math.floor((seed % 150) + 50); // 50-200 staff

    return {
      students: Math.floor(students / 100) / 10, // Convert to K format
      teachers,
      staff,
    };
  };

  const stats = generateStats(departmentData?.id);

  if (error) {
    return (
      <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
        <DepartmentHeader />
        <div className="max-w-[1040px] flex_start w-full">
          <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-red-500 mb-4">
                Department Not Found
              </h1>
              <p className="text-gray-600">
                The department youre looking for doesnt exist.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 -mt-5">
      <DepartmentHeader />
      <div className="max-w-[1040px] flex_start w-full">
        <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
          <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
            {/* Navigation Sidebar - Static */}
            <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-auto w-full">
              <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                <span>{t("about_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </div>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/vision-and-mission`}
                title={t("vision_mission")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder hover:opacity-100 transition-opacity"
              >
                <span>{t("vision_mission")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/staff`}
                title={t("council_staff")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder hover:opacity-100 transition-opacity"
              >
                <span>{t("council_staff")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/news`}
                title={t("news_button")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder hover:opacity-100 transition-opacity"
              >
                <span>{t("news_button")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              {/* <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/researches`}
                title={t("researches")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder hover:opacity-100 transition-opacity"
              >
                <span>{t("researches")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link> */}
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/course-subjects`}
                title={t("course_subjects")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder hover:opacity-100 transition-opacity"
              >
                <span>{t("course_subjects")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
              <Link
                href={`/${locale}/colleges/${college}/departments/${slug}/guide-lines`}
                title={t("guide_lines")}
                className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder hover:opacity-100 transition-opacity"
              >
                <span>{t("guide_lines")}</span>
                <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
              </Link>
            </div>

            {/* Main Content - Dynamic */}
            <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
              <div className="md:block hidden">
                <SubHeader title={t("about_button")} alt={false} />
              </div>
              <h2 className="md:hidden block relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                <span className="z-10 relative">{t("about_button")}</span>
              </h2>

              {/* About Content - Dynamic with skeleton */}
              {loading ? (
                <AboutContentSkeleton />
              ) : (
                <p className="opacity-70 text-secondary md:text-base text-xs">
                  {departmentData?.about ||
                    "The Department of information systems engineering was founded in 2008, in order to keep in line with the modern developments which are taking place rapidly in the field of information, computer technology, and software, where this technology has played an important role in the economies of many developing countries. The department has first welcomed its students in (2008-2009). At the department, the best students enroll to receive education in order to become members of a creative and innovative highly scientific staff; the study period is four years after gaining High school certificate. The Department gives The BSc, higher diploma, MSc, PhD degrees in information systems engineering. This department offers a full range of computer services including software engineering, businesses process reengineering, data base development, programming and web/portal development. The department technology-based solutions for the design, engineering, integration, development, installation, testing and acceptance of information systems."}
                </p>
              )}

              {/* Statistics - Dynamic with skeleton */}
              <div className="grid sm:grid-cols-3 grid-cols-2 lg:gap-5 sm:gap-2 gap-5 justify-between w-full my-10 lg:px-10 px-3 text-secondary">
                {loading ? (
                  <>
                    <StatsSkeleton />
                    <StatsSkeleton />
                    <StatsSkeleton />
                  </>
                ) : (
                  <>
                    <div className="flex_center flex-col sm:gap-2 gap-1">
                      <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
                        <PiStudent />
                      </span>
                      <h1 className="sm:text-title text-xl font-medium">
                        + {departmentData?.student_number || 0}
                      </h1>
                      <p className="sm:text-base text-sm font-medium">
                        {t("students")}
                      </p>
                    </div>
                    <div className="flex_center flex-col sm:gap-2 gap-1">
                      <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
                        <IoBriefcaseOutline />
                      </span>
                      <h1 className="sm:text-title text-xl font-medium">
                        + {departmentData?.staffCount || 0}
                      </h1>
                      <p className="sm:text-base text-sm font-medium">
                        {t("teachers")}
                      </p>
                    </div>
                    <div className="flex_center flex-col sm:gap-2 gap-1">
                      <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
                        <LuUsers />
                      </span>
                      <h1 className="sm:text-title text-xl font-medium">
                        + {departmentData?.leadCount || 0}
                      </h1>
                      <p className="sm:text-base text-sm font-medium">
                        {t("staff_members")}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
