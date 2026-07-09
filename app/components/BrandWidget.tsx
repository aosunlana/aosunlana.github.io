"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";

type Company = {
  name: string;
  href: string;
  logo: string;
  role: string;
  dates: string;
  badge?: string;
};

/* ---------- DATA ---------- */
const COMPANIES: Company[] = [
  {
    name: "Tempo",
    badge: "YC S23",
    href: "https://www.tempo.new/",
    logo: "/images/tempo.svg",
    role: "Design Engineer",
    dates: "2025",
  },
  {
    name: "Digit Insurance",
    href: "https://www.godigit.com/",
    logo: "/images/digit.svg",
    role: "Product Designer",
    dates: "2022 - 2025",
  },
  {
    name: "Carbon Business (Formerly Vella Finance)",
    href: "https://www.getcarbon.co/",
    logo: "/images/carbon.svg",
    role: "Product Designer",
    dates: "2021 - 2023",
  },
];

export default function BrandWidget() {
  return (
    <section className="w-full">
      <ul className="flex flex-col">
        {COMPANIES.map((c) => (
          <li key={c.name}>
            <Link
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 py-3"
            >
              {/* Logo tile */}
              <div className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-custom-gray-900 dark:bg-app-card-dark">
                <Image
                  src={c.logo}
                  alt={`${c.name} logo`}
                  width={48}
                  height={48}
                  className="h-7 w-7 object-contain grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                />
              </div>

              {/* Name + role + dates */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold leading-tight text-custom-gray-900 dark:text-app-text-dark">
                    {c.name}
                  </h3>
                  {c.badge && (
                    <span className="shrink-0 rounded-full bg-custom-gray-100 dark:bg-app-card-dark px-2 py-0.5 text-[11px] font-medium text-custom-gray-500 dark:text-app-text-dark">
                      {c.badge}
                    </span>
                  )}
                </div>
                <p className="truncate text-sm leading-5 text-custom-gray-500 dark:text-custom-gray-400">
                  {c.role}{" "}
                  <span className="text-custom-gray-400 dark:text-custom-gray-600">
                    &middot; {c.dates}
                  </span>
                </p>
              </div>

              {/* Hover arrow */}
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="shrink-0 -translate-x-1 text-custom-gray-400 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-app-link-text-hover dark:text-custom-gray-600 dark:group-hover:text-app-link-text-hover"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
