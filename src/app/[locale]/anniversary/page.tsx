import type { Metadata } from "next";
import AnniversaryClient from "./AnniversaryClient";

// --- Server-side function to generate STATIC metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageTitle = "University Anniversary | EPU";
  const pageDescription =
    "Celebrate the milestones and achievements of Erbil Polytechnic University. Discover our history and anniversary events.";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

  return {
    metadataBase: new URL(baseUrl),
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/${locale}/anniversary`,
      siteName: "Erbil Polytechnic University",
      images: [
        {
          url: "/small-logo.png",
          width: 1200,
          height: 630,
          alt: "Erbil Polytechnic University Logo",
        },
      ],
    },
  };
}

// --- The default export renders the client component ---
export default function AnniversaryPage() {
  return <AnniversaryClient />;
}
