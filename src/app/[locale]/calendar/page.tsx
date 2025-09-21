import type { Metadata } from "next";
import { process.env.NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import CalendarClient from "./CalendarClient"; // Import the client component

// --- Server-side function to generate STATIC metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageTitle = "University Calendar | EPU";
  const pageDescription =
    "View the official academic calendar for Erbil Polytechnic University. Find important dates, events, and season schedules.";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

  return {
    metadataBase: new URL(baseUrl),
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/${locale}/calendar`,
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
export default function CalendarPage() {
  return <CalendarClient />;
}
