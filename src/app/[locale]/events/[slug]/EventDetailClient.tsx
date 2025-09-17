"use client";

import EventCard from "@/components/eventCards";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { FaClock, FaCalendarAlt, FaHourglassEnd } from "react-icons/fa";
import useFetch from "@/libs/hooks/useFetch";
import { API_URL } from "@/libs/env";
import CollegeMapComponent from "@/components/CollegeMapComponent ";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  lg: string;
}
interface GalleryItem {
  id: number;
  image: ImageFile;
}
interface Location {
  location_string: string;
  address: string;
  latitude: string;
  longitude: string;
}
interface Schedule {
  date_string: string;
  time_string: string;
  duration: string;
  payment_type: string;
}
interface Speaker {
  id: number;
  name: string;
  role: string;
}
interface EventCategory {
  id: number;
  name: string;
}

interface EventDetail {
  id: number;
  title: string;
  content: string;
  slug: string;
  galleries: GalleryItem[];
  location: Location;
  schedule: Schedule;
  speakers: Speaker[];
  categories: EventCategory[];
}

interface EventItem {
  id: number;
  slug: string;
  title: string;
  created_at: string;
  galleries: GalleryItem[];
  schedule: { time_string: string };
  categories: EventCategory[];
}
interface EventsResponse {
  data: EventItem[];
}

// -------- Skeletons --------
const PageSkeleton = () => (
  <div className="my-10 flex_center w-full flex-col gap-10 lg:px-0 px-3 text-secondary animate-pulse">
    <div className="max-w-[1040px] w-full flex_start flex-col gap-8">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <div className="w-full md:h-[470px] h-[220px] bg-gray-200 rounded-2xl"></div>
      <div className="h-10 w-2/3 bg-gray-200 rounded-lg"></div>
      <div className="flex items-start justify-between lg:flex-row flex-col gap-5 w-full">
        <div className="lg:w-1/2 w-full space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="lg:w-auto w-full h-96 bg-gray-200 rounded-3xl"></div>
      </div>
    </div>
  </div>
);

