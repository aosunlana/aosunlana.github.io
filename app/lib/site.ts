// Single source of truth for site-wide SEO constants.
export const site = {
  name: "Emmanuel A. Priestley",
  shortName: "emmah",
  url: "https://emmah.xyz", // no trailing slash
  title: "Emmanuel A. Priestley · Design Engineer",
  description:
    "Design engineer. I design interfaces and build the version that ships. Most recently at Tempo (YC S23).",
  email: "hello@emmah.xyz",
  twitter: "@hey_emmah",
  locale: "en_US",
  // Real, current profiles only. This is how a search engine links the site
  // to the same person across the web (powers the name knowledge panel).
  sameAs: [
    "https://www.linkedin.com/in/emmah-priestley/",
    "https://x.com/hey_emmah",
    "https://github.com/hey-emmah",
  ],
} as const;
