export type ApiMode = "production" | "development" | "local";

const MODE_ALIASES: Record<string, ApiMode> = {
  prod: "production",
  production: "production",
  dev: "development",
  development: "development",
  local: "local"
};

function readEnv(name: string) {
  const value = process.env[name];
  return value?.trim() ? value.trim() : undefined;
}

function resolveMode(): ApiMode {
  const rawMode = (
    readEnv("NEXT_PUBLIC_API_MODE") ??
    readEnv("API_MODE") ??
    "local"
  ).toLowerCase();

  return MODE_ALIASES[rawMode] ?? "local";
}

function getConfiguredBaseUrl(mode: ApiMode) {
  const byMode = {
    production:
      readEnv("NEXT_PUBLIC_API_BASE_URL_PRODUCTION") ??
      readEnv("API_BASE_URL_PRODUCTION"),
    development:
      readEnv("NEXT_PUBLIC_API_BASE_URL_DEVELOPMENT") ??
      readEnv("API_BASE_URL_DEVELOPMENT"),
    local:
      readEnv("NEXT_PUBLIC_API_BASE_URL_LOCAL") ??
      readEnv("API_BASE_URL_LOCAL")
  } as const;

  const configuredUrl =
    readEnv("NEXT_PUBLIC_API_BASE_URL") ??
    readEnv("API_BASE_URL") ??
    byMode[mode] ??
    "";

  // Local dev uses Next.js rewrite proxy by default to avoid CORS issues.
  if (mode === "local" && readEnv("NEXT_PUBLIC_API_USE_SAME_ORIGIN_PROXY") !== "false") {
    return "";
  }

  return configuredUrl;
}

export function getApiBaseUrl() {
  const mode = resolveMode();
  return getConfiguredBaseUrl(mode);
}

export function joinApiUrl(baseUrl: string, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!baseUrl) {
    return normalizedPath;
  }

  return `${baseUrl.replace(/\/+$/, "")}${normalizedPath}`;
}
