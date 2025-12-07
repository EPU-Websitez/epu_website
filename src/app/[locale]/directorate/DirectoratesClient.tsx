"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { FiChevronRight } from "react-icons/fi";

import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}

interface Gallery {
  id: number;
  image: ImageFile;
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

interface DirectorateType {
  id: number;
  name: string;
  priority: number;
  directorates_count: number;
}

interface DirectoratesTypeResponse {
  total: number;
  data: DirectorateType[];
}

// -------- Skeletons --------
const HeroSkeleton = () => (
  <div className="w-full lg:h-[570px] sm:h-[400px] h-[300px] bg-gray-200 animate-pulse rounded-3xl"></div>
);

const CardSkeleton = () => (
  <div className="flex flex-col gap-5 bg-gray-200 rounded-lg p-5 h-[150px] animate-pulse"></div>
);

const TabsSkeleton = () => (
  <div className="flex justify-center items-center lg:w-[920px] w-full lg:h-[55px] h-[55px] relative bg-gray-200 animate-pulse rounded-3xl"></div>
);

// -------- Main Component --------
const DirectoratesClient = () => {
  const t = useTranslations("Directorate");
  const params = useParams();
  const locale = params?.locale as string;

  // --- State Management ---
  const [directorateTypes, setDirectorateTypes] = useState<DirectorateType[]>(
    []
  );
  const [activeTypeId, setActiveTypeId] = useState<number | null>(null);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  // --- Loading States ---
  const [typesLoading, setTypesLoading] = useState(true);
  const [directoratesLoading, setDirectoratesLoading] = useState(true);
  const [isSwitchingTabs, setIsSwitchingTabs] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // --- API Fetching ---
  const { data: typesData } = useFetch<DirectoratesTypeResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/types/list?page=1&limit=4`,
    locale
  );

  const { data: directoratesData } = useFetch<DirectoratesResponse>(
    activeTypeId
      ? `${process.env.NEXT_PUBLIC_API_URL}/website/directorates?page=${page}&limit=8&directorate_type_id=${activeTypeId}`
      : "",
    locale
  );

  // --- Effects to Process Data ---
  useEffect(() => {
    if (typesData?.data) {
      const sortedTypes = [...typesData.data].sort(
        (a, b) => a.priority - b.priority
      );
      setDirectorateTypes(sortedTypes);
      if (sortedTypes.length > 0) {
        setActiveTypeId(sortedTypes[0].id);
      }
      setTypesLoading(false);
    }
  }, [typesData]);

  useEffect(() => {
    setDirectoratesLoading(true);
    if (directoratesData?.data) {
      if (page === 1) {
        setDirectorates(directoratesData.data);
        if (directoratesData.data[0]?.galleries?.[0]?.image.lg) {
          setHeroImage(directoratesData.data[0].galleries[0].image.lg);
        } else if (directoratesData.data.length === 0) {
          setHeroImage(null);
        }
      } else {
        setDirectorates((prev) => [...prev, ...directoratesData.data]);
      }
      setTotal(directoratesData.total);
    }
    setDirectoratesLoading(false);
    setIsSwitchingTabs(false);
    setIsLoadingMore(false);
  }, [directoratesData, page]);

  // --- Handlers ---
  const handleTab = (newTypeId: number) => {
    if (activeTypeId === newTypeId) return;
    setActiveTypeId(newTypeId);
    setPage(1);
    setDirectorates([]);
    setIsSwitchingTabs(true);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setPage((prev) => prev + 1);
  };

  // --- Memoized values for dynamic styling ---
  const activeTabIndex = useMemo(() => {
    if (!activeTypeId) return 0;
    return directorateTypes.findIndex((type) => type.id === activeTypeId);
  }, [activeTypeId, directorateTypes]);

  const tabWidth = 100 / (directorateTypes.length || 1);

  const initialContentLoading = typesLoading && directoratesLoading;
  const showNoDataMessage =
    !isSwitchingTabs && !directoratesLoading && directorates.length === 0;

  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("university_directory")} alt={false} />

        {initialContentLoading ? (
          <HeroSkeleton />
        ) : (
          <div className="w-full lg:h-[570px] sm:h-[400px] h-[300px] relative">
            <Image
              src={heroImage || "/images/directorate.jpg"}
              alt="University Directorate"
              fill
              priority
              className="w-full h-full rounded-3xl object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          </div>
        )}

        <div className="w-full flex_center flex-col gap-10 text-secondary">
          {typesLoading ? (
            <TabsSkeleton />
          ) : (
            <div className="flex justify-center items-center lg:w-[920px] w-full lg:h-[55px] h-auto relative bg-lightBorder rounded-3xl overflow-hidden flex-wrap">
              {locale === "en" ? (
                <span
                  className="bg-primary duration-300 text-white absolute top-0 h-full rounded-3xl ltr:left-0 rtl:right-0 transition-all"
                  style={{
                    width: `${tabWidth}%`,
                    left: `calc(${activeTabIndex} * ${tabWidth}%)`,
                    right: `auto`,
                  }}
                ></span>
              ) : (
                <span
                  className="bg-primary duration-300 text-white absolute top-0 h-full rounded-3xl ltr:left-0 rtl:right-0 transition-all"
                  style={{
                    width: `${tabWidth}%`,
                    right: `calc(${activeTabIndex} * ${tabWidth}%)`,
                    left: `auto`,
                  }}
                ></span>
              )}
              {directorateTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTab(type.id)}
                  className="flex_center text-wrap lg:text-base text-xs z-10 text-center h-[55px] transition-colors"
                  style={{ width: `${tabWidth}%` }}
                >
                  <span
                    className={
                      activeTypeId === type.id
                        ? "text-white"
                        : "text-secondary opacity-70"
                    }
                  >
                    {type.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 w-full">
            {isSwitchingTabs
              ? [...Array(8)].map((_, i) => <CardSkeleton key={i} />)
              : directorates.map((item) => (
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
                              style={{ zIndex: item.galleries.length - index }}
                            >
                              <Image
                                src={galleryItem.image?.lg}
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
                ))}
          </div>

          {showNoDataMessage && (
            <div className="w-full text-center py-10 text-gray-500">
              <p>{t("no_data_found")}</p>
            </div>
          )}

          {!isSwitchingTabs && directorates.length < total && (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-primary text-white px-6 py-2 rounded-full disabled:bg-opacity-70"
            >
              {isLoadingMore ? t("loading") : t("see_more")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default DirectoratesClient;
