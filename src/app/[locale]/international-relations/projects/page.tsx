"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import useFetch from "@/libs/hooks/useFetch";
import { useEffect, useState, useMemo } from "react";
import InternationalRelationsHeader from "@/components/InternationalRelationsHeader";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import ProjectCard from "@/components/projectCard";
import { formatDate } from "@/libs/formatDate";

// --- Interfaces ---
interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface ProjectItem {
  id: number;
  international_relations_id: number;
  image_id: number;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  image: Image;
}

interface ProjectsResponse {
  total: number;
  page: number;
  limit: number;
  data: ProjectItem[];
}

const Page = () => {
  const t = useTranslations("International");
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get 'id' from the query string, e.g., .../projects?id=6
  const id = searchParams.get("id");

  const locale = params?.locale as string;

  // --- State from URL ---
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // --- Local UI State ---
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);

  // --- Reactive API URL ---
  const apiUrl = useMemo(() => {
    if (!id) return "";
    const urlParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: "12",
    });
    return `${process.env.NEXT_PUBLIC_API_URL}/website/international-relations/international-relation/${id}/projects?${urlParams.toString()}`;
  }, [id, currentPage]);

  // --- Data Fetching ---
  const { data, loading } = useFetch<ProjectsResponse>(apiUrl, locale);
  const isInitialLoading = loading && currentPage === 1;

  // --- Handlers ---
  const handleSeeMore = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", (currentPage + 1).toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // --- Data aggregation ---
  useEffect(() => {
    if (data?.data) {
      setTotalProjects(data.total);
      if (currentPage === 1) {
        setProjects(data.data);
      } else {
        setProjects((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const unique = data.data.filter((d) => !ids.has(d.id));
          return [...prev, ...unique];
        });
      }
    }
  }, [data, currentPage, locale]);

  // --- Helper Functions ---
  const getProjectImage = (project: ProjectItem) => {
    return project.image?.md || "/images/placeholder.svg";
  };

  return (
    <div className="w-full flex justify-center items-start sm:my-10 my-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <InternationalRelationsHeader />

        {/* Projects Section */}
        <div className="flex_start w-full flex-col gap-10 mt-8">
          <h2 className="md:text-3xl relative text-lg font-semibold ">
            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
            <span className="z-10 relative">{t("projects")}</span>
          </h2>

          {isInitialLoading ? (
            <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-gray-100 animate-pulse w-full h-[300px] flex flex-col"
                >
                  <div className="w-full h-40 bg-gray-300 rounded-t-lg" />
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="flex flex-col w-full gap-6">
              {projects.map((item) => (
                <ProjectCard
                  key={item.id}
                  image={getProjectImage(item)}
                  link={`/${locale}/international-relations/projects/${item.id}?id=${id}`}
                  title={item.title}
                  description={item.description}
                  date={formatDate(item.created_at, locale)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center w-full py-10 col-span-2">
              <p className="text-gray-500 text-lg">{t("no_projects_found")}</p>
            </div>
          )}
        </div>

        {!isInitialLoading && projects.length < totalProjects && (
          <div className="flex_center w-full my-5">
            <button
              onClick={handleSeeMore}
              disabled={loading}
              className="sm:text-base text-sm border border-primary px-8 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? t("loading") : t("see_more")}
            </button>
          </div>
        )}
        <div className="sm:hidden flex justify-start items-start flex-col gap-4 flex-shrink-0 w-full mt-4">
          <Link
            href={`/${locale}/international-relations?id=${id}`}
            title={t("about")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("about")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/directory-structure?id=${id}`}
            title={t("directory_structure")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("directory_structure")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/news?id=${id}`}
            title={t("news")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("news")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/office-staff?id=${id}`}
            title={t("office_staff")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("office_staff")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <div className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
            <span>{t("projects")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </div>
          <Link
            href={`/${locale}/international-relations/contact?id=${id}`}
            title={t("contact")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("contact")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
