"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import SubHeader from "@/components/subHeader";
import {
  FaPhoneAlt,
  FaClock,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
  FaTelegramPlane,
} from "react-icons/fa";
import CollegeMapComponent from "@/components/CollegeMapComponent ";

const ContactClient = () => {
  const t = useTranslations("Contact");
  const params = useParams();
  const locale = params?.locale as string;

  // Social Links mapping
  const socials = [
    {
      icon: <FaFacebookF />,
      href: "https://facebook.com/epuerbil",
      color: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    },
    {
      icon: <FaInstagram />,
      href: "https://instagram.com/epuerbil",
      color: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-transparent",
    },
    {
      icon: <FaLinkedinIn />,
      href: "https://linkedin.com/school/erbil-polytechnic-university",
      color: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
    },
    {
      icon: <FaYoutube />,
      href: "https://youtube.com/epuerbil",
      color: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
    },
    {
      icon: <FaTwitter />,
      href: "https://x.com/epu_erbil",
      color: "hover:bg-[#000000] hover:text-white hover:border-[#000000]",
    },
    {
      icon: <FaTelegramPlane />,
      href: "https://t.me/epuerbil",
      color: "hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]",
    },
  ];

  return (
    <div className="w-full flex_center flex-col sm:mb-16 mb-8 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-10">
        
        {/* Dynamic Page Header */}
        <SubHeader title={t("title")} alt={false} />

        {/* Hero Banner Area */}
        <div className="w-full relative rounded-3xl overflow-hidden bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-blue p-8 sm:p-12 text-white shadow-lg select-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="relative z-10 max-w-[700px] text-start space-y-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {t("head")}
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Two Column Side-by-Side Layout: Cards (Span 5) & Map (Span 7) */}
        <div className="w-full grid lg:grid-cols-12 grid-cols-1 gap-8 items-stretch">
          
          {/* Left Column: Information Cards (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            
            {/* Phone Numbers Card */}
            <div className="flex_start flex-col gap-5 rounded-3xl border border-lightBorder p-6 bg-white hover:shadow-md transition-all duration-300 text-start w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-golden/10 flex_center text-golden text-base">
                  <FaPhoneAlt />
                </div>
                <h3 className="font-bold text-secondary text-lg">
                  {t("phone_numbers")}
                </h3>
              </div>
              <div className="space-y-3.5 w-full">
                <div className="flex justify-between items-center border-b border-lightBorder/50 pb-2.5">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                    {t("reception")}
                  </span>
                  <a
                    href="tel:+9647504451234"
                    className="text-sm font-bold text-secondary hover:text-primary transition-colors dir-ltr"
                  >
                    +964 750 445 1234
                  </a>
                </div>
                <div className="flex justify-between items-center border-b border-lightBorder/50 pb-2.5">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                    {t("presidency_office")}
                  </span>
                  <a
                    href="tel:+964662261234"
                    className="text-sm font-bold text-secondary hover:text-primary transition-colors dir-ltr"
                  >
                    +964 66 226 1234
                  </a>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                    {t("academic_affairs")}
                  </span>
                  <a
                    href="tel:+9647501234567"
                    className="text-sm font-bold text-secondary hover:text-primary transition-colors dir-ltr"
                  >
                    +964 750 123 4567
                  </a>
                </div>
              </div>
            </div>

            {/* Working Time Card */}
            <div className="flex_start flex-col gap-5 rounded-3xl border border-lightBorder p-6 bg-white hover:shadow-md transition-all duration-300 text-start w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-golden/10 flex_center text-golden text-base">
                  <FaClock />
                </div>
                <h3 className="font-bold text-secondary text-lg">
                  {t("working_time")}
                </h3>
              </div>
              <div className="space-y-3.5 w-full">
                <div className="flex justify-between items-center border-b border-lightBorder/50 pb-2.5">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                    {t("working_days")}
                  </span>
                  <span className="text-sm font-bold text-secondary">
                    {t("working_hours")}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                    {t("weekend")}
                  </span>
                  <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {t("closed")}
                  </span>
                </div>
              </div>
            </div>

            {/* Address & Location Card */}
            <div className="flex_start flex-col gap-5 rounded-3xl border border-lightBorder p-6 bg-white hover:shadow-md transition-all duration-300 text-start w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-golden/10 flex_center text-golden text-base">
                  <FaMapMarkerAlt />
                </div>
                <h3 className="font-bold text-secondary text-lg">
                  {t("address")}
                </h3>
              </div>
              <div className="w-full text-sm leading-relaxed text-secondary font-medium">
                <p className="mb-2">{t("address_value")}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <span className="font-bold uppercase tracking-wide">Email:</span>
                  <a
                    href="mailto:info@epu.edu.iq"
                    className="text-primary hover:underline font-bold"
                  >
                    info@epu.edu.iq
                  </a>
                </div>
              </div>
            </div>

            {/* Social Medias Block */}
            <div className="flex_start flex-col gap-4 rounded-3xl border border-lightBorder p-6 bg-white hover:shadow-md transition-all duration-300 text-start w-full">
              <h3 className="font-bold text-secondary text-base">
                {t("social_media")}
              </h3>
              <div className="flex flex-wrap gap-2.5 w-full">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl border border-lightBorder flex_center text-[#707070] text-sm transition-all duration-300 active:scale-[0.95] ${social.color}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Embedded Map (Span 7) */}
          <div className="lg:col-span-7 w-full min-h-[450px] lg:min-h-full rounded-3xl overflow-hidden border border-lightBorder bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="p-5 border-b border-lightBorder/50 flex items-center gap-3 text-start">
              <div className="w-8 h-8 rounded-full bg-golden/10 flex_center text-golden text-sm">
                <FaMapMarkerAlt />
              </div>
              <h3 className="font-bold text-secondary text-base">
                {t("address")} - Erbil Main Campus
              </h3>
            </div>
            <div className="flex-1 w-full relative bg-slate-50 min-h-[350px]">
              <CollegeMapComponent
                lat={36.1911487}
                lng={44.0298319}
                title="Erbil Polytechnic University Presidency"
                address={t("address_value")}
                className="w-full h-full rounded-b-3xl absolute inset-0"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactClient;
