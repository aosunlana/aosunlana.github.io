import type { Metadata } from "next";
import CommandPalette from "./CommandPalette";

// A standalone, full-viewport demo of the command palette. Not part of the
// Playground crafts, this is a shareable page for showing the demo on its own.
export const metadata: Metadata = {
  title: { absolute: "Command palette demo" },
  description: "A Cmd+K operations console for a cross-border business banking app.",
  robots: { index: false, follow: false },
};

export default function CommandPaletteDemoPage() {
  return (
    <main className="h-dvh w-full overflow-hidden">
      <CommandPalette />
    </main>
  );
}
