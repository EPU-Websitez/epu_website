// /components/MapSection.tsx

"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { GoArrowRight } from "react-icons/go";
import { IoArrowForwardOutline, IoBriefcaseOutline } from "react-icons/io5";
import { LuBookOpen } from "react-icons/lu";
import { MdOutlineLocationOn } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import type { Map, Marker } from "leaflet";
import { API_URL } from "@/libs/env";

// --------------------------------------------------------------------------
// 1. TYPE DEFINITION
// --------------------------------------------------------------------------
export interface College {
  id: number;
  slug: string;
  title: string;
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
// 2. INTERACTIVE MAP COMPONENT
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

  // Effect for initializing the map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!mapRef.current || mapInstance.current) return;

      const L = await import("leaflet");
      // Load CSS if not already loaded
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        // Wait for CSS to load
        await new Promise((resolve) => {
          link.onload = resolve;
          setTimeout(resolve, 1000); // Fallback timeout
        });
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const initialCenter: [number, number] = [36.1911, 44.0091];

      if (!isMounted || !mapRef.current) return;

      mapInstance.current = L.map(mapRef.current, {
        center: initialCenter,
        zoom: 12,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstance.current);
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

  // Effect for adding/updating markers when colleges data changes
  useEffect(() => {
    if (!mapInstance.current || !colleges) return;

    const L = require("leaflet");

    const defaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      shadowSize: [41, 41],
    });

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    colleges.forEach((college) => {
      if (college.address) {
        const lat = parseFloat(college.address.latitude);
        const lng = parseFloat(college.address.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng], {
            icon: defaultIcon,
          }).addTo(mapInstance.current!);

          marker.on("click", () => {
            onMarkerClick(college);
          });

          markersRef.current[college.id] = marker;
        }
      }
    });
  }, [colleges, onMarkerClick]);

  // Effect to update icons and fly to the active marker
  useEffect(() => {
    if (!mapInstance.current) return;

    const L = require("leaflet");

    const defaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      shadowSize: [41, 41],
    });

    const activeIcon = L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      shadowSize: [41, 41],
    });

    Object.values(markersRef.current).forEach((marker) =>
      marker.setIcon(defaultIcon)
    );

    if (activeCollegeId && markersRef.current[activeCollegeId]) {
      const activeMarker = markersRef.current[activeCollegeId];
      activeMarker.setIcon(activeIcon);
      mapInstance.current.flyTo(activeMarker.getLatLng(), 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [activeCollegeId]);

  return <div ref={mapRef} className={className} />;
};

