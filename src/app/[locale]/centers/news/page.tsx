"use client";

import NewsCard from "@/components/newsCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BsFillTriangleFill } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { FaChevronRight } from "react-icons/fa6";

const Page = () => {
  const t = useTranslations("Centers");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex justify-center items-start sm:my-10 my-6 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
        <div className="w-full flex_start">
          <SubHeader title={t("lang_center")} alt={false} />
        </div>
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative sm:mt-14 mt-6">
          <div className="absolute lg:-top-14 top-10 ltr:left-10 right-10 sm:flex hidden flex-col max-w-[520px] z-10 p-4">
            <h2 className="bg-primary  text-white text-xl font-semibold z-10 p-5">
              {t("build_edu")}
            </h2>
            <div className="triangle -mt-14 rotate-90"></div>
          </div>
          <Image
            src={"/images/center.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
        </div>
        <div className="md:w-[720px] w-full my-10 sm:h-[50px] h-[35px] grid grid-cols-3 justify-center items-center bg-lightBorder text-secondary rounded-3xl">
          <Link
            title={t("vision_mission")}
            href={`/${locale}/centers/vision-and-mission`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("vision_mission")}
          </Link>
          <Link
            title={t("news")}
            href={`/${locale}/centers/news`}
            className="opacity-70 flex_center sm:text-lg text-sm font-medium"
          >
            {t("staff")}
          </Link>
          <p className="bg-primary text-white rounded-3xl h-full flex_center sm:text-lg text-sm font-medium">
            {t("news")}
          </p>
        </div>
        <div className="flex_start w-full flex-col gap-10">
          <h2 className="md:text-3xl relative text-lg font-semibold ">
            <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
            <span className="z-10 relative">{t("center_news")}</span>
          </h2>
          <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8">
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
      </div>
    </div>
  );
};

export default Page;
