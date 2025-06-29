import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <div className="w-full flex_center flex-col gap-5 py-10 px-5 bg-primary text-white">
      <p className="text-sm opacity-50">{t("connect_with_us")}</p>
      <h1 className="sm:text-6xl text-2xl text-center max-w-[35ch] font-semibold">
        {t("empower_future_text")}
      </h1>
      <div className="flex_start sm:gap-10 gap-14 mt-10 flex-wrap">
        <div className="flex_start flex-col gap-3">
          <h3 className="text-lg font-medium">{t("academics")}</h3>
          <Link href={"/"} className="opacity-50">
            {t("institutions")}
          </Link>
          <Link href={"/"} className="opacity-50">
            {t("colleges")}
          </Link>
          <Link href={"/"} className="opacity-50">
            {t("centers")}
          </Link>
        </div>
        <div className="flex_start flex-col gap-3">
          <h3 className="text-lg font-medium">{t("about")}</h3>
          <Link href={"/"} className="opacity-50">
            {t("history")}
          </Link>
          <Link href={"/"} className="opacity-50">
            {t("president_speech")}
          </Link>
          <Link href={"/"} className="opacity-50">
            {t("academic_staff")}
          </Link>
        </div>
        <div className="flex_start flex-col gap-3">
          <h3 className="text-lg font-medium">{t("relations")}</h3>
          <Link href={"/"} className="opacity-50">
            {t("strategy")}
          </Link>
          <Link href={"/"} className="opacity-50">
            MOUs
          </Link>
          <Link href={"/"} className="opacity-50">
            {t("contact_us")}
          </Link>
        </div>
      </div>
      <div className="max-w-[1024px] w-full flex justify-between items-center gap-3 mt-10 px-4 md:flex-row flex-col">
        <div className="lg:w-[200px] sm:w-[150px] w-[200px] lg:h-[50px] h-[40px] relative">
          <Image
            src={"/images/logo-alt.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-auto"
          />
        </div>
        <span className="opacity-80 lg:text-base text-sm">
          {t("copyright")}
        </span>
        <div className="flex_center gap-5">
          <a
            href="/"
            className="lg:w-12 w-10 lg:h-12 h-10 border border-white rounded-full flex_center"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="/"
            className="lg:w-12 w-10 lg:h-12 h-10 border border-white rounded-full flex_center"
          >
            <FaFacebookF />
          </a>
          <a
            href="/"
            className="lg:w-12 w-10 lg:h-12 h-10 border border-white rounded-full flex_center"
          >
            <FaInstagram />
          </a>
          <a
            href="/"
            className="lg:w-12 w-10 lg:h-12 h-10 border border-white rounded-full flex_center"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </div>
  );
}
