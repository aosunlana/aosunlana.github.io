import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const neueMontreal = localFont({
  src: [
    { path: "../public/fonts/NeueMontreal-Light.woff2",        weight: "300", style: "normal" },
    { path: "../public/fonts/NeueMontreal-LightItalic.woff2",  weight: "300", style: "italic" },
    { path: "../public/fonts/NeueMontreal-Regular.woff2",      weight: "400", style: "normal" },
    { path: "../public/fonts/NeueMontreal-Italic.woff2",       weight: "400", style: "italic" },
    { path: "../public/fonts/NeueMontreal-Medium.woff2",       weight: "500", style: "normal" },
    { path: "../public/fonts/NeueMontreal-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../public/fonts/NeueMontreal-Bold.woff2",         weight: "700", style: "normal" },
    { path: "../public/fonts/NeueMontreal-BoldItalic.woff2",   weight: "700", style: "italic" },
  ],
  variable: "--font-neue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Emmanuel - Design Engineer",
  description:
    "Hi, I’m Emmanuel - A Curious human who design interfaces and build digital things for a living",
};

/** ✅ Proper viewport (iOS safe area, no invalid <head> placement) */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#161616" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Next will inject <head> from metadata/viewport above */}
      <body className={`${neueMontreal.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
