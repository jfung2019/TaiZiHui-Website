import { getApiBaseUrl, joinApiUrl } from "@/lib/config/apiBaseUrl";
import type { SupportedLocale } from "@/lib/i18n";

const DEFAULT_ENDPOINTS = {
  menuItems: "/api/v1/cms/menu-items",
  signatureItems: "/api/v1/cms/menu-items/chef-reco",
  preOrderRequiredItems: "/api/v1/cms/menu-items/pre-order-required",
  setMenus: "/api/v1/cms/set-menus",
  ingredients: "/api/v1/cms/ingredients",
  carousel: "/api/v1/cms/carousel"
} as const;

type CmsLocale = SupportedLocale;

export type CarouselRecord = {
  id: number;
  sort_order: number;
  image_url: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
};
export type MenuItemRecord = {
  id: number;
  name_zh: string;
  name_en: string;
  category: string;
  description_zh: string;
  description_en: string;
  image_url: string;
  chef_reco: boolean;
  pre_order_required: boolean;
  set_menu_id: number | null;
  created_at: string;
  updated_at: string;
};

export type SetMenuRecord = {
  id: number;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  image_url: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type IngredientRecord = {
  id: number;
  name_zh: string;
  name_en: string;
  image_url: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuItemViewModel = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  chefReco: boolean;
  preOrderRequired: boolean;
  setMenuId: number | null;
};

export type SetMenuViewModel = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

export type IngredientViewModel = {
  id: string;
  name: string;
  imageUrl: string;
};

export type CarouselViewModel = {
  id: string;
  sortOrder: number;
  imageUrl: string;
  visible: boolean;
};

type UnknownRecord = Record<string, unknown>;

function asString(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return String(value).trim();
  }

  return "";
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function resolveArrayPayload(payload: unknown): UnknownRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is UnknownRecord => typeof item === "object" && item !== null);
  }

  if (typeof payload !== "object" || payload === null) {
    return [];
  }

  const root = payload as UnknownRecord;
  const candidates = [root.data, root.items, root.results];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter((item): item is UnknownRecord => typeof item === "object" && item !== null);
    }
  }

  return [];
}

function pickLocalizedText(zh: string, en: string, locale: CmsLocale) {
  const zhText = zh.trim();
  const enText = en.trim();
  return locale === "zh-TW" ? zhText || enText : enText || zhText;
}

