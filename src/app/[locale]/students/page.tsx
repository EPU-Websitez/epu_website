"use client";

import SubHeader from "@/components/subHeader";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { LiaSwimmerSolid } from "react-icons/lia";
import { LuLibraryBig } from "react-icons/lu";
import { TbOlympics } from "react-icons/tb";
import CollegeMapComponent from "@/components/CollegeMapComponent ";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";

// -------- Interfaces --------

interface ImageFile {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface CampusLife {
  id: number;
  slug: string;
  title: string;
  description: string;
  stadiums: number;
  pools: number;
  libraries: number;
  background_image: ImageFile;
}

interface CampusLifeResponse {
  total: number;
  page: number;
  limit: number;
  data: CampusLife[];
}

interface Section {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  images: ImageFile[];
}

interface SectionsResponse {
  total: number;
  page: number;
  limit: number;
  data: Section[];
}

interface AddressResponse {
  id: number;
  latitude: string;
  longitude: string;
  location: string;
  campus_life: {
    title: string;
  };
}

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: ImageFile;
}

interface GalleriesResponse {
  total: number;
  page: number;
  limit: number;
  data: GalleryItem[];
}

// -------- Granular Skeleton Components --------

const HeaderSkeleton = () => (
  <div className="w-full lg:h-[373px] h-[290px] bg-gray-200 rounded-3xl animate-pulse"></div>
);

const SectionSkeleton = () => (
  <div className="w-full flex md:flex-row flex-col lg:gap-10 gap-6 my-10">
    <div className="flex-1 space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="md:w-1/2 w-full lg:h-[460px] sm:h-[400px] h-[340px] bg-gray-200 rounded-3xl animate-pulse"></div>
  </div>
);

const GallerySkeleton = () => (
  <div className="w-full relative md:h-[550px] h-[500px] sm:my-10 my-5 bg-gray-200 animate-pulse"></div>
);

const MapSkeleton = () => (
  <div className="w-full sm:h-[760px] h-auto flex justify-center items-start my-10 bg-gray-200 animate-pulse"></div>
);

