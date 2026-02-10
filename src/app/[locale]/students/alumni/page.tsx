import { Metadata } from "next";

import AlumniClient from "./AlumniClient";

// --- Interface for metadata fetching ---
interface AlumniMetadata {
  feedback_title: string;
  feedback_description: string;
  bg_image: {
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/alumni-students`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch alumni data");
    }

    const responseData = await response.json();
    const alumniData: AlumniMetadata = responseData.data[0];

    const pageTitle = `${alumniData?.feedback_title} | EPU Alumni`;
    const pageDescription = alumniData?.feedback_description
      ?.substring(0, 160)
      .trim();
    const imageUrl = alumniData?.bg_image?.lg || "/images/alumni-bg.png";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/alumni`, // Assuming this is the correct URL
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `EPU Alumni Community`,
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
      title: "Alumni | EPU",
      description:
        "Connect with the Erbil Polytechnic University alumni community.",
    };
  }
}

// --- The default export that renders the client component ---
export default function AlumniPage() {
  return <AlumniClient />;
}
