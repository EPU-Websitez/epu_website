"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { HiOutlineInbox } from "react-icons/hi";

interface NoDataProps {
  showButton?: boolean;
  className?: string;
}

const NoData: React.FC<NoDataProps> = ({
  showButton = false,
  className = "",
}) => {
  const t = useTranslations("Common");
  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <div
      className={`flex_center flex-col gap-4 p-6 rounded-3xl bg-background text-secondary ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="w-28 h-28 rounded-full bg-gray-100 flex_center text-4xl text-gray-400">
        <HiOutlineInbox />
      </div>

      <h3 className="text-lg font-medium text-gray-800">{t("no_data_found")}</h3>

      <p className="text-sm text-gray-500 max-w-[36rem] text-center">
        {t("error_description")}
      </p>

      {showButton && (
        <button
          type="button"
          onClick={handleRefresh}
          className="mt-2 inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-95"
        >
          {t("refresh")}
        </button>
      )}
    </div>
  );
};

export default NoData;
