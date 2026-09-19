import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "app", "data", "bookmarks.json");

export interface Bookmark {
  title: string;
  url: string;
  description: string;
  domain: string;
}

async function fetchMetadata(url: string): Promise<Partial<Bookmark>> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 * 24 }, // Cache for 24 hours
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AbdulsamadPortfolioBot/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "";
    
    let description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    // Clean up description if needed
    if (description) {
        description = description.trim();
    }

    return {
      title,
      description,
    };
  } catch (error) {
    console.error(`Error fetching metadata for ${url}:`, error);
    return {};
  }
}

export async function getEnrichedBookmarks(): Promise<Bookmark[]> {
  let rawBookmarks: Partial<Bookmark>[] = [];
  
  try {
    const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
    rawBookmarks = JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading bookmarks data:", error);
    return [];
  }

  const bookmarks = await Promise.all(
    rawBookmarks.map(async (item) => {
      const url = item.url;
      if (!url) return null;

      const domain = new URL(url).hostname.replace("www.", "");
      
      // If title and description are already present, skip fetching
      if (item.title && item.description) {
        return {
          title: item.title,
          url,
          description: item.description,
          domain,
        } as Bookmark;
      }

      // Otherwise, fetch metadata to fill in gaps
      const metadata = await fetchMetadata(url);
      
      return {
        title: (item.title && item.title.trim() !== "") ? item.title : (metadata.title || domain),
        url,
        description: (item.description && item.description.trim() !== "") ? item.description : (metadata.description || "No description available."),
        domain,
      } as Bookmark;
    })
  );

  return bookmarks.filter((b): b is Bookmark => b !== null);
}
