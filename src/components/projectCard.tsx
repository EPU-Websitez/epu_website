"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { GoArrowRight } from "react-icons/go";

interface ProjectCardProps {
  link: string;
  title: string;
  image: string;
  date: string;
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  link,
  title,
  image,
  date,
  description,
}) => {
  const t = useTranslations("International");
  return (
    <div className="w-full flex sm:flex-row flex-col gap-5 group relative border border-lightBorder rounded-2xl p-4 hover:shadow-lg hover:border-primary/30 transition-all duration-300 bg-white">
      {/* Image container */}
      <Link
        href={link}
        title={title}
        className="relative sm:w-[220px] w-full sm:h-[180px] h-[200px] flex-shrink-0 overflow-hidden rounded-xl"
      >
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder.svg";
          }}
        />
        {/* Date Badge overlay */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
          {date}
        </div>
      </Link>

      {/* Content container */}
      <div className="flex flex-col flex-grow justify-between py-1">
        <div className="flex flex-col gap-2 relative">
          <Link
            href={link}
            title={title}
            className="md:text-xl text-lg font-bold text-secondary group-hover:text-primary transition-colors duration-300 line-clamp-2 pr-6"
          >
            {title}
          </Link>
          <p className="text-secondary/70 text-xs sm:text-sm line-clamp-3 mb-2 leading-relaxed">
            {description}
          </p>
        </div>

        <Link
          href={link}
          title={title}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary mt-auto w-fit group/btn"
        >
          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover/btn:after:w-full">
            {t("read_more")}
          </span>
          <GoArrowRight className="text-lg transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
