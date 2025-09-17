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
import { CiSearch } from "react-icons/ci";
import { FaPlay, FaTimes } from "react-icons/fa";
import { API_URL } from "@/libs/env";
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
  images: TutorialImage[];
}
interface TutorialsResponse {
  total: number;
  data: Tutorial[];
}

// -------- Modal Component --------
const VideoModal = ({
  videoSrc,
  onClose,
}: {
  videoSrc: string;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded-lg w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl z-10"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
        <video
          src={videoSrc}
          controls
          autoPlay
          className="w-full h-auto max-h-[80vh] rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
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
  const [modalVideoSrc, setModalVideoSrc] = useState<string | null>(null);

  // --- Data Fetching ---
  const apiUrl = useMemo(() => {
    const urlParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: "6",
    });
    if (currentSearch) {
      urlParams.append("search", currentSearch);
    }
    return `${API_URL}/website/universities/tutorials?${urlParams.toString()}`;
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

  const handleOpenModal = (videoUrl: string | undefined) => {
    if (videoUrl) {
      setModalVideoSrc(videoUrl);
      document.body.style.overflowY = "hidden";
    }
  };

  const handleCloseModal = () => {
    setModalVideoSrc(null);
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
              const thumbnail = tutorial.images.find(
                (img) => img.image.media_type === "IMAGE"
              )?.image.lg;
              const video = tutorial.images.find(
                (img) => img.image.media_type === "VIDEO"
              )?.image.original;
              return (
                <div
                  key={tutorial.id}
                  className="w-full flex_start flex-col md:gap-4 gap-2 group relative"
                >
                  <div
                    className="relative w-full md:h-[330px] h-[200px] rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => handleOpenModal(video)}
                  >
                    <div className="w-32 h-7 flex_center rounded-full z-10 absolute top-2 ltr:left-2 rtl:right-2">
                      <Image
                        src="/images/logo.svg"
                        alt="University Logo"
                        fill
                        priority
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <Image
                      src={thumbnail || "/images/park.png"}
                      alt={tutorial.title}
                      fill
                      priority
                      className="w-full h-auto object-cover group-hover:scale-105 duration-300"
                    />
                    {video && (
                      <button className="flex_center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-16 w-10 sm:h-16 h-10 text-white rounded-full sm:text-xl text-lg bg-gradient-to-r from-[#DCC48C] to-[#FFA64D] z-10">
                        <FaPlay />
                      </button>
                    )}
                    <div className="absolute bottom-3 left-0 rounded-r-full bg-black bg-opacity-35 px-3 py-2 text-white sm:text-sm text-xs">
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

        {modalVideoSrc && (
          <VideoModal videoSrc={modalVideoSrc} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};
export default TutorialsClient;
