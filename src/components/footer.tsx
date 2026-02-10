"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

// Define props interface if needed, or inline
export default function Footer({ version }: { version: string }) {
  const t = useTranslations("Footer");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="w-full flex_center flex-col gap-5 py-10 px-5 bg-primary text-white">
      <p className="text-sm uppercase opacity-50 tracking-wide">
        {t("connect_with_us")}
      </p>
      <h1 className="sm:text-[50px] leading-relaxed text-2xl text-center max-w-[35ch] font-semibold">
        {t("empower_future_text")}
      </h1>
      <div className="flex_start sm:gap-20 gap-14 mt-10 flex-wrap">
        <div className="flex_start flex-col gap-3">
          <h3 className="text-lg font-medium">{t("academics")}</h3>
          <Link
            href={`/${locale}/colleges?type=INSTITUTE`}
            className="opacity-50"
            title={t("institutions")}
          >
            {t("institutions")}
          </Link>
          <Link
            href={`/${locale}/colleges`}
            className="opacity-50"
            title={t("colleges")}
          >
            {t("colleges")}
          </Link>
          <Link
            href={`/${locale}/centers`}
            className="opacity-50"
            title={t("centers")}
          >
            {t("centers")}
          </Link>
        </div>
        <div className="flex_start flex-col gap-3">
          <h3 className="text-lg font-medium">{t("about")}</h3>
          <Link
            href={`/${locale}/about`}
            title={t("history")}
            className="opacity-50"
          >
            {t("history")}
          </Link>
          <Link
            href={`/${locale}/president-speech`}
            title={t("president_speech")}
            className="opacity-50"
          >
            {t("president_speech")}
          </Link>
          <Link
            href={`/${locale}/academic-staff`}
            title={t("academic_staff")}
            className="opacity-50"
          >
            {t("academic_staff")}
          </Link>
        </div>
        <div className="flex_start flex-col gap-3">
          <h3 className="text-lg font-medium">{t("relations")}</h3>
          <Link
            href={`/${locale}/international-strategy`}
            className="opacity-50"
            title={t("strategy")}
          >
            {t("strategy")}
          </Link>
          <Link
            href={`/${locale}/memorandum-of-understanding`}
            className="opacity-50"
            title="MOUs"
          >
            MOUs
          </Link>
          {/* <Link href={`/${locale}/centers`} className="opacity-50">
            {t("contact_us")}
          </Link> */}
        </div>
      </div>
      <div className="max-w-[1024px] w-full border-t border-t-white border-opacity-30 pt-10 flex justify-between items-center gap-3 mt-5 px-4 md:flex-row flex-col">
        <div className="w-[150px] sm:w-[200px]  lg:h-[50px] h-[40px] relative">
          <Image
            src={"/images/logo-alt.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-auto"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="opacity-80 text-sm">{t("copyright")}</span>
          <span className="opacity-60 text-xs mt-1">v{version}</span>
        </div>
        <div className="flex_center gap-5">
          {/* <a
            href="https://www.facebook.com/epu.education"
            title="EPU Facebook"
            ref="noopener noreferrer"
            target="_blank"
            className="lg:w-12 w-10 lg:h-12 h-10 border border-white border-opacity-50 rounded-full flex_center"
          >
            <FaLinkedinIn />
          </a> */}
          <a
            href="https://www.facebook.com/epu.education"
            title="EPU Facebook"
            rel="noopener noreferrer"
            target="_blank"
            className="lg:w-12 w-10 lg:h-12 h-10 border border-white border-opacity-50 rounded-full flex_center"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/epolytechnicuni/?hl=en"
            title="EPU Facebook"
            rel="noopener noreferrer"
            target="_blank"
            className="lg:w-12 w-10 lg:h-12 h-10 border border-white border-opacity-50 rounded-full flex_center"
          >
            <FaInstagram />
          </a>
          {/* <a
            href="/"
            className="lg:w-12 w-10 lg:h-12 h-10 border border-white border-opacity-50 rounded-full flex_center"
          >
            <FaYoutube />
          </a> */}
        </div>
      </div>
    </div>
  );
}
