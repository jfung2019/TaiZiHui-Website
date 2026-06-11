import { getApiBaseUrl, joinApiUrl } from "@/lib/config/apiBaseUrl";

export type FacebookPostViewModel = {
  id: string;
  title: string | null;
  description: string | null;
  date: string;
  imageAlt: string;
  imageSrc: string;
  link: string;
};

type FetchFacebookPostsOptions = {
  locale: "en" | "zh-TW";
  fallbackPageLink: string;
  limit?: number;
};

type UnknownRecord = Record<string, unknown>;

function asString(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  // Backend IDs can be numeric (e.g. id: 1), keep them as strings.
  if (typeof value === "number" || typeof value === "bigint") {
    return String(value).trim();
  }

  return "";
}

function stripHtmlToPlainText(raw: string) {
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sanitizeText(rawValue: unknown) {
  const value = asString(rawValue);
  if (!value) {
    return "";
  }
  return stripHtmlToPlainText(value).replace(/[ \t]{2,}/g, " ").trim();
}

function splitTitleAndDescription(content: string) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return { titleFromDescription: null, bodyDescription: null as string | null };
  }

  const [firstLine, ...rest] = lines;
  return {
    titleFromDescription: firstLine,
    bodyDescription: rest.length ? rest.join(" ") : null
  };
}

function formatPostDate(rawValue: unknown, locale: "en" | "zh-TW") {
  const input = asString(rawValue);
  if (!input) {
    return "";
  }

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return input;
  }

  if (locale === "zh-TW") {
    return new Intl.DateTimeFormat("zh-HK", {
      month: "numeric",
      day: "numeric"
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit"
  })
    .format(date)
    .toUpperCase();
}

function resolveArrayPayload(payload: unknown): UnknownRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is UnknownRecord => typeof item === "object" && item !== null);
  }

  if (typeof payload !== "object" || payload === null) {
    return [];
  }

  const root = payload as UnknownRecord;
  const candidates = [root.data, root.items, root.posts];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter((item): item is UnknownRecord => typeof item === "object" && item !== null);
    }
  }

  if (typeof root.posts === "object" && root.posts !== null) {
    const nestedPosts = root.posts as UnknownRecord;
    if (Array.isArray(nestedPosts.items)) {
      return nestedPosts.items.filter((item): item is UnknownRecord => typeof item === "object" && item !== null);
    }
  }

  return [];
}

function buildViewModel(
  rawPost: UnknownRecord,
  locale: "en" | "zh-TW",
  fallbackPageLink: string
): FacebookPostViewModel | null {
  const id = asString(rawPost.id ?? rawPost.post_id ?? rawPost.external_id);
  const imageSrc = asString(
    rawPost.imageSrc ??
      rawPost.image_url ??
      rawPost.imageUrl ??
      rawPost.image ??
      rawPost.full_picture ??
      rawPost.picture
  );

  if (!id || !imageSrc) {
    return null;
  }

  const directTitle = sanitizeText(rawPost.title);
  const rawDescription = sanitizeText(
    rawPost.description ?? rawPost.message ?? rawPost.unformatted_message ?? rawPost.caption
  );
  const { titleFromDescription, bodyDescription } = splitTitleAndDescription(rawDescription);
  const title = directTitle || titleFromDescription || null;
  const description = bodyDescription ?? (directTitle ? rawDescription : null);
  const link = asString(rawPost.link ?? rawPost.permalink_url ?? rawPost.permalinkUrl ?? rawPost.url) || fallbackPageLink;
  const date = formatPostDate(
    rawPost.date ?? rawPost.created_time,
    locale
  );

  return {
    id,
    title,
    description,
    date,
    imageAlt: title || description || "Facebook post image",
    imageSrc,
    link
  };
}

export async function fetchFacebookPostsFromBackend({
  locale,
  fallbackPageLink,
  limit = 4
}: FetchFacebookPostsOptions): Promise<FacebookPostViewModel[]> {
  const baseUrl = getApiBaseUrl();
  const endpointPath =
    process.env.NEXT_PUBLIC_API_FACEBOOK_POSTS_PATH?.trim() || "/api/v1/customer-app/facebook-posts";
  const endpointUrl = joinApiUrl(baseUrl, endpointPath);
  const query = new URLSearchParams({
    locale,
    limit: String(limit)
  });

  const response = await fetch(`${endpointUrl}?${query.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Facebook backend request failed: ${response.status}`);
  }

  const payload: unknown = await response.json();
  const rawPosts = resolveArrayPayload(payload);

  return rawPosts
    .map((post) => buildViewModel(post, locale, fallbackPageLink))
    .filter((post): post is FacebookPostViewModel => post !== null)
    .slice(0, limit);
}
