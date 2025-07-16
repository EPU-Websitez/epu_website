"use client";

import CollegeHeader from "@/components/collegeHeader";
import EventCard from "@/components/eventCards";
import NewsCard from "@/components/newsCard";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowRight, FaChevronRight } from "react-icons/fa6";
import { GoArrowRight, GoBriefcase } from "react-icons/go";
import { IoArrowForwardOutline } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader title={t("header_title")} desc={t("header_desc")} />
      </div>
      <div className="max-w-[1040px] px-3 text-secondary sm:mt-14 mt-10 flex_start flex-col gap-5 w-full">
        <h1 className="lg:text-[50px] md:text-title text-xl text-start font-bold lg:max-w-[840px] md:max-w-[700px] max-w-[90%] relative">
          <span>{t("news")}</span>
          <span className="absolute ltr:left-0 rtl:right-0 sm:-bottom-4 -bottom-1 md:w-[12ch] w-[120px] sm:h-10 h-3">
            <Image
              src={`/images/title-shape.svg`}
              className="object-contain"
              alt="park"
              fill
              priority
            />
          </span>
        </h1>
        <span className="text-sm max-w-[730px] opacity-70 mt-3">{t("news_text")}</span>
        <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
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
        {/* departments */}
        <div className="w-full flex_center gap-10 md:my-24 my-10 md:flex-row flex-col-reverse">
          <div className="grid grid-cols-2 md:gap-10 gap-3 lg:w-1/2 md:w-[60%] w-full flex-shrink-0">
            <div className="relative border border-lightBorder rounded-2xl p-2 flex_center flex-col gap-3 text-center">
              <Link
                href={""}
                className="w-full h-[165px] relative overflow-hidden rounded-2xl"
              >
                <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                  <IoArrowForwardOutline className="rtl:rotate-180" />
                </div>
                <Image
                  src={`/images/campus.png`}
                  className="object-cover"
                  alt="park"
                  fill
                  priority
                />
              </Link>
              <Link href={""} className="sm:text-sm text-[10px] font-semibold">
                Architectural Engineering Department
              </Link>
              <div className="flex_center gap-8 w-full">
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <GoBriefcase />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-semibold sm:text-[10px] text-[8px]">
                      +12.4 K
                    </small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Teachers
                    </small>
                  </div>
                </div>
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <PiStudent />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-semibold sm:text-[10px] text-[8px]">
                      +12.4 K
                    </small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Alumni
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative border border-lightBorder rounded-3xl p-2 flex_center flex-col gap-3 text-center">
              <Link
                href={""}
                className="w-full h-[165px] relative overflow-hidden rounded-3xl"
              >
                <div className="text-secondary bg-white h-4 w-4 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2 text-sm">
                  <IoArrowForwardOutline className="rtl:rotate-180" />
                </div>
                <Image
                  src={`/images/campus.png`}
                  className="object-cover"
                  alt="park"
                  fill
                  priority
                />
              </Link>
              <Link href={""} className="sm:text-sm text-[10px] font-semibold">
                Architectural Engineering Department
              </Link>
              <div className="flex_center gap-8 w-full">
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <GoBriefcase />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-semibold sm:text-[10px] text-[8px]">
                      +12.4 K
                    </small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Teachers
                    </small>
                  </div>
                </div>
                <div className="flex_center gap-2">
                  <div className="w-5 text-xs h-5 rounded-full bg-blue bg-opacity-30 flex_center">
                    <PiStudent />
                  </div>
                  <div className="flex_start flex-col">
                    <small className="font-medium text-xs">+12.4 K</small>
                    <small className="sm:text-[8px] text-[6px] text-black opacity-60">
                      Alumni
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex_start gap-5 flex-col lg:w-1/2 md:w-[40%] w-full">
            <h1 className="md:max-w-[280px] max-w-full leading-snug font-semibold lg:text-title text-titleNormal relative">
              <span>{t("college_departments")}</span>
              <span className="absolute ltr:-right-3 rtl:-left-3 bottom-9 w-14 h-10">
                <Image
                  src="/images/alumni-shape.svg"
                  alt="park"
                  fill
                  priority
                />
              </span>
            </h1>
            <p className="lg:text-base text-sm text-opacity-70">
              {t("college_departments_text")}
            </p>
            <Link
              href={""}
              className="flex_center gap-5 bg-gradient-to-r from-blue to-primary rounded-3xl lg:py-3 text-sm py-2 lg:px-10 px-5 text-white"
            >
              <span>{t("see_all_departments")}</span>
              <FaChevronRight className="text-lg rtl:rotate-180" />
            </Link>
          </div>
        </div>
        <div className="flex_center md:flex-row flex-col gap-10 w-full text-secondary">
          <div className="md:w-1/2 w-full flex_start flex-col gap-10">
            <h1 className="lg:text-title md:text-titleNormal text-xl font-semibold ">
              {t("creating_future")}
            </h1>
            <p className="opacity-70 sm:text-base text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus
              in hac habitasse platea dictumst vestibulum rhoncus est
              pellentesque. Gravida dictum fusce ut placerat.
            </p>
          </div>
          <div className="md:w-1/2 w-full grid grid-cols-2 gap-1">
            <div className="relative w-[152px] h-[152px]">
              <Image
                src={`/images/student-2.png`}
                className="object-cover"
                alt="park"
                fill
                priority
              />
            </div>

            <div className="max-w-[125px] sm:text-smallTitle text-xl relative">
              <div className="absolute w-[30px] h-[30px] ltr:-right-3 rtl:-left-3 -top-7">
              <Image
                src={`/images/star.png`}
                className="object-cover"
                alt="park"
                fill
                priority
              />
            </div>
              {t("great_teacher")}
            </div>
            <div className="max-w-[225px] text-lg text-golden flex justify-center items-center">
              <h1 className="text-start max-w-[125px] -mt-8">{t("useful_labs")}</h1>
            </div>
            <div className="relative sm:w-[200px] w-[152px] sm:h-[200px] h-[152px]">
              <div className="absolute top-5 -left-5 sm:w-[200px] w-[152px] sm:h-[200px] h-[152px] border-4 border-golden rounded-full"></div>
              <Image
                src={`/images/student-1.png`}
                className="object-cover"
                alt="park"
                fill
                priority
              />
            </div>
          </div>
        </div>
        {/* events */}
        <div className="max-w-[1040px] w-full flex-col flex_start gap-8 mt-10 px-3">
          <Link
            href={"events"}
            className="flex_center gap-5 text-primary font-semibold"
          >
            <div className="relative">
              <h1 className="sm:text-title text-2xl">{t("new_events")}</h1>
              <span className="absolute sm:ltr:-right-6 ltr:-right-7 sm:rtl:-left-6 rtl:-left-7 -top-4 w-14 h-10">
                <Image
                  src="/images/alumni-shape.svg"
                  alt="park"
                  fill
                  priority
                />
              </span>
            </div>
            <FaArrowRight className="sm:text-2xl text-xl rtl:rotate-180" />
          </Link>
          <p className="sm:text-paragraph text-sm text-primary font-medium">
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
      </div>
    </div>
  );
};
export default Page;
