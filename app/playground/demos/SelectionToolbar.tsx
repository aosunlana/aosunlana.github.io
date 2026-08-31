"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  Sparkle,
  CaretDown,
  DotsThreeVertical,
  Check,
} from "@phosphor-icons/react";

/* --------------------------------------------------------------------------
 * A floating formatting toolbar over a contenteditable. Select any run of text
 * and a bar floats in just above the selection; the controls format the real
 * selection and reflect its current state. It is a small rich text editor: the
 * bar is positioned off the live selection rectangle, and formatting is applied
 * with the document commands plus managed style spans for size, weight, family
 * and color. Selection is preserved across commands so several formats can be
 * applied without reselecting. Theme aware, keyboard driven, reduced motion safe.
 * ------------------------------------------------------------------------ */

const MOD = typeof navigator !== "undefined" && /Mac|iP/.test(navigator.platform) ? "⌘" : "Ctrl";

const WEIGHTS = [
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "700" },
];
const SIZES = ["14px", "16px", "18px", "20px", "24px"];
const SWATCHES = ["#111827", "#2f6bff", "#12b76a", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
// Soft highlighter tints, plus a clear.
const HIGHLIGHTS = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fbcfe8", "#ddd6fe", "#fed7aa"];

type Active = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  left: boolean;
  center: boolean;
  right: boolean;
};
const EMPTY: Active = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  left: false,
  center: false,
  right: false,
};

const stop = (e: React.MouseEvent) => e.preventDefault(); // keep focus + selection in the editor

// "fontSize" -> "font-size", so style.removeProperty can clear it by name.
const camelToKebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

// A slightly tight leading for resized runs so an enlarged word does not blow
// out its line and break the paragraph's even rhythm, while staying clear of
// clipping across the offered range.
const SIZE_LEADING = "1.35";

