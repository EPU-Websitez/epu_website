import type { Metadata } from "next";
import { process.env.NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import HowToApplyClient from "./HowToApplyClient";

// --- Server-side function to generate STATIC metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageTitle = "How to Apply | EPU";
  const pageDescription =
    "Find all the information you need to apply for admission to Erbil Polytechnic University. Learn about the application process, requirements, and deadlines.";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

  return {
    metadataBase: new URL(baseUrl),
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/${locale}/how-to-apply`,
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
export default function HowToApplyPage() {
  return <HowToApplyClient />;
}
