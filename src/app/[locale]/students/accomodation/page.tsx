"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";

const Page = () => {
  const t = useTranslations("Students");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-5 w-full">
        <SubHeader title={t("accomodation")} alt={false} />
        <div className="w-full lg:h-[373px] h-[290px] relative sm:mt-10 mt-5 rounded-3xl overflow-hidden">
          <Image
            src={"/images/accomodation.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <p className="md:text-lg text-base opacity-70">
          {t("accomodation_text")}
        </p>
      </div>
    </div>
  );
};
export default Page;
