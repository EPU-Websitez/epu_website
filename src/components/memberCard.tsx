import Image from "next/image";
import Link from "next/link";
import { MdChevronRight } from "react-icons/md";

interface MemberCardProps {
  link: string;
  title: string;
  staticText: string;
  image: string;
  description: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  link,
  title,
  image,
  staticText,
  description,
}) => {
  return (
    <div className="border border-lightBorder flex_center p-3 rounded-3xl flex-col gap-4 text-center">
      <div className="flex_center p-1 border-4 border-primary rounded-full w-[100px] h-[100px] relative bg-white">
        <Link href={link} title={title} className="w-full h-full relative">
          <Image
            src={image}
            alt="title"
            fill
            priority
            className="w-full h-auto object-cover rounded-full"
          />
        </Link>
      </div>
      <h3 className="text-primary font-bold">{title}</h3>
      <span className="text-sm text-secondary opacity-70 w-full border-b border-b-lightBorder pb-4">
        {description}
      </span>
      <Link
        href={link}
        title={title}
        className="flex justify-between items-center rounded-3xl w-full border border-[#81B1CE4A] border-opacity-30 p-1 text-secondary"
      >
        <p className="text-sm mx-2 font-medium">{staticText}</p>
        <span className="w-[30px] h-[30px] rounded-full bg-secondary text-white text-lg flex_center">
          <MdChevronRight className="rtl:rotate-180" />
        </span>
      </Link>
    </div>
  );
};

export default MemberCard;
