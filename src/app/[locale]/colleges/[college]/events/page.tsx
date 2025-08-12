"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { API_URL } from "@/libs/env"; // Assuming you have this env file
import CollegeHeader from "@/components/collegeHeader";
import EventCard from "@/components/eventCards";

// --- TYPE DEFINITIONS based on API response ---

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

// --- SKELETON COMPONENT for initial loading ---

const EventSkeleton = () => (
  <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8 mb-5">
    {[1, 2, 3].map((i) => (
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

const Page = () => {
  const t = useTranslations("Events");
  const params = useParams();
  const locale = params?.locale as string;
  const college = params?.college as string;

  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true); // For initial skeleton
  const [loadingMore, setLoadingMore] = useState<boolean>(false); // For "See More" button

  // Fetch events when component mounts or page changes
  useEffect(() => {
    if (!college) return;

    const fetchEvents = async () => {
      // Set loading state based on whether it's the first page or not
      if (currentPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await fetch(
          `${API_URL}/website/colleges/${college}/events?page=${currentPage}&limit=12`
        );
        const data: EventsResponse = await response.json();

        if (data && data.data) {
          // Append new data to existing events list
          setEvents((prevEvents) => [...prevEvents, ...data.data]);
          setTotalEvents(data.total);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchEvents();
  }, [college, currentPage]);

  const handleSeeMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to get image with fallback
  const getEventImage = (event: Event) => {
    return (
      event.galleries?.[0]?.image?.md ||
      event.galleries?.[0]?.image?.lg ||
      event.galleries?.[0]?.image?.original ||
      "/images/event.png" // Fallback image
    );
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

        {/* Conditional Rendering for Skeleton and Content */}
        {loading && events.length === 0 ? (
          <EventSkeleton />
        ) : (
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
        )}
      </div>

      {/* "See More" Button Logic */}
      {!loading && events.length < totalEvents && (
        <button
          onClick={handleSeeMore}
          disabled={loadingMore}
          className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50 disabled:cursor-wait"
        >
          {loadingMore ? t("loading") : t("see_more")}
        </button>
      )}
    </div>
  );
};

export default Page;
