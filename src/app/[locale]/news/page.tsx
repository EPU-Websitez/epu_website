import { Metadata } from "next";
import { API_URL, NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import NewsClient from "./NewsClient";

// --- Interface for metadata fetching ---
interface NewsMetadata {
  data: {
    cover_image?: {
      lg: string;
    };
  }[];
}

// --- Server-side function to generate metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  try {
    // Fetch the latest news item to use its image for OpenGraph tags
    const response = await fetch(`${API_URL}/website/news?page=1&limit=1`, {
      headers: { "website-language": locale || "en" },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const newsData: NewsMetadata = await response.json();
    const imageUrl = newsData?.data?.[0]?.cover_image?.lg || "/images/news.png";

    const pageTitle = "News & Announcements | EPU";
    const pageDescription =
      "Stay informed with the latest news, updates, and announcements from Erbil Polytechnic University. Explore articles on academic achievements, events, and campus life.";

    const baseUrl = NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/news`,
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: "Erbil Polytechnic University News",
          },
        ],
        locale: locale,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);
    // Fallback metadata in case of an error
    return {
      title: "News & Announcements | EPU",
      description:
        "The latest news and updates from Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function NewsPage() {
  return <NewsClient />;
}
