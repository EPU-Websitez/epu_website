"use client";
import React, { useState } from "react";
import { CiBoxList } from "react-icons/ci";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const tableData = [
  {
    subject: "Academic Computing",
    stage: "First Stage",
    semester: "First Semester",
    year: "2022 - 2023",
  },
  {
    subject: "Academic Computing",
    stage: "First Stage",
    semester: "First Semester",
    year: "2022 - 2023",
  },
  {
    subject: "Academic Computing",
    stage: "First Stage",
    semester: "First Semester",
    year: "2022 - 2023",
  },
  {
    subject: "Academic Computing",
    stage: "First Stage",
    semester: "First Semester",
    year: "2022 - 2023",
  },
];

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
        return "md:bg-primary bg-golden text-white";
      case "insights":
        return "bg-blue text-white";
      case "conference":
        return "bg-blue text-white";
      case "event":
        return "md:bg-primary bg-golden text-white";
      case "exam":
        return "md:bg-primary bg-golden text-white";
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
        <div
          key={`prev-${day}`}
          className="md:min-h-24 min-h-10 p-2 text-gray-400 border border-lightBorder"
        >
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
          className="md:min-h-24 min-h-10 p-2 border border-lightBorder"
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
        <div
          key={`next-${day}`}
          className="md:min-h-24 min-h-10 p-2 text-gray-400 border border-lightBorder"
        >
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
    <div className="max-w-[1040px] lg:px-0 px-3 mx-auto bg-white rounded-lg overflow-hidden my-10">
      {/* Header */}
      <div className="bg-primary text-white md:p-4 p-2 flex items-center justify-between">
        <div className="flex items-center md:space-x-4 space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-primary rounded-lg transition-colors"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="md:text-xl text-base font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h1>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-primary rounded-lg transition-colors"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white transition-colors">
          {/* <CiBoxList className="w-4 h-4" /> */}
          <span>List View</span>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="bg-gray-50 text-gray-600 text-sm font-medium md:p-3 p-1 text-center md:border border-none border-lightBorder"
          >
            <span className="truncate md:w-full w-[5ch] block">{day}</span>
          </div>
        ))}

        {/* Calendar days */}
        {renderCalendarDays()}
      </div>
      <div className="md:my-20 my-10 w-full">
        <div className="overflow-x-auto shadow-lg custom_scroll rounded-lg w-full border lg:border-primary border-golden">
          <div className="w-full py-5 lg:bg-primary bg-golden text-center text-white text-[22px]">
            Semester
          </div>
          <table className="w-full bg-white">
            <thead className="border-b border-b-lightBorder">
              <tr className="text-black">
                <th className="md:px-6 px-3 sm:py-4 py-3 text-center font-medium text-sm uppercase tracking-wider md:min-w-max min-w-[170px]">
                  subject
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-center font-medium text-sm uppercase tracking-wider md:min-w-max min-w-[170px]">
                  stage
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-center font-medium text-sm uppercase tracking-wider md:min-w-max min-w-[170px]">
                  semester
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-center font-medium text-sm uppercase tracking-wider md:min-w-max min-w-[170px]">
                  year
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 font-medium ltr:border-r rtl:border-l border-gray-200">
                    {row.subject}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 ltr:border-r rtl:border-l border-gray-200">
                    {row.stage}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.semester}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900">
                    {row.year}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full">
        <div className="overflow-x-auto shadow-lg custom_scroll rounded-lg w-full border lg:border-primary border-golden">
          <div className="w-full py-5 lg:bg-primary bg-golden text-center text-white text-[22px]">
            Second Semester
          </div>
          <table className="w-full bg-white">
            <thead className="border-b border-b-lightBorder">
              <tr className="text-black">
                <th className="md:px-6 px-3 sm:py-4 py-3 text-center font-medium text-sm uppercase tracking-wider md:min-w-max min-w-[170px]">
                  subject
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-center font-medium text-sm uppercase tracking-wider md:min-w-max min-w-[170px]">
                  stage
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-center font-medium text-sm uppercase tracking-wider md:min-w-max min-w-[170px]">
                  semester
                </th>
                <th className="md:px-6 px-3 sm:py-4 py-3 text-center font-medium text-sm uppercase tracking-wider md:min-w-max min-w-[170px]">
                  year
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 font-medium ltr:border-r rtl:border-l border-gray-200">
                    {row.subject}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 ltr:border-r rtl:border-l border-gray-200">
                    {row.stage}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                    {row.semester}
                  </td>
                  <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900">
                    {row.year}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
