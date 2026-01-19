import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import SubPageMenu from "@/components/SubPageMenu";
import Footer from "@/components/Footer";
import { getAllNotes, getNoteBySlug } from "@/lib/notes";
import Header from "@/components/header/Header";
import ReadingProgressRing from "@/components/ReadingProgressRing";

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  let note;

  try {
    note = getNoteBySlug(params.slug);
  } catch {
    return {
      title: "Note Not Found",
    };
  }

  const { title, description, date, cover } = note.frontmatter;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: date,
      url: `/notes/${params.slug}`,
      images: cover ? [{ url: cover }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: cover ? [cover] : [],
    },
  };
}

export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({ slug: note.slug }));
}

export default async function NotePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  let note;

  try {
    note = getNoteBySlug(params.slug);
  } catch {
    return notFound();
  }

  const { title, date, cover, description } = note.frontmatter;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: date,
    description: description,
    image: cover ? `https://emmah.xyz${cover}` : undefined,
    url: `https://emmah.xyz/notes/${params.slug}`,
    author: {
      "@type": "Person",
      name: "Emmanuel",
      url: "https://emmah.xyz",
    },
  };

  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark note-reading-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgressRing />
      <header className="w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-[max(env(safe-area-inset-top),16px)] md:pt-4">
          <Header />
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-6 pb-20">
          <section className="w-full">
            <h1 className="text-[22px] leading-8 tracking-[0.5px] font-semibold sm:text-[24px] text-custom-gray-900 dark:text-app-text-dark">
              {title}
            </h1>

            <p className="text-custom-gray-500 dark:text-app-text-dark mt-2">
              {date} • {note.readingTime}
            </p>

            {cover && (
              <div className="mt-8 overflow-hidden rounded-2xl bg-custom-gray-100 dark:bg-app-card-dark">
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
