"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "@phosphor-icons/react";
import type { Craft } from "./crafts";
import { craftDemos } from "./craftRegistry";

// Parse a CSS aspect like "3 / 2" into a width / height number.
function ratioOf(aspect: string) {
  const [w, h] = aspect.split("/").map((s) => parseFloat(s.trim()));
  return w && h ? w / h : 3 / 2;
}

// A grid thumbnail: render the demo on a full desktop-sized stage, then scale
// that whole stage down to fit the card. This shows the demo's desktop layout,
// keeps fixed-size content from overflowing, and reads as a faithful mini view.
function CardPreview({ Demo, aspect }: { Demo: ComponentType; aspect: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const DESIGN_W = 1000;
  const DESIGN_H = Math.round(DESIGN_W / ratioOf(aspect));
  const scale = w > 0 ? w / DESIGN_W : 0;
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          opacity: scale ? 1 : 0,
        }}
      >
        <Demo />
      </div>
    </div>
  );
}

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
      // On the grid, render a scaled-down desktop preview so the whole
      // composition reads and nothing clips. On the detail stage it is the full
      // interactive component.
      if (mode === "card") {
        return <CardPreview Demo={Demo} aspect={craft.aspect} />;
      }
      return (
        <div className="h-full w-full">
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
