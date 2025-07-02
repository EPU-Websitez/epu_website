"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronRight } from "react-icons/fa6";

const Page = () => {
  const t = useTranslations("Centers");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex justify-center items-start mt-20 min-h-screen">
      <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-5 w-full">
        <SubHeader title={t("head")} alt={false} />
        <div className="mt-10 pb-10 border-b w-full border-b-lightBorder flex justify-between items-start gap-5">
          <div className="flex_start flex-col gap-5">
            <h2 className="md:text-titleNormal text-lg font-semibold">
              {t("lang_center")}
            </h2>
            <p className="font-medium md:text-base text-sm">{t("build_edu")}</p>
          </div>
          <Link
            href={`/${locale}/centers/vision-and-mission`}
            className="text-lg w-10 h-10 rounded-full bg-golden flex_center text-white flex-shrink-0"
          >
            <FaChevronRight className="rtl:rotate-180" />
          </Link>
        </div>
        <div className="mt-10 pb-10 border-b w-full border-b-lightBorder flex justify-between items-start gap-5">
          <div className="flex_start flex-col gap-5">
            <h2 className="md:text-titleNormal text-lg font-semibold">
              {t("news_center")}
            </h2>
            <p className="font-medium md:text-base text-sm">{t("build_edu")}</p>
          </div>
          <Link
            href={`/${locale}/centers/news`}
            className="text-lg w-10 h-10 rounded-full bg-golden flex_center text-white flex-shrink-0"
          >
            <FaChevronRight className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
