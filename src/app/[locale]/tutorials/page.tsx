"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlay, FaTimes } from "react-icons/fa";
import { API_URL } from "@/libs/env";

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

const Page = () => {
  const t = useTranslations("Tutorials");

  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVideoSrc, setModalVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    // Reset and fetch when search query changes
    setTutorials([]);
    setPage(1);
    setIsLoading(true);
    fetchTutorials(1, searchQuery);
  }, [searchQuery]);

  const fetchTutorials = async (pageNum: number, search: string) => {
    if (pageNum > 1) setIsLoadingMore(true);

    try {
      const res = await fetch(
        `${API_URL}/website/universities/tutorials?page=${pageNum}&limit=6&search=${search}`
      );
      const newData: TutorialsResponse = await res.json();

      if (newData.data) {
        setTutorials((prev) =>
          pageNum === 1 ? newData.data : [...prev, ...newData.data]
        );
        setTotal(newData.total);
      }
    } catch (error) {
      console.error("Failed to fetch tutorials:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleSearch = () => setSearchQuery(searchTerm);
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTutorials(nextPage, searchQuery);
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
        ) : (
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
export default Page;
