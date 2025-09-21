"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";

import useFetch from "@/libs/hooks/useFetch";
import { useParams } from "next/navigation";

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

const AboutKurdistanClient = () => {
  const t = useTranslations("AboutKurdistan");
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const { data: aboutData, loading: isLoading } = useFetch<AboutKurdistanData>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/universities/about-kurdistan`,
    locale
  );

  if (isLoading) return <PageSkeleton />;
  if (!aboutData) return <div>{t("no_data_found")}</div>;

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
            className="w-full h-full object-cover sm:rounded-3xl rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>
        <h2 className="font-semibold sm:text-titleNormal text-xl text-secondary">
          {t("general_background")}
        </h2>
        <span className="text-secondary text-opacity-70 sm:text-smallParagraph text-xs -mt-5">
          {aboutData.description}
        </span>

        {/* --- Dynamic Sections Rendering --- */}
        {aboutData.sections.map((section, index) => (
          <div
            key={section.id}
            className={`flex items-start gap-10 w-full md:flex-row flex-col mt-20 ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image for Desktop */}
            <div className="md:w-1/2 w-full h-[380px] relative md:block hidden">
              <Image
                src={section.image.lg}
                alt={section.title}
                fill
                priority
                className="w-full h-full object-cover sm:rounded-3xl rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.svg";
                }}
              />
            </div>

            {/* Content Section */}
            <div className="flex_start flex-col gap-5 text-secondary md:w-1/2 w-full">
              {index === 0 ? (
                <h3 className="relative font-semibold z-10 sm:text-titleNormal text-xl md:ltr:-ml-5 ltr:ml-0 md:rtl:-mr-5 rtl:mr-0">
                  <span className="z-10 relative">{section.title}</span>
                  <span className="md:w-full w-[100%] h-[14px] absolute md:ltr:right-[25%] ltr:right-0 md:rtl:left-[25%] rtl:right-0 bottom-2 bg-golden"></span>
                </h3>
              ) : (
                <h3 className="font-semibold z-10 sm:text-titleNormal text-xl">
                  {section.title}
                </h3>
              )}

              {/* Image for Mobile */}
              <div className="w-full sm:h-[380px] h-[300px] md:hidden block relative">
                <Image
                  src={section.image.lg}
                  alt={section.title}
                  fill
                  priority
                  className="w-full h-full object-cover sm:rounded-3xl rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.svg";
                  }}
                />
              </div>

              <span className="sm:text-sm text-xs opacity-70 font-medium">
                {section.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutKurdistanClient;
