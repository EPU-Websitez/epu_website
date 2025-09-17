"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation"; // Import hooks
import React, { useEffect } from "react"; // Import useEffect
import useSWR from "swr";
import { API_URL } from "@/libs/env";

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

// --- Skeleton Component for Loading State ---
const Skeleton = () => (
  <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] bg-gray-300 rounded-3xl animate-pulse"></div>
);

const InternationalStrategyHeader = () => {
  const t = useTranslations("International");
  const params = useParams();
  const locale = params?.locale as string;

  // --- 1. Initialize router and searchParams hooks ---
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "website-language": locale, // Adds the language header
      },
    }).then((res) => res.json());
  // --- Data Fetching with useSWR ---
  const { data, error, isLoading } = useSWR<InternationalRelationsResponse>(
    `${API_URL}/website/international-strategies?page=1&limit=1`,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60, // 1 hour cache
      revalidateOnFocus: false,
    }
  );

  const headerData = data?.data?.[0];
  console.log(headerData);
  useEffect(() => {
    if (data) {
      // This changes the title in the browser tab
      document.title = `${headerData?.bg_title} | EPU`;
    }
  }, [data]); // This effect runs when the data is fetched

  // --- 2. Use an effect to update the URL when data is available ---
  useEffect(() => {
    if (headerData) {
      const id = headerData.id;
      const currentId = searchParams.get("id");
      const pathname = window.location.pathname;

      // Only update the URL if the 'id' param is not already set to the correct value
      if (currentId !== id.toString()) {
        // Use router.replace to update the URL without adding to browser history
        router.replace(`${pathname}?id=${id}`);
      }
    }
  }, [headerData, router, searchParams]); // Effect dependencies

  // --- Handle Loading and Error States ---
  if (isLoading) return <Skeleton />;
  if (error || !headerData) {
    return (
      <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] flex justify-center items-center bg-gray-100 rounded-3xl">
        <p className="text-red-500">Failed to load header data.</p>
      </div>
    );
  }

  // --- Extract Data and Provide Fallbacks ---
  const bgImage = headerData.bg_image?.lg || "/images/international-lg.png";
  const bgTitle = headerData.bg_title || "International Relations";
  const bgDescription =
    headerData.bg_description || t("international_strategy_text");

  return (
    <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] relative overflow-hidden rounded-3xl">
      <Image
        src={bgImage}
        alt={bgTitle}
        fill
        priority
        className="w-full h-full object-cover"
      />
      <div className="ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-transparent absolute top-0 left-0 w-full h-full z-10"></div>
      {bgDescription && (
        <h3 className="absolute leading-relaxed z-20 text-white top-10 sm:ltr:left-10 ltr:left-3 sm:rtl:right-10 rtl:right-3 lg:text-[28px] text-sm max-w-[710px]">
          {bgDescription.substring(0, 300)}...
        </h3>
      )}
    </div>
  );
};

export default InternationalStrategyHeader;
