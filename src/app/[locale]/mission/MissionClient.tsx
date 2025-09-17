"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  lg: string;
  original: string;
  media_type: "IMAGE" | "VIDEO";
}

interface UniversityData {
  title: string;
  mission: string;
  vision: string;
  intro_image: ImageFile;
}

// -------- Skeleton Component --------
const PageSkeleton = () => (
  <div className="my-10 flex_center w-full animate-pulse">
    <div className="max-w-[1024px] w-full flex_start flex-col gap-10 sm:px-3 px-5">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] bg-gray-200 rounded-3xl"></div>
      <div className="w-full space-y-4 mt-5">
        <div className="h-10 w-1/3 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      </div>
      <div className="w-full space-y-4 mt-5">
        <div className="h-10 w-1/3 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const MissionClient = () => {
  const t = useTranslations("Mission");
  const videoRef = useRef<HTMLVideoElement>(null);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const { data: uniData, loading: isLoading } = useFetch<UniversityData>(
    `${API_URL}/website/universities`,
    locale
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      },
      {
        threshold: 0.5, // Play when 50% of the video is visible
      }
    );

    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, [uniData]); // Rerun when data is loaded

  if (isLoading) return <PageSkeleton />;
  if (!uniData) return <div>No data found.</div>;

  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] sm:px-3 px-5 w-full flex_start flex-col gap-10">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative rounded-3xl overflow-hidden">
          {uniData?.intro_image?.media_type === "VIDEO" ? (
            <video
              ref={videoRef}
              src={uniData.intro_image.original}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={uniData?.intro_image.lg || "/images/placeholder.svg"}
              alt="University Intro"
              fill
              priority
              className="object-cover"
            />
          )}
        </div>

        {/* Mission Section */}
        <div className="w-full flex flex-col items-start gap-4">
          <h2 className="sm:text-3xl text-2xl z-10 relative font-semibold text-secondary">
            {t("title")}
          </h2>
          <p className="text-secondary text-opacity-80 sm:text-base text-sm leading-relaxed">
            {uniData.mission}
          </p>
        </div>
      </div>
    </div>
  );
};
export default MissionClient;
