import { ImageResponse } from "next/og";
import { crafts, getCraftIndex } from "../crafts";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const craft = crafts[getCraftIndex(slug)];
  const title = craft?.title ?? "Playground";
  const subtitle = "An experiment in components, interactions, and motion.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#6B7280" }}>
          emmah.xyz
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.1,
              color: "#111827",
              fontWeight: 600,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#6B7280" }}>
            {subtitle}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
