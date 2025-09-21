// src/app/[locale]/colleges/[college]/departments/[slug]/course-subjects/carriculum/[id]/[subjectId]/page.tsx

import { Metadata } from "next";

import SubjectDetailsPageClient from "./SubjectDetailsPageClient"; // The new client component

// Interface for the data needed for metadata
interface SubjectMetadata {
  name: string;
  description: string;
}

// Fetches subject data on the server to generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    college: string;
    slug: string;
    id: string;
    subjectId: string;
  }>;
}): Promise<Metadata> {
  try {
    const { locale, college, slug, id, subjectId } = await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/departments/subject/${subjectId}`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch subject metadata");

    const subjectData: SubjectMetadata = await response.json();
    const pageTitle = `${subjectData.name} | EPU`;
    const pageDescription =
      subjectData.description?.substring(0, 160) ||
      `Course details, schedule, and materials for the subject ${subjectData.name}.`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";
    const fullPath = `/colleges/${college}/departments/${slug}/course-subjects/carriculum/${id}/${subjectId}`;

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}${fullPath}`,
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
        canonical: `/${locale}${fullPath}`,
        languages: {
          en: `/en${fullPath}`,
          ar: `/ar${fullPath}`,
          ku: `/ku${fullPath}`,
        },
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "Subject Details | EPU",
      description: "Course details, schedule, and materials.",
    };
  }
}

// The default export simply renders the client component
export default function SubjectDetailsPage() {
  return <SubjectDetailsPageClient />;
}
