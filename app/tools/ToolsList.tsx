"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { IconType } from "react-icons";
import { SiClaude, SiNotion, SiLinear } from "react-icons/si";
import { tools, type Tool } from "../content/tools";
import { setup } from "../content/setup";

// Icon source per tool: a local brand SVG or a react-icons mark.
// `mono: false` keeps the SVG's own colors instead of forcing it white.
type IconSpec = { src?: string; Comp?: IconType; mono?: boolean; nudgeY?: number };
const ICON: Record<string, IconSpec> = {
  Figma: { src: "/tool-icons/figma.svg", mono: false },
  Framer: { src: "/tool-icons/framer.svg" },
  Trae: { src: "/tool-icons/trae.svg" },
  "Claude Code": { Comp: SiClaude },
  Vercel: { src: "/tool-icons/vercel.svg", nudgeY: -1.5 },
  Arc: { src: "/tool-icons/arc.svg", mono: false },
  Raycast: { src: "/tool-icons/raycast.svg", mono: false },
  "Screen Studio": { src: "/tool-icons/screenstudio.svg", mono: false },
  Notion: { Comp: SiNotion },
  Linear: { Comp: SiLinear },
};

// Brand background per tool (Trae + Arc approximated; tweak if you have exact values).
const BG: Record<string, string> = {
  Figma: "#FFFFFF",
  Framer: "#0055FF",
  Trae: "#00C566",
  "Claude Code": "#D97757",
  Vercel: "#0D0D0D",
  Arc: "#3D5AFE",
  Raycast: "#0D0D0D",
  "Screen Studio": "#0D0D0D",
  Notion: "#0D0D0D",
  Linear: "#5E6AD2",
};

// Active progress-ring accent per tool (a vivid, page-legible color).
const RING: Record<string, string> = {
  Figma: "#F24E1E",
  Framer: "#0055FF",
  Trae: "#00C566",
  "Claude Code": "#D97757",
  Vercel: "#8A8A8A",
  Arc: "#3D5AFE",
  Raycast: "#FF6363",
  "Screen Studio": "#8B5CF6",
  Notion: "#8A8A8A",
  Linear: "#5E6AD2",
};

const bgStyle = (name: string) => {
  const v = BG[name] ?? "#171717";
  return v.startsWith("linear-gradient")
    ? { backgroundImage: v }
    : { backgroundColor: v };
};

// White icon on the brand background.
function Glyph({ name, className = "" }: { name: string; className?: string }) {
  const spec = ICON[name];
  const transform = spec?.nudgeY ? `translateY(${spec.nudgeY}px)` : undefined;
  if (spec?.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={spec.src}
        alt=""
        aria-hidden
        className={`${className} block shrink-0 object-contain`}
        style={{
          transform,
          ...(spec.mono === false ? {} : { filter: "brightness(0) invert(1)" }),
        }}
      />
    );
  }
  const Comp = spec?.Comp;
  return Comp ? (
    <Comp aria-hidden className={`${className} text-white`} style={{ transform }} />
  ) : (
    <span aria-hidden className={`font-semibold text-white ${className}`}>
      {name.charAt(0)}
    </span>
  );
}

const STORY_MS = 6000; // dwell per tool (story bar fill + ring)

// Directional deck: moving right sends the old card back into the stack, moving
// left brings it forward. A negative index means "reduced motion" (opacity only).
const cardVariants = {
  enter: (dir: number) =>
    dir === 0
      ? { opacity: 0 }
      : { opacity: 0, scale: dir > 0 ? 0.94 : 1.03, y: dir > 0 ? 16 : -12 },
  center: { opacity: 1, scale: 1, y: 0 },
  exit: (dir: number) =>
    dir === 0
      ? { opacity: 0 }
      : { opacity: 0, scale: dir > 0 ? 1.03 : 0.94, y: dir > 0 ? -12 : 16 },
};

