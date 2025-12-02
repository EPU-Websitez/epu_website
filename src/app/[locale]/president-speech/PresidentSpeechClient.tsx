"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import useFetch from "@/libs/hooks/useFetch";
import { useParams } from "next/navigation";

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
  title: string;
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

const PresidentSpeechClient = () => {
  const t = useTranslations("PresidentSpeech");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const { data: messageData, loading: isLoading } =
    useFetch<PresidentMessageData>(
      `${process.env.NEXT_PUBLIC_API_URL}/website/universities/president-message`,
      locale
    );

  if (isLoading) return <PageSkeleton />;
  if (!messageData) return <div>No data available.</div>;

  return (
    <div className="w-full flex_center my-10">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-10">
        <SubHeader title={messageData.title} alt={false} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[250px] relative ltr:justify-end rtl:justify-start items-end flex">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={messageData.galleries.length > 1}
            className="w-full h-full rounded-2xl absolute top-0 left-0"
          >
            {messageData.galleries.map((item) => (
              <SwiperSlide key={item.id}>
                <Image
                  src={item.image.lg}
                  alt={t("head")}
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
          <div className="relative z-10 bg-white border-b-0 p-1 pb-0 rounded-tl-2xl text-white text-center lg:text-base md:text-sm text-xs">
            <svg
              className="card__arc_president"
              viewBox="0 0 80 80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path d="M 40 80 c 22 0 40 -22 40 -40 v 40 Z" />
            </svg>
            <svg
              className="card__arc_president_alt"
              viewBox="0 0 80 80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path d="M 40 80 c 22 0 40 -22 40 -40 v 40 Z" />
            </svg>
            <div className="w-full h-full lg:bg-primary bg-golden rounded-lg p-2">
              {t("name")}
            </div>
          </div>
        </div>
        <div className="sm:w-[111px] w-14 sm:h-[111px] h-14 relative">
          <Image
            src={"/images/quote.svg"}
            alt="Quote"
            fill
            priority
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>
        <h3 className="text-[#4A4A4A] sm:text-base text-sm font-semibold">
          {messageData.subtitle}
        </h3>
        {/* <p className="text-[#4A4A4A] sm:text-base text-sm">
          {messageData.description}
        </p> */}
        <div
          className="text-[#4A4A4A] sm:text-base text-sm"
          dangerouslySetInnerHTML={{
            __html: messageData.description,
          }}
        />
        <div className="w-full flex items-end justify-end">
          <div className="sm:w-[111px] w-14 sm:h-[111px] h-14 relative rotate-180">
            <Image
              src={"/images/quote.svg"}
              alt="Quote"
              fill
              priority
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PresidentSpeechClient;
