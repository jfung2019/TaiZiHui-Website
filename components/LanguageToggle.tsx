"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getHtmlLang, LOCALE_STORAGE_KEY, type SupportedLocale } from "@/lib/i18n";
import { typography } from "@/lib/typography";

const languageButtonClass =
  `relative cursor-pointer px-1 ` +
  `opacity-85 transition-opacity duration-200 hover:opacity-100 ` +
  `after:pointer-events-none after:absolute after:-bottom-1 after:left-0 ` +
  `after:h-[8px] after:w-full after:origin-left after:scale-x-75 ` +
  `after:rounded-[18px_3px_14px_5px] after:bg-[#b3201d]/85 after:opacity-0 after:blur-[0.2px] ` +
  `after:content-[''] after:transition-all after:duration-200 ` +
  `hover:after:scale-x-100 hover:after:opacity-100`;

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const currentLocale = (i18n.language === "zh-TW" ? "zh-TW" : "en") as SupportedLocale;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const changeLanguage = (locale: SupportedLocale) => {
    if (locale === currentLocale) {
      return;
    }

    void i18n.changeLanguage(locale);
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = getHtmlLang(locale);
  };

  return (
    <div
      className={`${typography.nav} flex items-center gap-1 lg:tracking-[0.1rem]`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        aria-label={t("language.switchToEn")}
        aria-pressed={currentLocale === "en"}
        className={`${languageButtonClass} ${currentLocale === "en" ? "opacity-100" : ""}`}
      >
        {t("language.en")}
      </button>
      <span className="opacity-50" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => changeLanguage("zh-TW")}
        aria-label={t("language.switchToZh")}
        aria-pressed={currentLocale === "zh-TW"}
        className={`${languageButtonClass} ${currentLocale === "zh-TW" ? "opacity-100" : ""}`}
      >
        {t("language.zh")}
      </button>
    </div>
  );
}
