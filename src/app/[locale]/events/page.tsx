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
import { FaClock } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import EventCard from "@/components/eventCards";
const slides = [
  {
    id: 1,
    img: "event.png",
    name: "Innovate & Compete: Annual Student Innovation Challenge.",
    date: "21 OCT 2024",
    time: "02:30 Pm",
  },
  {
    id: 2,
    img: "park.png",
    name: "Innovate & Compete: Annual Student Innovation Challenge.",
    date: "21 OCT 2024",
    time: "02:30 Pm",
  },
  {
    id: 2,
    img: "union.png",
    name: "Innovate & Compete: Annual Student Innovation Challenge.",
    date: "21 OCT 2024",
    time: "02:30 Pm",
  },
];
const Page = () => {
  const swiperRef = useRef<SwiperCore>();
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useTranslations("Events");
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
                      {t("conference")}
                    </p>
                  </div>
                  <div className="border border-white px-3 py-1 rounded-3xl flex_center gap-4 mt-10">
                    <div className="flex_center gap-2 text-white">
                      <span className="bg-white bg-opacity-30 rounded-full flex_center w-7 h-7">
                        <FaCalendarAlt />
                      </span>
                      <p className="text-sm">{slide.date}</p>
                    </div>
                    <div className="flex_center gap-2 text-white">
                      <span className="bg-white bg-opacity-30 rounded-full flex_center w-7 h-7">
                        <FaClock />
                      </span>
                      <p className="text-sm">{slide.time}</p>
                    </div>
                  </div>
                  <h3 className="lg:text-[26px] md:text-smallTitle text-sm md:max-w-[625px] max-w-full md:px-0 px-3 text-white">
                    {slide.name}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="max-w-[1040px] w-full text-secondary flex_start flex-col gap-8 mt-10 lg:px-0 px-3">
        <div className="w-full flex_center gap-5">
          <h1 className="md:text-titleNormal text-base font-semibold flex-shrink-0">
            {t("late_events")}
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
      <button className="border border-primary text-primary px-8 py-2 rounded-md">
        {t("see_more")}
      </button>
    </div>
  );
};

export default Page;
