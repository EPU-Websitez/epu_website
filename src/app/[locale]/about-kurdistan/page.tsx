import { Metadata } from "next";

import AboutKurdistanClient from "./AboutKurdistanClient"; // Import the new client component

// --- Interface for the data needed for metadata ---
interface AboutKurdistanData {
  title: string;
  description: string;
}

// --- Server-side function to generate metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  try {
    const { locale } = await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/universities/about-kurdistan`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) throw new Error("Failed to fetch metadata");

    const pageData: AboutKurdistanData = await response.json();
    const pageTitle = `${pageData.title} | EPU`;
    const pageDescription =
      pageData.description ||
      "Discover the rich culture and history of Kurdistan.";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/about-kurdistan`,
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: "/small-logo.png",
            width: 1200,
            height: 630,
            alt: "Erbil Polytechnic University Logo",
          },
        ],
        locale: locale,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "About Kurdistan | EPU",
      description: "Discover the rich culture and history of Kurdistan.",
    };
  }
}

// --- The default export renders the client component ---
export default function AboutKurdistanPage() {
  return <AboutKurdistanClient />;
}
