import { Metadata } from "next";
import ContactClient from "./ContactClient";

// --- Server-side function to generate metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageTitle =
    "Contact Us | Erbil Polytechnic University";
  const pageDescription =
    "Get in touch with Erbil Polytechnic University. Find campus phone listings, office working hours, location address, official social media accounts, and send support queries directly.";
  const imageUrl = "/images/contact.jpg";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://epu.edu.iq/";

  return {
    metadataBase: new URL(baseUrl),
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/${locale}/contact`,
      siteName: "Erbil Polytechnic University",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Contact Erbil Polytechnic University",
        },
      ],
      locale: locale,
      type: "website",
    },
  };
}

// --- The default export that renders the client component ---
export default function ContactPage() {
  return <ContactClient />;
}
