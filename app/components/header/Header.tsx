"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Hand,
  Palette,
  Wrench,
  Bookmark,
  PencilLine,
  Smile,
} from "lucide-react";

type Tab = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const TABS: Tab[] = [
  { label: "Hello", href: "/", icon: Hand },
  { label: "Playground", href: "/playground", icon: Palette },
  { label: "Tools", href: "/tools", icon: Wrench },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "Notes", href: "/notes", icon: PencilLine },
  { label: "Let’s Talk", href: "/lets-talk", icon: Smile },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full flex justify-center">
      <nav aria-label="Primary" className="mt-6 max-w-full">
        <ul className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm overflow-x-auto">
          {/* Avatar */}
          <li className="shrink-0">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 overflow-hidden"
              aria-label="Profile"
            >
              {/* Replace /avatar.png with your image (put it in /public) */}
              <Image
                src="/avatar.png"
                alt="Avatar"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            </Link>
          </li>

          {/* Tabs */}
          {TABS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                    active
                      ? "border-gray-300 bg-gray-100 text-gray-900"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active
                        ? "text-gray-700"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
