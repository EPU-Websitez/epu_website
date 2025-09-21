import { Metadata } from "next";

import InternCareerClient from "./InternCareerClient";

// --- Interface for metadata fetching ---
interface InternCareerMetadata {
  title: string;
  description: string;
}

interface InternCareerMainResponse {
  data: InternCareerMetadata[];
}

// --- Server-side function to generate dynamic metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/intern-career?page=1&limit=1`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch intern and career data");
    }

    const responseData: InternCareerMainResponse = await response.json();
    const internData = responseData?.data?.[0];

    if (!internData) {
      throw new Error("No intern and career data found");
    }

    const pageTitle = `${internData.title} | EPU`;
    const pageDescription = internData.description.substring(0, 160).trim();
    const imageUrl = "/images/story.png"; // Using a static fallback image from the page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/intern-career`, // Assuming this is the correct URL
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Internship & Career Opportunities at EPU`,
          },
        ],
        locale: locale,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);
    // Fallback metadata
    return {
      title: "Internship & Career | EPU",
      description:
        "Explore internship and career opportunities at Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function InternCareerPage() {
  return <InternCareerClient />;
}
