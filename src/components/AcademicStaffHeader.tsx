"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

// Third-party libraries
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

// Icons
import {
  FaFacebookF,
  FaGoogleScholar,
  FaResearchgate,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";
import { IoMdArrowUp } from "react-icons/io";

// Local imports
import { API_URL } from "@/libs/env";

// --- TYPE DEFINITIONS ---
// Defines the structure for image objects from the API
interface ImageType {
  lg: string;
}

// Defines the structure for the user object
interface User {
  email: string | null;
}

// Defines the structure for a social network
interface SocialNetwork {
  title: string;
}

// Defines a single social link item
interface SocialLink {
  id: number;
  link: string;
  social_network: SocialNetwork;
}

// Defines a professional title item
interface TitleListItem {
  id: number;
  title: string;
  link: string | null;
}

// Defines the main structure for the Academic Staff API response
interface AcademicStaff {
  id: number;
  full_name: string;
  title: string;
  profile_image: ImageType;
  bg_image: ImageType;
  user: User;
  social_links: SocialLink[];
  title_lists: TitleListItem[];
}

// Fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// --- SKELETON LOADER COMPONENT ---
// Displays a placeholder UI while data is being fetched
const Skeleton = () => (
  <div className="w-full flex flex-col gap-4 animate-pulse">
    <div className="w-full h-[276px] bg-gray-300 rounded-2xl"></div>
    <div className="w-[115px] h-[115px] sm:w-[215px] sm:h-[215px] bg-gray-300 rounded-full -mt-[100px] mx-auto border-4 border-white"></div>
    <div className="h-6 w-48 bg-gray-300 rounded mt-4 mx-auto"></div>
    <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
    <div className="mt-6 flex flex-col lg:flex-row justify-between items-center gap-4">
      <div className="flex gap-3">
        <div className="h-9 w-40 bg-gray-200 rounded-lg"></div>
        <div className="h-9 w-40 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="flex gap-3 items-center">
        <div className="h-9 w-32 bg-gray-200 rounded-lg"></div>
        <div className="h-9 w-40 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const AcademicStaffHeader = () => {
  const params = useParams();
  const id = params?.id as string;

  // Fetch data using SWR
  const { data, error, isLoading } = useSWR<AcademicStaff>(
    id ? `${API_URL}/website/teachers/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false, // Avoid re-fetching on window focus
    }
  );

  // A map to dynamically render social media icons based on the API response
  const socialIconMap: { [key: string]: React.ReactElement } = {
    Facebook: <FaFacebookF />,
    "Google Scholar": <FaGoogleScholar />,
    ResearchGate: <FaResearchgate />,
    LinkedIn: <FaLinkedin />,
    Twitter: <FaTwitter />,
  };

  // Handle loading and error states
  if (isLoading) return <Skeleton />;
  if (error || !data) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load staff data. Please try again later.
      </div>
    );
  }

  // Destructure data with fallback values
  const {
    full_name,
    title,
    profile_image,
    bg_image,
    user,
    social_links = [],
    title_lists = [],
  } = data;

  const profileImage = profile_image?.lg || "/images/president-alt.png";
  const bgImage = bg_image?.lg || "/images/academic-bg.png";
  const email = user?.email;

  return (
    <div className="max-w-[1380px] w-full relative flex_center flex-col gap-5 sm:px-2 px-5 text-secondary">
      {/* Background Image */}
      <div className="relative w-full h-[276px]">
        <Image
          src={bgImage}
          alt={`${full_name}'s background`}
          fill
          priority
          className="w-full h-auto rounded-2xl object-cover"
        />
      </div>

      {/* Profile Image */}
      <div className="flex_start lg:w-[1024px] w-auto absolute lg:left-1/2 md:left-[12%] sm:left-[18%] left-[22%] -translate-x-1/2 sm:top-[150px] top-[220px]">
        <div className="sm:w-[215px] w-[115px] sm:h-[215px] h-[115px] flex_center relative rounded-full bg-white shadow-md">
          <div className="flex_center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-[200px] w-[100px] sm:h-[200px] h-[100px] rounded-full overflow-hidden">
            <Image
              src={profileImage}
              alt={full_name}
              fill
              priority
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex_start max-w-[1024px] sm:mt-24 mt-16 w-full flex-col gap-4">
        <span className="text-sm font-medium">{title}</span>
        <h3 className="sm:text-xl text-lg font-medium">{full_name}</h3>

        <div className="flex w-full justify-between lg:items-center items-start lg:gap-2 gap-6 mt-3 lg:flex-row flex-col">
          {/* Professional Titles (Dynamic) */}
          <div className="flex sm:justify-center justify-start sm:items-center items-start gap-3 sm:flex-row flex-col flex-wrap">
            {title_lists.map((item) => (
              <div
                key={item.id}
                className="flex_center gap-3 sm:rounded-xl rounded-lg border-golden border text-golden sm:px-3 px-2 sm:text-base text-sm py-1.5"
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden"></span>
                <p className="text-sm">{item.title}</p>
              </div>
            ))}
          </div>

          {/* Contact and Social Links (Dynamic) */}
          <div className="flex sm:justify-center justify-start sm:items-center items-start sm:flex-row gap-3 sm:w-auto w-full flex-wrap">
            <Link
              href="#" // This link can be made dynamic if provided by the API in the future
              className="flex_center gap-2 sm:rounded-xl rounded-lg sm:px-3 px-1 py-1.5 border border-lightBorder text-sm"
            >
              <span>Academic Staff Portal</span>
              <IoMdArrowUp className="rotate-45" />
            </Link>
            {email && (
              <a
                href={`mailto:${email}`}
                className="sm:rounded-xl rounded-lg sm:px-3 px-1 py-1.5 border border-lightBorder text-sm"
              >
                {email}
              </a>
            )}
            <div className="flex_start gap-3">
              {social_links.map((social) => {
                const icon = socialIconMap[social.social_network.title];
                return icon ? (
                  <a
                    key={social.id}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${full_name}'s ${social.social_network.title} profile`}
                    className="rounded-full sm:text-base text-sm flex_center sm:w-10 w-8 sm:h-10 h-8 border border-lightBorder hover:bg-lightBorder transition-colors"
                  >
                    {icon}
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicStaffHeader;
