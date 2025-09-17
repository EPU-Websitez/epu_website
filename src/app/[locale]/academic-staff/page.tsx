import type { Metadata } from "next";
import AcademicStaffClient from "./AcademicStaffClient";
import { NEXT_PUBLIC_BASE_URL } from "@/libs/env";

// --- Corrected generateMetadata function ---
export async function generateMetadata({
  // 1. Add 'async'
  params,
}: {
  params: Promise<{ locale: string }>; // 2. Update type to be a Promise
}): Promise<Metadata> {
  const { locale } = await params; // 3. Add 'await'
  const pageTitle = "Academic Staff | EPU";
  const pageDescription =
    "Meet the dedicated and experienced academic staff at Erbil Polytechnic University.";

  const baseUrl = NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

  return {
    // metadataBase is crucial for resolving relative image paths
    metadataBase: new URL(baseUrl),
    title: pageTitle,
    description: pageDescription,

    // Open Graph for social media sharing
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/${locale}/academic-staff`,
      siteName: "Erbil Polytechnic University",
      images: [
        {
          url: "/small-logo.png", // Your logo in the /public folder
          width: 1200,
          height: 630,
          alt: "Erbil Polytechnic University Logo",
        },
      ],
      locale: locale,
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: ["/small-logo.png"],
    },

    // For multi-language SEO
    alternates: {
      canonical: `/${locale}/academic-staff`,
      languages: {
        en: "/en/academic-staff",
        ar: "/ar/academic-staff",
        ku: "/ku/academic-staff",
      },
    },
  };
}

// --- The default export renders the client component ---
export default function AcademicStaffPage() {
  return <AcademicStaffClient />;
}
