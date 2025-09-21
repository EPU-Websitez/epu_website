import { Metadata } from "next";

import PresidentSpeechClient from "./PresidentSpeechClient";

// --- Interface for metadata fetching ---
interface PresidentMessageMetadata {
  subtitle: string;
  description: string;
  galleries: {
    image: {
      lg: string;
    };
  }[];
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
      `${process.env.NEXT_PUBLIC_API_URL}/website/universities/president-message`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch president's message");
    }

    const messageData: PresidentMessageMetadata = await response.json();
    const pageTitle = "President's Message | EPU";
    const pageDescription = (messageData.subtitle || messageData.description)
      .substring(0, 160)
      .trim();
    const imageUrl =
      messageData.galleries?.[0]?.image?.lg || "/images/president.png"; // Assuming a fallback image
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/president-message`, // Assuming this is the correct URL
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: "A message from the president of EPU",
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
      title: "President's Message | EPU",
      description:
        "A message from the president of Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function PresidentSpeechPage() {
  return <PresidentSpeechClient />;
}
