"use client";

import { useState, useEffect, useMemo } from "react";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";

import useFetch from "@/libs/hooks/useFetch";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown, FaFilePdf, FaXmark } from "react-icons/fa6";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineLink } from "react-icons/hi2";
import { FaExternalLinkAlt } from "react-icons/fa";

// --- Interfaces ---
interface Teacher {
  full_name: string;
}
interface File {
  id: number;
  path: string;
}
interface ResearchPaper {
  id: number;
  title: string;
  abstract: string;
  teacher: Teacher;
  journal_title: string;
  doi_link: string;
  published_date: string;
  paper_type: string;
  files: File[];
}
interface PublicationThesis {
  id: number;
  title: string;
  specialization: string;
  type: "MASTER" | "PHD";
  teacher: Teacher;
  year: string;
}
type ApiResponse = {
  total: number;
  data: (ResearchPaper | PublicationThesis)[];
};

// --- Modal Component ---
const ResearchModal = ({
  item,
  onClose,
}: {
  item: ResearchPaper | PublicationThesis;
  onClose: () => void;
}) => {
  const t = useTranslations("ResearchesAndPublications");
  const isResearch = "journal_title" in item;
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

  const attachmentUrl =
    isResearch && item.files?.[0]?.path
      ? `https://api-dev-v1-file.epu.edu.iq${item.files[0].path}`
      : "#";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-golden text-white px-6 py-5 flex justify-between items-center">
          <h2 className="text-lg font-bold">{t("research_detail")}</h2>
          <button
            onClick={onClose}
            className="text-white hover:opacity-75"
            aria-label="Close modal"
          >
            <FaXmark size={22} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {isResearch ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <InfoField label={t("research_title")}>
                  <p>{item.title}</p>
                </InfoField>
                <InfoField label={t("research_description")}>
                  <p className="text-sm font-normal text-gray-700">
                    {isExpanded || item.abstract.length <= 200
                      ? item.abstract
                      : `${item.abstract.substring(0, 200)}...`}
                    {item.abstract.length > 200 && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-blue-600 font-semibold ml-1"
                      >
                        {isExpanded ? t("less") : t("more")}
                      </button>
                    )}
                  </p>
                </InfoField>
                <InfoField label={t("publication_date")}>
                  <p>{formatDate(item.published_date)}</p>
                </InfoField>
                <InfoField label={t("source")}>
                  <a
                    href={item.doi_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    {item.journal_title}
                    <FaExternalLinkAlt size={12} />
                  </a>
                </InfoField>
              </div>
              <div className="flex flex-col gap-6">
                <InfoField label={t("supervisor")}>
                  <p>{item.teacher.full_name}</p>
                </InfoField>
                <InfoField label={t("authors")}>
                  <ul className="list-disc list-inside font-normal text-gray-700">
                    <li>{item.teacher.full_name}</li>
                  </ul>
                </InfoField>
                <InfoField label={t("research_type")}>
                  <p className="font-normal text-gray-700 capitalize">
                    {item.paper_type.replace(/_/g, " ").toLowerCase()}
                  </p>
                </InfoField>
                {item.files?.[0] && (
                  <InfoField label={t("attachment")}>
                    <a
                      href={attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-lightBorder rounded-3xl flex_center w-auto max-w-min gap-4 px-2 py-1.5 text-sm"
                    >
                      <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                        <HiOutlineLink />
                      </span>
                      <span>
                        {item.files[0].path.split("/").pop() || "Document.pdf"}
                      </span>
                    </a>
                  </InfoField>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-secondary">
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p>
                <strong>{t("author")}:</strong> {item.teacher.full_name}
              </p>
              <p>
                <strong>{t("type")}:</strong> {item.type}
              </p>
              <p>
                <strong>{t("year")}:</strong>{" "}
                {new Date(item.year).getFullYear()}
              </p>
              <p>
                <strong>{t("specialization")}:</strong> {item.specialization}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Skeleton Component ---
const ResultsSkeleton = () => (
  <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5 max-w-[1040px] animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-5 p-5 rounded-3xl border border-gray-200 bg-gray-100 h-[200px]"
      >
        <div className="w-1/3 h-full bg-gray-300 rounded-2xl"></div>
        <div className="w-2/3 h-full space-y-3">
          <div className="h-5 bg-gray-300 rounded w-full"></div>
          <div className="h-5 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          <div className="h-8 bg-gray-300 rounded-lg w-1/2 mt-4"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- Main Page Component ---
const ResearchClient = () => {
  const t = useTranslations("ResearchesAndPublications");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "researches";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSearch = searchParams.get("search") || "";
  const currentYear = searchParams.get("year") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [year, setYear] = useState(currentYear);
  const [modalItem, setModalItem] = useState<
    ResearchPaper | PublicationThesis | null
  >(null);
  const [items, setItems] = useState<(ResearchPaper | PublicationThesis)[]>([]);

  const apiUrl = useMemo(() => {
    const endpoint =
      currentTab === "researches"
        ? "/website/research/papers"
        : "/website/research/thesis";
    const urlParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: "6",
    });
    if (currentSearch) urlParams.append("search", currentSearch);
    if (currentYear) {
      const dateParam =
        currentTab === "researches" ? "published_date_from" : "thesis_year";
      const dateValue =
        currentTab === "researches" ? `${currentYear}-01-01` : currentYear;
      urlParams.append(dateParam, dateValue);
    }
    return `${
      process.env.NEXT_PUBLIC_API_URL
    }${endpoint}?${urlParams.toString()}`;
  }, [currentTab, currentPage, currentSearch, currentYear]);

  const { data, loading: isLoadingData } = useFetch<ApiResponse>(
    apiUrl,
    locale
  );

  useEffect(() => {
    if (data?.data) {
      setItems((prev) => {
        if (currentPage === 1) {
          return data.data;
        }
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewData = data.data.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prev, ...uniqueNewData];
      });
    }
  }, [data, currentPage]);

  const total = data?.total || 0;
  const isLoading = isLoadingData && currentPage === 1;
  const isLoadingMore = isLoadingData && currentPage > 1;

  const updateUrlParams = (newParams: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) current.set(key, value);
      else current.delete(key);
    });
    current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSearch = () => updateUrlParams({ search: searchTerm, year });

  const handleLoadMore = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", (currentPage + 1).toString());
    // --- FIX: Added { scroll: false } to prevent scrolling to top ---
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    updateUrlParams({ search: "" });
  };
  const handleTabChange = (tab: string) => {
    setSearchTerm("");
    setYear("");
    updateUrlParams({ tab, search: "", year: "" });
  };
  const handleModal = (item: ResearchPaper | PublicationThesis) => {
    setModalItem(item);
    document.body.style.overflowY = "hidden";
  };
  const handleClose = () => {
    document.body.style.overflowY = "auto";
    setModalItem(null);
  };

  return (
    <div className="my-10 flex_center w-full flex-col gap-10 sm:px-0 px-3">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />
      </div>
      <div className="w-full flex_start gap-20 relative">
        {locale === "en" && (
          <div className="md:w-1/2 w-[90%] z-10 md:relative absolute md:left-auto left-0 flex md:justify-end justify-start md:items-start items-center md:top-auto top-1/2 md:-translate-y-0 -translate-y-1/2 lg:px-0 px-3">
            <h1 className="lg:text-[52px] md:text-title text-titleNormal font-bold md:text-secondary text-white sm:max-w-[450px] max-w-full">
              <span className="text-golden">Innovative</span>{" "}
              <br className="sm:block hidden" /> Research and Publications
            </h1>
          </div>
        )}
        {locale === "ku" && (
          <div className="md:w-1/2 w-[90%] z-10 md:relative absolute md:left-auto left-0 flex md:justify-end justify-start md:items-start items-center md:top-auto top-1/2 md:-translate-y-0 -translate-y-1/2 lg:px-0 px-3">
            <h1 className="lg:text-[52px] md:text-title text-titleNormal font-bold md:text-secondary text-white sm:max-w-[450px] max-w-full">
              <span className="text-golden">توێژینەوە</span>{" "}
              <br className="sm:block hidden" /> و بڵاوکراوەی داهێنەرانە
            </h1>
          </div>
        )}
        {locale === "ar" && (
          <div className="md:w-1/2 w-[90%] z-10 md:relative absolute md:left-auto left-0 flex md:justify-end justify-start md:items-start items-center md:top-auto top-1/2 md:-translate-y-0 -translate-y-1/2 lg:px-0 px-3">
            <h1 className="lg:text-[52px] md:text-title text-titleNormal font-bold md:text-secondary text-white sm:max-w-[450px] max-w-full">
              <span className="text-golden">الأبحاث</span>{" "}
              <br className="sm:block hidden" /> والمنشورات المبتكرة
            </h1>
          </div>
        )}
        <div className="md:w-1/2 w-full md:h-[370px] h-[250px] relative rounded-3xl overflow-hidden">
          <Image
            src={"/images/innovative.png"}
            alt="Innovative Research"
            fill
            priority
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>
        <div className="lg:w-[1024px] w-full h-auto absolute left-1/2 md:bottom-10 bottom-2 z-10 -translate-x-1/2 flex_start">
          <div className="lg:w-[800px] md:w-[600px] w-full flex_center sm:gap-5 gap-3 bg-white bg-opacity-30 md:p-5 p-2 rounded-3xl">
            <div className="relative lg:w-[20%] sm:w-[33%] border border-lightBorder bg-backgroundSecondary sm:rounded-xl rounded-md w-[24%] text-sm flex-shrink-0">
              <select
                onChange={(e) => setYear(e.target.value)}
                value={year}
                className="sm:px-2 px-1 w-full sm:py-3 py-[9px] text-black bg-inherit text-opacity-50 focus:border-primary outline-none"
              >
                <option value="">{t("all_years")}</option>
                {[...Array(26)].map((_, i) => (
                  <option key={2025 - i} value={2025 - i}>
                    {2025 - i}
                  </option>
                ))}
              </select>
              <span className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 text-secondary pointer-events-none">
                <FaChevronDown />
              </span>
            </div>
            <div className="relative w-full">
              <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
                <CiSearch />
              </span>
              <input
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                className="sm:py-3 py-[9px] w-full border-lightBorder bg-backgroundSecondary md:bg-opacity-50 bg-opacity-100 sm:text-base text-sm ltr:pl-8 rtl:pr-8 ltr:pr-10 rtl:pl-10 sm:rounded-xl rounded-md border focus:border-primary outline-none"
                placeholder={t("search_research")}
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-secondary z-10"
                  aria-label="Clear search"
                >
                  <FaXmark />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="sm:px-6 px-2 flex-shrink-0 sm:py-3 py-[9px] sm:rounded-xl rounded-md ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-blue text-white"
            >
              {t("search")}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center sm:w-[500px] w-full sm:h-[50px] h-[40px] relative bg-lightBorder rounded-2xl overflow-hidden gap-5 sm:mt-10 mt-5">
        <span
          className={`bg-primary duration-300 absolute ltr:left-0 rtl:right-0 top-0 w-1/2 h-full rounded-2xl transition-all ${
            currentTab === "researches"
              ? "ltr:left-0 rtl:right-0"
              : "ltr:left-1/2 rtl:right-1/2"
          }`}
        ></span>
        <button
          type="button"
          onClick={() => handleTabChange("researches")}
          className={`flex_center w-1/2 md:text-lg text-sm z-10 text-center h-full ${
            currentTab === "researches"
              ? "text-white"
              : "text-secondary opacity-70"
          }`}
        >
          {t("researches")}
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("publications")}
          className={`flex_center w-1/2 md:text-lg text-sm z-10 text-center h-full ${
            currentTab === "publications"
              ? "text-white"
              : "text-secondary opacity-70"
          }`}
        >
          {t("publications")}
        </button>
      </div>

      {isLoading ? (
        <ResultsSkeleton />
      ) : (
        <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5 max-w-[1040px]">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleModal(item)}
              className="flex justify-start items-center text-left gap-5 md:p-7 p-3 rounded-3xl border border-lightBorder hover:border-primary transition-colors"
            >
              <div className="relative bg-golden p-2 flex-shrink-0 rounded-2xl">
                <div className="relative md:w-[118px] w-[70px] md:h-[150px] h-[85px]">
                  <Image
                    src={"/images/researches_card.png"}
                    alt="Research"
                    fill
                    priority
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.svg";
                    }}
                  />
                </div>
                <div className="absolute md:w-[92px] w-[72px] md:h-[42px] h-[32px] md:-left-4 -left-3 bottom-5 text-white flex justify-center items-start">
                  <Image
                    src={"/images/researches_shape.png"}
                    alt="Shape"
                    fill
                    priority
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.svg";
                    }}
                  />
                  <h3 className="text-xs z-10 md:mt-2 mt-1">
                    {currentTab === "researches"
                      ? t("researches")
                      : t("publications")}
                  </h3>
                </div>
              </div>
              <div className="flex_start flex-col gap-4 text-secondary text-start">
                <h2 className="md:text-base text-[10px] font-medium line-clamp-3">
                  {item.title}
                </h2>
                <small className="md:text-xs text-[8px] opacity-70 line-clamp-2">
                  {"abstract" in item ? item.abstract : item.specialization}
                </small>
                <div className="flex_center py-1 px-2 gap-4 rounded-lg border border-lightBorder">
                  <AiOutlineUser />
                  <small className="opacity-70 md:text-xs text-[8px]">
                    {item.teacher.full_name}
                  </small>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {items.length > 0 && items.length < total && (
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="bg-primary text-white px-6 py-2 rounded-full disabled:bg-opacity-70"
        >
          {isLoadingMore ? t("loading") : t("see_more")}
        </button>
      )}

      {modalItem && <ResearchModal item={modalItem} onClose={handleClose} />}
    </div>
  );
};
export default ResearchClient;
