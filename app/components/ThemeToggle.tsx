"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const OPTIONS = [
  { value: "system", icon: "solar:settings-linear", label: "System theme" },
  { value: "light", icon: "solar:sun-2-linear", label: "Light theme" },
  { value: "dark", icon: "solar:moon-stars-linear", label: "Dark theme" },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const activeIndex =
    theme === "system" ? 0 : theme === "light" ? 1 : 2;

  const renderControl = (extraClasses: string) => (
    <div
      className={`relative flex items-center rounded-full border border-custom-gray-200 dark:border-app-border-dark bg-white/80 dark:bg-app-card-dark/80 backdrop-blur p-1 gap-1 overflow-hidden ${extraClasses}`}
      aria-label="Toggle color theme"
    >
      <motion.div
        className="absolute left-1 top-1 bottom-1 w-7 rounded-full bg-custom-gray-900 dark:bg-white"
        animate={{ x: activeIndex * 32 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      />
      {OPTIONS.map((option) => {
        const isActive =
          option.value === "system"
            ? theme === "system"
            : option.value === theme;

        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className="relative flex h-7 w-7 items-center justify-center rounded-full"
            aria-label={option.label}
            animate={{
              opacity: isActive ? 1 : 0.55,
              scale: isActive ? 1 : 0.9,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            whileTap={{ scale: 0.85 }}
          >
            <span
              className={`relative z-10 flex items-center justify-center ${
                isActive
                  ? "text-white dark:text-custom-gray-900"
                  : "text-custom-gray-500 dark:text-app-text-dark"
              }`}
            >
              <Icon icon={option.icon} className="h-[14px] w-[14px]" />
            </span>
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="fixed top-3 right-3 z-50 hidden md:block">
        {renderControl("")}
      </div>
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        {renderControl("")}
      </div>
    </>
  );
}
