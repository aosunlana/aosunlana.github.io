import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getAllNotes, getNoteBySlug } from "@/lib/notes";
import Header from "@/components/header/Header";

export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({ slug: note.slug }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NotePage({ params }: any) {
  let note;

  try {
    note = getNoteBySlug(params.slug);
  } catch {
    return notFound();
  }

  const { title, date, cover } = note.frontmatter;

  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900">
      <header className="w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-[max(env(safe-area-inset-top),16px)] md:pt-4">
          <Header />
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-6 pb-20">
          <section className="w-full">
            <h1 className="text-2xl font-bold">{title}</h1>

            <p className="text-gray-500 mt-2">
              {date} • {note.readingTime}
            </p>

            {cover && (
              <div className="mt-8 overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={cover}
                  alt={title}
                  width={1600}
                  height={900}
                  priority
                  className="w-full h-auto"
                />
              </div>
            )}

            <article className="prose prose-lg max-w-none mt-10 dark:prose-invert prose-p:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:pl-4">
              <MDXRemote source={note.content} />
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
