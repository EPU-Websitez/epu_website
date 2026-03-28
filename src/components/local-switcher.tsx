"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { useState, useTransition } from "react";
import { IoGlobeOutline } from "react-icons/io5";

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localeActive = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Language");

  const onSelectChange = (nextLocale: string) => {
    if (nextLocale === localeActive) return;
    
    startTransition(() => {
      const search = typeof window !== "undefined" ? window.location.search : "";
      // @ts-ignore -- next-intl types
      router.replace(`${pathname}${search}`, { locale: nextLocale });
    });
    setLangIsOpen(false);
  };

  const [langIsOpen, setLangIsOpen] = useState(false);
  const toggleDropdown = () => setLangIsOpen(!langIsOpen);

  return (
    <div className="relative">
      {/* Backdrop for closing dropdown */}
      {langIsOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setLangIsOpen(false)}
        />
      )}

      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-lightBorder bg-white/50 hover:bg-white hover:border-primary/30 transition-all duration-300 text-sm md:text-base group shadow-sm"
      >
        <IoGlobeOutline className={`text-lg text-secondary group-hover:text-primary transition-colors ${isPending ? "animate-spin" : ""}`} />
        <span className="font-medium text-secondary group-hover:text-primary transition-colors">
          {t(localeActive)}
        </span>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full mt-2 ltr:right-0 rtl:left-0 min-w-[140px] p-1.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden transition-all duration-300 transform origin-top-right ${
          langIsOpen 
            ? "opacity-100 translate-y-0 scale-100 z-50" 
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none -z-10"
        }`}
      >
        <div className="flex flex-col gap-1">
          {[
            { id: "en", label: t("en"), font: "" },
            { id: "ar", label: t("ar"), font: "rtl_font" },
            { id: "ku", label: t("ku"), font: "rtl_font" },
          ].map((lang) => (
            <button
              key={lang.id}
              disabled={isPending}
              onClick={() => onSelectChange(lang.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group/item ${
                localeActive === lang.id
                  ? "bg-primary text-white shadow-md font-semibold"
                  : "text-secondary hover:bg-primary/5 hover:text-primary"
              } ${lang.font}`}
            >
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
