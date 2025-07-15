"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import useFetch from "@/libs/hooks/useFetch";
import { API_URL } from "@/libs/env";
import SubHeader from "@/components/subHeader";
import Image from "next/image";
import Link from "next/link";
import { CiMail } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";

// ========== Types ==========
interface ImageType {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
  created_at: string;
  updated_at: string;
}

interface Teacher {
  id: number;
  user_id: number;
  full_name: string;
  title: string;
  general_spec: string;
  specific_spec: string;
  biography: string;
  social_link: string | null;
  profile_image_id: number;
  bg_image_id: number;
  created_at: string;
  updated_at: string;
  profile_image: ImageType;
  bg_image: ImageType;
}

interface Center {
  id: number;
  slug: string;
  title: string;
  description: string;
  vision: string;
  mission: string;
  created_at: string;
  updated_at: string;
  priority: number;
}
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

interface StaffMember {
  id: number;
  center_id: number;
  teacher_id: number;
  role_in_center: string;
  created_at: string;
  updated_at: string;
  center: Center;
  teacher: Teacher;
}

interface StaffResponse {
  total: number;
  page: number;
  limit: number;
  data: StaffMember[];
}

// ========== Skeleton Loader ==========
const StaffSkeleton = () => (
  <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 w-full animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="rounded-3xl border border-lightBorder p-5 flex flex-col items-center gap-4"
      >
        <div className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] rounded-full border-[5px] border-primary bg-gray-300"></div>
        <div className="h-5 w-40 bg-gray-300 rounded"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
        <div className="w-full h-10 bg-gray-100 rounded mt-2"></div>
      </div>
    ))}
  </div>
);

// ========== Main Page ==========
const Page = () => {
  const t = useTranslations("Centers");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;

  const [centers, setCenters] = useState<StaffMember[]>([]);
  const [page, setPage] = useState(1);
  const limit = 1;

  const { data, loading } = useFetch<StaffResponse>(
    `${API_URL}/website/centers/${slug}/staff?page=${page}&limit=${limit}`
  );

  const isInitialLoading = loading && page === 1;

  // Append new data
  useEffect(() => {
    if (data?.data) {
      setCenters((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const unique = data.data.filter((d) => !ids.has(d.id));
        return [...prev, ...unique];
      });
    }
  }, [data]);

  // Reset on slug/locale change
  useEffect(() => {
    setCenters([]);
    setPage(1);
  }, [slug, locale]);
  const {
    data: centerData,
    loading: centerLoading,
    error,
  } = useFetch<CenterResponse>(`${API_URL}/website/centers/${slug}`);
  const swiperRef = useRef<SwiperCore>();

  const handleLoadMore = () => setPage((prev) => prev + 1);

  return (
    <div className="w-full flex justify-center items-start sm:my-10 my-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <div className="w-full flex_start">
          <SubHeader title={centerData?.title || slug} alt={false} />
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
            {centerData?.galleries.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative sm:mt-14 mt-6">
                  <div className="absolute lg:-top-14 top-10 ltr:left-10 right-10 sm:flex hidden flex-col max-w-[520px] z-10 p-4">
                    <h2 className="bg-primary text-white text-xl font-semibold z-10 p-5">
                      {centerData.description}
                    </h2>
                    <div className="triangle -mt-14 rotate-90"></div>
                  </div>
                  <Image
                    src={`${API_URL}/${slide.image.lg}`}
                    alt={centerData.title}
                    fill
                    priority
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="md:w-[720px] w-full sm:h-[50px] my-10 h-[35px] grid grid-cols-3 justify-center items-center bg-lightBorder text-secondary rounded-3xl">
          <Link
            href={`/${locale}/centers/${slug}/vision-and-mission`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("vision_mission")}
          </Link>
          <p className="bg-primary text-white rounded-3xl h-full flex_center sm:text-lg text-sm font-medium">
            {t("staff")}
          </p>
          <Link
            href={`/${locale}/centers/${slug}/news`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("news")}
          </Link>
        </div>

        <div className="flex_start w-full flex-col gap-10">
          <h2 className="md:text-3xl relative text-lg font-semibold">
            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
            <span className="z-10 relative">{t("staff_members")}</span>
          </h2>

          {isInitialLoading ? (
            <StaffSkeleton />
          ) : (
            <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 gap-5 text-secondary text-center">
              {centers.map((item) => {
                const email = `${item.teacher.full_name
                  .replace(/\s+/g, "")
                  .toLowerCase()}@epu.edu.iq`;

                return (
                  <div
                    key={item.id}
                    className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder"
                  >
                    <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
                      <Link
                        href={`/${locale}/academic-staff/${item.teacher.id}`}
                        title={item.teacher.full_name}
                        className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative"
                      >
                        <Image
                          src={item.teacher.profile_image.lg}
                          alt={item.teacher.full_name}
                          fill
                          className="w-full h-full rounded-full object-cover"
                        />
                      </Link>
                    </div>
                    <Link
                      href={`/${locale}/academic-staff/${item.teacher.id}`}
                      title={item.teacher.full_name}
                      className="text-lg font-semibold px-5"
                    >
                      {item.teacher.full_name}
                    </Link>
                    <span className="opacity-70 mb-3 px-5 text-sm">
                      {item.role_in_center}
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="flex_center gap-3 w-full py-5 px-5 border-t border-t-lightBorder"
                    >
                      <CiMail className="text-xl" />
                      <span className="text-sm opacity-70">{email}</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {!isInitialLoading && data && centers.length < data.total && (
            <div className="flex_center w-full my-5">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg"
              >
                {loading ? t("loading") : t("see_more")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
