"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  CheckCircle,
  WarningCircle,
  Info,
  SpinnerGap,
  X,
  Bell,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

/* --------------------------------------------------------------------------
 * A toast / notification stack. New toasts drop in at the front; the older ones
 * fan out behind and collapse into a "+N" peek. Each one auto dismisses on a
 * progress bar that pauses while the pointer is over the stack, and any toast
 * can be flicked sideways to dismiss it. All mock, theme aware.
 * ------------------------------------------------------------------------ */

const DURATION = 5000; // auto dismiss window, ms
const TICK = 50; // progress cadence, ms
const VISIBLE = 3; // toasts shown while collapsed
const H = 76; // fixed toast height, keeps the stacking math simple
const GAP = 14; // gap between toasts when expanded
const PEEK = 16; // vertical peek per toast when collapsed

type Kind = "success" | "error" | "info" | "loading";
type Toast = {
  id: string;
  kind: Kind;
  title: string;
  desc: string;
  remaining: number; // ms left before auto dismiss
  sticky: boolean; // loading toasts wait to resolve instead of counting down
};

const STYLES: Record<Kind, { Icon: PhosphorIcon; color: string; bar: string }> = {
  success: { Icon: CheckCircle, color: "#12b76a", bar: "#12b76a" },
  error: { Icon: WarningCircle, color: "#f04438", bar: "#f04438" },
  info: { Icon: Info, color: "#2f6bff", bar: "#2f6bff" },
  loading: { Icon: SpinnerGap, color: "#8b8b93", bar: "#8b8b93" },
};

const SAMPLES: Omit<Toast, "id" | "remaining" | "sticky">[] = [
  { kind: "success", title: "Changes saved", desc: "Your draft is up to date." },
  { kind: "info", title: "New comment", desc: "Sophia mentioned you in Roadmap." },
  { kind: "error", title: "Upload failed", desc: "cover.png was over the limit." },
  { kind: "success", title: "Invite sent", desc: "michael@example.com will get an email." },
  { kind: "info", title: "Sync complete", desc: "42 files pulled from main." },
];

