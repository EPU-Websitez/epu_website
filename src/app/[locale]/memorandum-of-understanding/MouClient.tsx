"use client";

import SubHeader from "@/components/subHeader";
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
  const t = useTranslations("MemorandumOfUnderstanding");

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
  const t = useTranslations("MemorandumOfUnderstanding");
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

  const [mous, setMous] = useState<Memorandum[]>([]);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMou, setSelectedMou] = useState<Memorandum | null>(null);
  const limit = 12;

  const {
    data: mousData,
    loading,
    error,
  } = useFetch<MouResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/memorandum-of-understanding?page=${page}&limit=${limit}`,
    locale
  );

  useEffect(() => {
    if (mousData?.data) {
      setMous((prev) =>
        page === 1 ? mousData.data : [...prev, ...mousData.data]
      );
    }
  }, [mousData, page]);

  const handleLoadMore = () => setPage((prev) => prev + 1);

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

  if (loading && page === 1) return <PageSkeleton />;
  if (error && page === 1) return <div>Error loading data...</div>;

  return (
    <>
      <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
        <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
          <div className="sm:block hidden">
            <SubHeader title={t("head")} alt={false} />
          </div>
          <div className="sm:hidden block">
            <SubHeader title={"MOUs"} alt={false} />
          </div>
          <div className="flex_center flex-col gap-10 w-full">
            <div className="flex_center w-full gap-5 mt-5">
              <span className="bg-lightBorder w-full h-[1px]"></span>
              <h3 className="text-secondary lg:text-xl sm:text-lg text-xs font-medium flex-shrink-0">
                {t("local_universities")}
              </h3>
              <span className="bg-lightBorder w-full h-[1px]"></span>
            </div>

            {mous.length > 0 ? (
              <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-8">
                {mous.map((mou, i) => (
                  <button
                    key={`${mou.id}-${i}`}
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
              <div className="text-gray-500 text-center w-full py-10">
                <div className="flex_center flex-col gap-4">
                  <div className="text-4xl">📄</div>
                  <h3 className="text-lg font-medium">{t("no_mous_found")}</h3>
                </div>
              </div>
            )}

            {mousData && mous.length < mousData.total && (
              <div className="flex_center w-full my-5">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                >
                  {loading ? t("loading") : t("see_more")}
                </button>
              </div>
            )}
          </div>
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
