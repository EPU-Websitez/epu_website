"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { API_URL } from "@/libs/env";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}
interface Teacher {
  full_name: string;
}
interface ResearchPaper {
  id: number;
  title: string;
  abstract: string;
  teacher: Teacher;
  journal_title: string;
  doi_link: string;
  published_date: string;
}
interface ResearchPaperResponse {
  total: number;
  data: ResearchPaper[];
}
interface PublicationThesis {
  id: number;
  title: string;
  specialization: string;
  type: "MASTER" | "PHD";
  teacher: Teacher;
  year: string;
}
interface PublicationThesisResponse {
  total: number;
  data: PublicationThesis[];
}

// -------- Modal Component --------
const ResearchModal = ({
  item,
  onClose,
}: {
  item: ResearchPaper | PublicationThesis;
  onClose: () => void;
}) => {
  const isResearch = "journal_title" in item;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-secondary">
            {item.title}
          </h2>
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <AiOutlineUser />
            <span>{item.teacher.full_name}</span>
          </div>
          {isResearch ? (
            <div className="space-y-4 text-secondary">
              <p>
                <strong className="font-semibold">Journal:</strong>{" "}
                {item.journal_title}
              </p>
              <p>
                <strong className="font-semibold">Published:</strong>{" "}
                {new Date(item.published_date).toLocaleDateString()}
              </p>
              <p className="text-sm opacity-80">{item.abstract}</p>
              <a
                href={item.doi_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on DOI
              </a>
            </div>
          ) : (
            <div className="space-y-4 text-secondary">
              <p>
                <strong className="font-semibold">Type:</strong> {item.type}
              </p>
              <p>
                <strong className="font-semibold">Year:</strong>{" "}
                {new Date(item.year).getFullYear()}
              </p>
              <p>
                <strong className="font-semibold">Specialization:</strong>{" "}
                {item.specialization}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -------- Skeleton Component --------
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

const Page = () => {
  const t = useTranslations("ResearchesAndPublications");
  const [tab, setTab] = useState("researches");
  const params = useParams();
  const locale = params?.locale as string;
  const [modalItem, setModalItem] = useState<
    ResearchPaper | PublicationThesis | null
  >(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState(""); // Default to empty string (no date selected)
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<(ResearchPaper | PublicationThesis)[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(0);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setIsLoading(true);
    fetchData(1);
  }, [tab, triggerSearch]); // Re-fetch only when tab changes or search is triggered

  const fetchData = async (pageNum: number) => {
    if (pageNum > 1) setIsLoadingMore(true);

    // Conditionally build the date parameter
    let dateParam = "";
    if (year) {
      dateParam =
        tab === "researches"
          ? `&published_date_from=${year}-01-01`
          : `&thesis_year=${year}`;
    }

    const endpoint =
      tab === "researches"
        ? `/website/research/papers?search=${searchTerm}${dateParam}`
        : `/website/research/thesis?search=${searchTerm}${dateParam}`;

    try {
      const res = await fetch(`${API_URL}${endpoint}&page=${pageNum}&limit=6`);
      const newData = await res.json();
      if (newData.data) {
        setItems((prev) =>
          pageNum === 1 ? newData.data : [...prev, ...newData.data]
        );
        setTotal(newData.total);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleSearch = () => {
    // Trigger the useEffect to refetch data with current filter values
    setTriggerSearch((prev) => prev + 1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
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
          />
        </div>
        <div className="lg:w-[1024px] w-full h-auto absolute left-1/2 md:bottom-10 bottom-2 z-10 -translate-x-1/2 flex_start">
          <div className="lg:w-[800px] md:w-[600px] w-full flex_center sm:gap-5 gap-3 bg-white bg-opacity-30 md:p-5 p-2 rounded-3xl">
            <div className="relative lg:w-[20%] sm:w-[33%] w-auto text-sm flex-shrink-0">
              <select
                onChange={(e) => setYear(e.target.value)}
                value={year}
                className="sm:px-2 px-1 w-[80px] sm:py-3 py-[9px] border border-lightBorder bg-backgroundSecondary sm:rounded-xl rounded-md text-black text-opacity-50 focus:border-primary outline-none"
              >
                {/* <option value="">{t("all_years")}</option> */}
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
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
                className="sm:py-3 py-[9px] w-full border-lightBorder bg-backgroundSecondary md:bg-opacity-50 bg-opacity-100 sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
                placeholder={t("search_research")}
              />
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
            tab === "researches"
              ? "ltr:left-0 rtl:right-0"
              : "ltr:left-1/2 rtl:right-1/2"
          }`}
        ></span>
        <button
          type="button"
          onClick={() => setTab("researches")}
          className={`flex_center w-1/2 md:text-lg text-sm z-10 text-center h-full ${
            tab === "researches" ? "text-white" : "text-secondary opacity-70"
          }`}
        >
          {t("researches")}
        </button>
        <button
          type="button"
          onClick={() => setTab("publications")}
          className={`flex_center w-1/2 md:text-lg text-sm z-10 text-center h-full ${
            tab === "publications" ? "text-white" : "text-secondary opacity-70"
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
              className="flex_center text-left gap-5 md:p-7 p-3 rounded-3xl border border-lightBorder hover:border-primary transition-colors"
            >
              <div className="relative bg-golden p-2 flex-shrink-0 rounded-2xl">
                <div className="relative md:w-[118px] w-[70px] md:h-[150px] h-[85px]">
                  <Image
                    src={"/images/researches_card.png"}
                    alt="Research"
                    fill
                    priority
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute md:w-[92px] w-[72px] md:h-[42px] h-[32px] md:-left-4 -left-3 bottom-5 text-white flex justify-center items-start">
                  <Image
                    src={"/images/researches_shape.png"}
                    alt="Shape"
                    fill
                    priority
                    className="w-full h-full object-cover"
                  />
                  <h3 className="text-xs z-10 md:mt-2 mt-1">
                    {tab === "researches" ? t("researches") : t("publications")}
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
          {isLoadingMore ? t("loading") : t("load_more")}
        </button>
      )}

      {modalItem && <ResearchModal item={modalItem} onClose={handleClose} />}
    </div>
  );
};
export default Page;
