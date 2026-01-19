"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

type Company = {
  name: string;
  href: string;
  logo: string;
  description: string;
};

type NavItem =
  | { label: string; href: string; icon: string; svg?: never }
  | { label: string; href: string; icon?: never; svg: string };

/* ---------- DATA ---------- */
const COMPANIES: Company[] = [
  {
    name: "Tempo (YC23)",
    href: "https://www.tempo.new/",
    logo: "/images/tempo.svg",
    description: "Where I’m currently designing products that scale.",
  },
  {
    name: "Rayform",
    href: "https://rayform-tech.framer.website/",
    logo: "/images/rayform.svg",
    description: "My playground for building and exploring experimental ideas.",
  },
  {
    name: "Sidebridge",
    href: "https://sidebridge.io",
    logo: "/images/sidebridge.svg",
    description: "Crafting components and pixel-perfect systems.",
  },
];

const NAV: NavItem[] = [
  { label: "Hello",       href: "/",           icon: "solar:hand-shake-outline" },
  { label: "Playground",  href: "/playground", icon: "solar:pallete-2-outline" },
  { label: "Tools",       href: "/tools",      icon: "solar:library-outline" },
  { label: "Bookmarks",   href: "/bookmarks",  icon: "solar:folder-with-files-outline" },
  { label: "Notes",       href: "/notes",      svg:  "/images/notes.svg" }, // local SVG
  { label: "About Me",    href: "/about",      icon: "solar:smile-circle-outline" },
];

