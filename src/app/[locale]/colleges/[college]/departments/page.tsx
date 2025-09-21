// src/app/[locale]/colleges/[college]/departments/page.tsx

import { Metadata } from "next";

import DepartmentsPageClient from "./DepartmentsPageClient";

// Interface for the data needed for metadata
interface CollegeMetadata {
  title: string;
  college_subtitle: string | null;
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
    const pageTitle = `${collegeData.title} Departments | EPU`;
    const pageDescription =
      collegeData.college_subtitle ||
      `Explore the academic departments at ${collegeData.title}, Erbil Polytechnic University.`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/colleges/${college}/departments`,
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
        canonical: `/${locale}/colleges/${college}/departments`,
        languages: {
          en: `/en/colleges/${college}/departments`,
          ar: `/ar/colleges/${college}/departments`,
          ku: `/ku/colleges/${college}/departments`,
        },
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "College Departments | EPU",
      description:
        "Explore the academic departments at Erbil Polytechnic University.",
    };
  }
}

// The default export simply renders the client component
export default function DepartmentsPage() {
  return <DepartmentsPageClient />;
}
