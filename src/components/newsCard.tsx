import { TbExternalLink } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { IoArrowForwardOutline } from "react-icons/io5";

interface NewsCardProps {
  link: string;
  title: string;
  author: string;
  image: string;
  createdAt: string;
  description: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  link,
  title,
  image,
  author,
  createdAt,
  description,
}) => {
  return (
    <div className="w-full flex_start flex-col md:gap-4 gap-2 group relative">
      <Link
        href={link}
        className="relative w-full md:h-[330px] h-[200px] rounded-xl overflow-hidden"
      >
        <div className="text-secondary bg-white h-6 w-6 flex_center rounded-full z-10 absolute top-2 ltr:right-2 rtl:left-2">
          <IoArrowForwardOutline className="rtl:rotate-180" />
        </div>
        <Image
          src={image}
          alt="My Image"
          fill
          priority
          className="w-full h-auto object-cover group-hover:scale-105 duration-300"
        />
      </Link>
      <div className="flex_center gap-1 text-secondary sm:text-sm text-xs">
        <p>{author}</p>
        <span className="opacity-75">-</span>
        <span className="opacity-75">{createdAt}</span>
      </div>
      <Link
        href={link}
        type="button"
        className="md:text-lg text-base font-medium hover:text-primary text-secondary duration-300"
      >
        {title}
      </Link>
      <span className="md:text-sm text-xs text-secondary opacity-70">
        {description}
      </span>
    </div>
  );
};

export default NewsCard;
