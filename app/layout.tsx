import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Bricolage_Grotesque, Dancing_Script } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";

// Display face for the hero and headings. Body stays on SF Pro.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const signature = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});
import PageTransition from "./components/PageTransition";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import NotesAutoLock from "./components/NotesAutoLock";
import { site } from "./lib/site";

const sfProDisplay = localFont({
  src: [
    {
      path: "../public/fonts/SFProDisplay-Light.woff2",
      weight: "300",
      style: "normal",
    },
    
    {
      path: "../public/fonts/SFProDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    
    {
      path: "../public/fonts/SFProDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    
    {
      path: "../public/fonts/SFProDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    
    {
      path: "../public/fonts/SFProDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    
  ],
  variable: "--font-sf", // optional CSS var if you want to use it in Tailwind
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "Noto Sans",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.shortName,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: site.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#161616" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.shortName,
    jobTitle: "Design Engineer",
    url: site.url,
    email: `mailto:${site.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    sameAs: site.sameAs,
    knowsAbout: [
      "Design Engineering",
      "Product Design",
      "Design Systems",
      "React",
      "Next.js",
      "TypeScript",
    ],
    description: site.description,
  };

  return (
    <html lang="en">
      {/* Next injects <head> from metadata/viewport */}
      <body
        className={`${sfProDisplay.variable} ${bricolage.variable} ${signature.variable} antialiased bg-white text-custom-gray-900 dark:bg-app-bg-dark dark:text-app-text-dark`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ViewTransitions>
          <ThemeProvider>
            <ThemeToggle />
            <NotesAutoLock />
            <PageTransition>{children}</PageTransition>
          </ThemeProvider>
        </ViewTransitions>
      </body>
      <Analytics />
    </html>
  );
}
