import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const LOCALE_STORAGE_KEY = "locale";
export const SUPPORTED_LOCALES = ["en", "zh-TW"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function getStoredLocale(): SupportedLocale {
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

i18nInstance
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: getStoredLocale(),
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LOCALES],
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: "/locales/{{lng}}/translation.json"
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18nInstance;
