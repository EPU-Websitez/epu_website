"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

type CenterTab =
  | "about"
  | "overview"
  | "modules"
  | "activities"
  | "staff"
  | "news";

interface Props {
  locale: string;
  slug: string;
  active: CenterTab;
}

export default function CenterTabs({ locale, slug, active }: Props) {
  const t = useTranslations("Centers");
  const base = `/${locale}/centers/${slug}`;

  const tabs: { id: CenterTab; href: string; label: string }[] = [
    { id: "about", href: base, label: t("about") },
    { id: "overview", href: `${base}/overview`, label: t("overview") },
    { id: "modules", href: `${base}/modules`, label: t("modules") },
    { id: "activities", href: `${base}/activities`, label: t("activities") },
    { id: "staff", href: `${base}/staff`, label: t("staff") },
    { id: "news", href: `${base}/news`, label: t("news") },
  ];

  return (
    <div className="md:w-[920px] w-full sm:my-10 my-5 grid grid-cols-3 sm:grid-cols-6 justify-center items-stretch bg-lightBorder text-secondary rounded-3xl overflow-hidden">
      {tabs.map((tab) =>
        tab.id === active ? (
          <p
            key={tab.id}
            className="bg-primary text-white rounded-3xl sm:py-3 py-2.5 flex_center sm:text-base text-xs font-medium"
          >
            {tab.label}
          </p>
        ) : (
          <Link
            key={tab.id}
            href={tab.href}
            title={tab.label}
            className="opacity-70 hover:opacity-100 sm:py-3 py-2.5 flex_center sm:text-base text-xs font-medium transition-opacity"
          >
            {tab.label}
          </Link>
        ),
      )}
    </div>
  );
}
