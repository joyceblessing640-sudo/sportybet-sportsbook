import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
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
