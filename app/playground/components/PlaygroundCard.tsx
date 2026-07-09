"use client";

import CraftStage from "../CraftStage";
import type { Craft } from "../crafts";

export default function PlaygroundCard({ craft }: { craft: Craft }) {
  return (
    <article
      className="group relative w-full overflow-hidden rounded-2xl border border-custom-gray-200 dark:border-white/5 bg-custom-gray-50 dark:bg-custom-gray-900/40 transition-transform duration-200 ease-out will-change-transform hover:-translate-y-0.5 motion-reduce:transform-none"
      style={{ aspectRatio: craft.aspect, viewTransitionName: `craft-${craft.slug}` }}
    >
      {/* Media fills the card, keeps its own aspect ratio */}
      <div className="absolute inset-0">
        <CraftStage craft={craft} mode="card" />
      </div>

      {/* Caption sits inside the card: title left, date right, over a bottom scrim */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-10 sm:pt-14">
        <h3 className="text-sm font-medium text-white">{craft.title}</h3>
        {craft.date ? (
          <span className="font-mono text-xs text-white/70">{craft.date}</span>
        ) : null}
      </div>
    </article>
  );
}
