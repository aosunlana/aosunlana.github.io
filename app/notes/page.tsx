import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import SubPageMenu from "@/components/SubPageMenu";

import { getAllNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "Thoughts, essays, and reflections on design, engineering, and life.",
  alternates: { canonical: "/notes" },
  openGraph: {
    title: "Notes",
    description: "Thoughts, essays, and reflections on design, engineering, and life.",
  },
  twitter: {
    title: "Notes",
    description: "Thoughts, essays, and reflections on design, engineering, and life.",
  },
};

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark">
      {/* Breadcrumb (absolute, positioned by the component) */}
      <Header />

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-16 pb-20 md:pt-[22px]">
          {/* Section label + count */}
          <div className="mb-5 flex items-baseline justify-between">
            <h1 className="text-xs font-medium uppercase tracking-wider text-custom-gray-400 dark:text-custom-gray-500">
              Writing
            </h1>
            <span className="font-mono text-xs tabular-nums text-custom-gray-400 dark:text-custom-gray-500">
              {String(notes.length).padStart(2, "0")} entries
            </span>
          </div>

          <div className="flex flex-col">
            {notes.map((note) => (
              <Link
                key={note.slug}
                href={`/notes/${note.slug}`}
                className="group -mx-3 flex flex-col rounded-2xl px-3 py-4 transition-colors hover:bg-custom-gray-100/70 dark:hover:bg-app-card-dark/40"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-custom-gray-400 dark:text-custom-gray-500">
                  {note.date}
                </span>

                <span className="mt-2 flex items-center gap-1.5">
                  <h2 className="truncate text-[1.0625rem] font-semibold leading-snug text-custom-gray-900 transition-colors group-hover:text-app-link-text-hover dark:text-app-text-dark">
                    {note.title}
                  </h2>
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="shrink-0 -translate-x-1 text-app-link-text-hover opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                </span>

                <p className="mt-1 line-clamp-1 text-sm leading-relaxed text-custom-gray-500 dark:text-custom-gray-400">
                  {note.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER (centered container) */}
      <footer className="w-full pt-[140px] md:pt-20">
        <div className="mx-auto w-full max-w-[600px] px-4 pb-[max(env(safe-area-inset-bottom),16px)] md:pb-4">
          <div className="mb-[16px]">
            <SubPageMenu />
          </div>
          <Footer />
        </div>
      </footer>
    </div>
  );
}