export default function ToolsList() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = tools.length;
  const tool: Tool = tools[active];

  const next = () => setActive((i) => (i + 1) % total);
  const go = (dir: number) => setActive((i) => (i + dir + total) % total);

  // Auto-advance; pauses on hover / press-and-hold.
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(next, STORY_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, active, total]);

  // Keep the active avatar in view when the strip scrolls on small screens.
  const avatarRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    avatarRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  // Deck direction from the previous index (0 = reduced motion, opacity only).
  const reduceMotion = useReducedMotion();
  const prevIndex = useRef(active);
  const direction = reduceMotion ? 0 : active >= prevIndex.current ? 1 : -1;
  prevIndex.current = active;
  const cardTransition = reduceMotion
    ? { duration: 0.08 }
    : { duration: 0.28, ease: [0.2, 0, 0, 1] as const };

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
    >
      {/* Section label */}
      <div className="mb-5 flex items-baseline justify-between">
        <h1 className="text-xs font-medium uppercase tracking-wider text-custom-gray-400 dark:text-custom-gray-500">
          Toolbox
        </h1>
        <span className="font-mono text-xs tabular-nums text-custom-gray-400 dark:text-custom-gray-500">
          {String(total).padStart(2, "0")} tools
        </span>
      </div>

      {/* Avatar row: scrolls on mobile, all fit evenly on desktop */}
      <div className="-mx-1.5 flex items-center gap-3 overflow-x-auto px-1.5 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-0 md:overflow-x-visible md:[justify-content:space-between]">
        {tools.map((t, i) => {
          const isActive = i === active;
          return (
            <button
              key={t.name}
              ref={(el) => {
                avatarRefs.current[i] = el;
              }}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={t.name}
              aria-pressed={isActive}
              className="group relative shrink-0 rounded-full outline-none"
            >
              <span
                style={bgStyle(t.name)}
                className={`relative flex h-14 w-14 items-center justify-center rounded-full border border-black/[0.06] transition-all duration-300 md:h-12 md:w-12 dark:border-white/10 ${
                  isActive
                    ? ""
                    : "opacity-70 grayscale group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                }`}
              >
                {/* Active progress ring: faint track + brand-colored arc that fills */}
                {isActive && (
                  <svg
                    className="pointer-events-none absolute -inset-[4px] -rotate-90"
                    viewBox="0 0 64 64"
                    fill="none"
                    aria-hidden
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="31"
                      strokeWidth="2"
                      className="stroke-custom-gray-200 dark:stroke-white/15"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="31"
                      stroke={RING[t.name] ?? "#8A8A8A"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: STORY_MS / 1000, ease: "linear" }}
                    />
                  </svg>
                )}
                <Glyph name={t.name} className="h-7 w-7 md:h-6 md:w-6" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail card deck: static ghost cards behind; the active card animates */}
      <motion.div layout transition={cardTransition} className="relative mt-6">
        {/* Stacked ghost layers behind the active card (static) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl border border-custom-gray-200 bg-white dark:border-app-border-dark dark:bg-app-bg-dark"
          style={{ transform: "translateY(18px) scale(0.94)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl border border-custom-gray-200 bg-white dark:border-app-border-dark dark:bg-app-bg-dark"
          style={{ transform: "translateY(9px) scale(0.97)" }}
        />

        <div className="relative z-10" aria-live="polite">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={tool.name}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={cardTransition}
              className="rounded-2xl border border-custom-gray-200 bg-white p-5 dark:border-app-border-dark dark:bg-app-bg-dark"
            >
            <div className="flex items-center gap-4">
              <span
                style={bgStyle(tool.name)}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] dark:border-white/10"
              >
                <Glyph name={tool.name} className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-custom-gray-900 dark:text-app-text-dark">
                  {tool.name}
                </h3>
                <p className="truncate text-sm text-custom-gray-500 dark:text-custom-gray-400">
                  {tool.tagline}
                </p>
              </div>
              <span className="shrink-0 self-start pt-1 font-mono text-xs tabular-nums text-custom-gray-400 dark:text-custom-gray-500">
                {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-5 grid gap-4 text-sm">
              <div>
                <h4 className="mb-1 font-medium text-custom-gray-900 dark:text-white">Usage</h4>
                <p className="leading-relaxed text-custom-gray-600 dark:text-custom-gray-300">
                  {tool.usage}
                </p>
              </div>
              <div>
                <h4 className="mb-1 font-medium text-custom-gray-900 dark:text-white">Impact</h4>
                <p className="leading-relaxed text-custom-gray-600 dark:text-custom-gray-300">
                  {tool.impact}
                </p>
              </div>
            </div>

            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-custom-gray-900 transition-colors hover:text-custom-gray-500 dark:text-white dark:hover:text-custom-gray-400"
            >
              Visit {tool.name}
              <ArrowUpRight size={15} aria-hidden />
            </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Story timeline — hidden for now */}
      {false && (
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-custom-gray-400 dark:text-custom-gray-500">
              The flow
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous tool"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-custom-gray-200 text-custom-gray-500 transition-colors hover:text-custom-gray-900 dark:border-app-border-dark dark:text-custom-gray-400 dark:hover:text-white"
              >
                <CaretLeft size={14} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next tool"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-custom-gray-200 text-custom-gray-500 transition-colors hover:text-custom-gray-900 dark:border-app-border-dark dark:text-custom-gray-400 dark:hover:text-white"
              >
                <CaretRight size={14} aria-hidden />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 right-4 top-4 h-px -translate-y-1/2 bg-custom-gray-200 dark:bg-app-border-dark" />
            <div className="relative flex justify-between">
              {tools.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={t.name}
                  className="group flex flex-col items-center gap-2"
                >
                  <span
                    style={bgStyle(t.name)}
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                  >
                    <Glyph name={t.name} className="h-3.5 w-3.5" />
                  </span>
                  <span className="hidden text-[10px] text-custom-gray-400 sm:block dark:text-custom-gray-500">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Setup: hardware and desk gear. Renders only when there is real gear. */}
      {setup.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xs font-medium uppercase tracking-wider text-custom-gray-400 dark:text-custom-gray-500">
              Setup
            </h2>
            <span className="font-mono text-xs tabular-nums text-custom-gray-400 dark:text-custom-gray-500">
              {String(setup.length).padStart(2, "0")} items
            </span>
          </div>

          <div className="flex flex-col">
            {setup.map((gear) => {
              const external = Boolean(gear.url);
              const Row = external ? "a" : "div";
              return (
                <Row
                  key={gear.name}
                  {...(external
                    ? { href: gear.url, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group -mx-3 flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-custom-gray-100/70 dark:hover:bg-app-card-dark/40"
                >
                  {gear.image && (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/[0.06] bg-custom-gray-50 dark:border-white/10 dark:bg-app-card-dark">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={gear.image} alt="" className="h-6 w-6 object-contain" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="font-medium text-custom-gray-900 transition-colors group-hover:text-custom-gray-500 dark:text-app-text-dark dark:group-hover:text-custom-gray-400">
                      {gear.name}
                      {external && <span className="sr-only"> (opens in a new tab)</span>}
                    </span>
                    <span className="block truncate text-sm text-custom-gray-500 dark:text-custom-gray-400">
                      {gear.note}
                    </span>
                  </span>
                  {external && (
                    <ArrowUpRight
                      size={15}
                      aria-hidden
                      className="shrink-0 text-custom-gray-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-custom-gray-600"
                    />
                  )}
                </Row>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
