import { Metadata } from "next";
import { process.env.NEXT_PUBLIC_BASE_URL, process.env.NEXT_PUBLIC_API_URL } from "@/libs/env";
import DecisionsClient from "./DecisionsClient"; // Import the client component

// --- Interface for the data needed for metadata ---
interface DecisionsMetadata {
  title: string;
  description: string;
  bg_image: {
    lg: string;
  };
}

// --- Server-side function to generate dynamic metadata ---
export async function generateMetadata({}: {}): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/website/universities/decisions-and-instructions`,
      {
        headers: { "website-language": "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch metadata");
    }

    const pageData: DecisionsMetadata = await response.json();
    const pageTitle = `${pageData.title} | EPU`;
    const pageDescription =
      pageData.description ||
      "Official decisions, instructions, and guidelines from the university.";
    const imageUrl = pageData.bg_image?.lg || "/small-logo.png";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/en/decisions-and-instructions`,
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
      title: "Decisions and Instructions | EPU",
      description:
        "Official decisions and instructions from Erbil Polytechnic University.",
    };
  }
}

// --- The default export renders the client component ---
export default function DecisionsPage() {
  return <DecisionsClient />;
}
