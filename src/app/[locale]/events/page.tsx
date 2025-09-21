import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import EventsClient from "./EventsClient";

// --- Server-side function to generate metadata ---
export async function generateMetadata({}: {}): Promise<Metadata> {
  try {
    // Fetch the first event to use its image for OpenGraph tags
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/universities/events?page=1&limit=1`,
      {
        headers: { "website-language": "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );
    const eventsData = await response.json();
    const imageUrl =
      eventsData?.data?.[0]?.galleries?.[0]?.image?.lg || "/images/event.png";

    // Use static translations for title and description
    const pageTitle = `Events | EPU`;
    const pageDescription =
      "Stay updated with the latest news, announcements, and upcoming events at Erbil Polytechnic University.";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/en/events`,
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: pageTitle,
          },
        ],
        locale: "en",
        type: "website",
      },
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return {
      title: "Events | EPU",
      description:
        "Stay updated with the latest events at Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function EventsPage() {
  return <EventsClient />;
}
