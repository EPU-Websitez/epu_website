"use client";

import CollegeHeader from "@/components/collegeHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { IoMdMail } from "react-icons/io";
import { IoBriefcaseOutline, IoLocationSharp } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CollegeMapComponent from "@/components/CollegeMapComponent ";

// Dynamic import for client-side only
const initializeMap = async (
  container: HTMLDivElement,
  lat: number,
  lng: number,
  title: string,
  address: string
) => {
  const L = (await import("leaflet")).default;

  // Fix for default markers
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  const map = L.map(container).setView([lat, lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${title}</b><br/>${address}`)
    .openPopup();

  return map;
};

// Interfaces
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
  created_at: string;
  updated_at: string;
}

interface Gallery {
  id: number;
  college_id: number;
  image_id: number;
  created_at: string;
  updated_at: string;
  image: Image;
}

interface Contact {
  id: number;
  college_id: number;
  type: string;
  value: string;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: number;
  college_id: number;
  latitude: string;
  longitude: string;
  location: string;
  created_at: string;
  updated_at: string;
}

interface CollegeData {
  id: number;
  subdomain: string;
  title: string;
  news_title: string;
  news_subtitle: string;
  college_title: string;
  college_subtitle: string;
  teacher_title: string;
  teacher_subtitle: string;
  event_title: string;
  event_subtitle: string;
  about_title: string;
  about_content: string;
  student_number: string;
  vision: string;
  mission: string;
  logo_image_id: number;
  priority: number;
  created_at: string;
  updated_at: string;
  galleries: Gallery[];
  contacts: Contact[];
  addresses: Address[];
  logo: Image;
}

// Skeleton Components
const StatsSkeleton = () => (
  <div className="flex_center flex-col gap-2 animate-pulse">
    <div className="w-[50px] h-[50px] rounded-full bg-gray-300"></div>
    <div className="h-8 bg-gray-300 rounded w-16"></div>
    <div className="h-4 bg-gray-200 rounded w-20"></div>
  </div>
);

const ContactSkeleton = () => (
  <div className="flex justify-start items-center gap-3 animate-pulse">
    <div className="w-6 h-6 bg-gray-300 rounded"></div>
    <div className="flex_start flex-col gap-2">
      <div className="h-3 bg-gray-300 rounded w-12"></div>
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
);

const AboutPageSkeleton = () => (
  <div className="w-full flex_center flex-col sm:my-10 my-5">
    <div className="max-w-[1379px] px-3 flex_start w-full">
      <div className="animate-pulse w-full h-20 bg-gray-300 rounded-lg"></div>
    </div>
    <div className="max-w-[1024px] sm:mt-14 mt-10 px-3 text-secondary flex_start flex-col gap-10 w-full">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-32 mb-4"></div>
      </div>

      {/* About Text Skeleton */}
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid sm:grid-cols-3 grid-cols-2 lg:gap-5 sm:gap-2 gap-5 justify-between w-full my-10 lg:px-10 px-3">
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
      </div>

      {/* Contact Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-32"></div>
      </div>

      {/* Map and Contact Skeleton */}
      <div className="w-full sm:h-[530px] h-[380px] relative flex justify-center items-start">
        <div className="animate-pulse w-full h-full bg-gray-300 rounded-lg"></div>
        <div className="bg-gray-400 grid sm:grid-cols-3 grid-cols-1 gap-5 rounded-3xl py-5 lg:px-8 px-5 lg:w-[85%] w-[95%] relative z-10 mt-10">
          <ContactSkeleton />
          <ContactSkeleton />
          <ContactSkeleton />
        </div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;
  const [mapData, setMapData] = useState<{
    lat: number;
    lng: number;
    title: string;
    address: string;
  } | null>(null);

  const {
    data: collegeData,
    loading,
    error,
  } = useFetch<CollegeData>(`${API_URL}/website/colleges/${college}`);

  // Set map data when college data is available
  useEffect(() => {
    if (
      collegeData?.addresses?.[0]?.latitude &&
      collegeData?.addresses?.[0]?.longitude
    ) {
      const lat = parseFloat(collegeData.addresses[0].latitude);
      const lng = parseFloat(collegeData.addresses[0].longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        setMapData({
          lat,
          lng,
          title: collegeData.title,
          address: collegeData.addresses[0].location,
        });
      }
    }
  }, [collegeData]);

  // Helper function to get contact by type
  const getContactByType = (type: string) => {
    return (
      collegeData?.contacts?.find(
        (contact) => contact.type.toLowerCase() === type.toLowerCase()
      )?.value || ""
    );
  };

  // Helper function to extract numbers from student_number string
  const extractNumber = (str: string) => {
    if (!str) return "0";
    const match = str.match(/[\d,]+/);
    return match ? match[0] : "0";
  };

  if (loading) {
    return <AboutPageSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1024px] px-3 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading College Data
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>
      <div className="max-w-[1024px] sm:mt-14 mt-10 px-3 text-secondary flex_start flex-col gap-10 w-full">
        <SubHeader title={collegeData?.about_title || t("about")} alt={false} />

        <p className="text-sm text-secondary font-medium">
          {collegeData?.about_content || t("about_text")}
        </p>

        <div className="grid sm:grid-cols-3 grid-cols-2 lg:gap-5 sm:gap-2 gap-5 justify-between w-full my-10 lg:px-10 px-3 text-secondary">
          <div className="flex_center flex-col gap-2">
            <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
              <PiStudent />
            </span>
            <h1 className="sm:text-title text-smallTitle font-semibold">
              + {extractNumber(collegeData?.student_number || "3.12K")}
            </h1>
            <p className="font-medium text-black text-opacity-60 sm:text-base text-sm">
              {t("students")}
            </p>
          </div>
          <div className="flex_center flex-col gap-2">
            <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
              <IoBriefcaseOutline />
            </span>
            <h1 className="sm:text-title text-smallTitle font-semibold">
              + 239
            </h1>
            <p className="font-medium text-black text-opacity-60 sm:text-base text-sm">
              {t("teachers")}
            </p>
          </div>
          <div className="flex_center flex-col gap-2">
            <span className="w-[50px] h-[50px] rounded-full flex_center bg-blue bg-opacity-30 text-xl">
              <HiOutlineBuildingOffice />
            </span>
            <h1 className="sm:text-title text-smallTitle font-semibold">
              + 300
            </h1>
            <p className="font-medium text-black text-opacity-60 sm:text-base text-sm">
              {t("departments")}
            </p>
          </div>
        </div>

        <SubHeader title={t("contact")} alt={false} />

        <div className="w-full sm:h-[530px] h-[380px] relative flex justify-center items-start">
          {mapData ? (
            <CollegeMapComponent
              lat={mapData.lat}
              lng={mapData.lng}
              title={mapData.title}
              address={mapData.address}
            />
          ) : (
            <Image
              src={
                collegeData?.galleries?.[0]?.image?.original ||
                "/images/map.png"
              }
              alt="College Map"
              fill
              priority
              className="w-full h-full object-cover rounded-lg"
            />
          )}
          <div className="bg-primary grid sm:grid-cols-3 absolute grid-cols-1 sm:gap-5 gap-2 sm:rounded-3xl rounded-xl sm:py-5 p-2 lg:px-8 px-5 lg:w-[85%] w-[95%] text-white z-10 sm:mt-10 mt-5">
            <div className="flex justify-start items-center gap-3">
              <IoMdMail className="sm:text-2xl text-xl" />
              <div className="flex_start flex-col">
                <span className="sm:text-sm text-xs">{t("mail")}</span>
                <p className="font-medium sm:text-base text-sm">
                  {getContactByType("EMAIL") || "info@epu.edu.iq"}
                </p>
              </div>
            </div>
            <div className="flex justify-start items-center gap-3">
              <FaPhoneAlt className="sm:text-2xl text-xl" />
              <div className="flex_start flex-col">
                <span className="sm:text-sm text-xs">{t("phone_number")}</span>
                <p className="change_direction font-medium sm:text-base text-sm">
                  {getContactByType("PHONE") || "0750 123 4567"}
                </p>
              </div>
            </div>
            <div className="flex justify-start items-center gap-3">
              <IoLocationSharp className="sm:text-2xl text-xl flex-shrink-0" />
              <div className="flex_start flex-col">
                <span className="sm:text-sm text-xs">{t("location")}</span>
                <p className="font-medium max-w-[240px] truncate sm:text-base text-sm">
                  {collegeData?.addresses?.[0]?.location ||
                    "Karkuk St, Erbil 44001"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
