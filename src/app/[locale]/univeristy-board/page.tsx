import { Metadata } from "next";

import UniversityBoardClient from "./UniversityBoardClient";

// --- Interface for metadata fetching ---
interface BoardMetadata {
  role: string;
  teacher: {
    full_name: string;
    profile_image: {
      lg: string;
    };
  };
}

interface LeadsResponse {
  data: BoardMetadata[];
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
      `${process.env.NEXT_PUBLIC_API_URL}/website/universities/leads`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch university leads data");
    }

    const leadsData: LeadsResponse = await response.json();
    const presidentData = leadsData?.data?.[0];

    if (!presidentData) {
      throw new Error("No lead data found");
    }

    const pageTitle = `${presidentData.role} | EPU`;
    const pageDescription = `Meet the ${presidentData.role} of Erbil Polytechnic University, ${presidentData.teacher.full_name}, and the university council members.`;
    const imageUrl =
      presidentData.teacher.profile_image?.lg || "/images/bg.svg";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/university-board`, // Assuming this is the correct URL
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: presidentData.teacher.full_name,
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
      title: "University Board | EPU",
      description:
        "Meet the leadership and council members of Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function UniversityBoardPage() {
  return <UniversityBoardClient />;
}
