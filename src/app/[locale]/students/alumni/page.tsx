"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper/types";
import { useRef, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";

const slides = [
  {
    id: 1,
    img: "president-alt.png",
    name: "Hama Omar",
    position: "Software Engineer Alumni",
    desc: "EPU's supportive faculty and diverse programs have truly shaped my career, providing me with invaluable skills and unforgettable experiences.",
  },
  {
    id: 2,
    img: "park.png",
    name: "Elnnd Selman",
    position: "Software Engineer Alumni",
    desc: "EPU's supportive faculty and diverse programs have truly shaped my career, providing me with invaluable skills and unforgettable experiences.",
  },
  {
    id: 2,
    img: "union.png",
    name: "Hanar Shamaa",
    position: "Software Engineer Alumni",
    desc: "EPU's supportive faculty and diverse programs have truly shaped my career, providing me with invaluable skills and unforgettable experiences.",
  },
];
const Page = () => {
  const swiperRef = useRef<SwiperCore>();
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useTranslations("Students");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex flex-col items-center sm:my-10 my-5">
      <div className="max-w-[1024px] md:px-3 px-5 text-secondary w-full flex_start">
        <SubHeader title={t("alumni")} alt={false} />
      </div>

      <div className="md:w-full change_direction w-[95%] flex justify-between md:bg-transparent bg-backgroundSecondary flex-col md:flex-row items-center gap-5 mt-10 relative md:p-0 p-5 md:rounded-none rounded-3xl">
        <div className="md:hidden text-secondary text-center flex justify-center items-center flex-col gap-5 px-5">
          <h5 className="text-sm font-semibold">{t("feedback")}</h5>
          <h1 className="text-titleNormal font-semibold">
            {t("feedback_title")}
          </h1>
          <span className="text-base">{t("feedback_text")}</span>
        </div>
        {/* Swiper Slider */}
        <div className="lg:w-[45%] md:w-[50%] w-full flex-shrink-0 z-10 md:-mr-16 mr-0">
          <Swiper
            spaceBetween={20}
            breakpoints={{
              340: {
                slidesPerView: 1.1,
              },
              768: {
                slidesPerView: 1.5,
              },
            }}
            className="swiper_dir"
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`rounded-3xl flex md:justify-end justify-start lg:gap-10 gap-5 md:items-end items-start lg:p-10 p-5 flex-col transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-primary text-white"
                      : "bg-blue bg-opacity-30 text-secondary"
                  }`}
                >
                  <div className="relative w-[50px] h-[50px]">
                    <Image
                      src={"/images/quote.svg"}
                      alt="Quote Icon"
                      fill
                      priority
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex_center md:flex-row flex-row-reverse gap-5">
                    <div className="flex md:justify-end justify-start md:items-end items-start flex-col gap-1">
                      <h5 className="font-semibold">{slide.name}</h5>
                      <small className="text-xs">{slide.position}</small>
                    </div>
                    <div className="relative w-[60px] h-[60px]">
                      <Image
                        src={`/images/${slide.img}`}
                        alt={slide.name}
                        fill
                        priority
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <p className="text-sm md:text-end text-start">{slide.desc}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="md:hidden flex gap-4">
          <button
            className="bg-background flex_center rounded-full w-[30px] h-[30px] text-black border border-lightBorder"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <FaAngleLeft />
          </button>
          <button
            className="bg-background flex_center rounded-full w-[30px] h-[30px] text-black border border-lightBorder"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <FaAngleLeft className="rotate-180" />
          </button>
        </div>

        {/* Feedback Section */}
        <div className="lg:w-[65%] w-[55%] md:flex hidden bg-backgroundSecondary text-secondary lg:py-10 p-5  justify-center items-center rounded-3xl sm:-ml-10">
          <div className="flex_start flex-col gap-7 lg:px-6 px-10">
            <h5 className="text-sm font-semibold">{t("feedback")}</h5>
            <h1 className="max-w-[350px] lg:text-title text-titleNormal font-semibold">
              {t("feedback_title")}
            </h1>
            <span className="max-w-[460px] lg:text-lg text-base">
              {t("feedback_text")}
            </span>
            <div className="flex_center gap-4">
              <button
                className="bg-background flex_center rounded-full w-[30px] h-[30px] text-black border border-lightBorder"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <FaAngleLeft />
              </button>
              <button
                className="bg-background flex_center rounded-full w-[30px] h-[30px] text-black border border-lightBorder"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <FaAngleLeft className="rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1024px] text-secondary px-3 w-full flex_center flex-col gap-5 mt-10">
        <h1 className="text-[30px] font-semibold">
          {t("alumni_success_stories")}
        </h1>
        <p className="text-sm max-w-[660px] text-center">
          {t("alumni_success_stories_text")}
        </p>
        <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-10 mt-5">
          <div className="border rounded-3xl flex_start flex-col w-full">
            <h3 className="text-title font-semibold w-full py-5 px-3 text-end">
              01
            </h3>
            <div className="w-full h-[207px] relative">
              <Image
                src={"/images/park.png"}
                alt="Quote Icon"
                fill
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-smallTitle font-semibold px-3 mt-5 mb-3">
              Sanarya Hamakarim
            </h3>
            <span className="opacity-70 text-sm px-3 mb-5">
              After graduating from Erbil Polytechnic University in 2018, Sarah
              Ahmed embarked on a journey that would take her across the globe.
              With a passion for sustainable energy, she secured a s ...
            </span>
            <Link
              href={""}
              className="px-3 py-4 text-golden border-t border-t-lightBorder w-full flex justify-between items-center font-semibold"
            >
              <span>{t("read_more")}</span>
              <GoArrowRight className="text-xl rtl:rotate-180" />
            </Link>
          </div>
          <div className="border rounded-3xl flex_start flex-col w-full">
            <h3 className="text-title font-semibold w-full py-5 px-3 text-end">
              01
            </h3>
            <div className="w-full h-[207px] relative">
              <Image
                src={"/images/park.png"}
                alt="Quote Icon"
                fill
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-smallTitle font-semibold px-3 mt-5 mb-3">
              Sanarya Hamakarim
            </h3>
            <span className="opacity-70 text-sm px-3 mb-5">
              After graduating from Erbil Polytechnic University in 2018, Sarah
              Ahmed embarked on a journey that would take her across the globe.
              With a passion for sustainable energy, she secured a s ...
            </span>
            <Link
              href={""}
              className="px-3 py-4 text-golden border-t border-t-lightBorder w-full flex justify-between items-center font-semibold"
            >
              <span>{t("read_more")}</span>
              <GoArrowRight className="text-xl rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-10 w-full relative h-[575px] flex_center">
        <Image
          src={"/images/alumni-bg.png"}
          alt="Quote Icon"
          fill
          priority
          className="w-full h-full object-cover"
        />
        <div className="opacity-40 bg-primary absolute left-0 top-0 w-full h-full z-10"></div>
        <div className="w-[1024px] text-white px-3 flex_start flex-col gap-5 z-20">
          <h1 className="md:text-4xl text-2xl font-semibold z-20">
            {t("become_alumni")}
          </h1>
          <p className="md:text-base text-sm">{t("become_alumni_text")}</p>
          <div className="flex_start gap-5 w-full max-w-[600px] md:mt-10 mt-5">
            <div className="w-10 h-10 rounded-full flex_center bg-white flex-shrink-0">
              <span className="w-[95%] h-[90%] flex_center border-primary border flex_center rounded-full text-black">
                1
              </span>
            </div>
            <div className="flex_start flex-col gap-2">
              <h2 className="md:text-smallTitle text-lg font-semibold">
                {t("alimni_1")}
              </h2>
              <span className="opacity-90 md:text-base text-sm">
                {t("alimni_1_text")}
              </span>
            </div>
          </div>
          <div className="flex_start gap-5 w-full max-w-[600px]">
            <div className="w-10 h-10 rounded-full flex_center bg-white flex-shrink-0">
              <span className="w-[95%] h-[90%] flex_center border-primary border flex_center rounded-full text-black">
                1
              </span>
            </div>
            <div className="flex_start flex-col gap-2">
              <h2 className="text-smallTitle font-semibold">{t("alimni_2")}</h2>
              <span className="opacity-90">{t("alimni_2_text")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
