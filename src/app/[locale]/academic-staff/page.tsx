"use client";

import { useEffect, useState } from "react";
import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { API_URL } from "@/libs/env";

// ========== Types ==========
interface ImageType {
  lg: string;
}
interface Teacher {
  id: number;
  full_name: string;
  title: string;
  profile_image: ImageType;
}
interface TeacherResponse {
  total: number;
  page: number;
  limit: number;
  data: Teacher[];
}

const TeacherSkeleton = () => {
  return (
    <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 -mt-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="border border-lightBorder flex_center p-3 rounded-3xl flex-col gap-4 text-center"
        >
          <div className="flex_center p-1 border-4 border-primary rounded-full w-[100px] h-[100px] relative bg-white">
            <div className="w-full h-full bg-gray-300 rounded-full"></div>
          </div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-3 w-48 bg-gray-200 rounded"></div>
          <div className="flex justify-between items-center rounded-3xl w-full border border-[#81B1CE4A] border-opacity-30 p-1">
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
            <div className="w-[30px] h-[30px] bg-gray-300 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Page = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const locale = params.locale as string;

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAcademic, setSelectedAcademic] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Build API URL with search parameters
  const buildApiUrl = () => {
    const baseUrl = `${API_URL}/website/teachers?page=${page}&limit=${limit}`;

    if (!isSearchActive) return baseUrl;

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }
    if (selectedAcademic && selectedAcademic !== "#") {
      params.append("academic", selectedAcademic);
    }
    if (selectedDepartment && selectedDepartment !== "#") {
      params.append("department", selectedDepartment);
    }
    if (selectedPosition && selectedPosition !== "#") {
      params.append("position", selectedPosition);
    }

    return `${API_URL}/website/teachers?${params.toString()}`;
  };

  const [apiUrl, setApiUrl] = useState(buildApiUrl());
  const { data, loading } = useFetch<TeacherResponse>(apiUrl);

  // Append new data or replace based on search state
  useEffect(() => {
    if (data?.data) {
      setTeachers((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const unique = data.data.filter((d) => !ids.has(d.id));

        // If it's a new search or first page, replace the data
        if (page === 1 || isSearchActive) {
          return data.data;
        }

        // Otherwise append for pagination
        return [...prev, ...unique];
      });
    }
  }, [data, page, isSearchActive]);

  // Update API URL when search is triggered
  useEffect(() => {
    setApiUrl(buildApiUrl());
  }, [page, isSearchActive]);

  // Load more
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Handle search
  const handleSearch = () => {
    setIsSearchActive(true);
    setPage(1);
    setTeachers([]);
  };

  // Reset search
  const resetSearch = () => {
    setSearchQuery("");
    setSelectedAcademic("");
    setSelectedDepartment("");
    setSelectedPosition("");
    setIsSearchActive(false);
    setPage(1);
    setTeachers([]);
  };

  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-10">
        <SubHeader title={t("head")} alt={false} />

        <div className="relative w-full lg:h-[530px] sm:h-[488px] h-[305px]">
          <Image
            src="/images/campus.png"
            alt="title"
            fill
            priority
            className="w-full h-auto object-cover sm:rounded-3xl rounded-lg"
          />
          {/* Mobile search bar */}
          <div className="absolute w-[95%] left-1/2 -translate-x-1/2 sm:bottom-24 bottom-[30%] bg-white lg:hidden flex gap-3 sm:p-3 p-1 sm:rounded-3xl rounded-lg">
            <div className="relative w-full">
              <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 right-2 top-1/2 -translate-y-1/2 z-10 sm:text-xl text-lg">
                <CiSearch />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setIsSearchActive(false);
                  return setSearchQuery(e.target.value);
                }}
                className="py-2 w-full sm:text-base text-sm border-lightBorder px-8 sm:rounded-xl rounded-lg border focus:border-primary outline-none"
                placeholder={t("search_by_name")}
              />
            </div>
            <button
              onClick={handleSearch}
              className="sm:px-6 px-4 flex-shrink-0 p-2 sm:rounded-xl rounded-lg bg-gradient-to-r from-primary to-blue text-white sm:block hidden"
            >
              {t("search")}
            </button>
          </div>

          {/* Main search filters */}
          <div className="absolute w-[95%] left-1/2 -translate-x-1/2 sm:bottom-5 bottom-2 bg-white flex_center sm:gap-5 gap-2 sm:p-3 p-1 sm:rounded-3xl rounded-lg">
            {/* Desktop layout - flex */}
            <div className="hidden sm:flex sm:gap-5 w-full items-center">
              <div className="relative lg:w-[20%] sm:w-[33%] text-sm">
                <select
                  name="academic"
                  id="academic"
                  value={selectedAcademic}
                  onChange={(e) => setSelectedAcademic(e.target.value)}
                  className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-lg text-black text-opacity-50 focus:border-primary outline-none"
                >
                  <option value="">{t("select_academics")}</option>
                  <option value="academic1">Academic 1</option>
                  <option value="academic2">Academic 2</option>
                  <option value="academic3">Academic 3</option>
                </select>
                <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary text-opacity-70 pointer-events-none">
                  <FaChevronDown />
                </span>
              </div>
              <div className="relative lg:w-[20%] sm:w-[33%] text-sm">
                <select
                  name="department"
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-lg text-black text-opacity-50 focus:border-primary outline-none"
                >
                  <option value="">{t("select_department")}</option>
                  <option value="department1">Department 1</option>
                  <option value="department2">Department 2</option>
                  <option value="department3">Department 3</option>
                </select>
                <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary text-opacity-70 pointer-events-none">
                  <FaChevronDown />
                </span>
              </div>
              <div className="relative lg:w-[20%] sm:w-[33%] text-sm">
                <select
                  name="position"
                  id="position"
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="text-start w-full sm:px-2 px-1 sm:py-2 py-1 border border-lightBorder sm:rounded-xl rounded-lg text-black text-opacity-50 focus:border-primary outline-none"
                >
                  <option value="">{t("select_position")}</option>
                  <option value="position1">Position 1</option>
                  <option value="position2">Position 2</option>
                  <option value="position3">Position 3</option>
                </select>
                <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary text-opacity-70 pointer-events-none">
                  <FaChevronDown />
                </span>
              </div>
              <div className="relative w-[30%] lg:block hidden">
                <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
                  <CiSearch />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-2 w-full border-lightBorder px-8 sm:rounded-xl rounded-lg border focus:border-primary outline-none"
                  placeholder={t("search_by_name")}
                />
              </div>
              <button
                onClick={handleSearch}
                className="sm:px-6 px-2 flex-shrink-0 sm:p-2 p-1 sm:rounded-xl sm:text-base text-sm rounded-lg bg-gradient-to-r from-primary to-blue text-white lg:block sm:hidden block"
              >
                {t("search")}
              </button>
            </div>

            {/* Mobile layout - grid */}
            <div className="grid sm:hidden grid-cols-2 gap-2 w-full text-sm">
              {/* Top row - two selects */}
              <div className="relative">
                <select
                  name="academic"
                  id="academic"
                  value={selectedAcademic}
                  onChange={(e) => setSelectedAcademic(e.target.value)}
                  className="text-start text-sm w-full px-1 py-1 border border-lightBorder rounded-lg text-black text-opacity-50 focus:border-primary outline-none"
                >
                  <option value="">{t("select_academics")}</option>
                  <option value="academic1">Academic 1</option>
                  <option value="academic2">Academic 2</option>
                  <option value="academic3">Academic 3</option>
                </select>
                <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary text-opacity-70 pointer-events-none">
                  <FaChevronDown />
                </span>
              </div>
              <div className="relative">
                <select
                  name="department"
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="text-start text-sm w-full px-1 py-1 border border-lightBorder rounded-lg text-black text-opacity-50 focus:border-primary outline-none"
                >
                  <option value="">{t("select_department")}</option>
                  <option value="department1">Department 1</option>
                  <option value="department2">Department 2</option>
                  <option value="department3">Department 3</option>
                </select>
                <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary text-opacity-70 pointer-events-none">
                  <FaChevronDown />
                </span>
              </div>

              {/* Bottom row - position select takes 80%, search button takes 20% */}
              <div className="relative col-span-2 flex gap-2">
                <div className="flex-1 relative" style={{ width: "80%" }}>
                  <select
                    name="position"
                    id="position"
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="text-start text-sm w-full px-1 py-1 border border-lightBorder rounded-lg text-black text-opacity-50 focus:border-primary outline-none"
                  >
                    <option value="">{t("select_position")}</option>
                    <option value="position1">Position 1</option>
                    <option value="position2">Position 2</option>
                    <option value="position3">Position 3</option>
                  </select>
                  <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary text-opacity-70 pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>
                <button
                  onClick={handleSearch}
                  className="px-2 p-1 text-sm rounded-lg bg-gradient-to-r from-primary to-blue text-white flex-shrink-0"
                  style={{ width: "20%" }}
                >
                  {t("search")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center w-full">
          <h3 className="sm:text-lg text-base opacity-60 font-semibold">
            {data?.total || 0} {t("results")}
          </h3>

          {isSearchActive && (
            <button
              onClick={resetSearch}
              className="text-sm text-primary hover:text-blue transition-colors underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {page === 1 && loading ? (
          <TeacherSkeleton />
        ) : (
          <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 -mt-3">
            {teachers.map((teacher) => (
              <MemberCard
                key={teacher.id}
                title={teacher.full_name}
                description={teacher.title}
                image={teacher?.profile_image?.lg}
                link={`/${locale}/academic-staff/${teacher.id}`}
                staticText={t("view_profile")}
              />
            ))}
          </div>
        )}

        {!loading && teachers.length < (data?.total || 0) && (
          <div className="flex_center w-full">
            <button
              onClick={handleLoadMore}
              className="custom_button px-20 py-2"
              disabled={loading}
            >
              {loading ? t("loading") : t("see_more")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
