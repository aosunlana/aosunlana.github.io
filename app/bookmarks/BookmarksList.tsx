"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Bookmark {
  title: string;
  url: string;
  description: string;
  domain: string;
}

const BOOKMARKS: Bookmark[] = [
  {
    title: "GSAP (GreenSock)",
    url: "https://greensock.com",
    description: "The standard for modern web animation. Robust, performant, and essential for creative development.",
    domain: "greensock.com"
  },
  {
    title: "Vercel Design System",
    url: "https://vercel.com/design",
    description: "A masterclass in clean, functional, and scalable design systems.",
    domain: "vercel.com"
  },
  {
    title: "Family",
    url: "https://family.co",
    description: "Incredible crypto wallet interface design. Smooth interactions and thoughtful details.",
    domain: "family.co"
  },
  {
    title: "Linear Guide",
    url: "https://linear.app/method",
    description: "Not just a tool manual, but a philosophy on building software effectively.",
    domain: "linear.app"
  },
  {
    title: "Rauno Freiberg",
    url: "https://rauno.me",
    description: "A continuous source of inspiration for interaction design and craft.",
    domain: "rauno.me"
  },
  {
    title: "Craft",
    url: "https://craft.do",
    description: "Beautiful native-feeling interactions on the web. A benchmark for quality.",
    domain: "craft.do"
  }
];

type ViewMode = "list" | "grid";

export default function BookmarksList() {
  const [view, setView] = useState<ViewMode>("list");
  const [mounted, setMounted] = useState(false);
  const activeIndex = view === "list" ? 0 : 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full pb-24">
      {/* View Toggle - Floating */}
      {mounted && createPortal(
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="relative flex items-center p-1 gap-1 rounded-xl bg-custom-gray-100 dark:bg-app-card-dark/50 shadow-lg backdrop-blur-md border border-custom-gray-200/50 dark:border-app-border-dark/50">
            <motion.div
              className="absolute left-1 top-1 bottom-1 w-[32px] rounded-lg bg-white dark:bg-custom-gray-800 shadow-sm"
              animate={{ x: activeIndex * 36 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            />
            <button
              onClick={() => setView("list")}
              className="relative z-10 p-1.5 rounded-lg text-custom-gray-500 dark:text-custom-gray-400 hover:text-custom-gray-700 dark:hover:text-custom-gray-300 transition-colors"
              aria-label="List view"
              style={{ color: view === "list" ? "inherit" : undefined }}
            >
              <span className={view === "list" ? "text-custom-gray-900 dark:text-white" : ""}>
                <Icon icon="solar:list-linear" className="w-5 h-5" />
              </span>
            </button>
            <button
              onClick={() => setView("grid")}
              className="relative z-10 p-1.5 rounded-lg text-custom-gray-500 dark:text-custom-gray-400 hover:text-custom-gray-700 dark:hover:text-custom-gray-300 transition-colors"
              aria-label="Grid view"
              style={{ color: view === "grid" ? "inherit" : undefined }}
            >
              <span className={view === "grid" ? "text-custom-gray-900 dark:text-white" : ""}>
                <Icon icon="solar:widget-2-linear" className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>,
        document.body
      )}

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-custom-gray-200 dark:border-app-border-dark overflow-hidden bg-white dark:bg-custom-gray-900/20"
          >
            {BOOKMARKS.map((bookmark, index) => (
              <Link
                key={bookmark.url}
                href={bookmark.url}
                target="_blank"
                className={`group block p-4 sm:p-5 hover:bg-custom-gray-50 dark:hover:bg-custom-gray-800/20 transition-colors ${
                  index !== BOOKMARKS.length - 1
                    ? "border-b border-custom-gray-200 dark:border-app-border-dark"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-custom-gray-900 dark:text-app-text-dark truncate group-hover:text-custom-gray-600 dark:group-hover:text-custom-gray-300 transition-colors">
                        {bookmark.title}
                      </h3>
                      <Icon 
                        icon="solar:arrow-right-up-linear" 
                        className="w-3.5 h-3.5 text-custom-gray-400 dark:text-custom-gray-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" 
                      />
                    </div>
                    <p className="text-sm text-custom-gray-500 dark:text-custom-gray-400 line-clamp-2 leading-relaxed">
                      {bookmark.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full bg-custom-gray-100 dark:bg-app-card-dark/50 text-xs font-medium text-custom-gray-500 dark:text-custom-gray-400">
                    {/* Favicon or fallback */}
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`}
                      alt=""
                      className="w-3.5 h-3.5 rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <Icon icon="solar:link-circle-linear" className="w-3.5 h-3.5 hidden" />
                    <span className="truncate max-w-[100px] sm:max-w-none">{bookmark.domain}</span>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {BOOKMARKS.map((bookmark) => (
              <Link
                key={bookmark.url}
                href={bookmark.url}
                target="_blank"
                className="group flex flex-col p-5 rounded-3xl border border-custom-gray-200 dark:border-app-border-dark bg-white dark:bg-custom-gray-900/20 hover:bg-custom-gray-50 dark:hover:bg-custom-gray-800/20 transition-colors h-full"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                     {/* Favicon or fallback */}
                     <div className="flex items-center justify-center w-8 h-8 rounded-full bg-custom-gray-100 dark:bg-app-card-dark shrink-0">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`}
                        alt=""
                        className="w-4 h-4 rounded-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <Icon icon="solar:link-circle-linear" className="w-4 h-4 text-custom-gray-500 dark:text-custom-gray-400 hidden" />
                    </div>
                    <h3 className="text-base font-semibold text-custom-gray-900 dark:text-app-text-dark truncate group-hover:text-custom-gray-600 dark:group-hover:text-custom-gray-300 transition-colors">
                      {bookmark.title}
                    </h3>
                  </div>
                  
                  <Icon 
                    icon="solar:arrow-right-up-linear" 
                    className="w-4 h-4 text-custom-gray-400 dark:text-custom-gray-500 group-hover:text-custom-gray-600 dark:group-hover:text-custom-gray-300 transition-colors shrink-0" 
                  />
                </div>
                
                <p className="text-sm text-custom-gray-500 dark:text-custom-gray-400 line-clamp-3 leading-relaxed mb-4 flex-1">
                  {bookmark.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs font-medium text-custom-gray-400 dark:text-custom-gray-500">
                  <span className="truncate">{bookmark.domain}</span>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
