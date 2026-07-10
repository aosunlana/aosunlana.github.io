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
  // Canonical host (www vs apex) is handled at the edge by Vercel's domain
  // settings, NOT here. An app-level host redirect fights Vercel's own
  // domain-level redirect and causes an infinite loop (ERR_TOO_MANY_REDIRECTS).
};

export default nextConfig;
