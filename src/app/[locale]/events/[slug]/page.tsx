import { Metadata } from "next";
import { API_URL, NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import EventDetailClient from "./EventDetailClient";

// --- Interface for the data needed for metadata ---
interface EventMetadata {
  title: string;
  content: string; // HTML content
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
  // Correctly type params as a Promise
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  // Await params before destructuring
  const { slug, locale } = await params;

  try {
    const response = await fetch(`${API_URL}/website/events/${slug}`, {
      headers: { "website-language": locale || "en" },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch event metadata");
    }

    const eventData: EventMetadata = await response.json();

    const pageTitle = `${eventData.title} | EPU`;
    const pageDescription =
      eventData.content
        .replace(/<[^>]*>?/gm, "")
        .substring(0, 160)
        .trim() + "...";

    const imageUrl = eventData.galleries?.[0]?.image?.lg || "/images/event.png";
    const baseUrl = NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/events/${slug}`,
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: eventData.title,
          },
        ],
        locale: locale,
        type: "article",
      },
    };
  } catch (error) {
    console.error(`Metadata generation failed for slug ${slug}:`, error);
    return {
      title: "Event | EPU",
      description: "Details about an event at Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function EventDetailPage() {
  return <EventDetailClient />;
}
