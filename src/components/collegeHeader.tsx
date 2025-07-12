import Image from "next/image";

interface CollegeHeaderProps {
  title: string;
  desc: string;
}

const CollegeHeader: React.FC<CollegeHeaderProps> = ({ title, desc }) => {
  return (
    <div className="flex_center md:gap-20 gap-7 md:h-[437px] sm:h-[300px] h-[225px] rounded-3xl overflow-hidden relative w-full">
      <Image
        src={"/images/college-bg.png"}
        alt="My Image"
        fill
        priority
        className="w-full h-full object-cover"
      />
      <div className="absolute left-0 top-0 w-full h-full ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-[#ffffff71] z-10 opacity-80"></div>
      <div className="z-20 flex_start flex-col md:max-w-[710px] max-w-[60%] md:gap-8 gap-4 text-white px-3">
        <h1 className="lg:text-[60px] md:text-[40px] text-base font-bold">
          {title}
        </h1>
        <p className="lg:text-lg md:text-base text-[10px] font-medium">
          {desc}
        </p>
      </div>
      <div className="lg:w-[184px] z-20 md:w-[134px] w-[50px] lg:h-[258px] md:h-[208px] h-[70px] px-3 relative flex-shrink-0">
        <Image
          className="w-full h-full"
          fill
          priority
          src={"/images/small-logo.png"}
          alt="logo"
        ></Image>
      </div>
    </div>
  );
};

export default CollegeHeader;
