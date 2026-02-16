import { Metadata } from "next";

import StudentsClient from "./StudentsClient";

// --- Interface for metadata fetching ---
interface CampusLifeMetadata {
  title: string;
  description: string;
  background_image: {
    lg: string | null;
  } | null;
}

interface CampusLifeResponse {
  data: CampusLifeMetadata[];
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
      `${process.env.NEXT_PUBLIC_API_URL}/website/campus-life?page=1&limit=1`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch campus life data");
    }

    const responseData: CampusLifeResponse = await response.json();
    const campusData = responseData?.data?.[0];

    if (!campusData) {
      throw new Error("No campus life data found");
    }

    const pageTitle = `${campusData.title} | EPU`;
    const pageDescription = campusData?.description
      ? campusData?.description?.substring(0, 160).trim()
      : "Explore campus life at Erbil Polytechnic University.";
    const imageUrl = campusData.background_image?.lg || "/images/campus.png";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/campus-life`, // Assuming this is the correct URL
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Campus Life at EPU`,
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
      title: "Campus Life | EPU",
      description: "Explore campus life at Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function CampusLifePage() {
  return <StudentsClient />;
}
