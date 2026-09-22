import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  outputFileTracingIncludes: {
    "/*": ["./data/baseline.sqlite"],
  },
  async headers() {
    const instantFootballHeaders = [
      { key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" },
      { key: "CDN-Cache-Control", value: "no-store" },
      { key: "Vercel-CDN-Cache-Control", value: "no-store" },
          { key: "x-if-build", value: "if-flow-v13" },
    ];
    return [
      { source: "/virtuals/instant-football", headers: instantFootballHeaders },
      { source: "/virtuals/instant-football/:path*", headers: instantFootballHeaders },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 375, 390, 412, 430, 720, 1080, 1280, 1440, 1920],
    imageSizes: [64, 72, 96, 128, 256, 384, 512],
    remotePatterns: [
      { protocol: "https", hostname: "media.api-sports.io" },
      { protocol: "https", hostname: "media.api-football.com" },
    ],
  },
};

export default nextConfig;
