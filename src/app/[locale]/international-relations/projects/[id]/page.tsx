"use client";

import { useState, useMemo } from "react";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import useFetch from "@/libs/hooks/useFetch";
import { FaPlus, FaFileDownload, FaPlay, FaSearchPlus } from "react-icons/fa";
import { FaXmark, FaCalendarDays } from "react-icons/fa6";
import { formatDate } from "@/libs/formatDate";

// --- START: Types ---
interface Img {
  id: number;
  original: string;
  lg: string | null;
  md: string | null;
  sm: string | null;
  media_type: "IMAGE" | "VIDEO";
}

interface GalleryItem {
  id: number;
  image: Img;
}

interface AttachmentFile {
  id: number;
  path: string;
}

interface Attachment {
  id: number;
  title: string;
  file: AttachmentFile;
}

interface Section {
  id: number;
  project_id: number;
  title: string;
  description: string;
  order_index: number;
  image: Img | null;
}

interface ProjectDetail {
  id: number;
  international_relations_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  image: Img | null;
  gallery: GalleryItem[];
  attachments: Attachment[];
  sections: Section[];
}
// --- END: Types ---

const GALLERY_INLINE_COUNT = 5;

// --- Helper Spinner Component ---
const SpinnerIcon = () => (
  <svg
    className="animate-spin h-4 w-4 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const Page = () => {
  const t = useTranslations("International");
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || "en";
  const projectId = params?.id as string;
  const internationalRelationId = searchParams.get("id");

  // --- State ---
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeGalleryItem, setActiveGalleryItem] =
    useState<GalleryItem | null>(null);
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());

  // --- Data Fetching ---
  const apiUrl = useMemo(() => {
    if (!projectId) return "";
    return `${process.env.NEXT_PUBLIC_API_URL}/website/international-relations/project/${projectId}`;
  }, [projectId]);

  const { data: project, loading } = useFetch<ProjectDetail>(apiUrl, locale);

  // --- Handlers & Helpers ---
  const handleOpenGallery = (item: GalleryItem) => {
    setActiveGalleryItem(item);
    setShowGalleryModal(true);
  };

  const handleDownload = async (url: string, filename: string, id: number) => {
    setDownloadingIds((prev) => new Set(prev).add(id));
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok.");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      a.remove();
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank"); // Fallback
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const getProjectImage = (proj: ProjectDetail | null) => {
    if (!proj) return "/images/placeholder.svg";
    return (
      proj.image?.lg ||
      proj.image?.original ||
      proj.gallery?.[0]?.image?.lg ||
      "/images/placeholder.svg"
    );
  };

  const getSectionImage = (sec: Section) => {
    return sec.image?.lg || sec.image?.original || "/images/placeholder.svg";
  };

  // --- Memos ---
  const allGalleries = project?.gallery ?? [];
  const inlineGalleries = allGalleries.slice(0, GALLERY_INLINE_COUNT);
  const remainingGalleryCount = Math.max(
    0,
    allGalleries.length - GALLERY_INLINE_COUNT,
  );

  return (
    <div className="my-10 flex_center w-full flex-col gap-10 lg:px-0 px-3 text-secondary min-h-screen">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8">
        <SubHeader title={t("project_details")} alt={false} />

        {/* --- Main Project Loading / Rendering --- */}
        {loading ? (
          <>
            <div className="w-full md:h-[470px] h-[220px] bg-gray-200 animate-pulse rounded-2xl" />
            <div className="h-4 bg-gray-300 rounded w-32 mt-4" />
            <div className="h-8 bg-gray-200 rounded w-full max-w-[600px]" />
            <div className="h-4 bg-gray-100 rounded w-full mt-2" />
          </>
        ) : (
          project && (
            <>
              {/* Hero Image */}
              <div className="w-full md:h-[470px] h-[220px] relative">
                <Image
                  src={getProjectImage(project)}
                  alt={project.title}
                  fill
                  priority
                  className="w-full h-full object-cover rounded-2xl shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.svg";
                  }}
                />
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-primary/80 font-medium">
                  <FaCalendarDays />
                  <span>{formatDate(project.created_at, locale)}</span>
                </div>
                <h1 className="md:text-4xl text-2xl font-bold text-secondary">
                  {project.title}
                </h1>
              </div>

              {/* Main Description */}
              {project.description && (
                <div className="prose prose-lg max-w-none text-secondary/80 leading-relaxed border-l-4 border-primary pl-4 py-1">
                  <p>{project.description}</p>
                </div>
              )}

              {/* --- Dynamic Sections --- */}
              {project.sections && project.sections.length > 0 && (
                <div className="w-full mt-10 flex flex-col gap-16">
                  {project.sections.map((section, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <div
                        key={section.id}
                        className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center bg-white p-6 rounded-2xl shadow-sm border border-lightBorder`}
                      >
                        {/* Section Image */}
                        {section.image && (
                          <div className="w-full md:w-1/2 md:h-[350px] h-[250px] relative rounded-xl overflow-hidden shadow-md flex-shrink-0">
                            <Image
                              src={getSectionImage(section)}
                              alt={section.title}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = "/images/placeholder.svg";
                              }}
                            />
                          </div>
                        )}
                        {/* Section Content */}
                        <div
                          className={`w-full md:w-1/2 flex flex-col gap-4 ${!section.image ? "md:w-full" : ""}`}
                        >
                          <h3 className="text-2xl font-bold text-secondary relative w-fit">
                            {section.title}
                            <span className="absolute -bottom-2 ltr:left-0 rtl:right-0 w-1/2 h-1 bg-golden rounded-full"></span>
                          </h3>
                          <p className="text-secondary/80 leading-relaxed mt-2 whitespace-pre-wrap">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* --- Attachments --- */}
              {project.attachments && project.attachments.length > 0 && (
                <div className="mt-12 w-full">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-primary rounded-full inline-block"></span>
                    {t("attachments")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {project.attachments.map((att) => {
                      const fileName =
                        att.file.path.split("/").pop() || "download";
                      const isDownloading = downloadingIds.has(att.id);
                      return (
                        <button
                          key={att.id}
                          onClick={() =>
                            !isDownloading &&
                            handleDownload(att.file.path, fileName, att.id)
                          }
                          disabled={isDownloading}
                          className="flex items-center gap-3 p-4 bg-backgroundSecondary/50 rounded-xl hover:bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all group disabled:opacity-70 disabled:cursor-wait text-left"
                        >
                          <div className="p-3 bg-white rounded-lg shadow-sm group-hover:bg-primary transition-colors flex-shrink-0">
                            {isDownloading ? (
                              <SpinnerIcon />
                            ) : (
                              <FaFileDownload className="text-primary group-hover:text-white text-xl transition-colors" />
                            )}
                          </div>
                          <span className="font-medium text-secondary group-hover:text-primary transition-colors line-clamp-2">
                            {att.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- Gallery --- */}
              {allGalleries.length > 0 && (
                <div className="mt-12 w-full">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-golden rounded-full inline-block"></span>
                    {t("gallery")}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {inlineGalleries.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => handleOpenGallery(g)}
                        className="relative block w-full aspect-square overflow-hidden rounded-xl shadow-sm group focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2"
                      >
                        {g.image?.media_type === "VIDEO" ? (
                          <video
                            src={g.image?.original}
                            className="w-full h-full object-cover"
                            playsInline
                            muted
                            loop
                          />
                        ) : (
                          <Image
                            src={
                              g.image?.md ||
                              g.image?.lg ||
                              g.image?.original ||
                              "/images/placeholder.svg"
                            }
                            alt="Gallery thumbnail"
                            fill
                            sizes="150px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = "/images/placeholder.svg";
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex_center">
                          {g.image?.media_type === "VIDEO" ? (
                            <FaPlay className="text-white text-3xl drop-shadow-lg" />
                          ) : (
                            <FaSearchPlus className="text-white text-3xl drop-shadow-lg" />
                          )}
                        </div>
                      </button>
                    ))}
                    {remainingGalleryCount > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenGallery(
                            allGalleries[inlineGalleries.length],
                          )
                        }
                        className="relative w-full aspect-square rounded-xl border border-lightBorder flex_center bg-backgroundSecondary/50 hover:bg-lightBorder/40 transition-colors shadow-sm"
                        aria-haspopup="dialog"
                        aria-expanded={showGalleryModal}
                        title={t("see_all")}
                      >
                        <div className="flex_center flex-col gap-2 text-primary">
                          <FaPlus className="text-2xl" />
                          <span className="text-base font-semibold">
                            +{remainingGalleryCount} {t("more")}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>

      {/* --- Gallery Modal (Reused from News) --- */}
      {showGalleryModal && activeGalleryItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowGalleryModal(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div
            className="relative bg-white text-secondary w-full max-w-4xl h-full max-h-[90vh] rounded-2xl shadow-2xl p-4 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0 border-b border-lightBorder pb-2">
              <h4 className="text-xl font-bold">{t("gallery")}</h4>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="p-2 rounded-lg hover:bg-lightBorder/40 text-secondary/70 hover:text-red-500 transition-colors"
                aria-label="close modal"
              >
                <FaXmark className="text-xl" />
              </button>
            </div>

            {/* Main Content */}
            <div className="relative sm:flex-grow flex-grow-0 h-[300px] w-full bg-black/5 rounded-xl flex items-center justify-center overflow-hidden">
              {activeGalleryItem.image.media_type === "VIDEO" ? (
                <video
                  key={activeGalleryItem.id}
                  src={activeGalleryItem.image.original}
                  className="max-w-full max-h-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <Image
                  key={activeGalleryItem.id}
                  src={activeGalleryItem.image.original}
                  alt="Gallery full view"
                  fill
                  className="object-contain"
                  sizes="90vw"
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.svg";
                  }}
                />
              )}
              {/* Optional Download button can remain here */}
            </div>

            {/* Thumbnails */}
            <div className="flex-shrink-0">
              <div className="flex overflow-x-auto gap-3 py-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {allGalleries.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGalleryItem(g)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ring-2 transition-all ${
                      activeGalleryItem.id === g.id
                        ? "ring-primary scale-95 opacity-100"
                        : "ring-transparent hover:ring-primary/50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {g.image.media_type === "VIDEO" ? (
                      <video
                        src={g.image.original}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={
                          g.image.sm ||
                          g.image.original ||
                          "/images/placeholder.svg"
                        }
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