const EventDetailClient = () => {
  const t = useTranslations("Events");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const slug = params?.slug as string;

  // Fetch the main event data
  const { data: eventData, loading: eventLoading } = useFetch<EventDetail>(
    slug ? `${API_URL}/website/events/${slug}` : "",
    locale
  );

  // Fetch other events
  const { data: otherEventsData } = useFetch<EventsResponse>(
    `${API_URL}/website/events?page=1&limit=20`,
    locale
  );

  const isLoading = eventLoading || !eventData;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Safely filter and slice similar events
  const similarEvents =
    otherEventsData?.data
      ?.filter((event) => event?.slug !== slug)
      .slice(0, 3) || [];

  const lat = eventData?.location?.latitude
    ? parseFloat(eventData.location.latitude)
    : NaN;
  const lng = eventData?.location?.longitude
    ? parseFloat(eventData.location.longitude)
    : NaN;
  const hasValidCoordinates = !isNaN(lat) && !isNaN(lng);

  return (
    <div className="my-10 flex_center w-full flex-col gap-10 lg:px-0 px-3 text-secondary">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />

        {isLoading ? (
          <PageSkeleton />
        ) : (
          eventData && (
            <>
              <div className="w-full md:h-[470px] h-[220px] relative">
                <Swiper
                  modules={[Pagination]}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  loop={(eventData?.galleries?.length || 0) > 1}
                  className="h-full rounded-2xl"
                >
                  {eventData?.galleries?.map((slide) => (
                    <SwiperSlide key={slide?.id}>
                      <Image
                        src={slide?.image?.lg || "/images/placeholder.svg"}
                        alt={eventData?.title || "Event Image"}
                        fill
                        priority
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="absolute text-sm z-10 ltr:left-10 rtl:right-10 -bottom-4 border border-white bg-blue rounded-xl px-3 py-0.5 text-white">
                  {eventData?.categories?.[0]?.name || "Event"}
                </div>
              </div>

              <h1 className="md:text-titleNormal text-base font-semibold">
                {eventData?.title}
              </h1>

              <div className="flex items-start justify-between lg:flex-row flex-col gap-5 w-full">
                <div
                  className="lg:w-1/2 w-full flex-shrink-0 opacity-70 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: eventData?.content || "",
                  }}
                />

                <div className="bg-backgroundSecondary border border-lightBorder p-5 flex_start flex-col gap-5 md:rounded-3xl rounded-xl lg:w-auto w-full lg:min-w-[400px]">
                  <h3 className="sm:text-xl text-base font-semibold">
                    {t("location")}
                  </h3>
                  <p className="px-3 py-2 text-sm md:rounded-3xl rounded-xl bg-background border border-lightBorder text-black text-opacity-60">
                    {eventData?.location?.address || "Location not specified"}
                  </p>
                  <div className="w-full h-[235px] relative rounded-2xl overflow-hidden">
                    {hasValidCoordinates ? (
                      <CollegeMapComponent
                        lat={lat}
                        lng={lng}
                        title={eventData?.title || "Event Location"}
                        address={
                          eventData?.location?.address ||
                          "Address not available"
                        }
                      />
                    ) : (
                      <Image
                        src={`/images/map.png`}
                        alt={"Map location"}
                        fill
                        priority
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="sm:text-xl text-base font-semibold">
                    {t("schedule")}
                  </h3>
                  <div className="flex justify-between items-center md:flex-nowrap flex-wrap gap-3 w-full px-3 py-2 md:rounded-3xl rounded-xl border border-lightBorder bg-white">
                    <div className="flex_center gap-3">
                      <span className="bg-secondary bg-opacity-30 rounded-full flex_center w-7 h-7 flex-shrink-0">
                        <FaCalendarAlt />
                      </span>
                      <p className="text-sm text-black text-opacity-60">
                        {eventData?.schedule?.date_string || "N/A"}
                      </p>
                    </div>
                    <div className="flex_center gap-3">
                      <span className="bg-secondary bg-opacity-30 rounded-full flex_center w-7 h-7 flex-shrink-0">
                        <FaClock />
                      </span>
                      <p className="text-sm text-black text-opacity-60">
                        {eventData?.schedule?.time_string || "N/A"}
                      </p>
                    </div>
                    <div className="flex_center gap-3">
                      <span className="bg-secondary bg-opacity-30 rounded-full flex_center w-7 h-7 flex-shrink-0">
                        <FaHourglassEnd />
                      </span>
                      <p className="text-sm text-black text-opacity-60">
                        {eventData?.schedule?.duration || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {(eventData?.speakers?.length || 0) > 0 && (
                <div className="flex_start flex-col gap-8 w-full">
                  <h3 className="text-xl font-semibold">{t("speakers")}</h3>
                  <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 gap-5 text-secondary text-center">
                    {eventData?.speakers?.map((speaker) => (
                      <div
                        key={speaker?.id}
                        className="md:rounded-3xl rounded-xl flex_center flex-col gap-4 border border-lightBorder"
                      >
                        <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
                          <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                            <Image
                              src={"/images/placeholder.svg"}
                              alt={speaker?.name || "Speaker"}
                              fill
                              priority
                              className="w-full h-full rounded-full"
                            />
                          </div>
                        </div>
                        <h3 className="text-lg font-medium px-5">
                          {speaker?.name}
                        </h3>
                        <span className="opacity-70 mb-3 px-5 text-sm">
                          {speaker?.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {similarEvents.length > 0 && (
                <>
                  <div className="w-full flex_center gap-5 my-10">
                    <h1 className="md:text-titleNormal text-base font-semibold flex-shrink-0">
                      {t("may_you_like_these")}
                    </h1>
                    <span className="w-full h-1 bg-golden"></span>
                  </div>
                  <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8">
                    {similarEvents.map((event) => (
                      <EventCard
                        key={event?.id}
                        image={
                          event?.galleries?.[0]?.image?.lg ||
                          "/images/event.png"
                        }
                        link={`/${locale}/events/${event?.slug}`}
                        type={event?.categories?.[0]?.name || "Event"}
                        createdAt={formatDate(event?.created_at)}
                        time={event?.schedule?.time_string || ""}
                        title={event?.title}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};
export default EventDetailClient;
