import type { ReactNode } from "react";
import { Link } from "next-view-transitions";
import NextLink from "next/link";
import { crafts, getCraftIndex } from "../crafts";
import EscapeToExit from "./EscapeToExit";
import ArrowNav from "./ArrowNav";

// This layout wraps every craft page. Because a layout does not remount when you
// navigate between its child routes, the chrome it renders (breadcrumb, date,
// prev/next, writeup) stays mounted and only updates its text in place, so it
// never flashes on Previous/Next. Only the demo in page.tsx swaps.

// A tiny JS/JSX highlighter for the writeup code blocks.
const TOKEN_COLOR: Record<string, string> = {
  comment: "text-emerald-600 dark:text-emerald-400",
  string: "text-amber-600 dark:text-amber-400",
  keyword: "text-violet-600 dark:text-violet-400",
  tag: "text-rose-500 dark:text-rose-400",
  number: "text-orange-600 dark:text-orange-500",
};

function highlightCode(code: string): ReactNode[] {
  const re =
    /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:const|let|var|function|return|import|from|export|default|new|if|else|for|while|true|false|null|undefined|async|await|type|interface)\b)|(<\/?[A-Za-z][\w.]*|\/>)|(\b\d+(?:\.\d+)?\b)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) out.push(<span key={k++}>{code.slice(last, m.index)}</span>);
    const kind = m[1] ? "comment" : m[2] ? "string" : m[3] ? "keyword" : m[4] ? "tag" : "number";
    out.push(
      <span key={k++} className={TOKEN_COLOR[kind]}>
        {m[0]}
      </span>
    );
    last = re.lastIndex;
  }
  if (last < code.length) out.push(<span key={k++}>{code.slice(last)}</span>);
  return out;
}

