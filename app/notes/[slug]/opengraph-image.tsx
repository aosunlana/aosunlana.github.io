import { ImageResponse } from "next/og";
import { getNoteBySlug } from "@/lib/notes";
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
  let title: string = site.name;
  let subtitle: string = "Design engineer";
  try {
    const note = getNoteBySlug(slug);
    title = note.frontmatter.title ?? title;
    subtitle = note.frontmatter.description ?? subtitle;
  } catch {
    // Fall back to defaults.
  }

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
              fontSize: 64,
              lineHeight: 1.1,
              color: "#111827",
              fontWeight: 600,
            }}
          >
            {title.length > 90 ? `${title.slice(0, 90)}…` : title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#6B7280",
              lineHeight: 1.3,
            }}
          >
            {subtitle.length > 120 ? `${subtitle.slice(0, 120)}…` : subtitle}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
