import { Metadata } from "next";
import { API_URL, NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import MouClient from "./MouClient";

// --- Interface for metadata fetching ---
interface MouMetadata {
  data: {
    logo_image?: {
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
    // Fetch the first MOU to use its image for OpenGraph tags
    const response = await fetch(
      `${API_URL}/website/memorandum-of-understanding?page=1&limit=1`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    const mouData: MouMetadata = await response.json();
    const imageUrl = mouData?.data?.[0]?.logo_image?.lg || "/small-logo.png";

    const pageTitle = "Memorandum of Understanding | EPU";
    const pageDescription =
      "Explore the memorandums of understanding and partnerships established by Erbil Polytechnic University with local and international institutions.";

    const baseUrl = NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/memorandum-of-understanding`,
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: "Erbil Polytechnic University Partnerships",
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
      title: "Memorandum of Understanding | EPU",
      description:
        "Explore partnerships established by Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function MouPage() {
  return <MouClient />;
}
