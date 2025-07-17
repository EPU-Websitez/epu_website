"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { useRef, useState } from "react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import Link from "next/link";
import { FaArrowRight, FaChevronDown } from "react-icons/fa6";
import { LuArrowRight } from "react-icons/lu";
import { CiCalendar, CiSearch } from "react-icons/ci";
import NewsCard from "@/components/newsCard";
const slides = [
  {
    id: 1,
    img: "news.png",
    name: "The Rector Of The Erbil Polytechnic University Attends The Graduation Ceremony Of The Third Course Of Pedagogical Training.",
    position: "Software Engineer Alumni",
    desc: "EPU's supportive faculty and diverse programs have truly shaped my career, providing me with invaluable skills and unforgettable experiences.",
  },
  {
    id: 2,
    img: "park.png",
    name: "The Rector Of The Erbil Polytechnic University Attends The Graduation Ceremony Of The Third Course Of Pedagogical Training.",
    position: "Software Engineer Alumni",
    desc: "EPU's supportive faculty and diverse programs have truly shaped my career, providing me with invaluable skills and unforgettable experiences.",
  },
  {
    id: 2,
    img: "union.png",
    name: "The Rector Of The Erbil Polytechnic University Attends The Graduation Ceremony Of The Third Course Of Pedagogical Training.",
    position: "Software Engineer Alumni",
    desc: "EPU's supportive faculty and diverse programs have truly shaped my career, providing me with invaluable skills and unforgettable experiences.",
  },
];
const Page = () => {
  const swiperRef = useRef<SwiperCore>();
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useTranslations("News");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="my-10 flex_center w-full flex-col gap-10">
      <div className="max-w-[1040px] w-full flex_start flex-col gap-8 lg:px-0 px-3">
        <SubHeader title={t("head")} alt={false} />
      </div>
      <div className="w-full relative">
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop={true}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="w-full md:h-[470px] h-[220px] relative">
                <Image
                  src={`/images/${slide.img}`}
                  alt={slide.name}
                  fill
                  priority
                  className="w-full h-full object-cover"
                />
                <div className="absolute left-0 top-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-[#1b417bc7] to-transparent w-full h-full"></div>
                <div className="lg:top-20 md:top-10 top-5 lg:left-32 md:left-14 left-6 absolute flex_start flex-col gap-5">
                  <div className="flex_center gap-3 bg-golden text-white px-4 py-2 rounded-3xl">
                    <span className="w-3 h-3 rounded-full flex-shrink-0 bg-white"></span>
                    <p className="font-semibold md:text-base text-xs">
                      {t("most_viewed_news")}
                    </p>
                  </div>
                  <h3 className="lg:text-[26px] md:text-smallTitle text-sm md:max-w-[625px] max-w-full md:px-0 px-3 text-white text-opacity-90">
                    {slide.name}
                  </h3>
                  <Link
                    href={`/${locale}/news/1`}
                    title={slide.name}
                    className="border-b border-b-white text-white flex_center gap-3"
                  >
                    <p className="md:text-base text-xs">{t("see_details")}</p>
                    <LuArrowRight className="md:text-xl text-base rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="max-w-[1040px] w-full text-secondary flex_start flex-col gap-8 mt-10 lg:px-0 px-3">
        <div className="w-full flex_center gap-5">
          <h1 className="md:text-titleNormal text-base font-semibold flex-shrink-0">
            {t("release_news")}
          </h1>
          <span className="w-full h-1 bg-golden"></span>
        </div>
        <div className="w-full flex_center gap-5">
          <div className="relative sm:bg-transparent bg-white lg:w-[20%] sm:w-[33%] w-14 text-sm flex-shrink-0 sm:border-none border border-lightBorder sm:p-0 p-2 rounded-md">
            <select
              name="academic"
              id="academic"
              className="sm:block hidden w-full pl-8 pr-8 py-2 border border-lightBorder bg-lightBorder bg-opacity-50 rounded-xl text-[#9E9E9E] focus:border-primary outline-none appearance-none cursor-pointer"
            >
              <option value="#">{t("select_date")}</option>
              <option value="#">Academic 1</option>
              <option value="#">Academic 2</option>
              <option value="#">Academic 3</option>
            </select>

            <CiCalendar className="sm:hidden block text-2xl" />

            <span className="sm:block hidden absolute left-2 top-1/2 -translate-y-1/2 text-[#9E9E9E] pointer-events-none">
              <CiCalendar className="text-lg" />
            </span>

            <span className="sm:block hidden absolute top-1/2 -translate-y-1/2 right-2 text-secondary pointer-events-none">
              <FaChevronDown />
            </span>
          </div>
          <div className="relative w-full">
            <span className="pointer-events-none text-black opacity-50 absolute ltr:left-2 right-2 top-1/2 -translate-y-1/2 z-10 text-xl">
              <CiSearch />
            </span>
            <input
              type="text"
              className="py-2 w-full border-lightBorder bg-lightBorder bg-opacity-50 sm:text-base text-sm px-8 sm:rounded-xl rounded-md border focus:border-primary outline-none"
              placeholder={t("search_news")}
            />
          </div>
          <button className="sm:px-6 px-2 flex-shrink-0 py-2 sm:rounded-xl rounded-md bg-primary text-white">
            {t("search")}
          </button>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8">
          <NewsCard
            image="/images/news.png"
            link={`/${locale}/news/1`}
            author="Craig Bator"
            createdAt="27 Dec 2020"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
            title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
          />
          <NewsCard
            image="/images/news.png"
            link={`/${locale}/news/1`}
            author="Craig Bator"
            createdAt="27 Dec 2020"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
            title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
          />
        </div>
      </div>
      <button className="border border-primary text-primary px-8 py-2 rounded-md">
        {t("see_more")}
      </button>
    </div>
  );
};

export default Page;
