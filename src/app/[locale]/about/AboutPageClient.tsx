"use client";

import SubHeader from "@/components/subHeader";
import NoData from "@/components/NoData";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { IoBriefcaseOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { PiStudent } from "react-icons/pi";

import useFetch from "@/libs/hooks/useFetch";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// -------- Helper Function for Number Formatting --------
const formatNumber = (numStr: string | undefined): string => {
  if (!numStr) return "0";
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return numStr;

  // Use locale-aware formatting for thousands separator
  return new Intl.NumberFormat().format(num);
};

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}

interface TimelineItem {
  id: number;
  year: string;
  description: string;
}

interface ContentListItem {
  id: number;
  title: string;
}

interface AboutUsData {
  description: string;
  timeline_image: ImageFile;
  thumbnail: string;
  video_url?: string;
  content_title: string;
  content_description: string;
  bg_images: { id: number; image: ImageFile }[];
  timeline_lists: TimelineItem[];
  content_lists: ContentListItem[];
}

interface UniversityStatsData {
  title: string; // Added to use as the main header
  student_number: string;
  teacher_number: string;
  academic_number: string;
  staff_member: string;
}

// -------- Skeletons --------
const HeroSkeleton = () => (
  <div className="w-full lg:h-[500px] sm:h-[400px] h-[300px] bg-gray-200 rounded-lg animate-pulse"></div>
);

const ContentSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-full mt-5"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mt-2"></div>
    <div className="flex justify-between items-center gap-3 w-full border-b border-b-golden sm:pb-20 pb-10 lg:flex-row flex-col mt-10">
      <div className="flex_start flex-col gap-5 w-full lg:w-1/2">
        <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
        <div className="h-40 w-full bg-gray-200 rounded"></div>
      </div>
      <div className="flex_center w-full lg:w-1/2 h-[330px] bg-gray-200 rounded-lg"></div>
    </div>
    <div className="h-10 w-1/3 bg-gray-200 rounded-full mt-10"></div>
    <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
  </div>
);

