import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PageTransition from "./components/PageTransition";

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
  title: "Emmanuel - Design Engineer",
  description:
    "Hi, I’m Emmanuel - A Curious human who design interfaces and build digital things for a living :)",
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
  return (
    <html lang="en">
      {/* Next injects <head> from metadata/viewport */}
      <body className={`${sfProDisplay.className} antialiased`}>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
