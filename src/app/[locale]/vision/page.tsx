"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  lg: string;
}

interface UniversityData {
  title: string;
  vision: string;
  intro_image: ImageFile;
}

// -------- Skeleton Component --------
const PageSkeleton = () => (
  <div className="my-10 flex_center w-full animate-pulse">
    <div className="max-w-[1024px] w-full flex_start flex-col gap-10 sm:px-3 px-5">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] bg-gray-200 rounded-3xl"></div>
      <div className="w-full space-y-4 mt-5">
        <div className="h-10 w-1/3 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Vision");

  const { data: uniData, loading: isLoading } = useFetch<UniversityData>(
    `${API_URL}/website/universities`
  );

  if (isLoading) return <PageSkeleton />;
  if (!uniData) return <div>No data found.</div>;

  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] sm:px-3 px-5 w-full flex_start flex-col gap-10">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative rounded-3xl overflow-hidden">
          <Image
            src={uniData.intro_image.lg}
            alt={uniData.title}
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>

        {/* Vision Section */}
        <div className="w-full flex flex-col items-start gap-4">
          <h2 className="sm:text-3xl text-2xl z-10 relative font-semibold text-secondary">
            {t("title")}
          </h2>
          <p className="text-secondary text-opacity-80 sm:text-base text-sm leading-relaxed">
            {uniData.vision}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Page;
