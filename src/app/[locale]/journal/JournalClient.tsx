"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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

import useFetch from "@/libs/hooks/useFetch";
import { CiCalendar, CiGlobe, CiSearch } from "react-icons/ci";
import { FaChartLine, FaChevronDown, FaXmark } from "react-icons/fa6";
import { FiAward, FiBookOpen } from "react-icons/fi";
import { HiOutlineLink } from "react-icons/hi2";
import { FaExternalLinkAlt } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import {
  MdAccessTime,
  MdCalendarToday,
  MdLockOpen,
  MdOutlineArticle,
} from "react-icons/md";
import { VscLibrary } from "react-icons/vsc";

// --- Interfaces ---
interface Teacher {
  id: number;
  full_name: string;
  title: string;
  profile_image?: {
    original: string;
    lg: string;
    md: string;
    sm: string;
  };
}

interface ResearchFile {
  id: number;
  path: string;
}

interface ResearchPaper {
  id: number;
  title: string;
  journal_title: string;
  impact_factor: string;
  abstract: string;
  doi_link: string;
  paper_type: "JOURNAL_PAPER" | "CONFERENCE_PAPER" | "BOOK_PAPER";
  type: string;
  author_order_number: number;
  published_date: string;
  status: "APPROVED";
  teacher: Teacher;
  departments: any[];
  files: ResearchFile[];
}

interface StatsResponse {
  summary: {
    total_thesis: number;
    total_research_papers: number;
    total_publications: number;
  };
  thesis_by_type: { type: "MASTER" | "PHD"; count: number }[];
  papers_by_type: {
    type: "JOURNAL_PAPER" | "CONFERENCE_PAPER" | "BOOK_PAPER";
    count: number;
  }[];
}

interface ApiResponse {
  total: number;
  page: number;
  limit: number;
  data: ResearchPaper[];
}

