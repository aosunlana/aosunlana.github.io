"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  HandWaving,
  Palette,
  Toolbox,
  BookmarkSimple,
  PenNib,
  Smiley,
  ArrowUpRight,
  Lock,
  type IconProps,
} from "@phosphor-icons/react";

export type NavItem = {
  label: string;
  href: string;
  Icon: ComponentType<IconProps>;
  locked?: boolean;
};

export const NAV: NavItem[] = [
  { label: "Hello", href: "/", Icon: HandWaving },
  { label: "Playground", href: "/playground", Icon: Palette },
  { label: "Tools", href: "/tools", Icon: Toolbox },
  { label: "Bookmarks", href: "/bookmarks", Icon: BookmarkSimple },
  { label: "Notes", href: "/notes", Icon: PenNib, locked: true },
  { label: "About Me", href: "/about", Icon: Smiley },
];

export default function SubPageMenu() {
  const renderItem = (item: NavItem, borders: string) => (
    <Link
      key={item.label}
      href={item.href}
      className={`group relative flex h-12 items-center gap-2 px-4 text-sm tracking-[0.5px] text-custom-gray-900 dark:text-app-text-dark ${borders} border-custom-gray-200 dark:border-app-border-dark`}
    >
      <item.Icon
        size={20}
        aria-hidden="true"
        className="shrink-0 text-custom-gray-700 dark:text-app-text-dark"
      />
      <span>{item.label}</span>

      {/* Locked items show a padlock at rest; every item reveals the arrow on hover. */}
      {item.locked && (
        <Lock
          size={15}
          aria-hidden="true"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gray-400 opacity-100 transition-opacity duration-150 group-hover:opacity-0 dark:text-custom-gray-500"
        />
      )}

      <ArrowUpRight
        size={16}
        aria-hidden="true"
        className="absolute right-3 top-1/2 -translate-y-1/2 translate-x-[3px] text-custom-gray-700 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-app-link-text-hover dark:text-app-text-dark dark:group-hover:text-app-link-text-hover"
      />
    </Link>
  );

  return (
    <nav className="rounded-[16px] border border-custom-gray-200 dark:border-app-border-dark overflow-hidden">
      {/* MOBILE: 2 columns x 3 rows */}
      <div className="grid grid-cols-2 md:hidden">
        {NAV.map((item, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const borders = (col === 0 ? "border-r " : "") + (row > 0 ? "border-t " : "");
          return renderItem(item, borders);
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
          return renderItem(item, borders);
        })}
      </div>
    </nav>
  );
}
