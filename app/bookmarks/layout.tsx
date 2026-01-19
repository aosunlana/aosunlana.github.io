import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Curated list of bookmarks and resources.",
};

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
