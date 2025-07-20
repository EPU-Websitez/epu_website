"use client";

import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
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
  college_id: number;
  image_id: number;
  created_at: string;
  updated_at: string;
  image: Image;
}

interface Contact {
  id: number;
  college_id: number;
  type: string;
  value: string;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: number;
  college_id: number;
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
  description: string | null;
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
  galleries: Gallery[];
  contacts: Contact[];
  addresses: Address[];
  logo: Image;
  staff_count: number;
  departments_count: number;
  laboratories_count: number;
}

// Skeleton Components
const VisionMissionSkeleton = () => (
  <div className="lg:grid-cols-2 grid-cols-1 grid w-full gap-10">
    <div className="flex_start flex-col gap-5 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-32"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
    <div className="flex_start flex-col gap-5 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-32"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

const PageSkeleton = () => (
  <div className="w-full flex_center flex-col sm:my-10 my-5">
    <div className="max-w-[1379px] px-3 flex_start w-full">
      <div className="animate-pulse w-full h-20 bg-gray-300 rounded-lg"></div>
    </div>
    <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full sm:mt-14 mt-10">
      <VisionMissionSkeleton />
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;

  // Fetch college data
  const {
    data: collegeData,
    loading: collegeLoading,
    error: collegeError,
  } = useFetch<College>(`${API_URL}/website/colleges/${college}`);

  if (collegeLoading) {
    return <PageSkeleton />;
  }

  if (collegeError) {
    return (
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1024px] px-3 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading College Data
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!collegeData) {
    return (
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1024px] px-3 text-center">
          <h1 className="text-2xl font-bold text-gray-500 mb-4">
            College Not Found
          </h1>
          <p className="text-gray-600">
            The requested college could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full sm:mt-14 mt-10">
        <div className="lg:grid-cols-2 grid-cols-1 grid w-full gap-10">
          {/* Vision Section */}
          <div className="flex_start flex-col gap-5">
            <SubHeader title={t("vision")} alt={false} />
            <p className="text-sm leading-relaxed">
              {collegeData.vision || t("no_vision_available")}
            </p>
          </div>

          {/* Mission Section */}
          <div className="flex_start flex-col gap-5">
            <SubHeader title={t("mission")} alt={false} />
            <p className="text-sm leading-relaxed">
              {collegeData.mission || t("no_mission_available")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
