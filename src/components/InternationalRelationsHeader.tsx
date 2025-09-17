"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react"; // --- CHANGE: Imported useState
import useSWR from "swr";
import { API_URL } from "@/libs/env";

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

  // --- CHANGE 1: Added a state to track if the component has mounted ---
  const [isMounted, setIsMounted] = useState(false);

  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "website-language": locale,
      },
    }).then((res) => res.json());

  const { data, error, isLoading } = useSWR<InternationalRelationsResponse>(
    `${API_URL}/website/international-relations?page=1&limit=1`,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60,
      revalidateOnFocus: false,
    }
  );
  useEffect(() => {
    // This effect runs only on the client, after the initial render
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (data) {
      // This changes the title in the browser tab
      document.title = `${data?.data[0]?.bg_title} | EPU`;
    }
  }, [data]); // This effect runs when the data is fetched

  // --- CHANGE 2: Removed the useEffect that modified document.title ---
  // It's better to handle page titles using Next.js's generateMetadata function
  // in your page.tsx or layout.tsx file to avoid client-side side effects.

  // --- CHANGE 3: Updated the loading condition to wait for mounting ---
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
