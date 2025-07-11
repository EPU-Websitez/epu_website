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

export default function Home() {
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "avatar1",
      initials: "SJ",
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "avatar2",
      initials: "MC",
    },
    {
      id: 3,
      name: "Emily Davis",
      avatar: "avatar3",
      initials: "ED",
    },
    {
      id: 4,
      name: "Alex Rivera",
      avatar: "avatar4",
      initials: "AR",
    },
  ];
  const t = useTranslations("IndexPage");

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
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative">
          <Image
            src="/images/main-pic.png"
            alt="Main background"
            fill
            priority
            className="w-full"
          />
        </div>
        <div className="sm:w-[36%] w-[33%] lg:h-[290px] sm:h-[230px] h-[125px] bg-primary absolute sm:left-0 left-[3%] bottom-0 sm:rounded-2xl rounded-md flex justify-start items-start sm:p-5 p-2 flex-col lg:gap-8 gap-3">
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
                  {/* Fallback initials */}
                  <div className="lg:w-12 sm:w-8 w-5 lg:h-12 sm:h-8 h-5 rounded-full border-3 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white font-semibold text-sm hover:scale-110 transition-transform duration-200 cursor-pointer hidden absolute top-0 left-0">
                    {user.initials}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {user.name}
                  </div>
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
          {t("facts_about_university_text")}
        </span>
        <div className="sm:mt-5 mt-0 grid sm:grid-cols-4 grid-cols-2 gap-5 w-full max-w-[1000px]">
          <div className="flex_center flex-col gap-4">
            <h1 className="sm:text-title text-2xl text-secondary font-semibold">
              + 3.12K
            </h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 text-sm rounded-full bg-opacity-20 flex_center">
                <PiStudent />
              </span>
              <p className="opacity-60">{t("students")}</p>
            </div>
          </div>
          <div className="flex_center flex-col gap-4">
            <h1 className="sm:text-title text-2xl text-secondary font-semibold">
              + 239
            </h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 text-sm rounded-full bg-opacity-20 flex_center">
                <IoBriefcaseOutline />
              </span>
              <p className="opacity-60">{t("teachers")}</p>
            </div>
          </div>
          <div className="flex_center flex-col gap-4">
            <h1 className="sm:text-title text-2xl text-secondary font-semibold">
              + 300
            </h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 text-sm rounded-full bg-opacity-20 flex_center">
                <HiOutlineBuildingOffice />
              </span>
              <p className="opacity-60">{t("academics")}</p>
            </div>
          </div>
          <div className="flex_center flex-col gap-4">
            <h1 className="sm:text-title text-2xl text-secondary font-semibold">
              + 2.4K
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
          <div className="w-full sm:h-[400px] h-[200px] relative">
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
          href={"news"}
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
        <p className="sm:text-paragraph text-xs tracking-normal text-primary opacity-90 font-medium">
          {t("latest_news_text")}
        </p>
        <div className="grid sm:grid-cols-2 grid-cols-1 w-full mt-3 gap-5 mb-10">
          <NewsCard
            image="/images/news.png"
            link="/"
            author="Craig Bator"
            createdAt="27 Dec 2020"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
            title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
          />
          <NewsCard
            image="/images/news.png"
            link="/"
            author="Craig Bator"
            createdAt="27 Dec 2020"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
            title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
          />
        </div>
      </div>
      {/* map section */}
      <MapSection />
      {/* Events section */}
      <div className="max-w-[1040px] w-full flex-col flex_start sm:gap-8 gap-5 mt-10 sm:px-3 px-5">
        <Link
          href={"events"}
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
          <EventCard
            image="/images/event.png"
            link="/"
            type="Computation"
            createdAt="27 Dec 2020"
            time="1:14 PM"
            title="Innovate & Compete: Annual Student Innovation Challenge."
          />
          <EventCard
            image="/images/event.png"
            link="/"
            type="Computation"
            createdAt="27 Dec 2020"
            time="1:14 PM"
            title="Innovate & Compete: Annual Student Innovation Challenge."
          />
          <EventCard
            image="/images/event.png"
            link="/"
            type="Computation"
            createdAt="27 Dec 2020"
            time="1:14 PM"
            title="Innovate & Compete: Annual Student Innovation Challenge."
          />
        </div>
      </div>
      {/* Researchs section */}
      <div className="w-full max-w-[1040px] sm:px-3 px-5 flex justify-between items-center mt-10 md:flex-row flex-col-reverse">
        <div className="flex justify-start items-start md:w-[50%] w-full py-5 flex-shrink-0">
          <div className="lg:w-[500px] w-full lg:h-[390px] md:h-[340px] sm:h-[420px] h-[270px] relative">
            <Image
              src={"/images/research.png"}
              alt="Research"
              fill
              priority
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[35%] w-full flex justify-end items-start flex-col gap-5">
          <h1 className="sm:text-title text-xl text-secondary font-semibold">
            {t("research")}
          </h1>
          <span className="sm:text-smallParagraph text-xs tracking-normal text-secondary max-w-[350px]">
            {t("research_text")}
          </span>
          <div className="flex_center gap-10">
            <div className="flex_center flex-col gap-2">
              <h1 className="sm:text-title text-2xl font-bold text-golden">
                + 2.12k
              </h1>
              <span className="text-secondary text-sm font-medium">
                {t("research_paper")}
              </span>
            </div>
            <div className="flex_center flex-col gap-2">
              <h1 className="sm:text-title text-2xl font-bold text-golden">
                + 1.3k
              </h1>
              <span className="text-secondary text-sm font-medium">
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
