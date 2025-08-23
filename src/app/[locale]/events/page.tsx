"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import EventCard from "@/components/eventCards";
import { API_URL } from "@/libs/env";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  lg: string;
}

interface GalleryItem {
  id: number;
  image: ImageFile;
}

interface EventItem {
  id: number;
  slug: string;
  title: string;
  created_at: string;
  galleries: GalleryItem[];
  schedule: {
    date_string: string;
    time_string: string;
  };
  event_category_event: {
    event_category: {
      name: string;
    };
  }[];
}

interface EventsResponse {
  total: number;
  data: EventItem[];
}

// -------- Skeletons --------
const SliderSkeleton = () => (
  <div className="w-full md:h-[470px] h-[220px] bg-gray-200 animate-pulse"></div>
);

const LatestEventsSkeleton = () => (
  <div className="max-w-[1040px] w-full text-secondary flex_start flex-col gap-8 mt-10 lg:px-0 px-3 animate-pulse">
    <div className="w-full flex_center gap-5">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <span className="w-full h-1 bg-gray-200"></span>
    </div>
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-80 w-full bg-gray-200 rounded-3xl"></div>
      ))}
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("Events");
  const params = useParams();
  const locale = params?.locale as string;
  const swiperRef = useRef<SwiperCore>();

  const [sliderEvents, setSliderEvents] = useState<EventItem[]>([]);
  const [latestEvents, setLatestEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchEvents(1);
  }, []);

  const fetchEvents = async (pageNum: number) => {
    if (pageNum > 1) setIsLoadingMore(true);
    try {
      const res = await fetch(
        `${API_URL}/website/universities/events?page=${pageNum}&limit=9`
      );
      const newData: EventsResponse = await res.json();

      if (newData.data) {
        if (pageNum === 1) {
          // The slider now shows up to the first 10 events
          setSliderEvents(newData.data.slice(0, 10));
          setLatestEvents(newData.data);
        } else {
          setLatestEvents((prev) => [...prev, ...newData.data]);
        }
        setTotal(newData.total);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="my-10 flex_center w-full flex-col gap-10">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8 lg:px-0 px-3">
        <SubHeader title={t("head")} alt={false} />
      </div>

      {isLoading ? (
        <SliderSkeleton />
      ) : (
        <div className="w-full relative">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={sliderEvents.length > 1}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {sliderEvents.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="w-full md:h-[470px] h-[220px] relative">
                  <Image
                    src={slide.galleries[0]?.image.lg || "/images/event.png"}
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
                        {slide.event_category_event[0]?.event_category.name ||
                          t("conference")}
                      </p>
                    </div>
                    <div className="border border-white px-3 py-1 rounded-3xl flex_center gap-4 mt-10">
                      <div className="flex_center gap-2 text-white">
                        <span className="bg-white bg-opacity-30 rounded-full flex_center w-7 h-7">
                          <FaCalendarAlt />
                        </span>
                        <p className="text-sm">{slide.schedule?.date_string}</p>
                      </div>
                      <div className="flex_center gap-2 text-white">
                        <span className="bg-white bg-opacity-30 rounded-full flex_center w-7 h-7">
                          <FaClock />
                        </span>
                        <p className="text-sm">{slide.schedule?.time_string}</p>
                      </div>
                    </div>
                    <h3 className="lg:text-[26px] md:text-smallTitle text-sm md:max-w-[625px] max-w-full md:px-0 px-3 text-white">
                      {slide.title}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {isLoading ? (
        <LatestEventsSkeleton />
      ) : (
        <div className="max-w-[1040px] w-full text-secondary flex_start flex-col gap-8 mt-10 lg:px-0 px-3">
          <div className="w-full flex_center gap-5">
            <h1 className="md:text-titleNormal text-base font-semibold flex-shrink-0">
              {t("late_events")}
            </h1>
            <span className="w-full h-1 bg-golden"></span>
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8">
            {latestEvents.map((event) => (
              <EventCard
                key={event.id}
                image={event.galleries[0]?.image.lg || "/images/event.png"}
                link={`/${locale}/events/${event.slug}`}
                type={
                  event.event_category_event[0]?.event_category.name || "Event"
                }
                createdAt={formatDate(event.created_at)}
                time={formatTime(event.created_at)}
                title={event.title}
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && latestEvents.length < total && (
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50"
        >
          {isLoadingMore ? t("loading") : t("see_more")}
        </button>
      )}
    </div>
  );
};

export default Page;
