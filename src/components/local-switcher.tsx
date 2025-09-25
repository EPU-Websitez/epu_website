"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState, useTransition } from "react";
import { BsChevronDown } from "react-icons/bs";

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale();
  const pathname = usePathname();

  const onSelectChange = (e: string) => {
    const nextLocale = e;

    // Check if the URL already has a locale prefix
    const hasLocalePrefix = pathname.startsWith(`/${localActive}/`);

    // Only redirect if the chosen locale is different or there's no prefix
    if (nextLocale !== localActive || !hasLocalePrefix) {
      const currentPath = pathname.replace(/^\/([^\/]+)\//, ""); // Extract remaining path

      const newUrl = hasLocalePrefix
        ? `/${nextLocale}/${currentPath}`
        : `/${nextLocale}`;

      startTransition(() => {
        router.replace(newUrl);
      });
    }
  };

  const [langIsOpen, setLangIsOpen] = useState(false);
  const handleOpenLang = () => {
    setLangIsOpen(!langIsOpen);
  };

  return (
    <div className="relative">
      {langIsOpen && (
        <button
          type="button"
          onClick={handleOpenLang}
          className="fixed top-0 left-0 w-full h-full"
        ></button>
      )}
      <button
        type="button"
        onClick={handleOpenLang}
        className="flex_center font-medium md:gap-3 gap-2 rounded-md border-lightBorder text-lightText border sm:px-3 px-1 py-1 md:text-base sm:text-sm text-xs"
      >
        <span>
          {localActive === "en"
            ? "English"
            : localActive === "ar"
            ? "Arabic"
            : localActive === "ku"
            ? "Kurdish"
            : "English"}{" "}
          Language
        </span>
        <BsChevronDown />
      </button>
      <div
        className={`flex_center flex-col gap-2 absolute duration-300 top-12 p-2 left-0 bg-white border-lightBorder border w-full rounded-md ${
          langIsOpen ? "opacity-100 z-10" : "opacity-0 -z-10"
        }`}
      >
        <button
          className={`w-full ${localActive === "en" ? "text-primary" : ""}`}
          disabled={isPending}
          onClick={() => onSelectChange("en")}
        >
          English
        </button>
        <button
          disabled={isPending}
          onClick={() => onSelectChange("ar")}
          className={`w-full ${localActive === "ar" ? "text-primary" : ""}`}
        >
          Arabic
        </button>
        <button
          className={`w-full ${localActive === "ku" ? "text-primary" : ""}`}
          disabled={isPending}
          onClick={() => onSelectChange("ku")}
        >
          Kurdish
        </button>
      </div>
      {/* <select
        defaultValue={localActive}
        className="bg-transparent py-2"
        onChange={onSelectChange}
        disabled={isPending}
      >
        <option value="en">English</option>
        <option value="kr">Kurdish</option>
      </select> */}
    </div>
  );
}
