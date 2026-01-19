"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Bookmark } from "@/lib/bookmarks";

type ViewMode = "list" | "grid";

export default function BookmarksList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
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
            {initialBookmarks.map((bookmark, index) => (
              <Link
                key={bookmark.url}
                href={bookmark.url}
                target="_blank"
                className={`group block p-4 sm:p-5 hover:bg-custom-gray-50 dark:hover:bg-custom-gray-800/20 transition-colors ${
                  index !== initialBookmarks.length - 1
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
                    <p className="text-sm text-custom-gray-500 dark:text-custom-gray-400 line-clamp-2 leading-relaxed h-[46px]">
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
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {initialBookmarks.map((bookmark) => (
              <Link
                key={bookmark.url}
                href={bookmark.url}
                target="_blank"
                className="group flex flex-col p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-custom-gray-200 dark:border-app-border-dark bg-white dark:bg-custom-gray-900/20 hover:bg-custom-gray-50 dark:hover:bg-custom-gray-800/20 transition-colors h-full"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                     {/* Favicon or fallback */}
                     <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-custom-gray-100 dark:bg-app-card-dark shrink-0">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`}
                        alt=""
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <Icon icon="solar:link-circle-linear" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-custom-gray-500 dark:text-custom-gray-400 hidden" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-custom-gray-900 dark:text-app-text-dark truncate group-hover:text-custom-gray-600 dark:group-hover:text-custom-gray-300 transition-colors">
                      {bookmark.title}
                    </h3>
                  </div>
                  
                  <Icon 
                    icon="solar:arrow-right-up-linear" 
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-custom-gray-400 dark:text-custom-gray-500 group-hover:text-custom-gray-600 dark:group-hover:text-custom-gray-300 transition-colors shrink-0" 
                  />
                </div>
                
                <p className="text-xs sm:text-sm text-custom-gray-500 dark:text-custom-gray-400 line-clamp-2 leading-relaxed mb-3 sm:mb-4 h-[40px] sm:h-[46px]">
                  {bookmark.description}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-custom-gray-400 dark:text-custom-gray-500 mt-auto">
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
