import type { NextConfig } from "next";
import { IMAGE_REMOTE_PATTERNS } from "./lib/image-hosts";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // A wildcard host here turns /_next/image into an open image proxy: anyone
    // could fetch arbitrary remote content through this domain, on your bandwidth.
    remotePatterns: IMAGE_REMOTE_PATTERNS,
  },
};

export default nextConfig;