export default function SelectionToolbar() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState<{ cx: number; top: number; bottom: number } | null>(null);
  const [box, setBox] = useState<{ left: number; top: number } | null>(null);
  const [active, setActive] = useState<Active>(EMPTY);
  const [weight, setWeight] = useState("Regular");
  const [size, setSize] = useState("16px");
  const [askNote, setAskNote] = useState(false);
  const more = usePopover(); // overflow menu on small screens

  // Prefer CSS-producing commands so bold and friends stay inspectable.
  useEffect(() => {
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {
      // Older engines fall back to element based formatting; still toggles fine.
    }
  }, []);

  // Read the live selection: if it is a non-empty range inside the editor, anchor
  // the bar to its rectangle and refresh the active formatting state.
  const update = useCallback(() => {
    const editor = editorRef.current;
    const wrap = wrapRef.current;
    if (!editor || !wrap) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setVisible(false);
      return;
    }
    const range = sel.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) {
      setVisible(false);
      return;
    }
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setVisible(false);
      return;
    }
    const w = wrap.getBoundingClientRect();
    setAnchor({
      cx: rect.left + rect.width / 2 - w.left,
      top: rect.top - w.top,
      bottom: rect.bottom - w.top,
    });
    setVisible(true);
    try {
      setActive({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strike: document.queryCommandState("strikeThrough"),
        left: document.queryCommandState("justifyLeft"),
        center: document.queryCommandState("justifyCenter"),
        right: document.queryCommandState("justifyRight"),
      });
    } catch {
      // queryCommandState can throw when the editor is not focused; ignore.
    }
  }, []);

  useEffect(() => {
    const onSel = () => update();
    document.addEventListener("selectionchange", onSel);
    window.addEventListener("resize", onSel);
    window.addEventListener("scroll", onSel, true);
    return () => {
      document.removeEventListener("selectionchange", onSel);
      window.removeEventListener("resize", onSel);
      window.removeEventListener("scroll", onSel, true);
    };
  }, [update]);

  // Position the bar centered above the selection, flipping below near the top,
  // and clamp it inside the editor column.
  useLayoutEffect(() => {
    if (!visible || !anchor || !barRef.current || !wrapRef.current) return;
    const tw = barRef.current.offsetWidth;
    const th = barRef.current.offsetHeight;
    const ww = wrapRef.current.offsetWidth;
    const gap = 10;
    const edge = 20; // keep the bar clear of the card's rounded corners
    let top = anchor.top - th - gap;
    if (top < 2) top = anchor.bottom + gap;
    let left = anchor.cx - tw / 2;
    left = Math.max(edge, Math.min(left, ww - tw - edge));
    setBox({ left, top });
  }, [visible, anchor]);

  const exec = (cmd: string, value?: string) => {
    try {
      document.execCommand(cmd, false, value);
    } catch {
      // No-op if the command is unavailable.
    }
    update();
  };

  // Highlight sets a background on the selection and can be cleared, so it uses
  // the browser command rather than a nested span.
  const highlight = (color: string) => {
    try {
      if (!document.execCommand("hiliteColor", false, color)) {
        document.execCommand("backColor", false, color);
      }
    } catch {
      try {
        document.execCommand("backColor", false, color);
      } catch {
        // No-op if unavailable.
      }
    }
    update();
  };

  // Managed span: wrap the selected range in a styled span and reselect it, so
  // size, weight, family and color apply and the selection survives.
  const applyStyle = (style: Partial<CSSStyleDeclaration>) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    Object.assign(span.style, style);
    try {
      range.surroundContents(span);
    } catch {
      const frag = range.extractContents();
      span.appendChild(frag);
      range.insertNode(span);
    }
    // The new span sets these properties for the whole selection, so clear the
    // same ones from any nested spans inside it. Without this an inner value
    // wins over the outer one (a child inline style beats its parent) and the
    // change only lands on part of the run. Unwrap spans left with no styles so
    // repeated edits do not pile up nested wrappers.
    const props = Object.keys(style) as string[];
    span.querySelectorAll<HTMLElement>("span").forEach((inner) => {
      props.forEach((p) => {
        inner.style.removeProperty(camelToKebab(p));
      });
      if (!inner.style.length && !inner.className) {
        inner.replaceWith(...inner.childNodes);
      }
    });
    span.normalize();
    const next = document.createRange();
    next.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(next);
    update();
  };

  // Size carries a tightened line-height so mixed sizes keep an even rhythm.
  const setFontSize = (v: string) => {
    applyStyle({ fontSize: v, lineHeight: SIZE_LEADING });
    setSize(v);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.shiftKey && (e.key === "x" || e.key === "X")) {
      e.preventDefault();
      exec("strikeThrough");
    }
  };

  const ask = () => {
    setAskNote(true);
    window.setTimeout(() => setAskNote(false), 1800);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#eceef1] p-4 sm:p-6 dark:bg-[#141416]">
      <style>{CSS}</style>

      <div ref={wrapRef} className="relative w-full max-w-[760px]">
        {/* Floating toolbar. Kept mounted so it can be measured, faded when idle. */}
        <div
          ref={barRef}
          role="toolbar"
          aria-label="Text formatting"
          aria-hidden={!visible}
          className="tst-bar absolute z-30 flex items-center gap-1 rounded-[18px] border border-black/[0.06] bg-white/85 p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.05),0_18px_44px_-18px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#232326]/85"
          style={{
            left: box ? box.left : -9999,
            top: box ? box.top : -9999,
            opacity: visible && box ? 1 : 0,
            transform: visible && box ? "translateY(0) scale(1)" : "translateY(6px) scale(0.97)",
            pointerEvents: visible ? "auto" : "none",
          }}
        >
          {/* Ask AI: a clearly non-active affordance, not a fake response. */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={stop}
              onClick={ask}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ff8fc7] to-[#a78bfa] px-3 text-[13px] font-semibold text-white shadow-[0_2px_8px_-2px_rgba(167,139,250,0.6)] transition-[transform,filter] duration-150 hover:brightness-105 active:scale-95"
            >
              <Sparkle size={15} weight="fill" aria-hidden />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
            {askNote && (
              <div className="pointer-events-none absolute left-0 top-full z-40 mt-1.5 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11px] text-white shadow-lg">
                Not connected in this demo
              </div>
            )}
          </div>

          <Divider />

          <div className="hidden sm:block">
            <Menu
              label={`Inter · ${weight}`}
              items={WEIGHTS.map((w) => ({ label: w.label, value: w.value, sub: w.label }))}
              onPick={(v, label) => {
                applyStyle({ fontWeight: v });
                setWeight(label);
              }}
            />
          </div>
          <div className="hidden sm:block">
            <Menu
              label={size}
              items={SIZES.map((s) => ({ label: s, value: s, sub: s }))}
              onPick={(v) => setFontSize(v)}
            />
          </div>
          <ColorButton onPick={(c) => applyStyle({ color: c })} />
          <HighlightButton onPick={highlight} />

          <Divider />

          <IconBtn label="Bold" hint={`${MOD}B`} active={active.bold} onClick={() => exec("bold")}>
            <TextB size={17} weight="bold" aria-hidden />
          </IconBtn>
          <IconBtn label="Italic" hint={`${MOD}I`} active={active.italic} onClick={() => exec("italic")}>
            <TextItalic size={17} weight="bold" aria-hidden />
          </IconBtn>
          <IconBtn label="Underline" hint={`${MOD}U`} active={active.underline} onClick={() => exec("underline")}>
            <TextUnderline size={17} weight="bold" aria-hidden />
          </IconBtn>
          <span className="hidden sm:contents">
            <IconBtn label="Strikethrough" hint={`${MOD}⇧X`} active={active.strike} onClick={() => exec("strikeThrough")}>
              <TextStrikethrough size={17} weight="bold" aria-hidden />
            </IconBtn>
          </span>

          {/* Alignment: inline on wide screens, in the overflow menu on small ones. */}
          <span className="hidden items-center gap-1 sm:flex">
            <Divider />
            <IconBtn label="Align left" active={active.left} onClick={() => exec("justifyLeft")}>
              <TextAlignLeft size={17} weight="bold" aria-hidden />
            </IconBtn>
            <IconBtn label="Align center" active={active.center} onClick={() => exec("justifyCenter")}>
              <TextAlignCenter size={17} weight="bold" aria-hidden />
            </IconBtn>
            <IconBtn label="Align right" active={active.right} onClick={() => exec("justifyRight")}>
              <TextAlignRight size={17} weight="bold" aria-hidden />
            </IconBtn>
          </span>

          {/* Overflow: everything that does not fit on small screens. */}
          <div ref={more.ref} className="relative sm:hidden">
            <button
              type="button"
              aria-label="More options"
              aria-expanded={more.open}
              onMouseDown={stop}
              onClick={() => more.setOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-700 transition-[background-color,transform] duration-150 hover:bg-black/[0.05] active:scale-90 dark:text-neutral-200 dark:hover:bg-white/[0.08]"
            >
              <DotsThreeVertical size={18} weight="bold" aria-hidden />
            </button>
            {more.open && (
              <div className="absolute right-0 top-full z-40 mt-1.5">
                <div
                  onMouseDown={stop}
                  className="tst-pop flex max-h-[min(58vh,340px)] w-[210px] origin-top flex-col overflow-y-auto overscroll-contain rounded-2xl border border-black/[0.07] bg-white/95 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-white/[0.08] dark:bg-[#232326]/95"
                >
                  <MenuGroup title="Align">
                    <MenuItem
                      label="Left"
                      icon={<TextAlignLeft size={15} weight="bold" aria-hidden />}
                      active={active.left}
                      onClick={() => exec("justifyLeft")}
                    />
                    <MenuItem
                      label="Center"
                      icon={<TextAlignCenter size={15} weight="bold" aria-hidden />}
                      active={active.center}
                      onClick={() => exec("justifyCenter")}
                    />
                    <MenuItem
                      label="Right"
                      icon={<TextAlignRight size={15} weight="bold" aria-hidden />}
                      active={active.right}
                      onClick={() => exec("justifyRight")}
                    />
                  </MenuGroup>
                  <MenuGroup title="Style">
                    <MenuItem
                      label="Strikethrough"
                      icon={<TextStrikethrough size={15} weight="bold" aria-hidden />}
                      active={active.strike}
                      onClick={() => exec("strikeThrough")}
                    />
                  </MenuGroup>
                  <MenuGroup title="Weight">
                    {WEIGHTS.map((wt) => (
                      <MenuItem
                        key={wt.value}
                        label={wt.label}
                        active={weight === wt.label}
                        onClick={() => {
                          applyStyle({ fontWeight: wt.value });
                          setWeight(wt.label);
                        }}
                      />
                    ))}
                  </MenuGroup>
                  <MenuGroup title="Size">
                    {SIZES.map((sz) => (
                      <MenuItem
                        key={sz}
                        label={sz}
                        active={size === sz}
                        onClick={() => setFontSize(sz)}
                      />
                    ))}
                  </MenuGroup>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* The editable text. */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Editable text"
          spellCheck={false}
          onKeyDown={onKeyDown}
          onKeyUp={update}
          onMouseUp={update}
          className="tst-editor rounded-[26px] border border-black/[0.05] bg-white/70 px-9 py-8 text-[18px] leading-[1.75] text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_24px_60px_-36px_rgba(0,0,0,0.28)] outline-none dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-neutral-200"
        >
          <p>
            Select any run of this text and a formatting bar floats in just above it. You can
            make words bold, italic, underlined, or struck through, change their size, weight,
            and color, and set how the paragraph is aligned.
          </p>
          <p>
            The selection stays highlighted while you work and the bar follows it around. Apply
            one format, then another, without reselecting. Click away to dismiss the bar.
          </p>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <span className="mx-0.5 h-6 w-px bg-black/10 dark:bg-white/10" aria-hidden />;
}

// A titled section inside the overflow list menu.
function MenuGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-0.5">
      <div className="px-2 pb-0.5 pt-1 text-[10.5px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        {title}
      </div>
      {children}
    </div>
  );
}

// A single list row: optional leading icon, label, and a trailing check when active.
function MenuItem({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onMouseDown={stop}
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] text-neutral-700 transition-colors hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:bg-white/[0.08]"
    >
      {icon ? <span className="flex w-4 justify-center text-neutral-500 dark:text-neutral-400">{icon}</span> : null}
      <span className="flex-1">{label}</span>
      {active ? <Check size={14} weight="bold" aria-hidden className="text-neutral-900 dark:text-white" /> : null}
    </button>
  );
}

function IconBtn({
  label,
  hint,
  active,
  onClick,
  children,
}: {
  label: string;
  hint?: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <span className="tst-tip group relative">
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onMouseDown={stop}
        onClick={onClick}
        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-[background-color,color,transform] duration-150 active:scale-90 ${
          active
            ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
            : "text-neutral-700 hover:bg-black/[0.05] active:bg-black/[0.09] dark:text-neutral-200 dark:hover:bg-white/[0.08]"
        }`}
      >
        {children}
      </button>
      <span className="tst-tiplabel pointer-events-none absolute -top-9 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-[opacity,transform] dark:bg-neutral-800">
        {label}
        {hint ? <span className="ml-1.5 text-white/60">{hint}</span> : null}
      </span>
    </span>
  );
}

function Menu({
  label,
  items,
  onPick,
}: {
  label: string;
  items: { label: string; value: string; sub: string }[];
  onPick: (value: string, label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hl, setHl] = useState<{ top: number; height: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  useEffect(() => {
    if (!open) setHl(null);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-1 rounded-xl px-2.5 text-[13px] font-medium text-neutral-700 transition-[background-color,transform] duration-150 hover:bg-black/[0.05] active:scale-95 dark:text-neutral-200 dark:hover:bg-white/[0.08]"
      >
        {label}
        <CaretDown size={12} weight="bold" className="text-neutral-400" aria-hidden />
      </button>
      {open && (
        <div
          onMouseDown={stop}
          className="tst-pop absolute left-0 top-full z-40 mt-1.5 min-w-[132px] origin-top rounded-xl border border-black/[0.07] bg-white/95 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#232326]/95"
        >
          {/* One highlight that glides between rows on hover. */}
          <div className="relative" onMouseLeave={() => setHl(null)}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 rounded-lg bg-black/[0.06] ring-1 ring-inset ring-black/[0.05] transition-[transform,height,opacity] duration-200 ease-out dark:bg-white/[0.07] dark:ring-white/[0.06]"
              style={{ transform: `translateY(${hl?.top ?? 0}px)`, height: hl?.height ?? 0, opacity: hl ? 1 : 0 }}
            />
            {items.map((it) => (
              <button
                key={it.value}
                type="button"
                onMouseDown={stop}
                onMouseEnter={(e) =>
                  setHl({ top: e.currentTarget.offsetTop, height: e.currentTarget.offsetHeight })
                }
                onClick={() => {
                  onPick(it.value, it.label);
                  setOpen(false);
                }}
                className="relative z-10 flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-[13px] text-neutral-700 dark:text-neutral-200"
              >
                {it.sub}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  return { open, setOpen, ref };
}

function ColorButton({ onPick }: { onPick: (color: string) => void }) {
  const { open, setOpen, ref } = usePopover();
  const [dot, setDot] = useState("#2f6bff");
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Text color"
        onMouseDown={stop}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-xl transition-[background-color,transform] duration-150 hover:bg-black/[0.05] active:scale-90 dark:hover:bg-white/[0.08]"
      >
        <span
          className="h-5 w-5 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] ring-2 ring-white dark:ring-[#232326]"
          style={{ backgroundColor: dot }}
        />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-40 mt-1.5 -translate-x-1/2">
          <div
            onMouseDown={stop}
            className="tst-pop flex origin-top gap-1.5 rounded-xl border border-black/[0.07] bg-white/95 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#232326]/95"
          >
            {SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${c}`}
                onMouseDown={stop}
                onClick={() => {
                  onPick(c);
                  setDot(c);
                  setOpen(false);
                }}
                className="h-6 w-6 rounded-full ring-1 ring-black/10 transition-transform duration-150 hover:scale-110 active:scale-95 dark:ring-white/15"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// The circle swatch that shows the current highlight: a red slashed circle for
// none, or a filled circle in the chosen tint.
function NoneCircle({ size = 20, line = 22 }: { size?: number; line?: number }) {
  return (
    <span
      className="relative flex items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-black/10 dark:bg-[#2b2b30] dark:ring-white/15"
      style={{ width: size, height: size }}
    >
      <span className="absolute h-[1.5px] rotate-45 rounded bg-red-500" style={{ width: line }} aria-hidden />
    </span>
  );
}

function HighlightButton({ onPick }: { onPick: (color: string) => void }) {
  const { open, setOpen, ref } = usePopover();
  const [tint, setTint] = useState<string | null>(null); // null = no highlight
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Highlight color"
        onMouseDown={stop}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-xl transition-[background-color,transform] duration-150 hover:bg-black/[0.05] active:scale-90 dark:hover:bg-white/[0.08]"
      >
        {tint ? (
          <span
            className="h-5 w-5 rounded-full ring-1 ring-black/10 dark:ring-white/15"
            style={{ backgroundColor: tint }}
          />
        ) : (
          <NoneCircle size={20} line={22} />
        )}
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-40 mt-1.5 -translate-x-1/2">
          <div
            onMouseDown={stop}
            className="tst-pop flex origin-top items-center gap-1.5 rounded-xl border border-black/[0.07] bg-white/95 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#232326]/95"
          >
            {/* No highlight: a circle with a slanted red line. */}
            <button
              type="button"
              aria-label="No highlight"
              onMouseDown={stop}
              onClick={() => {
                onPick("transparent");
                setTint(null);
                setOpen(false);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 active:scale-95"
            >
              <NoneCircle size={24} line={26} />
            </button>
            {HIGHLIGHTS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Highlight ${c}`}
                onMouseDown={stop}
                onClick={() => {
                  onPick(c);
                  setTint(c);
                  setOpen(false);
                }}
                className="h-6 w-6 rounded-full ring-1 ring-black/10 transition-transform duration-150 hover:scale-110 active:scale-95 dark:ring-white/15"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
.tst-editor ::selection { background: #b7d0ff; color: inherit; }
.dark .tst-editor ::selection { background: #2b4a80; color: #fff; }
.tst-editor p { margin: 0 0 1em; }
.tst-editor p:last-child { margin-bottom: 0; }

/* Highlights are pale tints meant for dark text. In dark mode the editor text
   is light, so force any highlighted run back to dark ink to stay readable. */
.dark .tst-editor [style*="background-color"] { color: #18181b !important; }

/* The bar eases in with a small lift and settle. */
.tst-bar {
  transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: center bottom;
  will-change: transform, opacity;
}

/* Menus and swatch popovers pop in from the top. */
.tst-pop { animation: tst-pop 0.16s cubic-bezier(0.22, 1, 0.36, 1); }
@keyframes tst-pop {
  from { opacity: 0; transform: translateY(-4px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Tooltips lift slightly as they appear on hover. */
.tst-tiplabel { transform: translate(-50%, 3px); }
.tst-tip:hover .tst-tiplabel { opacity: 1; transform: translate(-50%, 0); }

@media (prefers-reduced-motion: reduce) {
  .tst-bar { transition: opacity 0.1s linear; transform: none !important; }
  .tst-pop { animation: none; }
  .tst-tiplabel { transform: translate(-50%, 0); }
}
`;
