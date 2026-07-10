import { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/notes";
import { crafts } from "@/playground/crafts";

const BASE_URL = "https://emmah.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getAllNotes();

  const notesUrls = notes.map((note) => ({
    url: `${BASE_URL}/notes/${note.slug}`,
    lastModified: new Date(note.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const craftUrls = crafts.map((craft) => ({
    url: `${BASE_URL}/playground/${craft.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/playground`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...notesUrls, ...craftUrls];
}
