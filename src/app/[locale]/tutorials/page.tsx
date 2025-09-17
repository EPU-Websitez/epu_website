import { Metadata } from "next";
import { API_URL, NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import TutorialsClient from "./TutorialsClient";

// --- Interface for metadata fetching ---
interface TutorialMetadata {
  images: {
    image: {
      lg: string;
      media_type: "IMAGE" | "VIDEO";
    };
  }[];
}

interface TutorialsResponse {
  data: TutorialMetadata[];
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
      `${API_URL}/website/universities/tutorials?page=1&limit=1`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tutorials data");
    }

    const responseData: TutorialsResponse = await response.json();
    const firstTutorial = responseData?.data?.[0];
    const imageUrl =
      firstTutorial?.images?.find((img) => img.image.media_type === "IMAGE")
        ?.image?.lg || "/images/placeholder.svg"; // Fallback image

    const pageTitle = "Tutorials | EPU";
    const pageDescription =
      "Find helpful video tutorials and guides for students and staff at Erbil Polytechnic University.";
    const baseUrl = NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/tutorials`, // Assuming this is the correct URL
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `EPU Tutorials`,
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
      title: "Tutorials | EPU",
      description:
        "Find helpful video tutorials and guides at Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function TutorialsPage() {
  return <TutorialsClient />;
}
