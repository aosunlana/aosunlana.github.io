"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  Plus,
  ArrowUp,
  SlidersHorizontal,
  Waveform,
  Images,
  GlobeSimple,
  Code,
  Binoculars,
  Lightbulb,
  Check,
  X,
  ImageSquare,
  Paperclip,
  Camera,
  Stop,
  MagnifyingGlass,
  CaretRight,
  ChatCircle,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { SiClaude, SiGooglegemini, SiX } from "react-icons/si";

/* --------------------------------------------------------------------------
 * A chat composer (prompt bar). Type to arm the send button, open the Tools
 * menu to toggle capabilities into chips, switch writing modes, or hit Voice to
 * record (an animated waveform that "transcribes" into the box on stop).
 * Theme aware, all mock. Nothing leaves the component.
 * ------------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;
const HL_SPRING = { type: "spring", stiffness: 650, damping: 44 } as const;
const BARS = 96; // live waveform sample count

type Item = { id: string; label: string; Icon: PhosphorIcon };

const TOOLS: Item[] = [
  { id: "image", label: "Create an image", Icon: Images },
  { id: "web", label: "Search the web", Icon: GlobeSimple },
  { id: "code", label: "Write code", Icon: Code },
  { id: "research", label: "Run deep research", Icon: Binoculars },
  { id: "think", label: "Think longer", Icon: Lightbulb },
];

// OpenAI's mark is not in react-icons, so it is inlined here.
function OpenAIMark({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

type Brand = ComponentType<{ size?: number; className?: string }>;
type Model = { id: string; name: string; Brand: Brand; color: string; badge?: string; soon?: boolean };

const MODELS: Model[] = [
  { id: "claude-opus", name: "Claude Opus 4.1", Brand: SiClaude, color: "#D97757" },
  { id: "gemini-3-pro", name: "Gemini 3 Pro", Brand: SiGooglegemini, color: "#4285F4", badge: "Beta" },
  { id: "gpt-5-1", name: "GPT-5.1", Brand: OpenAIMark, color: "currentColor" },
  { id: "gpt-4o", name: "GPT-4o", Brand: OpenAIMark, color: "currentColor" },
  { id: "grok-4-1", name: "Grok 4.1", Brand: SiX, color: "currentColor", soon: true },
];

// A presentational toggle switch (the whole menu row is the button). The thumb
// is centered with a transform so it never drifts, and slides on `left`.
function ToggleVisual({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative block h-[24px] w-[42px] shrink-0 rounded-full transition-colors ${
        on ? "bg-[#2f6bff]" : "bg-neutral-300 dark:bg-neutral-600"
      }`}
    >
      <motion.span
        animate={{ left: on ? 21 : 3 }}
        transition={{ type: "spring", stiffness: 620, damping: 36 }}
        className="absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
      />
    </span>
  );
}

// The gliding hover glow shared across a menu's rows.
function Glide({ id }: { id: string }) {
  return (
    <motion.span
      layoutId={id}
      transition={HL_SPRING}
      className="absolute inset-0 rounded-lg bg-black/[0.05] dark:bg-white/[0.07]"
    />
  );
}

const ADD: Item[] = [
  { id: "photos", label: "Photos", Icon: ImageSquare },
  { id: "files", label: "Files", Icon: Paperclip },
  { id: "camera", label: "Camera", Icon: Camera },
];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// A soft floating pill used across the toolbar.
const pill =
  "inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 text-[14px] font-medium text-neutral-700 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors hover:bg-neutral-50 sm:px-3.5 dark:border-white/[0.08] dark:bg-[#2c2c2e] dark:text-neutral-200 dark:hover:bg-[#343436]";

/* ------------------------------- menus ---------------------------------- */

