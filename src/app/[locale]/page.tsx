import MapSection from "@/components/HomeComponents/MapSection";
import NewsCard from "@/components/newsCard";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { AiFillInstagram } from "react-icons/ai";
import { CgFacebook } from "react-icons/cg";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import { HiOutlineBuildingOffice, HiOutlineUsers } from "react-icons/hi2";
import { IoLogoYoutube } from "react-icons/io";
import { IoBriefcaseOutline } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";

export default function Home() {
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "avatar1",
      initials: "SJ",
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "avatar2",
      initials: "MC",
    },
    {
      id: 3,
      name: "Emily Davis",
      avatar: "avatar3",
      initials: "ED",
    },
    {
      id: 4,
      name: "Alex Rivera",
      avatar: "avatar4",
      initials: "AR",
    },
  ];
  const t = useTranslations("IndexPage");

  return (
    <div className="flex_center flex-col gap-5 w-full">
      {/* main section */}
      <div className="relative custom_container">
        <div className="flex_center flex-col gap-5 absolute z-10 right-5 top-1/2 -translate-y-1/2">
          <span className="w-[1px] h-[70px] bg-primary"></span>
          <a href="#" className="text-xl text-primary">
            <AiFillInstagram />
          </a>
          <a href="#" className="text-xl text-primary">
            <CgFacebook />
          </a>
          <a href="#" className="text-xl text-primary">
            <IoLogoYoutube />
          </a>
          <span className="w-[1px] h-[70px] bg-primary"></span>
        </div>
        <div className="w-full h-[500px]">
          <Image src="/images/main-pic.png" alt="My Image" fill priority />
        </div>
        <div className="w-[490px] h-[290px] bg-primary absolute left-0 bottom-0 rounded-2xl flex justify-start items-start p-5 flex-col gap-8">
          <h4 className="text-white opacity-50 font-medium  text-xl">
            In our university
          </h4>
          <div className="relative">
            <h1 className="text-5xl text-white">Empowering Your Future !</h1>
            <div className="w-[50px] h-[40px] absolute right-7 -top-7">
              <Image
                src="/images/alumni-shape.svg"
                alt="My Image"
                fill
                sizes="100px"
                priority
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-white">
            <div className="flex -space-x-3">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="relative group"
                  style={{ zIndex: users.length - index }}
                >
                  <Image
                    src={`/images/${user.avatar}.png`}
                    alt={user.name}
                    width={46}
                    height={46}
                    className="w-12 h-12 rounded-full border-3 border-white shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                  />
                  {/* Fallback initials */}
                  <div className="w-12 h-12 rounded-full border-3 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white font-semibold text-sm hover:scale-110 transition-transform duration-200 cursor-pointer hidden absolute top-0 left-0">
                    {user.initials}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {user.name}
                  </div>
                </div>
              ))}
            </div>
            <div>+4,000 Alumni</div>
          </div>
        </div>
      </div>

      {/* facts section */}
      <div className="custom_container flex-col flex_center gap-5 mt-10">
        <h1 className="text-title text-secondary font-semibold">
          Facts About University
        </h1>
        <span className="text-smallParagraph font-medium max-w-[745px] text-center text-primary opacity-90">
          Discover the vibrant community at Erbil Polytechnic University with
          our impressive numbers, showcasing our dedicated students, skilled
          faculty, supportive staff, and diverse faculties.
        </span>
        <div className="mt-5 flex justify-between w-full items-center max-w-[1000px]">
          <div className="flex_center flex-col gap-4">
            <h1 className="text-title text-secondary font-semibold">+ 3.12K</h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 rounded-full bg-opacity-20 flex_center">
                <PiStudent />
              </span>
              <p className="opacity-60">Students</p>
            </div>
          </div>
          <div className="flex_center flex-col gap-4">
            <h1 className="text-title text-secondary font-semibold">+ 239K</h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 rounded-full bg-opacity-20 flex_center">
                <IoBriefcaseOutline />
              </span>
              <p className="opacity-60">Teachers</p>
            </div>
          </div>
          <div className="flex_center flex-col gap-4">
            <h1 className="text-title text-secondary font-semibold">+ 300K</h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 rounded-full bg-opacity-20 flex_center">
                <HiOutlineBuildingOffice />
              </span>
              <p className="opacity-60">Academics</p>
            </div>
          </div>
          <div className="flex_center flex-col gap-4">
            <h1 className="text-title text-secondary font-semibold">+ 2.4K</h1>
            <div className="flex_center gap-2">
              <span className="bg-primary w-6 h-6 rounded-full bg-opacity-20 flex_center">
                <HiOutlineUsers />
              </span>
              <p className="opacity-60">Staff Members</p>
            </div>
          </div>
        </div>
        <div className="max-w-[1000px] w-full relative mt-20">
          <div className="w-full h-[400px] relative">
            <button className="flex_center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-white rounded-full text-xl bg-gradient-to-r from-[#DCC48C] to-[#FFA64D] z-10">
              <FaPlay />
            </button>
            <Image src={`/images/park.png`} alt="park" fill priority />
          </div>
        </div>
      </div>
      {/* latest news */}
      <div className="max-w-[1040px] w-full flex-col flex_start gap-8 mt-10">
        <Link
          href={"news"}
          className="flex_center gap-5 text-primary font-semibold"
        >
          <div className="relative">
            <h1 className="text-title">Latest News</h1>
            <span className="absolute right-0 bottom-0 w-28 h-3">
              <Image src={`/images/title-shape.svg`} alt="park" fill priority />
            </span>
          </div>
          <FaArrowRight className="text-xl" />
        </Link>
        <p className="text-paragraph text-primary opacity-90 font-medium">
          Discover the latest news at Erbil Polytechnic University. Stay
          informed about academic achievements, campus developments, and
          community initiatives that highlight our commitment to excellence and
          innovation.
        </p>
        <div className="grid grid-cols-2 w-full gap-8">
          <NewsCard
            image="/images/news.png"
            link="/"
            author="Craig Bator"
            createdAt="27 Dec 2020"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
            title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
          />
          <NewsCard
            image="/images/news.png"
            link="/"
            author="Craig Bator"
            createdAt="27 Dec 2020"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus lobortis augue condimentum maecenas. Metus at in fames vitae posuere ut vel vulputate ..."
            title="Solskjaer dismisses Klopp comments on Man Utd penalty record"
          />
        </div>
      </div>
      {/* map section */}
      <MapSection />
    </div>
  );
}
