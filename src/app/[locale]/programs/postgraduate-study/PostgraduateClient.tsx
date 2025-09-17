"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import {
  FaAngleRight,
  FaAward,
  FaChevronDown,
  FaEnvelope,
  FaPhone,
  FaXmark,
} from "react-icons/fa6";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";
import { FaExternalLinkAlt, FaMapMarkerAlt } from "react-icons/fa";

// -------- Updated Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
}

interface ProgramItem {
  id: number;
  title: string;
  description: string;
  link: string;
  icon_image: ImageFile;
}

interface ProgramSection {
  id: number;
  title: string;
  description: string;
  items: ProgramItem[];
}

interface RequirementItem {
  id: number;
  title: string;
  description: string;
}

interface PostgraduateProgram {
  id: number;
  title: string;
  description: string;
  bg_image: ImageFile;
  sections: ProgramSection[];
  requirements: RequirementItem[];
  contact_phone: string | null;
  contact_email: string | null;
  contact_address: string | null;
}

interface PostgraduateResponse {
  data: PostgraduateProgram[];
}

// -------- Modal Component --------
const ProgramModal = ({
  item,
  onClose,
}: {
  item: ProgramItem;
  onClose: () => void;
}) => {
  const t = useTranslations("Programs");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white rounded-2xl w-[90vw] max-w-lg p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          aria-label="Close modal"
        >
          <FaXmark size={20} />
        </button>

        <a
          href={item.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-2"
        >
          {item.title}
          <FaExternalLinkAlt size={14} />
        </a>

        <p className="text-sm text-gray-600">{item.description}</p>
      </div>
    </div>
  );
};

// -------- Page Skeletons --------
const HeaderSkeleton = () => (
  <div className="w-full h-[276px] bg-gray-200 animate-pulse rounded-3xl"></div>
);
const ProgramsSectionSkeleton = () => (
  <div className="w-full bg-backgroundSecondary flex_center text-secondary animate-pulse">
    <div className="w-full flex_center mb-10 lg:px-0 px-3 max-w-[1040px] flex-col gap-10 py-10">
      <div className="h-8 w-2/3 bg-gray-200 rounded-full"></div>
      <div className="grid md:grid-cols-3 grid-cols-2 lg:gap-10 gap-5 w-full">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-300 rounded-3xl"></div>
        ))}
      </div>
      <div className="h-8 w-1/2 bg-gray-200 rounded-full mt-10"></div>
      <div className="grid md:grid-cols-3 grid-cols-2 lg:gap-10 gap-5 w-full">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-300 rounded-3xl"></div>
        ))}
      </div>
      <div className="w-full h-16 bg-gray-300 rounded-2xl mt-10"></div>
      <div className="w-full h-16 bg-gray-300 rounded-2xl"></div>
    </div>
  </div>
);

