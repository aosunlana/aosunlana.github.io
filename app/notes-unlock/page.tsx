"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, House } from "@phosphor-icons/react";

export default function NotesUnlockPage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value || loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/notes-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      });
      if (res.ok) {
        // Cookie is set. Reload the same URL so the middleware serves the notes.
        window.location.reload();
        return;
      }
      setError(true);
    } catch {
      setError(true);
    }
    setLoading(false);
  }

  const hasValue = value.length > 0;
  const dots = Array.from({ length: Math.min(value.length, 12) });

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-4 text-custom-gray-900 dark:bg-app-bg-dark dark:text-app-text-dark">
      <div className="flex w-full max-w-[340px] flex-col items-center text-center">
        <motion.span
          animate={
            error
              ? { x: [0, -6, 6, -4, 4, 0] }
              : { scale: hasValue ? 1.06 : 1 }
          }
          transition={
            error
              ? { duration: 0.4 }
              : { type: "spring", stiffness: 400, damping: 15 }
          }
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-custom-gray-100 text-custom-gray-700 dark:bg-app-card-dark dark:text-app-text-dark"
        >
          <Lock size={24} aria-hidden="true" />
        </motion.span>

        <h1 className="mt-6 font-display text-2xl font-semibold tracking-[-0.01em]">
          These notes are private
        </h1>
        <p className="mt-2 text-[0.95rem] leading-6 text-custom-gray-500 dark:text-custom-gray-400">
          Enter the password to read them.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 w-full">
          <div className="relative">
            <input
              type="password"
              autoFocus
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Password"
              aria-label="Password"
              aria-invalid={error}
              className={`h-12 w-full rounded-xl border bg-white pl-4 pr-12 text-xl leading-none tracking-[0.25em] text-custom-gray-900 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[0.95rem] placeholder:tracking-normal placeholder:text-custom-gray-400 dark:bg-app-card-dark dark:text-app-text-dark ${
                error
                  ? "border-custom-red-400 focus:border-custom-red-500 focus:ring-2 focus:ring-custom-red-500/25"
                  : "border-custom-gray-200 focus:border-app-link-text-hover focus:ring-2 focus:ring-app-link-text-hover/25 dark:border-app-border-dark"
              }`}
            />

            <motion.button
              type="submit"
              disabled={loading}
              aria-label="Unlock"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              animate={{ scale: hasValue ? 1 : 0.9, opacity: hasValue ? 1 : 0.55 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-custom-gray-900 text-white transition-colors hover:bg-custom-gray-700 disabled:opacity-50 dark:bg-app-text-dark dark:text-app-bg-dark dark:hover:bg-custom-gray-300"
            >
              <motion.span
                animate={{ x: hasValue ? [0, 3, 0] : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight size={17} aria-hidden="true" />
              </motion.span>
            </motion.button>
          </div>
          {/* Character dots: each keystroke springs a dot in, deleting pops it out */}
          <div className="mt-3 flex h-4 items-center justify-center gap-1.5">
            <AnimatePresence mode="popLayout">
              {dots.map((_, i) => (
                <motion.span
                  key={i}
                  layout
                  initial={{ scale: 0, y: 6, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 24 }}
                  className={`h-1.5 w-1.5 rounded-full ${
                    error ? "bg-custom-red-500" : "bg-app-link-text-hover"
                  }`}
                />
              ))}
            </AnimatePresence>
          </div>

          <p
            className={`mt-1 h-4 text-xs transition-opacity ${
              error ? "text-custom-red-500 opacity-100" : "opacity-0"
            }`}
            aria-live="polite"
          >
            That password is not right.
          </p>
        </form>

        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-custom-gray-500 transition-colors hover:text-app-link-text-hover dark:text-custom-gray-400"
        >
          <House size={15} aria-hidden="true" />
          Back home
        </Link>
      </div>
    </div>
  );
}