const rid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Math.random()}`;

export default function ToastStack() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hovered, setHovered] = useState(false);
  const next = useRef(0);
  const hoverRef = useRef(false);
  hoverRef.current = hovered;

  // A single loop ticks every toast down. It pauses whenever the pointer sits
  // over the stack, so hovering to read never eats a toast. Rebuilding the
  // non-sticky toasts each tick is what advances the progress bars.
  useEffect(() => {
    const loop = setInterval(() => {
      if (hoverRef.current) return;
      setToasts((cur) => {
        let mutated = false;
        const kept: Toast[] = [];
        for (const t of cur) {
          if (t.sticky) {
            kept.push(t);
            continue;
          }
          mutated = true;
          const remaining = t.remaining - TICK;
          if (remaining > 0) kept.push({ ...t, remaining });
        }
        return mutated ? kept : cur;
      });
    }, TICK);
    return () => clearInterval(loop);
  }, []);

  function push(kind?: Kind) {
    const sample = SAMPLES[next.current % SAMPLES.length];
    next.current += 1;
    const k = kind ?? sample.kind;
    const id = rid();
    setToasts((cur) => [
      { ...sample, kind: k, id, remaining: DURATION, sticky: k === "loading" },
      ...cur,
    ]);
    // A loading toast resolves into a success after a beat.
    if (k === "loading") {
      setTimeout(() => {
        setToasts((cur) =>
          cur.map((t) =>
            t.id === id
              ? { ...t, kind: "success", title: "Export ready", desc: "report.pdf is ready to download.", sticky: false, remaining: DURATION }
              : t
          )
        );
      }, 2200);
    }
  }

  const dismiss = (id: string) => setToasts((cur) => cur.filter((t) => t.id !== id));
  const clearAll = () => setToasts([]);

  // Collapsed: the stack height is one toast plus a peek per hidden layer.
  // Expanded: it opens to the full column.
  const shown = toasts.length;
  const collapsedH = H + Math.min(shown - 1, VISIBLE - 1) * PEEK;
  const expandedH = shown * H + Math.max(0, shown - 1) * GAP;
  const stackH = shown === 0 ? 0 : hovered ? expandedH : collapsedH;

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#eceef1] p-4 sm:p-6 dark:bg-[#141416]">
      {/* A little "screen": controls up top, the toaster docked at the bottom,
          so the space between reads on purpose and the stack opens up into it. */}
      <div className="relative flex h-full max-h-[540px] w-full max-w-[440px] flex-col">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <TriggerButton onClick={() => push("success")} color="#12b76a" label="Success" />
          <TriggerButton onClick={() => push("info")} color="#2f6bff" label="Message" />
          <TriggerButton onClick={() => push("error")} color="#f04438" label="Error" />
          <TriggerButton onClick={() => push("loading")} color="#8b8b93" label="Loading" />
          <AnimatePresence>
            {toasts.length > 0 && (
              <motion.button
                type="button"
                key="clear"
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
                whileTap={{ scale: 0.94 }}
                onClick={clearAll}
                className="h-9 shrink-0 overflow-hidden whitespace-nowrap rounded-full px-3 text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                Clear all
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Toaster: docked at the bottom, new toasts stack up, hover fans it open. */}
        <div
          className="relative mt-auto w-full"
          style={{ minHeight: 132 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {shown === 0 && <EmptyHint />}
          <motion.div
            className="absolute inset-x-0 bottom-0"
            animate={{ height: stackH }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <AnimatePresence initial={false}>
              {toasts.map((t, i) => (
                <ToastCard
                  key={t.id}
                  toast={t}
                  index={i}
                  expanded={hovered}
                  onDismiss={() => dismiss(t.id)}
                />
              ))}
            </AnimatePresence>

            {/* "+N more" hint floats just above the peeked layers */}
            <AnimatePresence>
              {!hovered && shown > VISIBLE && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="pointer-events-none absolute inset-x-0 z-[120] flex justify-center"
                  style={{ bottom: collapsedH + 8 }}
                >
                  <span className="rounded-full bg-neutral-900/85 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur dark:bg-white/90 dark:text-neutral-900">
                    +{shown - VISIBLE} more
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TriggerButton({ onClick, color, label }: { onClick: () => void; color: string; label: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      className="flex h-9 items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3 text-[13px] font-medium text-neutral-700 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors hover:bg-neutral-50 dark:border-white/[0.08] dark:bg-[#232325] dark:text-neutral-200 dark:hover:bg-[#2c2c2e]"
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </motion.button>
  );
}

function EmptyHint() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-[76px] items-center justify-center gap-2 rounded-2xl border border-dashed border-black/[0.09] text-[13px] text-neutral-400 dark:border-white/[0.1] dark:text-neutral-500">
      <Bell size={16} />
      Fire a toast to see the stack
    </div>
  );
}

function ToastCard({
  toast,
  index,
  expanded,
  onDismiss,
}: {
  toast: Toast;
  index: number;
  expanded: boolean;
  onDismiss: () => void;
}) {
  const { Icon, color, bar } = STYLES[toast.kind];
  const [dragX, setDragX] = useState(0);

  // Collapsed: fan out behind the front toast with a peek + scale + fade.
  // Expanded: lay out as a real column from the bottom up.
  const y = expanded ? -(index * (H + GAP)) : -(index * PEEK);
  const scale = expanded ? 1 : 1 - Math.min(index, VISIBLE) * 0.05;
  const hidden = !expanded && index >= VISIBLE;
  const pct = toast.sticky ? 1 : Math.max(0, toast.remaining / DURATION);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) onDismiss();
    else setDragX(0);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, scale: 0.9 }}
      animate={{
        opacity: hidden ? 0 : 1,
        y,
        scale,
        x: dragX,
      }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDrag={(_, info) => setDragX(info.offset.x)}
      onDragEnd={onDragEnd}
      whileDrag={{ cursor: "grabbing" }}
      className="group absolute inset-x-0 bottom-0 cursor-grab touch-none select-none overflow-hidden rounded-[15px] border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_-10px_rgba(0,0,0,0.22)] ring-1 ring-black/[0.01] dark:border-white/[0.09] dark:bg-[#242426]"
      style={{ height: H, zIndex: 100 - index }}
    >
      <div className="flex h-full items-center gap-3 px-3.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ color, backgroundColor: `${color}1f` }}
        >
          {toast.kind === "loading" ? (
            <motion.span
              className="block"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
            >
              <Icon size={17} weight="bold" />
            </motion.span>
          ) : (
            <motion.span
              className="block"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Icon size={17} weight="fill" />
            </motion.span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-neutral-900 dark:text-neutral-100">
            {toast.title}
          </p>
          <p className="truncate text-[12.5px] text-neutral-500 dark:text-neutral-400">{toast.desc}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1 text-neutral-400 opacity-0 transition-[opacity,color,background-color] hover:bg-black/[0.05] hover:text-neutral-700 group-hover:opacity-100 dark:hover:bg-white/[0.08] dark:hover:text-neutral-200"
        >
          <X size={15} weight="bold" />
        </button>
      </div>

      {/* Progress bar: depletes over the toast's life, frozen while paused */}
      {!toast.sticky && (
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent">
          <div
            className="h-full origin-left rounded-full opacity-70"
            style={{ backgroundColor: bar, transform: `scaleX(${pct})`, transition: `transform ${TICK}ms linear` }}
          />
        </div>
      )}
    </motion.div>
  );
}