const AboutPageClient = () => {
  const t = useTranslations("About");
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const { data: aboutData, loading: isLoading, error } = useFetch<AboutUsData>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/universities/about-us`,
    locale
  );

  const { data: statsData } = useFetch<UniversityStatsData>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/universities`,
    locale
  );

  const sortedTimeline = aboutData?.timeline_lists.sort(
    (a, b) => parseInt(a.year) - parseInt(b.year)
  );



  return (
    <div className="w-full flex_center lg:my-10 my-5">
      <div className="max-w-[1024px] lg:px-3 px-5 w-full flex_start flex-col lg:gap-10 gap-5">
        <SubHeader title={t("history")} alt={false} />

        {/* Error State */}
        {error && !isLoading && (
          <div className="w-full flex_center">
            <NoData
              showButton={true}
              className="my-10"
            />
          </div>
        )}

        {/* No Data State */}
        {!error && !isLoading && !aboutData && (
          <div className="w-full flex_center">
            <NoData
              showButton={true}
              className="my-10"
            />
          </div>
        )}

        {/* Hero Image Section */}
        {isLoading ? (
          <HeroSkeleton />
        ) : (
          !error &&
          aboutData &&
          aboutData.bg_images.length > 0 && (
            <div className="w-full lg:h-[500px] sm:h-[400px] h-[200px] relative rounded-3xl overflow-hidden">
              <Swiper
                modules={[Pagination]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                loop={true}
                className="h-full"
              >
                {aboutData.bg_images.map((item) => (
                  <SwiperSlide key={item.id}>
                    <Image
                      src={item.image.lg}
                      alt={t("history")}
                      fill
                      priority
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.svg";
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )
        )}

        {isLoading ? (
          <ContentSkeleton />
        ) : (
          !error &&
          aboutData && (
            <>
              {/* Description (About Us Text) */}
              <p className="text-secondary font-medium mt-5 sm:text-base text-sm">
                {aboutData.description}
              </p>

              {/* TIMELINE SECTION */}
              <div className="flex justify-between items-center gap-3 w-full border-b border-b-golden sm:pb-20 pb-10 lg:flex-row flex-col lg:px-0 px-3">
                <div className="flex_start flex-col gap-5 lg:w-auto w-full">
                  <h5 className="text-sm text-secondary font-medium">
                    {t("uni_stages")}
                  </h5>
                  {/* Dynamic Timeline Line Height (after:h-full) */}
                  <div className="flex_start flex-col gap-5 relative after:absolute after:h-full ltr:after:left-0 rtl:after:right-0 after:top-0 after:w-[1px] after:bg-golden ltr:pl-5 rtl:pr-5">
                    {sortedTimeline?.map((item) => (
                      <div
                        key={item.id}
                        className="flex_start flex-col gap-2 relative"
                      >
                        <span className="absolute top-0 ltr:-left-[34px] rtl:-right-[34px] z-10 border-2 border-golden w-7 h-7 rounded-full bg-white"></span>
                        <span className="absolute top-1.5 ltr:-left-[28px] rtl:-right-[28px] z-20 bg-golden w-4 h-4 rounded-full"></span>
                        <h1 className="sm:text-titleNormal text-xl text-golden font-medium">
                          {item.year}
                        </h1>
                        <p className="text-secondary sm:text-base text-sm max-w-[380px]">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* -------- VIDEO / IMAGE SECTION -------- */}
                <div className="flex_center lg:w-auto w-full">
                  <div className="lg:w-[440px] w-full h-[300px] relative bg-gray-100 sm:rounded-3xl rounded-lg overflow-hidden">
                    {aboutData.video_url ? (
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        poster={aboutData.thumbnail}
                        className="w-full h-full object-cover"
                      >
                        <source src={aboutData.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        src={aboutData.timeline_image?.lg}
                        alt={`Historical event image for year ${
                          sortedTimeline?.[0]?.year || "university"
                        }`}
                        fill
                        priority
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.svg";
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* **Content Title and Content** */}
              <h1 className="sm:text-title text-titleNormal font-semibold sm:mt-10 mt-5 text-secondary">
                {t("head")}
              </h1>
              <p className="text-secondary sm:text-base text-sm font-medium">
                {aboutData.content_description}
              </p>
              <div className="sm:px-14 px-0 flex_start flex-col gap-5 text-secondary font-medium">
                {aboutData.content_lists.map((item) => (
                  <div key={item.id} className="flex_start gap-5">
                    <span className="sm:w-6 w-5 sm:h-6 h-5 rounded-full bg-golden flex-shrink-0"></span>
                    <p className="sm:text-base text-sm font-medium">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )
        )}

        {/* **Stats Section with Number Formatting** */}
        {statsData && (
          <div className="grid sm:grid-cols-4 grid-cols-2 lg:gap-5 sm:gap-2 gap-5 justify-between w-full my-10 lg:px-10 px-3 text-secondary">
            <div className="flex_center flex-col gap-2">
              <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
                <PiStudent />
              </span>
              <h1 className="sm:text-title text-titleNormal font-bold">
                + {formatNumber(statsData.student_number)}
              </h1>
              <p className="font-medium">{t("students")}</p>
            </div>
            <div className="flex_center flex-col gap-2">
              <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
                <IoBriefcaseOutline />
              </span>
              <h1 className="sm:text-title text-titleNormal font-bold">
                + {formatNumber(statsData.teacher_number)}
              </h1>
              <p className="font-medium">{t("teachers")}</p>
            </div>
            <div className="flex_center flex-col gap-2">
              <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
                <HiOutlineBuildingOffice />
              </span>
              <h1 className="sm:text-title text-titleNormal font-bold">
                + {formatNumber(statsData.academic_number)}
              </h1>
              <p className="font-medium">{t("academics")}</p>
            </div>
            <div className="flex_center flex-col gap-2">
              <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
                <LuUsers />
              </span>
              <h1 className="sm:text-title text-titleNormal font-bold">
                + {formatNumber(statsData.staff_member)}
              </h1>
              <p className="font-medium">{t("staff_members")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPageClient;
