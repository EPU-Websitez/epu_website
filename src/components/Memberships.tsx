"use client";
import React, { useEffect, useState } from "react";
import SubHeader from "./subHeader";
import NoData from "./NoData";
import { useTranslations } from "next-intl";
import { BsBarChart } from "react-icons/bs";
import { HiOutlineLink } from "react-icons/hi2";

import useFetch from "@/libs/hooks/useFetch";
import { PiSealCheck } from "react-icons/pi";
import { FaUsers } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { useParams } from "next/navigation";

// Interfaces
interface File {
  id: number;
  path: string;
  created_at: string;
  updated_at: string;
}

interface Files {
  id: number;
  memberships_id: number;
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
  level: string;
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

// Skeleton Component
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

interface Props {
  teacherId: string;
}

const Memberships = ({ teacherId }: Props) => {
  const t = useTranslations("AcademicStaff");
  const [items, setItems] = useState<MainData[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const locale = useParams()?.locale as string;

  const { data, loading, error, refetch } = useFetch<Response>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/teachers/${teacherId}/memberships?page=${page}&limit=${limit}`,
    locale
  );

  useEffect(() => {
    if (data?.data) {
      setItems((prev) => [...prev, ...data.data]);
    }
  }, [data]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  // Extract filename from path
  const getFileName = (filePath: string) => {
    const parts = filePath.split("/");
    return parts[parts.length - 1];
  };

  // Handle file download
  const handleFileDownload = (filePath: string) => {
    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/${filePath}`;
    const fileName = getFileName(filePath);

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="lg:border-l border-l-none lg:border-b-0 border-b border-black border-opacity-30 lg:pl-10 pb-10 flex_start flex-col gap-7 w-full">
      <SubHeader title={t("memberships")} alt={false} />

      {/* Dynamic Data Grid */}
      <div className="grid lg:max-w-[710px] max-w-full lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full lg:gap-8 gap-5">
        {loading && !data
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((item) => (
              <div
                key={item.id}
                className="flex_start flex-col gap-3 p-3 rounded-3xl bg-background text-secondary w-full"
              >
                <div className="flex_start gap-3 border-b border-b-lightBorder pb-4 w-full">
                  <div className="w-10 h-10 rounded-lg bg-golden flex_center text-white text-xl">
                    <FiUser className="text-2xl" />
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
                  <p className="lg:text-base text-sm">{item.level}</p>
                </div>
                {/* Files Section */}
                {/* <div className="flex_start w-full gap-5 lg:flex-row flex-col">
                  <div className="flex_start flex-col w-full">
                    <span className="text-black opacity-60 text-xs">
                      {t("attachment")}
                    </span>

                    {item.files && item.files.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.files.map((file) => (
                          <button
                            key={file.id}
                            className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm hover:bg-gray-50 transition-colors"
                            onClick={() =>
                              handleFileDownload(file.file.path)
                            }
                            title={`Download ${getFileName(
                              file.file.path
                            )}`}
                          >
                            <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                              <HiOutlineLink />
                            </span>
                            <span>{getFileName(file.file.path)}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs mt-1">
                        {t("no_attachments")}
                      </span>
                    )}
                  </div>
                </div> */}
              </div>
            ))}
      </div>

      {/* Load More Button */}
      {data && items.length < data.total && (
        <div className="flex_center w-full my-5">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg"
          >
            {loading ? t("loading") : t("see_more")}
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="w-full flex_center">
          <NoData showButton={true} className="my-10" />
        </div>
      )}

      {/* No Data State */}
      {!loading && data && items.length === 0 && (
        <div className="w-full flex_center">
          <NoData showButton={false} />
        </div>
      )}
    </div>
  );
};

export default Memberships;
