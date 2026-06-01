"use client";

import CenterHeader from "@/components/CenterHeader";
import CenterTabs from "@/components/CenterTabs";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import useSWR from "swr";

interface ActivityRow {
  id: number;
  value?: string | null;
  priority: number;
}

interface CenterResponse {
  id: number;
  slug: string;
  title: string;
  program_activities?: ActivityRow[];
}

const Page = () => {
  const t = useTranslations("Centers");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;

  const fetcher = ([url, lang]: [string, string]) =>
    fetch(url, {
      headers: { "Content-Type": "application/json", "website-language": lang },
    }).then((res) => res.json());

  const { data, isLoading: loading } = useSWR<CenterResponse>(
    slug
      ? [`${process.env.NEXT_PUBLIC_API_URL}/website/centers/${slug}`, locale]
      : null,
    fetcher,
    { dedupingInterval: 1000 * 60 * 60, revalidateOnFocus: false },
  );

  const rows = (data?.program_activities || []).filter(
    (a) => a.value && a.value.trim(),
  );

  return (
    <div className="w-full flex justify-center items-start sm:mt-10 mt-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <CenterHeader />
        <CenterTabs locale={locale} slug={slug} active="activities" />

        <div className="w-full flex_start flex-col gap-5">
          <h2 className="md:text-3xl relative text-lg font-semibold">
            <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-full"></span>
            <span className="z-10 relative">{t("program_activities")}</span>
          </h2>

          {loading ? (
            <div className="w-full space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 w-full bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <p className="text-secondary/60 text-sm py-8 text-center w-full">
              {t("no_news_found")}
            </p>
          ) : (
            <ul className="list-none w-full flex_start flex-col gap-2">
              {rows.map((a) => (
                <li
                  key={a.id}
                  className="flex items-start gap-3 text-secondary text-sm"
                >
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-golden flex-shrink-0" />
                  <span className="leading-relaxed">{a.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
