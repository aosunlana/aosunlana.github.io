"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { FileXls, FilePdf, PenNib, FileDoc, Images, Note, Check, Archive, Trash, ArrowCounterClockwise, type Icon as PhosphorIcon } from "@phosphor-icons/react";

/* --------------------------------------------------------------------------
 * A multi-select list. Select rows, a floating bar rises with the actions, and
 * delete throws the selected rows into the trash: each one is measured, removed
 * from the data so the list closes up, and a clone of it flies on top into the
 * trash lid. Undo brings them back to their exact spots. It is real selection
 * state, not a replay. With reduced motion the rows just fade and collapse, and
 * selection, delete, and undo all still work. All mock.
 * ------------------------------------------------------------------------ */

const ACCENT = "#4f6ef2";

type Kind = "sheet" | "pdf" | "design" | "doc" | "image" | "note";
type Item = { id: string; title: string; sub: string; kind: Kind; color: string };

const KIND_ICON: Record<Kind, PhosphorIcon> = { sheet: FileXls, pdf: FilePdf, design: PenNib, doc: FileDoc, image: Images, note: Note };

const INITIAL: Item[] = [
  { id: "f1", title: "Q3 revenue model", sub: "Spreadsheet · 2.4 MB", kind: "sheet", color: "#16A34A" },
  { id: "f2", title: "Brand guidelines", sub: "PDF · 8.1 MB", kind: "pdf", color: "#E11D48" },
  { id: "f3", title: "Onboarding flow", sub: "Figma · Edited 2 days ago", kind: "design", color: "#7C3AED" },
  { id: "f4", title: "Launch checklist", sub: "Doc · Edited yesterday", kind: "doc", color: "#3B82F6" },
  { id: "f5", title: "Team offsite photos", sub: "Album · 48 items", kind: "image", color: "#F59E0B" },
  { id: "f6", title: "API keys", sub: "Note · Edited 5 days ago", kind: "note", color: "#64748B" },
  { id: "f7", title: "Contract v3", sub: "PDF · 1.2 MB", kind: "pdf", color: "#0EA5E9" },
];

type Rect = { top: number; left: number; width: number; height: number };
type Removed = { item: Item; index: number; rect: Rect };
type Clone = { key: string; item: Item; rect: Rect; dx: number; dy: number; dir: number };


