"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  MagnifyingGlass,
  SortAscending,
  SortDescending,
  XCircle,
  Users,
  Buildings,
  CaretDown,
  X,
  CircleDashed,
  ListPlus,
  Chat,
  Plus,
  File as FileIcon,
  Checks,
  ArrowBendUpRight,
  TreeStructure,
  Check,
  HandWaving,
  Fire,
  CheckSquare,
  NotePencil,
  FolderSimple,
  LinkSimple,
  Bell,
} from "@phosphor-icons/react";

/* --------------------------------------------------------------------------
 * A command-palette style search. Empty input shows the resting view (filter
 * chips, last searches, quick actions). Typing switches to a results view with
 * a member mention popover, grouped results, and amber match highlighting.
 * A single highlight glides between rows on hover and with the arrow keys.
 * Fully themed: light by default, dark under the `.dark` class. All data mock.
 * ------------------------------------------------------------------------ */

const dice = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}`;

const AMBER = "#F2C24B";
const EASE = [0.22, 1, 0.36, 1] as const;
const HL_SPRING = { type: "spring", stiffness: 700, damping: 46 } as const;

type Person = { name: string; email?: string; seed: string; bg: string };

// Original cast (not from any reference). Built around the search term "mar",
// which shows up in the names and the email local-parts so highlighting has
// something to catch across both.
const P: Record<string, Person> = {
  jason: { name: "Isla Bennett", email: "isla@example.com", seed: "Isla", bg: "linear-gradient(140deg,#2dd4bf,#14b8a6)" },
  rob: { name: "Rowan Pike", email: "rowan@example.com", seed: "Rowan", bg: "linear-gradient(140deg,#f0abfc,#a855f7)" },
  hannah: { name: "Kofi Adjei", email: "", seed: "Kofi", bg: "#1c1c1e" },
  jess: { name: "Delmar Poole", email: "delmar@example.com", seed: "Delmar", bg: "linear-gradient(140deg,#34d399,#10b981)" },
  adamS: { name: "Marcus Reed", email: "marcus@example.com", seed: "Marcus", bg: "linear-gradient(140deg,#c4b5fd,#8b5cf6)" },
  matt: { name: "Tamara Cole", email: "tamara@example.com", seed: "Tamara", bg: "linear-gradient(140deg,#fca5a5,#ef4444)" },
  shawn: { name: "Omar Diaz", email: "omar@example.com", seed: "Omar", bg: "linear-gradient(140deg,#a3e635,#65a30d)" },
  adamM: { name: "Margo Hale", email: "margo@example.com", seed: "Margo", bg: "linear-gradient(140deg,#fb923c,#ef4444)" },
  amy: { name: "Amara Quinn", email: "amara@example.com", seed: "Amara", bg: "linear-gradient(140deg,#fde047,#a3e635)" },
};

const matchP = (p: Person, q: string) => {
  const s = q.toLowerCase();
  return p.name.toLowerCase().includes(s) || (p.email ?? "").toLowerCase().includes(s);
};

type SortDir = "asc" | "desc";
// Sort a list of `{ person }` rows by name in the given direction.
const byName = (dir: SortDir) => (a: { person: Person }, b: { person: Person }) =>
  a.person.name.localeCompare(b.person.name) * (dir === "asc" ? 1 : -1);

// Shared theme tokens.
const TXT = "text-neutral-900 dark:text-neutral-100"; // primary text
const SUB = "text-neutral-500"; // secondary text (reads on both)

/* ----------------------------- small helpers ---------------------------- */

function Avatar({ person, size = 30 }: { person: Person; size?: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{ width: size, height: size, background: person.bg }}
    >
      <img src={dice(person.seed)} alt="" className="h-full w-full object-cover" />
    </span>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i <= text.length) {
    const idx = lower.indexOf(needle, i);
    if (idx === -1) {
      out.push(<Fragment key={key++}>{text.slice(i)}</Fragment>);
      break;
    }
    if (idx > i) out.push(<Fragment key={key++}>{text.slice(i, idx)}</Fragment>);
    out.push(
      <mark
        key={key++}
        className="rounded-[3px] bg-[#F2C24B]/25 px-[1px] text-[#946200] dark:bg-[#F2C24B]/[0.16] dark:text-[#F4CE6A]"
      >
        {text.slice(idx, idx + needle.length)}
      </mark>
    );
    i = idx + needle.length;
  }
  return <>{out}</>;
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-black/10 bg-black/[0.03] px-1.5 font-sans text-[12px] font-medium text-neutral-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-neutral-400">
      {children}
    </kbd>
  );
}

function Label({ children, count, delay }: { children: ReactNode; count?: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25, ease: EASE }}
      className="flex items-center gap-1.5 px-3 pb-1.5 pt-3 text-[13px] text-neutral-500"
    >
      <span>{children}</span>
      {count != null && <span className="font-semibold text-neutral-700 dark:text-neutral-300">{count}</span>}
    </motion.div>
  );
}

function Meta({ icon, value }: { icon: ReactNode; value?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-neutral-500">
      {icon}
      {value != null && <span className="text-[13px] text-neutral-500 dark:text-neutral-400">{value}</span>}
    </span>
  );
}

// A selectable row. Shows the shared gliding highlight when active.
function Row({
  id,
  active,
  setActive,
  delay,
  children,
  className = "",
}: {
  id: string;
  active: string;
  setActive: (id: string) => void;
  delay: number;
  children: ReactNode;
  className?: string;
}) {
  const isActive = active === id;
  return (
    <motion.div
      data-row={id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28, ease: EASE }}
      onMouseEnter={() => setActive(id)}
      className={`relative rounded-lg ${className}`}
    >
      {isActive && (
        <motion.div
          layoutId="cmd-hl"
          transition={HL_SPRING}
          className="absolute inset-0 rounded-lg bg-black/[0.05] ring-1 ring-inset ring-black/[0.06] dark:bg-white/[0.06] dark:ring-white/[0.05]"
        />
      )}
      <div className="relative z-10 flex items-center gap-3 px-3 py-2">{children}</div>
    </motion.div>
  );
}

const iconBtn =
  "text-neutral-500 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200 active:scale-90";

function FileFaces({ people }: { people: Person[] }) {
  return (
    <span className="flex items-center">
      {people.map((p, i) => (
        <span
          key={p.seed}
          className="relative inline-flex h-[18px] w-[18px] items-center justify-center overflow-hidden rounded-full ring-2 ring-white dark:ring-[#0c0c0d]"
          style={{ background: p.bg, marginLeft: i === 0 ? 0 : -6, zIndex: people.length - i }}
        >
          <img src={dice(p.seed)} alt="" className="h-full w-full object-cover" />
        </span>
      ))}
    </span>
  );
}

/* -------------------------------- resting ------------------------------- */

type Filter = { id: string; label: string; icon: ReactNode };

const ALL_FILTERS: Filter[] = [
  { id: "reactions", label: "Reactions", icon: <HandWaving size={16} weight="fill" /> },
  { id: "people", label: "People", icon: <Users size={16} weight="fill" /> },
  { id: "companies", label: "Companies", icon: <Buildings size={16} weight="fill" /> },
  { id: "files", label: "Files", icon: <FileIcon size={16} weight="fill" /> },
  { id: "tasks", label: "Tasks", icon: <CheckSquare size={16} weight="fill" /> },
  { id: "notes", label: "Notes", icon: <NotePencil size={16} weight="fill" /> },
  { id: "collections", label: "Collections", icon: <FolderSimple size={16} weight="fill" /> },
  { id: "links", label: "Links", icon: <LinkSimple size={16} weight="bold" /> },
  { id: "reminders", label: "Reminders", icon: <Bell size={16} weight="fill" /> },
];
const DEFAULT_FILTER_IDS = ["reactions", "people", "companies"];

// The "More" chip: opens a menu of filters not yet added; picking one adds it.
// The menu is aligned under the chip but shifted to stay inside the panel.
const MORE_W = 190;
function MoreMenu({ available, onAdd }: { available: Filter[]; onAdd: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  useEffect(() => {
    if (!open) setHover(null);
  }, [open]);

  const toggle = () => {
    if (!open) {
      const btn = btnRef.current?.getBoundingClientRect();
      const panel = btnRef.current?.closest("[data-cmd]")?.getBoundingClientRect();
      if (btn && panel) {
        const pad = 12;
        // Prefer aligning the menu's left edge to the chip; clamp within panel.
        const clamped = Math.max(panel.left + pad, Math.min(btn.left, panel.right - pad - MORE_W));
        setLeft(clamped - btn.left);
      }
    }
    setOpen((o) => !o);
  };

  return (
    <motion.div ref={ref} layout className="relative" style={{ zIndex: open ? 40 : undefined }}>
      <motion.button
        ref={btnRef}
        whileTap={{ scale: 0.95 }}
        onClick={toggle}
        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 py-2 pl-3.5 pr-3 text-[14px] text-neutral-600 transition-colors hover:bg-black/[0.04] dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/[0.05]"
      >
        More
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-flex">
          <CaretDown size={13} weight="bold" className="text-neutral-500" />
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: EASE }}
            style={{ left, width: MORE_W }}
            className="absolute top-[calc(100%+6px)] z-40 origin-top overflow-hidden rounded-xl border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-[#232325]"
          >
            {available.length === 0 ? (
              <div className="px-2 py-2 text-[13px] text-neutral-400 dark:text-neutral-500">
                All filters added
              </div>
            ) : (
              available.map((f, i) => (
                <motion.button
                  key={f.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.18, ease: EASE }}
                  whileTap={{ scale: 0.97 }}
                  onMouseEnter={() => setHover(f.id)}
                  onClick={() => onAdd(f.id)}
                  className={`relative flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[14px] ${TXT}`}
                >
                  {hover === f.id && (
                    <motion.span
                      layoutId="more-hl"
                      transition={HL_SPRING}
                      className="absolute inset-0 rounded-lg bg-black/[0.05] dark:bg-white/[0.06]"
                    />
                  )}
                  <span className="relative z-10 text-neutral-500 dark:text-neutral-400">{f.icon}</span>
                  <span className="relative z-10">{f.label}</span>
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DefaultView({
  active,
  setActive,
  sortDir,
}: {
  active: string;
  setActive: (id: string) => void;
  sortDir: SortDir;
}) {
  const [activeIds, setActiveIds] = useState(DEFAULT_FILTER_IDS);
  const activeFilters = activeIds
    .map((id) => ALL_FILTERS.find((f) => f.id === id))
    .filter((f): f is Filter => Boolean(f));
  const available = ALL_FILTERS.filter((f) => !activeIds.includes(f.id));
  const isDefault =
    activeIds.length === DEFAULT_FILTER_IDS.length &&
    DEFAULT_FILTER_IDS.every((id) => activeIds.includes(id));
  let d = 0;
  const step = () => 0.03 + d++ * 0.022;

  const quick = [
    { id: "qa:task", label: "Create new task", k: "E" },
    { id: "qa:note", label: "Create note", k: "S" },
    { id: "qa:member", label: "Add member", k: "R" },
  ];

  const lastSearch = [
    {
      id: "ls:isla",
      person: P.jason,
      fire: false,
      note: null as string | null,
      meta: (
        <>
          <Meta icon={<CircleDashed size={16} />} value={2} />
          <ListPlus size={18} className="text-neutral-500" />
        </>
      ),
    },
    {
      id: "ls:rowan",
      person: P.rob,
      fire: false,
      note: null,
      meta: <ListPlus size={18} className="text-neutral-500" />,
    },
    {
      id: "ls:kofi",
      person: P.hannah,
      fire: true,
      note: "replied in thread",
      meta: (
        <>
          <Meta icon={<Chat size={16} />} value={6} />
          <ListPlus size={18} className="text-neutral-500" />
        </>
      ),
    },
  ].sort(byName(sortDir));

  return (
    <div className="pb-1">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="px-3 pb-1 pt-3 text-[13px] text-neutral-500"
      >
        I&apos;m looking for...
      </motion.div>
      <div className="flex flex-wrap items-center gap-2 px-3 py-1.5">
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {activeFilters.map((c) => (
              <motion.button
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveIds((cur) => cur.filter((x) => x !== c.id))}
                className={`inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] py-2 pl-3 pr-2.5 text-[14px] transition-colors hover:bg-black/[0.07] dark:border-white/10 dark:bg-white/[0.07] dark:hover:bg-white/[0.1] ${TXT}`}
              >
                <span className="text-neutral-500 dark:text-neutral-300">{c.icon}</span>
                {c.label}
                <span className="ml-0.5 inline-flex text-neutral-400 transition-colors hover:text-neutral-800 dark:hover:text-neutral-100">
                  <X size={15} weight="bold" />
                </span>
              </motion.button>
            ))}
            {!isDefault && (
              <motion.button
                key="reset"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveIds(DEFAULT_FILTER_IDS)}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-black/15 py-2 pl-3 pr-3.5 text-[14px] text-neutral-500 transition-colors hover:bg-black/[0.04] hover:text-neutral-800 dark:border-white/15 dark:text-neutral-400 dark:hover:bg-white/[0.05] dark:hover:text-neutral-200"
              >
                <Plus size={14} weight="bold" /> Reset
              </motion.button>
            )}
            <MoreMenu
              key="more"
              available={available}
              onAdd={(id) => setActiveIds((cur) => [...cur, id])}
            />
          </AnimatePresence>
        </LayoutGroup>
      </div>

      <Label count={3} delay={step()}>Last search</Label>
      <div className="px-1">
        {lastSearch.map((it) => (
          <Row key={it.id} id={it.id} active={active} setActive={setActive} delay={step()}>
            {it.fire ? (
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[#F97316] dark:bg-[#1c1c1e]">
                <Fire size={16} weight="fill" />
              </span>
            ) : (
              <Avatar person={it.person} />
            )}
            <span className={`min-w-0 flex-1 truncate text-[14px] ${TXT}`}>
              {it.person.name}
              {it.note ? (
                <span className="ml-1 text-neutral-500 dark:text-neutral-400">{it.note}</span>
              ) : it.person.email ? (
                <span className={`ml-2 hidden sm:inline ${SUB}`}>{it.person.email}</span>
              ) : null}
            </span>
            <span className="flex shrink-0 items-center gap-3">{it.meta}</span>
          </Row>
        ))}
      </div>

      <Label delay={step()}>Quick actions</Label>
      <div className="px-1">
        {quick.map((q) => (
          <Row key={q.id} id={q.id} active={active} setActive={setActive} delay={step()}>
            <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md bg-black/[0.04] text-neutral-600 dark:bg-white/[0.04] dark:text-neutral-300">
              <Plus size={16} />
            </span>
            <span className={`min-w-0 flex-1 truncate text-[14px] ${TXT}`}>{q.label}</span>
            <Kbd>{q.k}</Kbd>
          </Row>
        ))}
      </div>

      <Label count={1} delay={step()}>Files</Label>
      <div className="px-1">
        <Row id="file:invoice" active={active} setActive={setActive} delay={step()}>
          <FileIcon size={20} className="shrink-0 text-neutral-500 dark:text-neutral-400" />
          <span className={`min-w-0 flex-1 truncate text-[14px] ${TXT}`}>
            Invoice<span className={SUB}>.pdf</span>
            <span className="mx-2 text-neutral-400 dark:text-neutral-600">·</span>
            <Checks size={16} weight="bold" className="mb-0.5 mr-2 inline text-[#D99E1E] dark:text-[#F2C24B]" />
            <span className="inline-flex align-middle">
              <FileFaces people={[P.jess, P.rob]} />
            </span>
          </span>
          <button className="inline-flex shrink-0 items-center gap-1.5 text-[13px] text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
            <ArrowBendUpRight size={16} /> Share
          </button>
        </Row>
      </div>
    </div>
  );
}

/* -------------------------------- search -------------------------------- */

// Relational search data. A file or collection carries the people attached to
// it, and matches a query when the query hits its own text OR any of those
// people, so searching a user surfaces the files they are on and the
// collections they belong to, not just rows whose text happens to contain it.
const contains = (text: string, q: string) => text.toLowerCase().includes(q.toLowerCase());
const relMatch = (text: string, people: string[], q: string) =>
  contains(text, q) || people.some((n) => contains(n, q));

const MEMBERS: { person: Person; meta: ReactNode }[] = [
  { person: P.jess, meta: <Meta icon={<CircleDashed size={16} />} value={2} /> },
  { person: P.adamS, meta: null },
  { person: P.matt, meta: <Meta icon={<CircleDashed size={16} />} value={5} /> },
  { person: P.shawn, meta: <Meta icon={<CircleDashed size={16} />} value={3} /> },
];

const FILES: { name: string; read: boolean; faces: Person[]; people: string[] }[] = [
  { name: "Marcus`s Invoice 1", read: true, faces: [P.matt, P.jess], people: ["Marcus Reed", "Tamara Cole", "Delmar Poole"] },
  { name: "Marcus`s Invoice 2", read: false, faces: [], people: ["Marcus Reed"] },
];

