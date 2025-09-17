"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GoArrowRight } from "react-icons/go";

export default function UsefulLink() {
  const t = useTranslations("Footer");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="w-full">
      <div className="relative w-full sm:h-[450px] h-[500px] flex_center">
        <Image
          src={"/images/footer.png"}
          alt="My Image"
          fill
          priority
          className="w-full h-auto object-cover opacity-25"
        />
        <div className="flex sm:justify-between justify-center sm:flex-row flex-col sm:items-center sm:gap-5 gap-8 items-start h-full max-w-[1000px] w-full z-10 px-3">
          <div className="flex_start flex-col sm:gap-8 gap-3">
            <p className="text-secondary">{t("you_may_also_like")}</p>
            <h1 className="md:text-[54px] text-3xl max-w-[15ch] text-secondary font-semibold leading-normal">
              {t("most_useful_links")}
            </h1>
          </div>
          <div className="sm:w-1/2 w-full flex_start flex-col gap-2">
            <Link
              href={`/${locale}/colleges`}
              title="colleges"
              className="w-full flex justify-between items-center px-2 text-secondary border-b border-b-secondary border-opacity-30 py-3 relative group"
            >
              <h3 className="text-lg font-semibold">{t("colleges")}</h3>
              <GoArrowRight className="text-xl" />
              <span className="absolute max-w-0 duration-200 bg-primary bg-opacity-5 h-full group-hover:max-w-full w-full left-0 top-0"></span>
            </Link>

            <Link
              href={`/${locale}/colleges?type=INSTITUTE`}
              title="Centers"
              className="w-full flex justify-between items-center px-2 text-secondary border-b border-b-secondary border-opacity-30 py-3 relative group"
            >
              <h3 className="text-lg font-semibold">{t("institutions")}</h3>
              <GoArrowRight className="text-xl" />
              <span className="absolute max-w-0 duration-200 bg-primary bg-opacity-5 h-full group-hover:max-w-full w-full left-0 top-0"></span>
            </Link>

            <Link
              href={`/${locale}/programs`}
              title="programs"
              className="w-full flex justify-between items-center px-2 text-secondary border-b border-b-secondary border-opacity-30 py-3 relative group"
            >
              <h3 className="text-lg font-semibold">{t("EPU_programs")}</h3>
              <GoArrowRight className="text-xl" />
              <span className="absolute max-w-0 duration-200 bg-primary bg-opacity-5 h-full group-hover:max-w-full w-full left-0 top-0"></span>
            </Link>

            <Link
              href={`/${locale}/academic-staff`}
              className="w-full flex justify-between items-center px-2 text-secondary border-b border-b-secondary border-opacity-30 py-3 relative group"
            >
              <h3 className="text-lg font-semibold">{t("academic_staff")}</h3>
              <GoArrowRight className="text-xl" />
              <span className="absolute max-w-0 duration-200 bg-primary bg-opacity-5 h-full group-hover:max-w-full w-full left-0 top-0"></span>
            </Link>
            <a
              href="https://conferences.epu.edu.iq/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex justify-between items-center px-2 text-secondary border-b border-b-secondary border-opacity-30 py-3 relative group"
            >
              <h3 className="text-lg font-semibold">{t("conferences")}</h3>
              <GoArrowRight className="text-xl" />
              <span className="absolute max-w-0 duration-200 bg-primary bg-opacity-5 h-full group-hover:max-w-full w-full left-0 top-0"></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
