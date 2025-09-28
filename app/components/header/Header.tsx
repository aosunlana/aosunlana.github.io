"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Icon as Iconify } from "@iconify/react";

/* helper to use Iconify icons as components */
const Icon = (name: string) =>
  ({ className = "" }: { className?: string }) =>
    <Iconify icon={name} className={className} />;

/* ✅ icons (updated names for Hello/Playground) */
const HelloIcon      = Icon("solar:hand-shake-outline");
const PlaygroundIcon = Icon("solar:pallete-2-outline");
const ToolsIcon      = Icon("solar:library-outline");
const BookmarksIcon  = Icon("solar:folder-with-files-outline");
const NotesIcon      = Icon("solar:notebook-outline");
const TalkIcon       = Icon("solar:smile-circle-outline");

const ExploreIcon    = Icon("solar:widget-add-outline");
const CloseIcon      = Icon("ic:round-close"); // Google Material

type IconType = React.ComponentType<{ className?: string }>;
type Tab = { label: string; href: string; icon: IconType };

const TABS: Tab[] = [
  { label: "Hello",       href: "/",           icon: HelloIcon },
  { label: "Playground",  href: "/playground", icon: PlaygroundIcon },
  { label: "Tools",       href: "/tools",      icon: ToolsIcon },
  { label: "Bookmarks",   href: "/bookmarks",  icon: BookmarksIcon },
  { label: "Notes",       href: "/notes",      icon: NotesIcon },
  { label: "Let’s Talk",  href: "/lets-talk",  icon: TalkIcon }, // last
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    // 16px top padding on mobile only
    <header className="w-full pt-4 md:pt-0">
      <nav aria-label="Primary" className="max-w-full">
        {/* ===== Mobile bar ===== */}
        <div className="md:hidden flex items-center justify-between h-12">
          {/* Avatar — no right border */}
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="Profile"
              className="inline-flex h-10 w-10 items-center justify-center bg-gray-100 overflow-hidden rounded-xl"
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

          {/* Explore icon-only button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex items-center justify-center border border-custom-gray-200 rounded-xl h-10 w-10"
          >
            <ExploreIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* ===== Desktop nav (not full width) ===== */}
        <ul className="hidden md:inline-flex h-12 items-stretch rounded-2xl border border-custom-gray-200 bg-white text-[18px] font-normal overflow-hidden">
          {/* Avatar with right border */}
          <li className="shrink-0 h-full border-r border-r-custom-gray-200">
            <Link
              href="/"
              aria-label="Profile"
              className="inline-flex h-full w-12 items-center justify-center bg-gray-100 overflow-hidden"
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

          {/* Each item has right border; last has none */}
          {TABS.map(({ label, href, icon: I }) => (
            <li
              key={href}
              className="shrink-0 h-full border-r border-r-custom-gray-200 last:border-r-0"
            >
              <Link href={href} className="flex h-full items-center gap-2 px-3 py-0">
                <I className="h-5 w-5 text-gray-700 shrink-0" aria-hidden="true" />
                <span className="text-custom-gray-800">{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* ===== Mobile overlay menu ===== */}
        {open && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-white
                       pt-[calc(env(safe-area-inset-top)+16px)]" /* 16px top + safe area */
            role="dialog"
            aria-modal="true"
          >
            {/* Top row inside overlay */}
            <div className="flex items-center justify-between h-12 px-4">
              <div className="flex items-center">
                <Link
                  href="/"
                  aria-label="Profile"
                  className="inline-flex h-10 w-10 items-center justify-center bg-gray-100 overflow-hidden rounded-xl"
                  onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center border border-custom-gray-200 rounded-xl h-10 w-10"
              >
                <CloseIcon className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* 16px space between top row and grid */}
            <div className="mt-4 mx-4 rounded-2xl border border-custom-gray-200 overflow-hidden">
              {/* No gaps; centered; each tile 48px tall; font 16px */}
              <div className="grid grid-cols-2 gap-0">
                {TABS.map(({ label, href, icon: I }, i) => {
                  const col = i % 2;            // 0 left, 1 right
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
                      onClick={() => setOpen(false)}
                      className={[
                        "flex h-12 items-center justify-center text-base font-normal text-custom-gray-800",
                        borders,
                        "border-custom-gray-200",
                      ].join(" ")}
                    >
                      <I className="h-5 w-5 text-gray-700 shrink-0 mr-2" aria-hidden="true" />
                      <span className="text-center">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
