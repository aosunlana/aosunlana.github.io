"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MagnifyingGlass,
  ArrowRight,
  ArrowUUpLeft,
  PaperPlaneTilt,
  ArrowsLeftRight,
  Buildings,
  Wallet,
  Receipt,
  ShieldCheck,
  SealCheck,
  WarningCircle,
  Lightning,
  ClockCounterClockwise,
  Compass,
  UsersThree,
  Gear,
  ListChecks,
  CaretRight,
  Equals,
  Fingerprint,
  Check,
  CurrencyCircleDollar,
  User,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

/* --------------------------------------------------------------------------
 * A command palette (Cmd + K) built as an operations console for a cross-border
 * business banking app. It reads intent before it searches, so one input covers
 * six jobs: Go (navigate), Find (search any object), Do (actions), Answer
 * (inline compute), Continue (resume drafts), and Monitor (oversight). Money
 * movement never fires from a keystroke; it always opens a review first. All
 * mock, keyboard first, theme aware. Nothing leaves the component.
 * ------------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;
const ACCENT = "#635bff";

// Rotating examples for the animated placeholder (shown after "Search, or ask").
const PHRASES = [
  "“pay €500 to Acme”",
  "“usd to ngn”",
  "“payments over €10k”",
  "“download the June statement”",
  "“who approved payroll”",
];

// --- money helpers ----------------------------------------------------------
type Ccy = "USD" | "EUR" | "GBP" | "NGN";
const SYMBOL: Record<Ccy, string> = { USD: "$", EUR: "€", GBP: "£", NGN: "₦" };
// Units of each currency per 1 USD (mock mid-market rates).
const PER_USD: Record<Ccy, number> = { USD: 1, EUR: 0.921, GBP: 0.788, NGN: 1481.5 };
const rate = (from: Ccy, to: Ccy) => PER_USD[to] / PER_USD[from];
const money = (n: number, c: Ccy) =>
  `${SYMBOL[c]}${n.toLocaleString("en-US", { minimumFractionDigits: c === "NGN" ? 0 : 2, maximumFractionDigits: c === "NGN" ? 0 : 2 })}`;

function parseAmount(raw: string): number | null {
  const m = raw.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*([km])?/i);
  if (!m) return null;
  let v = parseFloat(m[1]);
  if (m[2]?.toLowerCase() === "k") v *= 1_000;
  if (m[2]?.toLowerCase() === "m") v *= 1_000_000;
  return v;
}

// --- mock data --------------------------------------------------------------
type Role = "Approver" | "Maker" | "Admin" | "Viewer";
const ROLES: Role[] = ["Approver", "Maker", "Admin", "Viewer"];
const ENTITIES = ["Northwind Global Inc · US", "Northwind Europe GmbH · DE", "Northwind UK Ltd · GB"];

type Purse = { ccy: Ccy; balance: number };
const WALLETS: Purse[] = [
  { ccy: "USD", balance: 1_204_880.0 },
  { ccy: "EUR", balance: 248_300.2 },
  { ccy: "GBP", balance: 96_540.1 },
  { ccy: "NGN", balance: 18_400_000 },
];

type Beneficiary = { id: string; name: string; ccy: Ccy; country: string; account: string; last: number };
const BENEFICIARIES: Beneficiary[] = [
  { id: "acme", name: "Acme Ltd", ccy: "GBP", country: "United Kingdom", account: "GB29 •••• 4471", last: 12_000 },
  { id: "globex", name: "Globex GmbH", ccy: "EUR", country: "Germany", account: "DE89 •••• 3000", last: 8_400 },
  { id: "umbrella", name: "Umbrella Inc", ccy: "USD", country: "United States", account: "•••• 8821", last: 24_000 },
  { id: "stark", name: "Stark Industries", ccy: "USD", country: "United States", account: "•••• 1120", last: 5_500 },
  { id: "okafor", name: "John Okafor", ccy: "NGN", country: "Nigeria", account: "•••• 0093", last: 750_000 },
];

type PayStatus = "Completed" | "Pending approval" | "Failed" | "Awaiting docs";
type Payment = { id: string; to: string; amount: number; ccy: Ccy; status: PayStatus; when: string; approver?: string };
const PAYMENTS: Payment[] = [
  { id: "p1", to: "Acme Ltd", amount: 12_000, ccy: "GBP", status: "Completed", when: "Jun 28", approver: "Sarah Chen" },
  { id: "p2", to: "Globex GmbH", amount: 8_400, ccy: "EUR", status: "Pending approval", when: "Jul 2" },
  { id: "p3", to: "Umbrella Inc", amount: 24_000, ccy: "USD", status: "Failed", when: "Jul 4" },
  { id: "p4", to: "Payroll batch", amount: 84_200, ccy: "USD", status: "Completed", when: "Jun 30", approver: "Sarah Chen" },
  { id: "p5", to: "John Okafor", amount: 750_000, ccy: "NGN", status: "Awaiting docs", when: "Jul 5" },
  { id: "p6", to: "Stark Industries", amount: 5_500, ccy: "USD", status: "Completed", when: "Jul 1", approver: "Marcus Bell" },
];

type Person = { id: string; name: string; role: string; email: string };
const PEOPLE: Person[] = [
  { id: "u1", name: "Sarah Chen", role: "CFO", email: "sarah@example.com" },
  { id: "u2", name: "Marcus Bell", role: "Finance Manager", email: "marcus@example.com" },
  { id: "u3", name: "Priya Nair", role: "Controller", email: "priya@example.com" },
  { id: "u4", name: "Diego Alvarez", role: "Accountant", email: "diego@example.com" },
];

const STATEMENTS = [
  { id: "s1", label: "June 2026 statement", meta: "All accounts · PDF" },
  { id: "s2", label: "Q2 2026 statement", meta: "Consolidated · PDF" },
  { id: "s3", label: "March 2026 statement", meta: "All accounts · PDF" },
];

const NAV = [
  { id: "dashboard", label: "Dashboard", Icon: Compass },
  { id: "payments", label: "Payments", Icon: PaperPlaneTilt },
  { id: "beneficiaries", label: "Beneficiaries", Icon: Buildings },
  { id: "fx", label: "FX & Convert", Icon: ArrowsLeftRight },
  { id: "wallets", label: "Wallets", Icon: Wallet },
  { id: "statements", label: "Statements", Icon: Receipt },
  { id: "approvals", label: "Approvals", Icon: SealCheck },
  { id: "audit", label: "Audit log", Icon: ListChecks },
  { id: "team", label: "Team & permissions", Icon: UsersThree },
  { id: "compliance", label: "Compliance", Icon: ShieldCheck },
  { id: "settings", label: "Settings", Icon: Gear },
];

// Which roles may take money / admin actions. Drives permission-aware results.
const CAN: Record<string, Role[]> = {
  pay: ["Maker", "Approver", "Admin"],
  approve: ["Approver", "Admin"],
  convert: ["Maker", "Approver", "Admin"],
  invite: ["Admin"],
  statement: ["Maker", "Approver", "Admin", "Viewer"],
};

const CCY_WORDS: Record<string, Ccy> = {
  usd: "USD", dollar: "USD", dollars: "USD",
  eur: "EUR", euro: "EUR", euros: "EUR",
  gbp: "GBP", pound: "GBP", pounds: "GBP",
  ngn: "NGN", naira: "NGN",
};

// --- result model -----------------------------------------------------------
type Frame =
  | { kind: "root" }
  | { kind: "bene"; id: string }
  | { kind: "review"; beneId: string; amount: number; ccy: Ccy }
  | { kind: "done"; title: string; sub: string };

type Row = {
  id: string;
  Icon: PhosphorIcon;
  color: string;
  label: string;
  meta?: string;
  right?: string; // metadata on the far right
  status?: { text: string; tone: "green" | "amber" | "red" | "violet" | "slate" };
  tag?: string; // the intent tag (Go, Find, Do…)
  shortcut?: string;
  run: () => void;
};
type Group = { id: string; heading: string; hint?: string; rows: Row[] };

const TONE: Record<string, string> = {
  green: "bg-emerald-500/[0.12] text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/[0.14] text-amber-600 dark:text-amber-400",
  red: "bg-rose-500/[0.12] text-rose-500 dark:text-rose-400",
  violet: "bg-[#635bff]/[0.12] text-[#635bff] dark:text-[#a29bff]",
  slate: "bg-black/[0.05] text-neutral-500 dark:bg-white/[0.08] dark:text-neutral-400",
};
const STATUS_TONE: Record<PayStatus, Row["status"]> = {
  Completed: { text: "Completed", tone: "green" },
  "Pending approval": { text: "Pending", tone: "amber" },
  Failed: { text: "Failed", tone: "red" },
  "Awaiting docs": { text: "Awaiting docs", tone: "slate" },
};

// Loose subsequence score: rewards contiguous, earlier, complete matches.
function score(text: string, q: string): number {
  const t = text.toLowerCase();
  const query = q.toLowerCase().trim();
  if (!query) return 0;
  if (t.includes(query)) return 100 - t.indexOf(query);
  let ti = 0;
  let hits = 0;
  for (const ch of query) {
    const at = t.indexOf(ch, ti);
    if (at === -1) return 0;
    ti = at + 1;
    hits += 1;
  }
  return hits === query.length ? 20 : 0;
}

export default function CommandPalette() {
  const [query, setQuery] = useState("");
  const [stack, setStack] = useState<Frame[]>([{ kind: "root" }]);
  const [sel, setSel] = useState(-1); // -1 = resting, nothing highlighted until hover / arrow keys
  const [role, setRole] = useState<Role>("Approver");
  const [entity, setEntity] = useState(0);
  const [open, setOpen] = useState(true); // false = collapsed to the resting search bar
  const [phrase, setPhrase] = useState(0); // index into the animated placeholder examples
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const openPalette = () => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const frame = stack[stack.length - 1];
  const push = (f: Frame) => setStack((s) => [...s, f]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const reset = () => {
    setStack([{ kind: "root" }]);
    setQuery("");
  };

  // Detect the intent behind the raw text and surface answers / actions first.
  const groups = useMemo<Group[]>(() => resolve(query, role, push), [query, role]);

  const rows = useMemo(() => groups.flatMap((g) => g.rows), [groups]);
  const keyNavRef = useRef(false); // only auto-scroll on keyboard nav, never on hover

  // Keep the highlighted row in range, but only when moving by keyboard. Scrolling
  // on hover fights the pointer and reads as jank.
  useEffect(() => setSel(-1), [query, frame.kind]);
  useEffect(() => {
    if (!keyNavRef.current) return;
    keyNavRef.current = false;
    listRef.current?.querySelector(`[data-row="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  // ⌘K / Ctrl+K opens the palette from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Cycle the placeholder examples, but only while the field is empty.
  useEffect(() => {
    if (query) return;
    const id = setInterval(() => setPhrase((p) => (p + 1) % PHRASES.length), 2600);
    return () => clearInterval(id);
  }, [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      keyNavRef.current = true;
      setSel((s) => Math.min(s + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      keyNavRef.current = true;
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      // From rest, Enter runs the top result; otherwise the highlighted one.
      (rows[sel] ?? rows[0])?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (frame.kind !== "root") pop();
      else if (query) setQuery("");
      else {
        setOpen(false); // collapse back to the resting search bar
        inputRef.current?.blur();
      }
    } else if (e.key === "Backspace" && !query && frame.kind !== "root") {
      e.preventDefault();
      pop();
    }
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#e8e9ee] p-4 sm:p-8 dark:bg-[#08080b]">
      <Backdrop />
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        onKeyDown={onKeyDown}
        className="relative z-10 flex w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white dark:border-white/[0.09] dark:bg-[#161618]"
      >
        {/* Search bar / breadcrumb, always visible */}
        <Header
          frame={frame}
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
          onBack={pop}
          open={open}
          onOpen={openPalette}
          phrase={phrase}
        />

        {/* Results + footer collapse away in the resting state */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex min-h-0 flex-col overflow-hidden"
            >
              <div ref={listRef} className="h-[440px] max-h-[62vh] overflow-y-auto px-2 py-2 [scrollbar-width:thin]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={frame.kind + (frame.kind === "bene" ? frame.id : "")}
                    initial={{ opacity: 0, x: frame.kind === "root" ? 0 : 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18, ease: EASE }}
                  >
                    {frame.kind === "root" && (
                      <RootBody groups={groups} sel={sel} setSel={setSel} query={query} />
                    )}
                    {frame.kind === "bene" && (
                      <BeneBody
                        bene={BENEFICIARIES.find((b) => b.id === frame.id)!}
                        role={role}
                        sel={sel}
                        setSel={setSel}
                        push={push}
                      />
                    )}
                    {frame.kind === "review" && (
                      <Review
                        bene={BENEFICIARIES.find((b) => b.id === frame.beneId)!}
                        amount={frame.amount}
                        ccy={frame.ccy}
                        role={role}
                        onConfirm={(title, sub) => push({ kind: "done", title, sub })}
                        onCancel={pop}
                      />
                    )}
                    {frame.kind === "done" && <Done title={frame.title} sub={frame.sub} onDone={reset} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              <Footer
                role={role}
                cycleRole={() => setRole((r) => ROLES[(ROLES.indexOf(r) + 1) % ROLES.length])}
                entity={ENTITIES[entity]}
                cycleEntity={() => setEntity((e) => (e + 1) % ENTITIES.length)}
                frame={frame}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ------------------------------- header --------------------------------- */
function Header({
  frame,
  query,
  setQuery,
  inputRef,
  onBack,
  open,
  onOpen,
  phrase,
}: {
  frame: Frame;
  query: string;
  setQuery: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onBack: () => void;
  open: boolean;
  onOpen: () => void;
  phrase: number;
}) {
  const crumb =
    frame.kind === "bene"
      ? BENEFICIARIES.find((b) => b.id === frame.id)?.name
      : frame.kind === "review"
        ? "Review payment"
        : frame.kind === "done"
          ? "Done"
          : null;

  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3.5 ${
        open ? "border-b border-black/[0.06] dark:border-white/[0.07]" : ""
      }`}
    >
      {frame.kind === "root" ? (
        <MagnifyingGlass size={19} className="shrink-0 text-neutral-400" />
      ) : (
        <button
          type="button"
          onClick={onBack}
          className="flex shrink-0 items-center gap-1 rounded-md px-1 py-0.5 text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
          aria-label="Back"
        >
          <ArrowUUpLeft size={17} weight="bold" />
        </button>
      )}
      {frame.kind === "root" ? (
        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={onOpen}
            autoFocus
            aria-label="Command palette"
            className="w-full bg-transparent text-[15px] text-neutral-900 outline-none dark:text-neutral-100"
          />
          {/* Animated placeholder: a static prefix + a rotating example that
              slides up. Shown only while the field is empty. */}
          {query === "" && (
            <div className="pointer-events-none absolute inset-0 flex items-center text-[15px]">
              <span className="text-neutral-400 dark:text-neutral-500">Search, or ask&nbsp;</span>
              <span className="relative ml-0.5 h-[1.45em] w-[320px] overflow-hidden">
                <AnimatePresence initial={false}>
                  <motion.span
                    key={phrase}
                    initial={{ y: "115%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-115%", opacity: 0 }}
                    transition={{ duration: 0.42, ease: EASE }}
                    className="absolute inset-0 flex items-center whitespace-nowrap font-medium text-neutral-500 dark:text-neutral-300"
                  >
                    {PHRASES[phrase]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-[15px]">
          <span className="text-neutral-400 dark:text-neutral-500">Northwind</span>
          <CaretRight size={12} className="text-neutral-300 dark:text-neutral-600" />
          <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">{crumb}</span>
        </div>
      )}
      <kbd className="shrink-0 rounded-md border border-black/[0.08] bg-black/[0.02] px-1.5 py-0.5 text-[11px] font-medium text-neutral-400 dark:border-white/[0.1] dark:bg-white/[0.03]">
        ⌘K
      </kbd>
    </div>
  );
}

/* ------------------------------- root body ------------------------------ */
function RootBody({
  groups,
  sel,
  setSel,
  query,
}: {
  groups: Group[];
  sel: number;
  setSel: (n: number) => void;
  query: string;
}) {
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/[0.06]">
          <MagnifyingGlass size={20} className="text-neutral-400" />
        </div>
        <p className="text-[14px] font-medium text-neutral-700 dark:text-neutral-200">No results for “{query}”</p>
        <p className="text-[12.5px] text-neutral-400">Try a beneficiary, an amount, or “pending approvals”.</p>
      </div>
    );
  }
  let idx = -1;
  return (
    <div className="flex flex-col gap-1">
      {groups.map((g) => (
        <div key={g.id}>
          <div className="flex items-center justify-between px-3 pb-1 pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {g.heading}
            </span>
            {g.hint && <span className="text-[11px] text-neutral-300 dark:text-neutral-600">{g.hint}</span>}
          </div>
          <div className="flex flex-col">
            {g.rows.map((r) => {
              idx += 1;
              const at = idx; // capture per row so hover selects THIS row, not the last
              return <RowView key={r.id} row={r} active={at === sel} index={at} onHover={() => setSel(at)} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function RowView({ row, active, index, onHover }: { row: Row; active: boolean; index: number; onHover: () => void }) {
  return (
    <button
      type="button"
      data-row={index}
      onMouseMove={onHover}
      onClick={row.run}
      className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left"
    >
      {active && (
        <motion.span
          layoutId="cp-hl"
          transition={{ type: "spring", stiffness: 700, damping: 46 }}
          className="absolute inset-0 rounded-lg bg-black/[0.05] dark:bg-white/[0.07]"
        />
      )}
      <span
        className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
        style={{ backgroundColor: `${row.color}1f`, color: row.color }}
      >
        <row.Icon size={17} weight="fill" />
      </span>
      <span className="relative z-10 flex min-w-0 flex-1 flex-col">
        <span className="flex items-center gap-2">
          <span className="truncate text-[14px] font-medium text-neutral-900 dark:text-neutral-100">{row.label}</span>
          {row.status && (
            <span className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-medium ${TONE[row.status.tone]}`}>
              {row.status.text}
            </span>
          )}
        </span>
        {row.meta && <span className="truncate text-[12px] text-neutral-500 dark:text-neutral-400">{row.meta}</span>}
      </span>
      {row.right && (
        <span className="relative z-10 shrink-0 text-[12.5px] font-medium tabular-nums text-neutral-500 dark:text-neutral-400">
          {row.right}
        </span>
      )}
      {row.tag && (
        <span className="relative z-10 hidden shrink-0 rounded-md border border-black/[0.07] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-400 sm:block dark:border-white/[0.1] dark:text-neutral-500">
          {row.tag}
        </span>
      )}
      {active && (
        <span className="relative z-10 shrink-0 text-neutral-300 dark:text-neutral-600">
          <ArrowRight size={15} weight="bold" />
        </span>
      )}
    </button>
  );
}

