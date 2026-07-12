"use client";

import CenterHeader from "@/components/CenterHeader";
import CenterTabs from "@/components/CenterTabs";
import MapComponent from "@/components/CollegeMapComponent ";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { BsTelephoneFill } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import useSWR from "swr";
// ================= INTERFACES =================
interface CenterResponse {
  id: number;
  slug: string;
  title: string;
  description: string;
  vision: string;
  mission: string;
  created_at: string;
  updated_at: string;
  priority: number;
  contacts: {
    id: number;
    center_id: number;
    type: "EMAIL" | "PHONE";
    value: string;
    created_at: string;
    updated_at: string;
  }[];
  galleries: {
    id: number;
    center_id: number;
    image_id: number;
    created_at: string;
    updated_at: string;
    image: {
      id: number;
      original: string;
      lg: string;
      md: string;
      sm: string;
      created_at: string;
      updated_at: string;
    };
  }[];
  address?: {
    id: number;
    center_id: number;
    latitude: string;
    longitude: string;
    location: string;
    created_at: string;
    updated_at: string;
  } | null;
  Module?: {
    id: number;
    title?: string | null;
    description?: string | null;
    priority: number;
    images: {
      id: number;
      image: { id: number; original: string; lg: string; md: string; sm: string };
    }[];
    items?: { id: number; value?: string | null; priority: number }[];
  }[];
  program_overviews?: {
    id: number;
    key?: string | null;
    value?: string | null;
    priority: number;
  }[];
  program_activities?: {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    value?: string | null;
    priority: number;
    rules?: { id: number; value?: string | null; priority: number }[];
  }[];
}

