import type { Metadata } from "next";

const description =
  "Design engineer with a product design background across fintech and insurance. Previously at Tempo (YC S23), Digit, and Carbon.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About", description, url: "/about" },
  twitter: { title: "About", description },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
