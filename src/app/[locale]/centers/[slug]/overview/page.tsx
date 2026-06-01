"use client";

import CenterHeader from "@/components/CenterHeader";
import CenterTabs from "@/components/CenterTabs";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import useSWR from "swr";

interface OverviewRow {
  id: number;
  key?: string | null;
  value?: string | null;
  priority: number;
}

interface CenterResponse {
  id: number;
  slug: string;
  title: string;
  program_overviews?: OverviewRow[];
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

  const rows = (data?.program_overviews || []).filter(
    (p) => (p.key && p.key.trim()) || (p.value && p.value.trim()),
  );

  return (
    <div className="w-full flex justify-center items-start sm:mt-10 mt-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <CenterHeader />
        <CenterTabs locale={locale} slug={slug} active="overview" />

        <div className="w-full flex_start flex-col gap-5">
          <h2 className="md:text-3xl relative text-lg font-semibold">
            <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-full"></span>
            <span className="z-10 relative">{t("program_overview")}</span>
          </h2>

          {loading ? (
            <div className="w-full space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <p className="text-secondary/60 text-sm py-8 text-center w-full">
              {t("no_news_found")}
            </p>
          ) : (
            <div className="w-full overflow-hidden rounded-2xl border border-lightBorder">
              <table className="w-full text-sm">
                <tbody>
                  {rows.map((p, i) => (
                    <tr
                      key={p.id}
                      className={i % 2 === 0 ? "bg-white" : "bg-backgroundSecondary/50"}
                    >
                      <td className="py-3 px-4 font-semibold text-secondary w-1/3 align-top">
                        {p.key}
                      </td>
                      <td className="py-3 px-4 text-secondary/80 align-top whitespace-pre-line">
                        {p.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
