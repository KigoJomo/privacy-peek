import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@sparticuz/chromium-min'],
  turbopack: {
    root: '/home/roci/workspace/privacy-peek',
  },
};

export default nextConfig;
