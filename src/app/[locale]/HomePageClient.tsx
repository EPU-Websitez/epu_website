"use client";
import EventCard from "@/components/eventCards";
import MapSection from "@/components/HomeComponents/MapSection";
import NewsCard from "@/components/newsCard";
import UsefulLink from "@/components/usefulLinks";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { AiFillInstagram } from "react-icons/ai";
import { CgFacebook } from "react-icons/cg";
import VideoPlayer from "@/components/VideoPlayer";
import { FaArrowRight } from "react-icons/fa6";
import { HiOutlineBuildingOffice, HiOutlineUsers } from "react-icons/hi2";
import { IoLogoYoutube } from "react-icons/io";
import { IoBriefcaseOutline } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";
import useFetch from "@/libs/hooks/useFetch";

import { useParams } from "next/navigation";

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// -------- Interfaces (No changes here) --------
interface ImageFile {
  lg: string;
  sm: string;
  original: string;
  media_type: "IMAGE" | "VIDEO";
}
interface AlumniFeedback {
  id: string;
  name: string;
  image: { lg: string };
}
interface UniversityData {
  title: string;
  description: any;
  student_number: string;
  teacher_number: string;
  academic_number: string;
  staff_member: string;
  research_title: string;
  research_description: any;
  research_paper_publication_number: string;
  research_number: string;
  intro_image: ImageFile;
  research_image: ImageFile;
  alumni_feedbacks_count: number;
  alumni_feedbacks: AlumniFeedback[];
  research_paper_publication_url: string;
  research_paper_publication_title: string;
  confrance_publication_url: string;
  confrance_publication_number: string;
  confrance_publication_title: string;
  event_description: string;
  news_description: string;
}
interface SliderItem {
  id: number;
  title: string;
  image: ImageFile;
}
interface SlidersResponse {
  data: SliderItem[];
}
interface NewsItem {
  id: number;
  slug: string;
  title: string;
  author: string;
  published_at: string;
  excerpt: string;
  cover_image: ImageFile;
}
interface NewsResponse {
  data: NewsItem[];
}
interface EventItem {
  id: number;
  slug: string;
  title: string;
  created_at: string;
  galleries: { image: ImageFile }[];
  schedule: { time_string: string };
  event_category_event: { event_category: { name: string } }[];
}
interface EventsResponse {
  data: EventItem[];
}

// -------- Video Modal Component (REMOVED) --------

// -------- Skeletons  --------
const HomeSkeleton = () => (
  <div className="flex_center flex-col gap-5 w-full mt-8 animate-pulse">
    <div className="relative custom_container sm:px-3 px-5 w-full">
      <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] bg-gray-200 rounded-2xl"></div>
    </div>
    <div className="custom_container flex-col flex_center gap-5 sm:mt-10 mt-5 sm:px-3 px-5">
      <div className="h-10 w-1/2 bg-gray-200 rounded-full"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded mt-2"></div>
      <div className="grid sm:grid-cols-4 grid-cols-2 gap-5 w-full max-w-[1000px] mt-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

