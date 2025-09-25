"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import useSWR from "swr";

// --- Import necessary icons ---
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { ReactNode, useEffect } from "react";

// --- Updated Interfaces to match the API response ---
interface Contact {
  id: number;
  department_id: number;
  type: "EMAIL" | "PHONE" | string; // Use union types for better type safety
  value: string;
}

interface Address {
  id: number;
  latitude: string;
  longitude: string;
  location: string;
  department_id: number;
}

interface Response {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  contacts: Contact[];
  address: Address; // Changed from addresses array to a single object
  galleries: any[]; // Kept as any for brevity, can be typed fully if needed
}

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

const DepartmentHeader = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const slug = params?.slug as string;
  const locale = params?.locale as string;

  // UPDATED: The fetcher now accepts an array from the SWR key.
  const fetcher = ([url, lang]: [string, string]) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "website-language": lang,
      },
    }).then((res) => res.json());

  // UPDATED: The SWR key is now an array including the URL and the locale.
  const { data, error, isLoading } = useSWR<Response>(
    slug
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/website/departments/${slug}`,
          locale,
        ]
      : null,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60, // 1 hour
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      document.title = `${data.title} | Department`;
    }
  }, [data]);

  const getContactIcon = (type: string): ReactNode => {
    switch (type.toUpperCase()) {
      case "EMAIL":
        return <IoMdMail className="text-2xl" />;
      case "PHONE":
        return <FaPhoneAlt className="text-xl" />;
      default:
        return <IoMdMail className="text-2xl" />;
    }
  };

  if (isLoading) return <CenterSkeleton />;
  if (error || !data)
    return <div className="text-center text-red-500">Failed to load data.</div>;

  return (
    <div className="flex justify-center items-center py-10 md:gap-10 md:h-[405px] h-auto min-h-[335px] overflow-hidden relative w-full">
      <Image
        src="/images/bg.svg"
        alt="title"
        fill
        priority
        className="w-full h-auto object-cover"
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder.svg";
        }}
      />
      <div className="z-20 flex_start flex-col max-w-[1040px] w-full md:gap-8 gap-4 text-white px-3">
        <div className="flex_center gap-2 group relative">
          <span className="w-14 h-[2px] rounded-md bg-golden"></span>
          <h2 className="sm:text-[52px] leading-normal text-smallTitle font-semibold">
            {data.title}
          </h2>
        </div>
        <p className="md:text-sm text-xs">{data.subtitle}</p>

        <div className="flex_start gap-5 sm:flex-row flex-col">
          {data.contacts?.map((contact) => (
            <div
              key={contact.id}
              className="flex justify-start items-center gap-3"
            >
              {getContactIcon(contact.type)}
              <div className="flex_start flex-col">
                <span className="text-xs opacity-50 capitalize">
                  {t(contact.type.toLowerCase())}
                </span>
                <p className="text-sm">{contact.value}</p>
              </div>
            </div>
          ))}

          {data.address?.location && (
            <div className="flex justify-start items-center gap-3">
              <IoLocationSharp className="text-2xl" />
              <div className="flex_start flex-col">
                <span className="text-xs opacity-50">{t("location")}</span>
                <p className="text-sm">
                  {data.address.location || "Karkuk St, Erbil 44001"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentHeader;
