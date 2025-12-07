"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
// Removed unused imports (BiMinus, GoPlus)
import {
  MdKeyboardDoubleArrowRight,
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";
import { FaTimes } from "react-icons/fa";

import useFetch from "@/libs/hooks/useFetch";
// Removed unused Swiper imports if they aren't being used in the rest of the file
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

interface DirectorateType {
  id: number;
  type_key: string;
  name: string;
  description: string;
  priority: number;
  created_at: string;
  updated_at: string;
}

interface DirectorateDetail {
  id: number;
  slug: string;
  directorate_type_id: number;
  parent_id: number | null;
  title: string;
  college_id: number | null;
  university_id: number;
  about: string; // This now contains HTML
  vision: string; // This now contains HTML
  mission: string; // This now contains HTML
  priority: number;
  created_at: string;
  updated_at: string;
  directorate_type: DirectorateType;
  parent: any | null; // You can define a Parent interface if needed
  children: DirectorateChild[];
  galleries: GalleryItem[];
  leads_count: number;
  staff_count: number;
  news_count: number;
  children_count: number;
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
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder.svg";
          }}
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
  const parentId = searchParams.get("parent_id");

  const [staffIsOpen, setStaffIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const { data: directorateData, loading: isLoading } =
    useFetch<DirectorateDetail>(
      `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}`,
      locale
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
          <SubHeader
            title={directorateData?.title || t("university_directory")}
            alt={false}
          />
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
                        href={`/${locale}/directorate/${id}/centers?parent_id=${parentId}`}
                        title={t("centers")}
                        className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                      >
                        <span>{t("centers")}</span>
                        <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                      </Link>
                      <Link
                        href={`/${locale}/directorate/${id}/news?parent_id=${parentId}`}
                        title={t("news")}
                        className="lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder"
                      >
                        <span>{t("news")}</span>
                        <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
                      </Link>
                    </div>

                    <div className="lg:border-l w-full border-l-none lg:border-b-0 border-b text-secondary border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7">
                      <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
                        <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                        <span className="z-10 relative">{t("about")}</span>
                      </h2>
                      <div className="p-5 flex_start flex-col gap-5 rounded-3xl border border-lightBorder w-full">
                        {/* --- FIXED SECTION STARTS HERE --- */}
                        {/* Changed from <p> to <div> and added dangerouslySetInnerHTML */}
                        <div
                          className="text-opacity-70 text-secondary text-sm prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: directorateData.about,
                          }}
                        />
                        {/* --- FIXED SECTION ENDS HERE --- */}

                        {directorateData.galleries.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                            {directorateData.galleries.map((item, index) => (
                              <button
                                key={item.id}
                                onClick={() => handleOpenModal(index)}
                                className="group relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                              >
                                <Image
                                  src={item.image.lg}
                                  alt={directorateData.directorate_type.name}
                                  fill
                                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                />

                                {/* Optional: Dark Overlay on Hover for better UX */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {directorateData.mission && (
                        <>
                          <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
                            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                            <span className="z-10 relative">
                              {t("mission")}
                            </span>
                          </h2>
                          <div className="p-5 flex_start flex-col gap-5 rounded-3xl border border-lightBorder w-full">
                            {/* --- FIXED SECTION STARTS HERE --- */}
                            {/* Changed from <p> to <div> and added dangerouslySetInnerHTML */}
                            <div
                              className="text-opacity-70 text-secondary text-sm prose max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: directorateData.mission,
                              }}
                            />
                          </div>
                        </>
                      )}
                      {directorateData.vision && (
                        <>
                          <h2 className="relative sm:text-titleNormal text-lg font-semibold ">
                            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                            <span className="z-10 relative">{t("vision")}</span>
                          </h2>
                          <div className="p-5 flex_start flex-col gap-5 rounded-3xl border border-lightBorder w-full">
                            {/* --- FIXED SECTION STARTS HERE --- */}
                            {/* Changed from <p> to <div> and added dangerouslySetInnerHTML */}
                            <div
                              className="text-opacity-70 text-secondary text-sm prose max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: directorateData.vision,
                              }}
                            />
                          </div>
                        </>
                      )}
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