export default async function CraftLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = getCraftIndex(slug);
  const craft = crafts[index];
  // Unknown slug: let the page handle notFound(), render nothing extra.
  if (!craft) return <>{children}</>;

  // Move through the list in order: Previous steps back (index - 1), Next steps
  // forward (index + 1).
  const prevCraft = crafts[index - 1];
  const nextCraft = crafts[index + 1];
  const hasWriteup = Boolean(craft.writeup && craft.writeup.length > 0);

  return (
    <main className="relative block min-h-dvh w-full overflow-x-hidden text-custom-gray-900 dark:text-app-text-dark lg:flex lg:h-dvh lg:flex-row lg:overflow-hidden">
      <EscapeToExit href="/playground" />
      <ArrowNav
        prevHref={prevCraft ? `/playground/${prevCraft.slug}` : undefined}
        nextHref={nextCraft ? `/playground/${nextCraft.slug}` : undefined}
      />
      <h1 className="sr-only">{craft.title}</h1>

      {/* Left: the demo (page.tsx). Full screen on mobile, then the writeup
          stacks below on scroll; on large screens it fills its column. */}
      <section className="relative flex w-full min-w-0 flex-col bg-[#eceef1] dark:bg-[#141416] lg:block lg:h-auto lg:flex-1">
        {/* Header: breadcrumb + date. In the flow on mobile so the demo sits
            below it (no overlap); floating over the demo on large screens. */}
        <div className="z-30 flex shrink-0 items-center justify-between gap-3 px-5 pb-3 pt-6 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:px-6 lg:pb-0 lg:pt-6">
          <nav
            aria-label="Breadcrumb"
            style={{ viewTransitionName: "pg-crumb" }}
            className="flex w-max shrink-0 items-center gap-2 whitespace-nowrap text-sm text-custom-gray-500 dark:text-custom-gray-400 lg:pointer-events-auto"
          >
            <Link href="/" className="transition-colors hover:text-custom-gray-900 dark:hover:text-app-text-dark">
              Index
            </Link>
            <span aria-hidden="true" className="text-custom-gray-300 dark:text-custom-gray-600">
              ›
            </span>
            <Link
              href="/playground"
              className="transition-colors hover:text-custom-gray-900 dark:hover:text-app-text-dark"
            >
              Playground
            </Link>
            <span aria-hidden="true" className="text-custom-gray-300 dark:text-custom-gray-600">
              ›
            </span>
            <span className="font-medium text-custom-gray-900 dark:text-app-text-dark">{craft.title}</span>
          </nav>

          {craft.date ? (
            <span
              style={{ viewTransitionName: "pg-date" }}
              className="shrink-0 font-mono text-[13px] text-custom-gray-500 dark:text-custom-gray-400"
            >
              {craft.date}
            </span>
          ) : null}
        </div>

        {/* Demo area. On mobile it centers the demo in at least 68dvh and grows
            taller if the demo needs it (so the page scrolls, nothing clips). On
            large screens the demo's own absolute inset-0 covers the section. */}
        <div className="relative flex min-h-[80dvh] flex-col justify-center lg:static lg:block lg:min-h-0">
          {children}
        </div>

        {/* Previous / Next, centered under the stage */}
        <nav
          aria-label="Craft navigation"
          className="relative z-30 flex justify-center px-4 py-6 lg:absolute lg:inset-x-0 lg:bottom-8 lg:py-0"
        >
          <div
            style={{ viewTransitionName: "pg-nav" }}
            className="inline-flex w-56 items-center overflow-hidden rounded-full border border-custom-gray-200 bg-white/85 backdrop-blur dark:border-app-border-dark dark:bg-app-card-dark/85"
          >
            {prevCraft ? (
              <NextLink
                href={`/playground/${prevCraft.slug}`}
                className="flex-1 py-2.5 text-center text-sm text-custom-gray-600 transition-colors hover:text-custom-gray-900 dark:text-custom-gray-300 dark:hover:text-white"
              >
                Previous
              </NextLink>
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
              <NextLink
                href={`/playground/${nextCraft.slug}`}
                className="flex-1 py-2.5 text-center text-sm text-custom-gray-600 transition-colors hover:text-custom-gray-900 dark:text-custom-gray-300 dark:hover:text-white"
              >
                Next
              </NextLink>
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
      </section>

      {/* The writeup. Stacks full width below the demo on mobile; a ~30% side
          panel with its own scroll on large screens. */}
      {hasWriteup && (
        <aside
          style={{ viewTransitionName: "pg-writeup" }}
          className="w-full min-w-0 overflow-x-hidden border-t border-black/[0.07] bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-white/[0.08] dark:bg-[#161618] lg:h-full lg:w-[30%] lg:min-w-[340px] lg:max-w-[480px] lg:overflow-y-auto lg:border-l lg:border-t-0"
        >
          <div className="px-7 py-9">
            <h2 className="text-[15px] font-semibold text-custom-gray-900 dark:text-app-text-dark">{craft.title}</h2>
            {craft.summary ? (
              <p className="mt-2 text-[0.95rem] leading-7 text-custom-gray-600 dark:text-custom-gray-400">
                {craft.summary}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-8">
              {craft.writeup!.map((section, i) => (
                <section key={i}>
                  {section.heading ? (
                    <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-custom-gray-400 dark:text-custom-gray-500">
                      {section.heading}
                    </h3>
                  ) : null}
                  <div className="flex flex-col gap-4 text-[0.9rem] leading-7 text-custom-gray-700 dark:text-custom-gray-300">
                    {section.paragraphs.map((paragraph, j) => (
                      <p key={j}>{paragraph}</p>
                    ))}
                    {section.code ? (
                      <pre className="mt-1 overflow-x-auto rounded-xl border border-custom-gray-200 bg-custom-gray-50 p-3.5 text-[0.78rem] leading-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-app-border-dark dark:bg-[#0f0f11]">
                        <code className="font-mono text-custom-gray-800 dark:text-custom-gray-200">
                          {highlightCode(section.code)}
                        </code>
                      </pre>
                    ) : null}
                    {section.after?.map((paragraph, j) => (
                      <p key={`after-${j}`}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </aside>
      )}
    </main>
  );
}
