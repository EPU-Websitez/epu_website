"use client";
import { TbExternalLink } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { IoArrowForwardOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useTranslations } from "next-intl";
import { HiOutlineLink } from "react-icons/hi2";

interface ResearchModalProps {
  handleClick: () => void;
}

const ResearchModal: React.FC<ResearchModalProps> = ({ handleClick }) => {
  const t = useTranslations("ResearchesAndPublications");
  return (
    <div className="flex md:justify-center justify-start md:items-center items-start fixed top-0 left-0 w-full h-full z-20 overflow-y-auto">
      <div className="bg-white flex_start flex-col gap-5 z-10 md:w-[778px] w-full md:rounded-3xl rounded-none overflow-hidden">
        <div className="flex justify-between items-center gap-2 w-full bg-golden text-white p-6">
          <h3 className="md:text-smallTitle text-lg font-semibold">
            {t("research_detail")}
          </h3>
          <button
            type="button"
            onClick={() => handleClick()}
            className="text-3xl"
          >
            <IoMdClose />
          </button>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full p-6">
          <div className="flex_start flex-col gap-5">
            <div className="flex_start gap-1 flex-col">
              <span className="text-black opacity-60 text-sm">
                {t("research_title")}
              </span>
              <p className="text-secondary font-medium">
                Innovative Approaches to Renewable Energy Integration in Urban
                Infrastructure
              </p>
            </div>
            <div className="flex_start gap-1 flex-col">
              <span className="text-black opacity-60 text-sm">
                {t("research_description")}
              </span>
              <p className="text-secondary font-medium">
                Breast cancer is one of the worlds leading causes of mortality
                in women and is due to uncontrollable breast cell growth. Early
                detection and proper care are the only means of avoiding deaths
                from breast cancer. The precise characterization of tumors is a
                critical task in the medica ..{" "}
                <button className="text-golden">More</button>
              </p>
            </div>
            <div className="flex_start gap-1 flex-col">
              <span className="text-black opacity-60 text-sm">
                {t("publication_date")}
              </span>
              <p className="text-secondary font-medium">07 - 01 - 2023</p>
            </div>
            <div className="flex_start gap-1 flex-col">
              <span className="text-black opacity-60 text-sm">
                {t("source")}
              </span>
              <p className="text-secondary font-medium">
                Qalaai Zanist Journal
              </p>
            </div>
          </div>
          <div className="flex_start flex-col gap-5">
            <div className="flex_start gap-1 flex-col">
              <span className="text-black opacity-60 text-sm">
                {t("supervisor")}
              </span>
              <p className="text-secondary font-medium">
                Profs. Dr. Ahmad Adnan Kamaran
              </p>
            </div>
            <div className="flex_start gap-1 flex-col">
              <span className="text-black opacity-60 text-sm">
                {t("authors")}
              </span>
              <li className="text-secondary font-medium list-disc">
                Sanarya Hamakarim Ali
              </li>
              <li className="text-secondary font-medium list-disc">
                Sanarya Hamakarim Ali
              </li>
              <li className="text-secondary font-medium list-disc">
                Sanarya Hamakarim Ali
              </li>
            </div>
            <div className="flex_start gap-1 flex-col">
              <span className="text-black opacity-60 text-sm">
                {t("research_type")}
              </span>
              <p className="text-secondary font-medium">Conference Paper</p>
            </div>
            <div className="flex_start gap-1 flex-col">
              <span className="text-black opacity-60 text-sm">
                {t("pages")}
              </span>
              <p className="text-secondary font-medium">878-902</p>
            </div>
            <div className="flex_start gap-1 flex-col">
              <span className="text-black opacity-60 text-sm">
                {t("total_citations")}
              </span>
              <p className="text-secondary font-medium">878-902</p>
            </div>
            <div className="flex_start gap-1 flex-col">
              <span className="text-black opacity-60 text-sm">
                {t("attachment")}
              </span>
              <p className="text-secondary font-medium">2018 - 2019</p>
              <button className="border border-lightBorder rounded-3xl flex_center gap-4 px-2 py-1.5 text-sm">
                <span className="bg-[#81B1CE] text-white flex_center w-6 h-6 rounded-full">
                  <HiOutlineLink />
                </span>
                <span>botancv.PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => handleClick()}
        className="w-full fixed h-full left-0 top-0 bg-black bg-opacity-60"
      ></button>
    </div>
  );
};

export default ResearchModal;
