"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import useSWR from "swr";
import { API_URL } from "@/libs/env"; // Assuming API_URL is in your env config

// --- Type Definitions for the API Response ---
interface ImageType {
  lg: string;
}

interface RelationItem {
  id: number;
  bg_title: string;
  bg_description: string;
  bg_image: ImageType;
}

interface InternationalRelationsResponse {
  data: RelationItem[];
}

// --- Fetcher function for useSWR ---
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// --- Skeleton Component for Loading State ---
const Skeleton = () => (
  <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] bg-gray-300 rounded-3xl animate-pulse"></div>
);

const InternationalRelationsHeader = () => {
  const t = useTranslations("International");
  const params = useParams();
  const locale = params?.locale as string;

  // --- Data Fetching with useSWR ---
  const { data, error, isLoading } = useSWR<InternationalRelationsResponse>(
    `${API_URL}/website/international-relations?page=1&limit=1`,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60, // 1 hour cache
      revalidateOnFocus: false,
    }
  );

  // --- Handle Loading and Error States ---
  if (isLoading) return <Skeleton />;
  if (error || !data?.data?.[0]) {
    return (
      <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] flex justify-center items-center bg-gray-100 rounded-3xl">
        <p className="text-red-500">Failed to load header data.</p>
      </div>
    );
  }

  // --- Extract Data and Provide Fallbacks ---
  const headerData = data.data[0];
  const bgImage = headerData?.bg_image?.lg || "/images/international-lg.png";
  const bgTitle = headerData?.bg_title || "International Relations";
  const bgDescription =
    headerData?.bg_description || t("international_strategy_text");

  return (
    <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] relative overflow-hidden rounded-3xl">
      <Image
        src={bgImage}
        alt={bgTitle}
        fill
        priority
        className="w-full h-full object-cover" // Added object-cover for better image scaling
      />
      <div className="ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-transparent absolute top-0 left-0 w-full h-full z-10"></div>
      <h3 className="absolute leading-relaxed z-20 text-white top-10 sm:ltr:left-10 ltr:left-5 sm:rtl:right-10 rtl:right-5 lg:text-[28px] text-sm max-w-[710px]">
        {bgDescription}
      </h3>
      <div className="absolute z-20 text-white bottom-14 ltr:left-10 rtl:right-10 sm:flex hidden justify-center items-center gap-5">
        <span>{t("about")}</span>
        <span className="h-[20px] w-[1px] bg-white"></span>
        <Link
          href={`/${locale}/international-relations/directory-structure?id=${headerData.id}`}
          title={t("directory_structure")}
        >
          {t("directory_structure")}
        </Link>
        <span className="h-[20px] w-[1px] bg-white"></span>
        <Link
          href={`/${locale}/international-relations/office-staff?id=${headerData.id}`}
          title={t("office_staff")}
        >
          {t("office_staff")}
        </Link>
        {/* <span className="h-[20px] w-[1px] bg-white"></span>
        <Link
          href={`/${locale}/international-relations/contact?id=${headerData.id}`}
          title={t("contact")}
        >
          {t("contact")}
        </Link> */}
      </div>
    </div>
  );
};

export default InternationalRelationsHeader;
