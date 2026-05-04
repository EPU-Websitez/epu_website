"use client";

import InternationalRelationsHeader from "@/components/InternationalRelationsHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShareAlt,
} from "react-icons/fa";
import { FiArrowRight, FiChevronRight, FiMail } from "react-icons/fi";
import { GoBook } from "react-icons/go";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";

import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------

interface Image {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}

interface Contact {
  id: number;
  type: "EMAIL" | "PHONE" | "ADDRESS" | "WEBSITE" | "SOCIAL_MEDIA";
  value: string;
}

interface InternationalRelation {
  id: number;
  slug: string;
  about: string;
  bg_image: Image;
  bg_title: string;
  bg_description: string;
  contacts: Contact[];
}

interface InternationalRelationResponse {
  total: number;
  page: number;
  limit: number;
  data: InternationalRelation[];
}

interface Gallery {
  id: number;
  image: Image;
}

interface Directorate {
  id: number;
  slug: string;
  title: string;
  directorate_type: {
    name: string;
  };
  galleries: Gallery[];
}

interface DirectoratesResponse {
  total: number;
  data: Directorate[];
}

interface SectionList {
  id: number;
  title: string;
  description: string;
}

interface Section {
  id: number;
  title: string;
  description: string;
  image: Image;
  lists: SectionList[];
}

interface SectionsResponse {
  total: number;
  page: number;
  limit: number;
  data: Section[];
}

// -------- Components --------

const AboutTextSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
  </div>
);

const AccordionSkeleton = () => (
  <div className="w-full h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
);

const ProgramCardSkeleton = () => (
  <div className="w-full h-[180px] bg-gray-200 rounded-3xl animate-pulse"></div>
);

const CardSkeleton = () => (
  <div className="flex flex-col gap-5 bg-gray-200 rounded-lg p-5 h-[150px] animate-pulse"></div>
);

