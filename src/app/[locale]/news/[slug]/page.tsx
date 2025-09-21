import { Metadata } from "next";

import NewsDetailClient from "./NewsDetailClient";

// --- Interface for metadata fetching ---
interface NewsMetadata {
  title: string;
  excerpt: string;
  cover_image: {
    lg: string;
  };
  gallery: {
    image: {
      lg: string;
    };
  }[];
}

// --- Server-side function to generate dynamic metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/news/${slug}`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news metadata");
    }

    const newsData: NewsMetadata = await response.json();
    const pageTitle = `${newsData.title} | EPU News`;
    const pageDescription =
      newsData.excerpt || "An article from Erbil Polytechnic University.";

    const imageUrl =
      newsData.cover_image?.lg ||
      newsData.gallery?.[0]?.image?.lg ||
      "/images/news.png";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/news/${slug}`,
        siteName: "Erbil Polytechnic University News",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: newsData.title,
          },
        ],
        locale: locale,
        type: "article",
      },
    };
  } catch (error) {
    console.error(`Metadata generation failed for slug ${slug}:`, error);
    // Fallback metadata
    return {
      title: "News | EPU",
      description: "An article from Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function NewsDetailPage() {
  return <NewsDetailClient />;
}
