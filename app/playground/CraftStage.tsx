"use client";

import Image from "next/image";
import { Image as ImageIcon } from "@phosphor-icons/react";
import type { Craft } from "./crafts";
import { craftDemos } from "./craftRegistry";

// Renders a craft's media. On the grid ("card") it prefers a lightweight poster;
// on the detail page ("stage") it renders the full media, including live demos.
export default function CraftStage({
  craft,
  mode,
}: {
  craft: Craft;
  mode: "card" | "stage";
}) {
  const sizes =
    mode === "stage" ? "760px" : "(max-width: 768px) 100vw, 600px";

  // Image mockup (Figma export). Supports an optional dark-mode variant.
  if (craft.kind === "image") {
    return (
      <div className="relative h-full w-full">
        <Image
          src={craft.src}
          alt={craft.alt}
          fill
          sizes={sizes}
          className={`object-cover ${craft.srcDark ? "dark:hidden" : ""}`}
        />
        {craft.srcDark && (
          <Image
            src={craft.srcDark}
            alt={craft.alt}
            fill
            sizes={sizes}
            className="hidden object-cover dark:block"
          />
        )}
      </div>
    );
  }

  // Live interactive component.
  if (craft.kind === "component") {
    // On the grid, show the poster (if any) so we do not mount every demo.
    if (mode === "card" && craft.poster) {
      return (
        <div className="relative h-full w-full">
          <Image
            src={craft.poster}
            alt={craft.title}
            fill
            sizes={sizes}
            className={`object-cover ${craft.posterDark ? "dark:hidden" : ""}`}
          />
          {craft.posterDark && (
            <Image
              src={craft.posterDark}
              alt={craft.title}
              fill
              sizes={sizes}
              className="hidden object-cover dark:block"
            />
          )}
        </div>
      );
    }

    const Demo = craftDemos[craft.component];
    if (Demo) {
      // On the grid the demo is a non-interactive preview; the card link handles
      // the click. On the detail stage it is fully interactive.
      return (
        <div className={`h-full w-full ${mode === "card" ? "pointer-events-none" : ""}`}>
          <Demo />
        </div>
      );
    }
    // Registry miss: fall through to the placeholder below.
  }

  // Placeholder (empty stage).
  return (
    <div className="flex h-full w-full items-center justify-center bg-custom-gray-100 text-custom-gray-400 dark:bg-custom-gray-800/50 dark:text-custom-gray-600">
      <ImageIcon size={32} aria-hidden="true" />
    </div>
  );
}
