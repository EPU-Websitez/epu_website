"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { useParams } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";
import { API_URL } from "@/libs/env";
import SubHeader from "./subHeader";

interface CenterResponse {
  id: number;
  slug: string;
  title: string;
  description: string;
  galleries: {
    id: number;
    center_id: number;
    image_id: number;
    created_at: string;
    updated_at: string;
    image: {
      id: number;
      original: string;
      lg: string;
      md: string;
      sm: string;
      created_at: string;
      updated_at: string;
    };
  }[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CenterSkeleton = () => (
  <div className="w-full flex justify-center items-start sm:mt-10 mt-6 min-h-screen animate-pulse">
    <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
      <div className="w-full flex_start">
        <div className="h-8 w-40 bg-gray-300 rounded"></div>
      </div>
      <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative sm:mt-14 mt-6 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const CenterHeader = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const swiperRef = useRef<SwiperCore>();

  const { data, error, isLoading } = useSWR<CenterResponse>(
    slug ? `${API_URL}/website/centers/${slug}` : null,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60, // 1 hour
      revalidateOnFocus: false,
    }
  );

  if (isLoading || !data) return <CenterSkeleton />;
  if (error)
    return <div className="text-center text-red-500">Failed to load data.</div>;

  return (
    <>
      <div className="w-full flex_start">
        <SubHeader title={data?.title || slug} alt={false} />
      </div>
      <div className="w-full relative">
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop={true}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {data.galleries.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative sm:mt-14 mt-6">
                <div className="absolute lg:-top-14 top-10 ltr:left-10 right-10 sm:flex hidden flex-col max-w-[520px] z-10 p-4">
                  <h2 className="bg-primary text-white text-xl font-semibold z-10 p-5">
                    {data.description}
                  </h2>
                  <div className="triangle -mt-14 rotate-90"></div>
                </div>
                <Image
                  src={`${API_URL}/${slide.image.lg}`}
                  alt={data.title}
                  fill
                  priority
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default CenterHeader;
