"use client";

import { ArrowUpRight, Buildings } from "@phosphor-icons/react";

type Company = {
  name: string;
  href: string | null;
  initials: string;
  role: string;
  dates: string;
};

/* ---------- DATA ----------
 * No logo assets exist for these companies, so this renders text initials
 * instead of image logos (avoids shipping broken <Image> references). Only
 * EventHome (Upsert Labs Limited) has a confirmed public URL; the rest link
 * to nothing rather than a guessed address. */
const COMPANIES: Company[] = [
  {
    name: "Upsert Labs Limited",
    href: "https://eventhome.app",
    initials: "UL",
    role: "Co-Founder & CEO",
    dates: "Present",
  },
  {
    name: "Tredar",
    href: null,
    initials: "TR",
    role: "Founder",
    dates: "Present",
  },
  {
    name: "Dreamlabs Innovations",
    href: null,
    initials: "DI",
    role: "Software Engineer",
    dates: "2026",
  },
  {
    name: "Aspen Publishing",
    href: null,
    initials: "AP",
    role: "Software Engineer",
    dates: "May 2024 - Jan 2025",
  },
];

export default function BrandWidget() {
  return (
    <section className="w-full">
      <ul className="flex flex-col">
        {COMPANIES.map((c) => {
          const Row = c.href ? "a" : "div";
          return (
            <li key={c.name}>
              <Row
                {...(c.href
                  ? { href: c.href, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-center gap-4 py-3"
              >
                {/* Initials tile in place of a logo */}
                <div className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-custom-gray-900 text-white dark:bg-app-card-dark dark:text-app-text-dark">
                  {c.initials ? (
                    <span className="text-sm font-semibold tracking-wide">{c.initials}</span>
                  ) : (
                    <Buildings size={20} aria-hidden="true" />
                  )}
                </div>

                {/* Name + role + dates */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold leading-tight text-custom-gray-900 dark:text-app-text-dark">
                      {c.name}
                    </h3>
                  </div>
                  <p className="truncate text-sm leading-5 text-custom-gray-500 dark:text-custom-gray-400">
                    {c.role}{" "}
                    <span className="text-custom-gray-400 dark:text-custom-gray-600">
                      &middot; {c.dates}
                    </span>
                  </p>
                </div>

                {/* Hover arrow, only shown when the row actually links out */}
                {c.href && (
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 -translate-x-1 text-custom-gray-400 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-app-link-text-hover dark:text-custom-gray-600 dark:group-hover:text-app-link-text-hover"
                  />
                )}
              </Row>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