const Page = () => {
  const t = useTranslations("Centers");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;

  const fetcher = ([url, lang]: [string, string]) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "website-language": lang,
      },
    }).then((res) => res.json());

  const {
    data,
    isLoading: loading,
    error,
  } = useSWR<CenterResponse>(
    slug
      ? [`${process.env.NEXT_PUBLIC_API_URL}/website/centers/${slug}`, locale]
      : null,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60, // 1 hour
      revalidateOnFocus: false,
    },
  );

  const email = data?.contacts.find((c) => c.type === "EMAIL")?.value;
  const phone = data?.contacts.find((c) => c.type === "PHONE")?.value;

  // Overview / Modules / Activities now live inside the About page (their tabs were removed).
  const overviewRows = (data?.program_overviews || []).filter(
    (p) => (p.key && p.key.trim()) || (p.value && p.value.trim()),
  );
  const moduleRows = (data?.Module || []).filter(
    (m) =>
      (m.title && m.title.trim()) ||
      (m.description && m.description.trim()) ||
      (m.images && m.images.length > 0) ||
      (m.items && m.items.length > 0),
  );
  const activityRows = (data?.program_activities || []).filter(
    (a) =>
      (a.value && a.value.trim()) ||
      (a.title && a.title.trim()) ||
      (a.subtitle && a.subtitle.trim()) ||
      (a.description && a.description.trim()) ||
      (a.rules && a.rules.some((r) => r.value && r.value.trim())),
  );

  return (
    <div className="w-full flex justify-center items-start sm:mt-10 mt-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <CenterHeader />

        <CenterTabs locale={locale} slug={slug} active="about" />

        {loading || !data ? (
          <div className="w-full flex_start flex-col gap-10">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="mt-10 pb-10 border-b w-full border-b-lightBorder flex_start flex-col gap-5"
              >
                <div className="h-6 w-40 bg-gray-300 rounded"></div>
                <div className="h-4 w-full max-w-[600px] bg-gray-200 rounded"></div>
                <div className="h-4 w-full max-w-[500px] bg-gray-200 rounded"></div>
              </div>
            ))}
            <div className="flex_center sm:flex-row flex-col gap-10 text-secondary">
              <div className="flex_center gap-3 w-full sm:w-auto">
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                <div className="flex_start flex-col">
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-300 rounded mt-1"></div>
                </div>
              </div>
              <div className="flex_center gap-3 w-full sm:w-auto">
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                <div className="flex_start flex-col">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-300 rounded mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex_start flex-col gap-10">
            {/* description */}
            <div className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
              <h2 className="md:text-3xl relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-[7ch]"></span>
                <span className="z-10 relative">{t("description")}</span>
              </h2>
              {/* <p className="font-medium md:text-base text-sm">{data.mission}</p> */}
              <div
                className="font-medium md:text-base text-sm"
                dangerouslySetInnerHTML={{
                  __html: data.description,
                }}
              />
            </div>
            {/* Vision */}
            <div className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
              <h2 className="md:text-3xl relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-[6ch]"></span>
                <span className="z-10 relative">{t("vision_statement")}</span>
              </h2>
              {/* <p className="font-medium md:text-base text-sm">{data.vision}</p> */}
              <div
                className="font-medium md:text-base text-sm"
                dangerouslySetInnerHTML={{
                  __html: data.vision,
                }}
              />
            </div>

            {/* Mission */}
            <div className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
              <h2 className="md:text-3xl relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-[7ch]"></span>
                <span className="z-10 relative">{t("mission_statement")}</span>
              </h2>
              {/* <p className="font-medium md:text-base text-sm">{data.mission}</p> */}
              <div
                className="font-medium md:text-base text-sm"
                dangerouslySetInnerHTML={{
                  __html: data.mission,
                }}
              />
            </div>

            {/* Pedagogy: single "Program Overview & Modules" — info box on top, modules table below */}
            {slug === "pedagogy-center-1" &&
              (moduleRows.length > 0 || overviewRows.length > 0) && (
                <div className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
                  <h2 className="md:text-3xl relative text-lg font-semibold ">
                    <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-full"></span>
                    <span className="z-10 relative">
                      {t("program_overview_and_modules")}
                    </span>
                  </h2>
                  {/* info box(es) first (Duration / ECTS / Mode / ...) */}
                  {moduleRows.map((m) => (
                    <div
                      key={m.id}
                      className="p-5 flex_start flex-col gap-5 rounded-3xl border border-lightBorder w-full"
                    >
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
                                <span className="leading-relaxed">
                                  {it.value}
                                </span>
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
                  ))}
                  {/* modules table below */}
                  {overviewRows.length > 0 && (
                    <div className="w-full overflow-hidden rounded-2xl border border-lightBorder">
                      <table className="w-full text-sm">
                        <tbody>
                          {overviewRows.map((p, i) => (
                            <tr
                              key={p.id}
                              className={
                                i % 2 === 0
                                  ? "bg-white"
                                  : "bg-backgroundSecondary/50"
                              }
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
              )}

            {/* Program Overview */}
            {slug !== "pedagogy-center-1" && overviewRows.length > 0 && (
              <div className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
                <h2 className="md:text-3xl relative text-lg font-semibold ">
                  <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-full"></span>
                  <span className="z-10 relative">{t("program_overview")}</span>
                </h2>
                <div className="w-full overflow-hidden rounded-2xl border border-lightBorder">
                  <table className="w-full text-sm">
                    <tbody>
                      {overviewRows.map((p, i) => (
                        <tr
                          key={p.id}
                          className={
                            i % 2 === 0 ? "bg-white" : "bg-backgroundSecondary/50"
                          }
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
              </div>
            )}

            {/* Modules */}
            {slug !== "pedagogy-center-1" &&
              moduleRows.length > 0 &&
              moduleRows.map((m) => (
                <div
                  key={m.id}
                  className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5"
                >
                  <h2 className="md:text-3xl relative text-lg font-semibold ">
                    <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-full"></span>
                    <span className="z-10 relative">
                      {m.title && m.title.trim() ? m.title : t("modules")}
                    </span>
                  </h2>
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
              ))}

            {/* Program Activities */}
            {activityRows.length > 0 && (
              <div className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
                <h2 className="md:text-3xl relative text-lg font-semibold ">
                  <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-full"></span>
                  <span className="z-10 relative">{t("program_activities")}</span>
                </h2>
                <div className="w-full flex_start flex-col gap-6">
                  {activityRows.map((a) => {
                    const ruleRows = (a.rules || []).filter(
                      (r) => r.value && r.value.trim(),
                    );
                    const isStructured =
                      (a.title && a.title.trim()) ||
                      (a.subtitle && a.subtitle.trim()) ||
                      (a.description && a.description.trim()) ||
                      ruleRows.length > 0;
                    return (
                      <div key={a.id} className="w-full flex_start flex-col gap-2">
                        {a.title && a.title.trim() && (
                          <h3 className="text-lg font-semibold text-secondary">
                            {a.title}
                          </h3>
                        )}
                        {a.subtitle && a.subtitle.trim() && (
                          <p className="text-sm font-medium text-secondary/70">
                            {a.subtitle}
                          </p>
                        )}
                        {a.description && a.description.trim() && (
                          <p className="text-sm text-secondary/80 whitespace-pre-line">
                            {a.description}
                          </p>
                        )}
                        {ruleRows.length > 0 && (
                          <ul className="list-none w-full flex_start flex-col gap-2 mt-1">
                            {ruleRows.map((r) => (
                              <li
                                key={r.id}
                                className="flex items-start gap-3 text-secondary text-sm"
                              >
                                <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-golden flex-shrink-0" />
                                <span className="leading-relaxed">{r.value}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {!isStructured && a.value && a.value.trim() && (
                          <div className="flex items-start gap-3 text-secondary text-sm">
                            <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-golden flex-shrink-0" />
                            <span className="leading-relaxed">{a.value}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
              <h2 className="md:text-3xl relative text-lg font-semibold ">
                <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-full"></span>
                <span className="z-10 relative">{t("contact")}</span>
              </h2>
              <div className="flex_center sm:flex-row flex-col gap-10 text-secondary">
                {email && (
                  <a href={`mailto:${email}`} className="flex_center gap-3">
                    <IoMdMail className="text-2xl" />
                    <div className="flex_start flex-col">
                      <span className="opacity-70 text-xs">{t("email")}</span>
                      <p className="font-semibold">{email}</p>
                    </div>
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex sm:justify-center justify-start items-center sm:w-auto w-full gap-3"
                  >
                    <BsTelephoneFill className="text-2xl" />
                    <div className="flex_start flex-col">
                      <span className="opacity-70 text-xs">
                        {t("phone_number")}
                      </span>
                      <p className="font-semibold change_direction flex-end flex">
                        {phone}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Location */}
            {data.address &&
              data.address.latitude &&
              data.address.longitude && (
                <div className="sm:mt-10 mt-5 sm:pb-10 pb-5 border-b w-full border-b-lightBorder flex_start flex-col gap-5">
                  <h2 className="md:text-3xl relative text-lg font-semibold ">
                    <span className="absolute ltr:left-0 right-0 bottom-1 h-[40%] bg-golden w-full"></span>
                    <span className="z-10 relative">{t("location")}</span>
                  </h2>
                  <div className="p-5 flex_start flex-col gap-5 rounded-3xl border border-lightBorder w-full overflow-hidden">
                    <div className="flex items-start gap-3 text-secondary">
                      <MdLocationOn
                        size={24}
                        className="text-golden flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm font-medium">
                        {data.address.location}
                      </span>
                    </div>
                    <div className="w-full h-[300px] rounded-xl overflow-hidden">
                      <MapComponent
                        lat={parseFloat(data.address.latitude)}
                        lng={parseFloat(data.address.longitude)}
                        title={data.title}
                        address={data.address.location || ""}
                        zoom={15}
                      />
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
