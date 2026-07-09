import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Links, references, and things worth keeping.",
};

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
