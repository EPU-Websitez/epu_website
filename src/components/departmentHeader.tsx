import Image from "next/image";
import SubHeader from "./subHeader";
import { IoMdMail } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";

interface DepartmentHeaderProps {
  title: string;
  desc: string;
  location: string;
  locationValue: string;
  email: string;
  emailValue: string;
}

const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({
  title,
  desc,
  location,
  locationValue,
  email,
  emailValue,
}) => {
  return (
    <div className="flex justify-center items-center py-10 md:gap-10 md:h-[405px] overflow-hidden relative w-full">
      <Image
        src={"/images/bg.png"}
        alt="My Image"
        fill
        priority
        className="w-full h-full object-cover"
      />
      <div className="z-20 flex_start flex-col max-w-[1040px] w-full md:gap-8 gap-4 text-white px-3">
        <div className="flex_center gap-2 group relative">
          <span className="w-14 h-[2px] rounded-md bg-golden"></span>
          <h2 className="sm:text-[52px] text-smallTitle font-semibold">
            {title}
          </h2>
        </div>
        <p className="md:texr-sm text-xs">{desc}</p>
        <div className="flex_start gap-5">
          <div className="flex justify-start items-center gap-3">
            <IoMdMail className="text-2xl" />
            <div className="flex_start flex-col">
              <span className="text-xs opacity-50">{email}</span>
              <p className="text-sm">{emailValue}</p>
            </div>
          </div>
          <div className="flex justify-start items-center gap-3">
            <IoLocationSharp className="text-2xl" />
            <div className="flex_start flex-col">
              <span className="text-xs opacity-50">{location}</span>
              <p className="text-sm">{locationValue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentHeader;
