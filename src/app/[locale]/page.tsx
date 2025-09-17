import { Metadata } from "next";
import { API_URL, NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import HomePageClient from "./HomePageClient";

// --- Interfaces can be defined here or imported ---
interface UniversityData {
  description: string;
  research_title: string;
  intro_image: { lg: string };
  // ... other properties
}

// 1. Completed METADATA function for better SEO and social sharing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  try {
    const { locale } = await params; // Await params before using them

    const response = await fetch(`${API_URL}/website/universities`, {
      headers: { "website-language": locale || "en" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error("Failed to fetch metadata");

    const uniData: UniversityData = await response.json();
    const pageTitle = "EPU";
    const pageDescription =
      uniData.description ||
      "Welcome to the official website of Erbil Polytechnic University.";

    // IMPORTANT: Set your website's base URL in your environment variables
    // For example, in .env.local: NEXT_PUBLIC_BASE_URL=https://www.yourdomain.com
    const baseUrl = NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      // metadataBase is crucial for resolving relative image paths
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,

      // Open Graph (for Facebook, LinkedIn, etc.)
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}`, // The canonical URL for this page
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: "/small-logo.png", // Path to your image in the `public` folder
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
        images: ["/small-logo.png"], // Path to your image in the `public` folder
        creator: "@EPU_Official", // Optional: Your university's Twitter handle
      },

      // For multi-language SEO
      alternates: {
        canonical: `/${locale}`,
        languages: {
          en: "/en",
          ar: "/ar",
          ku: "/ku",
        },
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    // Fallback metadata in case the API fails
    return {
      title: "EPU | Erbil Polytechnic University",
      description: "Welcome to our university.",
    };
  }
}

// 2. The default export remains the same
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <HomePageClient />;
}
