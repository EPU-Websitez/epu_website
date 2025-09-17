"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { GoArrowRight } from "react-icons/go";
import { IoArrowForwardOutline, IoBriefcaseOutline } from "react-icons/io5";
import { MdOutlineLocationOn } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import type { Map, Marker } from "leaflet";
import { API_URL } from "@/libs/env";
import { useParams } from "next/navigation";

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper/types";
import "swiper/css";
import { LuBookOpen } from "react-icons/lu";

// --------------------------------------------------------------------------
// 1. TYPE DEFINITION (Unchanged)
// --------------------------------------------------------------------------
export interface College {
  id: number;
  slug: string;
  title: string;
  subdomain: string;
  description: string;
  student_number: string;
  address: {
    id: number;
    latitude: string;
    longitude: string;
    location: string;
  } | null;
  departments_count: number;
  teachers_count: number;
  latest_news: {
    id: number;
    title: string;
    author: string;
    slug: string;
    published_at: string;
    cover_image: {
      original: string;
    } | null;
  } | null;
}

// --------------------------------------------------------------------------
// 2. INTERACTIVE MAP COMPONENT (MODIFIED for mobile view)
// --------------------------------------------------------------------------
interface InteractiveMapProps {
  colleges: College[];
  activeCollegeId: number | null;
  onMarkerClick: (college: College) => void;
  className?: string;
}

