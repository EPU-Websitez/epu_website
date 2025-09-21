import { Metadata } from "next";

import StudentUnionClient from "./StudentUnionClient";

// --- Interface for metadata fetching ---
interface StudentUnionMetadata {
  title: string;
  achievements_description: string;
}

interface StudentUnionMainResponse {
  data: StudentUnionMetadata[];
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
      `${process.env.NEXT_PUBLIC_API_URL}/website/student-union?page=1&limit=1`,
      {
        headers: { "website-language": locale || "en" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch student union data");
    }

    const responseData: StudentUnionMainResponse = await response.json();
    const unionData = responseData?.data?.[0];

    if (!unionData) {
      throw new Error("No student union data found");
    }

    const pageTitle = `${unionData.title} | EPU`;
    const pageDescription = unionData.achievements_description
      .substring(0, 160)
      .trim();
    const imageUrl = "/images/union.png"; // Using a static fallback image
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

    return {
      metadataBase: new URL(baseUrl),
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `/${locale}/student-union`, // Assuming this is the correct URL
        siteName: "Erbil Polytechnic University",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Student Union at EPU`,
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
      title: "Student Union | EPU",
      description:
        "Learn about the Student Union at Erbil Polytechnic University.",
    };
  }
}

// --- The default export that renders the client component ---
export default function StudentUnionPage() {
  return <StudentUnionClient />;
}
