"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { Tray, ListChecks, MagnifyingGlass, CircleHalf, Prohibit, CheckCircle, Archive, Check, SpeakerSimpleHigh, SpeakerSimpleSlash, type Icon as PhosphorIcon } from "@phosphor-icons/react";

/* --------------------------------------------------------------------------
 * A picker where the row nearest the center leans forward: it sits on a white
 * card, larger and in full color, while rows above and below fall back in
 * scale, opacity, and blur. It is a real scroll container with snap, and a
 * scroll handler turns each row's distance from the center into those three
 * values. Underneath the effect it is a single-select listbox: arrow keys,
 * aria-selected, and a live region carry the meaning, so it works without the
 * animation. Reduced motion drops the blur and smooth scroll. All mock.
 * ------------------------------------------------------------------------ */

const ROW = 68; // row height, px
const VIEW = 320; // scroll viewport height, px
const PAD = (VIEW - ROW) / 2; // top/bottom padding so first/last row can reach center
const SPAN = 140; // distance over which a row fully falls back

type Item = { id: string; label: string; sub: string; Icon: PhosphorIcon; color: string };

const ITEMS: Item[] = [
  { id: "backlog", label: "Backlog", sub: "Not scheduled yet", Icon: Tray, color: "#64748B" },
  { id: "todo", label: "To do", sub: "Ready to pick up", Icon: ListChecks, color: "#3B82F6" },
  { id: "review", label: "In review", sub: "Waiting on a reviewer", Icon: MagnifyingGlass, color: "#F59E0B" },
  { id: "progress", label: "In progress", sub: "Being worked on now", Icon: CircleHalf, color: "#7C3AED" },
  { id: "blocked", label: "Blocked", sub: "Waiting on something else", Icon: Prohibit, color: "#E11D48" },
  { id: "done", label: "Done", sub: "Shipped and closed", Icon: CheckCircle, color: "#16A34A" },
  { id: "archived", label: "Archived", sub: "Hidden from the board", Icon: Archive, color: "#94A3B8" },
];

const START = 3; // In progress, centered at rest

