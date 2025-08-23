"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}

interface SectionItem {
  id: number;
  title: string;
  subtitle: string;
  image: ImageFile;
}

interface AboutKurdistanData {
  title: string;
  description: string;
  bg_image: ImageFile;
  sections: SectionItem[];
}

// -------- Skeleton Component --------
const PageSkeleton = () => (
  <div className="w-full flex_center my-10 animate-pulse">
    <div className="max-w-[1024px] w-full flex_start flex-col gap-10 lg:px-3 px-5">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <div className="w-full lg:h-[500px] sm:h-[400px] h-[300px] bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-1/3 bg-gray-200 rounded-full"></div>
      <div className="space-y-2 w-full">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex gap-10 w-full md:flex-row flex-col mt-20">
        <div className="w-1/2 h-[380px] bg-gray-200 rounded-lg md:block hidden"></div>
        <div className="flex flex-col mt-5 gap-5 md:w-1/2 w-full">
          <div className="h-8 w-1/2 bg-gray-200 rounded-full"></div>
          <div className="w-full sm:h-[380px] h-[300px] md:hidden block bg-gray-200 rounded-lg"></div>
          <div className="space-y-2 w-full">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("AboutKurdistan");

  const { data: aboutData, loading: isLoading } = useFetch<AboutKurdistanData>(
    `${API_URL}/website/universities/about-kurdistan`
  );

  // Find specific sections from the API response
  const natureSection = aboutData?.sections.find((s) =>
    s.title.toLowerCase().includes("natural")
  );
  const cultureSection = aboutData?.sections.find((s) =>
    s.title.toLowerCase().includes("cultural")
  );

  if (isLoading) return <PageSkeleton />;
  if (!aboutData) return <div>No data found.</div>;

  return (
    <div className="w-full flex_center lg:my-10 my-5">
      <div className="max-w-[1024px] lg:px-3 px-5 w-full flex_start flex-col lg:gap-10 gap-5">
        <SubHeader title={aboutData.title || t("head")} alt={false} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[300px] relative">
          <Image
            src={aboutData.bg_image.lg || "/images/kurdistan.png"}
            alt={aboutData.title}
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="font-semibold sm:text-titleNormal text-xl text-secondary">
          {t("general_background")}
        </h2>
        <span className="text-secondary text-opacity-70 sm:text-smallParagraph text-xs -mt-5">
          {aboutData.description}
        </span>

        {/* Nature Section */}
        {natureSection && (
          <div className="flex_start gap-10 w-full md:flex-row flex-col mt-20">
            <div className="w-1/2 h-[380px] relative md:block hidden">
              <Image
                src={natureSection.image.lg}
                alt={natureSection.title}
                fill
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex_start flex-col mt-5 gap-5 text-secondary md:w-1/2 w-full">
              <h3 className="relative font-semibold z-10 sm:text-titleNormal text-xl md:ltr:-ml-5 ltr:ml-5 md:rtl:-mr-5 rtl:m-5">
                <span className="z-10 relative">{natureSection.title}</span>
                <span className="md:w-full w-[110%] h-[14px] absolute md:ltr:right-[30%] ltr:right-0 md:rtl:left-[30%] rtl:right-0 bottom-2 bg-golden"></span>
              </h3>
              <div className="w-full sm:h-[380px] h-[300px] md:hidden block relative">
                <Image
                  src={natureSection.image.lg}
                  alt={natureSection.title}
                  fill
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="sm:text-sm text-xs opacity-70 font-medium">
                {natureSection.subtitle}
              </span>
            </div>
          </div>
        )}

        {/* Culture Section */}
        {cultureSection && (
          <div className="flex_center gap-10 w-full md:flex-row flex-col mt-10">
            <div className="flex_start flex-col gap-5 text-secondary md:w-1/2 w-full">
              <h3 className="relative font-semibold z-10 sm:text-titleNormal text-xl">
                {cultureSection.title}
              </h3>
              <div className="w-full sm:h-[380px] h-[300px] md:hidden block relative">
                <Image
                  src={cultureSection.image.lg}
                  alt={cultureSection.title}
                  fill
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="sm:text-sm text-xs font-medium opacity-70">
                {cultureSection.subtitle}
              </span>
            </div>
            <div className="w-1/2 h-[380px] relative md:block hidden">
              <Image
                src={cultureSection.image.lg}
                alt={cultureSection.title}
                fill
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
