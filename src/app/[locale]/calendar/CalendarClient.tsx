"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";

// Components & Hooks
import useFetch from "@/libs/hooks/useFetch";

import SubHeader from "@/components/subHeader";

// -------- TYPE DEFINITIONS (UPDATED) --------
interface CalendarEvent {
  id: number;
  event_date: string;
  title: string;
  description: string; // Added description
  link: string;
}

interface CalendarEventsResponse {
  data: CalendarEvent[];
}

// (Removed ProcessedEvent interface as it's no longer needed)

interface SeasonEvent {
  id: number;
  date_from: string;
  date_to: string;
  event_title: string;
  duration: string;
}

interface Season {
  id: number;
  season_title: string;
  season_events: SeasonEvent[];
}

interface SeasonsResponse {
  total: number;
  data: Season[];
}

// -------- SKELETON COMPONENTS (Unchanged) --------
const CalendarSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-7">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-50 h-12 md:border border-lightBorder"
        ></div>
      ))}
      {[...Array(35)].map((_, i) => (
        <div
          key={i}
          className="md:min-h-24 min-h-10 p-2 border border-lightBorder"
        >
          <div className="h-4 w-6 bg-gray-200 rounded"></div>
          <div className="h-3 w-full bg-gray-200 rounded mt-2"></div>
        </div>
      ))}
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="w-full animate-pulse flex flex-col gap-10">
    <div className="w-full bg-gray-200 h-14 rounded-t-lg"></div>
    <div className="w-full bg-gray-100 h-[200px] rounded-b-lg -mt-10"></div>
  </div>
);

// -------- NEW: Event Modal Component --------
const EventModal = ({
  event,
  onClose,
  locale,
  t,
}: {
  event: CalendarEvent | null;
  onClose: () => void;
  locale: string;
  t: (key: string) => string;
}) => {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl text-secondary"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-800 transition-colors"
        >
          <IoClose />
        </button>

        {event.link ? (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-xl font-semibold mb-2 text-primary hover:underline"
          >
            {event.title}
            <FiExternalLink className="opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>
        ) : (
          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        )}

        <p className="text-sm text-gray-500 mb-4 border-b pb-4">
          {formatDate(event.event_date)}
        </p>
        <p className="text-secondary/80 whitespace-pre-wrap">
          {event.description || t("no_description")}
        </p>
      </div>
    </div>
  );
};

