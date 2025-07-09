"use client";
import NewsCard from "@/components/newsCard";
import ResearchModal from "@/components/researchDetail";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";

const Page = () => {
  const t = useTranslations("News");
  const params = useParams();
  const locale = params?.locale as string;
  const id = params?.id as string;

  return (
    <div className="my-10 flex_center w-full flex-col gap-10 lg:px-0 px-3 text-secondary">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />
        <div className="w-full md:h-[470px] h-[220px] relative">
          <Image
            src={`/images/news.png`}
            alt={"name"}
            fill
            priority
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="flex_center gap-2 text-sm">
          <p>Fatima Ali Saeed</p> <span>-</span>{" "}
          <span className="opacity-70">27 Dec 2020</span>
        </div>
        <h1 className="md:text-titleNormal text-base font-semibold">
          The Rector Of The Erbil Polytechnic University Attends The Graduation
          Ceremony Of The Third Course Of Pedagogical Training.
        </h1>
        <span className="lg:text-xl md:text-base text-sm opacity-70">
          Today, Monday, the 8th of July, 2024, Prof. Dr. Edrees Muhamad Tahir
          Harki, the Rector of the Erbil Polytechnic University and Asst. Prof.
          Ranj Sirwan Abdullah, the General Director of the Scientific Research
          Center participated in the graduation ceremony of the third round of
          pedagogical training participants held at the Erbil International
          Hotel. The ceremony was supervised Dr. Aram Mohammed Qadir, the
          Minister of the Higher Education and Scientific Research who was
          present with several presidents of public and private universities,
          ministerial consultants, general directors, directors of pedagogical
          centers, participants of pedagogical training, and (HAMK) University
          of Finland.
        </span>
        <div className="w-full flex_start gap-4 flex-wrap">
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
        </div>
        <h2 className="md:mt-10 mt-0 md:text-titleNormal text-base font-semibold">
          {t("related_news")}
        </h2>
        <div className="relative w-full">
          <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
            <CiSearch />
          </span>
          <input
            type="text"
            className="py-3 w-full border-lightBorder sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
            placeholder={t("search_news_hashtag")}
          />
        </div>
        <div className="w-full flex_start gap-4 flex-wrap">
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
          <span className="bg-backgroundSecondary p-2 rounded-md md:text-base text-xs">
            #Kuridstan
          </span>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8">
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
    </div>
  );
};
export default Page;
