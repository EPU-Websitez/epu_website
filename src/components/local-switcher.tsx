"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { ChangeEvent, useState, useTransition } from "react";
import { BsChevronDown } from "react-icons/bs";

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale();
  const pathname = usePathname();

  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
      // @ts-ignore -- known issue with next-intl types for dynamic locale
      router.replace(pathname, { locale: nextLocale });
    });
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
              ? "عربي"
              : localActive === "ku"
                ? "کوردی"
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
          className={`w-full rtl_font ${localActive === "ar" ? "text-primary" : ""}`}
          dir="rtl"
        >
          عربي
        </button>
        <button
          className={`w-full rtl_font ${localActive === "ku" ? "text-primary" : ""}`}
          disabled={isPending}
          onClick={() => onSelectChange("ku")}
        >
          کوردی
        </button>
      </div>
    </div>
  );
}
