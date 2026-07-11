"use client";

import CraftStage from "../CraftStage";
import type { Craft } from "../crafts";

export default function PlaygroundCard({ craft }: { craft: Craft }) {
  return (
    <article
      className="group relative w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-custom-gray-50 transition-transform duration-200 ease-out will-change-transform hover:-translate-y-0.5 motion-reduce:transform-none dark:border-white/[0.06] dark:bg-custom-gray-900/40"
      style={{ aspectRatio: craft.aspect, viewTransitionName: `craft-${craft.slug}` }}
    >
      {/* Media fills the card, keeps its own aspect ratio */}
      <div className="absolute inset-0">
        <CraftStage craft={craft} mode="card" />
      </div>

      {/* Caption: a box inside the card, inset 4px from left / right / bottom */}
      <div className="absolute inset-x-1 bottom-1 flex items-center justify-between gap-3 rounded-xl border border-black/[0.05] bg-white px-3.5 py-2.5 dark:border-white/[0.06] dark:bg-[#161618]">
        <h3 className="truncate text-sm font-medium text-custom-gray-900 dark:text-app-text-dark">{craft.title}</h3>
        {craft.date ? (
          <span className="shrink-0 font-mono text-xs text-custom-gray-400 dark:text-custom-gray-500">
            {craft.date}
          </span>
        ) : null}
      </div>
    </article>
  );
}
