// src/app/[locale]/colleges/[college]/events/page.tsx

import { Metadata } from "next";

import EventsPageClient from "./EventsPageClient";

// Interface for the data needed for metadata
interface CollegeMetadata {
  title: string;
  event_subtitle: string | null;
}

// Fetches college data on the server to generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; college: string }>;
}): Promise<Metadata> {
  try {
    const { locale, college } = await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/colleges/${college}`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch college metadata");

    const collegeData: CollegeMetadata = await response.json();
    const pageTitle = `${collegeData.title} Events | EPU`;
    const pageDescription =
      collegeData.event_subtitle ||
      `Discover upcoming and past events at ${collegeData.title}, Erbil Polytechnic University.`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/colleges/${college}/events`,
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
        canonical: `/${locale}/colleges/${college}/events`,
        languages: {
          en: `/en/colleges/${college}/events`,
          ar: `/ar/colleges/${college}/events`,
          ku: `/ku/colleges/${college}/events`,
        },
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "College Events | EPU",
      description: "Discover events at Erbil Polytechnic University.",
    };
  }
}

// The default export simply renders the client component
export default function EventsPage() {
  return <EventsPageClient />;
}
