"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { fetchContentFromBackend } from "@/lib/services/contentLoader.service";
import type { SupportedLocale } from "@/lib/i18n";

type CmsItem = {
  content_type: string;
  content_ZH: string;
  content_EN: string;
};

export type CmsContentMap = Record<string, { zh: string; en: string }>;

type WebContentContextValue = {
  cms: CmsContentMap;
  locale: SupportedLocale;
  isLoading: boolean;
  text: (contentType: string, fallbackKey?: string) => string;
};

const WebContentContext = createContext<WebContentContextValue | undefined>(undefined);

function resolveLocale(language: string): SupportedLocale {
  return language === "zh-TW" ? "zh-TW" : "en";
}

function mapCmsPayload(items: CmsItem[]): CmsContentMap {
  return Object.fromEntries(
    items.map((item) => [
      item.content_type,
      { zh: item.content_ZH ?? "", en: item.content_EN ?? "" }
    ])
  );
}

function parseCmsPayload(payload: unknown): CmsContentMap {
  if (Array.isArray(payload)) {
    const parsedItems = payload.filter(
      (item): item is CmsItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as CmsItem).content_type === "string"
    );

    return mapCmsPayload(parsedItems);
  }

  if (!payload || typeof payload !== "object") {
    return {};
  }

  const record = payload as Record<string, unknown>;
  const items = record.items;

  if (!Array.isArray(items)) {
    return {};
  }

  const parsedItems = items.filter(
    (item): item is CmsItem =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as CmsItem).content_type === "string"
  );

  return mapCmsPayload(parsedItems);
}

function pickCmsText(cms: CmsContentMap, contentType: string, locale: SupportedLocale): string {
  const entry = cms[contentType];
  if (!entry) {
    return "";
  }

  return locale === "zh-TW" ? entry.zh : entry.en;
}

export function WebContentProvider({ children }: { children: ReactNode }) {
  const { i18n, t } = useTranslation();
  const [cms, setCms] = useState<CmsContentMap>({});
  const [isLoading, setIsLoading] = useState(true);

  const locale = resolveLocale(i18n.language);

  useEffect(() => {
    let cancelled = false;

    fetchContentFromBackend()
      .then((data) => {
        if (cancelled) {
          return;
        }

        const mapped = parseCmsPayload(data);
        setCms(mapped);

        if (process.env.NODE_ENV === "development") {
          console.info(
            `[WebContentProvider] Loaded ${Object.keys(mapped).length} CMS content keys`
          );
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setCms({});
        }

        if (process.env.NODE_ENV === "development") {
          console.error("[WebContentProvider] Failed to load CMS content:", error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<WebContentContextValue>(
    () => ({
      cms,
      locale,
      isLoading,
      text(contentType: string, fallbackKey?: string) {
        const fromCms = pickCmsText(cms, contentType, locale);
        if (fromCms) {
          return fromCms;
        }

        return fallbackKey ? t(fallbackKey) : "";
      }
    }),
    [cms, locale, isLoading, t]
  );

  return <WebContentContext.Provider value={value}>{children}</WebContentContext.Provider>;
}

export function useWebContent() {
  const context = useContext(WebContentContext);

  if (!context) {
    throw new Error("useWebContent must be used within WebContentProvider");
  }

  return context;
}
