import type { NextConfig } from "next";

const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/+$/, "") ?? "http://127.0.0.1:8000";

function buildMediaRemotePatterns() {
  const sourceUrls = [
    apiProxyTarget,
    process.env.NEXT_PUBLIC_API_BASE_URL_PRODUCTION,
    process.env.NEXT_PUBLIC_API_BASE_URL_DEVELOPMENT,
    process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL
  ];

  const patterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [];

  for (const sourceUrl of sourceUrls) {
    if (!sourceUrl) {
      continue;
    }

    try {
      const url = new URL(sourceUrl);
      const protocol = url.protocol.replace(":", "") as "http" | "https";

      patterns.push({
        protocol,
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: "/api/v1/media/**"
      });
    } catch {
      // Ignore invalid URL values in env.
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.0.128"],
  images: {
    remotePatterns: buildMediaRemotePatterns()
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiProxyTarget}/api/v1/:path*`
      }
    ];
  }
};

export default nextConfig;
