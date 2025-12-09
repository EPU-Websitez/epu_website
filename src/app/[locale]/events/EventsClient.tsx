"use client";

import SubHeader from "@/components/subHeader";
import NoData from "@/components/NoData";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useRef, useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FaXmark } from "react-icons/fa6";
import EventCard from "@/components/eventCards";

import useFetch from "@/libs/hooks/useFetch";

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

const EventsClient = () => {
  const t = useTranslations("Events");
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const swiperRef = useRef<SwiperCore>();

  const locale = (params?.locale as string) || "en";

  // --- State from URL ---
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSearch = searchParams.get("search") || "";

  // --- Local UI State ---
  const [sliderEvents, setSliderEvents] = useState<EventItem[]>([]);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [total, setTotal] = useState(0);
  const [searchInputValue, setSearchInputValue] = useState(currentSearch);

  // --- Reactive API URL ---
  const apiUrl = useMemo(() => {
    const urlParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: "9",
    });
    if (currentSearch) {
      urlParams.append("search", currentSearch);
    }
    return `${
      process.env.NEXT_PUBLIC_API_URL
    }/website/universities/events?${urlParams.toString()}`;
  }, [currentPage, currentSearch]);

  // --- Data Fetching ---
  const { data: eventsData, loading: eventsLoading, error: eventsError } = useFetch<EventsResponse>(
    apiUrl,
    locale
  );
  const isInitialLoading = eventsLoading && currentPage === 1;

  // --- Data Aggregation ---
  useEffect(() => {
    if (eventsData?.data) {
      setTotal(eventsData.total);
      if (currentPage === 1) {
        setSliderEvents(eventsData.data.slice(0, 10));
        setAllEvents(eventsData.data);
      } else {
        setAllEvents((prev) => [...prev, ...eventsData.data]);
      }
    }
  }, [eventsData, currentPage]);

  // --- Handlers to Update URL ---
  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      value ? params.set(key, value) : params.delete(key);
    });
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => updateUrlParams({ search: searchInputValue });
  const handleClearSearch = () => {
    setSearchInputValue("");
    updateUrlParams({ search: "" });
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };
  const handleSeeMore = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", (currentPage + 1).toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
      {isInitialLoading ? (
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
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.svg";
                    }}
                  />
                  <div className="absolute left-0 top-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-[#1b417bc7] to-transparent w-full h-full"></div>
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className="max-w-[1042px] mx-auto w-full h-full sm:flex sm:items-start sm:justify-start flex items-start">
                      <div className="lg:mt-20 md:mt-10 mt-5 lg:px-0 px-3 flex_start flex-col gap-5">
                        <div className="flex_center gap-3 bg-golden text-white px-4 py-2 rounded-3xl">
                          <span className="w-3 h-3 rounded-full flex-shrink-0 bg-white"></span>
                          <p className="font-semibold md:text-base text-xs">
                            {slide.event_category_event[0]?.event_category
                              .name || t("conference")}
                          </p>
                        </div>
                        <div className="border border-white px-3 py-1 rounded-3xl flex_center gap-4 mt-10">
                          <div className="flex_center gap-2 text-white">
                            <span className="bg-white bg-opacity-30 rounded-full flex_center w-7 h-7">
                              <FaCalendarAlt />
                            </span>
                            <p className="text-sm">
                              {slide.schedule?.date_string}
                            </p>
                          </div>
                          <div className="flex_center gap-2 text-white">
                            <span className="bg-white bg-opacity-30 rounded-full flex_center w-7 h-7">
                              <FaClock />
                            </span>
                            <p className="text-sm">
                              {slide.schedule?.time_string}
                            </p>
                          </div>
                        </div>
                        <h3 className="lg:text-[26px] md:text-smallTitle text-sm md:max-w-[625px] max-w-full md:px-0 px-3 text-white">
                          {slide.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8 lg:px-0 px-3">
        <SubHeader title={t("head")} alt={false} />
        {/* --- Search Input --- */}
        <div className="relative w-full flex gap-5">
          <div className="relative w-full">
            <span className="pointer-events-none text-black opacity-50 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 z-10 text-xl">
              <CiSearch />
            </span>
            <input
              type="text"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="py-3 w-full border-lightBorder sm:text-base text-sm px-10 sm:rounded-xl rounded-md border focus:border-primary outline-none"
              placeholder={t("search")}
            />
            {searchInputValue && (
              <button
                onClick={handleClearSearch}
                className="absolute ltr:right-2 rtl:left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-secondary z-10"
                aria-label="Clear search"
              >
                <FaXmark />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="sm:px-6 px-4 py-2 sm:rounded-xl rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            {t("search")}
          </button>
        </div>
      </div>

      {isInitialLoading ? (
        <LatestEventsSkeleton />
      ) : eventsError ? (
        <div className="max-w-[1040px] w-full flex_center lg:px-0 px-3">
          <NoData showButton={true} className="my-10" />
        </div>
      ) : (
        <div className="max-w-[1040px] w-full text-secondary flex_start flex-col gap-8 mt-10 lg:px-0 px-3">
          <div className="w-full flex_center gap-5">
            <h1 className="md:text-titleNormal text-base font-semibold flex-shrink-0">
              {t("late_events")}
            </h1>
            <span className="w-full h-1 bg-golden"></span>
          </div>

          {allEvents.length > 0 ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8">
              {allEvents.map((event) => (
                <EventCard
                  key={event.id}
                  image={
                    event.galleries[0]?.image.lg || "/images/placeholder.svg"
                  }
                  link={`/${locale}/events/${event.slug}`}
                  type={
                    event.event_category_event[0]?.event_category.name ||
                    "Event"
                  }
                  createdAt={formatDate(event.created_at)}
                  time={formatTime(event.created_at)}
                  title={event.title}
                />
              ))}
            </div>
          ) : (
            <div className="w-full flex_center">
              <NoData showButton={false} />
            </div>
          )}
        </div>
      )}

      {!isInitialLoading && allEvents.length < total && (
        <button
          onClick={handleSeeMore}
          disabled={eventsLoading}
          className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50"
        >
          {eventsLoading ? t("loading") : t("see_more")}
        </button>
      )}
    </div>
  );
};

export default EventsClient;