// --------------------------------------------------------------------------
// 3. MAIN SECTION COMPONENT (DEFAULT EXPORT)
// --------------------------------------------------------------------------
const MapSection = () => {
  const t = useTranslations("IndexPage");
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setIsLoading(true);
        // IMPORTANT: Replace with your actual API endpoint
        const response = await fetch(`${API_URL}/website/colleges/overview`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const mappableColleges = data.data.filter(
          (c: College) => c.address && c.address.latitude && c.address.longitude
        );

        setColleges(mappableColleges);
        if (mappableColleges.length > 0) {
          setSelectedCollege(mappableColleges[0]);
        }
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleMarkerClick = (college: College) => {
    setSelectedCollege(college);
  };

  const InfoPanel = () => {
    if (isLoading) {
      return (
        <div className="flex_center w-full h-full text-secondary">
          Loading colleges...
        </div>
      );
    }

    if (!selectedCollege) {
      return (
        <div className="flex_center w-full h-full text-secondary">
          No college selected.
        </div>
      );
    }

    return (
      <>
        <Link
          href={`/colleges/${selectedCollege.slug}`}
          className="w-full flex justify-between items-center text-secondary sm:text-smallTitle text-lg font-semibold"
        >
          <h3>{selectedCollege.title}</h3>
          <GoArrowRight className="rtl:rotate-180 text-lg" />
        </Link>
        <div className="flex justify-start items-center gap-3 text-secondary sm:text-base text-sm border-b border-b-lightBorder pb-3 w-full">
          <MdOutlineLocationOn />
          <p className="text-sm">{selectedCollege.address?.location}</p>
        </div>
        <span className="text-sm text-secondary opacity-90">
          {selectedCollege.description.substring(0, 200)}
          {selectedCollege.description.length > 200 && (
            <Link
              href={`/colleges/${selectedCollege.slug}`}
              className="opacity-100 font-semibold"
            >
              .... More
            </Link>
          )}
        </span>

        <div className="flex_center sm:gap-14 gap-10 w-full mt-5">
          <div className="flex_center flex-col gap-1 text-secondary">
            <span className="sm:w-16 w-12 sm:h-16 h-12 bg-[#D5E2ED] rounded-full flex_center">
              <LuBookOpen className="text-lg" />
            </span>
            <h2 className="text-lg font-semibold">
              {selectedCollege.departments_count}
            </h2>
            <span className="text-sm">{t("departments")}</span>
          </div>
          <div className="flex_center flex-col gap-1 text-secondary">
            <span className="sm:w-16 w-12 sm:h-16 h-12 bg-[#D5E2ED] rounded-full flex_center">
              <IoBriefcaseOutline className="text-lg" />
            </span>
            <h2 className="text-lg font-semibold">
              {selectedCollege.teachers_count}
            </h2>
            <span className="text-sm">{t("teachers")}</span>
          </div>
          <div className="flex_center flex-col gap-1 text-secondary">
            <span className="sm:w-16 w-12 sm:h-16 h-12 bg-[#D5E2ED] rounded-full flex_center">
              <PiStudent className="text-lg" />
            </span>
            <h2 className="text-lg font-semibold">
              {selectedCollege.student_number}
            </h2>
            <span className=" text-sm">{t("students")}</span>
          </div>
        </div>

        {selectedCollege.latest_news && (
          <div className="flex_start w-full flex-col sm:gap-5 gap-3 mt-5">
            <div className="flex justify-between items-center w-full">
              <h2 className="sm:text-lg text-base font-medium text-secondary">
                {t("latest_news")}
              </h2>
              <Link
                href={`/colleges/${selectedCollege.slug}/news`}
                className="border-b border-b-secondary text-secondary sm:text-sm text-xs"
              >
                {t("see_all")}
              </Link>
            </div>
            <div className="w-full flex_start flex-col gap-4 group relative">
              <Link
                href={`/news/${selectedCollege.latest_news.slug}`}
                className="relative w-full h-[190px] rounded-xl overflow-hidden bg-gray-200"
              >
                <div className="text-secondary bg-white h-6 w-6 flex_center rounded-full z-10 absolute top-2 right-2">
                  <IoArrowForwardOutline />
                </div>
                {selectedCollege.latest_news.cover_image && (
                  <Image
                    src={selectedCollege.latest_news.cover_image.original}
                    alt={selectedCollege.latest_news.title}
                    fill
                    className="w-full h-auto object-cover group-hover:scale-105 duration-300"
                  />
                )}
              </Link>
              <div className="flex_center gap-1 text-secondary text-sm">
                <p>{selectedCollege.latest_news.author}</p>
                <span className="opacity-75">-</span>
                <span className="opacity-75">
                  {new Date(
                    selectedCollege.latest_news.published_at
                  ).toLocaleDateString()}
                </span>
              </div>
              <Link
                href={`/news/${selectedCollege.latest_news.slug}`}
                className="text-lg font-bold hover:text-primary text-secondary duration-300"
              >
                {selectedCollege.latest_news.title}
              </Link>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="w-full sm:h-[760px] h-auto min-h-[900px] sm:min-h-0 relative mt-10 bg-[#e9e9e9]">
      <div className="w-full sm:h-full h-[300px] relative">
        <InteractiveMap
          colleges={colleges}
          activeCollegeId={selectedCollege?.id || null}
          onMarkerClick={handleMarkerClick}
        />
      </div>
      <div className="absolute sm:top-0 top-64 sm:h-full overflow-y-auto sm:w-[450px] w-[90%] sm:left-10 left-1/2 sm:translate-x-0 -translate-x-1/2 bg-white bg-opacity-75 p-5 sm:gap-3 gap-2 flex_start h-auto flex-col pb-10 z-10">
        <InfoPanel />
      </div>
    </div>
  );
};

export default MapSection;
