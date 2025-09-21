"use client";

// 1. IMPORT useRef, useRouter, usePathname, useSearchParams
import { useEffect, useState, useRef } from "react";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";

import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import useFetch from "@/libs/hooks/useFetch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown, FaTimes } from "react-icons/fa";

import { AsyncPaginate } from "react-select-async-paginate";
import type {
  GroupBase,
  OptionsOrGroups,
  Props as SelectProps,
} from "react-select";

// ========== Types (Unchanged) ==========
interface ImageType {
  lg: string;
  md: string;
  original: string;
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
interface SelectOption {
  value: string;
  label: string;
}

// ========== Skeletons & Components (Unchanged) ==========
const TeacherSkeleton = () => (
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

const customStyles: SelectProps<
  SelectOption,
  false,
  GroupBase<SelectOption>
>["styles"] = {
  control: (provided) => ({
    ...provided,
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    padding: "2px",
    boxShadow: "none",
    fontSize: "14px",
    "&:hover": { borderColor: "#1B417B" },
    minHeight: "42px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#1B417B"
      : state.isFocused
      ? "#eff6ff"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#111827",
    fontSize: "14px",
  }),
  menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
  dropdownIndicator: (provided) => ({ ...provided, color: "#1B417B" }),
  indicatorSeparator: () => ({ display: "none" }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "0.875rem",
    color: "#1B417B",
  }),
};

interface SearchableSelectProps {
  apiUrl: string;
  locale: string;
  placeholder: string;
  value: SelectOption | null;
  onChange: (value: SelectOption | null) => void;
  // NEW PROP to load an initial value from an ID
  initialValueId?: string;
}

const SearchableSelect = ({
  apiUrl,
  locale,
  placeholder,
  value,
  onChange,
  initialValueId,
}: SearchableSelectProps) => {
  // NEW: Effect to load initial value if an ID is provided
  useEffect(() => {
    if (initialValueId && !value) {
      const fetchInitialOption = async () => {
        try {
          const res = await fetch(`${apiUrl}/${initialValueId}`, {
            headers: { "website-language": locale },
          });
          if (res.ok) {
            const item = await res.json();
            onChange({ value: item.id.toString(), label: item.title });
          }
        } catch (error) {
          console.error(
            `Failed to fetch initial option for ID ${initialValueId} from ${apiUrl}`,
            error
          );
        }
      };
      fetchInitialOption();
    }
  }, [initialValueId, value, apiUrl, locale, onChange]);

  const loadOptions = async (
    search: string,
    loadedOptions: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>,
    additional: { page: number } | undefined
  ) => {
    // (loadOptions logic is unchanged)
    const page = additional?.page || 1;
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });
      const res = await fetch(`${apiUrl}?${params.toString()}`, {
        headers: { "website-language": locale },
      });
      const json = await res.json();
      const options = json.data.map((item: { id: number; title: string }) => ({
        value: item.id.toString(),
        label: item.title,
      }));
      return {
        options,
        hasMore: json.page < Math.ceil(json.total / json.limit),
        additional: { page: page + 1 },
      };
    } catch (error) {
      console.error("Failed to load options:", error);
      return { options: [], hasMore: false };
    }
  };
  return (
    <AsyncPaginate
      value={value}
      loadOptions={loadOptions}
      onChange={onChange}
      menuPortalTarget={
        typeof window !== "undefined" ? document.body : undefined
      }
      isClearable
      isSearchable
      placeholder={placeholder}
      debounceTimeout={500}
      styles={customStyles}
      additional={{ page: 1 }}
      components={{
        DropdownIndicator: () => (
          <FaChevronDown className="ltr:mr-2 rtl:ml-2" />
        ),
        ClearIndicator: (props) => (
          <div {...props.innerProps} style={{ cursor: "pointer" }}>
            <FaTimes size={12} />
          </div>
        ),
      }}
    />
  );
};