export default function HomePageClient() {
  const t = useTranslations("IndexPage");
  const locale = useParams()?.locale as string;
  const { data: uniData, loading: uniLoading } = useFetch<UniversityData>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/universities`,
    locale,
  );
  const { data: newsData, loading: newsLoading } = useFetch<NewsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/universities/news?page=1&limit=2`,
    locale,
  );
  const { data: eventsData, loading: eventsLoading } = useFetch<EventsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/website/universities/events?page=1&limit=3`,
    locale,
  );
  const { data: slidersData, loading: slidersLoading } =
    useFetch<SlidersResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/website/universities/sliders`,
      locale,
    );

  const isLoading =
    uniLoading || newsLoading || eventsLoading || slidersLoading;

  // --- Prepare Alumni Avatars Data (No changes here) ---
  const alumniAvatars = uniData?.alumni_feedbacks?.slice(0, 4) || [];
  const displayAvatars = [...alumniAvatars];
  while (displayAvatars.length < 4) {
    displayAvatars.push({
      id: `placeholder-${displayAvatars.length}`,
      name: "Alumni",
      image: { lg: "/images/placeholder.svg" },
    });
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatNumber = (numStr: string | undefined) => {
    if (!numStr) return "0";
    const num = parseInt(numStr, 10);
    return isNaN(num) ? numStr : num.toLocaleString(locale);
  };

  if (isLoading) return <HomeSkeleton />;

  return (
    <div className="flex_center flex-col gap-5 w-full mt-2">
      {/* --- CHANGE: Removed Video Modal --- */}

      {/* main section */}
      <div className="relative custom_container sm:px-3 px-5 flex_center flex-col">
        {/* Add flex-col here */}
        {/* Social Icons (No change) */}
        <div className="flex_center flex-col sm:gap-5 gap-2 absolute z-10 sm:right-5 right-10 top-1/2 -translate-y-1/2">
          <span className="w-[1px] sm:h-[70px] h-[30px] bg-primary"></span>
          <a
            href="https://www.instagram.com/epolytechnicuni/?utm_source=ig_profile_share&igshid=17kx2wfoe1i6y"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:text-xl text-base text-primary"
          >
            <AiFillInstagram />
          </a>
          <a
            href="https://www.facebook.com/epu.education/"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:text-xl text-base text-primary"
          >
            <CgFacebook />
          </a>
          <a
            href="https://www.youtube.com/channel/UCJyQu5LoTlqGxxWgGJMQjog/featured"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:text-xl text-base text-primary"
          >
            <IoLogoYoutube />
          </a>
          <span className="w-[1px] sm:h-[70px] h-[30px] bg-primary"></span>
        </div>
        {/* Main container for Swiper and Alumni Box */}
        <div className="relative w-full">
          {" "}
          {/* Added a wrapper div */}
          <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative sm:rounded-3xl rounded-md overflow-hidden">
            <Swiper
              modules={[Pagination, Autoplay]}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{
                clickable: true,
                el: ".hero-swiper-pagination",
              }}
              className="w-full h-full"
            >
              {slidersData?.data.map((slide, index) => (
                <SwiperSlide key={slide.id}>
                  {/* Large Screen Image */}
                  <div className="hidden sm:block w-full h-full relative">
                    <Image
                      src={slide.image?.lg}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.svg";
                      }}
                    />
                  </div>
                  {/* Small Screen Image */}
                  <div className="block sm:hidden w-full h-full relative">
                    <Image
                      src={slide.image?.sm || slide.image?.lg}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      className="w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.svg";
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* Alumni Box (No change) */}
          <div className="card">
            <svg
              className="card__arc_alumni"
              viewBox="0 0 80 80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path d="M 40 80 c 22 0 40 -22 40 -40 v 40 Z" />
            </svg>
          </div>
          <div className="sm:w-[36%] z-10 w-[41%] lg:h-[290px] sm:h-[230px] h-[125px] bg-white absolute left-0 bottom-0 sm:rounded-tr-2xl rounded-tr-xl sm:pt-5 sm:pr-5 pt-2 pr-2">
            {/* ... content of alumni box ... */}
            <div className="flex_start flex-col w-full h-full gap-5 bg-primary sm:p-5 p-2 sm:rounded-3xl rounded-md relative">
              <svg
                className="card__arc_alumni_alt"
                viewBox="0 0 80 80"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path d="M 40 80 c 22 0 40 -22 40 -40 v 40 Z" />
              </svg>
              <h4 className="text-white opacity-50 font-medium  lg:text-xl sm:text-base text-[8px]">
                {t("in_our_university")}
              </h4>
              <div className="relative">
                <h1 className="lg:text-4xl md:text-2xl sm:text-xl text-xs text-white">
                  {uniData?.title}
                </h1>
                <div className="sm:w-[50px] w-[30px] sm:h-[40px] h-[20px] absolute ltr:lg:right-7 rtl:lg:left-7 ltr:right-0 rtl:left-0 sm:-top-7 -top-5">
                  <Image
                    src="/images/alumni-shape.svg"
                    alt="shape"
                    fill
                    sizes="100px"
                    priority
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.svg";
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center sm:gap-4 gap-2 text-white">
                <div className="flex -space-x-3">
                  {displayAvatars.map((alumni, index) => (
                    <div
                      key={alumni.id}
                      className="relative group"
                      style={{ zIndex: displayAvatars.length - index }}
                    >
                      <Image
                        src={alumni.image?.lg}
                        alt={alumni.name}
                        width={46}
                        height={46}
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.svg";
                        }}
                        className="lg:w-12 sm:w-8 w-5 lg:h-12 sm:h-8 h-5 rounded-full border-3 border-white shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="sm:text-sm text-[8px]">
                  +{uniData?.alumni_feedbacks_count || 0} {t("alumni")}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* --- NEW: Custom container for the pagination dots --- */}
        <div className="hero-swiper-pagination !relative !bottom-0 mt-7"></div>
      </div>

      {/* facts section */}
      <div className="custom_container flex-col flex_center gap-5 sm:mt-10 mt-5 sm:px-3 px-5">
        <h1 className="sm:text-title text-xl text-secondary font-semibold">
          {t("facts_about_university")}
        </h1>
        {/* <span className="sm:text-smallParagraph text-xs tracking-normal font-medium max-w-[745px] text-center text-primary opacity-90">
          {uniData?.description}
        </span> */}
        <div
          className="sm:text-smallParagraph text-xs tracking-normal font-medium max-w-[745px] text-center text-primary opacity-90"
          dangerouslySetInnerHTML={{ __html: uniData?.description }}
        />
        <div className="sm:mt-5 mt-0 grid sm:grid-cols-4 grid-cols-2 gap-5 w-full max-w-[1000px]">
          {/* stats numbers (No change) */}
          <div className="flex_center flex-col gap-4">
            <h1 className="sm:text-title text-2xl text-secondary font-medium">
              +{formatNumber(uniData?.student_number)}
            </h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 text-sm rounded-full bg-opacity-20 flex_center">
                <PiStudent />
              </span>
              <p className="opacity-60">{t("students")}</p>
            </div>
          </div>
          <div className="flex_center flex-col gap-4">
            <h1 className="sm:text-title text-2xl text-secondary font-medium">
              +{formatNumber(uniData?.teacher_number)}
            </h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 text-sm rounded-full bg-opacity-20 flex_center">
                <IoBriefcaseOutline />
              </span>
              <p className="opacity-60">{t("teachers")}</p>
            </div>
          </div>
          <div className="flex_center flex-col gap-4">
            <h1 className="sm:text-title text-2xl text-secondary font-medium">
              +{formatNumber(uniData?.academic_number)}
            </h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 text-sm rounded-full bg-opacity-20 flex_center">
                <HiOutlineBuildingOffice />
              </span>
              <p className="opacity-60">{t("academics")}</p>
            </div>
          </div>
          <div className="flex_center flex-col gap-4">
            <h1 className="sm:text-title text-2xl text-secondary font-medium">
              +{formatNumber(uniData?.staff_member)}
            </h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 text-sm rounded-full bg-opacity-20 flex_center">
                <HiOutlineUsers />
              </span>
              <p className="opacity-60">{t("staff_members")}</p>
            </div>
          </div>
        </div>

        {/* --- CHANGE: Replaced Image/Play Button with conditional Video/Image player --- */}
        <div className="max-w-[1000px] w-full relative sm:mt-20 mt-10">
          <div className="w-full sm:h-[400px] h-[200px] relative rounded-3xl overflow-hidden bg-gray-200 group">
            {uniData?.intro_image?.media_type === "VIDEO" ? (
              <VideoPlayer
                src={uniData.intro_image.original}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={uniData?.intro_image?.lg || "/images/placeholder.svg"}
                alt="University Intro"
                fill
                priority
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.svg";
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ... Rest of the component is unchanged ... */}
      {/* latest news */}
      <div className="max-w-[1040px] w-full flex-col flex_start gap-5 mt-14 sm:px-3 px-5">
        <Link
          href={`/${locale}/news`}
          title={t("latest_news")}
          className="flex_center gap-5 text-primary font-semibold"
        >
          <div className="relative">
            <h1 className="sm:text-title text-xl">{t("latest_news")}</h1>
            <span className="absolute ltr:right-0 rtl:left-0 sm:bottom-0 -bottom-2 w-28 h-3">
              <Image
                src={`/images/title-shape.svg`}
                alt="park"
                fill
                priority
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.svg";
                }}
              />
            </span>
          </div>
          <FaArrowRight className="sm:text-2xl text-xl rtl:rotate-180" />
        </Link>
        <p className="sm:text-smallParagraph text-xs tracking-normal text-primary opacity-90 font-medium">
          {uniData?.news_description || t("latest_news_text")}
        </p>
        <div className="grid sm:grid-cols-2 grid-cols-1 w-full mt-3 gap-5 mb-10">
          {newsData?.data.map((news) => (
            <NewsCard
              key={news.id}
              image={news.cover_image?.lg}
              link={`/${locale}/news/${news.slug}`}
              author={news.author}
              createdAt={formatDate(news.published_at)}
              description={news.excerpt}
              title={news.title}
            />
          ))}
        </div>
      </div>

      {/* map section */}
      <MapSection />

      {/* Events section */}
      <div className="max-w-[1040px] w-full flex-col flex_start sm:gap-8 gap-5 mt-10 sm:px-3 px-5">
        <Link
          href={`/${locale}/events`}
          title={t("new_events")}
          className="flex_center gap-5 text-primary font-semibold"
        >
          <div className="relative">
            <h1 className="sm:text-title text-xl">{t("new_events")}</h1>
            <span className="absolute ltr:-right-3 rtl:-left-3 sm:bottom-10 bottom-5 sm:w-14 w-10 h-10">
              <Image
                src="/images/alumni-shape.svg"
                alt="park"
                fill
                priority
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.svg";
                }}
              />
            </span>
          </div>
          <FaArrowRight className="sm:text-2xl text-xl rtl:rotate-180" />
        </Link>
        <p className="sm:text-paragraph text-xs tracking-normal text-primary opacity-90 font-medium">
          {uniData?.event_description || t("new_events_text")}
        </p>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8">
          {eventsData?.data.map((event) => (
            <EventCard
              key={event.id}
              image={event.galleries[0]?.image?.lg || "/images/event.png"}
              link={`/${locale}/events/${event.slug}`}
              type={
                event.event_category_event[0]?.event_category.name || "Event"
              }
              createdAt={formatDate(event.created_at)}
              time={event.schedule?.time_string || ""}
              title={event.title}
            />
          ))}
        </div>
      </div>

      {/* Researchs section */}
      <div className="w-full max-w-[1040px] sm:px-3 px-5 flex justify-between items-center mt-10 md:flex-row flex-col-reverse">
        <div className="flex justify-start items-start md:w-[50%] w-full py-5 flex-shrink-0">
          <div className="lg:w-[500px] w-full lg:h-[390px] md:h-[340px] sm:h-[420px] h-[270px] relative">
            <Image
              src={uniData?.research_image?.lg || "/images/research.png"}
              alt="Research"
              fill
              priority
              className="w-full h-auto object-contain rounded-md"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[35%] w-full flex justify-end items-start flex-col gap-5">
          <h1 className="sm:text-title text-xl text-secondary font-semibold">
            {uniData?.research_title}
          </h1>
          {/* <span className="sm:text-smallParagraph text-xs tracking-normal text-secondary max-w-[350px]">
            {uniData?.research_description}
          </span> */}
          <div
            className="sm:text-smallParagraph text-xs tracking-normal text-secondary max-w-[350px]"
            dangerouslySetInnerHTML={{ __html: uniData?.research_description }}
          />
          <div className="flex_center gap-10">
            <div className="flex_start flex-col gap-2">
              <h2 className="text-sm font-semibold">{t("research_paper")}</h2>
              <h1 className="sm:text-title text-2xl font-bold text-golden">
                {formatNumber(uniData?.research_paper_publication_number)}
              </h1>
              <a
                href={uniData?.research_paper_publication_url}
                rel="noopener noreferrer"
                target="_blank"
                className="text-secondary text-sm font-medium border-b border-b-lightBorder pb-1"
              >
                {uniData?.research_paper_publication_title}
              </a>
            </div>
            <div className="flex_start flex-col gap-2">
              <h2 className="text-sm font-semibold">{t("conference_paper")}</h2>
              <h1 className="sm:text-title text-2xl font-bold text-golden">
                {formatNumber(uniData?.confrance_publication_number)}
              </h1>
              <a
                href={uniData?.confrance_publication_url}
                rel="noopener noreferrer"
                target="_blank"
                className="text-secondary text-sm font-medium border-b border-b-lightBorder pb-1"
              >
                {uniData?.confrance_publication_title}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Useful links */}
      <UsefulLink />
    </div>
  );
}
