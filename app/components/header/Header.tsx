// app/components/header/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV } from "@/components/SubPageMenu";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Homepage keeps the avatar + name.
  if (isHome) {
    return (
      <header className="w-full">
        <div className="flex items-center gap-4 pb-8 md:gap-5">
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-custom-gray-100 dark:bg-app-card-dark"
          >
            <Image
              src="/avatar.svg"
              alt="Avatar"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              priority
            />
          </Link>
          <div>
            <h1 className="font-display text-[16px] font-semibold leading-8 tracking-[0.5px] text-custom-gray-900 dark:text-app-text-dark">
              Abdulsamad Osunlana
            </h1>
            <p className="text-base leading-6 tracking-[0.5px] text-custom-gray-500 dark:text-app-text-dark">
              Software Engineer <span className="text-custom-gray-500">/</span> Founder
            </p>
          </div>
        </div>
      </header>
    );
  }

  // Every other page: a breadcrumb pinned to the top-left corner of the viewport.
  const isNotesDetail = pathname.startsWith("/notes/") && pathname !== "/notes";
  const activeNavItem = NAV.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href)
  );

  const crumbs: { label: string; href?: string }[] = isNotesDetail
    ? [{ label: "Index", href: "/" }, { label: "Notes", href: "/notes" }]
    : [{ label: "Index", href: "/" }, { label: activeNavItem?.label ?? "Page" }];

  return (
    <nav
      aria-label="Breadcrumb"
      className="absolute left-4 top-3 z-40 flex h-9 min-w-0 items-center gap-2 text-sm text-custom-gray-500 md:left-6 dark:text-custom-gray-400"
    >
      {crumbs.map((c, i) => (
        <span key={c.label} className="flex min-w-0 items-center gap-2">
          {i > 0 && <span aria-hidden="true">›</span>}
          {c.href ? (
            <Link
              href={c.href}
              className="transition-colors hover:text-custom-gray-900 dark:hover:text-app-text-dark"
            >
              {c.label}
            </Link>
          ) : (
            <span className="truncate text-custom-gray-900 dark:text-app-text-dark">
              {c.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
