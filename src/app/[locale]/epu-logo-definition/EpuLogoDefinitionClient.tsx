"use client";

import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";

interface LogoItem {
  src: string;
  download: string;
  label: string;
}

interface DocItem {
  href: string;
  label: string;
  filename: string;
}

const EpuLogoDefinitionClient = () => {
  const t = useTranslations("EpuLogoDefinition");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const logos: LogoItem[] = [
    {
      src: "/downloads/epu-logo/EPU-Logo-1.png",
      download: "EPU-Logo-1.png",
      label: t("logo_horizontal"),
    },
    {
      src: "/downloads/epu-logo/EPU-Logo-2.png",
      download: "EPU-Logo-2.png",
      label: t("logo_vertical"),
    },
  ];

  const docs: DocItem[] = [
    {
      href: "/downloads/epu-logo/EPU-Logo-Definition-English.docx",
      filename: "EPU-Logo-Definition-English.docx",
      label: t("doc_english"),
    },
    {
      href: "/downloads/epu-logo/EPU-Logo-Definition-Kurdish.docx",
      filename: "EPU-Logo-Definition-Kurdish.docx",
      label: t("doc_kurdish"),
    },
  ];

  const officeViewerUrl = (doc: DocItem) =>
    origin
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          `${origin}${doc.href}`,
        )}`
      : "";

  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] sm:px-3 px-5 w-full flex_start flex-col gap-10">
        <SubHeader title={t("head")} alt={false} />

        <p className="text-secondary text-opacity-80 sm:text-base text-sm leading-relaxed">
          {t("description")}
        </p>

        {/* Logos section */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="sm:text-3xl text-2xl font-semibold text-secondary">
            {t("logos_title")}
          </h2>
          <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-6">
            {logos.map((logo) => (
              <div
                key={logo.download}
                className="w-full flex flex-col items-center gap-4 border border-gray-200 rounded-2xl p-6 bg-white"
              >
                <div className="relative w-full h-56 flex_center">
                  <Image
                    src={logo.src}
                    alt={logo.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-secondary font-medium">{logo.label}</span>
                <a
                  href={logo.src}
                  download={logo.download}
                  className="flex_center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity"
                >
                  <FiDownload />
                  {t("download")}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Documents section */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="sm:text-3xl text-2xl font-semibold text-secondary">
            {t("documents_title")}
          </h2>
          <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-6">
            {docs.map((doc) => (
              <div
                key={doc.filename}
                className="w-full flex flex-col gap-4 border border-gray-200 rounded-2xl p-4 bg-white"
              >
                <div className="flex items-center gap-3 px-2 pt-2">
                  <FiFileText className="text-primary text-3xl shrink-0" />
                  <span className="text-secondary font-medium">
                    {doc.label}
                  </span>
                </div>

                <div className="w-full h-[500px] bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  {officeViewerUrl(doc) ? (
                    <iframe
                      src={officeViewerUrl(doc)}
                      className="w-full h-full"
                      title={doc.label}
                    />
                  ) : (
                    <div className="w-full h-full flex_center text-secondary text-opacity-70 text-sm">
                      {t("loading_preview")}
                    </div>
                  )}
                </div>

                <div className="flex justify-end px-2 pb-2">
                  <a
                    href={doc.href}
                    download={doc.filename}
                    className="flex_center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity"
                  >
                    <FiDownload />
                    {t("download")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpuLogoDefinitionClient;
