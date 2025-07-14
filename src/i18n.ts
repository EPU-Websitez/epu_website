import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "ku", "ar"];

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is a promise, not a function - await it directly
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
