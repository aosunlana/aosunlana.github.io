"use client";

import Link from "next/link";
import Image from "next/image";

type Company = {
  name: string;
  href: string;
  logo: string;
  description: string;
};

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


export default function BrandWidget() {
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
                <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-app-card-dark overflow-hidden shrink-0">
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
