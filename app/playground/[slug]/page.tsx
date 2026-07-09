import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { crafts, getCraftIndex } from "../crafts";
import CraftStage from "../CraftStage";
import EscapeToExit from "./EscapeToExit";

export function generateStaticParams() {
  return crafts.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const craft = crafts[getCraftIndex(slug)];
  if (!craft) return { title: "Craft not found" };
  const url = `/playground/${slug}`;
  const description = "An experiment in components, interactions, and motion.";
  return {
    title: { absolute: `${craft.title} · Emmanuel A. Priestley` },
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: craft.title, description },
    twitter: { card: "summary_large_image", title: craft.title, description },
  };
}

export default async function CraftPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const index = getCraftIndex(slug);
  if (index === -1) notFound();

  const craft = crafts[index];
  const prevCraft = crafts[index - 1]; // Previous: lower number
  const nextCraft = crafts[index + 1]; // Next: higher number

  // The stage card is sized to the craft's aspect, capped to the viewport so a
  // portrait craft does not overflow. A real component sets its own aspect.
  const [aspectW, aspectH] = craft.aspect.split("/").map((n) => parseFloat(n));
  const ratio = aspectW / aspectH;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1800px] flex-col px-4 py-8 text-custom-gray-900 dark:text-app-text-dark md:px-6">
      <EscapeToExit href="/playground" />

      {/* Header: breadcrumb left, date right */}
      <div className="mb-6 flex items-baseline justify-between gap-4 text-sm">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-2 text-custom-gray-500 dark:text-custom-gray-400"
        >
          <Link href="/" className="transition-colors hover:text-custom-gray-900 dark:hover:text-app-text-dark">
            Index
          </Link>
          <span aria-hidden="true">›</span>
          <Link
            href="/playground"
            className="transition-colors hover:text-custom-gray-900 dark:hover:text-app-text-dark"
          >
            Playground
          </Link>
          <span aria-hidden="true">›</span>
          <span className="truncate text-custom-gray-900 dark:text-app-text-dark">
            {craft.title}
          </span>
        </nav>
        {craft.date ? (
          <span className="shrink-0 font-mono text-custom-gray-500 dark:text-custom-gray-400">
            {craft.date}
          </span>
        ) : null}
      </div>

      {/* Centered stage */}
      <div className="flex flex-1 items-center justify-center pt-6 pb-24">
        {/* Stage: a contained card sized to the craft's aspect, centered */}
        <section
          className="relative overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10"
          style={{
            width: `min(760px, calc(72vh * ${ratio}))`,
            aspectRatio: craft.aspect,
            background: craft.background ?? "#0a0a0a",
            viewTransitionName: `craft-${craft.slug}`,
          }}
        >
          <div className="absolute inset-0">
            <CraftStage slug={craft.slug} />
          </div>
        </section>
      </div>

      {/* Fixed Previous / Next bar, same position on every craft */}
      <nav
        aria-label="Craft navigation"
        className="fixed inset-x-0 bottom-8 z-40 flex justify-center px-4"
      >
        <div className="inline-flex w-56 items-center overflow-hidden rounded-full border border-custom-gray-200 bg-white/85 backdrop-blur dark:border-app-border-dark dark:bg-app-card-dark/85">
          {prevCraft ? (
            <Link
              href={`/playground/${prevCraft.slug}`}
              className="flex-1 py-2.5 text-center text-sm text-custom-gray-600 transition-colors hover:text-custom-gray-900 dark:text-custom-gray-300 dark:hover:text-white"
            >
              Previous
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="flex-1 cursor-not-allowed py-2.5 text-center text-sm text-custom-gray-300 dark:text-custom-gray-600"
            >
              Previous
            </span>
          )}
          <span className="h-5 w-px bg-custom-gray-200 dark:bg-app-border-dark" aria-hidden="true" />
          {nextCraft ? (
            <Link
              href={`/playground/${nextCraft.slug}`}
              className="flex-1 py-2.5 text-center text-sm text-custom-gray-600 transition-colors hover:text-custom-gray-900 dark:text-custom-gray-300 dark:hover:text-white"
            >
              Next
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="flex-1 cursor-not-allowed py-2.5 text-center text-sm text-custom-gray-300 dark:text-custom-gray-600"
            >
              Next
            </span>
          )}
        </div>
      </nav>
    </main>
  );
}