const InteractiveMap = ({
  colleges,
  activeCollegeId,
  onMarkerClick,
  className = "w-full h-full",
}: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const markersRef = useRef<{ [key: number]: Marker }>({});

  useEffect(() => {
    let isMounted = true;
    const initMap = async () => {
      if (!mapRef.current || mapInstance.current) return;
      const L = await import("leaflet");

      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
        await new Promise((resolve) => {
          link.onload = resolve;
          setTimeout(resolve, 1000); // Fallback timeout
        });
      }

      // ✅ CHANGE: Adjust map center based on screen size for better visibility
      const isMobile = window.innerWidth < 768;
      const initialCenter: [number, number] = isMobile
        ? [36.25, 44.0091] // Pushed higher for mobile
        : [36.1911, 44.0091]; // Default for desktop

      if (!isMounted || !mapRef.current) return;
      mapInstance.current = L.map(mapRef.current, {
        center: initialCenter,
        zoom: 12,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      ).addTo(mapInstance.current);
    };
    initMap();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Effect for adding/updating markers (unchanged)
  useEffect(() => {
    if (!mapInstance.current || !colleges) return;
    const L = require("leaflet");
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};
    const dotIcon = L.divIcon({
      className: "gold-dot",
      html: "",
      iconSize: [14, 14],
      iconAnchor: [7, 14],
    });
    colleges.forEach((college) => {
      if (college.address) {
        const lat = parseFloat(college.address.latitude);
        const lng = parseFloat(college.address.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng], { icon: dotIcon }).addTo(
            mapInstance.current!
          );
          marker.on("click", () => onMarkerClick(college));
          markersRef.current[college.id] = marker;
        }
      }
    });
  }, [colleges, onMarkerClick]);

  // Effect to update icons and fly to active marker (unchanged)
  useEffect(() => {
    if (!mapInstance.current) return;
    const L = require("leaflet");
    const dotIcon = L.divIcon({
      className: "gold-dot",
      html: "",
      iconSize: [14, 14],
      iconAnchor: [7, 14],
    });
    const activeDotIcon = L.divIcon({
      className: "gold-dot gold-dot--active",
      html: "",
      iconSize: [20, 20],
      iconAnchor: [10, 20],
    });
    Object.values(markersRef.current).forEach((marker) =>
      marker.setIcon(dotIcon)
    );
    if (activeCollegeId && markersRef.current[activeCollegeId]) {
      const activeMarker = markersRef.current[activeCollegeId];
      activeMarker.setIcon(activeDotIcon);
      mapInstance.current.flyTo(activeMarker.getLatLng(), 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [activeCollegeId]);

  return <div ref={mapRef} className={className} />;
};

// --------------------------------------------------------------------------
// 3. MAIN SECTION COMPONENT (DEFAULT EXPORT) - MODIFIED
// --------------------------------------------------------------------------
const MapSection = () => {
  const t = useTranslations("IndexPage");
  const params = useParams();
  const locale = params.locale as string;

  const [colleges, setColleges] = useState<College[]>([]);
  const [activeCollegeId, setActiveCollegeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ref to control the Swiper instance
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/website/colleges/overview`, {
          headers: {
            "website-language": locale || "en",
          },
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const mappableColleges = data.data.filter(
          (c: College) => c.address && c.address.latitude && c.address.longitude
        );
        setColleges(mappableColleges);
        if (mappableColleges.length > 0) {
          setActiveCollegeId(mappableColleges[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchColleges();
  }, []);

  // When a map marker is clicked, find its index and slide the Swiper to it
  const handleMarkerClick = (college: College) => {
    const collegeIndex = colleges.findIndex((c) => c.id === college.id);
    if (swiperRef.current && collegeIndex !== -1) {
      swiperRef.current.slideTo(collegeIndex);
    }
    setActiveCollegeId(college.id);
  };

  // When the slide changes, update the active college to keep the map in sync
  const handleSlideChange = (swiper: SwiperCore) => {
    const currentCollege = colleges[swiper.activeIndex];
    if (currentCollege) {
      setActiveCollegeId(currentCollege.id);
    }
  };

  return (
    <div className="relative w-full sm:h-[800px] h-[1080px] mt-10 sm:bg-[#e9e9e9] bg-white sm:overflow-y-auto overflow-y-hidden">
      {/* Map takes up the full background */}
      <div className="w-full sm:h-full h-1/2">
        <InteractiveMap
          colleges={colleges}
          activeCollegeId={activeCollegeId}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* Overlay for the content slider */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="max-w-[1042px] mx-auto w-full h-full sm:flex sm:items-start sm:justify-start flex items-start justify-center">
          {/* Slider Panel */}
          <div className="pointer-events-auto bg-white/90 sm:w-[450px] w-[90%] sm:mt-0 h-full mt-72 sm:ml-0">
            {isLoading ? (
              <div className="flex_center w-full h-full text-secondary">
                Loading colleges...
              </div>
            ) : (
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={handleSlideChange}
                spaceBetween={0}
                slidesPerView={1}
                className="w-full h-full"
              >
                {colleges.map((college) => (
                  <SwiperSlide key={college.id} className="p-5 overflow-y-auto">
                    {/* All the college info content goes here */}
                    <div className="flex flex-col gap-3 h-full">
                      <Link
                        href={`/${locale}/colleges/${college.subdomain}`}
                        className="w-full flex justify-between items-center text-secondary sm:text-smallTitle text-lg font-semibold"
                      >
                        <h3>{college.title}</h3>
                        <GoArrowRight className="rtl:rotate-180 text-lg" />
                      </Link>
                      <div className="flex justify-start items-center gap-3 text-secondary sm:text-base text-sm border-b border-b-lightBorder pb-3 w-full">
                        <MdOutlineLocationOn />
                        <p className="text-sm">{college.address?.location}</p>
                      </div>
                      <span className="text-sm text-secondary opacity-90">
                        {college?.description?.substring(0, 200)}
                        {college?.description?.length > 200 && (
                          <Link
                            href={`/${locale}/colleges/${college.subdomain}`}
                            className="opacity-100 font-semibold"
                          >
                            {" "}
                            .... {t("more")}
                          </Link>
                        )}
                      </span>

                      <div className="flex_center sm:gap-14 gap-10 w-full mt-5">
                        <div className="flex_center flex-col gap-1 text-secondary">
                          <span className="sm:w-16 w-12 sm:h-16 h-12 bg-[#D5E2ED] rounded-full flex_center">
                            <LuBookOpen className="text-lg" />
                          </span>
                          <h2 className="text-lg font-semibold">
                            {college.departments_count}
                          </h2>
                          <span className="text-sm">{t("departments")}</span>
                        </div>
                        <div className="flex_center flex-col gap-1 text-secondary">
                          <span className="sm:w-16 w-12 sm:h-16 h-12 bg-[#D5E2ED] rounded-full flex_center">
                            <IoBriefcaseOutline className="text-lg" />
                          </span>
                          <h2 className="text-lg font-semibold">
                            {college.teachers_count}
                          </h2>
                          <span className="text-sm">{t("teachers")}</span>
                        </div>
                        <div className="flex_center flex-col gap-1 text-secondary">
                          <span className="sm:w-16 w-12 sm:h-16 h-12 bg-[#D5E2ED] rounded-full flex_center">
                            <PiStudent className="text-lg" />
                          </span>
                          <h2 className="text-lg font-semibold">
                            {college.student_number}
                          </h2>
                          <span className=" text-sm">{t("students")}</span>
                        </div>
                      </div>

                      {college.latest_news && (
                        <div className="flex_start w-full flex-col sm:gap-5 gap-3 mt-5">
                          <div className="flex justify-between items-center w-full">
                            <h2 className="sm:text-lg text-base font-medium text-secondary">
                              {t("latest_news")}
                            </h2>
                            <Link
                              href={`/${locale}/colleges/${college.subdomain}/news`}
                              className="border-b border-b-secondary text-secondary sm:text-sm text-xs"
                            >
                              {t("see_all")}
                            </Link>
                          </div>
                          <div className="w-full flex_start flex-col gap-4 group relative">
                            <Link
                              href={`/${locale}/news/${college.latest_news.slug}`}
                              className="relative w-full h-[190px] rounded-xl overflow-hidden bg-gray-200"
                            >
                              <div className="text-secondary bg-white h-6 w-6 flex_center rounded-full z-10 absolute top-2 right-2">
                                <IoArrowForwardOutline />
                              </div>
                              {college.latest_news.cover_image && (
                                <Image
                                  src={college.latest_news.cover_image.original}
                                  alt={college.latest_news.title}
                                  fill
                                  className="w-full h-auto object-cover group-hover:scale-105 duration-300"
                                />
                              )}
                            </Link>
                            <div className="flex_center gap-1 text-secondary text-sm">
                              <p>{college.latest_news.author}</p>
                              <span className="opacity-75">-</span>
                              <span className="opacity-75">
                                {new Date(
                                  college.latest_news.published_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <Link
                              href={`/news/${college.latest_news.slug}`}
                              className="text-lg font-bold hover:text-primary text-secondary duration-300"
                            >
                              {college.latest_news.title}
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>

      {/* Global styles for map markers and Swiper alignment */}
      <style jsx global>{`
        .gold-dot {
          width: 20px !important;
          height: 20px !important;
          border-radius: 50%;
          background: #dcc48c; /* base golden */
          border: 3px solid #ffffff;
          transform: translate(-50%, -100%);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .gold-dot--active {
          width: 30px !important;
          height: 30px !important;
          background: #dcc48c;
          border: 3px solid #ffffff;
        }
        .swiper-slide {
          /* Ensures slides with long content start from the top */
          align-self: flex-start;
        }
      `}</style>
    </div>
  );
};

export default MapSection;
