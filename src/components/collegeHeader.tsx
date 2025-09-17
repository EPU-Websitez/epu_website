"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef } from "react";
import useSWR from "swr";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { API_URL } from "@/libs/env";

interface Response {
  id: number;
  slug: string;
  title: string;
  about_content: string;
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

const Skeleton = () => (
  <div className="w-full flex justify-center items-start sm:mt-10 mt-6 min-h-screen animate-pulse">
    <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
      <div className="w-full flex_start">
        <div className="h-8 w-40 bg-gray-300 rounded"></div>
      </div>
      <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative sm:mt-14 mt-6 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const CollegeHeader = () => {
  const params = useParams();
  const college = params?.college as string;
  const locale = params?.locale as string;
  const swiperRef = useRef<SwiperCore>();
  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "website-language": locale,
      },
    }).then((res) => res.json());
  const { data, error, isLoading } = useSWR<Response>(
    college ? `${API_URL}/website/colleges/${college}` : null,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60, // 1 hour
      revalidateOnFocus: false,
    }
  );

  if (isLoading || !data) return <Skeleton />;
  if (error)
    return <div className="text-center text-red-500">Failed to load data.</div>;
  return (
    <div className="w-full relative">
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="max-w-[1042px] mx-auto w-full h-full sm:flex sm:items-start sm:justify-start flex items-start justify-center">
          <div className="flex px-3 justify-between items-center md:gap-20 gap-7 md:h-[437px] sm:h-[300px] h-[225px] rounded-3xl overflow-hidden w-full">
            <div className="absolute left-0 top-0 w-full h-full ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary rounded-3xl to-[#ffffff71] z-10 opacity-80"></div>
            <div className="z-20 flex_start flex-col md:max-w-[710px] max-w-[90%] md:gap-8 gap-4 text-white">
              <h1 className="lg:text-[60px] leading-relaxed md:text-[40px] text-base font-bold">
                {data.title}
              </h1>
              <p className="lg:text-lg md:text-base text-[10px] font-medium">
                {data.about_content?.length > 300
                  ? `${data.about_content
                      .slice(0, 300)
                      .split(" ")
                      .slice(0, -1)
                      .join(" ")}...`
                  : data.about_content}
              </p>
            </div>
            <div className="lg:w-[184px] z-20 md:w-[134px] w-[50px] lg:h-[258px] md:h-[208px] h-[70px] relative flex-shrink-0">
              <Image
                className="w-full h-full"
                fill
                priority
                src={"/images/small-logo.png"}
                alt="logo"
              ></Image>
            </div>
          </div>
        </div>
      </div>
      {data.galleries.length > 1 ? (
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          loop={true}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="md:h-[437px] sm:h-[300px] h-[225px] w-full"
        >
          {data.galleries.map((slide, index) => (
            <SwiperSlide key={index}>
              <Image
                src={`${slide.image.lg}`}
                alt={data.title}
                fill
                priority
                className="w-full h-full object-cover rounded-3xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="md:h-[437px] sm:h-[300px] h-[225px] w-full relative">
          <Image
            src={`${data?.galleries[0]?.image?.lg}`}
            alt={data.title}
            fill
            priority
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      )}
    </div>
  );
};

export default CollegeHeader;
