"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { Check, Paperclip, ChatCircle, CalendarBlank, Warning, ChartBar, ArrowCounterClockwise } from "@phosphor-icons/react";

/* --------------------------------------------------------------------------
 * A deck of task cards where completing the front one turns it to dust. On
 * check the card strikes through and lifts, then it is rasterized to a canvas,
 * sampled into a grid of colored particles, and blows away as the next card
 * advances from the stack. A floating Undo restores it to the front. With
 * reduced motion the particles are skipped and the card just fades. All mock.
 * ------------------------------------------------------------------------ */

const SOFT = { type: "spring", stiffness: 520, damping: 44, mass: 0.9 } as const;
const ACCENT = "#4f6ef2";
const CELL = 6; // sampling grid, CSS px

type Priority = "low" | "medium" | "high";
type Person = { name: string; initials: string; color: string };
type Tag = { label: string; className: string };
type Task = {
  id: string;
  title: string;
  desc: string;
  date: string;
  tags: Tag[];
  attachments: number;
  comments: number;
  progress: number; // 0..100
  who: Person[];
  priority: Priority;
};

const TAG = {
  engineering: "bg-violet-500/[0.14] text-violet-600 dark:text-violet-300",
  marketing: "bg-amber-500/[0.16] text-amber-600 dark:text-amber-300",
  design: "bg-sky-500/[0.14] text-sky-600 dark:text-sky-300",
  bug: "bg-rose-500/[0.13] text-rose-500 dark:text-rose-300",
  features: "bg-blue-500/[0.13] text-blue-600 dark:text-blue-300",
  improvements: "bg-emerald-500/[0.13] text-emerald-600 dark:text-emerald-300",
  neutral: "bg-black/[0.05] text-neutral-500 dark:bg-white/[0.07] dark:text-neutral-300",
};

const INITIAL: Task[] = [
  {
    id: "t1",
    title: "Recipea mobile application",
    desc: "A platform for smart kitchen control and recipe following.",
    date: "Nov 6, 2025",
    tags: [
      { label: "Engineering", className: TAG.engineering },
      { label: "Marketing", className: TAG.marketing },
      { label: "Design", className: TAG.design },
    ],
    attachments: 4,
    comments: 12,
    progress: 50,
    who: [{ name: "Maya Price", initials: "MP", color: "#6366F1" }, { name: "Sam Cole", initials: "SC", color: "#14B8A6" }, { name: "Dana Adeyemi", initials: "DA", color: "#F59E0B" }],
    priority: "high",
  },
  {
    id: "t2",
    title: "Ingredient auto-substitution",
    desc: "Swap out-of-stock items for smart equivalents mid-recipe.",
    date: "Nov 8, 2025",
    tags: [
      { label: "Bug", className: TAG.bug },
      { label: "Features", className: TAG.features },
      { label: "Improvements", className: TAG.improvements },
    ],
    attachments: 2,
    comments: 8,
    progress: 100,
    who: [{ name: "Priya Nair", initials: "PN", color: "#0EA5E9" }],
    priority: "medium",
  },
  {
    id: "t3",
    title: "Onboarding v2 flow",
    desc: "Cut the setup from nine steps down to four.",
    date: "Nov 10, 2025",
    tags: [
      { label: "Design", className: TAG.design },
      { label: "Features", className: TAG.features },
    ],
    attachments: 6,
    comments: 5,
    progress: 75,
    who: [{ name: "Mia Rivera", initials: "MR", color: "#EC4899" }, { name: "Leo Barnes", initials: "LB", color: "#F43F5E" }],
    priority: "medium",
  },
  {
    id: "t4",
    title: "Payment webhook retries",
    desc: "Retry failed Stripe webhooks with a backoff window.",
    date: "Overdue",
    tags: [
      { label: "Bug", className: TAG.bug },
      { label: "Engineering", className: TAG.engineering },
    ],
    attachments: 1,
    comments: 3,
    progress: 20,
    who: [{ name: "Dana Adeyemi", initials: "DA", color: "#F59E0B" }],
    priority: "high",
  },
  {
    id: "t5",
    title: "Draft the Q3 roadmap",
    desc: "Line up the themes and the bets for next quarter.",
    date: "Nov 14, 2025",
    tags: [{ label: "Marketing", className: TAG.marketing }, { label: "Sprint 2", className: TAG.neutral }],
    attachments: 3,
    comments: 9,
    progress: 40,
    who: [{ name: "Sam Cole", initials: "SC", color: "#14B8A6" }],
    priority: "low",
  },
  {
    id: "t6",
    title: "Migrate auth to passkeys",
    desc: "Move sign-in from passwords over to passkeys.",
    date: "Nov 18, 2025",
    tags: [
      { label: "Engineering", className: TAG.engineering },
      { label: "Improvements", className: TAG.improvements },
    ],
    attachments: 2,
    comments: 4,
    progress: 15,
    who: [{ name: "Mia Rivera", initials: "MR", color: "#EC4899" }],
    priority: "high",
  },
  {
    id: "t7",
    title: "Pricing page refresh",
    desc: "New tiers, clearer copy, and an annual toggle.",
    date: "Nov 12, 2025",
    tags: [
      { label: "Design", className: TAG.design },
      { label: "Marketing", className: TAG.marketing },
    ],
    attachments: 5,
    comments: 7,
    progress: 60,
    who: [{ name: "Leo Barnes", initials: "LB", color: "#F43F5E" }, { name: "Priya Nair", initials: "PN", color: "#0EA5E9" }],
    priority: "medium",
  },
  {
    id: "t8",
    title: "Customer interview with Acme",
    desc: "Dig into how their team imports and shares recipes.",
    date: "Nov 9, 2025",
    tags: [{ label: "Features", className: TAG.features }],
    attachments: 0,
    comments: 2,
    progress: 0,
    who: [{ name: "Ivan Brooks", initials: "IB", color: "#8B5CF6" }],
    priority: "low",
  },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Particle = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
  size: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
};

