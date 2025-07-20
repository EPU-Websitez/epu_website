"use client";

import CollegeHeader from "@/components/collegeHeader";
import MemberCard from "@/components/memberCard";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-10 w-full">
        <SubHeader title={t("labs")} alt={false} />

        <div className="grid w-full md:grid-cols-2 grid-cols-1 gap-5">
          <Link
            href={`/${locale}/colleges/labs/1`}
            className="w-full text-white group lg:h-[385px] md:h-[320px] h-[240px] relative rounded-3xl overflow-hidden"
          >
            <Image
              src={`/images/lab.png`}
              className="object-cover"
              alt="park"
              fill
              priority
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#1B417B8A] to-transparent z-10 group-hover:bg-primary duration-200 group-hover:bg-opacity-40"></div>
            <Link
              href={`/${locale}/colleges/labs/1`}
              title="title"
              className="flex_center text-sm rounded-lg border border-white gap-3 z-20 absolute ltr:left-10 rtl:right-10 bottom-5 px-4 py-2 opacity-0 group-hover:opacity-100 duration-300"
            >
              <span>{t("read_more")}</span>
              <FaArrowRight className="text-lg rtl:rotate-180" />
            </Link>
            <h3 className="z-20 absolute ltr:left-5 rtl:right-5 bottom-5 leading-normal md:group-hover:bottom-[70%] group-hover:bottom-[60%] px-4 py-2 md:text-smallTitle text-base group-hover:text-titleNormal group-hover:max-w-[200px] duration-300">
              Medical Laboratory
            </h3>
          </Link>
          <Link
            href={`/${locale}/colleges/labs/1`}
            className="w-full text-white group lg:h-[385px] md:h-[320px] h-[240px] relative rounded-3xl overflow-hidden"
          >
            <Image
              src={`/images/lab.png`}
              className="object-cover"
              alt="park"
              fill
              priority
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#1B417B8A] to-transparent z-10 group-hover:bg-primary duration-200 group-hover:bg-opacity-40"></div>
            <Link
              href={`/${locale}/colleges/labs/1`}
              title="title"
              className="flex_center text-sm rounded-lg border border-white gap-3 z-20 absolute ltr:left-10 rtl:right-10 bottom-5 px-4 py-2 opacity-0 group-hover:opacity-100 duration-300"
            >
              <span>{t("read_more")}</span>
              <FaArrowRight className="text-lg rtl:rotate-180" />
            </Link>
            <h3 className="z-20 absolute ltr:left-5 rtl:right-5 bottom-5 leading-normal md:group-hover:bottom-[70%] group-hover:bottom-[60%] px-4 py-2 md:text-smallTitle text-base group-hover:text-titleNormal group-hover:max-w-[200px] duration-300">
              Medical Laboratory
            </h3>
          </Link>
          <Link
            href={`/${locale}/colleges/labs/1`}
            className="w-full text-white group lg:h-[385px] md:h-[320px] h-[240px] relative rounded-3xl overflow-hidden"
          >
            <Image
              src={`/images/lab.png`}
              className="object-cover"
              alt="park"
              fill
              priority
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#1B417B8A] to-transparent z-10 group-hover:bg-primary duration-200 group-hover:bg-opacity-40"></div>
            <Link
              href={`/${locale}/colleges/labs/1`}
              title="title"
              className="flex_center text-sm rounded-lg border border-white gap-3 z-20 absolute ltr:left-10 rtl:right-10 bottom-5 px-4 py-2 opacity-0 group-hover:opacity-100 duration-300"
            >
              <span>{t("read_more")}</span>
              <FaArrowRight className="text-lg rtl:rotate-180" />
            </Link>
            <h3 className="z-20 absolute ltr:left-5 rtl:right-5 bottom-5 leading-normal md:group-hover:bottom-[70%] group-hover:bottom-[60%] px-4 py-2 md:text-smallTitle text-base group-hover:text-titleNormal group-hover:max-w-[200px] duration-300">
              Medical Laboratory
            </h3>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Page;
