import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Replaces a static branded PNG (which carried the previous owner's name) with
// a generated card built from the current site identity, so the OG image can
// never drift out of sync with who the site actually belongs to.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

export default async function Image() {
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
          {site.shortName}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.1,
              color: "#111827",
              fontWeight: 600,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#6B7280",
              lineHeight: 1.3,
            }}
          >
            {site.description}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