// --- File URL Builder ---
const getFileUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  const fileBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.epu.edu.iq";
  return `${fileBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

// --- Modal Component ---
const JournalDetailsModal = ({
  item,
  onClose,
}: {
  item: ResearchPaper;
  onClose: () => void;
}) => {
  const t = useTranslations("Journal");
  const tRes = useTranslations("ResearchesAndPublications");
  const [isExpanded, setIsExpanded] = useState(false);

  const InfoField = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="font-semibold text-secondary">{children}</div>
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-65 z-50 flex justify-center items-center p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-primary text-white px-6 py-5 flex justify-between items-center bg-gradient-to-r from-primary to-blue">
          <h2 className="text-lg font-bold">{tRes("research_detail")}</h2>
          <button
            onClick={onClose}
            className="text-white hover:opacity-75 transition-opacity"
            aria-label="Close modal"
          >
            <FaXmark size={22} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <InfoField label={tRes("research_title")}>
                <p className="text-base text-secondary leading-snug">
                  {item.title}
                </p>
              </InfoField>

              {item.abstract && (
                <InfoField label={tRes("research_description")}>
                  <p className="text-sm font-normal text-gray-700 leading-relaxed text-justify">
                    {isExpanded || item.abstract.length <= 250
                      ? item.abstract
                      : `${item.abstract.substring(0, 250)}...`}
                    {item.abstract.length > 250 && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-primary font-semibold hover:underline ml-1 transition-all"
                      >
                        {isExpanded ? tRes("less") : tRes("more")}
                      </button>
                    )}
                  </p>
                </InfoField>
              )}

              <InfoField label={tRes("publication_date")}>
                <p>{formatDate(item.published_date)}</p>
              </InfoField>

              {item.doi_link && (
                <InfoField label={tRes("source")}>
                  <a
                    href={item.doi_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:underline inline-flex items-center gap-2 group"
                  >
                    <span>{item.journal_title || tRes("view_on_DOI")}</span>
                    <FaExternalLinkAlt
                      size={11}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </a>
                </InfoField>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {item.teacher && (
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-lightBorder">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-backgroundSecondary">
                    {item.teacher.profile_image?.sm ? (
                      <Image
                        src={getFileUrl(item.teacher.profile_image.sm)}
                        alt={item.teacher.full_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex_center text-secondary text-2xl">
                        <AiOutlineUser />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-sm">
                      {item.teacher.full_name}
                    </h4>
                    <p className="text-xs text-gray-500 capitalize">
                      {item.teacher.title || "Academic Staff"}
                    </p>
                  </div>
                </div>
              )}

              <InfoField label={tRes("research_type")}>
                <p className="font-semibold text-secondary capitalize text-sm">
                  {item.paper_type.replace(/_/g, " ").toLowerCase()}
                </p>
              </InfoField>

              {item.impact_factor && (
                <InfoField label="Impact Factor">
                  <div className="flex items-center gap-2 text-golden text-sm">
                    <FaChartLine />
                    <span>{item.impact_factor}</span>
                  </div>
                </InfoField>
              )}

              {item.type && (
                <InfoField label="Category/Publisher">
                  <p className="text-secondary text-sm">{item.type}</p>
                </InfoField>
              )}
            </div>
          </div>

          {item.files && item.files.length > 0 && (
            <div className="border-t border-t-lightBorder pt-5">
              <p className="text-sm text-gray-500 mb-2 font-medium">
                {t("attachment")}
              </p>
              <div className="flex flex-wrap gap-3">
                {item.files.map((file, idx) => {
                  const fileUrl = getFileUrl(file.path);
                  const fileName =
                    file.path.split("/").pop() || `Attachment_${idx + 1}.pdf`;
                  return (
                    <a
                      key={file.id || idx}
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-lightBorder hover:border-primary rounded-3xl flex items-center gap-3 px-4 py-2 text-sm font-semibold text-secondary transition-all"
                    >
                      <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                        <HiOutlineLink />
                      </span>
                      <span className="max-w-[200px] truncate">{fileName}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Skeletons ---
const StatsSkeleton = () => (
  <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 max-w-[1045px] animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-5 p-6 rounded-3xl border border-gray-100 bg-gray-50 h-[104px]"
      >
        <div className="w-14 h-14 bg-gray-200 rounded-2xl flex-shrink-0"></div>
        <div className="space-y-2 flex-grow">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

const ResultsSkeleton = () => (
  <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-5 max-w-[1045px] animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="flex_start flex-col gap-5 p-6 rounded-3xl border border-gray-100 bg-gray-50 h-[300px]"
      >
        <div className="h-6 bg-gray-200 rounded w-5/6"></div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mt-2"></div>
        <div className="border-t border-t-gray-100 w-full pt-4 mt-auto flex justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- Filter Years Modal ---
interface FilterYearsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromYear: string;
  toYear: string;
  setFromYear: (val: string) => void;
  setToYear: (val: string) => void;
  onApply: (from: string, to: string) => void;
  onReset: () => void;
}

const FilterYearsModal = ({
  isOpen,
  onClose,
  fromYear,
  toYear,
  setFromYear,
  setToYear,
  onApply,
  onReset,
}: FilterYearsModalProps) => {
  const t = useTranslations("Journal");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isRtl = locale === "ar" || locale === "ku";

  // Temporary local states to allow "Cancel/Close" without applying
  const [localFrom, setLocalFrom] = useState(fromYear);
  const [localTo, setLocalTo] = useState(toYear);

  useEffect(() => {
    if (isOpen) {
      setLocalFrom(fromYear);
      setLocalTo(toYear);
    }
  }, [isOpen, fromYear, toYear]);

  if (!isOpen) return null;

  const handleApply = () => {
    setFromYear(localFrom);
    setToYear(localTo);
    onApply(localFrom, localTo);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex_center bg-black bg-opacity-60 backdrop-blur-sm transition-all">
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="bg-white rounded-3xl border border-lightBorder p-6 max-w-[420px] w-full mx-4 shadow-2xl relative animate-scaleIn text-secondary"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-lightBorder pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <CiCalendar className="text-2xl text-primary font-bold" />
            <h3 className="text-lg font-bold text-secondary">
              {t("filter_by_years")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-secondary p-1.5 hover:bg-[#fafafa] rounded-full transition-all"
          >
            <FaXmark className="text-lg" />
          </button>
        </div>

        {/* Year Selectors Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* From Year select option */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t("year_from")}
            </label>
            <div className="relative">
              <select
                value={localFrom}
                onChange={(e) => setLocalFrom(e.target.value)}
                className="w-full pl-3 pr-8 py-3 border border-lightBorder bg-backgroundSecondary rounded-xl text-[#606060] font-semibold focus:border-primary outline-none appearance-none cursor-pointer hover:bg-[#fafafa] transition-colors text-sm"
              >
                <option value="">{t("year_from")}</option>
                {[...Array(26)].map((_, i) => (
                  <option key={2026 - i} value={2026 - i}>
                    {2026 - i}
                  </option>
                ))}
              </select>
              <span className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-secondary pointer-events-none text-xs">
                <FaChevronDown />
              </span>
            </div>
          </div>

          {/* To Year select option */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t("year_to")}
            </label>
            <div className="relative">
              <select
                value={localTo}
                onChange={(e) => setLocalTo(e.target.value)}
                className="w-full pl-3 pr-8 py-3 border border-lightBorder bg-backgroundSecondary rounded-xl text-[#606060] font-semibold focus:border-primary outline-none appearance-none cursor-pointer hover:bg-[#fafafa] transition-colors text-sm"
              >
                <option value="">{t("year_to")}</option>
                {[...Array(26)].map((_, i) => {
                  const y = 2026 - i;
                  if (localFrom && y < parseInt(localFrom, 10)) return null;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
              <span className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-secondary pointer-events-none text-xs">
                <FaChevronDown />
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-3 border-t border-lightBorder pt-4">
          <button
            onClick={handleReset}
            className="w-1/3 py-2.5 rounded-xl border border-lightBorder hover:bg-gray-50 text-gray-500 font-semibold text-sm transition-all active:scale-95"
          >
            {t("reset")}
          </button>
          <button
            onClick={handleApply}
            className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-primary to-blue hover:opacity-90 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            {t("apply")}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Client Component ---
const JournalClient = () => {
  const t = useTranslations("Journal");
  const tRes = useTranslations("ResearchesAndPublications");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL Sync Search Params
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSearch = searchParams.get("search") || "";
  const currentFromYear = searchParams.get("year_from") || "";
  const currentToYear = searchParams.get("year_to") || "";

  // Local State Bindings
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [fromYear, setFromYear] = useState(currentFromYear);
  const [toYear, setToYear] = useState(currentToYear);
  const [modalItem, setModalItem] = useState<ResearchPaper | null>(null);
  const [items, setItems] = useState<ResearchPaper[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(currentSearch);
  const isMounted = useRef(false);

  // Debounce effect for search term input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Update URL params when debounced search query changes
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    // Only update parameters if the query actually changed to prevent resetting 'page' back to '1' during infinite scrolls
    if (debouncedSearch !== currentSearch) {
      updateUrlParams({
        search: debouncedSearch,
        year_from: fromYear,
        year_to: toYear,
      });
    }
  }, [debouncedSearch]);

  // Statistics API
  const statsUrl = `${process.env.NEXT_PUBLIC_API_URL}/website/research/stats`;
  const { data: statsData, loading: statsLoading } = useFetch<StatsResponse>(
    statsUrl,
    locale,
  );

  // Journal Papers API with query parameters
  const papersUrl = useMemo(() => {
    const urlParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: "6",
      paper_type: "JOURNAL_PAPER",
    });
    if (currentSearch) urlParams.append("search", currentSearch);
    if (currentFromYear) urlParams.append("year_from", currentFromYear);
    if (currentToYear) urlParams.append("year_to", currentToYear);
    return `${process.env.NEXT_PUBLIC_API_URL}/website/research/papers?${urlParams.toString()}`;
  }, [currentPage, currentSearch, currentFromYear, currentToYear]);

  const {
    data,
    loading: isLoadingData,
    error,
  } = useFetch<ApiResponse>(papersUrl, locale);

  // Synchronize local states when URL changes (like when browser back is pressed)
  useEffect(() => {
    if (searchTerm !== currentSearch) setSearchTerm(currentSearch);
    if (fromYear !== currentFromYear) setFromYear(currentFromYear);
    if (toYear !== currentToYear) setToYear(currentToYear);
  }, [currentSearch, currentFromYear, currentToYear]);

  // Handle appending of paginated data or resetting on fresh filter
  useEffect(() => {
    if (data?.data) {
      setItems((prev) => {
        if (currentPage === 1) {
          return data.data;
        }
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewData = data.data.filter(
          (item) => !existingIds.has(item.id),
        );
        return [...prev, ...uniqueNewData];
      });
    }
  }, [data, currentPage]);

  const total = data?.total || 0;
  const isLoading = isLoadingData && currentPage === 1;
  const isLoadingMore = isLoadingData && currentPage > 1;

  // URL State Updates
  const updateUrlParams = (newParams: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) current.set(key, value);
      else current.delete(key);
    });
    current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSearchSubmit = () => {
    updateUrlParams({
      search: searchTerm,
      year_from: fromYear,
      year_to: toYear,
    });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    updateUrlParams({ search: "", year_from: fromYear, year_to: toYear });
  };

  const handleApplyYears = (from: string, to: string) => {
    updateUrlParams({ search: searchTerm, year_from: from, year_to: to });
  };

  const handleResetYears = () => {
    setFromYear("");
    setToYear("");
    updateUrlParams({ search: searchTerm, year_from: "", year_to: "" });
  };

  const handleLoadMore = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", (currentPage + 1).toString());
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const handleOpenModal = (item: ResearchPaper) => {
    setModalItem(item);
    document.body.style.overflowY = "hidden";
  };

  const handleCloseModal = () => {
    document.body.style.overflowY = "auto";
    setModalItem(null);
  };

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5 sm:px-0 px-3">
      <div className="max-w-[1045px] px-3 w-full text-secondary flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />

        {/* Header Hero Area */}
        <div className="w-full relative mb-16 gap-10 md:block hidden change_direction">
          <div className="flex_start flex-col gap-5 mt-44 lg:max-w-[790px] md:max-w-[670px] w-1/2 flex-shrink-0 md:w-full z-10 relative">
            <h2 className="lg:text-titleNormal text-smallTitle font-semibold relative">
              <svg className="card__arc" xmlns="http://www.w3.org/2000/svg">
                <path />
              </svg>
              <span className="h-[103px] w-[360px] absolute right-5 top-0 bg-white rounded-r-3xl"></span>
              <svg className="card__arc_alt" xmlns="http://www.w3.org/2000/svg">
                <path />
              </svg>
              {locale === "en" && (
                <span className="z-10 relative font-semibold">
                  Dive into a diverse range of{" "}
                  <span className="text-golden font-bold">
                    peer-reviewed journals
                  </span>
                  , covering various disciplines and offering cutting-edge
                  research.
                </span>
              )}
              {locale === "ku" && (
                <span className="z-10 relative font-semibold">
                  خۆت بخەرە ناو کۆمەڵێک{" "}
                  <span className="text-golden font-bold">گۆڤاری هەمەچەشن</span>
                  , کە لەلایەن هاوتاکانەوە پێداچوونەوەیان بۆ کراوە و دیسیپلینە
                  جیاوازەکان دەگرێتەوە و توێژینەوەی پێشکەوتوو پێشکەش دەکەن.
                </span>
              )}
              {locale === "ar" && (
                <span className="z-10 relative font-semibold">
                  انغمس في مجموعة متنوعة{" "}
                  <span className="text-golden font-bold">
                    من المجلات المحكمة
                  </span>
                  , التي تغطي مختلف التخصصات وتقدم أبحاثًا متطورة.
                </span>
              )}
            </h2>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
              <div className="flex_center gap-2 rounded-3xl border border-golden py-1.5 px-3 bg-white bg-opacity-40">
                <CiGlobe className="text-golden font-bold text-lg" />
                <span className="lg:text-sm text-[10px] font-semibold">
                  {t("global_reach")}
                </span>
              </div>
              <div className="flex_center gap-2 rounded-3xl border border-golden py-1.5 px-3 bg-white bg-opacity-40">
                <MdAccessTime className="text-golden font-bold text-lg" />
                <span className="lg:text-sm text-[10px] font-semibold">
                  {t("historical_significance")}
                </span>
              </div>
              <div className="flex_center gap-2 rounded-3xl border border-golden py-1.5 px-3 bg-white bg-opacity-40">
                <VscLibrary className="text-golden font-bold text-lg" />
                <span className="lg:text-sm text-[10px] font-semibold">
                  {t("extensive_collection")}
                </span>
              </div>
              <div className="flex_center gap-2 rounded-3xl border border-golden py-1.5 px-3 bg-white bg-opacity-40">
                <FiAward className="text-golden font-bold text-lg" />
                <span className="lg:text-sm text-[10px] font-semibold">
                  {t("leading_journal")}
                </span>
              </div>
            </div>
            {/* Desktop Filter Bar */}
            <div className="lg:w-full md:w-[600px] w-full flex_center gap-4 bg-white bg-opacity-30 md:p-5 p-2 ltr:pl-5 rtl:pr-5 rounded-3xl shadow-sm border border-lightBorder bg-clip-padding backdrop-filter backdrop-blur-md">
              <div className="relative w-full">
                <span className="pointer-events-none text-black opacity-50 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 z-10 text-xl">
                  <CiSearch />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  className="sm:py-3.5 py-[9px] w-full border-lightBorder bg-backgroundSecondary md:bg-opacity-50 text-secondary bg-opacity-100 sm:text-base text-sm ltr:pl-9 ltr:pr-10 rtl:pr-9 rtl:pl-10 sm:rounded-xl rounded-md border focus:border-primary outline-none"
                  placeholder={t("search_journal")}
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary z-10 transition-colors"
                  >
                    <FaXmark />
                  </button>
                )}
              </div>

              {/* Year Filter Popover Trigger Button */}
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
                className={`flex items-center gap-2 px-5 py-3.5 border border-lightBorder bg-backgroundSecondary rounded-xl text-[#606060] font-semibold hover:bg-gray-50 transition-all cursor-pointer text-sm flex-shrink-0 select-none ${fromYear || toYear ? "border-primary text-primary" : ""}`}
              >
                <CiCalendar className="text-xl" />
                <span>
                  {fromYear || toYear
                    ? fromYear && toYear
                      ? `${fromYear} - ${toYear}`
                      : fromYear
                        ? `≥ ${fromYear}`
                        : `≤ ${toYear}`
                    : t("filter_by_years")}
                </span>
                {fromYear || toYear ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetYears();
                    }}
                    className="hover:text-red-500 transition-colors p-1"
                  >
                    <FaXmark className="text-xs" />
                  </span>
                ) : (
                  <FaChevronDown className="text-xs text-gray-400" />
                )}
              </button>

              <button
                onClick={handleSearchSubmit}
                className="sm:px-8 px-4 py-3.5 flex-shrink-0 sm:rounded-xl rounded-md ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-blue text-white font-bold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                {t("search")}
              </button>
            </div>
          </div>

          <div className="md:w-[402px] w-1/2 md:h-[575px] h-[250px] md:absolute relative top-0 right-0 shadow-lg rounded-2xl overflow-hidden border border-lightBorder">
            <Image
              src={`/images/journal.jpg`}
              alt="EPU Journal Library"
              fill
              priority
              className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          </div>
        </div>

        {/* Mobile Hero View */}
        <div className="flex justify-center items-center md:hidden gap-5 w-full bg-backgroundSecondary p-4 rounded-3xl border border-lightBorder">
          <div className="flex_start flex-col gap-4 w-1/2">
            <h5 className="text-xs font-semibold leading-relaxed">
              {locale === "en" && (
                <span className="z-10 relative">
                  Dive into a diverse range of{" "}
                  <span className="text-golden font-bold">
                    peer-reviewed journals
                  </span>
                  , covering various disciplines and offering cutting-edge
                  research.
                </span>
              )}
              {locale === "ku" && (
                <span className="z-10 relative">
                  خۆت بخەرە ناو کۆمەڵێک{" "}
                  <span className="text-golden font-bold">گۆڤاری هەمەچەشن</span>
                  , کە لەلایەن هاوتاکانەوە پێداچوونەوەیان بۆ کراوە و دیسیپلینە
                  جیاوازەکان دەگرێتەوە و توێژینەوەی پێشکەوتوو پێشکەش دەکەن.
                </span>
              )}
              {locale === "ar" && (
                <span className="z-10 relative">
                  انغمس في مجموعة متنوعة{" "}
                  <span className="text-golden font-bold">
                    من المجلات المحكمة
                  </span>
                  , التي تغطي مختلف التخصصات وتقدم أبحاثًا متطورة.
                </span>
              )}
            </h5>
            <div className="flex_start flex-col gap-1.5 w-full">
              <div className="flex items-center gap-2 rounded-3xl border border-golden py-1 px-2.5 bg-white w-full">
                <CiGlobe className="text-golden text-xs" />
                <span className="text-[9px] font-semibold">
                  {t("global_reach")}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-3xl border border-golden py-1 px-2.5 bg-white w-full">
                <MdAccessTime className="text-golden text-xs" />
                <span className="text-[9px] font-semibold">
                  {t("historical_significance")}
                </span>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-[180px] relative rounded-2xl overflow-hidden border border-lightBorder">
            <Image
              src={`/images/journal.jpg`}
              alt="EPU Journal Library"
              fill
              priority
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          </div>
        </div>

        {/* Mobile Filter View */}
        <div className="w-full md:hidden flex justify-center items-center gap-2">
          <div className="relative w-full">
            <span className="pointer-events-none text-black opacity-50 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 z-10 text-lg">
              <CiSearch />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="py-2.5 w-full border-lightBorder bg-backgroundSecondary sm:text-base text-xs ltr:pl-8 ltr:pr-8 rtl:pr-8 rtl:pl-8 rounded-xl border focus:border-primary outline-none"
              placeholder={t("search_journal")}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              >
                <FaXmark size={12} />
              </button>
            )}
          </div>

          {/* Mobile Filter Trigger Button */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`p-2.5 flex-shrink-0 rounded-xl border border-lightBorder bg-backgroundSecondary flex_center text-secondary hover:bg-gray-100 transition-colors ${fromYear || toYear ? "border-primary text-primary" : ""}`}
          >
            <CiCalendar className="text-xl" />
          </button>

          <button
            onClick={handleSearchSubmit}
            className="px-4 py-2.5 flex-shrink-0 rounded-xl bg-primary text-white text-xs font-bold shadow-sm"
          >
            {t("search")}
          </button>
        </div>

        {/* Live Statistics Banner */}
        {statsLoading ? (
          <StatsSkeleton />
        ) : (
          statsData && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 max-w-[1045px]">
              <div className="flex items-center gap-5 p-6 rounded-3xl border border-lightBorder bg-[#FAFBFD] hover:shadow-md hover:border-primary transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF0F9] text-primary flex_center text-3xl flex-shrink-0">
                  <MdOutlineArticle />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-secondary">
                    {statsData.papers_by_type?.find(
                      (p) => p.type === "JOURNAL_PAPER",
                    )?.count ?? 0}
                  </h4>
                  <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase mt-0.5">
                    {tRes("journal")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-6 rounded-3xl border border-lightBorder bg-[#FAFBFD] hover:shadow-md hover:border-golden transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-[#FDF7EA] text-golden flex_center text-3xl flex-shrink-0">
                  <FiAward />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-secondary">
                    {statsData.papers_by_type?.find(
                      (p) => p.type === "CONFERENCE_PAPER",
                    )?.count ?? 0}
                  </h4>
                  <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase mt-0.5">
                    Conference Papers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-6 rounded-3xl border border-lightBorder bg-[#FAFBFD] hover:shadow-md hover:border-green-600 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-[#EEFAF3] text-green-600 flex_center text-3xl flex-shrink-0">
                  <FiBookOpen />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-secondary">
                    {statsData.summary?.total_thesis ?? 0}
                  </h4>
                  <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase mt-0.5">
                    Theses & Dissertations
                  </p>
                </div>
              </div>
            </div>
          )
        )}

        {/* Results Count & Clear Filters */}
        {(currentSearch || currentFromYear || currentToYear) && (
          <div className="flex justify-between items-center w-full mt-4 max-w-[1045px] px-2">
            <h3 className="sm:text-lg text-base opacity-60 font-semibold text-secondary">
              {total} {t("results")}
            </h3>
            <button
              onClick={() => {
                setSearchTerm("");
                setFromYear("");
                setToYear("");
                updateUrlParams({ search: "", year_from: "", year_to: "" });
              }}
              className="text-sm text-primary hover:text-blue transition-colors underline font-semibold flex items-center gap-1 cursor-pointer select-none"
            >
              <FaXmark className="text-xs" />
              <span>{t("reset_search")}</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {isLoading ? (
          <ResultsSkeleton />
        ) : error ? (
          <div className="my-10 flex_center w-full">
            <NoData showButton={true} className="my-10" />
          </div>
        ) : items.length === 0 ? (
          <div className="my-10 flex_center w-full">
            <NoData showButton={false} className="my-10" />
          </div>
        ) : (
          <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-6 max-w-[1045px]">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex_start flex-col gap-5 rounded-3xl border border-lightBorder hover:border-primary p-6 bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="w-full space-y-2 text-start">
                  <h2 className="font-bold text-secondary text-base leading-snug line-clamp-2 min-h-[44px]">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 text-justify min-h-[54px]">
                    {item.abstract ||
                      "No abstract available for this journal paper."}
                  </p>
                </div>

                <div className="w-full flex_start gap-2 flex-wrap min-h-[34px]">
                  {item.teacher && (
                    <span className="bg-[#FAFBFD] border border-lightBorder text-secondary text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium">
                      <span className="relative w-4 h-4 rounded-full overflow-hidden inline-block bg-backgroundSecondary">
                        {item.teacher.profile_image?.sm ? (
                          <Image
                            src={getFileUrl(item.teacher.profile_image.sm)}
                            alt={item.teacher.full_name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <AiOutlineUser className="text-[10px] absolute inset-0 m-auto text-gray-500" />
                        )}
                      </span>
                      <span>{item.teacher.full_name}</span>
                    </span>
                  )}
                  {item.type && (
                    <span className="bg-backgroundSecondary border border-transparent text-secondary text-xs px-3 py-1.5 rounded-lg font-medium">
                      {item.type}
                    </span>
                  )}
                </div>

                {/* Info Metadata Row */}
                <div className="border-t border-t-lightBorder pt-4 w-full flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full flex_center bg-backgroundSecondary text-primary text-sm">
                      <MdOutlineArticle />
                    </span>
                    <div className="flex_start flex-col">
                      <h5 className="text-[10px] font-bold text-secondary leading-none">
                        Journal Paper
                      </h5>
                      <small className="text-[8px] text-gray-400 font-medium">
                        Type
                      </small>
                    </div>
                  </div>
                  {item.impact_factor && (
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full flex_center bg-backgroundSecondary text-golden text-sm">
                        <FaChartLine />
                      </span>
                      <div className="flex_start flex-col">
                        <h5 className="text-[10px] font-bold text-secondary leading-none">
                          {item.impact_factor}
                        </h5>
                        <small className="text-[8px] text-gray-400 font-medium">
                          Impact Factor
                        </small>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full flex_center bg-[#EEFAF3] text-green-600 text-sm">
                      <MdLockOpen />
                    </span>
                    <div className="flex_start flex-col">
                      <h5 className="text-[10px] font-bold text-green-600 leading-none">
                        Open Access
                      </h5>
                      <small className="text-[8px] text-gray-400 font-medium">
                        Access Type
                      </small>
                    </div>
                  </div>
                </div>

                {/* File Attachment & Dates Row */}
                <div className="border-t border-t-lightBorder pt-4 w-full flex justify-between items-center gap-2 mt-auto">
                  <div className="flex_start flex-col gap-1.5 text-start">
                    <span className="text-gray-400 font-semibold text-[10px] uppercase tracking-wider">
                      {t("attachment")}
                    </span>
                    {item.files && item.files.length > 0 ? (
                      <a
                        href={getFileUrl(item.files[0].path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-lightBorder hover:border-primary bg-white rounded-3xl flex_center gap-1.5 px-3 py-1 text-[11px] text-secondary font-semibold transition-all max-w-[130px]"
                      >
                        <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full text-[10px]">
                          <HiOutlineLink />
                        </span>
                        <span className="truncate">
                          {item.files[0].path.split("/").pop()}
                        </span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-semibold italic">
                        No attachment
                      </span>
                    )}
                  </div>
                  <div className="flex_start flex-col gap-1.5 text-start">
                    <span className="text-gray-400 font-semibold text-[10px] uppercase tracking-wider">
                      {t("issue_date")}
                    </span>
                    <span className="text-xs font-bold text-secondary">
                      {new Date(item.published_date).toLocaleDateString(
                        locale === "ku" ? "en-GB" : locale,
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-opacity-90 active:scale-[0.97] rounded-xl transition-all"
                    >
                      {tRes("more")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Pagination */}
        {items.length > 0 && items.length < total && (
          <div className="flex_center w-full mt-6">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-primary hover:bg-opacity-90 text-white px-8 py-2.5 rounded-full disabled:bg-opacity-70 font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              {isLoadingMore ? t("loading") : tRes("see_more")}
            </button>
          </div>
        )}
      </div>

      {modalItem && (
        <JournalDetailsModal item={modalItem} onClose={handleCloseModal} />
      )}
      <FilterYearsModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        fromYear={fromYear}
        toYear={toYear}
        setFromYear={setFromYear}
        setToYear={setToYear}
        onApply={handleApplyYears}
        onReset={handleResetYears}
      />
    </div>
  );
};

export default JournalClient;
