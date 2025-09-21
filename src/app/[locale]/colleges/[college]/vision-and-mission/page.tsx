import type { Metadata } from "next";

import VisionAndMissionClient from "./VisionAndMissionClient";

// --- Interface for metadata fetching ---
interface College {
  title: string;
  vision: string;
  logo: {
    lg: string;
  };
}

// This function runs on the server for each specific college's about page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ college: string; locale: string }>; // ✅ params is now a Promise
}): Promise<Metadata> {
  const { college, locale } = await params; // ✅ Await params before destructuring
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/colleges/${college}`,
      {
        headers: { "website-language": locale },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) throw new Error("College is not found");

    const collegeData: College = await response.json();
    const pageTitle = `Vision and Mission of ${collegeData.title} | EPU`;
    const pageDescription =
      collegeData.vision ||
      `Learn about the vision and mission of ${collegeData.title}.`;
    const imageUrl = collegeData.logo?.lg || `${baseUrl}/small-logo.png`;

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        images: [{ url: imageUrl, alt: collegeData.title }],
      },
    };
  } catch (error) {
    // Fallback metadata
    return {
      title: "About College | EPU",
      description: "Learn about the vision and mission of our colleges.",
    };
  }
}

// The page component also needs to be updated
export default async function AboutCollegePage({
  params,
}: {
  params: Promise<{ college: string; locale: string }>; // ✅ params is now a Promise
}) {
  const { college, locale } = await params; // ✅ Await params before using
  return <VisionAndMissionClient />;
}
