"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon as Iconify } from "@iconify/react";

/* helper to use Iconify icons as components (with displayName) */
function makeIcon(name: string) {
  const Wrapped: React.FC<{ className?: string }> = ({ className = "" }) => (
    <Iconify icon={name} className={className} />
  );
  Wrapped.displayName = `Icon(${name})`;
  return Wrapped;
}

/* Icons (✅ corrected names) */
const HelloIcon      = makeIcon("solar:hand-shake-outline");       
const PlaygroundIcon = makeIcon("solar:pallete-2-outline");       
const ToolsIcon      = makeIcon("solar:library-outline");
const BookmarksIcon  = makeIcon("solar:folder-with-files-outline");
const NotesIcon      = makeIcon("solar:notebook-outline");
const TalkIcon       = makeIcon("solar:smile-circle-outline");
const ExploreIcon    = makeIcon("solar:widget-add-outline");
const CloseIcon      = makeIcon("ic:round-close");

type IconType = React.ComponentType<{ className?: string }>;
type Tab = { label: string; href: string; icon: IconType };

const TABS: Tab[] = [
  { label: "Hello",       href: "/",           icon: HelloIcon },
  { label: "Playground",  href: "/playground", icon: PlaygroundIcon },
  { label: "Tools",       href: "/tools",      icon: ToolsIcon },
  { label: "Bookmarks",   href: "/bookmarks",  icon: BookmarksIcon },
  { label: "Notes",       href: "/notes",      icon: NotesIcon },
  { label: "Let’s Talk",  href: "/lets-talk",  icon: TalkIcon },
];

/* Scroll lock helpers */
function addOverflowHidden() {
  document.documentElement.classList.add("overflow-hidden");
  document.body.classList.add("overflow-hidden");
}
function removeOverflowHidden() {
  document.documentElement.classList.remove("overflow-hidden");
  document.body.classList.remove("overflow-hidden");
}

export default function Header() {
  const [mounted, setMounted] = useState(false); // overlay in DOM
  const [visible, setVisible] = useState(false); // animation state
  const timeoutRef = useRef<number | null>(null);
  const DURATION = 220; // ms

  const open = () => {
    if (mounted) return;
    setMounted(true);
    // ensure first frame paints before animating (prevents flicker)
    requestAnimationFrame(() => setVisible(true));
    addOverflowHidden();
  };

  const startClose = () => {
    if (!mounted) return;
    setVisible(false);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setMounted(false);
      removeOverflowHidden();
      timeoutRef.current = null;
    }, DURATION + 50);
  };

  const onOverlayTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (!visible) {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setMounted(false);
      removeOverflowHidden();
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      removeOverflowHidden();
    };
  }, []);

  return (
    <header className="w-full pt-4 md:pt-0">
      <nav aria-label="Primary" className="max-w-full">
        {/* ===== Mobile bar ===== */}
        <div className="md:hidden flex items-center justify-between h-12">
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="Profile"
              className="inline-flex h-10 w-10 items-center justify-center bg-custom-gray-100 overflow-hidden rounded-xl"
            >
              <Image
                src="/avatar.svg"
                alt="Avatar"
                width={40}
                height={40}
                className="h-8 w-8 object-cover"
              />
            </Link>
          </div>

          <button
            type="button"
            onClick={open}
            aria-label="Open menu"
            className="inline-flex items-center justify-center border border-custom-gray-200 rounded-xl h-10 w-10"
          >
            <ExploreIcon className="h-5 w-5 text-custom-gray-700" />
          </button>
        </div>

        {/* ===== Desktop nav (inline, not full width) ===== */}
        <ul className="hidden md:inline-flex h-12 items-stretch rounded-2xl border border-custom-gray-200 bg-white text-[18px] font-normal overflow-hidden">
          <li className="shrink-0 h-full border-r border-r-custom-gray-200">
            <Link
              href="/"
              aria-label="Profile"
              className="inline-flex h-full w-12 items-center justify-center bg-custom-gray-100 overflow-hidden"
            >
              <Image
                src="/avatar.svg"
                alt="Avatar"
                width={40}
                height={40}
                className="h-8 w-8 object-cover"
              />
            </Link>
          </li>

          {TABS.map(({ label, href, icon: I }) => (
            <li
              key={href}
              className="shrink-0 h-full border-r border-r-custom-gray-200 last:border-r-0"
            >
              <Link href={href} className="flex h-full items-center gap-2 px-3 py-0">
                <I className="h-5 w-5 text-custom-gray-700 shrink-0" aria-hidden="true" />
                <span className="text-custom-gray-800">{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* ===== Mobile overlay (no flicker, centered items, cooler transition) ===== */}
        {mounted && (
          <div
            role="dialog"
            aria-modal="true"
            onTransitionEnd={onOverlayTransitionEnd}
            onClick={startClose} // tap background closes
            className={[
              "md:hidden fixed inset-0 z-50",
              // Subtle scrim + GPU-friendly fade
              "bg-white/98 backdrop-blur-[2px]",
              "pt-[calc(env(safe-area-inset-top)+16px)]",
              "transition-opacity duration-200 ease-out",
              visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
            ].join(" ")}
          >
            {/* inner panel; stop propagation so clicks inside don't close */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="mx-0 h-full"
            >
              {/* Top row (avatar & close) – fade only, no translate (prevents shake) */}
              <div
                className={[
                  "flex items-center justify-between h-12 px-4",
                  "transition-opacity duration-200 ease-out",
                  visible ? "opacity-100" : "opacity-0",
                ].join(" ")}
              >
                <div className="flex items-center">
                  <Link
                    href="/"
                    aria-label="Profile"
                    className="inline-flex h-10 w-10 items-center justify-center bg-custom-gray-100 overflow-hidden rounded-xl"
                    onClick={startClose}
                  >
                    <Image
                      src="/avatar.svg"
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="h-8 w-8 object-cover"
                    />
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={startClose}
                  aria-label="Close menu"
                  className="inline-flex items-center justify-center border border-custom-gray-200 rounded-xl h-10 w-10"
                >
                  <CloseIcon className="h-6 w-6 text-custom-gray-700" />
                </button>
              </div>

              {/* Menu – centered content, with 12px inset (px-3), 48px tall tiles */}
              <div
                className={[
                  "mt-4 mx-4 rounded-2xl border border-custom-gray-200 overflow-hidden",
                  // cool transition: scale + fade (GPU-accelerated)
                  "transform-gpu transition-all duration-200 ease-out",
                  visible ? "opacity-100 scale-100" : "opacity-0 scale-95",
                ].join(" ")}
              >
                <div className="grid grid-cols-2 gap-0">
                  {TABS.map(({ label, href, icon: I }, i) => {
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    const isLastRow = row === Math.floor((TABS.length - 1) / 2);

                    const borders =
                      col === 0
                        ? isLastRow
                          ? "border-r"
                          : "border-b border-r"
                        : isLastRow
                          ? ""
                          : "border-b";

                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={startClose}
                        className={[
                          // ⬇️ centered content, 12px side padding, 48px tall, 16px text
                          "flex h-12 items-center justify-center px-3 gap-2 text-base font-normal text-custom-gray-800",
                          borders,
                          "border-custom-gray-200",
                        ].join(" ")}
                      >
                        <I className="h-5 w-5 text-custom-gray-700 shrink-0" aria-hidden="true" />
                        <span className="text-center">{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
