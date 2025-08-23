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
import { FaPlay } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { HiOutlineBuildingOffice, HiOutlineUsers } from "react-icons/hi2";
import { IoLogoYoutube } from "react-icons/io";
import { IoBriefcaseOutline } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";
import useFetch from "@/libs/hooks/useFetch";
import { API_URL } from "@/libs/env";
import { useParams } from "next/navigation";

// -------- Interfaces --------
interface ImageFile {
  lg: string;
}

interface UniversityData {
  description: string;
  student_number: string;
  teacher_number: string;
  academic_number: string;
  staff_member: string;
  research_title: string;
  research_description: string;
  research_paper_publication_number: string;
  research_number: string;
  intro_image: ImageFile;
  research_image: ImageFile;
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

// -------- Skeletons --------
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

export default function Home() {
  const t = useTranslations("IndexPage");
  const locale = useParams()?.locale as string;

  const { data: uniData, loading: uniLoading } = useFetch<UniversityData>(
    `${API_URL}/website/universities`
  );
  const { data: newsData, loading: newsLoading } = useFetch<NewsResponse>(
    `${API_URL}/website/universities/news?page=1&limit=2`
  );
  const { data: eventsData, loading: eventsLoading } = useFetch<EventsResponse>(
    `${API_URL}/website/universities/events?page=1&limit=3`
  );

  const isLoading = uniLoading || newsLoading || eventsLoading;

  const users = [
    { id: 1, name: "Sarah Johnson", avatar: "avatar1", initials: "SJ" },
    { id: 2, name: "Mike Chen", avatar: "avatar2", initials: "MC" },
    { id: 3, name: "Emily Davis", avatar: "avatar3", initials: "ED" },
    { id: 4, name: "Alex Rivera", avatar: "avatar4", initials: "AR" },
  ];
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (isLoading) return <HomeSkeleton />;

  return (
    <div className="flex_center flex-col gap-5 w-full mt-8">
      {/* main section */}
      <div className="relative custom_container sm:px-3 px-5 flex_center">
        <div className="flex_center flex-col sm:gap-5 gap-2 absolute z-10 sm:right-5 right-10 top-1/2 -translate-y-1/2">
          <span className="w-[1px] sm:h-[70px] h-[30px] bg-primary"></span>
          <a href="#" className="sm:text-xl text-base text-primary">
            <AiFillInstagram />
          </a>
          <a href="#" className="sm:text-xl text-base text-primary">
            <CgFacebook />
          </a>
          <a href="#" className="sm:text-xl text-base text-primary">
            <IoLogoYoutube />
          </a>
          <span className="w-[1px] sm:h-[70px] h-[30px] bg-primary"></span>
        </div>
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative rounded-2xl overflow-hidden">
          <Image
            src={uniData?.intro_image.lg || "/images/main-pic.png"}
            alt="Main background"
            fill
            priority
            className="w-full object-cover"
          />
        </div>
        <div className="sm:w-[36%] w-[33%] lg:h-[290px] sm:h-[230px] h-[125px] bg-primary border-8 border-white absolute sm:left-3 left-[4%] bottom-0 sm:rounded-2xl rounded-md flex justify-start items-start sm:p-5 p-2 flex-col lg:gap-8 gap-3">
          <h4 className="text-white opacity-50 font-medium  lg:text-xl sm:text-base text-[8px]">
            {t("in_our_university")}
          </h4>
          <div className="relative">
            <h1 className="lg:text-5xl sm:text-3xl text-xs text-white">
              {t("empower_future")}
            </h1>
            <div className="sm:w-[50px] w-[30px] sm:h-[40px] h-[20px] absolute ltr:lg:right-7 rtl:lg:left-7 ltr:right-0 rtl:left-0 sm:-top-7 -top-5">
              <Image
                src="/images/alumni-shape.svg"
                alt="shape"
                fill
                sizes="100px"
                priority
              />
            </div>
          </div>
          <div className="flex items-center sm:gap-4 gap-2 text-white">
            <div className="flex -space-x-3">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="relative group"
                  style={{ zIndex: users.length - index }}
                >
                  <Image
                    src={`/images/${user.avatar}.png`}
                    alt={user.name}
                    width={46}
                    height={46}
                    className="lg:w-12 sm:w-8 w-5 lg:h-12 sm:h-8 h-5 rounded-full border-3 border-white shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <div className="sm:text-sm text-[8px]">+4,000 {t("alumni")}</div>
          </div>
        </div>
      </div>

      {/* facts section */}
      <div className="custom_container flex-col flex_center gap-5 sm:mt-10 mt-5 sm:px-3 px-5">
        <h1 className="sm:text-title text-xl text-secondary font-semibold">
          {t("facts_about_university")}
        </h1>
        <span className="sm:text-smallParagraph text-xs tracking-normal font-medium max-w-[745px] text-center text-primary opacity-90">
          {uniData?.description}
        </span>
        <div className="sm:mt-5 mt-0 grid sm:grid-cols-4 grid-cols-2 gap-5 w-full max-w-[1000px]">
          <div className="flex_center flex-col gap-4">
            <h1 className="sm:text-title text-2xl text-secondary font-medium">
              {uniData?.student_number}
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
              {uniData?.teacher_number}
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
              {uniData?.academic_number}
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
              {uniData?.staff_member}
            </h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 text-sm rounded-full bg-opacity-20 flex_center">
                <HiOutlineUsers />
              </span>
              <p className="opacity-60">{t("staff_members")}</p>
            </div>
          </div>
        </div>
        <div className="max-w-[1000px] w-full relative sm:mt-20 mt-10">
          <div className="w-full sm:h-[400px] h-[200px] relative rounded-3xl overflow-hidden">
            <button className="flex_center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-20 w-10 sm:h-20 h-10 text-white rounded-full sm:text-xl text-base bg-gradient-to-r from-[#DCC48C] to-[#FFA64D] z-10">
              <FaPlay />
            </button>
            <Image src={`/images/park.png`} alt="park" fill priority />
          </div>
        </div>
      </div>

      {/* latest news */}
      <div className="max-w-[1040px] w-full flex-col flex_start gap-5 mt-14 sm:px-3 px-5">
        <Link
          href={`/${locale}/news`}
          className="flex_center gap-5 text-primary font-semibold"
        >
          <div className="relative">
            <h1 className="sm:text-title text-xl">{t("latest_news")}</h1>
            <span className="absolute ltr:right-0 rtl:left-0 sm:bottom-0 -bottom-2 w-28 h-3">
              <Image src={`/images/title-shape.svg`} alt="park" fill priority />
            </span>
          </div>
          <FaArrowRight className="sm:text-2xl text-xl rtl:rotate-180" />
        </Link>
        <p className="sm:text-smallParagraph text-xs tracking-normal text-primary opacity-90 font-medium">
          {t("latest_news_text")}
        </p>
        <div className="grid sm:grid-cols-2 grid-cols-1 w-full mt-3 gap-5 mb-10">
          {newsData?.data.map((news) => (
            <NewsCard
              key={news.id}
              image={news.cover_image.lg}
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
          className="flex_center gap-5 text-primary font-semibold"
        >
          <div className="relative">
            <h1 className="sm:text-title text-xl">{t("new_events")}</h1>
            <span className="absolute ltr:-right-3 rtl:-left-3 sm:bottom-10 bottom-5 sm:w-14 w-10 h-10">
              <Image src="/images/alumni-shape.svg" alt="park" fill priority />
            </span>
          </div>
          <FaArrowRight className="sm:text-2xl text-xl rtl:rotate-180" />
        </Link>
        <p className="sm:text-paragraph text-xs tracking-normal text-primary opacity-90 font-medium">
          {t("new_events_text")}
        </p>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8">
          {eventsData?.data.map((event) => (
            <EventCard
              key={event.id}
              image={event.galleries[0]?.image.lg || "/images/event.png"}
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
              src={uniData?.research_image.lg || "/images/research.png"}
              alt="Research"
              fill
              priority
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[35%] w-full flex justify-end items-start flex-col gap-5">
          <h1 className="sm:text-title text-xl text-secondary font-semibold">
            {uniData?.research_title}
          </h1>
          <span className="sm:text-smallParagraph text-xs tracking-normal text-secondary max-w-[350px]">
            {uniData?.research_description}
          </span>
          <div className="flex_center gap-10">
            <div className="flex_center flex-col gap-2">
              <h1 className="sm:text-title text-2xl font-bold text-golden">
                {uniData?.research_paper_publication_number}
              </h1>
              <span className="text-secondary text-sm font-medium border-b border-b-lightBorder pb-1">
                {t("research_paper")}
              </span>
            </div>
            <div className="flex_center flex-col gap-2">
              <h1 className="sm:text-title text-2xl font-bold text-golden">
                {uniData?.research_number}
              </h1>
              <span className="text-secondary text-sm font-medium border-b border-b-lightBorder pb-1">
                {t("conference_paper")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Useful links */}
      <UsefulLink />
    </div>
  );
}
