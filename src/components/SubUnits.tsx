"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BiMinus } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

// -------- Interfaces --------
interface UnitItem {
  id: number;
  slug: string;
  directorate_type: {
    name: string;
  };
}

interface UnitsResponse {
  total: number;
  data: UnitItem[];
}

// -------- Skeleton Component --------
const SubUnitsSkeleton = () => (
  <div className="lg:w-[250px] w-full h-[45px] bg-gray-200 rounded-3xl animate-pulse"></div>
);

const SubUnits = () => {
  const t = useTranslations("Directorate");
  const params = useParams();
  const locale = params?.locale as string;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parent_id"); // This can be string or null

  // State for the accordion, defaults to open if on a '/units' page
  const [isOpen, setIsOpen] = useState(pathname.includes("/units"));

  // State for pagination
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch units only when parentId is available
  useEffect(() => {
    if (parentId) {
      setIsLoading(true);
      setUnits([]); // Reset on parentId change
      setPage(1);
      fetchUnits(1, parentId);
    } else {
      setIsLoading(false); // If no parentId, stop loading
    }
  }, [parentId]);

  const fetchUnits = async (pageNum: number, pId: string) => {
    if (pageNum > 1) setIsLoadingMore(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/website/directorates?parent_id=${pId}&page=${pageNum}&limit=5`,
        {
          headers: {
            "Content-Type": "application/json",
            "website-language": locale, // Adds the language header
          },
        }
      );
      const newData: UnitsResponse = await res.json();
      if (newData.data) {
        setUnits((prev) =>
          pageNum === 1 ? newData.data : [...prev, ...newData.data]
        );
        setTotal(newData.total);
      }
    } catch (error) {
      console.error("Failed to fetch units", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    // Guard clause to ensure parentId exists before fetching
    if (!parentId) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUnits(nextPage, parentId);
  };

  if (isLoading) return <SubUnitsSkeleton />;
  if (!parentId || units.length === 0) return null; // Don't render if no parentId or no units

  return (
    <div
      className={`lg:w-[250px] flex flex-col w-full border px-3 bg-background sm:rounded-3xl rounded-xl transition-all duration-300 ${
        isOpen
          ? "border-primary max-h-[400px] text-secondary py-3"
          : "text-secondary opacity-70 border-lightBorder lg:h-[45px] sm:h-[60px] h-[45px]"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between h-full ${
          isOpen ? "pb-3" : ""
        }`}
      >
        <span>{t("units")}</span>
        {!isOpen ? <GoPlus /> : <BiMinus />}
      </button>

      <div
        className={`flex flex-col gap-1 w-full overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-3 w-full max-h-[250px] overflow-y-auto pr-2">
          {units.map((unit, index) => (
            <Link
              key={unit.id}
              // Corrected Link: It now correctly passes the UNIT's ID as the next parent_id
              href={`/${locale}/directorate/${unit.slug}/units?parent_id=${unit.id}`}
              title={unit.directorate_type.name}
              className={`w-full gap-3 flex items-center justify-between opacity-70 hover:opacity-100 ${
                index > 0
                  ? "border-t border-t-lightBorder pt-3"
                  : "border-t border-t-lightBorder pt-3"
              }`}
            >
              <span className="max-w-full text-wrap text-sm">
                {unit.directorate_type.name}
              </span>
              <MdKeyboardDoubleArrowRight className="rtl:rotate-180 flex-shrink-0" />
            </Link>
          ))}
        </div>
        {units.length < total && (
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="text-primary text-sm mt-2 disabled:opacity-50"
          >
            {isLoadingMore ? t("loading") : t("see_more")}
          </button>
        )}
      </div>
    </div>
  );
};

export default SubUnits;
