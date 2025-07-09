"use client";
import EventCard from "@/components/eventCards";
import NewsCard from "@/components/newsCard";
import ResearchModal from "@/components/researchDetail";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { CiCalendar, CiMail, CiSearch } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { FaChevronDown, FaClock, FaHourglassEnd } from "react-icons/fa6";
import { MdOutlinePayment } from "react-icons/md";

const Page = () => {
  const t = useTranslations("Events");
  const params = useParams();
  const locale = params?.locale as string;
  const id = params?.id as string;

  return (
    <div className="my-10 flex_center w-full flex-col gap-10 lg:px-0 px-3 text-secondary">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full md:h-[470px] h-[220px] relative">
          <Image
            src={`/images/event.png`}
            alt={"name"}
            fill
            priority
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <h1 className="md:text-titleNormal text-base font-semibold">
          Future Insights: International Conference on Technology and Education.
        </h1>
        <div className="flex items-start justify-between lg:flex-row flex-col gap-5 w-full">
          <p className="lg:w-1/2 w-full opacity-70">
            Today, Monday, the 8th of July, 2024, Prof. Dr. Edrees Muhamad Tahir
            Harki, the Rector of the Erbil Polytechnic University and Asst.
            Prof. Ranj Sirwan Abdullah, the General Director of the Scientific
            Research Center participated in the graduation ceremony of the third
            round of pedagogical training participants held at the Erbil
            International Hotel. The ceremony was supervised Dr. Aram Mohammed
            Qadir, the Minister of the Higher Education and Scientific Research
            who was present with several presidents of public and private
            universities, ministerial consultants, general directors, directors
            of pedagogical centers, participants of pedagogical training, and
            (HAMK) University of Finland.
          </p>
          <div className="bg-backgroundSecondary border border-lightBorder p-5 flex_start flex-col gap-5 rounded-3xl lg:w-auto w-full">
            <h3 className="">{t("location")}</h3>
            <p className="px-3 py-2 text-sm rounded-3xl bg-background border border-lightBorder text-black text-opacity-60">
              cumbpus 1 college technology and building 3 room 4
            </p>
            <div className="w-full h-[235px] relative">
              <Image
                src={`/images/map.png`}
                alt={"name"}
                fill
                priority
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <h3 className="">{t("schedule")}</h3>
            <div className="flex justify-between items-center md:flex-nowrap flex-wrap gap-3 w-full px-3 py-2 rounded-3xl border border-lightBorder bg-white">
              <div className="flex_center gap-3">
                <span className="bg-secondary bg-opacity-30 rounded-full flex_center w-7 h-7">
                  <FaCalendarAlt />
                </span>
                <p className="text-sm text-black text-opacity-60">
                  21 Oct 2024
                </p>
              </div>
              <div className="flex_center gap-3">
                <span className="bg-secondary bg-opacity-30 rounded-full flex_center w-7 h-7">
                  <FaClock />
                </span>
                <p className="text-sm text-black text-opacity-60">02:30 Pm</p>
              </div>
              <div className="flex_center gap-3">
                <span className="bg-secondary bg-opacity-30 rounded-full flex_center w-7 h-7">
                  <FaHourglassEnd />
                </span>
                <p className="text-sm text-black text-opacity-60">2 Days</p>
              </div>
            </div>
            <h3 className="">{t("participant_type")}</h3>
            <div className="flex justify-between items-center gap-3 w-full px-3 py-2 rounded-3xl border border-lightBorder bg-white">
              <div className="flex_center gap-3">
                <span className="bg-secondary bg-opacity-30 rounded-full flex_center w-7 h-7">
                  <MdOutlinePayment />
                </span>
                <p className="text-sm text-black text-opacity-60">Payment</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex_start flex-col gap-8 w-full">
          <h3 className="text-xl font-semibold">{t("speakers")}</h3>
          <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 gap-5 text-secondary text-center">
            <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
              <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
                <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                  <Image
                    src={"/images/president-alt.png"}
                    alt="My Image"
                    fill
                    priority
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-lg font-medium px-5">
                Prof. DR. Nadhim Hassan Aziz
              </h3>
              <span className="opacity-70 mb-3 px-5 text-sm">
                The Director of EPU Language Centre
              </span>
            </div>
            <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
              <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
                <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                  <Image
                    src={"/images/president-alt.png"}
                    alt="My Image"
                    fill
                    priority
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-lg font-medium px-5">
                Prof. DR. Nadhim Hassan Aziz
              </h3>
              <span className="opacity-70 mb-3 px-5 text-sm">
                The Director of EPU Language Centre
              </span>
            </div>
            <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
              <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
                <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                  <Image
                    src={"/images/president-alt.png"}
                    alt="My Image"
                    fill
                    priority
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-lg font-medium px-5">
                Prof. DR. Nadhim Hassan Aziz
              </h3>
              <span className="opacity-70 mb-3 px-5 text-sm">
                The Director of EPU Language Centre
              </span>
            </div>
            <div className="rounded-3xl flex_center flex-col gap-4 border border-lightBorder">
              <div className="sm:w-[120px] w-[80px] mt-5 sm:h-[120px] h-[80px] border-[5px] border-primary rounded-full flex_center">
                <div className="sm:w-[100px] w-[65px] sm:h-[100px] h-[65px] relative">
                  <Image
                    src={"/images/president-alt.png"}
                    alt="My Image"
                    fill
                    priority
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-lg font-medium px-5">
                Prof. DR. Nadhim Hassan Aziz
              </h3>
              <span className="opacity-70 mb-3 px-5 text-sm">
                The Director of EPU Language Centre
              </span>
            </div>
          </div>
          <div className="w-full flex_center gap-5 my-10">
            <h1 className="md:text-titleNormal text-base font-semibold flex-shrink-0">
              {t("may_you_like_these")}
            </h1>
            <span className="w-full h-1 bg-golden"></span>
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8">
            <EventCard
              image="/images/event.png"
              link={`/${locale}/events/1`}
              type="Computation"
              createdAt="27 Dec 2020"
              time="1:14 PM"
              title="Innovate & Compete: Annual Student Innovation Challenge."
            />
            <EventCard
              image="/images/event.png"
              link={`/${locale}/events/1`}
              type="Computation"
              createdAt="27 Dec 2020"
              time="1:14 PM"
              title="Innovate & Compete: Annual Student Innovation Challenge."
            />
            <EventCard
              image="/images/event.png"
              link={`/${locale}/events/1`}
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
