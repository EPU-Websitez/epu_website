"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { API_URL } from "@/libs/env";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}

interface Directorate {
  id: number;
  slug: string;
  directorate_type: {
    name: string;
  };
  galleries: { image: ImageFile }[];
}

interface DirectoratesResponse {
  total: number;
  data: Directorate[];
}

// -------- Granular Skeleton Components --------
const HeroSkeleton = () => (
  <div className="w-full lg:h-[570px] sm:h-[400px] h-[300px] bg-gray-200 animate-pulse rounded-3xl"></div>
);

const CardSkeleton = () => (
  <div className="flex flex-col gap-5 bg-gray-200 rounded-lg p-5 h-[150px] animate-pulse"></div>
);

const Page = () => {
  const t = useTranslations("Directorate");
  const params = useParams();
  const locale = params?.locale as string;

  const [tab, setTab] = useState("administrativeStructure");
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchingTabs, setIsSwitchingTabs] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // NOTE: These IDs are placeholders. Replace with the actual IDs for each directorate type.
  const tabToTypeIdMap: { [key: string]: number } = {
    administrativeStructure: 1,
    scientificStructure: 2,
    studentAffairs: 3,
  };

  const fetchDirectorates = async (pageNum: number, typeId: number) => {
    try {
      const res = await fetch(
        `${API_URL}/website/directorates?page=${pageNum}&limit=8&directorate_type_id=${typeId}`
      );
      const newData: DirectoratesResponse = await res.json();

      if (newData.data) {
        // Set hero image only once on the very first load
        if (!heroImage && newData.data[0]?.galleries[0]?.image.lg) {
          setHeroImage(newData.data[0].galleries[0].image.lg);
        }
        setDirectorates((prev) =>
          pageNum === 1 ? newData.data : [...prev, ...newData.data]
        );
        setTotal(newData.total);
      }
    } catch (error) {
      console.error("Failed to fetch directorates", error);
    } finally {
      setIsLoading(false);
      setIsSwitchingTabs(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDirectorates(1, tabToTypeIdMap[tab]);
  }, []);

  const handleTab = (newTab: string) => {
    if (tab === newTab) return;
    setTab(newTab);
    setPage(1);
    setDirectorates([]);
    setIsSwitchingTabs(true);
    fetchDirectorates(1, tabToTypeIdMap[newTab]);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setIsLoadingMore(true);
    fetchDirectorates(nextPage, tabToTypeIdMap[tab]);
  };

  const users = [
    { id: 1, name: "Sarah Johnson", avatar: "avatar1", initials: "SJ" },
    { id: 2, name: "Mike Chen", avatar: "avatar2", initials: "MC" },
    { id: 3, name: "Emily Davis", avatar: "avatar3", initials: "ED" },
    { id: 4, name: "Alex Rivera", avatar: "avatar4", initials: "AR" },
  ];

  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("university_directory")} alt={false} />

        {isLoading ? (
          <HeroSkeleton />
        ) : (
          <div className="w-full lg:h-[570px] sm:h-[400px] h-[300px] relative">
            <Image
              src={heroImage || "/images/directorate.jpg"}
              alt="University Directorate"
              fill
              priority
              className="w-full h-full rounded-3xl object-cover"
            />
          </div>
        )}

        <div className="w-full flex_center flex-col gap-10 text-secondary">
          <div className="flex justify-center items-center lg:w-[920px] w-full lg:h-[55px] h-auto relative bg-lightBorder rounded-3xl overflow-hidden flex-wrap">
            <span
              className={`bg-primary duration-300 text-white absolute ltr:left-0 rtl:right-0 top-0 w-[33.33%] text-wrap h-full rounded-3xl transition-all ${
                tab === "administrativeStructure"
                  ? "ltr:left-0 rtl:right-0"
                  : tab === "scientificStructure"
                  ? "ltr:left-[33.33%] rtl:right-[33.33%]"
                  : "ltr:left-[66.66%] rtl:right-[66.66%]"
              }`}
            ></span>
            <button
              type="button"
              onClick={() => handleTab("administrativeStructure")}
              className={`flex_center w-1/3 text-wrap lg:text-lg text-xs z-10 text-center h-[55px] ${
                tab === "administrativeStructure"
                  ? "text-white"
                  : "text-secondary opacity-70"
              }`}
            >
              {t("administrative_structure")}
            </button>
            <button
              type="button"
              onClick={() => handleTab("scientificStructure")}
              className={`flex_center w-1/3 text-wrap lg:text-lg text-xs z-10 text-center h-[55px] ${
                tab === "scientificStructure"
                  ? "text-white"
                  : "text-secondary opacity-70"
              }`}
            >
              {t("scientific_structure")}
            </button>
            <button
              type="button"
              onClick={() => handleTab("studentAffairs")}
              className={`flex_center w-1/3 text-wrap lg:text-lg text-xs z-10 text-center h-[55px] ${
                tab === "studentAffairs"
                  ? "text-white"
                  : "text-secondary opacity-70"
              }`}
            >
              {t("student_affairs")}
            </button>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 w-full">
            {isSwitchingTabs
              ? [...Array(8)].map((_, i) => <CardSkeleton key={i} />)
              : directorates.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/directorate/${item.slug}?parent_id=${item.id}`}
                    title={item.directorate_type.name}
                    className="flex_start flex-col gap-5 bg-backgroundSecondary rounded-lg p-5"
                  >
                    <h3 className="md:text-lg text-base font-semibold h-14 line-clamp-2">
                      {item.directorate_type.name}
                    </h3>
                    <div className="flex w-full justify-between items-center gap-4 text-white">
                      <div className="flex -space-x-3">
                        {item.galleries.slice(0, 4).map((user, index) => (
                          <div
                            key={user.image.id}
                            className="relative group"
                            style={{ zIndex: item.galleries.length - index }}
                          >
                            <Image
                              src={user.image.lg}
                              alt={`img-${user.image.id}`}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                            />
                            {/* <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                              {user.image.id}
                            </div> */}
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

          {!isLoading && !isSwitchingTabs && directorates.length < total && (
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
export default Page;
