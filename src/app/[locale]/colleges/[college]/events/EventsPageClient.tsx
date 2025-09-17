"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { API_URL } from "@/libs/env";
import CollegeHeader from "@/components/collegeHeader";
import EventCard from "@/components/eventCards";
import useFetch from "@/libs/hooks/useFetch";
import { CiSearch } from "react-icons/ci";
import { FaXmark } from "react-icons/fa6";

// --- TYPE DEFINITIONS ---
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}
interface GalleryItem {
  id: number;
  image: Image;
}
interface EventCategory {
  id: number;
  name: string;
  slug: string;
}
interface EventCategoryEvent {
  event_category: EventCategory;
}
interface Schedule {
  time_string: string;
  date_string: string;
}
interface Event {
  id: number;
  title: string;
  slug: string;
  created_at: string;
  galleries: GalleryItem[];
  event_category_event: EventCategoryEvent[];
  schedule: Schedule;
}
interface EventsResponse {
  total: number;
  page: number;
  limit: number;
  data: Event[];
}

// --- SKELETON COMPONENT ---
const EventSkeleton = () => (
  <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8 mb-5">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="w-full h-40 bg-gray-300 rounded-lg mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-4/5"></div>
      </div>
    ))}
  </div>
);

// --- MAIN PAGE COMPONENT ---
const EventsPageClient = () => {
  const t = useTranslations("Events");
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const locale = params?.locale as string;
  const college = params?.college as string;

  // --- State from URL ---
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSearch = searchParams.get("search") || "";

  // --- Local UI State ---
  const [events, setEvents] = useState<Event[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [searchInputValue, setSearchInputValue] = useState(currentSearch);

  // --- Reactive API URL ---
  const apiUrl = useMemo(() => {
    if (!college) return "";
    const urlParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: "6",
    });
    if (currentSearch) {
      urlParams.append("search", currentSearch);
    }
    return `${API_URL}/website/colleges/${college}/events?${urlParams.toString()}`;
  }, [college, currentPage, currentSearch]);

  // --- Data Fetching ---
  const { data: eventsData, loading: eventsLoading } = useFetch<EventsResponse>(
    apiUrl,
    locale
  );
  const isInitialLoading = eventsLoading && currentPage === 1;

  // --- Data Aggregation ---
  useEffect(() => {
    if (eventsData?.data) {
      setTotalEvents(eventsData.total);
      if (currentPage === 1) {
        setEvents(eventsData.data);
      } else {
        setEvents((prevEvents) => [...prevEvents, ...eventsData.data]);
      }
    }
  }, [eventsData, currentPage]);

  // --- Handlers to Update URL ---
  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      value ? params.set(key, value) : params.delete(key);
    });
    params.delete("page"); // Reset page on filter change
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getEventImage = (event: Event) => {
    return event.galleries?.[0]?.image?.md || "/images/event.png";
  };

  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>
      <div className="max-w-[1040px] w-full text-secondary flex_start flex-col gap-8 mt-10 lg:px-0 px-3">
        <div className="w-full flex_center gap-5">
          <h1 className="md:text-titleNormal text-base font-semibold flex-shrink-0">
            {t("late_events")}
          </h1>
          <span className="w-full h-1 bg-golden"></span>
        </div>

        {/* --- SEARCH BAR --- */}
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
              className="py-2 w-full border-lightBorder sm:text-base text-sm px-10 sm:rounded-xl rounded-md border focus:border-primary outline-none"
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
            className="sm:px-6 px-4 py-2 sm:rounded-xl sm:text-base text-sm rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            {t("search")}
          </button>
        </div>

        {isInitialLoading ? (
          <EventSkeleton />
        ) : events.length > 0 ? (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8 mb-5">
            {events.map((event) => (
              <EventCard
                key={event.id}
                image={getEventImage(event)}
                link={`/${locale}/events/${event.slug}`}
                type={
                  event.event_category_event?.[0]?.event_category?.name ||
                  "General"
                }
                createdAt={
                  event.schedule?.date_string || formatDate(event.created_at)
                }
                time={event.schedule?.time_string || ""}
                title={event.title}
              />
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-10">
            <p className="text-gray-500 text-lg">{t("no_events_found")}</p>
            <button
              onClick={handleClearSearch}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              {t("clear_search")}
            </button>
          </div>
        )}
      </div>

      {!isInitialLoading && events.length < totalEvents && (
        <button
          onClick={handleSeeMore}
          disabled={eventsLoading}
          className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50 disabled:cursor-wait"
        >
          {eventsLoading ? t("loading") : t("see_more")}
        </button>
      )}
    </div>
  );
};

export default EventsPageClient;
