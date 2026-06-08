import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "@/public/locales/en/translation.json";
import zhTwTranslation from "@/public/locales/zh-TW/translation.json";

export const LOCALE_STORAGE_KEY = "locale";
export const SUPPORTED_LOCALES = ["en", "zh-TW"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function getStoredLocale(): SupportedLocale {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "zh-TW" || stored === "en") {
    return stored;
  }

  return "en";
}

export function getHtmlLang(locale: SupportedLocale): string {
  return locale === "zh-TW" ? "zh-Hant" : "en";
}

const i18nInstance = i18n.createInstance();

i18nInstance.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  supportedLngs: [...SUPPORTED_LOCALES],
  ns: ["translation"],
  defaultNS: "translation",
  resources: {
    en: { translation: enTranslation },
    "zh-TW": { translation: zhTwTranslation }
  },
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

export default i18nInstance;
