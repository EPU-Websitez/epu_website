// src/app/[locale]/colleges/[college]/news/page.tsx

import { Metadata } from "next";
import { API_URL, NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import NewsPageClient from "./NewsPageClient";

// Interface for the data needed for metadata
interface CollegeMetadata {
  title: string;
  news_subtitle: string;
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
    const pageTitle = `${collegeData.title} News | EPU`;
    const pageDescription =
      collegeData.news_subtitle ||
      `Latest news and updates from ${collegeData.title} at Erbil Polytechnic University.`;
    const baseUrl = NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/colleges/${college}/news`,
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
        canonical: `/${locale}/colleges/${college}/news`,
        languages: {
          en: `/en/colleges/${college}/news`,
          ar: `/ar/colleges/${college}/news`,
          ku: `/ku/colleges/${college}/news`,
        },
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "College News | EPU",
      description: "Latest news and updates from Erbil Polytechnic University.",
    };
  }
}

// The default export simply renders the client component
export default function NewsPage() {
  return <NewsPageClient />;
}