const Page = () => {
  const t = useTranslations("Students");
  const params = useParams();
  const locale = params?.locale as string;
  const [campusLifeSlug, setCampusLifeSlug] = useState<string | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const swiperRef = useRef<SwiperCore>();

  // 1. Fetch main campus life data
  const {
    data: campusData,
    loading: campusLoading,
    error: campusError,
  } = useFetch<CampusLifeResponse>(
    `${API_URL}/website/campus-life?page=1&limit=1`
  );

  // Set the slug once the main data is fetched
  useEffect(() => {
    if (campusData?.data?.[0]?.slug) {
      setCampusLifeSlug(campusData.data[0].slug);
    }
  }, [campusData]);

  // 2. Fetch Sections data using the slug
  const {
    data: sectionsData,
    loading: sectionsLoading,
    error: sectionsError,
  } = useFetch<SectionsResponse>(
    campusLifeSlug
      ? `${API_URL}/website/campus-life/${campusLifeSlug}/sections?page=1&limit=20`
      : ""
  );

  // 3. Fetch Address data using the slug
  const {
    data: addressData,
    loading: addressLoading,
    error: addressError,
  } = useFetch<AddressResponse>(
    campusLifeSlug
      ? `${API_URL}/website/campus-life/${campusLifeSlug}/address`
      : ""
  );

  // 4. Fetch Galleries data using the slug
  const {
    data: galleriesData,
    loading: galleriesLoading,
    error: galleriesError,
  } = useFetch<GalleriesResponse>(
    campusLifeSlug
      ? `${API_URL}/website/campus-life/${campusLifeSlug}/galleries?page=1&limit=20`
      : ""
  );

  const isLoading =
    campusLoading || sectionsLoading || addressLoading || galleriesLoading;
  const hasError =
    campusError || sectionsError || addressError || galleriesError;
  const mainCampus = campusData?.data?.[0];
  const sections = sectionsData?.data || [];
  const galleries = galleriesData?.data || [];

  // Effect for cycling through gallery text
  useEffect(() => {
    if (galleries.length > 0) {
      const timer = setInterval(() => {
        setCurrentGalleryIndex(
          (prevIndex) => (prevIndex + 1) % galleries.length
        );
      }, 5000); // Change text every 5 seconds

      return () => clearInterval(timer); // Cleanup on component unmount
    }
  }, [galleries]);

  if (hasError) {
    return (
      <div className="w-full flex_center my-20">
        <p className="text-red-500">{t("error_loading_data")}</p>
      </div>
    );
  }

  if (!isLoading && !mainCampus) {
    return (
      <div className="w-full flex_center my-20">
        <p>{t("no_data_found")}</p>
      </div>
    );
  }

  // Grid classes for gallery items
  const gridLayoutClasses = [
    "col-span-2 row-span-2", // Large square for the 1st image
    "col-span-1 row-span-1", // Small square for the 2nd
    "col-span-1 row-span-1", // Small square for the 3rd
    "col-span-1 row-span-1", // Small square for the 4th
    "col-span-1 row-span-1", // Small square for the 5th
  ];

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-5 w-full">
        <SubHeader title={t("head")} alt={false} />

        {/* Header Section */}
        {isLoading && !mainCampus ? (
          <HeaderSkeleton />
        ) : (
          mainCampus && (
            <div className="w-full lg:h-[373px] h-[290px] relative sm:mt-10 mt-5 rounded-3xl overflow-hidden">
              <Swiper
                modules={[Pagination]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                loop={true}
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
                className="h-full"
              >
                {galleries.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={slide.image.lg || "/images/campus.png"}
                      alt={slide.title || mainCampus.title || "Campus"}
                      fill
                      priority
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute left-0 top-0 w-full bg-secondary text-white bg-opacity-70 h-full sm:p-10 p-7 flex_start flex-col sm:gap-20 gap-5">
                      <h2 className="lg:text-smallTitle sm:text-lg text-sm font-semibold">
                        {slide.title || mainCampus.title}
                      </h2>

                      <div className="flex_start gap-5 w-full flex-wrap">
                        <div className="flex_center gap-3">
                          <span className="w-[35px] h-[35px] flex_center rounded-md bg-white text-secondary text-lg">
                            <TbOlympics />
                          </span>

                          <div className="flex_start flex-col">
                            <span className="opacity-75 text-xs">
                              {t("stadiums")}
                            </span>

                            <p className="text-sm">
                              + {mainCampus.stadiums} {t("stadiums")}
                            </p>
                          </div>
                        </div>

                        <div className="flex_center gap-3">
                          <span className="w-[35px] h-[35px] flex_center rounded-md bg-white text-secondary text-lg">
                            <LiaSwimmerSolid />
                          </span>

                          <div className="flex_start flex-col">
                            <span className="opacity-75 text-xs">
                              {t("pools")}
                            </span>

                            <p className="text-sm">
                              + {mainCampus.pools} {t("pools")}
                            </p>
                          </div>
                        </div>

                        <div className="flex_center gap-3">
                          <span className="w-[35px] h-[35px] flex_center rounded-md bg-white text-secondary text-lg">
                            <LuLibraryBig />
                          </span>

                          <div className="flex_start flex-col">
                            <span className="opacity-75 text-xs">
                              {t("libraries")}
                            </span>
                            <p className="text-sm">
                              + {mainCampus.libraries} {t("libraries")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )
        )}

        {/* Dynamic Sections */}
        {isLoading && sections.length === 0 ? (
          <>
            {" "}
            <SectionSkeleton /> <SectionSkeleton />{" "}
          </>
        ) : (
          sections.map((section, index) => (
            <div
              key={section.id}
              className={`w-full flex md:justify-between items-center justify-center md:flex-row flex-col lg:gap-10 gap-6 my-10 text-secondary ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              } flex-col-reverse`}
            >
              <div className="flex_start flex-col gap-3">
                {section.subtitle && (
                  <span className="text-xs relative">{section.subtitle}</span>
                )}
                <h1 className="lg:text-titleNormal text-xl font-semibold relative">
                  {section.title}
                </h1>
                <p className="text-sm max-w-[440px] opacity-70">
                  {section.description}
                </p>
              </div>
              {section.images?.[0] && (
                <div className="md:w-1/2 w-full lg:h-[460px] sm:h-[400px] h-[340px] relative mt-10 rounded-3xl overflow-hidden flex-shrink-0">
                  <Image
                    src={section.images[0].lg}
                    alt={section.title}
                    fill
                    priority
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))
        )}

        {/* Dynamic Gallery Section */}
        {isLoading && galleries.length === 0 ? (
          <GallerySkeleton />
        ) : (
          galleries.length > 0 && (
            <div className="w-full relative md:h-[550px] h-[500px] sm:my-10 my-5 text-white overflow-hidden">
              {/* Image Grid Background */}
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {galleries.slice(0, 5).map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative ${
                      gridLayoutClasses[index % gridLayoutClasses.length]
                    }`}
                  >
                    <Image
                      src={item.image.lg}
                      alt={item.title}
                      fill
                      priority
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Overlay */}
              <div className="absolute left-0 top-0 w-full h-full bg-black bg-opacity-50 z-10"></div>

              {/* Animated Text */}
              <div className="flex_start flex-col gap-5 z-20 absolute ltr:sm:left-10 ltr:left-5 rtl:sm:right-10 rtl:right-5 md:top-[30%] top-5">
                <h1 className="font-semibold md:text-titleNormal text-xl transition-opacity duration-500">
                  {galleries[currentGalleryIndex]?.title ||
                    t("campus_life_through_the_lens")}
                </h1>
                <span className="md:text-lg text-sm max-w-[380px] transition-opacity duration-500">
                  {galleries[currentGalleryIndex]?.description ||
                    t("campus_life_through_the_lens_text")}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* Map Section */}
      {isLoading && !addressData ? (
        <MapSkeleton />
      ) : (
        <div className="w-full sm:h-[760px] h-auto relative flex justify-center items-start my-10 bg-[#fff]">
          <div className="w-full h-full absolute top-0 left-0">
            {addressData ? (
              <CollegeMapComponent
                lat={parseFloat(addressData.latitude)}
                lng={parseFloat(addressData.longitude)}
                title={addressData.campus_life.title}
                address={addressData.location}
              />
            ) : (
              <Image
                src={"/images/map.png"}
                alt="Map"
                fill
                priority
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {/* <div className="flex_start z-10 w-[1024px] h-full text-secondary overflow-y-auto">
            <div className="flex_start flex-col sm:gap-3 gap-2 bg-white p-5  bg-opacity-75 max-w-[405px] h-full">
              <h5>{t("campuses")}</h5>
              <h1 className="text-xl font-semibold border-b border-b-lightBorder pb-5">
                {t("campuses_text")}
              </h1>
              <div className="grid grid-cols-2 gap-5 w-full mt-5">
                <div className="w-full h-[240px] relative">
                  <Image
                    src="/images/about-stage-2.png"
                    alt="campus gallery"
                    fill
                    priority
                  />
                </div>
                <div className="w-full h-[240px] relative">
                  <Image
                    src="/images/about-stage-2.png"
                    alt="campus gallery"
                    fill
                    priority
                  />
                </div>
                <div className="w-full h-[240px] relative">
                  <Image
                    src="/images/about-stage-2.png"
                    alt="campus gallery"
                    fill
                    priority
                  />
                </div>
                <div className="w-full h-[240px] relative">
                  <Image
                    src="/images/about-stage-2.png"
                    alt="campus gallery"
                    fill
                    priority
                  />
                </div>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};
export default Page;
