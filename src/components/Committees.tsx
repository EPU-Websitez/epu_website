"use client";
import React, { useEffect, useState } from "react";
import SubHeader from "./subHeader";
import { useTranslations } from "next-intl";
import { BsBarChart } from "react-icons/bs";
import { HiOutlineLink } from "react-icons/hi2";

import useFetch from "@/libs/hooks/useFetch";
import { PiSealCheck } from "react-icons/pi";
import { FaUsers } from "react-icons/fa6";
import { useParams } from "next/navigation";

// --- Interfaces (No Changes) ---
interface File {
  id: number;
  path: string;
  created_at: string;
  updated_at: string;
}
interface Files {
  id: number;
  committee_id: number;
  file_id: number;
  created_at: string;
  updated_at: string;
  file: File;
}
interface MainData {
  id: number;
  teacher_id: number;
  title: string;
  year: string;
  type: string;
  created_at: string;
  updated_at: string;
  files: Files[];
}
interface Response {
  total: number;
  page: number;
  limit: number;
  data: MainData[];
}

// --- Skeleton Component (No Changes) ---
const SkeletonCard = () => (
  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full animate-pulse">
    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
      <div className="w-10 h-10 rounded-lg bg-gray-300" />
      <div className="flex_start flex-col">
        <div className="h-4 bg-gray-300 rounded w-32 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
    </div>
    <div className="flex_start w-full gap-5 lg:flex-row flex-col">
      <div className="flex_start flex-col w-full">
        <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
        <div className="h-8 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
);

// --- Spinner Component ---
const SpinnerIcon = () => (
  <div className="flex_center w-6 h-6">
    <svg
      className="animate-spin h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

interface Props {
  teacherId: string;
}

const Committees = ({ teacherId }: Props) => {
  const t = useTranslations("AcademicStaff");
  const [committees, setCommittees] = useState<MainData[]>([]);
  const [page, setPage] = useState(1);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );
  const limit = 10;
  const locale = useParams()?.locale as string;

  const { data, loading, error, refetch } = useFetch<Response>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/teachers/${teacherId}/committees?page=${page}&limit=${limit}`,
    locale
  );

  useEffect(() => {
    if (data?.data) {
      setCommittees((prev) => [...prev, ...data.data]);
    }
  }, [data]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, " - ");
  };

  const getFileName = (filePath: string) => {
    try {
      return new URL(filePath).pathname.split("/").pop() || "download";
    } catch {
      return filePath.split("/").pop() || "download";
    }
  };

  const handleFileDownload = async (filePath: string) => {
    if (!filePath) return;
    setDownloadingFiles((prev) => new Set(prev).add(filePath));
    try {
      const fileUrl = new URL(filePath, process.env.NEXT_PUBLIC_API_URL).href;
      const res = await fetch(fileUrl, { mode: "cors" });
      if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const fileName = getFileName(filePath);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error("Download failed:", e);
      window.open(
        new URL(filePath, process.env.NEXT_PUBLIC_API_URL).href,
        "_blank"
      ); // Fallback
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(filePath);
        return newSet;
      });
    }
  };

  return (
    <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
      <SubHeader title={t("committees")} alt={false} />

      <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
        {loading && !data
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : committees.map((item) => (
              <div
                key={item.id}
                className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full"
              >
                <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                  <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                    <FaUsers className="text-2xl" />
                  </div>
                  <div className="flex_start flex-col">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <span className="text-black opacity-60 text-xs">
                      {formatDate(item.year)}
                    </span>
                  </div>
                </div>
                <div className="flex_start flex-col w-full">
                  <span className="text-black opacity-60 text-xs">
                    {t("level")}
                  </span>
                  <p className="lg:text-base text-sm">{item.type}</p>
                </div>

                {/* Files Section */}
                <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                  <div className="flex_start flex-col w-full">
                    <span className="text-black opacity-60 text-xs">
                      {t("attachment")}
                    </span>

                    {item.files && item.files.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.files.map((file) => {
                          const filePath = file.file.path;
                          const isDownloading = downloadingFiles.has(filePath);
                          return (
                            <button
                              key={file.id}
                              className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-wait"
                              onClick={() =>
                                !isDownloading && handleFileDownload(filePath)
                              }
                              disabled={isDownloading}
                              title={`Download ${getFileName(filePath)}`}
                            >
                              <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                                {isDownloading ? (
                                  <SpinnerIcon />
                                ) : (
                                  <HiOutlineLink />
                                )}
                              </span>
                              <span className="max-w-[10ch] truncate">
                                {getFileName(filePath)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs mt-1">
                        {t("no_attachments")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>

      {data && committees.length < data.total && (
        <div className="flex_center w-full my-5">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("loading") : t("see_more")}
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center w-full">
          {t("error_loading_data")}
        </div>
      )}

      {!loading && data && committees.length === 0 && (
        <div className="text-gray-500 text-center w-full">
          {t("no_data_found")}
        </div>
      )}
    </div>
  );
};

export default Committees;
