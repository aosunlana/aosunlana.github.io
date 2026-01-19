import * as cheerio from "cheerio";

export interface Bookmark {
  title: string;
  url: string;
  description: string;
  domain: string;
}

const BOOKMARK_URLS = [
  "https://greensock.com",
  "https://vercel.com/design",
  "https://family.co",
  "https://linear.app/method",
  "https://rauno.me",
  "https://craft.do",
  "https://x.com/bluewmist/status/2012755834636533893",
];

// Fallback data in case fetching fails
const FALLBACK_DATA: Record<string, Partial<Bookmark>> = {
  "https://x.com/bluewmist/status/2012755834636533893": {
    title: "Unrot your brain",
    description: "There was a time I devoured books like candy. Sometimes reading them as a pdfs, unable to wait for it as a gift. I kept notebooks full of weird facts and quotes I didnt quite understand. I was the smart girl.",
  },
  "https://greensock.com": {
    title: "GSAP (GreenSock)",
    description: "The standard for modern web animation. Robust, performant, and essential for creative development.",
  },
  "https://vercel.com/design": {
    title: "Vercel Design System",
    description: "A masterclass in clean, functional, and scalable design systems.",
  },
  "https://family.co": {
    title: "Family",
    description: "Incredible crypto wallet interface design. Smooth interactions and thoughtful details.",
  },
  "https://linear.app/method": {
    title: "Linear Guide",
    description: "Not just a tool manual, but a philosophy on building software effectively.",
  },
  "https://rauno.me": {
    title: "Rauno Freiberg",
    description: "A continuous source of inspiration for interaction design and craft.",
  },
  "https://craft.do": {
    title: "Craft",
    description: "Beautiful native-feeling interactions on the web. A benchmark for quality.",
  },
};

async function fetchMetadata(url: string): Promise<Partial<Bookmark>> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 * 24 }, // Cache for 24 hours
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EmmahPortfolio/1.0; +https://emmah.xyz)",
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
  const bookmarks = await Promise.all(
    BOOKMARK_URLS.map(async (url) => {
      const domain = new URL(url).hostname.replace("www.", "");
      const metadata = await fetchMetadata(url);
      const fallback = FALLBACK_DATA[url] || {};

      // Prioritize fetched data, but use fallback if fetched data is missing or empty
      const title = (metadata.title && metadata.title.trim() !== "") 
        ? metadata.title 
        : (fallback.title || domain);
        
      const description = (metadata.description && metadata.description.trim() !== "") 
        ? metadata.description 
        : (fallback.description || "No description available.");

      return {
        title,
        url,
        description,
        domain,
      };
    })
  );

  return bookmarks;
}
