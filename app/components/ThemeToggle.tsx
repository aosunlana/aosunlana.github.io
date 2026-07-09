"use client";

import { Fragment } from "react";
import { Gear, Sun, MoonStars } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const OPTIONS = [
  { value: "system", Icon: Gear, label: "System theme" },
  { value: "light", Icon: Sun, label: "Light theme" },
  { value: "dark", Icon: MoonStars, label: "Dark theme" },
] as const;

// Bare row of theme icons (no pill wrapper), separated by full-height dividers.
// Meant to sit inside a fixed-height bar (e.g. the footer) so the dividers span
// the whole height.
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Toggle color theme"
      className="flex h-full items-stretch"
    >
      {OPTIONS.map((option, i) => {
        const isActive = option.value === theme;
        return (
          <Fragment key={option.value}>
            {i > 0 && (
              <span
                aria-hidden="true"
                className="w-px self-stretch bg-custom-gray-200 dark:bg-app-border-dark"
              />
            )}
            <button
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={option.label}
              onClick={() => setTheme(option.value)}
              className="flex h-full items-center justify-center px-2.5 sm:px-3"
            >
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full">
                {isActive && (
                  <motion.span
                    layoutId="theme-active"
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
              </span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
