// src/app/[locale]/colleges/[college]/about/page.tsx

import { Metadata } from "next";

import AboutCollegePageClient from "./AboutCollegePageClient";

// Interface for the data needed for metadata
interface CollegeMetadata {
  title: string;
  about_content: string;
  logo: { lg: string };
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
    const pageTitle = `About ${collegeData.title} | EPU`;
    const pageDescription =
      collegeData.about_content?.substring(0, 160) ||
      `Learn more about ${collegeData.title}, its mission, vision, and contact information at Erbil Polytechnic University.`;
    const imageUrl = collegeData.logo?.lg || "/small-logo.png";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/colleges/${college}/about`,
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
        canonical: `/${locale}/colleges/${college}/about`,
        languages: {
          en: `/en/colleges/${college}/about`,
          ar: `/ar/colleges/${college}/about`,
          ku: `/ku/colleges/${college}/about`,
        },
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "About College | EPU",
      description:
        "Learn more about the college, its mission, vision, and contact information at Erbil Polytechnic University.",
    };
  }
}

// The default export simply renders the client component
export default function AboutCollegePage() {
  return <AboutCollegePageClient />;
}
