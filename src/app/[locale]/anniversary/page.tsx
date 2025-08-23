"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { useRef, useState, useEffect } from "react";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  lg: string;
}
interface SliderItem {
  id: number;
  title: string;
  description: string;
  bg_image: ImageFile;
  date: string;
  date_from?: string;
  date_to?: string;
}
interface GridItem {
  id: number;
  title: string;
  description: string;
  image: ImageFile;
  date: string;
  date_from?: string;
  date_to?: string;
}
// For the main page data (slider, etc.)
interface AnniversaryData {
  id: number;
  sliders: SliderItem[];
}
// For the paginated grid items
interface ItemsResponse {
  total: number;
  data: GridItem[];
}

// -------- Modal Component --------
const DetailsModal = ({
  item,
  onClose,
}: {
  item: SliderItem | GridItem;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-secondary">
            {item.title}
          </h2>
          <div
            className="prose prose-sm max-w-none text-secondary opacity-80"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </div>
      </div>
    </div>
  );
};

// -------- Skeletons --------
const PageSkeleton = () => (
  <div className="my-10 flex_center w-full flex-col gap-10 animate-pulse">
    <div className="max-w-[1040px] w-full flex_start flex-col gap-8 lg:px-0 px-3">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="w-full md:h-[470px] h-[220px] bg-gray-200"></div>
    <div className="max-w-[1040px] w-full text-secondary flex_start flex-col gap-8 mt-10 lg:px-0 px-3">
      <div className="w-full flex items-center gap-5">
        <div className="h-8 w-56 bg-gray-200 rounded"></div>
        <div className="h-1 w-full bg-gray-200"></div>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="lg:h-[375px] h-[250px] bg-gray-200 rounded-3xl"
          ></div>
        ))}
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Anniversary");
  const locale = useParams()?.locale as string;

  const [modalItem, setModalItem] = useState<SliderItem | GridItem | null>(
    null
  );

  // State for paginated grid items
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch slider data
  const { data: anniversaryData, loading: sliderLoading } =
    useFetch<AnniversaryData>(`${API_URL}/website/anniversary`);

  // Fetch initial grid items and handle pagination
  useEffect(() => {
    fetchItems(1);
  }, []);

  const fetchItems = async (pageNum: number) => {
    if (pageNum > 1) setIsLoadingMore(true);
    try {
      // Assuming a new endpoint for paginated items
      const res = await fetch(
        `${API_URL}/website/anniversary/items?page=${pageNum}&limit=6`
      );
      const newData: ItemsResponse = await res.json();
      if (newData.data) {
        setGridItems((prev) =>
          pageNum === 1 ? newData.data : [...prev, ...newData.data]
        );
        setTotal(newData.total);
      }
    } catch (error) {
      console.error("Failed to fetch anniversary items:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(nextPage);
  };

  const handleOpenModal = (item: SliderItem | GridItem) => {
    /* ... */
  };
  const handleCloseModal = () => {
    /* ... */
  };
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
    });
  const renderDate = (item: SliderItem | GridItem) => {
    if (item.date_from && item.date_to) {
      return `${formatDate(item.date_from)} - ${formatDate(item.date_to)}`;
    }
    return formatDate(item.date);
  };

  const isLoading = sliderLoading || (gridItems.length === 0 && !isLoadingMore);

  return (
    <div className="my-10 flex_center w-full flex-col gap-10">
      {isLoading ? (
        <PageSkeleton />
      ) : (
        <>
          <div className="max-w-[1040px] w-full flex_start flex-col gap-8 lg:px-0 px-3">
            <SubHeader title={t("head")} alt={false} />
          </div>
          {anniversaryData?.sliders && (
            <div className="w-full relative">
              <Swiper
                modules={[Pagination]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                loop={anniversaryData.sliders.length > 1}
              >
                {anniversaryData.sliders.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <button
                      onClick={() => handleOpenModal(slide)}
                      className="w-full text-left"
                    >
                      <div className="w-full md:h-[470px] h-[220px] relative">
                        <Image
                          src={slide.bg_image.lg}
                          alt={slide.title}
                          fill
                          priority
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute left-0 top-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-[#1b417bc7] to-transparent w-full h-full"></div>
                        <div className="lg:top-20 md:top-10 top-5 lg:left-32 md:left-14 left-6 absolute flex_start flex-col gap-5">
                          <div className="flex_center gap-3 bg-golden text-white px-4 py-2 rounded-3xl">
                            <span className="w-3 h-3 rounded-full flex-shrink-0 bg-white"></span>
                            <p className="font-semibold md:text-base text-xs">
                              {t("conference")}
                            </p>
                          </div>
                          <h3 className="lg:text-[26px] md:text-smallTitle text-sm md:max-w-[625px] max-w-full text-white">
                            {slide.title}
                          </h3>
                          <div className="border border-white px-3 py-1 rounded-3xl flex_center gap-4 mt-2">
                            <div className="flex_center gap-2 text-white">
                              <span className="bg-white bg-opacity-30 rounded-full flex_center w-7 h-7">
                                <FaCalendarAlt />
                              </span>
                              <p className="text-sm">{renderDate(slide)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          <div className="max-w-[1040px] w-full text-secondary flex_start flex-col gap-8 mt-10 lg:px-0 px-3">
            <div className="w-full flex_center gap-5">
              <h1 className="md:text-titleNormal text-base font-semibold flex-shrink-0">
                {t("latest_anniversary")}
              </h1>
              <span className="w-full h-1 bg-golden"></span>
            </div>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-4">
              {gridItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleOpenModal(item)}
                  className="w-full relative lg:h-[375px] md:h-[340px] h-[250px] rounded-3xl overflow-hidden group"
                >
                  <Image
                    src={item.image.lg}
                    alt={item.title}
                    fill
                    priority
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="bg-white py-1 px-3 rounded-md text-secondary font-semibold absolute md:ltr:left-5 ltr:left-3 md:rtl:right-5 rtl:right-3 md:top-5 top-3 z-10 md:text-sm text-xs">
                    {renderDate(item)}
                  </span>
                  <div className="bg-gradient-to-t from-black to-transparent absolute bottom-0 left-0 w-full h-[50%] flex items-end md:p-5 p-3 z-10 justify-start">
                    <h3 className="text-white font-semibold md:text-base text-sm">
                      {item.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {gridItems.length < total && (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50"
            >
              {isLoadingMore ? t("loading") : t("see_more")}
            </button>
          )}
        </>
      )}
      {modalItem && (
        <DetailsModal item={modalItem} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Page;
