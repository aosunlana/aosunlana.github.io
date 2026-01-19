// app/components/header/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { NAV } from "@/components/SubPageMenu";

const PAGE_SUMMARIES: Record<string, string> = {
  "/": "Product Designer / Design Engineer",
  "/playground": "Sandbox for design experiments and prototypes.",
  "/tools": "Useful tools and utilities I rely on.",
  "/bookmarks": "Curated links, inspiration, and references.",
  "/notes": "Thoughts, case studies, and writing.",
  "/lets-talk": "Ways to get in touch and start a conversation.",
};

export default function Header() {
  const pathname = usePathname();

  const activeNavItem = NAV.find((item) => {
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  });

  const isHome = pathname === "/";
  const isNotesDetail = pathname.startsWith("/notes/") && pathname !== "/notes";
  const showAvatar = !activeNavItem || isHome;
  const tileHref = isNotesDetail ? "/notes" : "/";

  const title = isHome
    ? "Emmanuel A. Priestley"
    : isNotesDetail
    ? "Back to Notes"
    : activeNavItem?.label ?? "Page";

  const subtitleKey = activeNavItem?.href ?? "/";
  const subtitle = isNotesDetail
    ? "See all notes and writing in one place."
    : PAGE_SUMMARIES[subtitleKey] ?? PAGE_SUMMARIES["/"];

  return (
    <header className="w-full">
      <div className="flex items-center gap-4 md:gap-5 pb-8 ">
        {/* Avatar / Page Icon tile */}
        <Link
          href={tileHref}
          aria-label="Profile"
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-custom-gray-100 dark:bg-app-card-dark overflow-hidden"
        >
          {isNotesDetail ? (
            <Icon
              icon="ic:outline-keyboard-backspace"
              className="h-7 w-7 text-custom-gray-900 dark:text-app-text-dark"
              aria-hidden="true"
            />
          ) : showAvatar || !activeNavItem ? (
            <Image
              src="/avatar.svg"
              alt="Avatar"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              priority
            />
          ) : activeNavItem.icon ? (
            <Icon
              icon={activeNavItem.icon}
              className="h-7 w-7 text-custom-gray-900 dark:text-app-text-dark"
              aria-hidden="true"
            />
          ) : (
            <Image
              src={activeNavItem.svg!}
              alt={`${activeNavItem.label} icon`}
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          )}
        </Link>

        {/* Page title + subtitle */}
        <div>
          <h1 className="text-[18px] leading-9 tracking-[0.5px] font-semibold text-custom-gray-900 dark:text-app-text-dark">
            {title}
          </h1>
          <p className="text-base leading-6 tracking-[0.5px] text-custom-gray-500 dark:text-app-text-dark">
            {isHome ? (
              <>
                Product Designer <span className="text-custom-gray-500">/</span> Design Engineer
              </>
            ) : (
              subtitle
            )}
          </p>
        </div>
      </div>
    </header>
  );
}
