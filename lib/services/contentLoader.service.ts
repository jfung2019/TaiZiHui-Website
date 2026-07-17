import { getApiBaseUrl, joinApiUrl } from "@/lib/config/apiBaseUrl";
import type { SupportedLocale } from "@/lib/i18n";

const CONTENT_LOADER_ENDPOINT_PATH = "/api/v1/website/content";

type CmsItem = {
  content_type: string;
  content_ZH: string;
  content_EN: string;
};

export type CmsContentMap = Record<string, { zh: string; en: string }>;

function mapCmsPayload(items: CmsItem[]): CmsContentMap {
  return Object.fromEntries(
    items.map((item) => [
      item.content_type,
      { zh: item.content_ZH ?? "", en: item.content_EN ?? "" }
    ])
  );
}

export function parseCmsPayload(payload: unknown): CmsContentMap {
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

export function pickCmsText(
  cms: CmsContentMap,
  contentType: string,
  locale: SupportedLocale
): string {
  const entry = cms[contentType];
  if (!entry) {
    return "";
  }

  return locale === "zh-TW" ? entry.zh : entry.en;
}

export async function fetchContentFromBackend(): Promise<unknown> {
  const baseUrl = getApiBaseUrl();
  const endpointUrl = joinApiUrl(baseUrl, CONTENT_LOADER_ENDPOINT_PATH);

  if (process.env.NODE_ENV === "development") {
    console.info(`[contentLoader] GET ${endpointUrl || CONTENT_LOADER_ENDPOINT_PATH}`);
  }

  const response = await fetch(endpointUrl, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Content request failed: ${response.status}`);
  }

  return response.json();
}