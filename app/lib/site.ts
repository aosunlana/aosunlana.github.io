// Single source of truth for site-wide SEO constants.
export const site = {
  name: "Abdulsamad Osunlana",
  shortName: "aosunlana",
  // No production domain confirmed yet. Placeholder only — do not treat as real.
  // TODO: replace with the real domain once one is chosen and deployed.
  url: "https://aosunlana.dev", // no trailing slash
  title: "Abdulsamad Osunlana · Software Engineer",
  description:
    "Software engineer and founder. I build event-commerce and storefront platforms end to end — product, backend, and payments infrastructure.",
  email: "adwhatsap@gmail.com",
  // No verified Twitter/X handle. Leave blank rather than invent one.
  twitter: "",
  locale: "en_US",
  // Real, current profiles only. This is how a search engine links the site
  // to the same person across the web (powers the name knowledge panel).
  sameAs: [
    "https://github.com/aosunlana",
    // TODO: add real LinkedIn URL once confirmed.
  ],
} as const;
