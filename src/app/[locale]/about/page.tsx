import { Metadata } from "next";
import { API_URL, NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import AboutPageClient from "./AboutPageClient"; // Import the new client component

// --- Interface for the API data needed for metadata ---
interface AboutUsData {
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

    const response = await fetch(`${API_URL}/website/universities/about-us`, {
      headers: { "website-language": locale || "en" },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) throw new Error("Failed to fetch metadata");

    const aboutData: AboutUsData = await response.json();
    const pageTitle = "About | EPU";
    const pageDescription =
      aboutData.description ||
      "Learn about the history, mission, and values of Erbil Polytechnic University.";

    const baseUrl = NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/about`,
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
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDescription,
        images: ["/small-logo.png"],
      },
      alternates: {
        canonical: `/${locale}/about`,
        languages: {
          en: "/en/about",
          ar: "/ar/about",
          ku: "/ku/about",
        },
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "About EPU",
      description: "Learn about the history of Erbil Polytechnic University.",
    };
  }
}

// --- The default export is a simple server component ---
export default async function AboutPage() {
  return <AboutPageClient />;
}
