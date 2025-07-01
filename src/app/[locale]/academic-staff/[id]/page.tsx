"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaFacebookF, FaGoogleScholar, FaResearchgate } from "react-icons/fa6";
import { HiOutlineLink } from "react-icons/hi2";
import { IoMdArrowUp } from "react-icons/io";

const Page = () => {
  const t = useTranslations("AcademicStaff");
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;
  return (
    <div className="flex_center w-full flex-col">
      <div className="max-w-[1380px] w-full relative flex_center flex-col gap-5 sm:px-2 px-5 text-secondary">
        <div className="relative w-full h-[276px]">
          <Image
            src="/images/bg.png"
            alt="title"
            fill
            priority
            className="w-full h-auto object-cover rounded-2xl"
          />
        </div>
        <div className="flex_start lg:w-[1024px] w-auto absolute lg:left-1/2 md:left-[12%] sm:left-[18%] left-[22%] -translate-x-1/2 sm:top-[180px] top-[220px]">
          <div className="sm:w-[215px] w-[115px] sm:h-[215px] h-[115px] flex_center relative rounded-full bg-white">
            <div className="flex_center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-[200px] w-[100px] sm:h-[200px] h-[100px] rounded-full">
              <Image
                src="/images/president-alt.png"
                alt="title"
                fill
                priority
                className="w-full h-auto object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="flex_start max-w-[1024px] px-2 sm:mt-32 mt-16 w-full flex-col gap-4">
          <span className="text-sm font-medium">
            Assistant Professor Doctor
          </span>
          <h3 className="text-xl font-semibold">Kayhan Zrar Ghafoor</h3>
          <div className="flex w-full justify-between lg:items-center items-start lg:gap-2 gap-6 mt-3 lg:flex-row flex-col">
            <div className="flex sm:justify-center justify-start sm:items-center items-start gap-3 sm:flex-row flex-col">
              <div className="flex_center gap-3 rounded-xl border-golden border text-golden px-3 py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden text-sm"></span>
                <p>Vice President for Scientific</p>
              </div>
              <div className="flex_center gap-3 rounded-xl border-golden border text-golden px-3 py-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-golden text-sm"></span>
                <p> Postgraduate Affairs</p>
              </div>
            </div>
            <div className="flex sm:justify-center justify-start sm:items-center items-start gap-3 sm:flex-nowrap flex-wrap">
              <Link
                href=""
                className="flex_center gap-2 rounded-xl sm:px-3 px-2 py-1.5 border border-lightBorder text-sm"
              >
                <span>Academic Staff Portal</span>
                <IoMdArrowUp className="rotate-45" />
              </Link>
              <a
                href=""
                className="rounded-xl sm:px-3 px-2 py-1.5 border border-lightBorder text-sm"
              >
                botan@epu.edu.iq
              </a>
              <a
                href=""
                className="rounded-full flex_center w-10 h-10 border border-lightBorder hover:bg-lightBorder"
              >
                <FaFacebookF />
              </a>
              <a
                href=""
                className="rounded-full flex_center w-10 h-10 border border-lightBorder hover:bg-lightBorder"
              >
                <FaGoogleScholar />
              </a>
              <a
                href=""
                className="rounded-full flex_center w-10 h-10 border border-lightBorder hover:bg-lightBorder"
              >
                <FaResearchgate />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-14 w-full flex_center flex-col text-secondary">
        <div className="max-w-[1024px] w-full flex_start sm:gap-5 gap-3 overflow-x-auto hide_scroll sm:px-0 px-5">
          <p className="border-b border-b-secondary px-3 sm:text-base text-sm flex-shrink-0 font-semibold">
            {t("about")}
          </p>
          <Link
            href={`/${locale}/academic-staff/${id}/teaching`}
            title={t("teaching")}
            className=" opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("teaching")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/education`}
            title={t("education")}
            className=" opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("education")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/professional-engagement`}
            title={t("professional_engagement")}
            className=" opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("professional_engagement")}
          </Link>
          <Link
            href={`/${locale}/academic-staff/${id}/academics`}
            title={t("academics")}
            className="  opacity-70 px-3 sm:text-base text-sm flex-shrink-0"
          >
            {t("academics")}
          </Link>
        </div>
        <div className="w-full bg-backgroundSecondary border-t-lightBorder border-t pb-20 flex_center  sm:px-0 px-5">
          <div className="mt-10 flex_start md:flex-row flex-col gap-10 max-w-[1024px] w-full px-2">
            <div className="bg-background flex_start md:flex-col flex-row md:flex-nowrap flex-wrap p-4 rounded-3xl gap-5 md:max-w-[335px] max-w-full md:w-auto w-full flex-shrink-0">
              <div className="flex_start flex-col gap-2">
                <span className="text-xs text-black text-opacity-60">
                  {t("general_specialization")}
                </span>
                <p className="text-sm font-semibold">Civil Engineering</p>
              </div>
              <div className="flex_start flex-col gap-2">
                <span className="text-xs text-black text-opacity-60">
                  {t("specific_specialization")}
                </span>
                <p className="text-sm font-semibold">
                  Transportation Planning and Design
                </p>
              </div>
              <div className="flex_start flex-col gap-2">
                <span className="text-xs text-black text-opacity-60">
                  {t("lecturer_at")}
                </span>
                <p className="text-sm font-semibold">
                  Erbil Technology College - Department of Road Construction
                </p>
              </div>
              <div className="flex_start flex-col gap-2">
                <span className="text-xs text-black text-opacity-60">
                  {t("curriculum_vitae")}
                </span>
                <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                  <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                    <HiOutlineLink />
                  </span>
                  <span>botancv.PDF</span>
                </button>
              </div>
            </div>
            <div className="flex_start flex-col gap-8">
              <h2 className="text-2xl font-semibold">{t("biography")}</h2>
              <p className="lg:text-lg sm:text-base text-sm text-justify max-w-[635px]">
                Botan Majeed Ahmad AL-Hadad is an academic staff at Erbil
                Polytechnic University (EPU). He is acting as Dean for Erbil
                Technology Intitute (ETI). He has been working as academic since
                1995. Botan AL-Hadad achieved BSc in Civil Engineering in Mosul
                University (Mosul, Iraq) in 1992 then MSc at Salahaddin
                University (Erbil, Iraq) in 1995. His PhD thesis from
                The Universityof Nottingham, UK (2011) introduces a novel
                technique for highway alignment development. Outside the admin
                and office working hours, he spends a plenty of time focusing on
                research in his interested field of highway alignment
                optimization problem. He has taught and supervised MSc students
                and has been a member in several MSc thesis viva committees.
                Botan AL-Hadad has participated in a number of scientific
                international conferences inside and outside the country and
                published several articles. Moreover, he has worked as co-chair,
                reviewers, and in the scientific committees in several
                engineering conferences. He is currently interested and working
                on research projects that deal with using GIS as an assistant
                tool in genetic algorithm based highway alignment optimization
                problems. Besides, sustainability has become of his great
                interest especially in highway alignment planning. For him,
                sustainability concern constitutes a major part for every single
                human’s activities and real life projects. You can reach him via
                email address (botan@epu.edu.iq).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
