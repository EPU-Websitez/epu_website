"use client";

import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import useFetch from "@/libs/hooks/useFetch";

// Interfaces
interface College {
  id: number;
  vision: string;
  mission: string;
  // ... other properties you might need
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

const VisionAndMissionClient = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;

  const {
    data: collegeData,
    loading: collegeLoading,
    error: collegeError,
  } = useFetch<College>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/colleges/${college}`,
    locale
  );

  if (collegeLoading) return <PageSkeleton />;

  if (collegeError || !collegeData) {
    return (
      <div className="w-full flex_center min-h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            {collegeError ? "Error Loading College Data" : "College Not Found"}
          </h1>
          <p className="text-gray-600">
            {collegeError
              ? "Please try again later."
              : "The requested college could not be found."}
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

export default VisionAndMissionClient;
