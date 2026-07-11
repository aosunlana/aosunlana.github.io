import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { crafts, getCraftIndex } from "../crafts";
import CraftStage from "../CraftStage";

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

// Only the demo lives here; the chrome (breadcrumb, date, prev/next, writeup)
// is in the sibling layout so it stays mounted across Previous/Next. The stage
// keeps a per-craft view-transition-name so the grid card morphs into it.
export default async function CraftPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const index = getCraftIndex(slug);
  if (index === -1) notFound();
  const craft = crafts[index];

  return (
    <div
      className="relative w-full bg-[#eceef1] dark:bg-[#141416] lg:absolute lg:inset-0"
      style={{ viewTransitionName: `craft-${craft.slug}` }}
    >
      <CraftStage craft={craft} mode="stage" />
    </div>
  );
}
