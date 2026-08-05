import type { NextConfig } from "next";
import { IMAGE_REMOTE_PATTERNS } from "./lib/image-hosts";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Scoped to UploadThing's CDN. A wildcard host here turns /_next/image into
    // an open image proxy: anyone could fetch arbitrary remote content through
    // this domain, on your bandwidth. Shared with the gallery write path so a
    // stored URL is always one the renderer will accept — see lib/image-hosts.ts.
    remotePatterns: IMAGE_REMOTE_PATTERNS,
  },
};

export default nextConfig;
