import { Metadata } from "next";
import { NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import ResearchClient from "./ResearchClient";

// --- Server-side function to generate metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageTitle = "Innovative Research and Publications | EPU";
  const pageDescription =
    "Explore academic research papers, theses, and publications from the faculty and students of Erbil Polytechnic University.";
  const imageUrl = "/images/innovative.png";
  const baseUrl = NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

  return {
    metadataBase: new URL(baseUrl),
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/${locale}/researches`,
      siteName: "Erbil Polytechnic University",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Innovative Research at EPU",
        },
      ],
      locale: locale,
      type: "website",
    },
  };
}

// --- The default export that renders the client component ---
export default function ResearchPage() {
  return <ResearchClient />;
}
