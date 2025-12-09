"use client";

import SubHeader from "@/components/subHeader";
import NoData from "@/components/NoData";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { FaAngleLeft, FaTimes } from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import { Swiper as SwiperCore } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}
interface FeedbackItem {
  id: number;
  name: string;
  position: string;
  description?: string;
  image: ImageFile;
}
interface StoryItem {
  id: number;
  full_name: string;
  description: string;
  subject: string;
  image: ImageFile;
}
interface BgListItem {
  id: number;
  title: string;
  description: string;
}
interface AlumniResponse {
  id: number;
  feedback_title: string;
  feedback_description: string;
  stories_title: string;
  stories_description: string;
  bg_image: ImageFile;
  bg_title: string;
  bg_description: string;
  feedbacks: FeedbackItem[];
  stories: StoryItem[];
  bg_lists: BgListItem[];
}

// -------- Modals --------
interface StoryModalProps {
  story: StoryItem;
  onClose: () => void;
}

const StoryModal = ({ story, onClose }: StoryModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-lg w-11/12 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>
        <div className="w-full h-64 relative">
          <Image
            src={story.image.lg}
            alt={story.full_name}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-2 text-secondary">
            {story.full_name}
          </h2>
          {story.subject && (
            <span className="text-sm bg-backgroundSecondary rounded-full px-2 py-1.5 font-semibold text-lightText">
              {story.subject}
            </span>
          )}
          <p className="text-secondary opacity-80 pt-3">{story.description}</p>
        </div>
      </div>
    </div>
  );
};

interface BgListModalProps {
  list: BgListItem[];
  onClose: () => void;
  title: string;
}

