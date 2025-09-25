import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DirectoratesClient from "./DirectoratesClient";

// --- Server-side function to generate metadata ---
export async function generateMetadata({}: {}): Promise<Metadata> {
  try {
    const pageTitle = `University Directory | EPU`;
    const pageDescription =
      "Explore the various university directorates, centers, and administrative units at Erbil Polytechnic University.";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/en/directorates`, // Assuming this is the correct slug
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: "/images/directorate.jpg", // Using a default hero image
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
    // Fallback metadata in case of an error
    return {
      title: "University Directorates | EPU",
      description:
        "Explore the various university directorates at Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function DirectoratesPage() {
  return <DirectoratesClient />;
}
