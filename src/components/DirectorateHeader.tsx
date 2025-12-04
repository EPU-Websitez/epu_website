"use client";
import Image from "next/image";
import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";

// 1. Updated Interface to include parent_id
interface Response {
  id: number;
  title: string;
  directorate_type: {
    name: string;
  };
  galleries: {
    id: number;
    image: {
      id: number;
      original: string;
      lg: string;
    };
  }[];
}

const Skeleton = () => (
  <div className="w-full flex justify-center items-start sm:mt-10 mt-6 min-h-screen animate-pulse">
    <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
      <div className="w-full flex_start">
        <div className="h-8 w-40 bg-gray-300 rounded"></div>
      </div>
      <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative sm:mt-14 mt-6 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const DirectorateHeader = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Read query params

  const id = params?.id as string;
  const locale = params?.locale as string;
  const swiperRef = useRef<SwiperCore>();

  const fetcher = ([url, lang]: [string, string]) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "website-language": lang,
      },
    }).then((res) => res.json());

  const { data, error, isLoading } = useSWR<Response>(
    id
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}`,
          locale,
        ]
      : null,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60,
      revalidateOnFocus: false,
    }
  );

  // Logic to validate and update parent_id
  useEffect(() => {
    if (data) {
      // Set Document Title
      document.title = `${data?.title} | EPU`;

      // --- PARENT ID VALIDATION LOGIC ---
      const correctParentId = data.id?.toString();
      const currentParentId = searchParams.get("parent_id");

      // Only proceed if the API actually returned a parent_id
      if (correctParentId) {
        // If the URL param is missing OR if it doesn't match the API data
        if (!currentParentId || currentParentId !== correctParentId) {
          // Create a new URLSearchParams object to avoid mutating the readonly one
          const newParams = new URLSearchParams(searchParams.toString());

          // Update the parameter
          newParams.set("parent_id", correctParentId);

          // Update the URL without reloading the page
          router.replace(`${pathname}?${newParams.toString()}`, {
            scroll: false,
          });
        }
      }
    }
  }, [data, searchParams, pathname, router]);

  if (isLoading || !data) return <Skeleton />;
  if (error)
    return <div className="text-center text-red-500">Failed to load data.</div>;

  return (
    <div className="w-full lg:h-[570px] sm:h-[400px] h-[220px] relative rounded-3xl overflow-hidden">
      {data.galleries.length > 1 ? (
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop={true}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-full h-full"
        >
          {data.galleries.map((slide, index) => (
            <SwiperSlide key={index}>
              <Image
                src={`${slide.image.lg}`}
                alt={`${data.id}`}
                fill
                priority
                className="w-full h-full object-cover rounded-3xl"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.svg";
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="w-full lg:h-[570px] sm:h-[400px] h-[220px] relative rounded-3xl overflow-hidden">
          <Image
            src={data.galleries[0]?.image?.lg || `/images/bg.svg`}
            alt={`bg`}
            fill
            priority
            className="w-full h-full object-cover rounded-3xl"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DirectorateHeader;
