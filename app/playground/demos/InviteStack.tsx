"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Copy, Check, PaperPlaneRight, X } from "@phosphor-icons/react";

type Status = "sent" | "accepted";
type Member = {
  id: string;
  email: string;
  name: string;
  seed: string;
  initials: string;
  color: string;
  status: Status;
};

const ACCENT = "#6C5CE7";
const COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#14B8A6", "#8B5CF6", "#F43F5E"];
const SEATS = 10;
const INVITE_LINK = "veer.xyz/invite/xY7k2Q";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DICEBEAR_STYLE = "notionists";
const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/${DICEBEAR_STYLE}/svg?seed=${encodeURIComponent(seed)}`;

const nameFromEmail = (email: string) => email.split("@")[0].replace(/[._-]/g, " ");
const initialsFromEmail = (email: string) =>
  (email.split("@")[0].replace(/[^a-zA-Z]/g, "").slice(0, 2) || "?").toUpperCase();

const INITIAL: Member[] = [
  { id: "1", email: "sophia@example.com", name: "Sophia", seed: "Sophia", initials: "SO", color: COLORS[0], status: "accepted" },
  { id: "2", email: "michael@example.com", name: "Michael", seed: "Michael", initials: "MI", color: COLORS[1], status: "sent" },
  { id: "3", email: "emily@example.com", name: "Emily", seed: "Emily", initials: "EM", color: COLORS[2], status: "sent" },
  { id: "4", email: "jack@example.com", name: "Jack", seed: "Jack", initials: "JA", color: COLORS[3], status: "accepted" },
];

function Avatar({
  member,
  size = 40,
  first,
  expanded,
  onRemove,
}: {
  member: Member;
  size?: number;
  first?: boolean;
  expanded?: boolean;
  onRemove?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const isStack = expanded !== undefined;
  return (
    <motion.div
      layout={isStack}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      animate={isStack ? { marginLeft: first ? 0 : expanded ? 6 : -12 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className="relative shrink-0"
      style={{ zIndex: hover ? 30 : 1, width: size, height: size }}
    >
      <motion.div
        whileHover={isStack ? { y: -5, scale: 1.08 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        style={{ backgroundColor: member.color }}
        className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-full text-[10px] font-semibold text-white ${
          isStack ? "ring-[3px] ring-[#eceef1] dark:ring-[#141416]" : ""
        }`}
      >
        <span className="absolute">{member.initials}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatarUrl(member.seed)} alt="" className="relative h-full w-full object-cover" />
      </motion.div>

      {isStack && (
        <AnimatePresence>
          {hover && (
            <motion.span
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute -top-9 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-lg bg-custom-gray-900 px-2 py-1 text-[11px] font-medium capitalize text-white dark:bg-white dark:text-custom-gray-900"
            >
              {member.name}
            </motion.span>
          )}
        </AnimatePresence>
      )}

      {isStack && onRemove && (
        <AnimatePresence>
          {hover && (
            <motion.button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${member.name}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.12 }}
              className="absolute -right-1 -top-1 z-40 flex h-4 w-4 items-center justify-center rounded-full bg-custom-gray-900 text-white ring-2 ring-[#eceef1] dark:bg-white dark:text-custom-gray-900 dark:ring-[#141416]"
            >
              <X size={9} weight="bold" aria-hidden />
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const accepted = status === "accepted";
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium no-underline ${
          accepted
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
            : "bg-custom-gray-100 text-custom-gray-500 dark:bg-custom-gray-800 dark:text-custom-gray-400"
        }`}
      >
        {accepted ? "Invite accepted" : "Invite sent"}
      </motion.span>
    </AnimatePresence>
  );
}

export default function InviteStack() {
  const [members, setMembers] = useState<Member[]>(INITIAL);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [plusHover, setPlusHover] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const used = members.length;
  const seatPct = Math.min(used / SEATS, 1);
  const canInvite =
    email.split(/[,\s]+/).some((p) => EMAIL_RE.test(p.trim())) && used < SEATS;

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  // Parse and add one or more comma / space separated emails at once. Returns the
  // number added and any leftover text (invalid fragments) to keep in the input.
  function addEmails(raw: string): { added: number; leftover: string } {
    const parts = raw
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const existing = new Set(members.map((m) => m.email.toLowerCase()));
    const invalid: string[] = [];
    const toAdd: string[] = [];
    for (const p of parts) {
      if (!EMAIL_RE.test(p)) {
        invalid.push(p);
        continue;
      }
      const key = p.toLowerCase();
      if (existing.has(key)) continue; // skip duplicates
      existing.add(key);
      if (members.length + toAdd.length < SEATS) toAdd.push(p);
    }
    if (toAdd.length) {
      const base = members.length;
      const additions: Member[] = toAdd.map((em, i) => ({
        id: crypto.randomUUID(),
        email: em,
        name: nameFromEmail(em),
        seed: em,
        initials: initialsFromEmail(em),
        color: COLORS[(base + i) % COLORS.length],
        status: "sent",
      }));
      setMembers((m) => [...m, ...additions]);
      // Simulate each invite being accepted a moment later.
      additions.forEach((a) => {
        const t = setTimeout(
          () =>
            setMembers((cur) =>
              cur.map((x) => (x.id === a.id ? { ...x, status: "accepted" } : x))
            ),
          2600
        );
        timers.current.push(t);
      });
    }
    return { added: toAdd.length, leftover: invalid.join(", ") };
  }

  function invite(e: React.FormEvent) {
    e.preventDefault();
    const { added, leftover } = addEmails(email);
    if (!added) {
      if (email.trim()) setError(true);
      return;
    }
    setEmail(leftover);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`https://${INVITE_LINK}`);
      setCopied(true);
    } catch {
      // Clipboard blocked; the link stays visible to copy manually.
    }
  }

  const stack = members.slice(0, 5);
  const extra = members.length - stack.length;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#eceef1] p-4 sm:p-6 dark:bg-[#141416]">
      <div className="relative flex w-full max-w-[400px] flex-col items-center">
        {/* Standalone avatar stack with a + trigger at the end */}
        <div
          className="flex items-center"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {stack.map((m, i) => (
              <Avatar
                key={m.id}
                member={m}
                size={44}
                first={i === 0}
                expanded={expanded}
                onRemove={
                  members.length > 1
                    ? () => setMembers((cur) => cur.filter((x) => x.id !== m.id))
                    : undefined
                }
              />
            ))}
          </AnimatePresence>
          {extra > 0 && (
            <motion.span
              layout
              style={{ zIndex: 5 }}
              animate={{ marginLeft: expanded ? 6 : -12 }}
              className="flex aspect-square h-11 w-11 shrink-0 items-center justify-center rounded-full bg-custom-gray-200 text-xs font-semibold text-custom-gray-700 ring-[3px] ring-[#eceef1] dark:bg-custom-gray-700 dark:text-custom-gray-200 dark:ring-[#141416]"
            >
              +{extra}
            </motion.span>
          )}

          {/* + trigger circle, stacked like the avatars */}
          <motion.div
            layout
            style={{ zIndex: plusHover ? 20 : 10 }}
            animate={{ marginLeft: expanded ? 6 : -12 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            onMouseEnter={() => setPlusHover(true)}
            onMouseLeave={() => setPlusHover(false)}
            className="relative shrink-0"
          >
            <motion.button
              type="button"
              onClick={() => setOpen((v) => !v)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-expanded={open}
              aria-label={open ? "Close invite" : "Invite people"}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#eceef1] text-custom-gray-400 ring-[3px] ring-[#eceef1] transition-colors hover:text-custom-gray-600 dark:bg-[#141416] dark:text-custom-gray-500 dark:ring-[#141416] dark:hover:text-custom-gray-300"
            >
              {/* Dashed ring with controllable gaps */}
              <svg
                aria-hidden
                viewBox="0 0 44 44"
                fill="none"
                className="pointer-events-none absolute inset-0 h-full w-full text-custom-gray-300 dark:text-custom-gray-600"
              >
                <circle
                  cx="22"
                  cy="22"
                  r="21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="3 5"
                />
              </svg>
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X size={15} weight="bold" aria-hidden />
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <UserPlus size={15} weight="bold" aria-hidden />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {plusHover && !open && (
                <motion.span
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute -top-9 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-lg bg-custom-gray-900 px-2 py-1 text-[11px] font-medium text-white dark:bg-white dark:text-custom-gray-900"
                >
                  Invite member
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Invite panel (revealed on click) */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-full overflow-hidden"
            >
              <div className="mt-4 rounded-2xl border border-custom-gray-200 bg-white/90 p-5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.25)] backdrop-blur-xl dark:border-app-border-dark dark:bg-app-card-dark/90">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-custom-gray-900 dark:text-app-text-dark">
                      Invite people
                    </h3>
                    <p className="mt-0.5 text-sm text-custom-gray-500 dark:text-custom-gray-400">
                      We&apos;ll email them a link to join.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="text-custom-gray-400 transition-colors hover:text-custom-gray-700 dark:hover:text-custom-gray-200"
                  >
                    <X size={16} aria-hidden />
                  </button>
                </div>

                {/* Invite input */}
                <form onSubmit={invite} className="mt-4 flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="email"
                    value={email}
                    onChange={(e) => {
                      const v = e.target.value;
                      // A comma commits the completed emails, keeping any partial.
                      if (v.includes(",")) {
                        setEmail(addEmails(v).leftover);
                      } else {
                        setEmail(v);
                      }
                      if (error) setError(false);
                    }}
                    placeholder="Enter emails, comma separated"
                    aria-label="Invite emails"
                    aria-invalid={error}
                    className={`h-10 w-full rounded-xl border bg-white px-3 text-sm text-custom-gray-900 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-custom-gray-400 dark:bg-app-bg-dark dark:text-app-text-dark ${
                      error ? "border-custom-red-400" : "border-custom-gray-200 dark:border-app-border-dark"
                    }`}
                    onFocus={(e) => {
                      const c = error ? "#EF4444" : ACCENT;
                      e.currentTarget.style.borderColor = c;
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${c}40`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    animate={{ opacity: canInvite ? 1 : 0.6, scale: canInvite ? 1 : 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    style={{ backgroundColor: ACCENT }}
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3.5 text-sm font-medium text-white"
                  >
                    <PaperPlaneRight size={15} weight="fill" aria-hidden />
                    Send invite
                  </motion.button>
                </form>

        {/* Invitee list */}
        <ul className="mt-4 flex max-h-[176px] flex-col gap-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {members.map((m) => (
              <motion.li
                key={m.id}
                layout
                initial={{ opacity: 0, height: 0, y: -4 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
                className="flex items-center gap-3 rounded-lg px-1 py-1.5"
              >
                <Avatar member={m} size={28} />
                <span className="min-w-0 flex-1 truncate text-sm text-custom-gray-700 no-underline dark:text-custom-gray-300">
                  {m.email}
                </span>
                <StatusBadge status={m.status} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Seats + copy */}
        <div className="mt-4 rounded-xl border border-custom-gray-200 bg-custom-gray-50 p-3 dark:border-app-border-dark dark:bg-app-bg-dark">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-custom-gray-900 dark:text-app-text-dark">
              {used}/{SEATS} team seats used
            </span>
            <button
              type="button"
              onClick={copyLink}
              className="flex items-center gap-1.5 text-xs font-medium text-custom-gray-600 transition-colors hover:text-custom-gray-900 dark:text-custom-gray-400 dark:hover:text-white"
            >
              {copied ? (
                <>
                  <Check size={13} weight="bold" aria-hidden /> Copied link
                </>
              ) : (
                <>
                  <Copy size={13} aria-hidden /> Copy link
                </>
              )}
            </button>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-custom-gray-200 dark:bg-custom-gray-800">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: ACCENT }}
              initial={false}
              animate={{ width: `${seatPct * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 26 }}
            />
          </div>
        </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
