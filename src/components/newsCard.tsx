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
    <div className="w-full flex_start flex-col gap-4 group relative">
      <Link
        href={link}
        className="relative w-full h-[330px] rounded-xl overflow-hidden"
      >
        <div className="text-secondary bg-white h-6 w-6 flex_center rounded-full z-10 absolute top-2 right-2">
          <IoArrowForwardOutline />
        </div>
        <Image
          src={image}
          alt="My Image"
          fill
          priority
          className="w-full h-auto object-cover group-hover:scale-105 duration-300"
        />
      </Link>
      <div className="flex_center gap-1 text-secondary text-sm">
        <p>{author}</p>
        <span className="opacity-75">-</span>
        <span className="opacity-75">{createdAt}</span>
      </div>
      <Link
        href={link}
        type="button"
        className="text-lg font-medium hover:text-primary text-secondary duration-300"
      >
        {title}
      </Link>
      <span className="text-sm text-secondary opacity-70">{description}</span>
    </div>
  );
};

export default NewsCard;
