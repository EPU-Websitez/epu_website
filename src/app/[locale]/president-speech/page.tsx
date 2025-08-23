"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  lg: string;
}
interface GalleryItem {
  id: number;
  image: ImageFile;
}
interface PresidentMessageData {
  subtitle: string;
  description: string;
  galleries: GalleryItem[];
}

// -------- Skeleton Component --------
const PageSkeleton = () => (
  <div className="w-full flex_center my-10 animate-pulse">
    <div className="max-w-[1024px] w-full flex_start flex-col gap-10 px-3">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <div className="w-full lg:h-[500px] sm:h-[400px] h-[250px] bg-gray-200 rounded-2xl"></div>
      <div className="space-y-3 w-full mt-5">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded mt-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("PresidentSpeech");

  const { data: messageData, loading: isLoading } =
    useFetch<PresidentMessageData>(
      `${API_URL}/website/universities/president-message`
    );

  if (isLoading) return <PageSkeleton />;
  if (!messageData) return <div>No data available.</div>;

  return (
    <div className="w-full flex_center my-10">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-10">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[250px] relative">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={messageData.galleries.length > 1}
            className="w-full h-full rounded-2xl"
          >
            {messageData.galleries.map((item) => (
              <SwiperSlide key={item.id}>
                <Image
                  src={item.image.lg}
                  alt={t("head")}
                  fill
                  priority
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <p className="absolute z-10 bg-golden lg:bg-primary border-white border-4 right-0 lg:bottom-0 -bottom-1.5 ltr:rounded-tl-2xl rtl:rounded-tr-2xl text-white w-[33%] sm:w-auto sm:max-w-[33%] py-4 text-center lg:text-base md:text-sm text-xs sm:block hidden">
            {t("name")}
          </p>
          <p className="absolute z-10 bg-golden border-white border-4 right-0 ltr:rounded-tl-2xl rtl:rounded-tr-2xl text-white sm:bottom-0 -bottom-1 w-[65%] py-2 text-center text-xs sm:hidden block">
            {t("name")}
          </p>
        </div>
        <div className="sm:w-[111px] w-14 sm:h-[111px] h-14 relative">
          <Image src={"/images/quote.svg"} alt="Quote" fill priority />
        </div>
        <h3 className="text-[#4A4A4A] sm:text-base text-sm font-semibold">
          {messageData.subtitle}
        </h3>
        <p className="text-[#4A4A4A] sm:text-base text-sm">
          {messageData.description}
        </p>
        <div className="w-full flex items-end justify-end">
          <div className="sm:w-[111px] w-14 sm:h-[111px] h-14 relative rotate-180">
            <Image src={"/images/quote.svg"} alt="Quote" fill priority />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
