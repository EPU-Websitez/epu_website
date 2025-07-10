"use client";
import React, { useState } from "react";
import { CiBoxList } from "react-icons/ci";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 6, 1)); // July 2024

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

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Calendar events data
  const events: any = {
    "01": [{ type: "summer", label: "Summer Holiday" }],
    "02": [{ type: "summer", label: "Summer Holiday" }],
    "03": [
      { type: "summer", label: "Summer Holiday" },
      { type: "insights", label: "Future Insights" },
      { type: "conference", label: "International C..." },
    ],
    "04": [{ type: "summer", label: "Summer Holiday" }],
    "05": [{ type: "summer", label: "Summer Holiday" }],
    "06": [{ type: "summer", label: "Summer Holiday" }],
    "07": [{ type: "summer", label: "Summer Holiday" }],
    "08": [{ type: "summer", label: "Summer Holiday" }],
    "09": [{ type: "summer", label: "Summer Holiday" }],
    "10": [{ type: "summer", label: "Summer Holiday" }],
    "11": [{ type: "summer", label: "Summer Holiday" }],
    "12": [
      { type: "event", label: "Event" },
      { type: "insights", label: "Future Insights" },
      { type: "conference", label: "International C..." },
    ],
    "13": [{ type: "exam", label: "Exam" }],
    "14": [{ type: "summer", label: "Summer Holiday" }],
    "15": [
      { type: "summer", label: "Summer Holiday" },
      { type: "insights", label: "Future Insights" },
      { type: "conference", label: "International C..." },
    ],
    "16": [{ type: "summer", label: "Summer Holiday" }],
    "17": [{ type: "summer", label: "Summer Holiday" }],
    "18": [{ type: "summer", label: "Summer Holiday" }],
    "19": [{ type: "summer", label: "Summer Holiday" }],
    "20": [{ type: "summer", label: "Summer Holiday" }],
    "21": [{ type: "summer", label: "Summer Holiday" }],
    "22": [
      { type: "summer", label: "Summer Holiday" },
      { type: "insights", label: "Future Insights" },
      { type: "conference", label: "International C..." },
    ],
    "23": [{ type: "summer", label: "Summer Holiday" }],
    "24": [{ type: "summer", label: "Summer Holiday" }],
    "25": [{ type: "summer", label: "Summer Holiday" }],
    "26": [{ type: "summer", label: "Summer Holiday" }],
    "27": [{ type: "summer", label: "Summer Holiday" }],
    "28": [{ type: "summer", label: "Summer Holiday" }],
    "01-next": [
      { type: "summer", label: "Summer Holiday" },
      { type: "insights", label: "Future Insights" },
      { type: "conference", label: "International C..." },
    ],
    "02-next": [{ type: "summer", label: "Summer Holiday" }],
    "03-next": [{ type: "summer", label: "Summer Holiday" }],
  };

  const getEventStyle = (type: any) => {
    switch (type) {
      case "summer":
        return "bg-primary text-white";
      case "insights":
        return "bg-blue text-white";
      case "conference":
        return "bg-blue text-white";
      case "event":
        return "bg-primary text-white";
      case "exam":
        return "bg-primary text-white";
      default:
        return "bg-grey text-white";
    }
  };

  const navigateMonth = (direction: any) => {
    setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
  };

  const renderCalendarDays = () => {
    const days = [];

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <div key={`prev-${day}`} className="min-h-24 p-2 text-gray-400">
          <div className="text-sm font-medium">
            {day.toString().padStart(2, "0")}
          </div>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = day.toString().padStart(2, "0");
      const dayEvents = events[dayKey] || [];

      days.push(
        <div
          key={day}
          className="min-h-24 p-2 border-r border-b border-gray-200"
        >
          <div className="text-sm font-medium text-gray-900 mb-1">
            {day.toString().padStart(2, "0")}
          </div>
          <div className="space-y-1">
            {dayEvents.map((event: any, index: any) => (
              <div
                key={index}
                className={`text-xs px-2 py-1 rounded ${getEventStyle(
                  event.type
                )} truncate`}
              >
                {event.label}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Next month's leading days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);

    for (let day = 1; day <= remainingCells; day++) {
      const dayKey = `${day.toString().padStart(2, "0")}-next`;
      const dayEvents = events[dayKey] || [];

      days.push(
        <div key={`next-${day}`} className="min-h-24 p-2 text-gray-400">
          <div className="text-sm font-medium">
            {day.toString().padStart(2, "0")}
          </div>
          <div className="space-y-1">
            {dayEvents.map((event: any, index: any) => (
              <div
                key={index}
                className={`text-xs px-2 py-1 rounded ${getEventStyle(
                  event.type
                )} truncate opacity-60`}
              >
                {event.label}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="max-w-[1040px] mx-auto bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-primary rounded-lg transition-colors"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h1>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-primary rounded-lg transition-colors"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button className="flex items-center space-x-2 bg-primary hover:bg-primary px-4 py-2 rounded-lg transition-colors">
          <CiBoxList className="w-4 h-4" />
          <span>List View</span>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="bg-gray-50 text-gray-600 text-sm font-medium p-3 text-center border-r border-b border-gray-200"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {renderCalendarDays()}
      </div>
    </div>
  );
}
