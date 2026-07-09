"use client";

import { ArrowUpRight, LinkSimple } from "@phosphor-icons/react";
import Link from "next/link";
import type { Bookmark } from "@/lib/bookmarks";

const faviconSrc = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

function Favicon({ domain, className }: { domain: string; className?: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={faviconSrc(domain)}
        alt=""
        className={className}
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.nextElementSibling?.classList.remove("hidden");
        }}
      />
      <LinkSimple
        aria-hidden="true"
        className={`hidden text-custom-gray-400 dark:text-custom-gray-500 ${className ?? ""}`}
      />
    </>
  );
}

export default function BookmarksList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
  return (
    <div className="w-full pb-24">
      {/* Small editorial header */}
      <div className="mb-5 flex items-baseline justify-between">
        <h1 className="text-xs font-medium uppercase tracking-wider text-custom-gray-400 dark:text-custom-gray-500">
          Bookmarks
        </h1>
        <span className="font-mono text-xs tabular-nums text-custom-gray-400 dark:text-custom-gray-500">
          {String(initialBookmarks.length).padStart(2, "0")} saved
        </span>
      </div>

      <div className="flex flex-col">
        {initialBookmarks.map((bookmark, index) => (
          <Link
            key={bookmark.url}
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group -mx-3 flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-custom-gray-100/70 dark:hover:bg-app-card-dark/40"
          >
            {/* Index */}
            <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-custom-gray-300 transition-colors group-hover:text-app-link-text-hover dark:text-custom-gray-600">
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Favicon tile */}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-custom-gray-200/70 bg-custom-gray-50 dark:border-app-border-dark dark:bg-app-card-dark">
              <Favicon domain={bookmark.domain} className="h-5 w-5 rounded" />
            </span>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate font-semibold text-custom-gray-900 transition-colors group-hover:text-app-link-text-hover dark:text-app-text-dark">
                  {bookmark.title}
                </h3>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-app-link-text-hover opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                />
              </div>
              <p className="truncate text-sm text-custom-gray-500 dark:text-custom-gray-400">
                {bookmark.description}
              </p>
            </div>

            {/* Domain */}
            <span className="hidden shrink-0 font-mono text-xs text-custom-gray-400 dark:text-custom-gray-500 sm:block">
              {bookmark.domain}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