/* --------------------------- beneficiary body --------------------------- */
function BeneBody({
  bene,
  role,
  sel,
  setSel,
  push,
}: {
  bene: Beneficiary;
  role: Role;
  sel: number;
  setSel: (n: number) => void;
  push: (f: Frame) => void;
}) {
  const actions: Row[] = [];
  actions.push({
    id: "hist",
    Icon: ClockCounterClockwise,
    color: "#64748b",
    label: "View payment history",
    meta: `${PAYMENTS.filter((p) => p.to === bene.name).length} payments on record`,
    tag: "Go",
    run: () => {},
  });
  if (CAN.pay.includes(role)) {
    actions.push({
      id: "new",
      Icon: PaperPlaneTilt,
      color: ACCENT,
      label: "New payment",
      meta: `Pay ${bene.name} in ${bene.ccy}`,
      tag: "Do",
      run: () => push({ kind: "review", beneId: bene.id, amount: 0, ccy: bene.ccy }),
    });
    actions.push({
      id: "repeat",
      Icon: ArrowsLeftRight,
      color: "#2f6bff",
      label: "Repeat last payment",
      meta: `${money(bene.last, bene.ccy)} to ${bene.name}`,
      right: money(bene.last, bene.ccy),
      tag: "Do",
      run: () => push({ kind: "review", beneId: bene.id, amount: bene.last, ccy: bene.ccy }),
    });
  }
  actions.push({
    id: "copy",
    Icon: Receipt,
    color: "#12b76a",
    label: "Copy account details",
    meta: `${bene.account} · ${bene.country}`,
    tag: "Do",
    run: () => {},
  });

  return (
    <div className="flex flex-col">
      <div className="mx-1 mb-2 mt-1 flex items-center gap-3 rounded-xl bg-black/[0.025] p-3 dark:bg-white/[0.03]">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${ACCENT}1f`, color: ACCENT }}>
          <Buildings size={20} weight="fill" />
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100">{bene.name}</p>
          <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
            {bene.account} · {bene.country} · {bene.ccy}
          </p>
        </div>
      </div>
      {actions.map((r, i) => (
        <RowView key={r.id} row={r} active={i === sel} index={i} onHover={() => setSel(i)} />
      ))}
    </div>
  );
}

/* ------------------------------- review --------------------------------- */
function Review({
  bene,
  amount: initial,
  ccy,
  role,
  onConfirm,
  onCancel,
}: {
  bene: Beneficiary;
  amount: number;
  ccy: Ccy;
  role: Role;
  onConfirm: (title: string, sub: string) => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState(initial || bene.last);
  // Pick a same-currency wallet if we hold one, else fund from USD with FX.
  const direct = WALLETS.find((w) => w.ccy === ccy);
  const source: Purse = direct ?? WALLETS.find((w) => w.ccy === "USD")!;
  const needsFx = source.ccy !== ccy;
  const fxRate = rate(ccy, source.ccy);
  const sourceAmount = needsFx ? amount * fxRate : amount;
  const fee = ccy === "EUR" ? 0 : source.ccy === "USD" && needsFx ? 12 : 8;
  const arrival = ccy === "EUR" ? "within an hour · SEPA Instant" : "in 1 to 2 business days";
  const canPay = CAN.pay.includes(role);
  const maker = role === "Maker";

  const initials = bene.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const display = amount ? amount.toLocaleString("en-US") : "";
  // Size the input to hug the digits. Commas/points are narrower than a digit,
  // so counting them as a fraction of a `ch` avoids a gap before the currency.
  const amountWidth = [...display].reduce((n, c) => n + (c === "," || c === "." ? 0.32 : 1), 0);
  const total = money(sourceAmount + fee, source.ccy);

  const cta = canPay ? (maker ? "Send for approval" : "Authorize payment") : "View only";

  return (
    <div className="px-1.5 pb-1">
      {/* Recipient */}
      <div className="flex items-center gap-3 pb-4">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[13.5px] font-semibold"
          style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}
        >
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-semibold leading-tight text-neutral-900 dark:text-neutral-100">{bene.name}</p>
          <p className="truncate text-[12px] text-neutral-500 dark:text-neutral-400">
            {bene.account} · {bene.country}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-black/[0.04] px-2 py-1 text-[11px] font-semibold tracking-wide text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">
          {ccy}
        </span>
      </div>

      {/* Amount, left aligned and editable */}
      <div className="border-t border-black/[0.07] pt-4 dark:border-white/[0.08]">
        <p className="text-[11px] font-medium uppercase tracking-[0.09em] text-neutral-400">You send</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-[24px] font-medium text-neutral-400">{SYMBOL[ccy]}</span>
          <input
            type="text"
            inputMode="decimal"
            value={display}
            onChange={(e) => setAmount(parseAmount(e.target.value) ?? 0)}
            style={{ width: `${Math.max(1, amountWidth)}ch` }}
            className="bg-transparent text-[36px] font-semibold leading-none tracking-tight text-neutral-900 caret-[#635bff] outline-none tabular-nums dark:text-neutral-100"
            aria-label="Amount"
          />
          <span className="text-[13px] font-medium text-neutral-400">{ccy}</span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
          <Wallet size={14} className="text-neutral-400" />
          {source.ccy} wallet
          <span className="text-neutral-300 dark:text-neutral-600">·</span>
          <span className="tabular-nums">{money(source.balance, source.ccy)} available</span>
        </p>
      </div>

      {/* Cost breakdown, open with hairlines rather than a filled card */}
      <div className="mt-4 space-y-1.5 border-t border-black/[0.07] pt-3.5 dark:border-white/[0.08]">
        {needsFx && (
          <CostRow k={`Rate`} v={`1 ${ccy} = ${fxRate.toFixed(4)} ${source.ccy}`} />
        )}
        <CostRow k="Transfer fee" v={fee === 0 ? "Free" : money(fee, source.ccy)} />
      </div>
      <div className="mt-3 flex items-baseline justify-between border-t border-black/[0.07] pt-3 dark:border-white/[0.08]">
        <span className="text-[13.5px] font-semibold text-neutral-900 dark:text-neutral-100">Total to pay</span>
        <span className="text-[19px] font-semibold tracking-tight tabular-nums text-neutral-900 dark:text-neutral-100">{total}</span>
      </div>
      <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-neutral-400">
        <ClockCounterClockwise size={13} /> Arrives {arrival}
      </p>

      {/* Sign-off, calm rather than a loud alert */}
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-black/[0.07] bg-black/[0.015] px-3 py-2.5 dark:border-white/[0.08] dark:bg-white/[0.02]">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400/15 text-amber-500">
          <ShieldCheck size={15} weight="fill" />
        </span>
        <p className="text-[12px] leading-5 text-neutral-500 dark:text-neutral-400">
          <span className="font-medium text-neutral-800 dark:text-neutral-200">Second sign-off required.</span> One
          approver, then your passkey. Above your $5k solo limit.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 shrink-0 rounded-xl border border-black/[0.12] px-5 text-[13.5px] font-medium text-neutral-700 transition-colors hover:border-black/20 hover:bg-black/[0.02] dark:border-white/[0.16] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.04]"
        >
          Cancel
        </button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.99 }}
          disabled={!canPay || amount <= 0}
          onClick={() =>
            onConfirm(
              maker ? "Sent for approval" : "Payment authorized",
              maker
                ? `${money(amount, ccy)} to ${bene.name} is now waiting on 1 approver.`
                : `${money(amount, ccy)} to ${bene.name} was authorized with your passkey.`
            )
          }
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[14px] font-semibold text-white transition-opacity disabled:opacity-40"
          style={{ backgroundColor: ACCENT }}
        >
          <Fingerprint size={16} weight="bold" />
          {cta}
        </motion.button>
      </div>
    </div>
  );
}

function CostRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-neutral-500 dark:text-neutral-400">{k}</span>
      <span className="tabular-nums text-neutral-700 dark:text-neutral-300">{v}</span>
    </div>
  );
}

/* -------------------------------- done ---------------------------------- */
function Done({ title, sub, onDone }: { title: string; sub: string; onDone: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"
      >
        <Check size={28} weight="bold" />
      </motion.div>
      <div>
        <p className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">{title}</p>
        <p className="mx-auto mt-1 max-w-[320px] text-[13px] text-neutral-500 dark:text-neutral-400">{sub}</p>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="mt-1 rounded-lg bg-black/[0.05] px-3 py-1.5 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-black/[0.08] dark:bg-white/[0.08] dark:text-neutral-200 dark:hover:bg-white/[0.12]"
      >
        Back to search
      </button>
    </div>
  );
}

/* ------------------------------- footer --------------------------------- */
function Footer({
  role,
  cycleRole,
  entity,
  cycleEntity,
  frame,
}: {
  role: Role;
  cycleRole: () => void;
  entity: string;
  cycleEntity: () => void;
  frame: Frame;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-black/[0.06] bg-black/[0.015] px-3 py-2 dark:border-white/[0.07] dark:bg-white/[0.02]">
      <div className="flex min-w-0 items-center gap-1.5">
        <button
          type="button"
          onClick={cycleEntity}
          className="flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-[12px] font-medium text-neutral-600 transition-colors hover:bg-black/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.06]"
        >
          <Buildings size={13} weight="fill" className="shrink-0 text-neutral-400" />
          <span className="truncate">{entity}</span>
        </button>
        <button
          type="button"
          onClick={cycleRole}
          title="Cycle role to see permission-aware results"
          className="shrink-0 rounded-md px-1.5 py-1 text-[12px] font-medium text-[#635bff] transition-colors hover:bg-[#635bff]/[0.1] dark:text-[#a29bff]"
        >
          {role}
        </button>
      </div>
      <div className="hidden shrink-0 items-center gap-2.5 text-[11px] text-neutral-400 sm:flex dark:text-neutral-500">
        <Legend k="↑↓" label="Navigate" />
        <Legend k="↵" label={frame.kind === "review" ? "Confirm" : "Select"} />
        <Legend k="esc" label={frame.kind === "root" ? "Clear" : "Back"} />
      </div>
    </div>
  );
}

function Legend({ k, label }: { k: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <kbd className="rounded border border-black/[0.08] bg-white px-1 py-0.5 text-[10px] font-medium text-neutral-500 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-neutral-400">
        {k}
      </kbd>
      {label}
    </span>
  );
}

/* --------------------------- decorative backdrop ------------------------ */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #635bff55, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #2f6bff55, transparent 70%)" }}
      />
    </div>
  );
}

/* ============================ the intent engine ========================== */
// Reads the raw text, decides what the user is trying to do, and returns the
// six intent buckets in a confidence-first order. Empty text returns the
// contextual home (Continue / Needs attention / Recent / Suggested).
function resolve(raw: string, role: Role, push: (f: Frame) => void): Group[] {
  const q = raw.trim();

  if (!q) return emptyState(role, push);

  const groups: Group[] = [];
  const tokens = q.toLowerCase().split(/\s+/);
  const ccys = tokens.map((t) => CCY_WORDS[t]).filter(Boolean) as Ccy[];

  // --- ANSWER: FX ("usd to ngn", "convert 20k usd", "1000 usd to eur") ----
  if (ccys.length >= 1 && (/\bto\b|convert|rate|fx|in\s/.test(q.toLowerCase()) || ccys.length >= 2)) {
    const from = ccys[0];
    const to = ccys[1] ?? (from === "USD" ? "EUR" : "USD");
    const amt = parseAmount(q) ?? 1;
    const out = amt * rate(from, to);
    groups.push({
      id: "ans-fx",
      heading: "Answer",
      rows: [
        {
          id: "fx",
          Icon: Equals,
          color: ACCENT,
          label: `${money(amt, from)} = ${money(out, to)}`,
          meta: `1 ${from} = ${rate(from, to).toFixed(4)} ${to} · mid-market, updates live`,
          tag: "FX",
          run: () => {},
        },
      ],
    });
  }

  // --- ANSWER: balances ("eur balance", "balance") ------------------------
  if (/balance|how much|hold/.test(q.toLowerCase())) {
    const want = ccys[0];
    const shown = want ? WALLETS.filter((w) => w.ccy === want) : WALLETS;
    groups.push({
      id: "ans-bal",
      heading: "Answer",
      rows: shown.map((w) => ({
        id: `bal-${w.ccy}`,
        Icon: Wallet,
        color: "#12b76a",
        label: `${w.ccy} balance`,
        meta: `Available to spend now`,
        right: money(w.balance, w.ccy),
        tag: "Balance",
        run: () => {},
      })),
    });
  }

  // --- ANSWER: canned operational questions -------------------------------
  const canned = cannedAnswer(q);
  if (canned) groups.push({ id: "ans-op", heading: "Answer", rows: [canned] });

  // --- DO: natural-language payment ("pay acme 500 eur") ------------------
  const payMatch = q.toLowerCase().match(/^(?:pay|send)\s+(.+)/);
  if (payMatch && CAN.pay.includes(role)) {
    const rest = payMatch[1];
    const bene = BENEFICIARIES.map((b) => ({ b, s: score(b.name, rest.split(/\s+/)[0]) }))
      .sort((a, z) => z.s - a.s)
      .filter((x) => x.s > 0)[0]?.b;
    if (bene) {
      const amt = parseAmount(rest);
      const ccy = (ccys[0] as Ccy) ?? bene.ccy;
      groups.unshift({
        id: "do-pay",
        heading: "Do",
        hint: "opens review, never sends",
        rows: [
          {
            id: "pay",
            Icon: PaperPlaneTilt,
            color: ACCENT,
            label: `Pay ${bene.name}${amt ? ` ${money(amt, ccy)}` : ""}`,
            meta: `Review a ${ccy} transfer to ${bene.name} · ${bene.country}`,
            tag: "Do",
            run: () => push({ kind: "review", beneId: bene.id, amount: amt ?? 0, ccy }),
          },
        ],
      });
    }
  }

  // --- MONITOR: oversight keywords ----------------------------------------
  const monitor = monitorRows(q);
  if (monitor.length) groups.push({ id: "monitor", heading: "Monitor", rows: monitor });

  // --- DO: matching actions -----------------------------------------------
  const doRows = actionRows(q, role);
  if (doRows.length) groups.push({ id: "do", heading: "Do", rows: doRows });

  // --- FIND: objects (beneficiaries, payments, people, statements) --------
  const find = findRows(q, push);
  if (find.length) groups.push({ id: "find", heading: "Find", rows: find });

  // --- GO: navigation -----------------------------------------------------
  const go = NAV.map((n) => ({ n, s: score(n.label, q) }))
    .filter((x) => x.s > 0)
    .sort((a, z) => z.s - a.s)
    .slice(0, 4)
    .map(({ n }) => ({
      id: `go-${n.id}`,
      Icon: n.Icon,
      color: "#64748b",
      label: n.label,
      meta: "Jump straight there",
      tag: "Go",
      run: () => {},
    }));
  if (go.length) groups.push({ id: "go", heading: "Go", rows: go });

  return groups;
}

function cannedAnswer(q: string): Row | null {
  const l = q.toLowerCase();
  if (/payments? (this|per) month|spend this month/.test(l)) {
    const total = PAYMENTS.filter((p) => p.status === "Completed").reduce((s, p) => s + p.amount * rate(p.ccy, "USD"), 0);
    return { id: "a1", Icon: Lightning, color: ACCENT, label: `${money(total, "USD")} paid this month`, meta: `${PAYMENTS.filter((p) => p.status === "Completed").length} settled payments, in USD equivalent`, tag: "Answer", run: () => {} };
  }
  if (/largest|biggest/.test(l)) {
    const top = [...PAYMENTS].sort((a, b) => b.amount * rate(b.ccy, "USD") - a.amount * rate(a.ccy, "USD"))[0];
    return { id: "a2", Icon: Lightning, color: ACCENT, label: `Largest payment: ${money(top.amount, top.ccy)}`, meta: `To ${top.to} on ${top.when}`, tag: "Answer", run: () => {} };
  }
  if (/who approved (payroll|.*)/.test(l)) {
    const p = PAYMENTS.find((x) => l.includes(x.to.toLowerCase().split(" ")[0]) && x.approver) ?? PAYMENTS.find((x) => x.approver);
    if (p) return { id: "a3", Icon: SealCheck, color: "#12b76a", label: `${p.to} was approved by ${p.approver}`, meta: `${money(p.amount, p.ccy)} · ${p.when}`, tag: "Answer", run: () => {} };
  }
  if (/sepa cutoff|cut off/.test(l)) {
    return { id: "a4", Icon: ClockCounterClockwise, color: "#f59e0b", label: "SEPA cutoff is 15:30 CET", meta: "SEPA Instant runs 24/7 for up to €100,000", tag: "Answer", run: () => {} };
  }
  if (/wire fee|fee for wire|transfer fee/.test(l)) {
    return { id: "a5", Icon: CurrencyCircleDollar, color: "#12b76a", label: "Wire fee is $12 outgoing", meta: "SEPA and FX Instant are free on your plan", tag: "Answer", run: () => {} };
  }
  return null;
}

function monitorRows(q: string): Row[] {
  const l = q.toLowerCase();
  const rows: Row[] = [];
  if (/pending|approval|awaiting|due/.test(l)) {
    const pending = PAYMENTS.filter((p) => p.status === "Pending approval");
    rows.push({ id: "m-appr", Icon: SealCheck, color: "#f59e0b", label: "Pending approvals", meta: "Waiting on you before cutoff", right: `${pending.length + 3}`, status: { text: "Action", tone: "amber" }, tag: "Monitor", run: () => {} });
  }
  if (/fail|failed|reject|bounce/.test(l)) {
    rows.push({ id: "m-fail", Icon: WarningCircle, color: "#f04438", label: "Failed payments", meta: "Need a retry or a new route", right: "2", status: { text: "Review", tone: "red" }, tag: "Monitor", run: () => {} });
  }
  if (/large|over|above|big/.test(l)) {
    const amt = parseAmount(l);
    const usd = amt ? amt : 10_000;
    const big = PAYMENTS.filter((p) => p.amount * rate(p.ccy, "USD") >= usd);
    big.forEach((p) =>
      rows.push({ id: `m-${p.id}`, Icon: PaperPlaneTilt, color: ACCENT, label: `${p.to} · ${money(p.amount, p.ccy)}`, meta: `${p.when} · over ${money(usd, "USD")}`, status: STATUS_TONE[p.status], tag: "Monitor", run: () => {} })
    );
  }
  if (/compliance|kyc|document|docs/.test(l)) {
    rows.push({ id: "m-comp", Icon: ShieldCheck, color: "#7c3aed", label: "Compliance requests", meta: "1 beneficiary awaiting KYC docs", right: "1", status: { text: "Open", tone: "violet" }, tag: "Monitor", run: () => {} });
  }
  return rows;
}

function actionRows(q: string, role: Role): Row[] {
  const defs = [
    { id: "convert", label: "Convert currency", meta: "Lock an FX quote and move between wallets", Icon: ArrowsLeftRight, color: "#f59e0b", gate: "convert", kw: "convert exchange fx currency swap" },
    { id: "statement", label: "Download statement", meta: "PDF or CSV, any account", Icon: Receipt, color: "#64748b", gate: "statement", kw: "download statement export pdf report" },
    { id: "invite", label: "Invite a teammate", meta: "Set their role and entity access", Icon: UsersThree, color: "#2f6bff", gate: "invite", kw: "invite add user teammate member" },
    { id: "approve", label: "Approve payments", meta: "Open the approval queue", Icon: SealCheck, color: "#12b76a", gate: "approve", kw: "approve approvals sign off" },
    { id: "newbene", label: "Add a beneficiary", meta: "Domestic or international", Icon: Buildings, color: ACCENT, gate: "pay", kw: "new beneficiary add recipient payee" },
  ];
  return defs
    .filter((d) => CAN[d.gate].includes(role))
    .map((d) => ({ d, s: Math.max(score(d.label, q), score(d.kw, q) ? score(d.kw, q) : 0) }))
    .filter((x) => x.s > 0)
    .sort((a, z) => z.s - a.s)
    .slice(0, 3)
    .map(({ d }) => ({
      id: `act-${d.id}`,
      Icon: d.Icon,
      color: d.color,
      label: d.label,
      meta: d.meta,
      tag: "Do",
      run: () => {},
    }));
}

function findRows(q: string, push: (f: Frame) => void): Row[] {
  const rows: { row: Row; s: number }[] = [];
  BENEFICIARIES.forEach((b) => {
    const s = score(b.name, q);
    if (s > 0)
      rows.push({
        s,
        row: {
          id: `f-${b.id}`,
          Icon: Buildings,
          color: ACCENT,
          label: b.name,
          meta: `Beneficiary · ${b.country} · ${b.ccy}`,
          right: b.account,
          tag: "Find",
          run: () => push({ kind: "bene", id: b.id }),
        },
      });
  });
  PAYMENTS.forEach((p) => {
    const s = Math.max(score(p.to, q), score(p.status, q));
    if (s > 0)
      rows.push({
        s: s - 2,
        row: {
          id: `f-${p.id}`,
          Icon: PaperPlaneTilt,
          color: "#2f6bff",
          label: `${p.to} · ${money(p.amount, p.ccy)}`,
          meta: `Payment · ${p.when}`,
          status: STATUS_TONE[p.status],
          tag: "Find",
          run: () => {},
        },
      });
  });
  PEOPLE.forEach((u) => {
    const s = Math.max(score(u.name, q), score(u.role, q));
    if (s > 0)
      rows.push({
        s: s - 3,
        row: {
          id: `f-${u.id}`,
          Icon: User,
          color: "#7c3aed",
          label: u.name,
          meta: `${u.role} · ${u.email}`,
          tag: "Find",
          run: () => {},
        },
      });
  });
  STATEMENTS.forEach((st) => {
    const s = score(st.label, q);
    if (s > 0)
      rows.push({
        s: s - 4,
        row: { id: `f-${st.id}`, Icon: Receipt, color: "#64748b", label: st.label, meta: st.meta, tag: "Find", run: () => {} },
      });
  });
  return rows.sort((a, z) => z.s - a.s).slice(0, 6).map((x) => x.row);
}

// The contextual home shown when the input is empty.
function emptyState(role: Role, push: (f: Frame) => void): Group[] {
  const groups: Group[] = [];

  groups.push({
    id: "continue",
    heading: "Continue",
    hint: "picked up where you left off",
    rows: [
      {
        id: "c1",
        Icon: PaperPlaneTilt,
        color: ACCENT,
        label: "Resume payment to Acme Ltd",
        meta: "Draft · £2,000 · started 12 min ago",
        tag: "Continue",
        run: () => push({ kind: "review", beneId: "acme", amount: 2000, ccy: "GBP" }),
      },
      {
        id: "c2",
        Icon: ArrowsLeftRight,
        color: "#f59e0b",
        label: "Resume FX conversion",
        meta: "USD › EUR · 20,000 · quote expires in 3 min",
        tag: "Continue",
        run: () => {},
      },
      ...(CAN.approve.includes(role)
        ? [
            {
              id: "c3",
              Icon: SealCheck,
              color: "#12b76a",
              label: "Resume approval session",
              meta: "3 of 7 payments reviewed",
              tag: "Continue" as const,
              run: () => {},
            },
          ]
        : []),
    ],
  });

  groups.push({
    id: "attention",
    heading: "Needs attention",
    rows: [
      { id: "n1", Icon: SealCheck, color: "#f59e0b", label: "4 approvals waiting", meta: "Two are over $50k", right: "4", status: { text: "Due today", tone: "amber" }, tag: "Monitor", run: () => {} },
      { id: "n2", Icon: WarningCircle, color: "#f04438", label: "2 failed payments", meta: "Umbrella Inc · Globex GmbH", right: "2", status: { text: "Review", tone: "red" }, tag: "Monitor", run: () => {} },
      { id: "n3", Icon: ShieldCheck, color: "#7c3aed", label: "1 compliance request", meta: "John Okafor · KYC documents", right: "1", status: { text: "Open", tone: "violet" }, tag: "Monitor", run: () => {} },
    ],
  });

  groups.push({
    id: "recent",
    heading: "Recent",
    rows: [
      { id: "r1", Icon: Wallet, color: "#12b76a", label: "EUR wallet", meta: "€248,300.20 available", right: money(248300.2, "EUR"), tag: "Go", run: () => {} },
      { id: "r2", Icon: Buildings, color: ACCENT, label: "Acme Ltd", meta: "Beneficiary · United Kingdom", tag: "Find", run: () => push({ kind: "bene", id: "acme" }) },
      { id: "r3", Icon: Receipt, color: "#64748b", label: "June 2026 statement", meta: "All accounts · PDF", tag: "Find", run: () => {} },
    ],
  });

  groups.push({
    id: "suggested",
    heading: "Try asking",
    rows: [
      { id: "s1", Icon: Lightning, color: ACCENT, label: "Pay €2,000 to Acme", meta: "Natural language payment", tag: "Do", run: () => push({ kind: "review", beneId: "acme", amount: 2000, ccy: "EUR" }) },
      { id: "s2", Icon: Equals, color: ACCENT, label: "USD to EUR", meta: "Live FX answer, inline", tag: "Answer", run: () => {} },
      { id: "s3", Icon: PaperPlaneTilt, color: "#2f6bff", label: "Payments over €10k", meta: "Filter across every entity", tag: "Monitor", run: () => {} },
    ],
  });

  return groups;
}
