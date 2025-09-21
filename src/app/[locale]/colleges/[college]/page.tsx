import type { Metadata } from "next";
import { process.env.NEXT_PUBLIC_BASE_URL } from "@/libs/env";
import CollegeDetailClient from "./CollegeDetailClient"; // Import the client component

// This function now accepts 'searchParams' to generate dynamic metadata
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>; // ✅ searchParams is now a Promise
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams; // ✅ Await searchParams
  const type = (resolvedSearchParams.type || "COLLEGE").toUpperCase(); // ✅ Use awaited searchParams

  // Dynamically set title and description based on the active tab
  const pageTitle =
    type === "INSTITUTE"
      ? "University Institutes | EPU"
      : "University Colleges | EPU";
  const pageDescription =
    type === "INSTITUTE"
      ? "Explore the specialized institutes at Erbil Polytechnic University."
      : "Discover the diverse colleges and academic programs at Erbil Polytechnic University.";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

  return {
    metadataBase: new URL(baseUrl),
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/${locale}/colleges?type=${type}`,
      siteName: "Erbil Polytechnic University",
      images: [{ url: "/small-logo.png", width: 1200, height: 630 }],
    },
  };
}

// The page component simply renders your client component
export default function CollegePage() {
  return <CollegeDetailClient />;
}
