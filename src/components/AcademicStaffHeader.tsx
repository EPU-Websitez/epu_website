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
import { FaFacebookF, FaGoogleScholar, FaResearchgate } from "react-icons/fa6";
import { IoMdArrowUp } from "react-icons/io";
import Link from "next/link";
interface AcademidStaffResponse {
  id: string;
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

interface ImageType {
  lg: string;
}
interface AcademicStaff {
  id: number;
  full_name: string;
  title: string;
  general_spec: string;
  specific_spec: string;
  biography: string;
  profile_image: ImageType;
  bg_image: ImageType;
}

const Skeleton = () => (
  <div className="w-full flex flex-col gap-4 animate-pulse">
    <div className="w-full h-[276px] bg-gray-300 rounded-2xl"></div>
    <div className="w-[115px] h-[115px] sm:w-[215px] sm:h-[215px] bg-gray-300 rounded-full -mt-[100px] mx-auto"></div>
    <div className="h-6 w-40 bg-gray-300 rounded mt-4 mx-auto"></div>
    <div className="h-4 w-80 bg-gray-200 rounded mx-auto"></div>
    <div className="h-40 w-full bg-gray-100 rounded mt-6"></div>
  </div>
);

const AcademicStaffHeader = () => {
  const params = useParams();
  const id = params?.id as string;

  const swiperRef = useRef<SwiperCore>();

  const { data, error, isLoading } = useSWR<AcademicStaff>(
    id ? `${API_URL}/website/teachers/${id}` : null,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60, // 1 hour
      revalidateOnFocus: false,
    }
  );
  const fullName = data?.full_name || "Kayhan Zrar Ghafoor";
  const title = data?.title || "Assistant Professor Doctor";
  const profileImage = data?.profile_image?.lg || "/images/president-alt.png";
  const bgImage = data?.bg_image?.lg || "/images/academic-bg.png";

  if (isLoading || !data) return <Skeleton />;
  if (error)
    return <div className="text-center text-red-500">Failed to load data.</div>;

  return (
    <>
      <div className="max-w-[1380px] w-full relative flex_center flex-col gap-5 sm:px-2 px-5 text-secondary">
        <div className="relative w-full h-[276px]">
          <Image
            src={bgImage}
            alt={fullName}
            fill
            priority
            className="w-full h-auto rounded-2xl object-cover"
          />
        </div>
        <div className="flex_start lg:w-[1024px] w-auto absolute lg:left-1/2 md:left-[12%] sm:left-[18%] left-[22%] -translate-x-1/2 sm:top-[150px] top-[220px]">
          <div className="sm:w-[215px] w-[115px] sm:h-[215px] h-[115px] flex_center relative rounded-full bg-white">
            <div className="flex_center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-[200px] w-[100px] sm:h-[200px] h-[100px] rounded-full">
              <Image
                src={profileImage}
                alt={fullName}
                fill
                priority
                className="w-full h-auto object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="flex_start max-w-[1024px] sm:mt-24 mt-16 w-full flex-col gap-4">
          <span className="text-sm font-medium">{title}</span>
          <h3 className="sm:text-xl text-lg font-medium">{fullName}</h3>
          <div className="flex w-full justify-between lg:items-center items-start lg:gap-2 gap-6 mt-3 lg:flex-row flex-col">
            <div className="flex sm:justify-center justify-start sm:items-center items-start gap-3 sm:flex-row flex-col">
              <div className="flex_center gap-3 sm:rounded-xl rounded-lg border-golden border text-golden sm:px-3 px-2 sm:text-base text-sm py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden text-sm"></span>
                <p className="text-sm">Vice President for Scientific</p>
              </div>
              <div className="flex_center gap-3 sm:rounded-xl rounded-lg border-golden border text-golden sm:px-3 px-2 sm:text-base text-sm py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden"></span>
                <p className="text-sm"> Postgraduate Affairs</p>
              </div>
            </div>
            <div className="flex sm:justify-center justify-start sm:items-center items-start sm:flex-row gap-3 sm:w-auto w-f sm:flex-nowrap flex-wrap">
              <Link
                href=""
                className="flex_center gap-2 sm:rounded-xl rounded-lg sm:px-3 px-1 py-1.5 border border-lightBorder text-sm"
              >
                <span>Academic Staff Portal</span>
                <IoMdArrowUp className="rotate-45" />
              </Link>
              <a
                href=""
                className="sm:rounded-xl rounded-lg sm:px-3 px-1 py-1.5 border border-lightBorder text-sm"
              >
                botan@epu.edu.iq
              </a>
              <div className="flex_start gap-3">
                <a
                  href=""
                  className="rounded-full sm:text-base text-sm flex_center sm:w-10 w-8 sm:h-10 h-8 border border-lightBorder hover:bg-lightBorder"
                >
                  <FaFacebookF />
                </a>
                <a
                  href=""
                  className="rounded-full sm:text-base text-sm flex_center sm:w-10 w-8 sm:h-10 h-8 border border-lightBorder hover:bg-lightBorder"
                >
                  <FaGoogleScholar />
                </a>
                <a
                  href=""
                  className="rounded-full sm:text-base text-sm flex_center sm:w-10 w-8 sm:h-10 h-8 border border-lightBorder hover:bg-lightBorder"
                >
                  <FaResearchgate />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcademicStaffHeader;