// ========== Main Client Component ==========
const AcademicStaffClient = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const locale = params.locale as string;

  // 2. ADD router, pathname, and searchParams hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMounted = useRef(false);

  // 3. INITIALIZE state from URL search params
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [selectedCenter, setSelectedCenter] = useState<SelectOption | null>(
    null
  );
  const [selectedDepartment, setSelectedDepartment] =
    useState<SelectOption | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<SelectOption | null>(
    null
  );
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Debounce effect (unchanged)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 4. NEW EFFECT: Update URL when filters change
  useEffect(() => {
    // Only run this effect on updates, not on the initial mount
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCollege) params.set("college_id", selectedCollege.value);
    if (selectedDepartment)
      params.set("department_id", selectedDepartment.value);
    if (selectedCenter) params.set("center_id", selectedCenter.value);
    if (page > 1) params.set("page", page.toString());

    // Use router.replace to update the URL without adding to browser history
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    debouncedSearch,
    selectedCollege,
    selectedDepartment,
    selectedCenter,
    page,
    router,
    pathname,
  ]);

  const buildApiUrl = () => {
    const params = new URLSearchParams({ page: page.toString(), limit: "10" });
    if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
    if (selectedDepartment?.value)
      params.append("department_id", selectedDepartment.value);
    if (selectedCenter?.value) params.append("center_id", selectedCenter.value);
    if (selectedCollege?.value)
      params.append("college_id", selectedCollege.value);
    return `${
      process.env.NEXT_PUBLIC_API_URL
    }/website/teachers?${params.toString()}`;
  };

  const [apiUrl, setApiUrl] = useState(buildApiUrl());
  const { data, loading } = useFetch<TeacherResponse>(apiUrl, locale);

  useEffect(() => {
    if (data?.data) {
      setTeachers((prev) => {
        if (page === 1 || isSearchActive) return data.data;
        const ids = new Set(prev.map((p) => p.id));
        const unique = data.data.filter((d) => !ids.has(d.id));
        return [...prev, ...unique];
      });
      if (isSearchActive) setIsSearchActive(false);
    }
  }, [data, page, isSearchActive]);

  useEffect(() => {
    const newUrl = buildApiUrl();
    setApiUrl(newUrl);
  }, [
    page,
    debouncedSearch,
    selectedCenter,
    selectedDepartment,
    selectedCollege,
  ]);

  const handleLoadMore = () => setPage((prev) => prev + 1);

  const handleSearch = () => {
    setIsSearchActive(true);
    if (page !== 1) setPage(1);
    else setApiUrl(buildApiUrl());
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSelectedCenter(null);
    setSelectedDepartment(null);
    setSelectedCollege(null);
    setIsSearchActive(true);
    if (page !== 1) setPage(1);
    else
      setApiUrl(
        `${process.env.NEXT_PUBLIC_API_URL}/website/teachers?page=1&limit=10`
      );
  };

  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-10">
        <SubHeader title={t("head")} alt={false} />
        <div className="relative w-full lg:h-[530px] sm:h-[488px] h-[305px]">
          <Image
            src="/images/campus.png"
            alt="Campus"
            fill
            priority
            className="w-full h-auto object-cover sm:rounded-3xl rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
          <div className="absolute w-[95%] left-1/2 -translate-x-1/2 sm:bottom-5 bottom-2 bg-white flex_center sm:gap-5 gap-2 sm:p-3 p-1 sm:rounded-3xl rounded-lg">
            {/* Desktop layout */}
            <div className="flex sm:gap-5 w-full items-center gap-3">
              {/* 5. PASS initial value IDs to the select components */}

              <div className="relative w-full">
                <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
                  <CiSearch />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="py-2 w-full border-lightBorder px-8 sm:rounded-xl rounded-lg border focus:border-primary outline-none"
                  placeholder={t("search_by_name")}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 flex-shrink-0 p-2 rounded-xl bg-gradient-to-r from-primary to-blue text-white"
              >
                {t("search")}
              </button>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 grid-cols-2 w-full gap-5">
          <div className="w-full text-sm sm:col-span-1 col-span-2">
            <SearchableSelect
              apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/website/centers`}
              locale={locale}
              placeholder={t("select_center")}
              value={selectedCenter}
              onChange={setSelectedCenter}
              initialValueId={searchParams.get("center_id") ?? undefined}
            />
          </div>
          <div className="w-full text-sm">
            <SearchableSelect
              apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/website/departments`}
              locale={locale}
              placeholder={t("select_department")}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              initialValueId={searchParams.get("department_id") ?? undefined}
            />
          </div>
          <div className="w-full text-sm">
            <SearchableSelect
              apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/website/colleges`}
              locale={locale}
              placeholder={t("select_college")}
              value={selectedCollege}
              onChange={setSelectedCollege}
              initialValueId={searchParams.get("college_id") ?? undefined}
            />
          </div>
        </div>

        {/* Results (Unchanged) */}
        <div className="flex justify-between items-center w-full mt-4">
          <h3 className="sm:text-lg text-base opacity-60 font-semibold">
            {data?.total || 0} {t("results")}
          </h3>
          <button
            onClick={resetSearch}
            className="text-sm text-primary hover:text-blue transition-colors underline"
          >
            {t("reset_search")}
          </button>
        </div>

        {page === 1 && loading ? (
          <TeacherSkeleton />
        ) : teachers.length > 0 ? (
          <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 -mt-3">
            {teachers.map((teacher) => (
              <MemberCard
                key={teacher.id}
                title={teacher.full_name}
                description={teacher.title}
                image={teacher?.profile_image?.lg || "/images/placeholder.svg"}
                link={`/${locale}/academic-staff/${teacher.id}`}
                staticText={t("view_profile")}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center w-full py-10">
              <p className="text-gray-500">{t("no_data_found")}</p>
            </div>
          )
        )}
        {loading && page > 1 && (
          <p className="text-center w-full">{t("loading")}...</p>
        )}
        {!loading &&
          teachers.length > 0 &&
          teachers.length < (data?.total || 0) && (
            <div className="flex_center w-full">
              {" "}
              <button
                onClick={handleLoadMore}
                className="custom_button px-20 py-2"
                disabled={loading}
              >
                {" "}
                {loading ? t("loading") : t("see_more")}{" "}
              </button>{" "}
            </div>
          )}
      </div>
    </div>
  );
};

export default AcademicStaffClient;
