import { Metadata } from "next";
import { API_URL, NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import MissionClient from "./MissionClient";

// --- Interface for metadata fetching ---
interface UniversityMetadata {
  title: string;
  mission: string;
  intro_image: {
    lg: string;
  };
}

// --- Server-side function to generate dynamic metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  try {
    const response = await fetch(`${API_URL}/website/universities`, {
      headers: { "website-language": locale || "en" },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch university data");
    }

    const uniData: UniversityMetadata = await response.json();
    const pageTitle = `Mission & Vision | ${uniData.title}`;
    const pageDescription = uniData.mission.substring(0, 160).trim() + "...";
    const imageUrl = uniData.intro_image?.lg || "/small-logo.png";
    const baseUrl = NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/mission-and-vision`, // Assuming this is the correct URL
        siteName: uniData.title,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Intro image for ${uniData.title}`,
          },
        ],
        locale: locale,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);
    // Fallback metadata in case of an error
    return {
      title: "Mission & Vision | EPU",
      description: "Learn about the mission and vision of the university.",
    };
  }
}

// --- The default export that renders the client component ---
export default function MissionPage() {
  return <MissionClient />;
}
