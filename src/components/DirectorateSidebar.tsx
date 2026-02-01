"use client";

import SubUnits from "@/components/SubUnits";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

interface DirectorateSidebarProps {
  activeTab: "about" | "staff" | "centers" | "news";
  id: string;
  parentId: string | null;
  hasParent: boolean;
  isLoading?: boolean;
}

const DirectorateSidebar = ({
  activeTab,
  id,
  parentId,
  hasParent,
  isLoading = false,
}: DirectorateSidebarProps) => {
  const t = useTranslations("Directorate");
  const params = useParams();
  const locale = params?.locale as string;

  const isActive = (tab: string) => activeTab === tab;

  const activeClass =
    "lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-primary border-primary";
  const inactiveClass =
    "lg:w-[250px] w-full lg:h-[45px] sm:h-[60px] h-[45px] flex items-center justify-between border px-3 bg-background sm:rounded-3xl rounded-xl text-secondary opacity-70 border-lightBorder";

  return (
    <div className="flex_start flex-col gap-4 flex-shrink-0 lg:w-[250px] w-full">
      {isActive("about") ? (
        <div className={activeClass}>
          <span>{t("about")}</span>
          <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
        </div>
      ) : (
        <Link
          href={`/${locale}/directorate/${id}?parent_id=${parentId}`}
          title={t("about")}
          className={inactiveClass}
        >
          <span>{t("about")}</span>
          <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
        </Link>
      )}

      {isActive("staff") ? (
        <div className={activeClass}>
          <span>{t("staff")}</span>
          <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
        </div>
      ) : (
        <Link
          href={`/${locale}/directorate/${id}/staff?parent_id=${parentId}`}
          title={t("staff")}
          className={inactiveClass}
        >
          <span>{t("staff")}</span>
          <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
        </Link>
      )}

      <SubUnits />

      {/* Show centers link if it's a parent directorate (hasParent is false or null) AND not loading */}
      {!hasParent &&
        !isLoading &&
        (isActive("centers") ? (
          <div className={activeClass}>
            <span>{t("centers")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </div>
        ) : (
          <Link
            href={`/${locale}/directorate/${id}/centers?parent_id=${parentId}`}
            title={t("centers")}
            className={inactiveClass}
          >
            <span>{t("centers")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
        ))}

      {isActive("news") ? (
        <div className={activeClass}>
          <span>{t("news")}</span>
          <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
        </div>
      ) : (
        <Link
          href={`/${locale}/directorate/${id}/news?parent_id=${parentId}`}
          title={t("news")}
          className={inactiveClass}
        >
          <span>{t("news")}</span>
          <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
};

export default DirectorateSidebar;