export default function TaskDissolve() {
  const reduce = useReducedMotion();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [particlesOn, setParticlesOn] = useState(false);
  const [undoActive, setUndoActive] = useState(false);
  const [announce, setAnnounce] = useState("");

  // Visible deck is derived, so restoring is just clearing the completed set.
  const tasks = INITIAL.filter((t) => !completedIds.includes(t.id));

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const undoTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const undoLeft = useRef(6000);
  const undoStart = useRef(0);

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(undoTimer.current);
    },
    []
  );

  const startUndo = useCallback(() => {
    setUndoActive(true);
    undoLeft.current = 6000;
    undoStart.current = performance.now();
    clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndoActive(false), 6000);
  }, []);
  const pauseUndo = () => {
    if (!undoActive) return;
    clearTimeout(undoTimer.current);
    undoLeft.current -= performance.now() - undoStart.current;
  };
  const resumeUndo = () => {
    if (!undoActive) return;
    undoStart.current = performance.now();
    undoTimer.current = setTimeout(() => setUndoActive(false), Math.max(0, undoLeft.current));
  };

  // Brings the whole deck back, in its original order.
  const restore = useCallback(() => {
    setCompletedIds([]);
    setAnnounce("All tasks brought back.");
    clearTimeout(undoTimer.current);
    setUndoActive(false);
  }, []);

  const runParticles = useCallback(
    (snap: HTMLCanvasElement, rect: { left: number; top: number; width: number; height: number }, dpr: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      // Pad the canvas well beyond the card so particles can blow right and
      // fall off the bottom without being clipped to the card's box.
      const M = { top: 90, right: 260, bottom: 360, left: 48 };
      const cardW = rect.width;
      const cardH = rect.height;
      const cw = cardW + M.left + M.right;
      const ch = cardH + M.top + M.bottom;
      canvas.style.left = `${rect.left - M.left}px`;
      canvas.style.top = `${rect.top - M.top}px`;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      setParticlesOn(true);

      const sctx = snap.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;
      const sw = snap.width;
      const sh = snap.height;
      const data = sctx.getImageData(0, 0, sw, sh).data;

      const cols = Math.ceil(cardW / CELL);
      const rows = Math.ceil(cardH / CELL);
      const parts: Particle[] = [];
      for (let ry = 0; ry < rows; ry++) {
        for (let rx = 0; rx < cols; rx++) {
          const sx = Math.min(sw - 1, Math.round((rx * CELL + CELL / 2) * dpr));
          const sy = Math.min(sh - 1, Math.round((ry * CELL + CELL / 2) * dpr));
          const i = (sy * sw + sx) * 4;
          const alpha = data[i + 3];
          if (alpha < 32) continue;
          const nx = (rx * CELL) / cardW;
          parts.push({
            x: M.left + rx * CELL,
            y: M.top + ry * CELL,
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
            a: alpha / 255,
            size: CELL * (0.85 + Math.random() * 0.5),
            vx: 0.5 + nx * 2.1 + Math.random() * 1.3,
            vy: -1.1 - Math.random() * 2.2,
            life: 1,
            decay: 1 / (30 + Math.random() * 22),
          });
        }
      }

      const loop = () => {
        ctx.clearRect(0, 0, cw, ch);
        let alive = 0;
        for (const p of parts) {
          if (p.life <= 0) continue;
          p.vy += 0.38;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
          const eased = Math.max(0, p.life) ** 1.4; // ease-out fade
          const a = eased * p.a;
          if (a <= 0.01) {
            p.life = 0;
            continue;
          }
          alive++;
          ctx.globalAlpha = a;
          ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
          const s = p.size * (0.35 + 0.65 * Math.max(0, p.life));
          ctx.fillRect(p.x, p.y, s, s);
        }
        if (alive > 0) {
          rafRef.current = requestAnimationFrame(loop);
        } else {
          ctx.clearRect(0, 0, cw, ch);
          setParticlesOn(false);
        }
      };

      // Paint the intact card into the canvas synchronously, so swapping the real
      // card for the canvas has no blank frame in between.
      for (const p of parts) {
        ctx.globalAlpha = p.a;
        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
        ctx.fillRect(p.x, p.y, CELL + 0.6, CELL + 0.6);
      }
      rafRef.current = requestAnimationFrame(loop);
    },
    []
  );

  const complete = useCallback(async () => {
    const task = INITIAL.filter((t) => !completedIds.includes(t.id))[0];
    if (!task || checkingId) return;
    setCheckingId(task.id);
    setAnnounce(`Task completed. ${task.title}.`);

    // Flatten any GSAP tilt and settle the content before we snapshot the card.
    const cardEl = frontRef.current;
    if (cardEl) {
      gsap.set(cardEl, { rotateX: 0, rotateY: 0 });
      gsap.set(cardEl.querySelectorAll("[data-row]"), { opacity: 1, y: 0 });
    }

    await wait(reduce ? 120 : 240);

    const node = frontRef.current;
    const wrap = wrapRef.current;
    if (!reduce && node && wrap && canvasRef.current) {
      try {
        const wr = wrap.getBoundingClientRect();
        const cr = node.getBoundingClientRect();
        const rect = { left: cr.left - wr.left, top: cr.top - wr.top, width: cr.width, height: cr.height };
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const { toCanvas } = await import("html-to-image");
        const snap = await toCanvas(node, { pixelRatio: dpr, cacheBust: true, skipFonts: true });
        runParticles(snap, rect, dpr);
      } catch {
        /* fall through to a clean removal */
      }
    }

    setCompletedIds((prev) => (prev.includes(task.id) ? prev : [...prev, task.id]));
    setCheckingId(null);
    startUndo();
  }, [completedIds, checkingId, reduce, runParticles, startUndo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && completedIds.length > 0) {
        e.preventDefault();
        restore();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [completedIds, restore]);

  const front = tasks[0];
  const checking = front ? checkingId === front.id : false;
  const doneCount = completedIds.length;

  // GSAP: cascade the card content in and set up the interactive tilt whenever
  // a new card reaches the front.
  const tiltX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const tiltY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    const el = frontRef.current;
    if (!el) return;
    tiltX.current = gsap.quickTo(el, "rotateX", { duration: 0.5, ease: "power3.out" });
    tiltY.current = gsap.quickTo(el, "rotateY", { duration: 0.5, ease: "power3.out" });
    let stagger: gsap.core.Tween | undefined;
    if (!reduce) {
      const rows = el.querySelectorAll("[data-row]");
      stagger = gsap.fromTo(
        rows,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.06, delay: 0.04, overwrite: true }
      );
    }
    return () => {
      stagger?.kill();
      tiltX.current = null;
      tiltY.current = null;
    };
  }, [front?.id, reduce]);

  const onCardMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const el = frontRef.current;
      if (!el || reduce || checkingId) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tiltY.current?.(nx * 7);
      tiltX.current?.(-ny * 7);
    },
    [reduce, checkingId]
  );

  const onCardLeave = useCallback(() => {
    tiltX.current?.(0);
    tiltY.current?.(0);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#eceef1] p-3 pt-10 sm:p-6 dark:bg-[#141416]">
      <div ref={wrapRef} className="@container relative flex w-full max-w-[540px] flex-col">
        {/* Dashed frame around the whole deck, drawn as SVG so the dash gaps are tunable */}
        <div className="relative rounded-[30px] p-2.5">
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-black/[0.13] dark:text-white/[0.12]" fill="none">
            {/* Percentage geometry (not calc) so Samsung Internet / Android WebView,
                which don't support calc() in SVG geometry attributes, render it too.
                overflow-visible lets the half-stroke sit on the edge without clipping. */}
            <rect x="0" y="0" width="100%" height="100%" rx="30" ry="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" strokeLinecap="round" />
          </svg>
          {/* Stack */}
          <div className="relative">
            {front ? (
            <>
              {/* Front card */}
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={front.id}
                  initial={{ opacity: 0, y: 14, scale: 0.975 }}
                  animate={{
                    opacity: checking && particlesOn ? 0 : 1,
                    y: checking ? -3 : 0,
                    scale: checking ? 1.008 : 1,
                  }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={SOFT}
                  className="relative z-10"
                  style={{ perspective: 900 }}
                >
                  <div
                    ref={(el) => {
                      if (el) frontRef.current = el; // never null on detach: keeps pointing at the live front card
                    }}
                    onMouseMove={onCardMove}
                    onMouseLeave={onCardLeave}
                    style={{ willChange: "transform" }}
                    className="rounded-[20px] border border-black/[0.08] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_10px_22px_-20px_rgba(20,20,45,0.22)] @lg:p-5 dark:border-white/[0.09] dark:bg-[#1c1c1f]"
                  >
                  <div className="flex items-start gap-2.5 @lg:gap-3">
                    <button
                      type="button"
                      onClick={complete}
                      aria-label={`Complete task, ${front.title}`}
                      className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-neutral-300 transition-colors hover:border-neutral-400 @lg:h-[22px] @lg:w-[22px] dark:border-neutral-600 dark:hover:border-neutral-500"
                      style={{ backgroundColor: checking ? ACCENT : "transparent", borderColor: checking ? ACCENT : undefined }}
                    >
                      <AnimatePresence>
                        {checking && (
                          <motion.span
                            key="c"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 520, damping: 20 }}
                            className="absolute text-white"
                          >
                            <Check size={13} weight="bold" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>

                    <div className="min-w-0 flex-1">
                      <div data-row className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <h3
                            className={`truncate text-[13.5px] font-semibold leading-5 transition-colors @lg:text-[15px] @lg:leading-6 ${
                              checking ? "text-neutral-400 line-through dark:text-neutral-500" : "text-neutral-900 dark:text-white"
                            }`}
                          >
                            {front.title}
                          </h3>
                        </div>
                        <PriorityIcon priority={front.priority} />
                      </div>

                      <p data-row className="mt-1 line-clamp-2 text-[12px] leading-[1.45] text-neutral-500 @lg:text-[13px] @lg:leading-5 dark:text-neutral-400">{front.desc}</p>

                      {/* Date + tags */}
                      <div data-row className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 @lg:mt-3">
                        <span className="flex shrink-0 items-center gap-1 text-[11.5px] text-neutral-500 @lg:text-[12.5px] dark:text-neutral-400">
                          <CalendarBlank size={13} className="@lg:hidden" />
                          <CalendarBlank size={14} className="hidden @lg:block" />
                          {front.date}
                        </span>
                        {front.tags.map((tag) => (
                          <span key={tag.label} className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium @lg:px-2 @lg:text-[12px] ${tag.className}`}>
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div data-row className="mt-3 border-t border-dashed border-black/[0.08] @lg:mt-4 dark:border-white/[0.1]" />

                  {/* Footer */}
                  <div data-row className="mt-2.5 flex items-center gap-2.5 text-[12px] text-neutral-500 @lg:mt-3 @lg:gap-4 @lg:text-[12.5px] dark:text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Paperclip size={14} className="@lg:hidden" />
                      <Paperclip size={15} className="hidden @lg:block" />
                      {front.attachments}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ChatCircle size={14} className="@lg:hidden" />
                      <ChatCircle size={15} className="hidden @lg:block" />
                      {front.comments}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Ring value={front.progress} />
                      <span className="font-medium tabular-nums text-neutral-600 dark:text-neutral-300">{front.progress}%</span>
                    </span>
                    <span className="ml-auto flex items-center">
                      {front.who.map((p, k) => (
                        <Assignee key={k} person={p} overlap={k > 0} />
                      ))}
                    </span>
                  </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={SOFT}
              className="flex flex-col items-center justify-center rounded-[20px] border border-black/[0.06] bg-white px-5 py-12 text-center @lg:px-6 @lg:py-14 dark:border-white/[0.07] dark:bg-[#1c1c1f]"
            >
              {/* Self-drawing "complete" ring with a check */}
              <div className="relative mb-6 h-16 w-16">
                <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
                  <circle cx="32" cy="32" r="29" fill="none" strokeWidth="3" className="stroke-emerald-500/15" />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="29"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="stroke-emerald-500"
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.85, ease: "easeInOut" }}
                  />
                </svg>
                <motion.span
                  initial={reduce ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 460, damping: 16, delay: 0.55 }}
                  className="absolute inset-0 flex items-center justify-center text-emerald-500"
                >
                  <Check size={26} weight="bold" />
                </motion.span>
              </div>

              <p className="text-[20px] font-semibold tracking-[-0.01em] text-neutral-900 dark:text-white">All clear</p>
              <p className="mt-1.5 max-w-[15rem] text-[13.5px] leading-5 text-neutral-500 dark:text-neutral-400">
                You finished all {INITIAL.length} tasks. Nothing left on the list.
              </p>

              <motion.button
                type="button"
                onClick={restore}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="mt-6 flex items-center gap-2 rounded-full border border-black/[0.08] px-4 py-2 text-[13px] font-semibold text-neutral-700 transition-colors hover:bg-black/[0.03] dark:border-white/[0.12] dark:text-neutral-200 dark:hover:bg-white/[0.06]"
              >
                <ArrowCounterClockwise size={14} weight="bold" />
                Start over
              </motion.button>
            </motion.div>
          )}

          </div>
        </div>

        {/* Particle canvas lives on wrapRef so its coordinate space matches the
            card rect (measured relative to wrapRef); its margins overflow freely. */}
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute z-30"
          style={{ display: particlesOn ? "block" : "none" }}
        />

        {/* Undo bar, in a reserved row so the stack never shifts */}
        <div className="relative mt-10 flex h-11 items-start justify-center @lg:mt-16">
          <AnimatePresence>
            {undoActive && doneCount > 0 && (
              <motion.div
                key="undo"
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.96 }}
                transition={SOFT}
                onMouseEnter={pauseUndo}
                onMouseLeave={resumeUndo}
                className="absolute top-0 flex items-center gap-3 rounded-full border border-black/[0.06] bg-white px-3 py-2 shadow-[0_4px_14px_-10px_rgba(20,20,45,0.2)] dark:border-white/[0.1] dark:bg-[#232325]"
              >
                <span className="flex items-center gap-2 pl-1">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                    <Check size={12} weight="bold" />
                  </span>
                  <span className="whitespace-nowrap text-[13px] font-medium text-neutral-800 dark:text-neutral-100">
                    {doneCount === 1 ? "1 task completed" : `${doneCount} tasks completed`}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={restore}
                  aria-label="Undo, bring all tasks back"
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#4f6ef2] px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#4560e0]"
                >
                  <ArrowCounterClockwise size={13} weight="bold" />
                  Undo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p aria-live="polite" role="status" className="sr-only">
          {announce}
        </p>
      </div>
    </div>
  );
}

function Assignee({ person, overlap }: { person: Person; overlap: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ y: -3, scale: 1.12 }}
      transition={{ type: "spring", stiffness: 500, damping: 24 }}
      style={{ backgroundColor: person.color, zIndex: hover ? 30 : 1 }}
      className={`relative flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white dark:ring-[#1c1c1f] ${overlap ? "-ml-2" : ""}`}
    >
      {person.initials}
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-8 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-2 py-1 text-[11px] font-medium text-white dark:bg-white dark:text-neutral-900"
          >
            {person.name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

function PriorityIcon({ priority }: { priority: Priority }) {
  if (priority === "high") return <Warning size={18} weight="fill" className="shrink-0 text-rose-500" aria-label="High priority" />;
  if (priority === "medium") return <ChartBar size={18} weight="fill" className="shrink-0 text-violet-500" aria-label="Medium priority" />;
  return <span aria-label="Low priority" className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />;
}

function Ring({ value }: { value: number }) {
  const r = 6.5;
  const c = 2 * Math.PI * r;
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" className="-rotate-90 shrink-0" aria-hidden>
      <circle cx="8.5" cy="8.5" r={r} fill="none" strokeWidth="2.4" className="stroke-black/[0.1] dark:stroke-white/[0.15]" />
      <circle
        cx="8.5"
        cy="8.5"
        r={r}
        fill="none"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="stroke-blue-500"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
      />
    </svg>
  );
}
