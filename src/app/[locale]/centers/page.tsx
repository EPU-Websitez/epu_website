import type { Metadata } from "next";
import { process.env.NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import CentersClient from "./CentersClient"; // Import the client component

// --- Server-side function to generate STATIC metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageTitle = "University Centers | EPU";
  const pageDescription =
    "Explore the various research and development centers at Erbil Polytechnic University.";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

  return {
    metadataBase: new URL(baseUrl),
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/${locale}/centers`,
      siteName: "Erbil Polytechnic University",
      images: [
        {
          url: "/small-logo.png",
          width: 1200,
          height: 630,
          alt: "Erbil Polytechnic University Logo",
        },
      ],
    },
  };
}

// --- The default export renders the client component ---
export default function CentersPage() {
  return <CentersClient />;
}
