import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emmanuel - Design Engineer",
  description:
    "Hi, I’m Emmanuel - A Curious human who design interfaces and build digital things.",
};

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
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        {/* Must be inside <head>. Runs before paint and reacts to system changes */}
        <Script id="system-theme-invert" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var mq = window.matchMedia('(prefers-color-scheme: dark)');
                var apply = function () {
                  var el = document.documentElement;
                  if (mq.matches) el.classList.add('theme-invert');
                  else el.classList.remove('theme-invert');
                };
                apply();
                if (mq.addEventListener) mq.addEventListener('change', apply);
                else mq.addListener(apply); // older Safari/iOS
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body className={`${neueMontreal.className} antialiased`}>{children}</body>
    </html>
  );
}