const ListModal = ({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: SectionList | null;
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <IoMdClose size={24} />
        </button>
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="text-xl sm:text-2xl font-bold text-secondary">
            {item.title}
          </h3>
          <div className="h-[1px] w-full bg-lightBorder"></div>
          <p className="text-gray-600 sm:text-base text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const SectionModal = ({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: Section | null;
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative shadow-xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors z-10 bg-white/80 rounded-full p-1"
          aria-label="Close modal"
        >
          <IoMdClose size={24} />
        </button>
        <div className="flex flex-col gap-6 mt-2">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-secondary">
              {item.title}
            </h3>
            <div className="h-[2px] w-20 bg-golden"></div>
          </div>

          {item.image && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
              <img
                src={item.image?.original || item.image?.lg}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex flex-col gap-4">
            <p className="text-gray-700 sm:text-lg text-base leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------- Main Page --------

const Page = () => {
  const t = useTranslations("International");
  const params = useParams();
  const locale = params?.locale as string;

  const [internationalRelationId, setInternationalRelationId] = useState<
    number | null
  >(null);

  // Pagination for Directorates
  const [directoratesPage, setDirectoratesPage] = useState(1);
  const [totalDirectorates, setTotalDirectorates] = useState(0);
  const [allDirectorates, setAllDirectorates] = useState<Directorate[]>([]);
  const [isLoadingMoreDir, setIsLoadingMoreDir] = useState(false);

  // Modal State
  const [selectedListItem, setSelectedListItem] = useState<SectionList | null>(
    null,
  );
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

  const handleOpenModal = (item: SectionList) => {
    setSelectedListItem(item);
    setIsModalOpen(true);
  };

  const handleOpenSectionModal = (section: Section) => {
    setSelectedSection(section);
    setIsSectionModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedListItem(null), 200); // Clear data after animation
  };

  const handleCloseSectionModal = () => {
    setIsSectionModalOpen(false);
    setTimeout(() => setSelectedSection(null), 200);
  };

  // 1. Fetch main International Relations data
  const {
    data: relationData,
    loading: relationLoading,
    error: relationError,
  } = useFetch<InternationalRelationResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/international-relations?page=1&limit=1`,
    locale,
  );

  useEffect(() => {
    if (relationData?.data?.[0]?.id) {
      setInternationalRelationId(relationData.data[0].id);
    }
  }, [relationData]);

  // 2. Fetch Directorates data
  const {
    data: directoratesData,
    loading: directoratesLoading,
    error: directoratesError,
  } = useFetch<DirectoratesResponse>(
    internationalRelationId
      ? `${process.env.NEXT_PUBLIC_API_URL}/website/directorates?international_relations_id=${internationalRelationId}&page=${directoratesPage}&limit=6`
      : "",
    locale,
  );

  useEffect(() => {
    if (directoratesData?.data) {
      setTotalDirectorates(directoratesData.total);
      if (directoratesPage === 1) {
        setAllDirectorates(directoratesData.data);
      } else {
        setAllDirectorates((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const unique = directoratesData.data.filter((d) => !ids.has(d.id));
          return [...prev, ...unique];
        });
      }
      setIsLoadingMoreDir(false);
    }
  }, [directoratesData, directoratesPage]);

  const handleSeeMoreDirectorates = () => {
    setIsLoadingMoreDir(true);
    setDirectoratesPage((prev) => prev + 1);
  };

  // 3. Fetch Sections data
  const {
    data: sectionsData,
    loading: sectionsLoading,
    error: sectionsError,
  } = useFetch<SectionsResponse>(
    internationalRelationId
      ? `${process.env.NEXT_PUBLIC_API_URL}/website/international-relations/international-relation/${internationalRelationId}/sections`
      : "",
    locale,
  );

  const isLoading = relationLoading || directoratesLoading || sectionsLoading;
  const hasError = relationError || directoratesError || sectionsError;
  const mainRelation = relationData?.data?.[0];
  const directorates = directoratesData?.data || [];
  const sections = sectionsData?.data || [];

  if (hasError) {
    return (
      <div className="w-full flex_center my-20">
        <p className="text-red-500">{t("error_loading_data")}</p>
      </div>
    );
  }

  if (!isLoading && !mainRelation) {
    return (
      <div className="w-full flex_center my-20">
        <p>{t("no_data_found")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
        <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
          <SubHeader title={t("international_relations")} alt={false} />
          <InternationalRelationsHeader />
          <h2 className="relative sm:text-[32px] text-lg font-semibold ">
            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
            <span className="z-10 relative">{t("about")}</span>
          </h2>

          {/* About Text */}
          {relationLoading ? (
            <AboutTextSkeleton />
          ) : (
            <div className="w-full flex flex-col gap-6">
              <p className="text-opacity-70 text-secondary text-sm sm:rounded-none rounded-lg sm:border-none border border-lightBorder sm:p-0 p-3">
                {mainRelation?.about}
              </p>
            </div>
          )}

          {/* Directorates Section */}
          {directorates.length > 0 && (
            <div className="flex_center w-full gap-5 mt-5">
              <span className="bg-lightBorder w-full h-[1px]"></span>
              <h3 className="text-secondary text-xl font-medium">
                {t("units")}
              </h3>
              <span className="bg-lightBorder w-full h-[1px]"></span>
            </div>
          )}
          <div className="flex_center flex-col gap-8 w-full">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 w-full">
              {directoratesLoading && directoratesPage === 1 ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : (
                allDirectorates.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/directorate/${item.slug}?parent_id=${item.id}`}
                    title={item.directorate_type?.name}
                    className="flex_start flex-col gap-5 bg-backgroundSecondary rounded-lg p-5"
                  >
                    <h3 className="md:text-lg text-base font-semibold">
                      {item?.title}
                    </h3>
                    <div className="flex w-full justify-between items-center gap-4 text-white">
                      <div className="flex -space-x-3">
                        {item.galleries
                          .slice(0, 4)
                          .map((galleryItem, index) => (
                            <div
                              key={galleryItem.image?.id}
                              className="relative group"
                              style={{ zIndex: item.galleries.length + index }}
                            >
                              <Image
                                src={
                                  galleryItem.image?.original ||
                                  galleryItem.image?.lg
                                }
                                alt={`img-${galleryItem.image?.id}`}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-lg object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/images/placeholder.svg";
                                }}
                              />
                            </div>
                          ))}
                      </div>
                      <div className="w-5 h-5 rounded-full flex_center bg-white">
                        <FiChevronRight className="text-sm text-secondary rtl:rotate-180" />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {!directoratesLoading &&
              allDirectorates.length < totalDirectorates && (
                <button
                  onClick={handleSeeMoreDirectorates}
                  disabled={isLoadingMoreDir}
                  className="bg-primary hover:bg-opacity-90 transition-all text-white px-8 py-2.5 rounded-full disabled:bg-opacity-70 flex_center gap-2"
                >
                  {isLoadingMoreDir ? t("loading") : t("see_more")}
                </button>
              )}
          </div>

          {/* Programs Section */}
          {sections.length > 0 && (
            <div className="flex_center w-full gap-5 mt-5">
              <span className="bg-lightBorder w-full h-[1px]"></span>
              <h3 className="text-secondary text-xl font-medium">
                {t("programs")}
              </h3>
              <span className="bg-lightBorder w-full h-[1px]"></span>
            </div>
          )}
          <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-5">
            {sectionsLoading ? (
              <>
                <ProgramCardSkeleton />
                <ProgramCardSkeleton />
              </>
            ) : (
              sections.map((section) => (
                <div
                  key={section.id}
                  className="flex_start gap-5 rounded-3xl p-5 bg-primary text-white"
                >
                  <button
                    type="button"
                    onClick={() => handleOpenSectionModal(section)}
                    className="flex-shrink-0 text-xl w-10 h-10 rounded-full lg:flex hidden justify-center items-center bg-white text-secondary hover:bg-golden hover:text-white duration-300"
                  >
                    <GoBook />
                  </button>
                  <div className="flex_start flex-col gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => handleOpenSectionModal(section)}
                      className="text-left hover:text-golden transition-colors"
                    >
                      <h3 className="lg:text-xl text-lg font-semibold">
                        {section.title}
                      </h3>
                    </button>
                    {section.lists.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleOpenModal(item)}
                        title={item.title}
                        className="flex items-center gap-3 w-full justify-between hover:text-golden transition-colors text-left"
                      >
                        <div className="flex_center gap-3">
                          <span className="w-[10px] h-[10px] flex-shrink-0 rounded-full bg-golden"></span>
                          <small className="text-xs line-clamp-1">
                            {item.title}
                          </small>
                        </div>
                        <FiArrowRight className="text-golden text-lg rtl:rotate-180 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Static Mobile Navigation */}
          <div className="sm:hidden flex justify-start items-start flex-col gap-4 flex-shrink-0 w-full sm:border-none border-t border-t-lightBorder sm:pt-0 pt-5">
            <div className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
              <span>{t("about")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </div>
            <Link
              href={`/${locale}/international-relations/directory-structure?id=${mainRelation?.id}`}
              title={t("directory_structure")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("directory_structure")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/international-relations/news?id=${mainRelation?.id}`}
              title={t("news")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("news")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/international-relations/office-staff?id=${mainRelation?.id}`}
              title={t("office_staff")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("office_staff")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/international-relations/projects?id=${mainRelation?.id}`}
              title={t("projects")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("projects")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
            <Link
              href={`/${locale}/international-relations/contact?id=${mainRelation?.id}`}
              title={t("contact")}
              className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
            >
              <span>{t("contact")}</span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ListModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedListItem}
      />
      <SectionModal
        isOpen={isSectionModalOpen}
        onClose={handleCloseSectionModal}
        item={selectedSection}
      />
    </>
  );
};
export default Page;
