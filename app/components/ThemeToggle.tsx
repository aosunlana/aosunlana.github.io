"use client";

import { Gear, Sun, MoonStars } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const OPTIONS = [
  { value: "system", Icon: Gear, label: "System theme" },
  { value: "light", Icon: Sun, label: "Light theme" },
  { value: "dark", Icon: MoonStars, label: "Dark theme" },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const renderControl = (idSuffix: string) => (
    <div
      role="radiogroup"
      aria-label="Toggle color theme"
      className="flex items-center gap-1 rounded-full border border-custom-gray-200 bg-white/80 p-1 backdrop-blur dark:border-app-border-dark dark:bg-app-card-dark/80"
    >
      {OPTIONS.map((option) => {
        const isActive = option.value === theme;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={option.label}
            onClick={() => setTheme(option.value)}
            className="relative flex h-7 w-7 items-center justify-center rounded-full"
          >
            {isActive && (
              <motion.span
                layoutId={`theme-active-${idSuffix}`}
                className="absolute inset-0 rounded-full bg-custom-gray-900 dark:bg-white"
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
              />
            )}
            <option.Icon
              size={15}
              aria-hidden="true"
              className={`relative z-10 transition-colors ${
                isActive
                  ? "text-white dark:text-custom-gray-900"
                  : "text-custom-gray-500 dark:text-app-text-dark"
              }`}
            />
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="fixed top-3 right-3 z-50 hidden md:block">
        {renderControl("desktop")}
      </div>
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        {renderControl("mobile")}
      </div>
    </>
  );
}