export default function Showcase() {
  return (
    <section className="mx-auto w-full max-w-[600pxpx] pb-4">
      {/* ===================== COMPANIES ===================== */}
      <div className="rounded-[16px] border border-custom-gray-200 dark:border-app-border-dark overflow-hidden">
        {/* Mobile: 1 col with row dividers; Desktop: 3 cols with right dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {COMPANIES.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className={[
                "group relative block p-4",
                // MOBILE row dividers
                "border-b last:border-b-0",
                // DESKTOP: right divider on first two only
                "md:border-b-0 md:border-r md:last:border-r-0",
                "border-custom-gray-200 dark:border-app-border-dark",
              ].join(" ")}
            >
              {/* MOBILE: icon to the left of text; DESKTOP: stacked */}
              <div className="flex items-start gap-3 md:block">
                {/* Logo — adjust size here if you need (h-12/w-12 or h-14/w-14) */}
                <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-app-logo-dark overflow-hidden shrink-0">
                  <Image
                    src={c.logo}
                    alt={`${c.name} logo`}
                    width={48}
                    height={48}
                    className="h-8 w-8 object-contain"
                    priority
                  />
                  {/* Shimmer (no running logo) */}
                  <span className="pointer-events-none absolute inset-0 overflow-hidden">
                    <span className="shimmer shimmer-1" />
                    <span className="shimmer shimmer-2" />
                  </span>
                </div>

                {/* Text — MOBILE: no extra top margin; DESKTOP: add mt-4 */}
                <div className="flex-1 md:mt-4">
                  <h3 className="text-base leading-6 tracking-[0.5px] font-semibold text-custom-gray-900 dark:text-app-text-dark">
                    {c.name}
                  </h3>
                  <p className="mt-[2px] text-sm leading-5 tracking-[0.5px] text-custom-gray-500 dark:text-app-text-dark">
                    {c.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tiny overlap between sections (-0.5px) */}
      <div className="-mt-[0.5px] md:-mt-[1px]" />

    {/* ---------- Links (separate mobile vs desktop) ---------- */}
<nav className="rounded-[16px] border border-custom-gray-200 dark:border-app-border-dark bg-white dark:bg-custom-gray-900 overflow-hidden">

  {/* MOBILE: 2 columns x 3 rows */}
  <div className="grid grid-cols-2 md:hidden">
    {NAV.map((item, i) => {
      // Mobile borders: left col has right border; rows after first have top border
      const col = i % 2;
      const row = Math.floor(i / 2);
      const borders =
        (col === 0 ? "border-r " : "") +
        (row > 0 ? "border-t " : "");

      return (
        <Link
          key={item.label}
          href={item.href}
          className={`group relative flex h-12 items-center gap-2 px-4 text-sm tracking-[0.5px] text-custom-gray-900 dark:text-app-text-dark ${borders} border-custom-gray-200 dark:border-app-border-dark`}
        >
          {item.icon ? (
            <Icon icon={item.icon} className="h-5 w-5 text-custom-gray-700 dark:text-app-text-dark shrink-0" />
          ) : (
            <Image
              src={item.svg!}
              alt={`${item.label} icon`}
              width={20}
              height={20}
              className="h-5 w-5 object-contain shrink-0"
            />
          )}
          <span>{item.label}</span>

          <Icon
            icon="solar:arrow-right-up-outline"
            className="absolute right-3 h-4 w-4 opacity-0 -translate-y-[2px] translate-x-[2px] transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-custom-gray-700 dark:text-app-text-dark"
            aria-hidden="true"
          />
        </Link>
      );
    })}
  </div>

  {/* DESKTOP: 3 columns x 2 rows — original preset */}
  <div className="hidden md:grid grid-cols-3">
    {NAV.map((item, idx) => {
      const row = Math.floor(idx / 3); // 0 or 1
      const col = idx % 3;             // 0,1,2

      // Desktop borders:
      // Row 0 → only right borders on first two cells
      // Row 1 → top on all + right borders on first two
      const borders =
        row === 0
          ? (col < 2 ? "border-r" : "")
          : (col < 2 ? "border-t border-r" : "border-t");

      return (
        <Link
          key={item.label}
          href={item.href}
          className={`group relative flex h-12 items-center gap-2 px-4 text-sm tracking-[0.5px] text-custom-gray-900 dark:text-app-text-dark ${borders} border-custom-gray-200 dark:border-app-border-dark`}
        >
          {item.icon ? (
            <Icon icon={item.icon} className="h-5 w-5 text-custom-gray-700 dark:text-app-text-dark shrink-0" />
          ) : (
            <Image
              src={item.svg!}
              alt={`${item.label} icon`}
              width={20}
              height={20}
              className="h-5 w-5 object-contain shrink-0"
            />
          )}
          <span>{item.label}</span>

          <Icon
            icon="solar:arrow-right-up-outline"
            className="absolute right-3 h-4 w-4 opacity-0 -translate-y-[2px] translate-x-[2px] transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-custom-gray-700 dark:text-app-text-dark"
            aria-hidden="true"
          />
        </Link>
      );
    })}
  </div>
</nav>


      {/* ===== CSS (shimmer only, tunable) ===== */}
      <style jsx global>{`
        /* Adjust shimmer look here */
        :root {
          --shimmer-angle: -20deg;  /* slant */
          --shimmer-speed: 900ms;   /* speed */
          --shimmer-alpha-1: 0.70;  /* brightness of wipe 1 */
          --shimmer-alpha-2: 0.45;  /* brightness of wipe 2 */
          --shimmer-width: 55%;     /* stripe width */
        }
        .group:hover .shimmer { opacity: 1; }

        .shimmer {
          position: absolute;
          top: -30%;
          bottom: -30%;
          width: var(--shimmer-width);
          transform: skewX(var(--shimmer-angle));
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, var(--shimmer-alpha-1)) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          opacity: 0;
          pointer-events: none;
        }
        .shimmer-1 {
          left: -20%;
          animation: wipe var(--shimmer-speed) linear infinite;
        }
        .shimmer-2 {
          left: -35%;
          animation: wipe var(--shimmer-speed) linear infinite;
          animation-delay: 120ms;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, var(--shimmer-alpha-2)) 50%,
            rgba(255, 255, 255, 0) 100%
          );
        }
        @keyframes wipe {
          0%   { transform: translateX(-120%) skewX(var(--shimmer-angle)); }
          100% { transform: translateX(220%)  skewX(var(--shimmer-angle)); }
        }
      `}</style>
    </section>
  );
}
