"use client";

import SubHeader from "@/components/subHeader";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { useRef } from "react";

// -------- Interfaces --------

interface ImageFile {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: ImageFile;
}

interface AccommodationResponse {
  id: number;
  title: string;
  description: string;
  galleries: GalleryItem[];
}

// -------- Granular Skeleton Components --------

const ImageSkeleton = () => (
  <div className="w-full lg:h-[373px] h-[290px] bg-gray-200 rounded-3xl animate-pulse"></div>
);

const TextSkeleton = () => (
  <div className="space-y-3 animate-pulse w-full">
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
  </div>
);

const Page = () => {
  const t = useTranslations("Students");
  const params = useParams();
  const locale = params?.locale as string;
  const swiperRef = useRef<SwiperCore>();

  // Fetch main accommodation data
  const {
    data: accommodationData,
    loading: isLoading,
    error: hasError,
  } = useFetch<AccommodationResponse>(
    `${API_URL}/website/student-accommodation/main`
  );

  if (hasError) {
    return (
      <div className="w-full flex_center my-20">
        <p className="text-red-500">{t("error_loading_data")}</p>
      </div>
    );
  }

  if (!isLoading && !accommodationData) {
    return (
      <div className="w-full flex_center my-20">
        <p>{t("no_data_found")}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-5 w-full">
        <SubHeader title={t("accomodation")} alt={false} />

        {/* Dynamic Image with Skeleton */}
        {isLoading ? (
          <ImageSkeleton />
        ) : (
          // <div className="w-full lg:h-[373px] h-[290px] relative sm:mt-10 mt-5 rounded-3xl overflow-hidden">
          //   <Image
          //     src={
          //       accommodationData?.galleries?.[0]?.image?.lg ||
          //       "/images/accomodation.png"
          //     }
          //     alt={accommodationData?.galleries?.[0]?.title || "Accommodation"}
          //     fill
          //     priority
          //     className="w-full h-full object-cover"
          //   />
          // </div>
          <div className="w-full lg:h-[373px] h-[290px] relative sm:mt-10 mt-5 rounded-3xl overflow-hidden">
            <Swiper
              modules={[Pagination]}
              slidesPerView={1}
              pagination={{ clickable: true }}
              loop={true}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              className="h-full"
            >
              {accommodationData?.galleries.map((slide, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={slide.image.lg || "/images/campus.png"}
                    alt={slide.title || "Campus"}
                    fill
                    priority
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Dynamic Text with Skeleton */}
        {isLoading ? (
          <TextSkeleton />
        ) : (
          <p className="md:text-lg text-base opacity-70">
            {accommodationData?.description}
          </p>
        )}
      </div>
    </div>
  );
};
export default Page;