function normalizeCmsImageUrl(imageUrl: string) {
  const trimmed = imageUrl.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    if (!url.pathname.startsWith("/api/v1/media/")) {
      return trimmed;
    }

    // Local dev: load media through the Next.js /api/v1 proxy (same origin).
    if (process.env.NEXT_PUBLIC_API_USE_SAME_ORIGIN_PROXY !== "false") {
      return `${url.pathname}${url.search}`;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

function mapMenuItemRecord(raw: UnknownRecord): MenuItemRecord | null {
  const id = asNumber(raw.id);
  const imageUrl = normalizeCmsImageUrl(asString(raw.image_url ?? raw.imageUrl));

  if (id === null || !imageUrl) {
    return null;
  }

  return {
    id,
    name_zh: asString(raw.name_zh ?? raw.name_ZH),
    name_en: asString(raw.name_en ?? raw.name_EN),
    category: asString(raw.category),
    description_zh: asString(raw.description_zh ?? raw.description_ZH),
    description_en: asString(raw.description_en ?? raw.description_EN),
    image_url: imageUrl,
    chef_reco: asBoolean(raw.chef_reco ?? raw.chefReco),
    pre_order_required: asBoolean(raw.pre_order_required ?? raw.preOrderRequired),
    set_menu_id: asNumber(raw.set_menu_id ?? raw.setMenuId),
    created_at: asString(raw.created_at),
    updated_at: asString(raw.updated_at)
  };
}

function mapSetMenuRecord(raw: UnknownRecord): SetMenuRecord | null {
  const id = asNumber(raw.id);
  const imageUrl = normalizeCmsImageUrl(asString(raw.image_url ?? raw.imageUrl));

  if (id === null || !imageUrl) {
    return null;
  }

  return {
    id,
    name_zh: asString(raw.name_zh ?? raw.name_ZH),
    name_en: asString(raw.name_en ?? raw.name_EN),
    description_zh: asString(raw.description_zh ?? raw.description_ZH),
    description_en: asString(raw.description_en ?? raw.description_EN),
    image_url: imageUrl,
    visible: asBoolean(raw.visible, true),
    created_at: asString(raw.created_at),
    updated_at: asString(raw.updated_at)
  };
}

function mapIngredientRecord(raw: UnknownRecord): IngredientRecord | null {
  const id = asNumber(raw.id);
  const imageUrl = normalizeCmsImageUrl(asString(raw.image_url ?? raw.imageUrl));

  if (id === null || !imageUrl) {
    return null;
  }

  return {
    id,
    name_zh: asString(raw.name_zh ?? raw.name_ZH),
    name_en: asString(raw.name_en ?? raw.name_EN),
    image_url: imageUrl,
    visible: asBoolean(raw.visible, true),
    created_at: asString(raw.created_at),
    updated_at: asString(raw.updated_at)
  };
}

function mapCarouselRecord(raw: UnknownRecord): CarouselRecord | null {
  const id = asNumber(raw.id);
  const imageUrl = normalizeCmsImageUrl(asString(raw.image_url ?? raw.imageUrl));

  if (id === null || !imageUrl) {
    return null;
  }

  return {
    id,
    sort_order: asNumber(raw.sort_order ?? raw.sortOrder) ?? 0,
    image_url: imageUrl,
    visible: asBoolean(raw.visible, true),
    created_at: asString(raw.created_at),
    updated_at: asString(raw.updated_at)
  };
}

export function toMenuItemViewModel(item: MenuItemRecord, locale: CmsLocale): MenuItemViewModel {
  return {
    id: String(item.id),
    name: pickLocalizedText(item.name_zh, item.name_en, locale),
    description: pickLocalizedText(item.description_zh, item.description_en, locale),
    imageUrl: item.image_url,
    category: item.category,
    chefReco: item.chef_reco,
    preOrderRequired: item.pre_order_required,
    setMenuId: item.set_menu_id
  };
}

export function toSetMenuViewModel(item: SetMenuRecord, locale: CmsLocale): SetMenuViewModel {
  return {
    id: String(item.id),
    name: pickLocalizedText(item.name_zh, item.name_en, locale),
    description: pickLocalizedText(item.description_zh, item.description_en, locale),
    imageUrl: item.image_url
  };
}

export function toIngredientViewModel(item: IngredientRecord, locale: CmsLocale): IngredientViewModel {
  return {
    id: String(item.id),
    name: pickLocalizedText(item.name_zh, item.name_en, locale),
    imageUrl: item.image_url
  };
}

export function toCarouselViewModel(item: CarouselRecord): CarouselViewModel {
  return {
    id: String(item.id),
    sortOrder: item.sort_order,
    imageUrl: item.image_url,
    visible: item.visible
  };
}

async function fetchCmsArray<T>(
  path: string,
  resourceName: string,
  mapRecord: (raw: UnknownRecord) => T | null
): Promise<T[]> {
  const baseUrl = getApiBaseUrl();
  const endpointUrl = joinApiUrl(baseUrl, path);

  const response = await fetch(endpointUrl, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`${resourceName} request failed: ${response.status}`);
  }

  const payload: unknown = await response.json();

  return resolveArrayPayload(payload)
    .map(mapRecord)
    .filter((item): item is T => item !== null);
}

function getMenuItemsPath() {
  return process.env.NEXT_PUBLIC_API_MENU_ITEMS_PATH?.trim() || DEFAULT_ENDPOINTS.menuItems;
}

function getSignatureItemsPath() {
  return process.env.NEXT_PUBLIC_API_SIGNATURE_ITEMS_PATH?.trim() || DEFAULT_ENDPOINTS.signatureItems;
}

function getPreOrederRequiredItemsPath() {
    return process.env.NEXT_PUBLIC_API_PRE_ORDER_REQUIRED_ITEMS_PATH?.trim() || DEFAULT_ENDPOINTS.preOrderRequiredItems;
  }

function getSetMenusPath() {
  return process.env.NEXT_PUBLIC_API_SET_MENUS_PATH?.trim() || DEFAULT_ENDPOINTS.setMenus;
}

function getIngredientsPath() {
  return process.env.NEXT_PUBLIC_API_INGREDIENTS_PATH?.trim() || DEFAULT_ENDPOINTS.ingredients;
}

function getCarouselPath() {
  return process.env.NEXT_PUBLIC_API_CAROUSEL_PATH?.trim() || DEFAULT_ENDPOINTS.carousel;
}

export async function fetchSignatureItemsFromBackend(): Promise<MenuItemRecord[]> {
  return fetchCmsArray(getSignatureItemsPath(), "Signature menu items", mapMenuItemRecord);
}

export async function fetchPreOrderRequiredItemsFromBackend(): Promise<MenuItemRecord[]> {
  return fetchCmsArray(getPreOrederRequiredItemsPath(), "Pre order required items", mapMenuItemRecord);
}

export async function fetchMenuItemsFromBackend(): Promise<MenuItemRecord[]> {
  return fetchCmsArray(getMenuItemsPath(), "Menu items", mapMenuItemRecord);
}

export async function fetchSetMenusFromBackend(): Promise<SetMenuRecord[]> {
  return fetchCmsArray(getSetMenusPath(), "Set menus", mapSetMenuRecord).then((items) =>
    items.filter((item) => item.visible)
  );
}

export async function fetchIngredientsFromBackend(): Promise<IngredientRecord[]> {
  return fetchCmsArray(getIngredientsPath(), "Ingredients", mapIngredientRecord).then((items) =>
    items.filter((item) => item.visible)
  );
}

export async function fetchMenuItemViewModelsFromBackend(
  locale: CmsLocale
): Promise<MenuItemViewModel[]> {
  const items = await fetchMenuItemsFromBackend();
  return items.map((item) => toMenuItemViewModel(item, locale));
}

export async function fetchSignatureItemViewModelsFromBackend(
  locale: CmsLocale
): Promise<MenuItemViewModel[]> {
  const items = await fetchSignatureItemsFromBackend();
  return items.map((item) => toMenuItemViewModel(item, locale));
}

export async function fetchPreOrderRequiredItemViewModelsFromBackend(
  locale: CmsLocale
): Promise<MenuItemViewModel[]> {
  const items = await fetchPreOrderRequiredItemsFromBackend();
  return items.map((item) => toMenuItemViewModel(item, locale));
}

export async function fetchSetMenuViewModelsFromBackend(
  locale: CmsLocale
): Promise<SetMenuViewModel[]> {
  const items = await fetchSetMenusFromBackend();
  return items.map((item) => toSetMenuViewModel(item, locale));
}

export async function fetchIngredientViewModelsFromBackend(
  locale: CmsLocale
): Promise<IngredientViewModel[]> {
  const items = await fetchIngredientsFromBackend();
  return items.map((item) => toIngredientViewModel(item, locale));
}

export async function fetchCarouselFromBackend(): Promise<CarouselRecord[]> {
  return fetchCmsArray(getCarouselPath(), "Carousel items", mapCarouselRecord).then((items) =>
    items.filter((item) => item.visible)
  );
}

export async function fetchCarouselViewModelsFromBackend(): Promise<CarouselViewModel[]> {
  const items = await fetchCarouselFromBackend();
  return items.map((item) => toCarouselViewModel(item));
}