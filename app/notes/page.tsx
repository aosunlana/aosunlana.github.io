import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import SubPageMenu from "@/components/SubPageMenu";

import { getAllNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "Thoughts, essays, and reflections on design, engineering, and life.",
  openGraph: {
    title: "Notes - Emmanuel",
    description: "Thoughts, essays, and reflections on design, engineering, and life.",
  },
};

function renderDescription(text: string) {
  const words = text.split(" ");

  return words.map((word, index) => {
    let colorClass = "";

    if (index === 1) {
      colorClass = "text-custom-gray-900 dark:text-app-link-text-default";
    } else if (index === 2) {
      colorClass = "text-custom-gray-400 dark:text-app-text-hover-dark";
    }

    return (
      <span key={index} className={colorClass}>
        {word}
        {index < words.length - 1 ? " " : ""}
      </span>
    );
  });
}

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark">
      {/* HEADER (centered container) */}
      <header className="w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-[max(env(safe-area-inset-top),16px)] md:pt-4">
          <Header />
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-6 pb-20">
          <div className="w-full rounded-3xl border border-custom-gray-200 dark:border-app-border-dark overflow-hidden">
            {notes.map((note, index) => (
              <div
                key={note.slug}
                className={`px-6 py-5 ${
                  index !== notes.length - 1
                    ? "border-b border-custom-gray-200 dark:border-app-border-dark"
                    : ""
                }`}
              >
                <p className="text-xs font-medium text-custom-gray-500 dark:text-app-text-dark mb-2">
                  {note.date}
                </p>

                <Link href={`/notes/${note.slug}`} className="block">
                  <h2 className="text-[16px] sm:text-[18px] font-semibold text-custom-gray-900 dark:text-app-text-dark mb-1 line-clamp-1 underline decoration-dotted decoration-current underline-offset-6 sm:no-underline sm:hover:underline sm:hover:decoration-2 sm:hover:text-custom-gray-500 dark:sm:hover:text-app-text-hover-dark">
                    {note.title}
                  </h2>
                  <p className="text-base leading-relaxed text-custom-gray-500 dark:text-app-text-dark line-clamp-2">
                    {renderDescription(note.description)}
                  </p>
                </Link>
              </div>
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
