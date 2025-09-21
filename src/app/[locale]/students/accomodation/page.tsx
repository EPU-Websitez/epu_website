import { Metadata } from "next";

import AccommodationClient from "./AccommodationClient";

// --- Interface for metadata fetching ---
interface AccommodationMetadata {
  title: string;
  description: string;
  galleries: {
    id: number;
    image: {
      lg: string;
    };
  }[];
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
      `${process.env.NEXT_PUBLIC_API_URL}/website/student-accommodation/main`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch accommodation data");
    }

    const accommodationData: AccommodationMetadata = await response.json();

    const pageTitle = `${accommodationData.title} | EPU`;
    const pageDescription = accommodationData.description
      .substring(0, 160)
      .trim();
    const imageUrl =
      accommodationData.galleries?.[0]?.image?.lg || "/images/accomodation.png";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/accommodation`, // Assuming this is the correct URL
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Student Accommodation at EPU`,
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
      title: "Student Accommodation | EPU",
      description:
        "Learn about student housing and accommodation at Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function AccommodationPage() {
  return <AccommodationClient />;
}
