"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretLeft, CaretRight, CalendarBlank } from "@phosphor-icons/react";

/* --------------------------------------------------------------------------
 * A date range picker. Two months side by side, a hover preview of the range
 * before you commit the second date, quick presets down the side, and full
 * keyboard nav on the grid. All local, theme aware, no date library.
 * ------------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;
const GLIDE = { type: "spring", stiffness: 520, damping: 42 } as const;
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// --- date helpers (all operate on local midnight) ---------------------------
const ymd = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const sameDay = (a: Date, b: Date) => key(a) === key(b);
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const fmt = (d: Date) => `${SHORT[d.getMonth()]} ${d.getDate()}`;
const fmtLong = (d: Date) => `${SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

// A 6x7 grid of dates for the month `d` sits in, padded with neighbour days.
function monthGrid(d: Date): Date[] {
  const first = startOfMonth(d);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

type Range = { start: Date | null; end: Date | null };

const TODAY = ymd(new Date());
const PRESETS: { label: string; range: () => Range }[] = [
  { label: "Today", range: () => ({ start: TODAY, end: TODAY }) },
  { label: "Yesterday", range: () => ({ start: addDays(TODAY, -1), end: addDays(TODAY, -1) }) },
  { label: "Last 7 days", range: () => ({ start: addDays(TODAY, -6), end: TODAY }) },
  { label: "Last 30 days", range: () => ({ start: addDays(TODAY, -29), end: TODAY }) },
  { label: "This month", range: () => ({ start: startOfMonth(TODAY), end: TODAY }) },
  {
    label: "Last month",
    range: () => {
      const s = addMonths(TODAY, -1);
      return { start: s, end: addDays(startOfMonth(TODAY), -1) };
    },
  },
];

export default function DateRangePicker() {
  const [range, setRange] = useState<Range>({ start: addDays(TODAY, -6), end: TODAY });
  const [hover, setHover] = useState<Date | null>(null);
  // Start on the current month so the default selection is visible on load,
  // including on mobile where only the left month is shown.
  const [view, setView] = useState<Date>(() => startOfMonth(TODAY));
  const [focus, setFocus] = useState<Date>(TODAY);
  const [activePreset, setActivePreset] = useState<string | null>("Last 7 days");
  const [monthDir, setMonthDir] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  // While a start is set but no end, the range previews to the hovered day.
  const preview: Range = useMemo(() => {
    if (range.start && !range.end && hover) {
      return hover < range.start ? { start: hover, end: range.start } : { start: range.start, end: hover };
    }
    return range;
  }, [range, hover]);

  function pick(day: Date) {
    setActivePreset(null);
    setRange((cur) => {
      if (!cur.start || (cur.start && cur.end)) return { start: day, end: null };
      // second click: order the two ends
      return day < cur.start ? { start: day, end: cur.start } : { start: cur.start, end: day };
    });
  }

  function applyPreset(p: (typeof PRESETS)[number]) {
    const r = p.range();
    setRange(r);
    setActivePreset(p.label);
    setHover(null);
    if (r.start) {
      setView(addMonths(r.start, 0));
      setFocus(r.end ?? r.start);
    }
  }

  function shiftMonth(n: number) {
    setMonthDir(n);
    setView((v) => addMonths(v, n));
  }

  // Keyboard: arrows move the focused day, Enter picks it, and the view follows.
  function onKeyDown(e: React.KeyboardEvent) {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in map) {
      e.preventDefault();
      const nextDay = addDays(focus, map[e.key]);
      setFocus(nextDay);
      setHover(range.start && !range.end ? nextDay : null);
      // keep the focused day inside the visible two months
      const right = addMonths(view, 1);
      if (nextDay < startOfMonth(view)) shiftMonth(-1);
      else if (nextDay > addDays(addMonths(right, 1), -1)) shiftMonth(1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(focus);
    }
  }

  const months = [view, addMonths(view, 1)];
  const label = range.start
    ? range.end
      ? `${fmt(range.start)} – ${fmt(range.end)}`
      : `${fmt(range.start)} – ...`
    : "Pick a range";
  const nights =
    range.start && range.end ? Math.round((ymd(range.end).getTime() - ymd(range.start).getTime()) / 86400000) : null;

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#f4f4f6] p-4 sm:p-8 dark:bg-[#141416]">
      <div className="w-full max-w-[540px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_18px_50px_-24px_rgba(0,0,0,0.28)] dark:border-white/[0.08] dark:bg-[#1d1d1f]">
        {/* Field header: the current range, like a real trigger */}
        <div className="flex items-center gap-2.5 border-b border-black/[0.05] px-4 py-3 dark:border-white/[0.07]">
          <CalendarBlank size={18} className="shrink-0 text-neutral-400" />
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              className="text-[14px] font-medium tabular-nums text-neutral-900 dark:text-neutral-100"
            >
              {label}
            </motion.span>
          </AnimatePresence>
          {nights !== null && (
            <span className="ml-1 rounded-full bg-[#3b6ef6]/[0.1] px-2 py-0.5 text-[11.5px] font-medium text-[#3b6ef6]">
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row">
          {/* Presets */}
          <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-black/[0.05] p-2 sm:w-[136px] sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r dark:border-white/[0.07] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PRESETS.map((p) => {
              const on = activePreset === p.label;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`relative shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-left text-[13px] font-medium transition-colors sm:w-full ${
                    on ? "text-[#3b6ef6]" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="preset-hl"
                      transition={GLIDE}
                      className="absolute inset-0 rounded-lg bg-[#3b6ef6]/[0.1]"
                    />
                  )}
                  <span className="relative z-10">{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Calendars */}
          <div
            ref={gridRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            role="grid"
            aria-label="Choose a date range"
            className="min-w-0 flex-1 p-3 outline-none focus-visible:ring-2 focus-visible:ring-[#3b6ef6]/40"
            onMouseLeave={() => range.start && range.end && setHover(null)}
          >
            {/* Month nav */}
            <div className="mb-2 flex items-center justify-between px-1">
              <NavButton dir={-1} onClick={() => shiftMonth(-1)} />
              <div className="flex flex-1 items-center justify-around overflow-hidden">
                {months.map((m, i) => (
                  <div key={i} className={i === 1 ? "hidden sm:block" : ""}>
                    <AnimatePresence mode="popLayout" custom={monthDir} initial={false}>
                      <motion.span
                        key={`${m.getFullYear()}-${m.getMonth()}`}
                        custom={monthDir}
                        initial={{ opacity: 0, x: monthDir * 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: monthDir * -12 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="block text-center text-[13.5px] font-semibold text-neutral-900 dark:text-neutral-100"
                      >
                        {MONTHS[m.getMonth()]} {m.getFullYear()}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              <NavButton dir={1} onClick={() => shiftMonth(1)} />
            </div>

            <div className="flex gap-6">
              {months.map((m, i) => (
                <Month
                  key={i}
                  month={m}
                  className={i === 1 ? "hidden sm:block" : ""}
                  range={range}
                  preview={preview}
                  focus={focus}
                  onPick={pick}
                  onHover={(d) => {
                    setFocus(d);
                    if (range.start && !range.end) setHover(d);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/[0.05] px-4 py-2.5 dark:border-white/[0.07]">
          <span className="text-[12.5px] text-neutral-500 dark:text-neutral-400">
            {range.start && range.end ? `${fmtLong(range.start)} to ${fmtLong(range.end)}` : "Select a start and end date"}
          </span>
          <button
            type="button"
            onClick={() => {
              setRange({ start: null, end: null });
              setActivePreset(null);
              setHover(null);
            }}
            className="rounded-lg px-2.5 py-1 text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

function NavButton({ dir, onClick }: { dir: -1 | 1; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      aria-label={dir === -1 ? "Previous month" : "Next month"}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-black/[0.05] hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.07] dark:hover:text-neutral-100"
    >
      {dir === -1 ? <CaretLeft size={16} weight="bold" /> : <CaretRight size={16} weight="bold" />}
    </motion.button>
  );
}

function Month({
  month,
  className = "",
  range,
  preview,
  focus,
  onPick,
  onHover,
}: {
  month: Date;
  className?: string;
  range: Range;
  preview: Range;
  focus: Date;
  onPick: (d: Date) => void;
  onHover: (d: Date) => void;
}) {
  const grid = monthGrid(month);
  return (
    <div className={`min-w-0 flex-1 ${className}`}>
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="py-1 text-center text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {grid.map((d) => (
          <DayCell
            key={key(d)}
            day={d}
            inMonth={d.getMonth() === month.getMonth()}
            range={range}
            preview={preview}
            focused={sameDay(d, focus)}
            onPick={onPick}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  );
}

function DayCell({
  day,
  inMonth,
  range,
  preview,
  focused,
  onPick,
  onHover,
}: {
  day: Date;
  inMonth: boolean;
  range: Range;
  preview: Range;
  focused: boolean;
  onPick: (d: Date) => void;
  onHover: (d: Date) => void;
}) {
  // Leading / trailing days from the neighbouring month stay plain, so a range
  // that crosses a month boundary is not drawn twice (once here as an overflow
  // day and once in that month's own grid).
  if (!inMonth) {
    return (
      <div className="flex h-9 items-center justify-center">
        <button
          type="button"
          tabIndex={-1}
          onClick={() => onPick(day)}
          onMouseEnter={() => onHover(day)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] text-neutral-300 transition-colors hover:bg-black/[0.04] dark:text-neutral-600 dark:hover:bg-white/[0.05]"
        >
          {day.getDate()}
        </button>
      </div>
    );
  }

  const { start, end } = preview;
  const isStart = start && sameDay(day, start);
  const isEnd = end && sameDay(day, end);
  const isCommittedEnd = (range.start && sameDay(day, range.start)) || (range.end && sameDay(day, range.end));
  const within = start && end && day > start && day < end;
  const inBand = start && end && day >= start && day <= end;
  const single = start && end && sameDay(start, end);
  const isToday = sameDay(day, TODAY);

  return (
    <div className="relative flex h-9 items-center justify-center">
      {/* Range band sits at the height of the day circle, not the whole cell */}
      {inBand && !single && (
        <span
          className={`absolute inset-y-[3px] inset-x-0 bg-[#3b6ef6]/[0.1] dark:bg-[#3b6ef6]/[0.18] ${
            isStart ? "left-1/2" : ""
          } ${isEnd ? "right-1/2" : ""}`}
        />
      )}
      <button
        type="button"
        tabIndex={-1}
        onClick={() => onPick(day)}
        onMouseEnter={() => onHover(day)}
        className={`relative flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-colors ${
          isStart || isEnd
            ? "bg-[#3b6ef6] font-semibold text-white shadow-[0_2px_6px_-1px_rgba(59,110,246,0.5)]"
            : within
              ? "text-[#2b58d6] hover:bg-[#3b6ef6]/[0.16] dark:text-blue-200"
              : "text-neutral-700 hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:bg-white/[0.08]"
        }`}
      >
        {focused && !isStart && !isEnd && (
          <span className="absolute inset-0 rounded-full ring-2 ring-inset ring-[#3b6ef6]/50" />
        )}
        <span className="relative z-10">{day.getDate()}</span>
        {isToday && !isCommittedEnd && (
          <span className="absolute bottom-[5px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#3b6ef6]" />
        )}
      </button>
    </div>
  );
}