const PostgraduateClient = () => {
  const t = useTranslations("Programs");
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [openedAccordion, setOpenedAccordion] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(
    null
  );

  const programsListRef = useRef<HTMLDivElement>(null);
  const { data: programsData, loading: isLoading } =
    useFetch<PostgraduateResponse>(
      `${API_URL}/website/programs/postgraduate?page=1&limit=1&is_active=true`,
      locale
    );

  const handleAccordion = (id: number) => {
    setOpenedAccordion(openedAccordion === id ? null : id);
  };
  const handleScrollToPrograms = () => {
    programsListRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleOpenModal = (item: ProgramItem) => {
    setSelectedProgram(item);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };

  const programInfo = programsData?.data?.[0];
  const allSections = programInfo?.sections || [];
  const requirements = programInfo?.requirements || [];

  return (
    <>
      <div className="my-10 flex_center w-full flex-col gap-10">
        <div className="w-full flex_center flex-col">
          <div className="w-full flex_start mb-10 lg:px-0 px-3 max-w-[1040px]">
            <SubHeader
              title={programInfo?.title || "postgraduate"}
              alt={false}
            />
          </div>
          <div className="w-full flex_start lg:px-0 px-3 max-w-[1040px]">
            {isLoading ? (
              <HeaderSkeleton />
            ) : (
              programInfo && (
                <div className="w-full bg-primary text-white md:p-10 p-5 flex justify-between md:flex-row flex-col items-start rounded-3xl md:gap-5 gap-10">
                  <div className="flex_start md:flex-col flex-row md:flex-nowrap flex-wrap gap-5 md:max-w-[350px] max-w-full">
                    <p className="font-medium md:text-sm text-xs md:mb-0 mb-3 w-full">
                      {programInfo.description}
                    </p>

                    <div className="flex_center gap-3">
                      <div className="bg-white text-secondary flex_center md:w-[35px] w-6 md:h-[35px] flex-shrink-0 h-6 md:text-lg text-base rounded-md">
                        <FaAward />
                      </div>
                      <div className="flex_start flex-col">
                        <small className="md:text-xs text-[10px] text-white opacity-75">
                          {t("degrees")}
                        </small>
                        <p className="md:text-sm text-xs font-medium">
                          {programInfo.title}
                        </p>
                      </div>
                    </div>

                    {programInfo.contact_phone && (
                      <div className="flex_center gap-3">
                        <div className="bg-white text-secondary flex_center md:w-[35px] w-6 md:h-[35px] flex-shrink-0 h-6 md:text-lg text-base rounded-md">
                          <FaPhone />
                        </div>
                        <div className="flex_start flex-col">
                          <small className="md:text-xs text-[10px] text-white opacity-75">
                            {t("phone")}
                          </small>
                          <p className="md:text-sm text-xs font-medium">
                            {programInfo.contact_phone}
                          </p>
                        </div>
                      </div>
                    )}
                    {programInfo.contact_email && (
                      <div className="flex_center gap-3">
                        <div className="bg-white text-secondary flex_center md:w-[35px] w-6 md:h-[35px] flex-shrink-0 h-6 md:text-lg text-base rounded-md">
                          <FaEnvelope />
                        </div>
                        <div className="flex_start flex-col">
                          <small className="md:text-xs text-[10px] text-white opacity-75">
                            {t("email")}
                          </small>
                          <p className="md:text-sm text-xs font-medium">
                            {programInfo.contact_email}
                          </p>
                        </div>
                      </div>
                    )}
                    {programInfo.contact_address && (
                      <div className="flex_center gap-3">
                        <div className="bg-white text-secondary flex_center md:w-[35px] w-6 md:h-[35px] flex-shrink-0 h-6 md:text-lg text-base rounded-md">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="flex_start flex-col">
                          <small className="md:text-xs text-[10px] text-white opacity-75">
                            {t("address")}
                          </small>
                          <p className="md:text-sm text-xs font-medium">
                            {programInfo.contact_address}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="md:w-auto w-full">
                      <button
                        onClick={handleScrollToPrograms}
                        className="mt-5 rounded-3xl md:h-10 h-8 flex_center px-3 gap-2 bg-white max-w-fit"
                      >
                        <span className="text-primary font-bold md:text-sm text-xs mx-2">
                          {t("see_more")}
                        </span>
                        <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-primary text-white rounded-full">
                          <FaAngleRight className="rtl:rotate-180" />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="relative md:h-[276px] h-[192px] md:w-[420px] w-full">
                    <Image
                      src={programInfo.bg_image.lg}
                      alt={programInfo.title}
                      fill
                      priority
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
              )
            )}
          </div>

          {isLoading ? (
            <ProgramsSectionSkeleton />
          ) : (
            <div
              ref={programsListRef}
              className="w-full bg-backgroundSecondary flex_center text-secondary mt-10"
            >
              <div className="w-full flex_center mb-10 lg:px-0 px-3 max-w-[1040px] flex-col gap-10 py-10">
                {allSections.map((section) => (
                  <div
                    key={section.id}
                    className="w-full flex flex-col items-center"
                  >
                    <h2 className="md:text-xl relative sm:text-lg text-xs font-semibold mb-8">
                      <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
                      <span className="z-10 relative">{section.title}</span>
                    </h2>
                    <div className="grid md:grid-cols-3 grid-cols-2 lg:gap-10 gap-5 w-full">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          className="md:bg-background bg-backgroundSecondary md:p-5 p-0 flex_start flex-col md:gap-5 gap-3 rounded-3xl"
                        >
                          <div className="bg-golden relative text-white flex_center md:w-[35px] w-6 md:h-[35px] h-6 md:text-lg text-base rounded-md">
                            {item.icon_image ? (
                              <span className="relative w-5 h-5 flex_center">
                                <Image
                                  src={item.icon_image?.lg}
                                  alt={item.title}
                                  fill
                                  priority
                                  className="object-cover"
                                />
                              </span>
                            ) : (
                              <FaAward />
                            )}
                          </div>
                          <h4 className="text-secondary font-medium md:text-sm text-xs">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="flex justify-between items-center px-1 md:h-[42px] h-7 rounded-3xl border border-lightBorder w-full"
                          >
                            <span className="text-golden md:text-sm text-xs mx-2">
                              {t("see_details")}
                            </span>
                            <span className="md:w-6 w-5 md:h-6 h-5 flex_center bg-golden text-white rounded-full">
                              <FaAngleRight className="rtl:rotate-180" />
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {requirements && requirements.length > 0 && (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-full flex_center gap-8 mt-10">
                      <span className="w-full h-[1px] bg-lightBorder"></span>
                      <h2 className="md:text-xl text-sm font-medium text-secondary flex-shrink-0 text-center">
                        {t("application_requirements")}
                      </h2>
                      <span className="w-full h-[1px] bg-lightBorder"></span>
                    </div>
                    <div className="flex_start flex-col gap-5 w-full mt-8">
                      {requirements.map((item) => (
                        <div
                          key={item.id}
                          className={`w-full flex_start flex-col rounded-2xl text-secondary border ${
                            openedAccordion === item.id
                              ? "border-golden"
                              : "border-lightBorder"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleAccordion(item.id)}
                            className="flex justify-between items-center w-full p-5 text-left"
                          >
                            <div className="flex_center gap-4">
                              <span className="w-4 h-4 bg-golden flex-shrink-0 rounded-full relative block"></span>
                              <h3 className="font-medium md:text-base text-sm">
                                {item.title}
                              </h3>
                            </div>
                            <FaChevronDown
                              className={`duration-200 ${
                                openedAccordion === item.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <div
                            className={`flex_start duration-300 flex-col gap-5 overflow-hidden ${
                              openedAccordion === item.id
                                ? "max-h-[700px] p-5 pt-0"
                                : "max-h-0"
                            }`}
                          >
                            <p className="md:text-sm text-xs opacity-70">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && selectedProgram && (
        <ProgramModal item={selectedProgram} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default PostgraduateClient;
