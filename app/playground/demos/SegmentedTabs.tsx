"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  SquaresFour,
  ChartLineUp,
  FileText,
  BellSimple,
  ArrowUpRight,
  ArrowDownRight,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

/* --------------------------------------------------------------------------
 * A segmented control over a small analytics card. One gliding highlight tracks
 * the active tab in either a pill or an underline, the headline numbers slide in
 * the direction you moved, and the area chart morphs between metrics. Click a
 * tab or drag the card sideways. All mock, theme aware.
 * ------------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;
const GLIDE = { type: "spring", stiffness: 520, damping: 40 } as const;
const ACCENT = "#3b6ef6";

type Variant = "pill" | "underline";
type Tab = { id: string; label: string; Icon: PhosphorIcon };

const TABS: Tab[] = [
  { id: "overview", label: "Overview", Icon: SquaresFour },
  { id: "analytics", label: "Analytics", Icon: ChartLineUp },
  { id: "reports", label: "Reports", Icon: FileText },
  { id: "activity", label: "Activity", Icon: BellSimple },
];

type Stat = { label: string; value: string; delta: string; up: boolean };
type Panel = { metric: string; value: string; delta: string; up: boolean; series: number[]; stats: Stat[] };

const PANELS: Record<string, Panel> = {
  overview: {
    metric: "Visitors",
    value: "48,209",
    delta: "12.4%",
    up: true,
    series: [22, 26, 24, 31, 29, 38, 42, 39, 46, 44, 52, 58],
    stats: [
      { label: "Signups", value: "1,204", delta: "3.1%", up: true },
      { label: "Bounce", value: "38.2%", delta: "2.4%", up: false },
      { label: "Avg. visit", value: "2m 18s", delta: "5.0%", up: true },
    ],
  },
  analytics: {
    metric: "Sessions",
    value: "92,740",
    delta: "8.0%",
    up: true,
    series: [40, 44, 41, 38, 47, 52, 49, 55, 51, 60, 57, 64],
    stats: [
      { label: "Pages / session", value: "4.6", delta: "0.3", up: true },
      { label: "New visitors", value: "61%", delta: "4.2%", up: true },
      { label: "Mobile", value: "54%", delta: "6.1%", up: true },
    ],
  },
  reports: {
    metric: "Generated",
    value: "312",
    delta: "24",
    up: true,
    series: [8, 10, 9, 14, 12, 11, 16, 15, 19, 22, 20, 26],
    stats: [
      { label: "Scheduled", value: "18", delta: "2", up: true },
      { label: "Shared", value: "76", delta: "9", up: true },
      { label: "Exports", value: "1,043", delta: "1.8%", up: false },
    ],
  },
  activity: {
    metric: "Events",
    value: "59,812",
    delta: "17.9%",
    up: true,
    series: [30, 48, 36, 52, 40, 58, 44, 62, 50, 46, 66, 72],
    stats: [
      { label: "Alerts", value: "12", delta: "4", up: false },
      { label: "Uptime", value: "99.98%", delta: "0.01%", up: true },
      { label: "P95 latency", value: "142ms", delta: "8ms", up: true },
    ],
  },
};

// --- area chart geometry ----------------------------------------------------
const CW = 320;
const CH = 96;
const PAD = 10;

function points(series: number[]): [number, number][] {
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = max - min || 1;
  const stepX = (CW - PAD * 2) / (series.length - 1);
  return series.map((v, i) => [PAD + i * stepX, PAD + (CH - PAD * 2) * (1 - (v - min) / range)]);
}
function linePath(pts: [number, number][]): string {
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const mx = ((x0 + x1) / 2).toFixed(1);
    d += ` C ${mx} ${y0.toFixed(1)} ${mx} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}
function areaPath(pts: [number, number][]): string {
  return `${linePath(pts)} L ${pts[pts.length - 1][0].toFixed(1)} ${CH} L ${pts[0][0].toFixed(1)} ${CH} Z`;
}

const slide = {
  enter: (d: number) => ({ opacity: 0, x: d * 26 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -26 }),
};

export default function SegmentedTabs() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [variant, setVariant] = useState<Variant>("pill");

  const go = (i: number) => {
    if (i === active) return;
    setDir(i > active ? 1 : -1);
    setActive(i);
  };

  function onDragEnd(_: unknown, info: PanInfo) {
    const past = Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 420;
    if (!past) return;
    if (info.offset.x < 0 && active < TABS.length - 1) go(active + 1);
    else if (info.offset.x > 0 && active > 0) go(active - 1);
  }

  const tab = TABS[active];
  const panel = PANELS[tab.id];
  const pts = useMemo(() => points(panel.series), [panel.series]);
  const line = linePath(pts);
  const area = areaPath(pts);
  const last = pts[pts.length - 1];

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#f3f3f5] p-5 sm:p-8 dark:bg-[#0f0f11]">
      <div className="w-full max-w-[440px]">
        {/* Variant switch */}
        <div className="mb-3 flex justify-center">
          <div className="inline-flex rounded-full bg-black/[0.045] p-0.5 dark:bg-white/[0.06]">
            {(["pill", "underline"] as Variant[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                className="relative rounded-full px-3 py-1 text-[11.5px] font-medium capitalize"
              >
                {variant === v && (
                  <motion.span
                    layoutId="variant-pill"
                    transition={GLIDE}
                    className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:bg-[#37373a]"
                  />
                )}
                <span
                  className={`relative z-10 transition-colors ${
                    variant === v ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {v}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-[18px] border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.2)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
          {/* Tab bar */}
          <div
            className={
              variant === "pill"
                ? "flex gap-1 p-1.5"
                : "flex border-b border-black/[0.06] px-1.5 dark:border-white/[0.08]"
            }
          >
            {TABS.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => go(i)}
                  className={`relative flex flex-1 items-center justify-center gap-1.5 text-[13px] font-medium transition-colors ${
                    variant === "pill" ? "rounded-[11px] px-2 py-1.5" : "px-2 pb-2.5 pt-2"
                  } ${
                    on
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {on && variant === "pill" && (
                    <motion.span
                      layoutId="tab-pill"
                      transition={GLIDE}
                      className="absolute inset-0 rounded-[11px] bg-black/[0.05] dark:bg-white/[0.09]"
                    />
                  )}
                  {on && variant === "underline" && (
                    <motion.span
                      layoutId="tab-underline"
                      transition={GLIDE}
                      className="absolute inset-x-2 -bottom-px h-[2px] rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                  )}
                  <t.Icon size={15} weight={on ? "fill" : "regular"} className="relative z-10 shrink-0" />
                  <span className="relative z-10 hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div
            className="cursor-grab border-t border-black/[0.05] px-5 pb-5 pt-4 active:cursor-grabbing dark:border-white/[0.06]"
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={onDragEnd}
            >
              {/* Headline: metric + value + delta (slides on tab change) */}
              <div className="relative h-[52px]">
                <AnimatePresence custom={dir} initial={false}>
                  <motion.div
                    key={tab.id}
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.26, ease: EASE }}
                    className="absolute inset-0 flex items-start justify-between"
                  >
                    <div>
                      <p className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400">{panel.metric}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-[26px] font-semibold leading-none tracking-tight text-neutral-900 tabular-nums dark:text-white">
                          {panel.value}
                        </span>
                        <span
                          className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                            panel.up
                              ? "bg-emerald-500/[0.12] text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-500/[0.12] text-rose-500 dark:text-rose-400"
                          }`}
                        >
                          {panel.up ? <ArrowUpRight size={11} weight="bold" /> : <ArrowDownRight size={11} weight="bold" />}
                          {panel.delta}
                        </span>
                      </div>
                    </div>
                    <span className="mt-1 text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
                      vs. last week
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Area chart (morphs between metrics) */}
              <div className="relative mt-2 h-24 w-full">
                <svg viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none" className="h-full w-full">
                  <defs>
                    <linearGradient id="seg-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity="0.22" />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    initial={false}
                    animate={{ d: area }}
                    transition={{ duration: 0.5, ease: EASE }}
                    fill="url(#seg-area)"
                  />
                  <motion.path
                    initial={false}
                    animate={{ d: line }}
                    transition={{ duration: 0.5, ease: EASE }}
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <motion.span
                  className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#3b6ef6] shadow-sm dark:border-[#1a1a1c]"
                  initial={false}
                  animate={{ left: `${(last[0] / CW) * 100}%`, top: `${(last[1] / CH) * 100}%` }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </div>

              {/* Secondary stats (slide on tab change) */}
              <div className="relative mt-3 h-[42px] border-t border-black/[0.05] pt-3 dark:border-white/[0.06]">
                <AnimatePresence custom={dir} initial={false}>
                  <motion.div
                    key={tab.id}
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.26, ease: EASE }}
                    className="absolute inset-x-0 grid grid-cols-3 gap-3 pt-3"
                  >
                    {panel.stats.map((s) => (
                      <div key={s.label} className="min-w-0">
                        <p className="truncate text-[11px] text-neutral-400 dark:text-neutral-500">{s.label}</p>
                        <p className="mt-0.5 flex items-baseline gap-1">
                          <span className="text-[14px] font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                            {s.value}
                          </span>
                          <span
                            className={`text-[10.5px] font-medium ${
                              s.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                            }`}
                          >
                            {s.up ? "+" : "-"}
                            {s.delta}
                          </span>
                        </p>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-3.5 flex items-center justify-center gap-1.5">
          {TABS.map((t, i) => (
            <button key={t.id} type="button" onClick={() => go(i)} aria-label={`Go to ${t.label}`} className="p-1">
              <motion.span
                className="block h-1.5 rounded-full"
                animate={{ width: i === active ? 18 : 6, backgroundColor: i === active ? ACCENT : "rgba(120,120,130,0.32)" }}
                transition={GLIDE}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
