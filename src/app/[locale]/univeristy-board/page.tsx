"use client";
import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useEffect } from "react";
import useFetch from "@/libs/hooks/useFetch";
import { API_URL } from "@/libs/env";
import { useParams } from "next/navigation";

// -------- Interfaces --------
interface ImageFile {
  lg: string;
}
interface Teacher {
  id: number;
  full_name: string;
  profile_image: ImageFile;
}
interface BoardMember {
  teacher_id: number;
  role: string;
  teacher: Teacher;
}
interface LeadsResponse {
  data: BoardMember[];
}
interface StaffResponse {
  total: number;
  data: BoardMember[];
}

// -------- Skeletons --------
const PageSkeleton = () => (
  <div className="mb-10 -mt-5 flex_center w-full flex-col animate-pulse">
    <div className="w-full lg:h-[610px] h-[560px] bg-gray-200"></div>
    <div className="max-w-[1024px] w-full flex_center flex-col gap-10 my-10 px-3">
      <div className="h-10 w-1/2 bg-gray-200 rounded-full"></div>
      <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-80 w-full bg-gray-200 rounded-3xl"></div>
        ))}
      </div>
    </div>
  </div>
);

const Page = () => {
  const t = useTranslations("UniversityBoard");
  const locale = useParams()?.locale as string;

  // State for paginated staff members
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch the main lead for the hero section
  const { data: leadsData, loading: leadsLoading } = useFetch<LeadsResponse>(
    `${API_URL}/website/universities/leads`
  );

  useEffect(() => {
    fetchStaff(1);
  }, []);

  const fetchStaff = async (pageNum: number) => {
    if (pageNum > 1) setIsLoadingMore(true);
    try {
      const res = await fetch(
        `${API_URL}/website/universities/staff?page=${pageNum}&limit=6`
      );
      const newData: StaffResponse = await res.json();
      if (newData.data) {
        setMembers((prev) =>
          pageNum === 1 ? newData.data : [...prev, ...newData.data]
        );
        setTotal(newData.total);
      }
    } catch (error) {
      console.error("Failed to fetch staff members:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStaff(nextPage);
  };

  const president = leadsData?.data?.[0];
  const councilMembers = members.filter(
    (member) => member.teacher_id !== president?.teacher_id
  );
  const isLoading = leadsLoading || (members.length === 0 && !isLoadingMore);

  return (
    <div className="mb-10 -mt-5 flex_center w-full flex-col">
      {isLoading ? (
        <PageSkeleton />
      ) : (
        president && (
          <>
            <div className="w-full lg:h-[610px] sm:h-[500px] h-[560px] relative bg-primary flex justify-center items-start">
              <Image
                src="/images/bg.png"
                alt="background"
                fill
                priority
                className="w-full h-auto sm:block hidden"
              />
              <Image
                src="/images/bg-small.png"
                alt="background"
                fill
                priority
                className="w-full h-auto sm:hidden block"
              />
              <div className="max-w-[1024px] w-full flex justify-between items-start sm:gap-10 gap-5 sm:mt-20 mt-10 text-white z-10 px-3 sm:flex-row flex-col">
                <div className="flex_start flex-col sm:gap-10 gap-8">
                  <div className="flex_center gap-3">
                    <span className="w-14 h-[2px] bg-golden rounded-md"></span>
                    <h2 className="text-golden font-medium lg:text-titleNormal sm:text-smallTitle text-base">
                      {t("head")}
                    </h2>
                  </div>
                  <h1 className="max-w-[450px] lg:text-title text-smallTitle font-bold">
                    {president.role}
                  </h1>
                  <h4 className="lg:text-xl text-base sm:block hidden tracking-wide">
                    {president.teacher.full_name}
                  </h4>
                </div>
                <div className="relative lg:w-[520px] sm:w-[396px] w-full lg:h-[465px] sm:h-[330px] h-[225px]">
                  <Image
                    src={president.teacher.profile_image.lg}
                    alt={president.teacher.full_name}
                    fill
                    priority
                    className="w-full h-auto object-cover"
                  />
                </div>
                <h4 className="lg:text-xl text-base sm:hidden block tracking-wide">
                  {president.teacher.full_name}
                </h4>
              </div>
            </div>

            <div className="max-w-[1024px] w-full flex_center flex-col gap-10 my-10 px-3">
              <div className="flex_center gap-5 w-full">
                <div className="w-full h-[1px] bg-primary"></div>
                <h2 className="sm:text-titleNormal text-xl font-medium text-primary text-center flex-shrink-0">
                  {t("council_members")}
                </h2>
                <div className="w-full h-[1px] bg-primary"></div>
              </div>
              <div className="grid w-full lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
                {councilMembers.map((member) => (
                  <MemberCard
                    key={member.teacher_id}
                    description={member.role}
                    image={member.teacher.profile_image.lg}
                    link={`/${locale}/staff/${member.teacher_id}`} // Assuming a staff detail page exists
                    staticText={t("view_profile")}
                    title={member.teacher.full_name}
                  />
                ))}
              </div>
              {members.length < total && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="border border-primary text-primary px-8 py-2 rounded-md disabled:opacity-50"
                >
                  {isLoadingMore ? t("loading") : t("see_more")}
                </button>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default Page;
