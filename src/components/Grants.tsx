"use client";
import React, { useEffect, useState } from "react";
import SubHeader from "./subHeader";
import { useTranslations } from "next-intl";
import { HiOutlineLink } from "react-icons/hi2";
import { API_URL } from "@/libs/env";
import { PiHandHeart } from "react-icons/pi";
import useSWR from "swr"; // Switched to useSWR for consistency and better caching

// --- INTERFACES ---
// This interface now correctly defines 'achievements' as an object that might contain a 'title'.
interface Achievement {
  id: number;
  grant_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface FileInfo {
  id: number;
  path: string;
}

interface FileEntry {
  id: number;
  file: FileInfo;
}

interface Grant {
  id: number;
  title: string;
  year: string;
  type: string;
  achievements: Achievement | string | null; // Can be an object, a string, or null
  files: FileEntry[];
}

interface GrantsResponse {
  total: number;
  data: Grant[];
}

// --- SKELETON CARD ---
const SkeletonCard = () => (
  <div className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full animate-pulse">
    <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
      <div className="w-10 h-10 rounded-lg bg-gray-300" />
      <div className="flex_start flex-col flex-grow">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
    <div className="flex_start w-full flex-col gap-3">
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
  </div>
);

// --- FETCHER FOR SWR ---
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Props {
  teacherId: string;
  locale?: string;
}

const Grants = ({ teacherId, locale = "en" }: Props) => {
  const t = useTranslations("AcademicStaff");

  const [items, setItems] = useState<Grant[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 6;

  const { data, error, isLoading } = useSWR<GrantsResponse>(
    `${API_URL}/website/teachers/${teacherId}/grants?page=${page}&limit=${limit}`,
    fetcher
  );

  useEffect(() => {
    if (data?.data) {
      // Append new items for "load more" functionality
      setItems((prev) => {
        // Create a Set of existing IDs to prevent duplicates
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = data.data.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
      setTotal(data.total);
      setIsLoadingMore(false);
    }
  }, [data]);

  const handleLoadMore = () => {
    if (items.length < total) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getFileName = (filePath: string) =>
    filePath.split("/").pop() || "download";

  return (
    <div className="lg:border-l lg:pl-10 w-full flex flex-col gap-7">
      <SubHeader title={t("grants")} alt={false} />

      <div className="grid lg:max-w-[710px] w-full lg:grid-cols-2 gap-5">
        {isLoading && items.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-3 rounded-3xl bg-background text-secondary"
              >
                <div className="flex items-center gap-3 border-b border-b-lightBorder pb-4">
                  <div className="w-10 h-10 rounded-lg bg-golden flex-shrink-0 flex_center text-white text-2xl">
                    <PiHandHeart />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <span className="text-black opacity-60 text-xs">
                      {formatDate(item.year)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-black opacity-60 text-xs">
                      {t("type")}
                    </span>
                    <p className="text-sm capitalize">{item.type}</p>
                  </div>

                  {item.files && item.files.length > 0 && (
                    <div className="flex flex-col">
                      <span className="text-black opacity-60 text-xs">
                        {t("attachment")}
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.files.map((fileEntry) => (
                          <a
                            href={fileEntry.file.path}
                            key={fileEntry.id}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-lightBorder rounded-full flex items-center gap-2 px-2 py-1 text-xs hover:bg-gray-50 transition-colors"
                            title={`Download ${getFileName(
                              fileEntry.file.path
                            )}`}
                          >
                            <span className="bg-[#81B1CE] text-white flex_center w-5 h-5 rounded-full">
                              <HiOutlineLink />
                            </span>
                            <span className="max-w-[12ch] truncate">
                              {getFileName(fileEntry.file.path)}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col col-span-full">
                  <span className="text-black opacity-60 text-xs">
                    {t("achievements")}
                  </span>
                  {/* --- THIS IS THE FIX --- */}
                  {item.achievements ? (
                    <p className="text-sm">
                      {typeof item.achievements === "object"
                        ? item.achievements.title
                        : item.achievements}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1">
                      {t("no_achievements")}
                    </p>
                  )}
                </div>
              </div>
            ))}
      </div>

      {items.length < total && (
        <div className="flex_center w-full my-5">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="text-sm border border-primary text-primary px-8 py-2 rounded-lg disabled:opacity-50"
          >
            {isLoadingMore ? t("loading") : t("see_more")}
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center w-full">
          {t("error_loading_grants")}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="text-gray-500 text-center w-full">
          {t("no_grants_found")}
        </div>
      )}
    </div>
  );
};

export default Grants;
