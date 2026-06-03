"use client";

import { useTranslation } from "react-i18next";
import { getHtmlLang, LOCALE_STORAGE_KEY, type SupportedLocale } from "@/lib/i18n";

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const currentLocale = (i18n.language === "zh-TW" ? "zh-TW" : "en") as SupportedLocale;

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
      className="flex items-center gap-1 text-[0.72rem] uppercase tracking-[0.08rem] lg:text-sm lg:tracking-[0.1rem]"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        aria-label={t("language.switchToEn")}
        aria-pressed={currentLocale === "en"}
        className={`px-1 transition-opacity ${currentLocale === "en" ? "opacity-100" : "opacity-55 hover:opacity-85"}`}
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
        className={`px-1 transition-opacity ${currentLocale === "zh-TW" ? "opacity-100" : "opacity-55 hover:opacity-85"}`}
      >
        {t("language.zh")}
      </button>
    </div>
  );
}
