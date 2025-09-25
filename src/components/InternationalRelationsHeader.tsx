"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

// --- (Type Definitions and Skeleton remain the same) ---
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

const Skeleton = () => (
  <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] bg-gray-300 rounded-3xl animate-pulse"></div>
);

const InternationalRelationsHeader = () => {
  const t = useTranslations("International");
  const params = useParams();
  const locale = params?.locale as string;
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

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
      `${process.env.NEXT_PUBLIC_API_URL}/website/international-relations?page=1&limit=1`,
      locale,
    ],
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      document.title = `${data?.data[0]?.bg_title} | EPU`;
    }
  }, [data]);

  if (!isMounted || isLoading) return <Skeleton />;

  if (error || !data?.data?.[0]) {
    return (
      <div className="w-full lg:h-[400px] sm:h-[300px] h-[220px] flex justify-center items-center bg-gray-100 rounded-3xl">
        <p className="text-red-500">Failed to load header data.</p>
      </div>
    );
  }

  const headerData = data.data[0];
  const bgImage = headerData?.bg_image?.lg || "/images/international-lg.png";
  const bgTitle = headerData?.bg_title || "International Relations";
  const bgDescription =
    headerData?.bg_description || t("international_strategy_text");

  const aboutPath = `/${locale}/international-relations`;
  const directoryPath = `/${locale}/international-relations/directory-structure`;
  const newsPath = `/${locale}/international-relations/news`;
  const staffPath = `/${locale}/international-relations/office-staff`;

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
      <h3 className="absolute leading-relaxed z-20 text-white top-10 sm:ltr:left-10 ltr:left-5 sm:rtl:right-10 rtl:right-5 lg:text-[28px] text-sm max-w-[710px]">
        {bgDescription}
      </h3>
      <div className="absolute z-20 text-white bottom-10 ltr:left-10 rtl:right-10 sm:flex hidden justify-center items-center gap-5">
        <Link
          href={`${aboutPath}?id=${headerData.id}`}
          className={
            pathname === aboutPath ? "border-b-2 border-white pb-1" : ""
          }
        >
          {t("about")}
        </Link>
        <span className="h-[20px] w-[1px] bg-white"></span>
        <Link
          href={`${directoryPath}?id=${headerData.id}`}
          title={t("directory_structure")}
          className={
            pathname === directoryPath ? "border-b-2 border-white pb-1" : ""
          }
        >
          {t("directory_structure")}
        </Link>
        <span className="h-[20px] w-[1px] bg-white"></span>
        <Link
          href={`${newsPath}?id=${headerData.id}`}
          title={t("news")}
          className={
            pathname === newsPath ? "border-b-2 border-white pb-1" : ""
          }
        >
          {t("news")}
        </Link>
        <span className="h-[20px] w-[1px] bg-white"></span>
        <Link
          href={`${staffPath}?id=${headerData.id}`}
          title={t("office_staff")}
          className={
            pathname === staffPath ? "border-b-2 border-white pb-1" : ""
          }
        >
          {t("office_staff")}
        </Link>
      </div>
    </div>
  );
};

export default InternationalRelationsHeader;
