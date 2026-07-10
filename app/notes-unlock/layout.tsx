import type { Metadata } from "next";

// The middleware rewrites /notes to this gate when there is no auth cookie, so
// this metadata is what crawlers see at /notes. A password gate must not be
// indexed and must not inherit the homepage canonical.
export const metadata: Metadata = {
  title: "Notes",
  description: "Private notes.",
  alternates: { canonical: "/notes" },
  robots: { index: false, follow: false },
};

export default function NotesUnlockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