const BgListModal = ({ list, onClose, title }: BgListModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-11/12 p-6 overflow-y-auto max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-5 text-secondary">{title}</h2>
        <div className="flex flex-col gap-5">
          {list.map((item, index) => (
            <div
              key={item.id}
              className="flex_start gap-5 w-full border-b pb-4 last:border-none"
            >
              <div className="w-10 h-10 rounded-full flex_center bg-primary text-white flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex_start flex-col gap-1">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm opacity-80">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// -------- Skeletons --------
const FeedbackSkeleton = () => (
  <div className="md:w-full w-[95%] flex flex-col md:flex-row items-center gap-5 mt-10 relative md:p-0 p-5 animate-pulse">
    <div className="lg:w-[45%] md:w-[50%] w-full h-[250px] bg-gray-200 rounded-3xl"></div>
    <div className="lg:w-[65%] w-[55%] md:flex hidden h-[300px] bg-gray-200 rounded-3xl"></div>
  </div>
);
const StoriesHeaderSkeleton = () => (
  <div className="w-full flex flex-col items-center gap-3 mt-10 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);
const StoryCardSkeleton = () => (
  <div className="border rounded-3xl flex flex-col w-full h-[450px] bg-gray-200 animate-pulse"></div>
);
const BannerSkeleton = () => (
  <div className="mt-10 w-full relative h-[575px] bg-gray-200 animate-pulse"></div>
);

// -------- Main Component --------
const AlumniClient = () => {
  const swiperRef = useRef<SwiperCore>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [showBgListModal, setShowBgListModal] = useState(false);
  const [bgImageError, setBgImageError] = useState(false);
  const t = useTranslations("Students");
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const {
    data: alumniData,
    loading: isLoading,
    error: hasError,
  } = useFetch<AlumniResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/alumni-students/main`,
    locale
  );

  if (hasError) {
    return (
      <div className="my-10 flex_center w-full">
        <div className="max-w-[1024px] w-full flex_center">
          <NoData showButton={true} className="my-10" />
        </div>
      </div>
    );
  }

  if (!isLoading && !alumniData) {
    return (
      <div className="my-10 flex_center w-full">
        <div className="max-w-[1024px] w-full flex_center">
          <NoData showButton={false} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col items-center sm:my-10 my-5">
        <div className="max-w-[1024px] md:px-3 px-5 text-secondary w-full flex_start">
          <SubHeader title={t("alumni")} alt={false} />
        </div>

        {/* Feedback Section */}
        {isLoading ? (
          <FeedbackSkeleton />
        ) : (
          <div className="md:w-full change_direction w-[95%] flex justify-between md:bg-transparent bg-backgroundSecondary flex-col md:flex-row items-center gap-5 mt-10 relative md:p-0 p-5 md:rounded-none rounded-3xl">
            <div className="md:hidden text-secondary text-center flex justify-center items-center flex-col gap-5 px-5">
              <h5 className="text-sm font-semibold">{t("feedback")}</h5>
              <h1 className="text-titleNormal font-semibold">
                {alumniData?.feedback_title}
              </h1>
              <span className="text-base">
                {alumniData?.feedback_description}
              </span>
            </div>
            <div className="lg:w-[45%] md:w-[50%] w-full flex-shrink-0 z-10 md:-mr-16 mr-0">
              <Swiper
                spaceBetween={20}
                breakpoints={{
                  340: { slidesPerView: 1.1 },
                  768: { slidesPerView: 1.5 },
                }}
                className="swiper_dir"
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                  setActiveIndex(swiper.realIndex);
                }}
              >
                {alumniData?.feedbacks.map((slide, index) => (
                  <SwiperSlide key={slide.id}>
                    <div
                      className={`rounded-3xl flex md:justify-end justify-start lg:gap-10 gap-5 md:items-end items-start lg:p-10 p-5 flex-col transition-all duration-300 ${
                        index === activeIndex
                          ? "bg-primary text-white"
                          : "bg-blue bg-opacity-30 text-secondary"
                      }`}
                    >
                      <div className="relative w-[50px] h-[50px]">
                        <Image
                          src={"/images/quote.svg"}
                          alt="Quote Icon"
                          fill
                          priority
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="flex_center md:flex-row flex-row-reverse gap-5">
                        <div className="flex md:justify-end justify-start md:items-end items-start flex-col gap-1">
                          <h5 className="font-semibold">{slide.name}</h5>
                          <small className="text-xs">{slide.position}</small>
                        </div>
                        <div className="relative w-[60px] h-[60px]">
                          <Image
                            src={slide.image.lg}
                            alt={slide.name}
                            fill
                            priority
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = "/images/placeholder.svg";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="md:hidden flex gap-4">
              <button
                className="bg-background flex_center rounded-full w-[30px] h-[30px] text-black border border-lightBorder"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <FaAngleLeft />
              </button>
              <button
                className="bg-background flex_center rounded-full w-[30px] h-[30px] text-black border border-lightBorder"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <FaAngleLeft className="rotate-180" />
              </button>
            </div>
            <div className="lg:w-[65%] w-[55%] md:flex hidden bg-backgroundSecondary text-secondary lg:py-10 p-5 justify-center items-center rounded-3xl sm:-ml-10">
              <div className="flex_start flex-col gap-7 lg:px-6 px-10">
                <h5 className="text-sm font-semibold">{t("feedback")}</h5>
                <h1 className="max-w-[350px] lg:text-title text-titleNormal font-semibold">
                  {alumniData?.feedback_title}
                </h1>
                <span className="max-w-[460px] lg:text-lg text-base">
                  {alumniData?.feedback_description}
                </span>
                <div className="flex_center gap-4">
                  <button
                    className="bg-background flex_center rounded-full w-[30px] h-[30px] text-black border border-lightBorder"
                    onClick={() => swiperRef.current?.slideNext()}
                  >
                    <FaAngleLeft />
                  </button>
                  <button
                    className="bg-background flex_center rounded-full w-[30px] h-[30px] text-black border border-lightBorder"
                    onClick={() => swiperRef.current?.slidePrev()}
                  >
                    <FaAngleLeft className="rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stories Section */}
        <div className="max-w-[1024px] text-secondary px-3 w-full flex_center flex-col gap-5 mt-10">
          {isLoading ? (
            <StoriesHeaderSkeleton />
          ) : (
            <>
              <h1 className="text-[30px] font-semibold">
                {alumniData?.stories_title}
              </h1>
              <p className="text-sm max-w-[660px] text-center">
                {alumniData?.stories_description}
              </p>
            </>
          )}
          <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-10 mt-5">
            {isLoading ? (
              <>
                <StoryCardSkeleton /> <StoryCardSkeleton />
              </>
            ) : (
              alumniData?.stories.map((story, index) => (
                <div
                  key={story.id}
                  className="border rounded-3xl flex_start flex-col w-full"
                >
                  <h3 className="text-title font-semibold w-full py-5 px-3 text-end">
                    0{index + 1}
                  </h3>
                  <div className="w-full h-[207px] relative">
                    <Image
                      src={story.image.lg}
                      alt={story.full_name}
                      fill
                      priority
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.svg";
                      }}
                    />
                  </div>
                  <h3 className="text-smallTitle font-semibold px-3 mt-5 mb-3">
                    {story.full_name}
                  </h3>
                  <span className="opacity-70 text-sm px-3 mb-5 line-clamp-3">
                    {story.description}
                  </span>
                  <button
                    onClick={() => setSelectedStory(story)}
                    className="px-3 py-4 text-golden border-t border-t-lightBorder w-full flex justify-between text-sm items-center font-semibold"
                  >
                    <span>{t("read_more")}</span>
                    <GoArrowRight className="text-xl rtl:rotate-180" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Background Section */}
        {isLoading ? (
          <BannerSkeleton />
        ) : (
          <div className="mt-10 w-full relative h-[575px] flex_center">
            <Image
              src={
                bgImageError
                  ? "/images/placeholder.svg"
                  : alumniData?.bg_image?.lg || "/images/alumni-bg.png"
              }
              alt={alumniData?.bg_title || "Alumni"}
              fill
              priority
              className="w-full h-full object-cover"
              onError={() => setBgImageError(true)}
            />
            <div className="opacity-40 bg-primary absolute left-0 top-0 w-full h-full z-10"></div>
            <div className="w-[1024px] text-white text-opacity-90 px-3 flex_start flex-col gap-5 z-20">
              <h1 className="md:text-4xl text-2xl font-semibold z-20">
                {alumniData?.bg_title}
              </h1>
              <p className="md:text-base text-sm">
                {alumniData?.bg_description}
              </p>

              {alumniData?.bg_lists.slice(0, 2).map((item, index) => (
                <div
                  key={item.id}
                  className="flex_start gap-5 w-full max-w-[600px] md:mt-10 mt-5"
                >
                  <div className="w-10 h-10 rounded-full flex_center bg-white flex-shrink-0">
                    <span className="w-[95%] h-[90%] flex_center border-primary border flex_center rounded-full text-black">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex_start flex-col gap-2">
                    <h2 className="md:text-smallTitle text-lg font-semibold">
                      {item.title}
                    </h2>
                    <span className="opacity-90 md:text-base text-sm">
                      {item.description}
                    </span>
                  </div>
                </div>
              ))}

              {alumniData?.bg_lists && alumniData?.bg_lists.length > 3 && (
                <button
                  onClick={() => setShowBgListModal(true)}
                  className="mt-5 bg-white text-primary font-semibold px-4 py-2 rounded-md"
                >
                  {t("show_more")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}

      {showBgListModal && (
        <BgListModal
          list={alumniData?.bg_lists || []}
          onClose={() => setShowBgListModal(false)}
          title={t("all_items")}
        />
      )}
    </>
  );
};

export default AlumniClient;
