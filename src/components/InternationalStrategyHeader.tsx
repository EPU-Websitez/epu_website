"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import useSWR from "swr";

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

// --- Skeleton Component for Loading State ---
const Skeleton = () => (
  <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] bg-gray-300 rounded-3xl animate-pulse"></div>
);

const InternationalStrategyHeader = () => {
  const t = useTranslations("International");
  const params = useParams();
  const locale = params?.locale as string;
  const router = useRouter();
  const searchParams = useSearchParams();

  // UPDATED: The fetcher now accepts an array from the SWR key.
  const fetcher = ([url, lang]: [string, string]) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "website-language": lang,
      },
    }).then((res) => res.json());

  // UPDATED: The SWR key is now an array including the URL and the locale.
  const { data, error, isLoading } = useSWR<InternationalRelationsResponse>(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/website/international-strategies?page=1&limit=1`,
      locale,
    ],
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60, // 1 hour cache
      revalidateOnFocus: false,
    }
  );

  const headerData = data?.data?.[0];

  useEffect(() => {
    if (data) {
      document.title = `${headerData?.bg_title} | EPU`;
    }
  }, [data, headerData]);

  useEffect(() => {
    if (headerData) {
      const id = headerData.id;
      const currentId = searchParams.get("id");
      const pathname = window.location.pathname;

      if (currentId !== id.toString()) {
        router.replace(`${pathname}?id=${id}`);
      }
    }
  }, [headerData, router, searchParams]);

  if (isLoading) return <Skeleton />;
  if (error || !headerData) {
    return (
      <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] flex justify-center items-center bg-gray-100 rounded-3xl">
        <p className="text-red-500">Failed to load header data.</p>
      </div>
    );
  }

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
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder.svg";
        }}
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
