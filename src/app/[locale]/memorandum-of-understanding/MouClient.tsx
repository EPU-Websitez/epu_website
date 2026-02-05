"use client";

import SubHeader from "@/components/subHeader";
import NoData from "@/components/NoData";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import useFetch from "@/libs/hooks/useFetch";
import { FiLink } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface Memorandum {
  id: number;
  slug: string;
  title: string;
  description: string;
  link: string;
  logo_image: ImageFile;
  type: string;
}

interface MouResponse {
  total: number;
  page: number;
  limit: number;
  data: Memorandum[];
}

// -------- Modal Component --------
const MouModal = ({
  isOpen,
  onClose,
  mou,
}: {
  isOpen: boolean;
  onClose: () => void;
  mou: Memorandum | null;
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mou) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full flex sm:flex-row flex-col items-center gap-6 sm:gap-8 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <IoMdClose size={24} />
        </button>
        <div className="relative sm:w-[300px] w-full h-[250px] sm:h-[300px] flex-shrink-0 mt-5">
          <Image
            src={
              mou.logo_image?.lg ||
              mou.logo_image?.md ||
              "/images/placeholder.png"
            }
            alt={mou.title}
            fill
            className="object-cover sm:rounded-3xl rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>
        <div className="flex flex-col gap-4 text-center sm:text-left">
          <a
            href={mou.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl sm:text-xl font-bold text-secondary hover:text-primary transition-colors flex items-center justify-center sm:justify-start gap-2"
          >
            {mou.title}
            <FiLink className="opacity-70" />
          </a>
          <p className="text-sm sm:text-base text-gray-600">
            {mou.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// -------- Skeleton Components --------
const MouCardSkeleton = () => (
  <div className="relative w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden flex justify-center items-start pt-3 animate-pulse">
    <div className="sm:w-[240px] w-[129px] sm:h-[230px] h-[135px] bg-gray-300 rounded-lg"></div>
    <div className="absolute bottom-0 left-0 w-full sm:h-[52px] h-[40px] bg-gray-300"></div>
  </div>
);

const PageSkeleton = () => {
  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <div className="sm:block hidden w-full">
          <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
        </div>
        <div className="sm:hidden block w-full">
          <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
        </div>
        <div className="flex_center flex-col gap-10 w-full">
          <div className="flex_center w-full gap-5 mt-5">
            <span className="bg-lightBorder w-full h-[1px]"></span>
            <div className="h-6 bg-gray-300 w-40 rounded flex-shrink-0"></div>
            <span className="bg-lightBorder w-full h-[1px]"></span>
          </div>
          <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <MouCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------- Main Page Component --------
const MouClient = () => {
  const t = useTranslations("MemorandumOfUnderstanding");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const limit = 12;

  // --- State: International ---
  const [intlMous, setIntlMous] = useState<Memorandum[]>([]);
  const [intlPage, setIntlPage] = useState(1);
  const [intlTotal, setIntlTotal] = useState(0);

  // --- State: Local ---
  const [localMous, setLocalMous] = useState<Memorandum[]>([]);
  const [localPage, setLocalPage] = useState(1);
  const [localTotal, setLocalTotal] = useState(0);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMou, setSelectedMou] = useState<Memorandum | null>(null);

  // --- API Request: International ---
  const {
    data: intlData,
    loading: intlLoading,
    error: intlError,
  } = useFetch<MouResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/memorandum-of-understanding?page=${intlPage}&limit=${limit}&type=INTERNATIONAL_UNIVERSITIES_AND_INSTITUTES`,
    locale,
  );

  // --- API Request: Local ---
  const {
    data: localData,
    loading: localLoading,
    error: localError,
  } = useFetch<MouResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/memorandum-of-understanding?page=${localPage}&limit=${limit}&type=LOCAL_UNIVERSITIES_AND_INSTITUTES`,
    locale,
  );

  // --- Effect: Handle International Data ---
  useEffect(() => {
    if (intlData?.data) {
      setIntlMous((prev) => {
        if (intlPage === 1) return intlData.data;
        // Filter out duplicates
        const newItems = intlData.data.filter(
          (item) => !prev.some((p) => p.id === item.id),
        );
        return [...prev, ...newItems];
      });
      setIntlTotal(intlData.total);
    }
  }, [intlData, intlPage]);

  // --- Effect: Handle Local Data ---
  useEffect(() => {
    if (localData?.data) {
      setLocalMous((prev) => {
        if (localPage === 1) return localData.data;
        // Filter out duplicates
        const newItems = localData.data.filter(
          (item) => !prev.some((p) => p.id === item.id),
        );
        return [...prev, ...newItems];
      });
      setLocalTotal(localData.total);
    }
  }, [localData, localPage]);

  // --- Handlers ---
  const handleLoadMoreIntl = () => setIntlPage((prev) => prev + 1);
  const handleLoadMoreLocal = () => setLocalPage((prev) => prev + 1);

  const handleOpenModal = (mou: Memorandum) => {
    setSelectedMou(mou);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const getMouImage = (mou: Memorandum) =>
    mou.logo_image?.lg ||
    mou.logo_image?.md ||
    mou.logo_image?.original ||
    `/images/placeholder.png`;

  // --- Helpers ---
  // Reusable function to render a MOU grid section
  const renderSection = (
    title: string,
    data: Memorandum[],
    loading: boolean,
    total: number,
    onLoadMore: () => void,
  ) => {
    return (
      <div className="flex_center flex-col gap-10 w-full mb-12">
        <div className="flex_center w-full gap-5 mt-5">
          <span className="bg-lightBorder w-full h-[1px]"></span>
          <h3 className="text-secondary lg:text-xl sm:text-lg text-xs font-medium flex-shrink-0 uppercase">
            {title}
          </h3>
          <span className="bg-lightBorder w-full h-[1px]"></span>
        </div>

        {data.length > 0 ? (
          <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-8">
            {data.map((mou, i) => (
              <button
                key={`${mou.id}-${i}-${mou.type}`}
                onClick={() => handleOpenModal(mou)}
                className="relative block w-full border-lightBorder border sm:h-[270px] h-[210px] rounded-3xl overflow-hidden group text-left"
              >
                <div className="w-full h-full flex justify-center items-start pt-3">
                  <div className="w-[90%] sm:h-[76%] h-[78%] relative">
                    <Image
                      src={getMouImage(mou)}
                      alt={mou.title}
                      fill
                      priority={i < 6}
                      className="w-full h-full sm:object-contain object-cover rounded-md transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.svg";
                      }}
                    />
                  </div>
                </div>
                <div className="bg-primary absolute bottom-0 px-2 left-0 w-full sm:py-4 py-3 flex_center gap-2 sm:text-base text-xs font-semibold text-white transition-colors group-hover:bg-secondary">
                  {mou.title}
                </div>
              </button>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-gray-500 text-center w-full py-10">
              <div className="flex_center flex-col gap-4">
                <div className="text-4xl">📄</div>
                <h3 className="text-lg font-medium">{t("no_mous_found")}</h3>
              </div>
            </div>
          )
        )}

        {/* Loading Skeletons for pagination loading */}
        {loading && data.length > 0 && (
          <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <MouCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        {data.length < total && (
          <div className="flex_center w-full my-5">
            <button
              onClick={onLoadMore}
              disabled={loading}
              className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? t("loading") : t("see_more")}
            </button>
          </div>
        )}
      </div>
    );
  };

  // If initial load of both is happening
  if (intlLoading && intlPage === 1 && localLoading && localPage === 1) {
    return <PageSkeleton />;
  }

  // If both failed
  if (intlError && localError) {
    return (
      <div className="my-10 flex_center w-full">
        <div className="max-w-[1045px] w-full flex_center">
          <NoData showButton={true} className="my-10" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
        <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
          {/* Main Title */}
          <div className="sm:block hidden">
            <SubHeader title={t("head")} alt={false} />
          </div>
          <div className="sm:hidden block">
            <SubHeader title={"MOUs"} alt={false} />
          </div>

          {/* 1. International Section */}
          {intlLoading && intlPage === 1 ? (
            // Simple skeleton for section if this specific part is loading
            <div className="w-full animate-pulse h-64 bg-gray-100 rounded-xl"></div>
          ) : (
            renderSection(
              t("international_universities") || "International Universities", // Fallback if key missing
              intlMous,
              intlLoading,
              intlTotal,
              handleLoadMoreIntl,
            )
          )}

          {/* 2. Local Section */}
          {localLoading && localPage === 1 ? (
            <div className="w-full animate-pulse h-64 bg-gray-100 rounded-xl"></div>
          ) : (
            renderSection(
              t("local_universities") || "Local Universities",
              localMous,
              localLoading,
              localTotal,
              handleLoadMoreLocal,
            )
          )}
        </div>
      </div>

      <MouModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mou={selectedMou}
      />
    </>
  );
};

export default MouClient;
