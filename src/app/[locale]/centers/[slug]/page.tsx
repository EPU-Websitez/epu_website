"use client";

import SubHeader from "@/components/subHeader";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BsTelephoneFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { useRef } from "react";
// ================= INTERFACES =================
interface CenterResponse {
  id: number;
  slug: string;
  title: string;
  description: string;
  vision: string;
  mission: string;
  created_at: string;
  updated_at: string;
  priority: number;
  contacts: {
    id: number;
    center_id: number;
    type: "EMAIL" | "PHONE";
    value: string;
    created_at: string;
    updated_at: string;
  }[];
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

// ================= SKELETON =================
const CenterSkeleton = () => (
  <div className="w-full flex justify-center items-start sm:mt-10 mt-6 min-h-screen animate-pulse">
    <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
      <div className="w-full flex_start">
        <div className="h-8 w-40 bg-gray-300 rounded"></div>
      </div>

      <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative sm:mt-14 mt-6 bg-gray-200 rounded-lg"></div>

      <div className="md:w-[720px] w-full my-10 sm:h-[50px] h-[35px] grid grid-cols-3 justify-center items-center bg-lightBorder text-secondary rounded-3xl">
        <div className="bg-gray-300 h-full w-full rounded-3xl" />
        <div className="bg-gray-200 h-full w-full rounded-3xl" />
        <div className="bg-gray-200 h-full w-full rounded-3xl" />
      </div>

      <div className="w-full flex_start flex-col gap-10">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="mt-10 pb-10 border-b w-full border-b-lightBorder flex_start flex-col gap-5"
          >
            <div className="h-6 w-40 bg-gray-300 rounded"></div>
            <div className="h-4 w-full max-w-[600px] bg-gray-200 rounded"></div>
            <div className="h-4 w-full max-w-[500px] bg-gray-200 rounded"></div>
          </div>
        ))}
        <div className="flex_center sm:flex-row flex-col gap-10 text-secondary">
          <div className="flex_center gap-3 w-full sm:w-auto">
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="flex_start flex-col">
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-300 rounded mt-1"></div>
            </div>
          </div>
          <div className="flex_center gap-3 w-full sm:w-auto">
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="flex_start flex-col">
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-300 rounded mt-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ================= MAIN PAGE =================
const Page = () => {
  const swiperRef = useRef<SwiperCore>();
  const t = useTranslations("Centers");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;

  const { data, loading, error } = useFetch<CenterResponse>(
    `${API_URL}/website/centers/${slug}`
  );

  if (loading || !data) return <CenterSkeleton />;

  const email = data.contacts.find((c) => c.type === "EMAIL")?.value;
  const phone = data.contacts.find((c) => c.type === "PHONE")?.value;

  return (
    <div className="w-full flex justify-center items-start sm:mt-10 mt-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <div className="w-full flex_start">
          <SubHeader title={data.title} alt={false} />
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

        <div className="md:w-[720px] w-full sm:my-10 my-5 sm:h-[50px] h-[35px] grid grid-cols-3 justify-center items-center bg-lightBorder text-secondary rounded-3xl">
          <p className="bg-primary text-white rounded-3xl h-full flex_center sm:text-lg text-sm font-medium">
            {t("vision_mission")}
          </p>
          <Link
            href={`/${locale}/centers/${slug}/staff`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("staff")}
          </Link>
          <Link
            href={`/${locale}/centers/${slug}/news`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("news")}
          </Link>
        </div>

        <div className="w-full flex_start flex-col gap-10">
          {/* Vision */}
          <div className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
            <h2 className="md:text-3xl relative text-lg font-semibold ">
              <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-[6ch]"></span>
              <span className="z-10 relative">{t("vision_statement")}</span>
            </h2>
            <p className="font-medium md:text-base text-sm">{data.vision}</p>
          </div>

          {/* Mission */}
          <div className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
            <h2 className="md:text-3xl relative text-lg font-semibold ">
              <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-[7ch]"></span>
              <span className="z-10 relative">{t("mission_statement")}</span>
            </h2>
            <p className="font-medium md:text-base text-sm">{data.mission}</p>
          </div>

          {/* Contact */}
          <div className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
            <h2 className="md:text-3xl relative text-lg font-semibold ">
              <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
              <span className="z-10 relative">{t("contact")}</span>
            </h2>
            <div className="flex_center sm:flex-row flex-col gap-10 text-secondary">
              {email && (
                <a href={`mailto:${email}`} className="flex_center gap-3">
                  <IoMdMail className="text-2xl" />
                  <div className="flex_start flex-col">
                    <span className="opacity-70 text-xs">{t("email")}</span>
                    <p className="font-semibold">{email}</p>
                  </div>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex sm:justify-center justify-start items-center sm:w-auto w-full gap-3"
                >
                  <BsTelephoneFill className="text-2xl" />
                  <div className="flex_start flex-col">
                    <span className="opacity-70 text-xs">
                      {t("phone_number")}
                    </span>
                    <p className="font-semibold change_direction flex-end flex">
                      {phone}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
