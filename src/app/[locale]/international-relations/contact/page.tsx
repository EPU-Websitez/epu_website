"use client";

import InternationalRelationsHeader from "@/components/InternationalRelationsHeader";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import {
  FaGlobe,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShareAlt,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Link from "next/link";
import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------

interface Image {
  id: number;
  original: string;
  lg: string;
}

interface Contact {
  id: number;
  type: "EMAIL" | "PHONE" | "ADDRESS" | "WEBSITE" | "SOCIAL_MEDIA";
  value: string;
}

interface InternationalRelation {
  id: number;
  contacts: Contact[];
}

interface InternationalRelationResponse {
  data: InternationalRelation[];
}

// -------- Components --------

const ContactCardSkeleton = () => (
  <div className="flex flex-col items-center gap-4 bg-backgroundSecondary rounded-3xl p-8 border border-lightBorder animate-pulse">
    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
    <div className="h-6 bg-gray-200 rounded w-24"></div>
    <div className="h-4 bg-gray-200 rounded w-48"></div>
  </div>
);

const ContactPage = () => {
  const t = useTranslations("International");
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params?.locale as string;
  const id = searchParams.get("id");

  const { data: relationData, loading } =
    useFetch<InternationalRelationResponse>(
      id
        ? `${process.env.NEXT_PUBLIC_API_URL}/website/international-relations?page=1&limit=1`
        : "",
      locale,
    );

  const mainRelation = relationData?.data?.[0];
  const contacts = mainRelation?.contacts || [];

  const iconMap = {
    EMAIL: <FiMail />,
    PHONE: <FaPhoneAlt />,
    ADDRESS: <FaMapMarkerAlt />,
    WEBSITE: <FaGlobe />,
    SOCIAL_MEDIA: <FaShareAlt />,
  };

  const getHref = (contact: Contact) => {
    switch (contact.type) {
      case "EMAIL":
        return `mailto:${contact.value}`;
      case "PHONE":
        return `tel:+964${contact.value.startsWith("0") ? contact.value.substring(1) : contact.value}`;
      case "WEBSITE":
      case "SOCIAL_MEDIA":
        return contact.value.startsWith("http")
          ? contact.value
          : `https://${contact.value}`;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex_center flex-col sm:mb-10 mb-5 mt-5">
      <div className="max-w-[1045px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("international_relations")} alt={false} />
        <InternationalRelationsHeader />
        <h2 className="relative sm:text-titleNormal text-lg text-secondary font-semibold">
          <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
          <span className="z-10 relative">{t("contact")}</span>
        </h2>
        <div className="w-full flex flex-col gap-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <ContactCardSkeleton key={i} />
              ))
            ) : contacts.length > 0 ? (
              contacts.map((contact) => {
                const href = getHref(contact);
                const Tag = href ? "a" : "div";

                return (
                  <Tag
                    key={contact.id}
                    href={href || undefined}
                    target={
                      href &&
                      !href.startsWith("mailto") &&
                      !href.startsWith("tel")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      href &&
                      !href.startsWith("mailto") &&
                      !href.startsWith("tel")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex flex-col items-center text-center gap-4 bg-backgroundSecondary rounded-3xl p-8 border border-lightBorder hover:border-golden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-golden/10 flex items-center justify-center text-golden text-2xl group-hover:scale-110 group-hover:bg-golden group-hover:text-white transition-all duration-300">
                      {iconMap[contact.type]}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-secondary font-bold text-lg">
                        {t(contact.type)}
                      </span>
                      <p className="text-secondary opacity-70 break-all text-sm group-hover:opacity-100 transition-opacity">
                        {contact.type === "PHONE" &&
                        !contact.value.startsWith("+964")
                          ? `+964 ${contact.value}`
                          : contact.value}
                      </p>
                    </div>
                  </Tag>
                );
              })
            ) : (
              <div className="col-span-full py-10 text-center text-secondary opacity-70">
                {t("no_data_found")}
              </div>
            )}
          </div>
        </div>

        {/* Static Mobile Navigation */}
        <div className="sm:hidden flex justify-start items-start flex-col gap-4 flex-shrink-0 w-full mt-10">
          <Link
            href={`/${locale}/international-relations?id=${id}`}
            title={t("about")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("about")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/directory-structure?id=${id}`}
            title={t("directory_structure")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("directory_structure")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/news?id=${id}`}
            title={t("news")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("news")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/international-relations/office-staff?id=${id}`}
            title={t("office_staff")}
            className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-secondary opacity-70 border-lightBorder"
          >
            <span>{t("office_staff")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </Link>
          <div className="w-full h-[45px] flex items-center justify-between border px-3 bg-background rounded-3xl text-primary border-primary">
            <span>{t("contact")}</span>
            <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
