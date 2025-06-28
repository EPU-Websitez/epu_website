import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import { IoArrowForwardOutline, IoBriefcaseOutline } from "react-icons/io5";
import { LuBookOpen } from "react-icons/lu";
import { MdOutlineLocationOn } from "react-icons/md";
import { PiStudent } from "react-icons/pi";

const MapSection = () => {
  return (
    <div className="w-full h-[760px] relative">
      <Image src="/images/map.png" alt="map" fill priority />
      <div className="absolute top-0 h-full overflow-y-scroll w-[450px] left-10 bg-white bg-opacity-75 p-5 gap-3 flex_start flex-col">
        <Link
          href={"/"}
          className="w-full flex justify-between items-center text-secondary text-smallTitle"
        >
          <h3>Khabat Technical Institute</h3>
          <GoArrowRight />
        </Link>
        <div className="flex_center gap-3 text-secondary">
          <MdOutlineLocationOn />
          <p className="text-sm">Khabat, Street Name, near building name</p>
        </div>
        <span className="text-sm text-secondary opacity-90">
          The institute was established in 2009-2010. It is located in Khabat
          district on the banks of the Great Zabi River and the main road
          between Erbil and Mosul, where is about 37 km western of Erbil. It has
          currently five scientific departments in the morning; includi{" "}
          <button className="opacity-100 font-semibold">.... More</button>
        </span>
        <div className="flex_center gap-14 w-full mt-5">
          <div className="flex_center flex-col gap-2 text-secondary">
            <span className="w-16 h-16  bg-[#D5E2ED] rounded-full flex_center">
              <LuBookOpen className="text-xl" />
            </span>
            <h2 className="text-lg font-semibold ">+ 12</h2>
            <span className="text-sm">Departments</span>
          </div>
          <div className="flex_center flex-col gap-2 text-secondary">
            <span className="w-16 h-16  bg-[#D5E2ED] rounded-full flex_center">
              <IoBriefcaseOutline className="text-xl" />
            </span>
            <h2 className="text-lg font-semibold ">+ 32</h2>
            <span className="text-sm">Teachers</span>
          </div>
          <div className="flex_center flex-col gap-2 text-secondary">
            <span className="w-16 h-16  bg-[#D5E2ED] rounded-full flex_center">
              <PiStudent className="text-xl" />
            </span>
            <h2 className="text-lg font-semibold ">+ 2.3K</h2>
            <span className=" text-sm">Students</span>
          </div>
        </div>
        <div className="flex_start w-full flex-col gap-5 mt-5">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-medium text-secondary">Latest News</h2>
            <Link
              href={"/"}
              className="border-b border-b-secondary text-secondary"
            >
              See all
            </Link>
          </div>
          <div className="w-full flex_start flex-col gap-4 group relative">
            <Link
              href={"/"}
              className="relative w-full h-[190px] rounded-xl overflow-hidden"
            >
              <div className="text-secondary bg-white h-6 w-6 flex_center rounded-full z-10 absolute top-2 right-2">
                <IoArrowForwardOutline />
              </div>
              <Image
                src="/images/news.png"
                alt="My Image"
                fill
                priority
                className="w-full h-auto object-cover group-hover:scale-105 duration-300"
              />
            </Link>
            <div className="flex_center gap-1 text-secondary text-sm">
              <p>author</p>
              <span className="opacity-75">-</span>
              <span className="opacity-75">27 Dec 2020</span>
            </div>
            <Link
              href="/"
              type="button"
              className="text-lg font-medium hover:text-primary text-secondary duration-300"
            >
              "News Title"
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
