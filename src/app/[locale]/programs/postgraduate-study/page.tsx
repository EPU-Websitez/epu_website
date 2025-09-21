import { Metadata } from "next";

import PostgraduateClient from "./PostgraduateClient";

// --- Interface for metadata fetching ---
interface PostgraduateMetadata {
  title: string;
  description: string;
  bg_image: {
    lg: string;
  };
}

interface PostgraduateResponse {
  data: PostgraduateMetadata[];
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
      `${process.env.NEXT_PUBLIC_API_URL}/website/programs/postgraduate?page=1&limit=1&is_active=true`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch postgraduate programs data");
    }

    const responseData: PostgraduateResponse = await response.json();
    const programData = responseData?.data?.[0];

    if (!programData) {
      throw new Error("No postgraduate program data found");
    }

    const pageTitle = `Postgraduate | EPU`;
    const pageDescription = programData.description.substring(0, 160).trim();
    const imageUrl = programData.bg_image?.lg || "/images/programs-bg.png";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/postgraduate`, // Assuming this is the correct URL
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `EPU Postgraduate Programs`,
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
      title: "Postgraduate Programs | EPU",
      description:
        "Explore postgraduate programs at Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function PostgraduatePage() {
  return <PostgraduateClient />;
}