// -------- MAIN COMPONENT (MODIFIED) --------
const CalendarClient = () => {
  const t = useTranslations("Calendar");
  const locale = useParams()?.locale as string;

  // --- State for Interactive Calendar ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<{ [key: string]: CalendarEvent[] }>({});
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  ); // State for modal

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const startDate = new Date(currentYear, currentMonth, 1)
    .toISOString()
    .split("T")[0];
  const endDate = new Date(currentYear, currentMonth + 1, 0)
    .toISOString()
    .split("T")[0];
  const calendarUrl = `${process.env.NEXT_PUBLIC_API_URL}/website/universities/calendar-events?start_date=${startDate}&end_date=${endDate}&limit=100`;

  // --- State for Seasons Tables (Load More) ---
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // --- Data Fetching ---
  const { data: calendarData, loading: calendarLoading } =
    useFetch<CalendarEventsResponse>(calendarUrl, locale);
  const { data: seasonsData, loading: seasonsLoading } =
    useFetch<SeasonsResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/website/universities/seasons?page=${page}&limit=${LIMIT}`,
      locale
    );

  // --- Effects to Process Fetched Data ---
  useEffect(() => {
    if (calendarData?.data) {
      const groupedEvents: { [key: string]: CalendarEvent[] } = {};
      calendarData.data.forEach((event) => {
        const eventDate = new Date(event.event_date);
        const year = eventDate.getFullYear();
        const month = String(eventDate.getMonth() + 1).padStart(2, "0");
        const day = String(eventDate.getDate()).padStart(2, "0");
        const fullDateKey = `${year}-${month}-${day}`;
        if (!groupedEvents[fullDateKey]) groupedEvents[fullDateKey] = [];
        groupedEvents[fullDateKey].push(event); // Store the full event object
      });
      setEvents(groupedEvents);
    } else {
      setEvents({});
    }
  }, [calendarData]);

  useEffect(() => {
    if (seasonsData?.data) {
      setSeasons((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const newSeasons = seasonsData.data.filter(
          (s) => !existingIds.has(s.id)
        );
        return [...prev, ...newSeasons];
      });
    }
  }, [seasonsData]);

  // --- Handlers & Formatters ---
  const handleLoadMore = () => setPage((prevPage) => prevPage + 1);
  const navigateMonth = (direction: number) =>
    setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
  const handleEventClick = (event: CalendarEvent) => setSelectedEvent(event);
  const handleCloseModal = () => setSelectedEvent(null);

  const formatDateForTable = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // --- UI Constants & Helpers ---
  const isInitialSeasonsLoading = seasonsLoading && seasons.length === 0;
  const monthNames = [
    t("january"),
    t("february"),
    t("march"),
    t("april"),
    t("may"),
    t("june"),
    t("july"),
    t("august"),
    t("september"),
    t("october"),
    t("november"),
    t("december"),
  ];
  const dayNames = [
    t("sunday"),
    t("monday"),
    t("tuesday"),
    t("wednesday"),
    t("thursday"),
    t("friday"),
    t("saturday"),
  ];

  const renderCalendarDays = () => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className="md:min-h-24 min-h-10 p-2 text-gray-400 border border-lightBorder"
        >
          <div className="text-sm font-medium">
            {(daysInPrevMonth - i).toString().padStart(2, "0")}
          </div>
        </div>
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const monthString = String(currentMonth + 1).padStart(2, "0");
      const dayString = String(day).padStart(2, "0");
      const lookupKey = `${currentYear}-${monthString}-${dayString}`;
      const dayEvents = events[lookupKey] || [];
      days.push(
        <div
          key={day}
          className="md:min-h-24 min-h-10 p-2 border border-lightBorder"
        >
          <div className="text-sm font-medium text-gray-900 mb-1">
            {dayString}
          </div>
          <div className="space-y-1">
            {dayEvents.map((event, index) => (
              <button
                key={index}
                onClick={() => handleEventClick(event)}
                className="block text-xs text-left w-full px-2 py-1 rounded text-wrap md:bg-primary bg-golden text-white hover:opacity-80 transition-opacity truncate"
              >
                {event.title}
              </button>
            ))}
          </div>
        </div>
      );
    }
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    for (let day = 1; day <= totalCells - (firstDay + daysInMonth); day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="md:min-h-24 min-h-10 p-2 text-gray-400 border border-lightBorder"
        >
          <div className="text-sm font-medium">
            {day.toString().padStart(2, "0")}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <>
      <div className="max-w-[1040px] lg:px-0 px-3 mx-auto my-10">
        <div className="mb-10 flex_start">
          <SubHeader title={t("university_calendar")} alt={false} />
        </div>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="bg-primary text-white md:p-4 p-2 flex items-center justify-between">
            <div className="flex items-center md:space-x-4 space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors border border-white/30"
              >
                <FaChevronLeft className="w-5 h-5 rtl:rotate-180" />
              </button>
              <h2 className="md:text-lg text-sm font-medium w-32 text-center">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors border border-white/30"
              >
                <FaChevronRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </div>
          </div>
          <div className="custom_scroll md:overflow-x-hidden overflow-x-auto">
            {calendarLoading ? (
              <CalendarSkeleton />
            ) : (
              <div className="grid grid-cols-7 min-w-[1000px]">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="bg-gray-50 text-primary text-sm font-medium md:p-3 p-1 text-center md:border border-none border-lightBorder"
                  >
                    <span className="truncate w-full block">{day}</span>
                  </div>
                ))}
                {renderCalendarDays()}
              </div>
            )}
          </div>
        </div>

        {/* --- Seasons Tables Section (Unchanged) --- */}
        <div className="md:my-20 my-10 w-full flex flex-col gap-10">
          {isInitialSeasonsLoading ? (
            <TableSkeleton />
          ) : (
            <>
              {seasons.map((season) => (
                <div
                  key={season.id}
                  className="w-full bg-white sm:rounded-3xl rounded-lg shadow-lg overflow-hidden border border-primary"
                >
                  <div className="bg-primary text-white p-4 text-center">
                    <h3 className="text-xl font-semibold">
                      {season.season_title}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr>
                          <th className="p-3 text-sm font-semibold text-primary uppercase text-center w-2/5">
                            {t("date")}
                          </th>
                          <th className="p-3 text-sm font-semibold text-primary uppercase text-center w-2/5">
                            {t("event")}
                          </th>
                          <th className="p-3 text-sm font-semibold text-primary uppercase text-center w-1/5">
                            {t("duration")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-x divide-gray-200">
                        {season.season_events.length > 0 ? (
                          season.season_events.map((event) => (
                            <tr key={event.id}>
                              <td className="p-4 text-sm text-primary font-medium text-center whitespace-nowrap">
                                {formatDateForTable(event.date_from)} →{" "}
                                {formatDateForTable(event.date_to)}
                              </td>
                              <td className="p-4 text-sm text-primary font-medium text-center">
                                {event.event_title}
                              </td>
                              <td className="p-4 text-sm text-primary font-medium text-center">
                                {event.duration}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-center py-10 text-gray-500"
                            >
                              {t("no_events_found")}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              {!seasonsLoading && seasons.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  {t("no_seasons_found")}
                </div>
              )}
              {seasonsData && seasons.length < seasonsData.total && (
                <div className="w-full flex justify-center mt-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={seasonsLoading}
                    className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50 disabled:cursor-wait"
                  >
                    {seasonsLoading ? t("loading") : t("see_more")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <EventModal
        event={selectedEvent}
        onClose={handleCloseModal}
        locale={locale}
        t={t}
      />
    </>
  );
};

export default CalendarClient;
