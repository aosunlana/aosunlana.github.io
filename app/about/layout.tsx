import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
  description: "I'm a Product Designer turned Design Engineer who loves turning complex ideas into simple, delightful experiences.",
  openGraph: {
    title: "About Me",
    description: "I'm a Product Designer turned Design Engineer who loves turning complex ideas into simple, delightful experiences.",
  },
  twitter: {
    title: "About Me",
    description: "I'm a Product Designer turned Design Engineer who loves turning complex ideas into simple, delightful experiences.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
