"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { BiMinus } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import {
  MdKeyboardDoubleArrowRight,
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import DirectorateHeader from "@/components/DirectorateHeader";
import SubUnits from "@/components/SubUnits";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}

interface DirectorateChild {
  id: number;
  slug: string;
  directorate_type: {
    name: string;
  };
}

interface GalleryItem {
  id: number;
  image: ImageFile;
}

interface DirectorateDetail {
  id: number;
  about: string;
  directorate_type: {
    name: string;
  };
  children: DirectorateChild[];
  galleries: GalleryItem[];
}

// -------- Modal Component --------
interface GalleryModalProps {
  images: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const GalleryModal = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: GalleryModalProps) => {
  if (currentIndex < 0 || currentIndex >= images.length) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-20"
        aria-label="Close modal"
      >
        <FaTimes size={24} />
      </button>

      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 z-20"
          aria-label="Previous image"
        >
          <MdNavigateBefore size={32} />
        </button>
      )}

      <div
        className="relative w-full h-full max-w-4xl max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex].image.lg}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-contain"
        />
      </div>

      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 z-20"
          aria-label="Next image"
        >
          <MdNavigateNext size={32} />
        </button>
      )}
    </div>
  );
};

// -------- Skeleton Component --------
const ContentSkeleton = () => (
  <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5 animate-pulse">
    <div className="flex gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
      <div className="flex flex-col gap-4 flex-shrink-0 lg:w-[250px] w-full">
        <div className="h-[45px] bg-gray-200 rounded-3xl"></div>
        <div className="h-[45px] bg-gray-200 rounded-3xl"></div>
        <div className="h-[45px] bg-gray-200 rounded-3xl"></div>
        <div className="h-[45px] bg-gray-200 rounded-3xl"></div>
      </div>
      <div className="lg:border-l border-black border-opacity-30 lg:pl-10 flex flex-col gap-7 w-full">
        <div className="h-10 w-1/2 bg-gray-200 rounded-full"></div>
        <div className="p-5 flex flex-col gap-5 rounded-3xl border border-lightBorder">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="grid grid-cols-3 w-full gap-2">
            <div className="w-full md:h-[257px] h-[122px] bg-gray-200 rounded-lg"></div>
            <div className="w-full md:h-[257px] h-[122px] bg-gray-200 rounded-lg"></div>
            <div className="w-full md:h-[257px] h-[122px] bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Directorate");
  const params = useParams();
  const locale = params?.locale as string;
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parent_id"); // This can be string or null

  const [staffIsOpen, setStaffIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const swiperRef = useRef<SwiperCore>();

  const { data: directorateData, loading: isLoading } =
    useFetch<DirectorateDetail>(
      id ? `${API_URL}/website/directorates/${id}` : ""
    );

  const handleOpenStaff = () => setStaffIsOpen(!staffIsOpen);
  const handleOpenModal = (index: number) => setSelectedImageIndex(index);
  const handleCloseModal = () => setSelectedImageIndex(null);
  const handleNextImage = () => {
    if (
      directorateData &&
      selectedImageIndex !== null &&
      selectedImageIndex < directorateData.galleries.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };
  const handlePrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  return (
    <>
      <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
        <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
          <SubHeader title={t("university_directory")} alt={false} />
          <DirectorateHeader />

          {isLoading ? (
            <ContentSkeleton />
          ) : (
            directorateData && (
              <div className="flex_start w-full">
                <div className="w-full border-t-lightBorder border-t pb-20 flex_center sm:px-0 px-5">
                  <div className="flex_start gap-10 w-full mt-10 max-w-[1024px] px-2 lg:flex-row flex-col-reverse">
                    <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-[250px] w-full">
                      <div className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary">
                        <span>{t("about")}</span>
                        <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                      </div>
                      <Link
                        href={`/${locale}/directorate/${id}/staff?parent_id=${parentId}`}
                        title={t("staff")}
                        className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                      >
                        <span>{t("staff")}</span>
                        <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                      </Link>
                      <SubUnits />
                      <Link
                        href={`/${locale}/directorate/${id}/news?parent_id=${parentId}`}
                        title={t("news")}
                        className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                      >
                        <span>{t("news")}</span>
                        <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                      </Link>
                    </div>

                    <div className="lg:border-l border-l-none lg:border-b-0 border-b text-secondary border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
                      <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
                        <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                        <span className="z-10 relative">
                          {directorateData.directorate_type.name}
                        </span>
                      </h2>
                      <div className="p-5 flex_start flex-col gap-5 rounded-3xl border border-lightBorder">
                        <p className="text-opacity-70 text-secondary text-sm">
                          {directorateData.about}
                        </p>
                        {directorateData.galleries.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 w-full">
                            {directorateData.galleries
                              .slice(0, 6)
                              .map((item, index) => (
                                <button
                                  key={item.id}
                                  onClick={() => handleOpenModal(index)}
                                  className="relative w-full md:h-[180px] h-[122px] block"
                                >
                                  <Image
                                    src={item.image.lg}
                                    alt={directorateData.directorate_type.name}
                                    fill
                                    priority
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      {selectedImageIndex !== null && directorateData && (
        <GalleryModal
          images={directorateData.galleries}
          currentIndex={selectedImageIndex}
          onClose={handleCloseModal}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}
    </>
  );
};
export default Page;
