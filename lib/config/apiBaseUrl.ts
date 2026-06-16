export type ApiMode = "production" | "development" | "local";

const MODE_ALIASES: Record<string, ApiMode> = {
  prod: "production",
  production: "production",
  dev: "development",
  development: "development",
  local: "local"
};

function asOptionalTrimmed(value: string | undefined) {
  return value?.trim() ? value.trim() : undefined;
}

// Use static property access for NEXT_PUBLIC_* so Next.js can inline values
// into the client bundle during build.
const NEXT_PUBLIC_API_MODE = asOptionalTrimmed(process.env.NEXT_PUBLIC_API_MODE);
const NEXT_PUBLIC_API_BASE_URL = asOptionalTrimmed(process.env.NEXT_PUBLIC_API_BASE_URL);
const NEXT_PUBLIC_API_BASE_URL_PRODUCTION = asOptionalTrimmed(process.env.NEXT_PUBLIC_API_BASE_URL_PRODUCTION);
const NEXT_PUBLIC_API_BASE_URL_DEVELOPMENT = asOptionalTrimmed(process.env.NEXT_PUBLIC_API_BASE_URL_DEVELOPMENT);
const NEXT_PUBLIC_API_BASE_URL_LOCAL = asOptionalTrimmed(process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL);
const NEXT_PUBLIC_API_USE_SAME_ORIGIN_PROXY = asOptionalTrimmed(process.env.NEXT_PUBLIC_API_USE_SAME_ORIGIN_PROXY);

function readRuntimeEnv(name: string) {
  const value = process.env[name];
  return asOptionalTrimmed(value);
}

function resolveMode(): ApiMode {
  const rawMode = (
    NEXT_PUBLIC_API_MODE ??
    readRuntimeEnv("API_MODE") ??
    "local"
  ).toLowerCase();

  return MODE_ALIASES[rawMode] ?? "local";
}

function getConfiguredBaseUrl(mode: ApiMode) {
  const byMode = {
    production:
      NEXT_PUBLIC_API_BASE_URL_PRODUCTION ??
      readRuntimeEnv("API_BASE_URL_PRODUCTION"),
    development:
      NEXT_PUBLIC_API_BASE_URL_DEVELOPMENT ??
      readRuntimeEnv("API_BASE_URL_DEVELOPMENT"),
    local:
      NEXT_PUBLIC_API_BASE_URL_LOCAL ??
      readRuntimeEnv("API_BASE_URL_LOCAL")
  } as const;

  const configuredUrl =
    NEXT_PUBLIC_API_BASE_URL ??
    readRuntimeEnv("API_BASE_URL") ??
    byMode[mode] ??
    "";

  // Local dev uses Next.js rewrite proxy by default to avoid CORS issues.
  if (mode === "local" && NEXT_PUBLIC_API_USE_SAME_ORIGIN_PROXY !== "false") {
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
