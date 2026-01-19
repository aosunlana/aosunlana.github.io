"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

export type NavItem =
  | { label: string; href: string; icon: string; svg?: never }
  | { label: string; href: string; icon?: never; svg: string };

export const NAV: NavItem[] = [
  { label: "Hello",       href: "/",           icon: "solar:hand-shake-outline" },
  { label: "Playground",  href: "/playground", icon: "solar:pallete-2-outline" },
  { label: "Tools",       href: "/tools",      icon: "solar:library-outline" },
  { label: "Bookmarks",   href: "/bookmarks",  icon: "solar:folder-with-files-outline" },
  { label: "Notes",       href: "/notes",      icon: "clarity:digital-signature-line" },
  { label: "Let’s Talk",  href: "/lets-talk",  icon: "solar:smile-circle-outline" },
];

export default function SubPageMenu() {
  return (
    <nav className="rounded-[16px] border border-custom-gray-200 dark:border-app-border-dark overflow-hidden">
      {/* MOBILE: 2 columns x 3 rows */}
      <div className="grid grid-cols-2 md:hidden">
        {NAV.map((item, i) => {
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
                className="absolute right-3 h-4 w-4 opacity-0 -translate-y-[2px] translate-x-[2px] transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-custom-gray-700 dark:text-app-text-dark group-hover:text-app-link-text-hover dark:group-hover:text-app-link-text-hover"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>

      {/* DESKTOP: 3 columns x 2 rows */}
      <div className="hidden md:grid grid-cols-3">
        {NAV.map((item, idx) => {
          const row = Math.floor(idx / 3);
          const col = idx % 3;

          const borders =
            row === 0
              ? col < 2
                ? "border-r"
                : ""
              : col < 2
              ? "border-t border-r"
              : "border-t";

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
                className="absolute right-3 h-4 w-4 opacity-0 -translate-y-[2px] translate-x-[2px] transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-custom-gray-700 dark:text-app-text-dark group-hover:text-app-link-text-hover dark:group-hover:text-app-link-text-hover"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
