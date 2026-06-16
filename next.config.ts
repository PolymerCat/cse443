import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Silences the Next.js 16 error and allows the PWA Webpack plugin to run
  turbopack: {}, 
};

export default withPWA(nextConfig);