"use client";

import { useState, useEffect, useMemo } from "react";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { CiSearch, CiUser } from "react-icons/ci";
import { FaPlay, FaTimes } from "react-icons/fa";

import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------
interface ImageInfo {
  lg: string;
  original: string;
  media_type: "IMAGE" | "VIDEO";
  thumbnail?: string | null;
}

interface TutorialImage {
  id: number;
  image: ImageInfo;
}

interface Tutorial {
  id: number;
  title: string;
  description: string;
  trainer_full_name?: string; // Added field
  images: TutorialImage[];
}

interface TutorialsResponse {
  total: number;
  data: Tutorial[];
}

// -------- Modal Component (Redesigned) --------
const VideoModal = ({
  tutorial,
  onClose,
}: {
  tutorial: Tutorial;
  onClose: () => void;
}) => {
  // Extract video URL safely
  const videoSrc = tutorial.images.find(
    (img) => img.image.media_type === "VIDEO"
  )?.image.original;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20 transition-all"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        {/* Video Section */}
        <div className="w-full bg-black aspect-video relative flex-shrink-0">
          {videoSrc ? (
            <video
              src={videoSrc}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              Video source not found
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-4">
            {/* Header: Title & Trainer */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {tutorial.title}
              </h2>

              {tutorial.trainer_full_name && (
                <div className="flex items-center gap-2 text-primary font-medium">
                  <div className="p-1.5 bg-primary/10 rounded-full">
                    <CiUser className="text-lg" />
                  </div>
                  <span className="text-sm md:text-base">
                    {tutorial.trainer_full_name}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-gray-600 leading-relaxed text-sm md:text-base">
              <p>{tutorial.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------- Skeleton Component --------
const PageSkeleton = () => (
  <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-5 mt-10 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="w-full flex flex-col gap-4">
        <div className="w-full md:h-[330px] h-[200px] bg-gray-200 rounded-xl"></div>
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

const TutorialsClient = () => {
  const t = useTranslations("Tutorials");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- State derived from URL ---
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSearch = searchParams.get("search") || "";

  // --- Local UI State ---
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  // Changed from storing string ID/URL to storing the whole object
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null
  );

  // --- Data Fetching ---
  const apiUrl = useMemo(() => {
    const urlParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: "6",
    });
    if (currentSearch) {
      urlParams.append("search", currentSearch);
    }
    return `${
      process.env.NEXT_PUBLIC_API_URL
    }/website/universities/tutorials?${urlParams.toString()}`;
  }, [currentPage, currentSearch]);

  const { data, loading: isLoadingData } = useFetch<TutorialsResponse>(
    apiUrl,
    locale
  );

  // --- Effect to update tutorials list from fetched data ---
  useEffect(() => {
    if (data?.data) {
      setTutorials((prev) =>
        currentPage === 1 ? data.data : [...prev, ...data.data]
      );
    }
  }, [data, currentPage]);

  const total = data?.total || 0;
  const isLoading = isLoadingData && currentPage === 1;
  const isLoadingMore = isLoadingData && currentPage > 1;

  // --- Handlers to update URL ---
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", (currentPage + 1).toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Updated to accept the full Tutorial object
  const handleOpenModal = (tutorial: Tutorial) => {
    // Only open if there is actually a video
    const hasVideo = tutorial.images.some(
      (img) => img.image.media_type === "VIDEO"
    );

    if (hasVideo) {
      setSelectedTutorial(tutorial);
      document.body.style.overflowY = "hidden";
    }
  };

  const handleCloseModal = () => {
    setSelectedTutorial(null);
    document.body.style.overflowY = "auto";
  };

  return (
    <div className="sm:my-10 my-8 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col sm:gap-10 gap-8">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full flex_center sm:gap-10 gap-3">
          <div className="relative w-full sm:h-14 h-10">
            <span className="pointer-events-none text-black opacity-50 absolute ltr:left-5 rtl:right-5 top-1/2 -translate-y-1/2 z-10 text-xl">
              <CiSearch />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-full w-full bg-backgroundSecondary border border-lightBorder px-12 sm:rounded-3xl rounded-xl focus:border-primary outline-none text-sm"
              placeholder={t("search")}
            />
          </div>
          <button
            onClick={handleSearch}
            className="sm:px-8 px-4 flex-shrink-0 sm:h-14 h-10 sm:rounded-3xl rounded-xl bg-gradient-to-r from-blue to-primary text-white"
          >
            {t("search_button")}
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : tutorials.length > 0 ? (
          <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-5 mt-10">
            {tutorials.map((tutorial) => {
              const videoWithThumbnail = tutorial.images.find(
                (img) => img.image.media_type === "VIDEO" && img.image.thumbnail
              );
              const imageThumbnail = tutorial.images.find(
                (img) => img.image.media_type === "IMAGE"
              )?.image.lg;
              const thumbnail =
                videoWithThumbnail?.image.thumbnail || imageThumbnail;

              const hasVideo = tutorial.images.some(
                (img) => img.image.media_type === "VIDEO"
              );

              return (
                <div
                  key={tutorial.id}
                  className="w-full flex_start flex-col md:gap-4 gap-2 group relative"
                >
                  <div
                    className="relative w-full md:h-[330px] h-[200px] rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => handleOpenModal(tutorial)}
                  >
                    <div className="w-32 h-7 flex_center rounded-full z-10 absolute top-2 ltr:left-2 rtl:right-2">
                      <Image
                        src="/images/logo.svg"
                        alt="University Logo"
                        fill
                        priority
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.svg";
                        }}
                      />
                    </div>
                    <Image
                      src={thumbnail || "/images/park.png"}
                      alt={tutorial.title}
                      fill
                      priority
                      className="w-full h-auto object-cover group-hover:scale-105 duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.svg";
                      }}
                    />
                    {hasVideo && (
                      <button className="flex_center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-16 w-10 sm:h-16 h-10 text-white rounded-full sm:text-xl text-lg bg-gradient-to-r from-[#DCC48C] to-[#FFA64D] z-10 hover:scale-110 transition-transform">
                        <FaPlay />
                      </button>
                    )}
                    <div className="absolute bottom-3 left-0 rounded-r-full bg-black bg-opacity-35 px-3 py-2 text-white sm:text-sm text-xs backdrop-blur-sm">
                      {t("watch")}
                    </div>
                  </div>
                  <h3 className="md:text-lg text-base font-bold text-secondary">
                    {tutorial.title}
                  </h3>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full text-center py-10">
            <p className="text-gray-500 text-lg">{t("no_data_found")}</p>
            <button
              onClick={handleClearSearch}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              {t("clear")}
            </button>
          </div>
        )}

        {!isLoading && tutorials.length < total && (
          <div className="w-full flex_center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50"
            >
              {isLoadingMore ? t("loading") : t("see_more")}
            </button>
          </div>
        )}

        {selectedTutorial && (
          <VideoModal tutorial={selectedTutorial} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};
export default TutorialsClient;