export default function FocusPicker() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(START);
  const [confirmed, setConfirmed] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");

  const scrollRef = useRef<HTMLUListElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const activeRef = useRef(START);
  const raf = useRef(0);

  // Mouse drag to spin the wheel. Touch is left to native scrolling.
  const dragging = useRef(false);
  const dragMoved = useRef(false);
  const startY = useRef(0);
  const startTop = useRef(0);

  // A short synthesized click on each row change, like the iPhone picker.
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const audioCtx = useRef<AudioContext | null>(null);

  const tick = useCallback(() => {
    if (mutedRef.current || typeof window === "undefined") return;
    let ctx = audioCtx.current;
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      audioCtx.current = ctx;
    }
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.03);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.11, now + 0.004); // fast attack
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05); // short decay
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.055);
  }, []);

  useEffect(() => () => void audioCtx.current?.close(), []);

  const toggleMute = () =>
    setMuted((m) => {
      mutedRef.current = !m;
      return !m;
    });

  // Turn each row's distance from the center into scale, opacity, and blur.
  const update = useCallback(() => {
    raf.current = 0;
    const c = scrollRef.current;
    if (!c) return;
    const cr = c.getBoundingClientRect();
    const center = cr.top + cr.height / 2;
    let best = activeRef.current;
    let bestDist = Infinity;
    rows.current.forEach((li, i) => {
      if (!li) return;
      const r = li.getBoundingClientRect();
      const dist = Math.abs(r.top + r.height / 2 - center);
      const n = Math.min(1, dist / SPAN); // 0 at center, 1 at the edges
      const p = 1 - n; // proximity
      li.style.transform = `scale(${(1 - n * 0.22).toFixed(3)})`;
      li.style.opacity = (reduce ? 1 - n * 0.5 : 1 - n * 0.72).toFixed(3);
      // Blur ramps up toward the edges (squared so the center stays crisp).
      li.style.filter = reduce || n < 0.02 ? "" : `blur(${(n * n * 3.6).toFixed(2)}px)`;
      const tile = li.querySelector<HTMLElement>("[data-tile]");
      if (tile) tile.style.filter = `saturate(${Math.max(0, p).toFixed(2)})`;
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    if (best !== activeRef.current) {
      activeRef.current = best;
      setActive(best);
      setConfirmed(null);
      setAnnounce(ITEMS[best].label);
      tick();
    }
  }, [reduce, tick]);

  const onScroll = () => {
    if (!raf.current) raf.current = requestAnimationFrame(update);
  };

  const centerIndex = useCallback(
    (i: number, smooth: boolean) => {
      const c = scrollRef.current;
      const li = rows.current[i];
      if (!c || !li) return;
      const top = li.offsetTop - (c.clientHeight - li.offsetHeight) / 2;
      c.scrollTo({ top, behavior: smooth && !reduce ? "smooth" : "auto" });
    },
    [reduce]
  );

  const select = useCallback(
    (i: number, opts: { focus?: boolean; smooth?: boolean } = {}) => {
      const idx = Math.max(0, Math.min(ITEMS.length - 1, i));
      centerIndex(idx, opts.smooth ?? true);
      activeRef.current = idx;
      setActive(idx);
      setConfirmed(null);
      setAnnounce(ITEMS[idx].label);
      if (opts.focus) rows.current[idx]?.focus({ preventScroll: true });
    },
    [centerIndex]
  );

  // Center the starting row and paint the falloff before first frame.
  useLayoutEffect(() => {
    centerIndex(START, false);
    update();
    const onResize = () => {
      centerIndex(activeRef.current, false);
      update();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf.current);
    };
  }, [centerIndex, update]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        select(active + 1, { focus: true, smooth: true });
        break;
      case "ArrowUp":
        e.preventDefault();
        select(active - 1, { focus: true, smooth: true });
        break;
      case "Home":
        e.preventDefault();
        select(0, { focus: true, smooth: true });
        break;
      case "End":
        e.preventDefault();
        select(ITEMS.length - 1, { focus: true, smooth: true });
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        setConfirmed(active);
        setAnnounce(`Selected ${ITEMS[active].label}`);
        break;
    }
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse") return; // touch keeps native scrolling
    const c = scrollRef.current;
    if (!c) return;
    dragging.current = true;
    dragMoved.current = false;
    startY.current = e.clientY;
    startTop.current = c.scrollTop;
    c.style.scrollSnapType = "none";
    c.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (!dragging.current) return;
    const c = scrollRef.current;
    if (!c) return;
    const dy = e.clientY - startY.current;
    if (Math.abs(dy) > 3) dragMoved.current = true;
    c.scrollTop = startTop.current - dy;
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    const c = scrollRef.current;
    if (c) {
      c.style.scrollSnapType = "y mandatory";
      try {
        c.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    }
    select(activeRef.current, { smooth: true }); // snap to the nearest row
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#eceef1] p-4 dark:bg-[#141416]">

      <div className="relative w-full max-w-[340px]">
        <ul
          ref={scrollRef}
          role="listbox"
          aria-label="Choose a status"
          tabIndex={-1}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="relative cursor-grab touch-pan-y select-none overflow-y-auto active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            height: VIEW,
            paddingTop: PAD,
            paddingBottom: PAD,
            scrollSnapType: "y mandatory",
            // Fade the list into the background at the top and bottom, no overlay box.
            maskImage: "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)",
          }}
        >
          {ITEMS.map((it, i) => {
            const on = active === i;
            return (
              <li
                key={it.id}
                ref={(el) => {
                  rows.current[i] = el;
                }}
                role="option"
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                onClick={() => {
                  if (dragMoved.current) {
                    dragMoved.current = false;
                    return; // a drag ended here, do not treat it as a click
                  }
                  select(i, { focus: true, smooth: true });
                }}
                style={{ height: ROW, scrollSnapAlign: "center", willChange: "transform, opacity, filter" }}
                className="flex cursor-pointer items-center outline-none"
              >
                <div
                  className={`mx-auto flex w-full max-w-[300px] items-center gap-3 rounded-2xl px-3 py-2.5 transition-[background-color,box-shadow] duration-200 ${
                    on
                      ? "bg-white shadow-[0_2px_6px_rgba(20,20,45,0.06),0_16px_34px_-16px_rgba(20,20,45,0.4)] dark:bg-[#232326] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),0_16px_34px_-16px_rgba(0,0,0,0.6)]"
                      : "bg-transparent"
                  }`}
                >
                  <span
                    data-tile
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
                    style={{ backgroundColor: on ? it.color : `${it.color}22`, color: on ? "#ffffff" : it.color }}
                  >
                    <it.Icon size={16} weight={on ? "fill" : "bold"} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className={`truncate leading-tight ${on ? "text-[15px] font-semibold text-neutral-900 dark:text-white" : "text-[14px] font-medium text-neutral-600 dark:text-neutral-300"}`}>{it.label}</span>
                    <span className={`truncate text-[12px] leading-tight ${on ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-400 dark:text-neutral-500"}`}>{it.sub}</span>
                  </span>
                  {confirmed === i && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                      <Check size={12} weight="bold" />
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Turn tick sound on" : "Turn tick sound off"}
        className="mt-5 flex items-center gap-1.5 rounded-full border border-black/[0.06] px-3 py-1.5 text-[12px] font-medium text-neutral-500 transition-colors hover:bg-black/[0.03] dark:border-white/[0.1] dark:text-neutral-400 dark:hover:bg-white/[0.06]"
      >
        {muted ? <SpeakerSimpleSlash size={14} /> : <SpeakerSimpleHigh size={14} />}
        {muted ? "Sound off" : "Sound on"}
      </button>

      <p aria-live="polite" role="status" className="sr-only">
        {announce}
      </p>
    </div>
  );
}
