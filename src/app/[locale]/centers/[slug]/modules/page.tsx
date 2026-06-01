"use client";

import CenterHeader from "@/components/CenterHeader";
import CenterTabs from "@/components/CenterTabs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import useSWR from "swr";

interface ModuleImage {
  id: number;
  image: { id: number; original: string; lg: string; md: string; sm: string };
}

interface ModuleItem {
  id: number;
  value?: string | null;
  priority: number;
}

interface ModuleSection {
  id: number;
  title?: string | null;
  description?: string | null;
  priority: number;
  images: ModuleImage[];
  items?: ModuleItem[];
}

interface CenterResponse {
  id: number;
  slug: string;
  title: string;
  Module?: ModuleSection[];
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

  const modules = (data?.Module || []).filter(
    (m) =>
      (m.title && m.title.trim()) ||
      (m.description && m.description.trim()) ||
      (m.images && m.images.length > 0) ||
      (m.items && m.items.length > 0),
  );

  return (
    <div className="w-full flex justify-center items-start sm:mt-10 mt-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <CenterHeader />
        <CenterTabs locale={locale} slug={slug} active="modules" />

        <div className="w-full flex_start flex-col gap-8">
          {loading ? (
            <div className="w-full space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 w-full bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : modules.length === 0 ? (
            <p className="text-secondary/60 text-sm py-12 text-center w-full">
              {t("no_news_found")}
            </p>
          ) : (
            modules.map((m) => (
              <div key={m.id} className="flex_start flex-col gap-5 w-full">
                {m.title && m.title.trim() && (
                  <h2 className="md:text-3xl relative text-lg font-semibold ">
                    <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-full"></span>
                    <span className="z-10 relative">{m.title}</span>
                  </h2>
                )}
                <div className="p-5 flex_start flex-col gap-5 rounded-3xl border border-lightBorder w-full">
                  {m.description && m.description.trim() && (
                    <p className="text-opacity-70 text-secondary text-sm whitespace-pre-line">
                      {m.description}
                    </p>
                  )}
                  {m.items && m.items.length > 0 && (
                    <ul className="list-none w-full flex_start flex-col gap-2">
                      {m.items
                        .filter((it) => it.value && it.value.trim())
                        .map((it) => (
                          <li
                            key={it.id}
                            className="flex items-start gap-3 text-secondary text-sm"
                          >
                            <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-golden flex-shrink-0" />
                            <span className="leading-relaxed">{it.value}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                  {m.images && m.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-[180px] sm:auto-rows-[200px] gap-3 w-full">
                      {m.images.map((it) => (
                        <div
                          key={it.id}
                          className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
                        >
                          <Image
                            src={it.image.lg}
                            alt={m.title || ""}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/images/placeholder.svg";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
