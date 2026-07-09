import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Defaults to ".next". Set NEXT_BUILD_DIR to run a verification build without
  // clobbering the dev server's ".next". No effect on normal dev/deploy.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  images: {
    // Local images in /public need no config. For remotely hosted playground
    // mockups (e.g. Vercel Blob), allow the host here. Add more as needed.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