const REACTIONS: { person: Person }[] = [{ person: P.adamS }];

type Collection = {
  name: string;
  accent: boolean;
  branch: number | null;
  groups: { label: string; names: string[]; count: number }[];
  people: string[];
};
const COLLECTIONS: Collection[] = [
  {
    name: "Clients",
    accent: true,
    branch: 4,
    groups: [
      { label: "Paid", names: ["Marcus Reed", "Bella Innes", "Otis Kwan"], count: 16 },
      { label: "Free", names: ["Amara Lund", "Scott Vale", "Tamara Cole", "Margo Hale", "Jeff Rhodes"], count: 21 },
    ],
    people: [],
  },
  { name: "Toolkit", accent: false, branch: 2, groups: [], people: ["Marcus Reed", "Omar Diaz"] },
  { name: "Big ideas", accent: false, branch: null, groups: [], people: ["Margo Hale", "Amara Quinn"] },
  { name: "New hires", accent: false, branch: 14, groups: [], people: ["Tamara Cole", "Amara Quinn"] },
];
const collectionPeople = (c: Collection) => [...c.groups.flatMap((g) => g.names), ...c.people];

const filterMembers = (q: string, dir: SortDir) =>
  MEMBERS.filter((m) => matchP(m.person, q)).sort(byName(dir));
