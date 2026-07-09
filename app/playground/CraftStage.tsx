"use client";

import { Image as ImageIcon } from "@phosphor-icons/react";

/**
 * Image placeholder. Fills its container on both the grid card and the detail
 * stage. Swap this for real craft media later.
 */
export default function CraftStage(_props: { slug: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-custom-gray-100 dark:bg-custom-gray-800/50 text-custom-gray-400 dark:text-custom-gray-600">
      <ImageIcon size={32} aria-hidden="true" />
    </div>
  );
}