// A menu that floats up from its trigger, with a shared gliding hover glow.
function Menu({
  open,
  items,
  activeIds,
  onPick,
  width = 236,
  hlId,
  up = true,
  maxHeight,
}: {
  open: boolean;
  items: Item[];
  activeIds: string[];
  onPick: (id: string) => void;
  width?: number;
  hlId: string;
  up?: boolean;
  maxHeight?: number;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const dy = up ? 8 : -8;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: dy, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: dy, scale: 0.96 }}
          transition={{ duration: 0.2, ease: EASE }}
          onMouseLeave={() => setHover(null)}
          style={{ width, maxWidth: "100%", maxHeight }}
          className={`absolute left-0 z-30 overflow-y-auto rounded-2xl border border-black/[0.06] bg-white p-1.5 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.22)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-white/[0.08] dark:bg-[#272729] ${
            up ? "bottom-[calc(100%+10px)] origin-bottom-left" : "top-[calc(100%+10px)] origin-top-left"
          }`}
        >
          {items.map((it, i) => {
            const active = activeIds.includes(it.id);
            return (
              <motion.button
                key={it.id}
                type="button"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * i, duration: 0.2, ease: EASE }}
                onMouseEnter={() => setHover(it.id)}
                onClick={() => onPick(it.id)}
                className="relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] text-neutral-800 dark:text-neutral-100"
              >
                {hover === it.id && (
                  <motion.span
                    layoutId={hlId}
                    transition={HL_SPRING}
                    className="absolute inset-0 rounded-xl bg-black/[0.05] dark:bg-white/[0.07]"
                  />
                )}
                <span className="relative z-10 text-neutral-500 dark:text-neutral-400">
                  <it.Icon size={19} />
                </span>
                <span className="relative z-10 flex-1">{it.label}</span>
                <AnimatePresence>
                  {active && (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 26 }}
                      className="relative z-10 text-neutral-900 dark:text-white"
                    >
                      <Check size={16} weight="bold" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------- shell ---------------------------------- */

export default function PromptComposer() {
  const [text, setText] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [model, setModel] = useState("gemini-3-pro");
  const [modelQuery, setModelQuery] = useState("");
  const [autoModel, setAutoModel] = useState(false);
  const [tempChat, setTempChat] = useState(false);
  const [menu, setMenu] = useState<null | "tools" | "model" | "add">(null);
  const [focused, setFocused] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sent, setSent] = useState(false);
  const [levels, setLevels] = useState<number[]>(() => Array(BARS).fill(0));
  const [menuMaxH, setMenuMaxH] = useState(320);
  const [menuUp, setMenuUp] = useState(true);
  const [modelHover, setModelHover] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const tickRef = useRef(0);

  const activeModel = MODELS.find((m) => m.id === model) ?? MODELS[0];

  // Open (or toggle) a toolbar menu. It opens toward whichever side of the
  // toolbar has more room within the stage (up when the composer sits low, down
  // on a phone where the card runs on below), and caps its height to that space
  // so it never spills past the top or bottom of the stage.
  const openMenu = (which: "add" | "tools" | "model") => {
    if (menu === which) {
      setMenu(null);
      return;
    }
    const bar = toolbarRef.current?.getBoundingClientRect();
    const stage = stageRef.current?.getBoundingClientRect();
    if (bar && stage) {
      const above = bar.top - stage.top - 16;
      const below = stage.bottom - bar.bottom - 16;
      const up = above >= below;
      setMenuUp(up);
      setMenuMaxH(Math.max(150, Math.min(360, Math.floor(up ? above : below))));
    }
    setMenu(which);
  };
  const canSend = text.trim().length > 0;
  const filteredModels = useMemo(
    () => MODELS.filter((m) => m.name.toLowerCase().includes(modelQuery.toLowerCase())),
    [modelQuery]
  );

  // Auto-grow the textarea to fit its content.
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 220)}px`;
  }, [text]);

  // Recording timer.
  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  // Live waveform: push a new sample at the right each tick so the bars flow
  // left. A slow envelope gives speech-like phrases; per-sample jitter is grain.
  useEffect(() => {
    if (!recording) {
      setLevels(Array(BARS).fill(0));
      return;
    }
    const id = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;
      const envelope = 0.28 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.13) * Math.sin(t * 0.021));
      const v = Math.min(1, Math.max(0.06, envelope * (0.35 + 0.65 * Math.random())));
      setLevels((prev) => [...prev.slice(1), v]);
    }, 80);
    return () => clearInterval(id);
  }, [recording]);

  // Close menus on an outside click.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menu]);

  const send = () => {
    if (!canSend) return;
    setText("");
    setTools([]);
    setSent(true);
    setTimeout(() => setSent(false), 900);
    taRef.current?.focus();
  };

  const stopRecording = (keep: boolean) => {
    setRecording(false);
    if (keep && elapsed > 0) setText((t) => (t ? t + " " : "") + "Best icons library");
    setElapsed(0);
    setTimeout(() => taRef.current?.focus(), 0);
  };

  return (
    <div
      ref={stageRef}
      className="flex h-full w-full items-center justify-center bg-[#eeeef0] p-5 sm:p-8 dark:bg-[#161617]"
    >
      <div ref={rootRef} className="relative w-full max-w-[640px]">
        {/* Card. Its height hugs whichever view is active; the crossfade below
            swaps content while it is faded out, so the resize reads smoothly. */}
        <motion.div
          animate={sent ? { scale: [1, 0.99, 1] } : {}}
          transition={{ duration: 0.35, ease: EASE }}
          className={`rounded-[26px] border bg-white px-4 pb-3 pt-4 transition-[border-color,box-shadow] duration-300 dark:bg-[#232325] ${
            focused || recording
              ? "border-black/[0.12] shadow-[0_6px_34px_-8px_rgba(0,0,0,0.18)] dark:border-white/[0.16]"
              : "border-black/[0.05] shadow-[0_2px_24px_-6px_rgba(0,0,0,0.12)] dark:border-white/[0.07]"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {recording ? (
              /* ---- Voice recording (hugs its single row) ---- */
              <motion.div
                key="rec"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="flex items-center gap-3 px-1 py-1.5"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <motion.span
                    animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-red-500"
                  />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
                <span className="w-11 shrink-0 font-mono text-sm tabular-nums text-neutral-600 dark:text-neutral-300">
                  {fmt(elapsed)}
                </span>
                {/* Live waveform: samples flow left, newest at the right, older
                    bars fade so it reads like a running trail. */}
                <div className="flex h-9 flex-1 items-center justify-between overflow-hidden px-1">
                  {levels.map((lvl, i) => (
                    <span
                      key={i}
                      className="w-[2px] shrink-0 rounded-full bg-neutral-500 dark:bg-neutral-300"
                      style={{
                        height: 34,
                        transform: `scaleY(${Math.max(0.05, lvl)})`,
                        opacity: 0.25 + 0.75 * (i / BARS),
                        transition: "transform 90ms linear",
                      }}
                    />
                  ))}
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.06 }}
                  onClick={() => stopRecording(false)}
                  aria-label="Cancel recording"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-white/10 dark:hover:text-neutral-200"
                >
                  <X size={19} />
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.06 }}
                  onClick={() => stopRecording(true)}
                  aria-label="Stop and transcribe"
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white shadow-[0_2px_10px_-2px_rgba(0,0,0,0.35)] dark:bg-white dark:text-neutral-900"
                >
                  <motion.span
                    animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0, 0.35] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full ring-2 ring-neutral-900/40 dark:ring-white/40"
                  />
                  <Stop size={17} weight="fill" />
                </motion.button>
              </motion.div>
            ) : (
              /* ---- Text composer ---- */
              <motion.div
                key="text"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                {/* Active tool chips: sit above the text, compact and removable */}
                <LayoutGroup>
                  <div className={`flex flex-wrap items-center gap-1.5 px-1 ${tools.length ? "pb-2" : ""}`}>
                    <AnimatePresence mode="popLayout">
                      {tools.map((id) => {
                        const t = TOOLS.find((x) => x.id === id)!;
                        return (
                          <motion.button
                            key={id}
                            layout
                            type="button"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            whileHover={{ y: -1 }}
                            onClick={() => setTools((cur) => cur.filter((x) => x !== id))}
                            className="group/chip inline-flex h-7 items-center gap-1.5 rounded-full bg-neutral-900/[0.05] pl-2 pr-1.5 text-[12.5px] font-medium text-neutral-700 transition-colors hover:bg-neutral-900/[0.08] dark:bg-white/[0.08] dark:text-neutral-200 dark:hover:bg-white/[0.12]"
                          >
                            <t.Icon size={14} className="text-neutral-500 dark:text-neutral-400" />
                            {t.label}
                            <span className="flex h-4 w-4 items-center justify-center rounded-full text-neutral-400 transition-colors group-hover/chip:bg-neutral-900/10 group-hover/chip:text-neutral-700 dark:group-hover/chip:bg-white/15 dark:group-hover/chip:text-neutral-100">
                              <X size={11} weight="bold" />
                            </span>
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </LayoutGroup>

                <textarea
                  ref={taRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    } else if (e.key === "Escape") {
                      setMenu(null);
                    }
                  }}
                  rows={1}
                  placeholder="Ask anything"
                  aria-label="Message"
                  className="block max-h-[220px] w-full resize-none bg-transparent px-1.5 pb-2 text-[17px] leading-6 text-neutral-900 caret-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:caret-white dark:placeholder:text-neutral-500"
                />

                {/* Toolbar. Relative so the popover menus anchor to the toolbar's
                    left edge (not their trigger button), which keeps them inside
                    the card on a narrow phone instead of spilling off the right. */}
                <div ref={toolbarRef} className="relative mt-3 flex items-center gap-2 sm:gap-3">
                  {/* + attach */}
                  <div className="contents">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openMenu("add")}
                      aria-label="Add"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-white text-neutral-700 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors hover:bg-neutral-50 dark:border-white/[0.08] dark:bg-[#2c2c2e] dark:text-neutral-200 dark:hover:bg-[#343436]"
                    >
                      <motion.span animate={{ rotate: menu === "add" ? 45 : 0 }} transition={{ duration: 0.2 }}>
                        <Plus size={20} />
                      </motion.span>
                    </motion.button>
                    <Menu
                      open={menu === "add"}
                      items={ADD}
                      activeIds={[]}
                      width={180}
                      hlId="add-hl"
                      up={menuUp}
                      maxHeight={menuMaxH}
                      onPick={() => setMenu(null)}
                    />
                  </div>

                  {/* Tools */}
                  <div className="contents">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => openMenu("tools")}
                      className={`${pill} ${
                        menu === "tools" || tools.length
                          ? "!bg-neutral-100 dark:!bg-[#37373a]"
                          : ""
                      }`}
                    >
                      <SlidersHorizontal size={18} className="text-neutral-500 dark:text-neutral-400" />
                      <span className="hidden sm:inline">Tools</span>
                      <AnimatePresence>
                        {tools.length > 0 && (
                          <motion.span
                            key="count"
                            initial={{ scale: 0, width: 0, marginLeft: 0 }}
                            animate={{ scale: 1, width: "auto", marginLeft: 2 }}
                            exit={{ scale: 0, width: 0, marginLeft: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-full bg-neutral-900 px-1 text-[11px] font-semibold text-white dark:bg-white dark:text-neutral-900"
                          >
                            {tools.length}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <Menu
                      open={menu === "tools"}
                      items={TOOLS}
                      activeIds={tools}
                      hlId="tools-hl"
                      up={menuUp}
                      maxHeight={menuMaxH}
                      onPick={(id) =>
                        setTools((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
                      }
                    />
                  </div>

                  {/* Model picker */}
                  <div className="contents">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => openMenu("model")}
                      className={`${pill} ${menu === "model" ? "!bg-neutral-100 dark:!bg-[#37373a]" : ""}`}
                    >
                      <motion.span
                        key={activeModel.id}
                        initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 450, damping: 20 }}
                        className={activeModel.color === "currentColor" ? "text-neutral-800 dark:text-neutral-200" : ""}
                        style={activeModel.color === "currentColor" ? undefined : { color: activeModel.color }}
                      >
                        <activeModel.Brand size={16} />
                      </motion.span>
                      <span className="hidden sm:inline">{activeModel.name}</span>
                    </motion.button>

                    <AnimatePresence>
                      {menu === "model" && (
                        <motion.div
                          initial={{ opacity: 0, y: menuUp ? 8 : -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: menuUp ? 8 : -8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: EASE }}
                          style={{ maxHeight: menuMaxH }}
                          onMouseLeave={() => setModelHover(null)}
                          className={`absolute left-0 z-30 flex w-[264px] max-w-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_16px_50px_-12px_rgba(0,0,0,0.22)] dark:border-white/[0.08] dark:bg-[#272729] ${
                            menuUp ? "bottom-[calc(100%+10px)] origin-bottom-left" : "top-[calc(100%+10px)] origin-top-left"
                          }`}
                        >
                          {/* Search: fixed at the top, sits outside the scroll area */}
                          <div className="flex shrink-0 items-center gap-2 border-b border-black/[0.05] px-3.5 py-3 dark:border-white/[0.07]">
                            <MagnifyingGlass size={16} className="shrink-0 text-neutral-400" />
                            <input
                              value={modelQuery}
                              onChange={(e) => setModelQuery(e.target.value)}
                              placeholder="Search models"
                              aria-label="Search models"
                              className="w-full bg-transparent text-[14px] text-neutral-800 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                            />
                          </div>

                          {/* Scrollable body: toggles + models */}
                          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {/* Optional toggles (whole row toggles) */}
                          <div className="p-1.5">
                            <p className="px-2.5 pb-0.5 pt-1.5 text-[12px] font-medium text-neutral-400">Optional</p>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={autoModel}
                              onMouseEnter={() => setModelHover("auto")}
                              onClick={() => setAutoModel((v) => !v)}
                              className="relative flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[14.5px] text-neutral-800 dark:text-neutral-100"
                            >
                              {modelHover === "auto" && <Glide id="model-hl" />}
                              <span className="relative z-10">Auto</span>
                              <span className="relative z-10">
                                <ToggleVisual on={autoModel} />
                              </span>
                            </button>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={tempChat}
                              onMouseEnter={() => setModelHover("temp")}
                              onClick={() => setTempChat((v) => !v)}
                              className="relative flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[14.5px] text-neutral-800 dark:text-neutral-100"
                            >
                              {modelHover === "temp" && <Glide id="model-hl" />}
                              <span className="relative z-10">Temporary chat</span>
                              <span className="relative z-10">
                                <ToggleVisual on={tempChat} />
                              </span>
                            </button>
                          </div>

                          {/* Models */}
                          <div className="border-t border-black/[0.05] p-1.5 dark:border-white/[0.07]">
                            <p className="px-2.5 pb-0.5 pt-1 text-[12px] font-medium text-neutral-400">Models</p>
                            {filteredModels.length === 0 ? (
                              <p className="px-2.5 py-3 text-[13.5px] text-neutral-400">No models found</p>
                            ) : (
                              filteredModels.map((m) => {
                                const active = m.id === model;
                                return (
                                  <button
                                    key={m.id}
                                    type="button"
                                    disabled={m.soon}
                                    onMouseEnter={() => !m.soon && setModelHover(m.id)}
                                    onClick={() => {
                                      if (m.soon) return;
                                      setModel(m.id);
                                      setModelQuery("");
                                      setMenu(null);
                                    }}
                                    className={`relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[14.5px] ${
                                      m.soon ? "cursor-not-allowed" : ""
                                    }`}
                                  >
                                    {active && (
                                      <span className="absolute inset-0 rounded-lg bg-[#2f6bff]/[0.08] dark:bg-[#2f6bff]/[0.18]" />
                                    )}
                                    {!m.soon && modelHover === m.id && <Glide id="model-hl" />}
                                    <span
                                      className={
                                        m.soon
                                          ? "relative z-10 text-neutral-300 dark:text-neutral-600"
                                          : m.color === "currentColor"
                                            ? "relative z-10 text-neutral-800 dark:text-neutral-100"
                                            : "relative z-10"
                                      }
                                      style={m.soon || m.color === "currentColor" ? undefined : { color: m.color }}
                                    >
                                      <m.Brand size={17} />
                                    </span>
                                    <span
                                      className={`relative z-10 flex-1 ${
                                        m.soon
                                          ? "text-neutral-400 dark:text-neutral-500"
                                          : "text-neutral-800 dark:text-neutral-100"
                                      }`}
                                    >
                                      {m.name}
                                    </span>
                                    {m.badge && (
                                      <span className="relative z-10 text-[10px] font-semibold uppercase italic tracking-wide text-[#2f6bff]">
                                        {m.badge}
                                      </span>
                                    )}
                                    {m.soon && (
                                      <span className="relative z-10 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                                        Soon
                                      </span>
                                    )}
                                    {active && (
                                      <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 26 }}
                                        className="relative z-10 text-[#2f6bff]"
                                      >
                                        <Check size={16} weight="bold" />
                                      </motion.span>
                                    )}
                                  </button>
                                );
                              })
                            )}
                          </div>
                          </div>

                          {/* Footer: fixed at the bottom, outside the scroll area */}
                          <button
                            type="button"
                            onMouseEnter={() => setModelHover("ask")}
                            onClick={() => setMenu(null)}
                            className="relative flex w-full shrink-0 items-center gap-2.5 border-t border-black/[0.05] px-3.5 py-2.5 text-left text-[14px] text-neutral-600 dark:border-white/[0.07] dark:text-neutral-300"
                          >
                            {modelHover === "ask" && (
                              <motion.span
                                layoutId="model-hl"
                                transition={HL_SPRING}
                                className="absolute inset-x-1.5 inset-y-1 rounded-lg bg-black/[0.05] dark:bg-white/[0.07]"
                              />
                            )}
                            <ChatCircle size={17} className="relative z-10 text-neutral-400" />
                            <span className="relative z-10 flex-1">Ask for a model</span>
                            <CaretRight size={14} className="relative z-10 text-neutral-400" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* right cluster */}
                  <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setMenu(null);
                        setRecording(true);
                        setElapsed(0);
                      }}
                      className={pill}
                    >
                      <Waveform size={18} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                      <span className="hidden sm:inline">Voice</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={send}
                      disabled={!canSend}
                      aria-label="Send"
                      whileTap={canSend ? { scale: 0.9 } : {}}
                      animate={{
                        backgroundColor: canSend ? "var(--send-on)" : "var(--send-off)",
                      }}
                      transition={{ duration: 0.25 }}
                      style={
                        {
                          "--send-on": "#1a1a1a",
                          "--send-off": "#e6e6e8",
                        } as React.CSSProperties
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full dark:[--send-on:#ededed] dark:[--send-off:#3a3a3c]"
                    >
                      <motion.span
                        animate={{
                          color: canSend ? "var(--on)" : "var(--off)",
                          y: sent ? -22 : 0,
                          opacity: sent ? 0 : 1,
                        }}
                        transition={{ duration: sent ? 0.35 : 0.2, ease: EASE }}
                        style={
                          {
                            "--on": "#ffffff",
                            "--off": "#a3a3a3",
                          } as React.CSSProperties
                        }
                        className="dark:[--on:#1a1a1a] dark:[--off:#8a8a8a]"
                      >
                        <ArrowUp size={19} weight="bold" />
                      </motion.span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
