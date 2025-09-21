import { Metadata } from "next";

import ProgramsClient from "./ProgramsClient";

// --- Interface for metadata fetching ---
interface ProgramMetadata {
  title: string;
  description: string;
  bg_image: {
    lg: string | null;
  } | null;
}

interface ProgramListResponse {
  data: ProgramMetadata[];
}

// --- Server-side function to generate dynamic metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/programs?page=1&limit=1`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch programs data");
    }

    const programsResponse: ProgramListResponse = await response.json();
    const programData = programsResponse?.data?.[0];

    if (!programData) {
      throw new Error("No program data found");
    }

    const pageTitle = `${programData.title} | EPU`;
    const pageDescription = programData.description.substring(0, 160).trim();
    const imageUrl = programData.bg_image?.lg || "/images/programs-bg.png"; // Assuming a fallback image
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/programs`,
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `EPU Programs`,
          },
        ],
        locale: locale,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);
    // Fallback metadata
    return {
      title: "Academic Programs | EPU",
      description:
        "Explore the colleges, institutes, and departments at Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function ProgramsPage() {
  return <ProgramsClient />;
}
