import { Metadata } from "next";

import EpuLogoDefinitionClient from "./EpuLogoDefinitionClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

  return {
    metadataBase: new URL(baseUrl),
    title: "EPU Logo Definition | Erbil Polytechnic University",
    description:
      "Download the official EPU logos and read the logo definition documents in English and Kurdish.",
    openGraph: {
      title: "EPU Logo Definition | Erbil Polytechnic University",
      description:
        "Download the official EPU logos and read the logo definition documents in English and Kurdish.",
      url: `/${locale}/epu-logo-definition`,
      siteName: "Erbil Polytechnic University",
      images: [
        {
          url: "/downloads/epu-logo/EPU-Logo-1.png",
          width: 1200,
          height: 630,
          alt: "Erbil Polytechnic University Logo",
        },
      ],
      locale: locale,
      type: "website",
    },
  };
}

export default function EpuLogoDefinitionPage() {
  return <EpuLogoDefinitionClient />;
}
