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
    name: "Women’s Day",
    date: "21 OCT 2024",
    time: "02:30 Pm",
  },
  {
    id: 2,
    img: "park.png",
    name: "Women’s Day",
    date: "21 OCT 2024",
    time: "02:30 Pm",
  },
  {
    id: 2,
    img: "union.png",
    name: "Women’s Day",
    date: "21 OCT 2024",
    time: "02:30 Pm",
  },
];
const Page = () => {
  const swiperRef = useRef<SwiperCore>();
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useTranslations("Anniversary");
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
            {t("latest_anniversary")}
          </h1>
          <span className="w-full h-1 bg-golden"></span>
        </div>
        <div className="grid md:grid-cols-3 grid-cols-2 w-full lg:gap-8 gap-4">
          <div className="w-full relative lg:h-[375px] md:h-[340px] h-[250px] rounded-3xl overflow-hidden">
            <Image
              src={`/images/about-stage-1.png`}
              alt="{slide.name}"
              fill
              priority
              className="w-full h-full object-cover"
            />
            <span className="bg-white py-1 px-3 rounded-md text-secondary font-semibold absolute md:ltr:left-5 ltr:left-3 md:rtl:right-5 rtl:right-3 md:top-5 top-3 z-10 md:text-sm text-xs">
              21 March
            </span>
            <div className="bg-gradient-to-t from-black to-transparent absolute bottom-0 left-0 w-full h-[50%] flex items-end md:p-5 p-3 z-10 justify-start">
              <h3 className="text-white font-semibold md:text-base text-sm">
                Hallabja Chemical Attack
              </h3>
            </div>
          </div>
          <div className="w-full relative lg:h-[375px] md:h-[340px] h-[250px] rounded-3xl overflow-hidden">
            <Image
              src={`/images/about-stage-1.png`}
              alt="{slide.name}"
              fill
              priority
              className="w-full h-full object-cover"
            />
            <span className="bg-white py-1 px-3 rounded-md text-secondary font-semibold absolute md:ltr:left-5 ltr:left-3 md:rtl:right-5 rtl:right-3 md:top-5 top-3 z-10 md:text-sm text-xs">
              21 March
            </span>
            <div className="bg-gradient-to-t from-black to-transparent absolute bottom-0 left-0 w-full h-[50%] flex items-end md:p-5 p-3 z-10 justify-start">
              <h3 className="text-white font-semibold md:text-base text-sm">
                Hallabja Chemical Attack
              </h3>
            </div>
          </div>
          <div className="w-full relative lg:h-[375px] md:h-[340px] h-[250px] rounded-3xl overflow-hidden">
            <Image
              src={`/images/about-stage-1.png`}
              alt="{slide.name}"
              fill
              priority
              className="w-full h-full object-cover"
            />
            <span className="bg-white py-1 px-3 rounded-md text-secondary font-semibold absolute md:ltr:left-5 ltr:left-3 md:rtl:right-5 rtl:right-3 md:top-5 top-3 z-10 md:text-sm text-xs">
              21 March
            </span>
            <div className="bg-gradient-to-t from-black to-transparent absolute bottom-0 left-0 w-full h-[50%] flex items-end md:p-5 p-3 z-10 justify-start">
              <h3 className="text-white font-semibold md:text-base text-sm">
                Hallabja Chemical Attack
              </h3>
            </div>
          </div>
          <div className="w-full relative lg:h-[375px] md:h-[340px] h-[250px] rounded-3xl overflow-hidden">
            <Image
              src={`/images/about-stage-1.png`}
              alt="{slide.name}"
              fill
              priority
              className="w-full h-full object-cover"
            />
            <span className="bg-white py-1 px-3 rounded-md text-secondary font-semibold absolute md:ltr:left-5 ltr:left-3 md:rtl:right-5 rtl:right-3 md:top-5 top-3 z-10 md:text-sm text-xs">
              21 March
            </span>
            <div className="bg-gradient-to-t from-black to-transparent absolute bottom-0 left-0 w-full h-[50%] flex items-end md:p-5 p-3 z-10 justify-start">
              <h3 className="text-white font-semibold md:text-base text-sm">
                Hallabja Chemical Attack
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