export default function SelectDelete() {
  const reduce = useReducedMotion();
  const [items, setItems] = useState<Item[]>(INITIAL);
  const [archived, setArchived] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [clones, setClones] = useState<Clone[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [undo, setUndo] = useState<{ removed: Removed[]; count: number } | null>(null);
  const [undoActive, setUndoActive] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [focusIdx, setFocusIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  const rowEls = useRef<Record<string, HTMLLIElement | null>>({});
  const trashRef = useRef<HTMLSpanElement>(null);
  const anchor = useRef<number | null>(null);
  const landed = useRef(0);
  const pendingRemoved = useRef<Removed[] | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const undoLeft = useRef(6000);
  const undoStart = useRef(0);
  const undoBtn = useRef<HTMLButtonElement>(null);

  const lid = useAnimationControls();
  const body = useAnimationControls();

  useEffect(() => setMounted(true), []);
  useEffect(() => () => clearTimeout(undoTimer.current), []);

  const startUndoTimer = useCallback(() => {
    setUndoActive(true);
    undoLeft.current = 6000;
    undoStart.current = performance.now();
    clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => {
      setUndoActive(false);
      setUndo(null);
    }, 6000);
  }, []);
  const pauseUndo = () => {
    if (!undoActive) return;
    clearTimeout(undoTimer.current);
    undoLeft.current -= performance.now() - undoStart.current;
  };
  const resumeUndo = () => {
    if (!undoActive) return;
    undoStart.current = performance.now();
    undoTimer.current = setTimeout(() => {
      setUndoActive(false);
      setUndo(null);
    }, Math.max(0, undoLeft.current));
  };

  const clearSel = useCallback(() => {
    setSelected(new Set());
    setAnnounce("Selection cleared");
  }, []);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      setAnnounce(n.size === 0 ? "Selection cleared" : `${n.size} selected`);
      return n;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(items.map((i) => i.id)));
    setAnnounce(`${items.length} selected`);
  }, [items]);

  const onRowClick = (e: ReactMouseEvent, idx: number) => {
    const id = items[idx].id;
    if (e.shiftKey && anchor.current != null) {
      const [a, b] = anchor.current < idx ? [anchor.current, idx] : [idx, anchor.current];
      const range = items.slice(a, b + 1).map((x) => x.id);
      setSelected((prev) => {
        const n = new Set(prev);
        range.forEach((r) => n.add(r));
        setAnnounce(`${n.size} selected`);
        return n;
      });
    } else {
      toggle(id);
      anchor.current = idx;
    }
    setFocusIdx(idx);
  };

  const restore = useCallback(() => {
    const u = undo;
    if (!u) return;
    // Idempotent insert: splice each removed item back at its index, but skip any
    // id already present. Keeps a double-invoked call (StrictMode) from duplicating.
    setItems((cur) => {
      const copy = [...cur];
      [...u.removed]
        .sort((a, b) => a.index - b.index)
        .forEach((r) => {
          if (!copy.some((c) => c.id === r.item.id)) copy.splice(Math.min(r.index, copy.length), 0, r.item);
        });
      return copy;
    });
    setAnnounce(`${u.count} ${u.count === 1 ? "item" : "items"} restored`);
    setUndo(null);
    clearTimeout(undoTimer.current);
    setUndoActive(false);
  }, [undo]);

  const doDelete = useCallback(() => {
    if (deleting || selected.size === 0) return;
    // 1. Snapshot each selected row's rect (measured now, in case layout shifted).
    const removed: Removed[] = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => selected.has(item.id))
      .map(({ item, index }) => {
        const el = rowEls.current[item.id];
        const r = el?.getBoundingClientRect();
        return { item, index, rect: r ? { top: r.top, left: r.left, width: r.width, height: r.height } : { top: 0, left: 0, width: 0, height: 0 } };
      });
    if (removed.length === 0) return;
    pendingRemoved.current = removed;
    const count = removed.length;

    // 2. Remove from the data so the remaining rows reflow up.
    setItems((cur) => cur.filter((i) => !selected.has(i.id)));
    setAnnounce(`${count} ${count === 1 ? "item" : "items"} deleted`);

    if (reduce) {
      setSelected(new Set());
      setUndo({ removed, count });
      startUndoTimer();
      return;
    }

    // 3. Compute the trash target and fly a clone of each row into it.
    const tr = trashRef.current?.getBoundingClientRect();
    const tx = tr ? tr.left + tr.width / 2 : window.innerWidth / 2;
    const ty = tr ? tr.top + tr.height / 2 : window.innerHeight - 60;
    const flying: Clone[] = removed.map((r, i) => {
      const cx = r.rect.left + r.rect.width / 2;
      const cy = r.rect.top + r.rect.height / 2;
      return { key: r.item.id, item: r.item, rect: r.rect, dx: tx - cx, dy: ty - cy, dir: i % 2 === 0 ? 1 : -1 };
    });
    setDeleting(true);
    landed.current = 0;
    setClones(flying);
    lid.start({ rotate: -34, y: -2, transition: { duration: 0.18, ease: "easeOut" } }); // 4. open lid
  }, [deleting, selected, items, reduce, startUndoTimer, lid]);

  const onCloneLanded = (total: number) => {
    landed.current += 1;
    body.start({ scale: [1, 1.14, 1], transition: { duration: 0.22, ease: "easeOut" } }); // 6. pop as each lands
    if (landed.current >= total) {
      lid.start({ rotate: [-34, 6, 0], y: 0, transition: { duration: 0.32, ease: "easeOut" } }); // close with a settle
      setDeleting(false);
      setClones([]); // 7. unmount clones; list already reflowed
      const snapshot = pendingRemoved.current;
      setSelected(new Set()); // 8. clear selection, bar leaves
      if (snapshot) {
        setUndo({ removed: snapshot, count: snapshot.length });
        startUndoTimer();
      }
    }
  };

  const doArchive = useCallback(() => {
    if (deleting || selected.size === 0) return;
    const moving = items.filter((i) => selected.has(i.id));
    setArchived((a) => [...moving, ...a]);
    setItems((cur) => cur.filter((i) => !selected.has(i.id)));
    setSelected(new Set());
    setAnnounce(`${moving.length} ${moving.length === 1 ? "item" : "items"} archived`);
  }, [deleting, selected, items]);

  const unarchive = useCallback(() => {
    setArchived((a) => {
      if (a.length) {
        setItems((cur) => [...a, ...cur]);
        setAnnounce(`${a.length} ${a.length === 1 ? "item" : "items"} unarchived`);
      }
      return [];
    });
  }, []);

  // Focus the undo control when it appears so a keyboard user lands somewhere sensible.
  useEffect(() => {
    if (undo) undoBtn.current?.focus();
  }, [undo]);

  const onListKeyDown = (e: ReactKeyboardEvent<HTMLUListElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a") {
      e.preventDefault();
      selectAll();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
      if (undo) {
        e.preventDefault();
        restore();
      }
      return;
    }
    if (e.key === "Escape") {
      clearSel();
      return;
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      if (selected.size > 0) {
        e.preventDefault();
        doDelete();
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = e.key === "ArrowDown" ? Math.min(items.length - 1, focusIdx + 1) : Math.max(0, focusIdx - 1);
      setFocusIdx(next);
      rowEls.current[items[next]?.id]?.focus();
      if (e.shiftKey && items[next]) {
        setSelected((prev) => {
          const n = new Set(prev);
          n.add(items[next].id);
          n.add(items[focusIdx].id);
          setAnnounce(`${n.size} selected`);
          return n;
        });
      }
    }
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (items[focusIdx]) {
        toggle(items[focusIdx].id);
        anchor.current = focusIdx;
      }
    }
  };

  const count = selected.size;
  const allSelected = count > 0 && count === items.length;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#eceef1] p-4 sm:p-6 dark:bg-[#141416]"
      onClick={(e) => {
        if (e.target === e.currentTarget && count > 0) clearSel();
      }}
    >
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="mb-2 flex items-baseline justify-between px-1">
          <h2 className="text-[14px] font-semibold text-neutral-900 dark:text-white">Files</h2>
          <span className="text-[12px] text-neutral-400">{items.length} {items.length === 1 ? "item" : "items"}</span>
        </div>

        {/* List */}
        <ul
          role="listbox"
          aria-multiselectable="true"
          aria-label="Files"
          onKeyDown={onListKeyDown}
          className="relative min-h-[64px] rounded-2xl border border-black/[0.06] bg-white p-1.5 dark:border-white/[0.07] dark:bg-[#1c1c1f]"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((it, idx) => {
              const sel = selected.has(it.id);
              const Icon = KIND_ICON[it.kind];
              return (
                <motion.li
                  key={it.id}
                  ref={(el) => {
                    rowEls.current[it.id] = el;
                  }}
                  role="option"
                  aria-selected={sel}
                  tabIndex={focusIdx === idx ? 0 : -1}
                  layout={reduce ? false : "position"}
                  initial={reduce ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0, height: 0, marginTop: 0, transition: { duration: 0.18 } } : { opacity: 0, transition: { duration: 0 } }}
                  transition={{ layout: { type: "spring", stiffness: 360, damping: 34, mass: 0.9 }, default: { duration: 0.18 } }}
                  onClick={(e) => onRowClick(e, idx)}
                  onFocus={() => setFocusIdx(idx)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 outline-none transition-colors ${
                    sel ? "bg-[#4f6ef2]/[0.09] ring-1 ring-inset ring-[#4f6ef2]/40" : "hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      sel ? "border-transparent" : "border-neutral-300 dark:border-neutral-600"
                    }`}
                    style={sel ? { backgroundColor: ACCENT } : undefined}
                  >
                    {sel && <Check size={12} weight="bold" className="text-white" />}
                  </span>
                  <RowIcon Icon={Icon} color={it.color} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium text-neutral-900 dark:text-white">{it.title}</span>
                    <span className="block truncate text-[12px] text-neutral-500 dark:text-neutral-400">{it.sub}</span>
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>

          {items.length === 0 && !deleting && (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <Trash size={22} className="mb-2 text-neutral-300 dark:text-neutral-600" />
              <p className="text-[13.5px] font-medium text-neutral-500 dark:text-neutral-400">Nothing here</p>
              <p className="mt-0.5 text-[12px] text-neutral-400">Every file has been cleared out.</p>
            </div>
          )}
        </ul>

        {/* Archived footer */}
        {archived.length > 0 && (
          <div className="mt-2 flex items-center justify-between px-1 text-[12px] text-neutral-400">
            <span>
              {archived.length} archived
            </span>
            <button type="button" onClick={unarchive} className="font-medium text-neutral-500 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200">
              Unarchive
            </button>
          </div>
        )}
      </div>

      {/* Floating action bar + undo bar */}
      <div className="pointer-events-none absolute bottom-24 left-1/2 z-30 -translate-x-1/2">
        <AnimatePresence mode="popLayout">
          {count > 0 && (
            <motion.div
              key="bar"
              role="toolbar"
              aria-label="Selection actions"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 520, damping: 40 }}
              className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-2 py-1.5 shadow-[0_8px_28px_-8px_rgba(20,20,45,0.35)] dark:border-white/[0.1] dark:bg-[#232325]"
            >
              <span className="flex items-center gap-1.5 pl-1.5 pr-1 text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">
                <span className="flex h-4 w-4 items-center justify-center rounded-full text-white" style={{ backgroundColor: ACCENT }}>
                  <Check size={10} weight="bold" />
                </span>
                {count} selected
              </span>
              <button
                type="button"
                onClick={allSelected ? clearSel : selectAll}
                className="rounded-full px-2 py-1 text-[12.5px] font-medium text-neutral-500 transition-colors hover:bg-black/[0.04] hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:hover:text-neutral-200"
              >
                {allSelected ? "Clear" : "Select all"}
              </button>
              <span className="mx-0.5 h-5 w-px bg-black/[0.08] dark:bg-white/[0.12]" />
              <button
                type="button"
                onClick={doArchive}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12.5px] font-medium text-neutral-700 transition-colors hover:bg-black/[0.04] disabled:opacity-50 dark:text-neutral-200 dark:hover:bg-white/[0.06]"
              >
                <Archive size={15} weight="bold" />
                Archive
              </button>
              <button
                type="button"
                onClick={doDelete}
                disabled={deleting}
                aria-label={`Delete ${count} selected`}
                className="flex items-center gap-1.5 rounded-full bg-rose-500/[0.12] px-2.5 py-1.5 text-[12.5px] font-semibold text-rose-600 transition-colors hover:bg-rose-500/[0.2] disabled:opacity-50 dark:text-rose-400"
              >
                <span ref={trashRef} className="inline-flex">
                  <TrashIcon lid={lid} body={body} />
                </span>
                Delete
              </button>
            </motion.div>
          )}

          {undo && count === 0 && (
            <motion.div
              key="undo"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 520, damping: 40 }}
              onMouseEnter={pauseUndo}
              onMouseLeave={resumeUndo}
              className="pointer-events-auto flex items-center gap-3 rounded-full border border-black/[0.06] bg-white px-3 py-2 shadow-[0_8px_28px_-8px_rgba(20,20,45,0.35)] dark:border-white/[0.1] dark:bg-[#232325]"
            >
              <span className="whitespace-nowrap pl-1 text-[13px] font-medium text-neutral-800 dark:text-neutral-100">
                {undo.count} {undo.count === 1 ? "item" : "items"} deleted
              </span>
              <button
                ref={undoBtn}
                type="button"
                onClick={restore}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#4f6ef2] px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#4560e0]"
              >
                <ArrowCounterClockwise size={13} weight="bold" />
                Undo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Flying clones, portalled above everything */}
      {mounted &&
        clones.length > 0 &&
        createPortal(
          <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
            {clones.map((c, i) => (
              <motion.div
                key={c.key}
                style={{ position: "fixed", top: c.rect.top, left: c.rect.left, width: c.rect.width, height: c.rect.height, willChange: "transform, opacity" }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                animate={{ x: [0, 0, c.dx], y: [0, -16, c.dy], scale: [1, 1.03, 0.14], opacity: [1, 1, 1, 0.04], rotate: [0, c.dir * -2, c.dir * 14] }}
                transition={{
                  duration: 0.72,
                  delay: i * 0.06,
                  times: [0, 0.24, 1],
                  x: { ease: ["easeOut", "easeIn"] },
                  y: { ease: ["easeOut", "easeIn"] },
                  scale: { ease: ["easeOut", "easeIn"] },
                  rotate: { ease: ["easeOut", "easeIn"] },
                  opacity: { times: [0, 0.24, 0.82, 1], ease: "linear" },
                }}
                onAnimationComplete={() => onCloneLanded(clones.length)}
              >
                <div className="flex h-full items-center gap-3 rounded-xl bg-white px-2.5 shadow-[0_10px_30px_-12px_rgba(20,20,45,0.4)] ring-1 ring-[#4f6ef2]/40 dark:bg-[#232325]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: ACCENT }}>
                    <Check size={12} weight="bold" className="text-white" />
                  </span>
                  <RowIcon Icon={KIND_ICON[c.item.kind]} color={c.item.color} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium text-neutral-900 dark:text-white">{c.item.title}</span>
                    <span className="block truncate text-[12px] text-neutral-500 dark:text-neutral-400">{c.item.sub}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>,
          document.body
        )}

      <p aria-live="polite" role="status" className="sr-only">
        {announce}
      </p>
    </div>
  );
}

function RowIcon({ Icon, color }: { Icon: PhosphorIcon; color: string }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}1f`, color }}>
      <Icon size={17} weight="fill" />
    </span>
  );
}

function TrashIcon({ lid, body }: { lid: ReturnType<typeof useAnimationControls>; body: ReturnType<typeof useAnimationControls> }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" className="text-current">
      <motion.g animate={lid} style={{ transformBox: "fill-box", transformOrigin: "100% 100%" }}>
        <rect x="4" y="5" width="16" height="2.4" rx="1.2" fill="currentColor" />
        <rect x="9.4" y="2.6" width="5.2" height="2.2" rx="1.1" fill="currentColor" />
      </motion.g>
      <motion.g animate={body} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
        <path d="M6.2 8.4h11.6l-.9 11.3a2 2 0 0 1-2 1.8H9.1a2 2 0 0 1-2-1.8L6.2 8.4Z" fill="currentColor" fillOpacity="0.9" />
      </motion.g>
    </svg>
  );
}
