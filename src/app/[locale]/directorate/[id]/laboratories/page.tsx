// src/app/[locale]/directorate/[id]/laboratories/page.tsx

import { Metadata } from "next";
import LaboratoriesClient from "./LaboratoriesClient";

interface DirectorateMetadata {
  title: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  try {
    const { locale, id } = await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/directorates/${id}`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch directorate metadata");

    const directorateData: DirectorateMetadata = await response.json();
    const pageTitle = `${directorateData.title} Laboratories | EPU`;
    const pageDescription = `Explore the laboratories and facilities at ${directorateData.title}, Erbil Polytechnic University.`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/directorate/${id}/laboratories`,
        siteName: "Erbil Polytechnic University",
        images: [{ url: "/small-logo.png", width: 1200, height: 630 }],
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
        canonical: `/${locale}/directorate/${id}/laboratories`,
        languages: {
          en: `/en/directorate/${id}/laboratories`,
          ar: `/ar/directorate/${id}/laboratories`,
          ku: `/ku/directorate/${id}/laboratories`,
        },
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "Directorate Laboratories | EPU",
      description:
        "Explore the laboratories and facilities at Erbil Polytechnic University.",
    };
  }
}

export default function LaboratoriesPage() {
  return <LaboratoriesClient />;
}
