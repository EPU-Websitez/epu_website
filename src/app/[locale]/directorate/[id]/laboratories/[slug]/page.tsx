import { Metadata } from "next";

import LabDetailsPageClient from "./LabDetailsPageClient";

// Interface for the data needed for metadata
interface LabMetadata {
  name: string;
  description: string;
  images: { image: { lg: string; original: string } }[];
}

// Fetches lab data on the server to generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string; slug: string }>;
}): Promise<Metadata> {
  try {
    const { locale, id, slug } = await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}/laboratories/${slug}`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) throw new Error("Failed to fetch lab metadata");

    const labData: LabMetadata = await response.json();
    const pageTitle = `${labData.name} | EPU`;
    const pageDescription =
      labData.description?.substring(0, 160) ||
      `Details about the ${labData.name} at Erbil Polytechnic University.`;
    const imageUrl =
      labData.images?.[0]?.image?.original ||
      labData.images?.[0]?.image?.lg ||
      "/small-logo.png";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/directorate/${id}/laboratories/${slug}`,
        siteName: "Erbil Polytechnic University",
        images: [{ url: imageUrl, width: 1200, height: 630 }],
        locale: locale,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDescription,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/${locale}/directorate/${id}/laboratories/${slug}`,
        languages: {
          en: `/en/directorate/${id}/laboratories/${slug}`,
          ar: `/ar/directorate/${id}/laboratories/${slug}`,
          ku: `/ku/directorate/${id}/laboratories/${slug}`,
        },
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "Laboratory Details | EPU",
      description:
        "Details about laboratories at Erbil Polytechnic University.",
    };
  }
}

export default function LabDetailsPage() {
  return <LabDetailsPageClient />;
}
