"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { getHtmlLang, type SupportedLocale } from "@/lib/i18n";

type I18nProviderProps = Readonly<{
  children: ReactNode;
}>;

function resolveLocale(language: string): SupportedLocale {
  return language === "zh-TW" ? "zh-TW" : "en";
}

function applyLocaleToDocument(language: string) {
  const locale = resolveLocale(language);
  document.documentElement.lang = getHtmlLang(locale);
  document.documentElement.dataset.locale = locale;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    applyLocaleToDocument(i18n.language);

    const handleLanguageChanged = (language: string) => {
      applyLocaleToDocument(language);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