const filterFiles = (q: string) => FILES.filter((f) => relMatch(f.name, f.people, q));
const filterReactions = (q: string) => REACTIONS.filter((r) => matchP(r.person, q));
const filterCollections = (q: string) =>
  COLLECTIONS.filter((c) => relMatch(c.name, collectionPeople(c), q));

function SearchView({
  q,
  active,
  setActive,
  sortDir,
}: {
  q: string;
  active: string;
  setActive: (id: string) => void;
  sortDir: SortDir;
}) {
  let d = 0;
  const step = () => 0.02 + d++ * 0.02;

  const members = filterMembers(q, sortDir);
  const files = filterFiles(q);
  const reactions = filterReactions(q);
  const collections = filterCollections(q);

  return (
    <div className="pb-1">
      {members.length > 0 && (
        <>
          <Label count={members.length} delay={step()}>Members</Label>
          <div className="px-1">
            {members.map(({ person, meta }) => (
              <Row key={person.name} id={`mem:${person.name}`} active={active} setActive={setActive} delay={step()}>
                <Avatar person={person} />
                <span className={`min-w-0 flex-1 truncate text-[14px] ${TXT}`}>
                  <Highlight text={person.name} q={q} />
                  {person.email && (
                    <span className={`ml-2 hidden sm:inline ${SUB}`}>
                      <Highlight text={person.email} q={q} />
                    </span>
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  {meta}
                  <ListPlus size={18} className="text-neutral-500" />
                </span>
              </Row>
            ))}
          </div>
        </>
      )}

      {files.length > 0 && (
        <>
          <Label count={files.length} delay={step()}>Files</Label>
          <div className="px-1">
            {files.map((f) => (
              <Row key={f.name} id={`file:${f.name}`} active={active} setActive={setActive} delay={step()}>
                <FileIcon size={20} className="shrink-0 text-neutral-500 dark:text-neutral-400" />
                <span className={`min-w-0 flex-1 truncate text-[14px] ${TXT}`}>
                  <Highlight text={f.name} q={q} />
                  <span className={SUB}>.pdf</span>
                  <span className="mx-2 text-neutral-400 dark:text-neutral-600">·</span>
                  <Checks
                    size={16}
                    weight="bold"
                    className={`mb-0.5 inline ${f.read ? "text-[#D99E1E] dark:text-[#F2C24B]" : "text-neutral-400 dark:text-neutral-500"}`}
                  />
                  {f.faces.length > 0 && (
                    <span className="ml-2 inline-flex align-middle">
                      <FileFaces people={f.faces} />
                    </span>
                  )}
                </span>
                <ArrowBendUpRight size={16} className="shrink-0 text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200" />
              </Row>
            ))}
          </div>
        </>
      )}

      {reactions.length > 0 && (
        <>
          <Label count={reactions.length} delay={step()}>Reactions</Label>
          <div className="px-1">
            {reactions.map(({ person }) => (
              <Row key={person.name} id={`rx:${person.name}`} active={active} setActive={setActive} delay={step()}>
                <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md bg-[#22c55e] text-white">
                  <Check size={15} weight="bold" />
                </span>
                <span className={`min-w-0 flex-1 truncate text-[14px] ${TXT}`}>
                  <Highlight text={person.name} q={q} /> <span className="text-neutral-500 dark:text-neutral-400">replied in thread</span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <Meta icon={<Chat size={16} />} value={2} />
                  <ListPlus size={18} className="text-neutral-500" />
                </span>
              </Row>
            ))}
          </div>
        </>
      )}

      {collections.length > 0 && (
        <>
      <Label count={collections.length} delay={step()}>Collections</Label>
      <div className="px-1">
        {collections.map((c) => (
          <div key={c.name}>
            <Row id={`col:${c.name}`} active={active} setActive={setActive} delay={step()}>
              <span
                className={`h-[18px] w-[18px] shrink-0 rounded-[6px] ${c.accent ? "" : "bg-neutral-300 dark:bg-[#3a3a3d]"}`}
                style={c.accent ? { border: `2px solid ${AMBER}` } : undefined}
              />
              <span className={`min-w-0 flex-1 truncate text-[14px] ${TXT}`}>{c.name}</span>
              <span className="flex shrink-0 items-center gap-3">
                {c.branch != null && <Meta icon={<TreeStructure size={16} />} value={c.branch} />}
                <ListPlus size={18} className="text-neutral-500" />
              </span>
            </Row>

            {c.groups.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3, ease: EASE }}
                className="ml-[19px] mt-0.5 overflow-hidden pb-1"
              >
                {c.groups.map((g) => (
                  <div key={g.label} className="relative flex items-center gap-2 py-1.5 pl-6 pr-3">
                    <span className="absolute left-0 top-0 h-1/2 w-px bg-black/15 dark:bg-white/15" />
                    <span className="absolute bottom-0 left-0 top-1/2 w-px bg-black/15 dark:bg-white/15" />
                    <span className="absolute left-0 top-1/2 h-px w-4 bg-black/15 dark:bg-white/15" />
                    <span className="shrink-0 text-[14px] font-medium text-neutral-800 dark:text-neutral-200">{g.label}</span>
                    <span className="min-w-0 flex-1 truncate text-[14px] text-neutral-500 dark:text-neutral-400">
                      {g.names.map((n, i) => (
                        <Fragment key={n}>
                          <Highlight text={n} q={q} />
                          {i < g.names.length - 1 ? ", " : "…"}
                        </Fragment>
                      ))}
                    </span>
                    <span className="shrink-0 text-[13px] text-neutral-500 dark:text-neutral-400">{g.count}</span>
                  </div>
                ))}
                <div className="relative py-1 pl-6">
                  <span className="absolute left-0 top-0 h-1/2 w-px bg-black/15 dark:bg-white/15" />
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-black/15 dark:bg-white/15" />
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    className="inline-flex h-6 items-center rounded-md bg-black/[0.05] px-2 text-neutral-500 transition-colors hover:bg-black/[0.1] hover:text-neutral-800 dark:bg-white/[0.06] dark:text-neutral-400 dark:hover:bg-white/[0.1] dark:hover:text-neutral-200"
                  >
                    <span className="-mt-1 text-[16px] leading-none">…</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------ mention popover ------------------------- */

function MentionPopover({ q, onPick }: { q: string; onPick: (name: string) => void }) {
  const suggestions = [P.adamM, P.amy].filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const [hover, setHover] = useState<string | null>(null);
  if (suggestions.length === 0) return null;
  // Default the glide to the first row; fall back if a stale hover drops out.
  const activeName =
    hover && suggestions.some((s) => s.name === hover) ? hover : suggestions[0]?.name;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.2, ease: EASE }}
      className="absolute left-0 top-[calc(100%+8px)] z-30 w-[248px] origin-top overflow-hidden rounded-xl border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-[#232325]"
    >
      {suggestions.map((p, i) => (
        <motion.button
          key={p.name}
          type="button"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 + i * 0.05, duration: 0.2, ease: EASE }}
          onMouseEnter={() => setHover(p.name)}
          onClick={() => onPick(p.name)}
          className="relative flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left"
        >
          {activeName === p.name && (
            <motion.span
              layoutId="mention-hl"
              transition={HL_SPRING}
              className="absolute inset-0 rounded-lg bg-black/[0.05] dark:bg-white/[0.06]"
            />
          )}
          <span className="relative z-10">
            <Avatar person={p} size={24} />
          </span>
          <span className={`relative z-10 text-[14px] ${TXT}`}>
            <Highlight text={p.name} q={q} />
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

/* -------------------------------- shell --------------------------------- */

export default function CommandSearch() {
  const [raw, setRaw] = useState("");
  // The panel starts as just the search bar; it opens on focus/click and closes
  // on an outside click (a query keeps it open).
  const [open, setOpen] = useState(false);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // True while the cursor is over this demo, so ⌘F only hijacks Find here.
  const hoveredRef = useRef(false);
  const q = useMemo(() => raw.replace(/^@/, "").trim(), [raw]);
  const searching = raw.trim().length > 0;
  const isMention = raw.trimStart().startsWith("@");
  const expanded = open || searching;

  // Ordered ids of the selectable rows in the current view (for arrow keys).
  // The people portions follow the same sort as the display.
  const navItems = useMemo(() => {
    if (!searching) {
      const last = [
        { id: "ls:isla", person: P.jason },
        { id: "ls:rowan", person: P.rob },
        { id: "ls:kofi", person: P.hannah },
      ].sort(byName(sortDir));
      return [...last.map((l) => l.id), "qa:task", "qa:note", "qa:member", "file:invoice"];
    }
    const ids: string[] = [];
    filterMembers(q, sortDir).forEach((m) => ids.push(`mem:${m.person.name}`));
    filterFiles(q).forEach((f) => ids.push(`file:${f.name}`));
    filterReactions(q).forEach((r) => ids.push(`rx:${r.person.name}`));
    filterCollections(q).forEach((c) => ids.push(`col:${c.name}`));
    return ids;
  }, [searching, q, sortDir]);

  const [active, setActive] = useState("ls:kofi");

  // Keep the selection sensible when the view or result set changes.
  useEffect(() => {
    setActive((cur) => (navItems.includes(cur) ? cur : navItems[0] ?? ""));
  }, [navItems]);

  // Close the panel when clicking outside of it.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // ⌘F / Ctrl+F opens and focuses the palette, but only while the cursor is
  // over this demo, so the browser's Find keeps working everywhere else.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f" && hoveredRef.current) {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const idx = navItems.indexOf(active);
      const start = idx < 0 ? 0 : idx;
      const next =
        e.key === "ArrowDown"
          ? Math.min(navItems.length - 1, start + 1)
          : Math.max(0, start - 1);
      setActive(navItems[next]);
      inputRef.current
        ?.closest("[data-cmd]")
        ?.querySelector(`[data-row="${CSS.escape(navItems[next])}"]`)
        ?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (raw) setRaw("");
      else {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
  };

  return (
    <div
      onMouseEnter={() => (hoveredRef.current = true)}
      onMouseLeave={() => (hoveredRef.current = false)}
      className="flex h-full w-full items-center justify-center bg-[#ececec] p-4 transition-colors sm:p-8 dark:bg-[#2e2e2e]"
    >
      <motion.div
        ref={panelRef}
        data-cmd
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="w-full max-w-[600px] overflow-hidden rounded-[12px] border border-black/[0.08] bg-gradient-to-b from-white to-[#f6f6f7] ring-1 ring-inset ring-black/[0.04] dark:border-white/[0.08] dark:from-[#111112] dark:to-[#0b0b0c] dark:ring-white/[0.04]"
      >
        {/* Search header */}
        <div
          onClick={() => inputRef.current?.focus()}
          className={`flex items-center gap-3 border-b px-4 py-3.5 transition-colors ${
            expanded ? "border-black/[0.08] dark:border-white/[0.08]" : "border-transparent"
          }`}
        >
          <MagnifyingGlass size={20} className="shrink-0 text-neutral-500" />
          <div className="relative min-w-0 flex-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-pre text-[15px]"
            >
              {raw ? (
                <motion.span
                  key={isMention ? "mention" : "plain"}
                  initial={{ scale: 0.9, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className={
                    isMention
                      ? "rounded-md bg-[#F2C24B]/25 px-1 text-[#946200] dark:bg-[#F2C24B]/[0.14] dark:text-[#F4CE6A]"
                      : TXT
                  }
                >
                  {raw}
                </motion.span>
              ) : (
                <span className="text-neutral-500">Search for actions, people, instruments</span>
              )}
            </div>
            <input
              ref={inputRef}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setOpen(true)}
              spellCheck={false}
              aria-label="Search"
              className="w-full bg-transparent text-[15px] text-transparent caret-[#D99E1E] outline-none dark:caret-[#F2C24B]"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <AnimatePresence>
              {searching && (
                <motion.button
                  key="clear"
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  onClick={() => {
                    setRaw("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear"
                  className={iconBtn}
                >
                  <XCircle size={20} weight="fill" />
                </motion.button>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              aria-label={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
              title={sortDir === "asc" ? "Sort A to Z" : "Sort Z to A"}
              className={iconBtn}
            >
              {sortDir === "asc" ? <SortAscending size={20} /> : <SortDescending size={20} />}
            </button>
            <Kbd>⌘F</Kbd>
          </div>
        </div>

        {/* Body: revealed once the bar is focused or a query is typed. */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0, y: -6 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -6 }}
              transition={{
                height: { duration: 0.34, ease: EASE },
                opacity: { duration: 0.22, ease: EASE },
                y: { duration: 0.34, ease: EASE },
              }}
              className="relative overflow-hidden"
            >
              <div className="absolute left-4 right-4 top-0 z-20">
                <AnimatePresence>
                  {isMention && searching && (
                    <MentionPopover
                      q={q}
                      onPick={(name) => {
                        setRaw(name);
                        setOpen(true);
                        inputRef.current?.focus();
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
              <LayoutGroup>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={searching ? "search" : "rest"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14 }}
                  >
                    {searching ? (
                      <SearchView q={q} active={active} setActive={setActive} sortDir={sortDir} />
                    ) : (
                      <DefaultView active={active} setActive={setActive} sortDir={sortDir} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </LayoutGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
