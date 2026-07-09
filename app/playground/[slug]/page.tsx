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
  const description =
    craft.summary ?? "An experiment in components, interactions, and motion.";
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

  // The stage card is sized to the craft's aspect, capped to BOTH viewport
  // dimensions so it never overflows on a narrow phone. Live components keep the
  // aspect as a minimum but are free to grow taller (e.g. an expanding panel).
  const [aspectW, aspectH] = craft.aspect.split("/").map((n) => parseFloat(n));
  const ratio = aspectW / aspectH;
  const hasWriteup = Boolean(craft.writeup && craft.writeup.length > 0);
  const isComponent = craft.kind === "component";
  // Width is bounded by the design cap, the available container width (100% of
  // the padded main), and the height-derived width. min() picks the smallest, so
  // the card fits whichever axis is tightest and never overflows the viewport.
  const stageWidth = `min(760px, 100%, calc(72vh * ${ratio}))`;
  // The aspect floor for live components. Uses viewport math (a min-height can't
  // reuse the 100% width), which is fine as an approximate resting height.
  const stageFloor = `calc(min(760px, calc(100vw - 2rem), calc(72vh * ${ratio})) / ${ratio})`;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1800px] flex-col overflow-x-clip px-4 py-8 text-custom-gray-900 dark:text-app-text-dark md:px-6">
      <EscapeToExit href="/playground" />
      <h1 className="sr-only">{craft.title}</h1>

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

      {/* Stage. Centered in the viewport when there is no writeup; sits near the
          top when a writeup follows so the copy can flow beneath it. */}
      <div
        className={`flex w-full min-w-0 items-center justify-center pt-6 ${
          hasWriteup ? "pb-10" : "flex-1 pb-24"
        }`}
      >
        {/* Stage: a contained card sized to the craft's aspect, centered */}
        <section
          className={`relative overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10 ${
            isComponent ? "flex" : ""
          }`}
          style={{
            width: stageWidth,
            // Components use the aspect as a floor so a tall panel can push the
            // card down instead of being clipped; static media stays exact.
            ...(isComponent
              ? { minHeight: stageFloor }
              : { aspectRatio: craft.aspect }),
            background: craft.background ?? "#0a0a0a",
            viewTransitionName: `craft-${craft.slug}`,
          }}
        >
          {/* Components render in normal flow so a growing panel expands the card
              (the section's min-height still holds the aspect as a floor). Static
              media fills the fixed-aspect box via an absolute layer. */}
          <div className={isComponent ? "w-full" : "absolute inset-0"}>
            <CraftStage craft={craft} mode="stage" />
          </div>
        </section>
      </div>

      {/* Optional writeup (case study) below the stage */}
      {hasWriteup && (
        <div className="mx-auto w-full max-w-[640px] pb-32">
          {craft.summary ? (
            <p className="mb-8 text-[1.0625rem] leading-7 text-custom-gray-600 dark:text-custom-gray-400">
              {craft.summary}
            </p>
          ) : null}
          <div className="flex flex-col gap-8">
            {craft.writeup!.map((section, i) => (
              <section key={i}>
                {section.heading ? (
                  <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-custom-gray-400 dark:text-custom-gray-500">
                    {section.heading}
                  </h2>
                ) : null}
                <div className="flex flex-col gap-4 text-[0.95rem] leading-7 text-custom-gray-700 dark:text-custom-gray-300">
                  {section.paragraphs.map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

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
