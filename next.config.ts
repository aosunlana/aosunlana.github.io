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
  // Serve one host. www duplicates the apex and splits ranking signals, so send
  // every www request to the apex permanently. (If the apex is set as the
  // primary domain in Vercel, that handles it at the edge and this is a no-op.)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.emmah.xyz" }],
        destination: "https://emmah.xyz/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
