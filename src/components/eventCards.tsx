"use client";
import { TbExternalLink } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { IoArrowForwardOutline } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";
import { GoArrowRight } from "react-icons/go";
import { useTranslations } from "next-intl";

interface EventCardProps {
  link: string;
  title: string;
  type: string;
  image: string;
  createdAt: string;
  time: string;
}

const EventCard: React.FC<EventCardProps> = ({
  link,
  title,
  image,
  type,
  createdAt,
  time,
}) => {
  const t = useTranslations("Events");
  return (
    <div className="w-full flex_start flex-col gap-4 group relative border border-lightBorder rounded-xl py-3">
      <Link
        href={link}
        title={title}
        className="relative w-full h-[250px] rounded-xl px-3"
      >
        <div className="absolute text-sm z-10 ltr:left-4 rtl:right-4 -bottom-4 border border-white bg-blue rounded-xl px-3 py-0.5 text-white">
          {type}
        </div>
        <div className="w-full h-full relative">
          <Image
            src={image}
            alt="My Image"
            fill
            priority
            className="w-full h-auto object-cover rounded-xl"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>
      </Link>
      <div className="flex justify-between items-center lg:gap-2 gap-3 lg:text-sm text-xs mt-3 px-3 flex-wrap w-full">
        <div className="flex_center gap-2">
          <span className="bg-blue bg-opacity-20 text-primary w-6 h-6 rounded-full flex_center">
            <FaCalendarDays />
          </span>
          <span className="text-xs">{createdAt}</span>
        </div>
        <div className="flex_center gap-2">
          <span className="bg-blue bg-opacity-20 text-primary w-6 h-6 rounded-full flex_center">
            <IoIosTime className="text-lg" />
          </span>
          <span className="text-xs">{time}</span>
        </div>
      </div>
      <Link
        href={link}
        title={title}
        type="button"
        className="lg:text-xl truncate w-full text-base font-medium pt-3 border-t border-t-lightBorder hover:text-primary text-secondary duration-300 px-3"
      >
        {title}
      </Link>
      <Link
        href={link}
        title={title}
        className="w-full text-sm text-secondary font-bold border-t border-t-lightBorder pt-3 px-3 flex justify-between items-center"
      >
        <span>{t("read_more")}</span>
        <GoArrowRight className="text-2xl rtl:rotate-180" />
      </Link>
    </div>
  );
};

export default EventCard;
