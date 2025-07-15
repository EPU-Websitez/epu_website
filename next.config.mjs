import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "api-dev-v1.epu.edu.iq",
      "plus.unsplash.com",
      "images.unsplash.com",
    ],
  },
};

export default withNextIntl(nextConfig);
