"use client";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { API_URL } from "@/libs/env";

// -------- Interfaces --------
interface CalendarEvent {
  id: number;
  event_date: string;
  title: string;
  link: string;
}

interface EventsResponse {
  data: CalendarEvent[];
}

interface ProcessedEvent {
  type: string;
  label: string;
  link: string;
}

// -------- Skeleton Component --------
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

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<{ [key: string]: ProcessedEvent[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const fetchAndProcessEvents = async () => {
      setIsLoading(true);
      try {
        const startDate = new Date(currentYear, currentMonth, 1)
          .toISOString()
          .split("T")[0];
        const endDate = new Date(currentYear, currentMonth + 1, 0)
          .toISOString()
          .split("T")[0];

        const res = await fetch(
          `${API_URL}/website/universities/calendar-events?start_date=${startDate}&end_date=${endDate}&limit=100`
        );
        const eventData: EventsResponse = await res.json();

        const groupedEvents: { [key: string]: ProcessedEvent[] } = {};

        eventData.data.forEach((event) => {
          const dayKey = new Date(event.event_date)
            .getDate()
            .toString()
            .padStart(2, "0");
          if (!groupedEvents[dayKey]) {
            groupedEvents[dayKey] = [];
          }
          // Include the link when processing data
          groupedEvents[dayKey].push({
            type: "event",
            label: event.title,
            link: event.link,
          });
        });

        setEvents(groupedEvents);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
        setEvents({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessEvents();
  }, [currentDate]);

  const getEventStyle = (type: string) => {
    switch (type) {
      case "event":
        return "md:bg-primary bg-golden text-white hover:opacity-80 transition-opacity";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
  };

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
      const dayKey = day.toString().padStart(2, "0");
      const dayEvents = events[dayKey] || [];

      days.push(
        <div
          key={day}
          className="md:min-h-24 min-h-10 p-2 border border-lightBorder"
        >
          <div className="text-sm font-medium text-gray-900 mb-1">{dayKey}</div>
          <div className="space-y-1">
            {dayEvents.map((event, index) => (
              <a
                key={index}
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-xs px-2 py-1 rounded ${getEventStyle(
                  event.type
                )} truncate`}
              >
                {event.label}
              </a>
            ))}
          </div>
        </div>
      );
    }

    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);

    for (let day = 1; day <= remainingCells; day++) {
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
    <div className="max-w-[1040px] lg:px-0 px-3 mx-auto bg-white rounded-lg overflow-hidden my-10">
      <div className="bg-primary text-white md:p-4 p-2 flex items-center justify-between">
        <div className="flex items-center md:space-x-4 space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="md:text-xl text-base font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h1>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white hover:bg-white/20 transition-colors">
          <span>List View</span>
        </button>
      </div>

      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <div className="grid grid-cols-7">
          {dayNames.map((day) => (
            <div
              key={day}
              className="bg-gray-50 text-gray-600 text-sm font-medium md:p-3 p-1 text-center md:border border-none border-lightBorder"
            >
              <span className="truncate md:w-full w-[5ch] block">{day}</span>
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      )}

      {/* Static Tables */}
      <div className="md:my-20 my-10 w-full">{/* ... Table 1 ... */}</div>
      <div className="w-full">{/* ... Table 2 ... */}</div>
    </div>
  );
}
