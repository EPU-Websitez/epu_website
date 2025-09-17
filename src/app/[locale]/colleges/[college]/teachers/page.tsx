// src/app/[locale]/colleges/[college]/teachers/page.tsx

import { Metadata } from "next";
import { API_URL, NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import TeachersPageClient from "./TeachersPageClient";

// Interface for the data needed for metadata
interface CollegeMetadata {
  title: string;
}

// Fetches college data on the server to generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; college: string }>;
}): Promise<Metadata> {
  try {
    const { locale, college } = await params;

    const response = await fetch(`${API_URL}/website/colleges/${college}`, {
      headers: { "website-language": locale || "en" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error("Failed to fetch college metadata");

    const collegeData: CollegeMetadata = await response.json();
    const pageTitle = `${collegeData.title} Teachers | EPU`;
    const pageDescription = `Meet the dedicated academic staff and teachers at ${collegeData.title}, Erbil Polytechnic University.`;
    const baseUrl = NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/colleges/${college}/teachers`,
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
        canonical: `/${locale}/colleges/${college}/teachers`,
        languages: {
          en: `/en/colleges/${college}/teachers`,
          ar: `/ar/colleges/${college}/teachers`,
          ku: `/ku/colleges/${college}/teachers`,
        },
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "College Teachers | EPU",
      description: "Meet the academic staff at Erbil Polytechnic University.",
    };
  }
}

// The default export simply renders the client component
export default function TeachersPage() {
  return <TeachersPageClient />;
}
