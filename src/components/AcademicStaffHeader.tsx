"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

// Icons
import {
  FaFacebookF,
  FaGoogleScholar,
  FaResearchgate,
  FaLinkedin,
  FaTwitter,
  FaPlus,
  FaXmark,
} from "react-icons/fa6";

// --- TYPE DEFINITIONS ---
interface ImageType {
  lg: string;
  original: string;
}

interface User {
  email: string | null;
}

interface SocialNetwork {
  title: string;
}

interface SocialLink {
  id: number;
  link: string;
  social_network: SocialNetwork;
}

interface TitleListItem {
  id: number;
  title: string;
  link: string | null;
}

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

// --- SKELETON LOADER COMPONENT ---
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
  const locale = params?.locale as string;

  // UPDATED: The fetcher now accepts an array from the SWR key.
  const fetcher = ([url, lang]: [string, string]) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "website-language": lang, // Use the language from the key
      },
    }).then((res) => res.json());

  // UPDATED: The SWR key is now an array including the URL and the locale.
  const { data, error, isLoading } = useSWR<AcademicStaff>(
    id
      ? [`${process.env.NEXT_PUBLIC_API_URL}/website/teachers/${id}`, locale]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (data) {
      document.title = `${data.full_name} | EPU Academic Staff`;
    }
  }, [data]);

  const socialIconMap: { [key: string]: React.ReactElement } = {
    Facebook: <FaFacebookF />,
    "Google Scholar": <FaGoogleScholar />,
    ResearchGate: <FaResearchgate />,
    LinkedIn: <FaLinkedin />,
    Twitter: <FaTwitter />,
  };

  const [showTitlesModal, setShowTitlesModal] = useState(false);

  useEffect(() => {
    if (showTitlesModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTitlesModal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowTitlesModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (isLoading) return <Skeleton />;
  if (error || !data) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load staff data. Please try again later.
      </div>
    );
  }

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

  const MAX_INLINE = 2;
  const inlineTitles = title_lists.slice(0, MAX_INLINE);
  const hiddenCount = Math.max(0, title_lists.length - MAX_INLINE);
  const hasMore = hiddenCount > 0;

  return (
    <>
      <div className="max-w-[1380px] w-full relative flex_center flex-col gap-5 sm:px-2 px-5 text-secondary">
        <div className="relative w-full h-[276px]">
          <Image
            src={bgImage}
            alt={`${full_name}'s background`}
            fill
            priority
            className="w-full h-auto rounded-2xl object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>

        <div className="flex_start lg:w-[1024px] w-auto absolute lg:left-1/2 md:left-[12%] sm:left-[18%] left-[22%] -translate-x-1/2 sm:top-[150px] top-[220px]">
          <div className="sm:w-[215px] w-[115px] sm:h-[215px] h-[115px] flex_center relative rounded-full bg-white shadow-md">
            <div className="flex_center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-[200px] w-[100px] sm:h-[200px] h-[100px] rounded-full overflow-hidden">
              <Image
                src={profileImage}
                alt={full_name}
                fill
                priority
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.svg";
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex_start max-w-[1024px] sm:mt-24 mt-16 w-full flex-col gap-4">
          <span className="text-sm font-medium">{title}</span>
          <h3 className="sm:text-xl text-lg font-medium">{full_name}</h3>

          <div className="flex w-full justify-between lg:items-center items-start lg:gap-2 gap-6 mt-3 lg:flex-row flex-col">
            <div className="flex lg:justify-center justify-start sm:items-center items-start gap-2 flex-wrap lg:w-auto w-full">
              {inlineTitles.map((item) => (
                <div
                  key={item.id}
                  className="flex_center gap-3 sm:rounded-xl rounded-lg border-golden border text-golden sm:px-3 px-2 sm:text-base text-sm py-1.5"
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden"></span>
                  <p className="text-sm max-w-[12ch] truncate">{item.title}</p>
                </div>
              ))}

              {hasMore && (
                <button
                  type="button"
                  onClick={() => setShowTitlesModal(true)}
                  className="flex_center gap-2 sm:rounded-xl rounded-lg border border-golden text-golden sm:px-3 px-2 sm:text-base text-sm py-1.5 hover:bg-lightBorder/40 transition-colors"
                  aria-haspopup="dialog"
                  aria-expanded={showTitlesModal}
                >
                  <FaPlus aria-hidden="true" />
                  <span>{hiddenCount}</span>
                </button>
              )}
            </div>

            <div className="flex sm:justify-center justify-start sm:items-center items-start sm:flex-row gap-3 sm:w-auto w-full flex-wrap">
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

      {showTitlesModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titles-modal-title"
          onClick={(e) => {
            if (e.currentTarget === e.target) setShowTitlesModal(false);
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative bg-white text-secondary w-[92vw] max-w-[600px] max-h-[80vh] rounded-2xl shadow-xl p-5 overflow-hidden">
            <div className="flex items-center justify-end mb-3">
              <button
                type="button"
                onClick={() => setShowTitlesModal(false)}
                className="p-2 rounded-lg border border-lightBorder hover:bg-lightBorder/40 justify-end"
                aria-label="Close modal"
              >
                <FaXmark />
              </button>
            </div>

            <div className="overflow-auto pr-1" style={{ maxHeight: "60vh" }}>
              <ul className="space-y-2">
                {title_lists.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 p-2 border-b border-lightBorder"
                  >
                    <span className="mt-1 w-2 h-2 rounded-full bg-golden flex-shrink-0" />
                    <div className="min-w-0">
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <span>{item.title}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AcademicStaffHeader;
