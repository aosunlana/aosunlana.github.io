"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

const SIZE = 32;
const STROKE_WIDTH = 2.5;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ReadingProgressRing() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;

      if (total <= 0) {
        setProgress(1);
        return;
      }

      const current = window.scrollY;
      const ratio = Math.min(Math.max(current / total, 0), 1);
      setProgress(ratio);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!mounted) return null;

  const isComplete = progress >= 0.995;
  const offset = CIRCUMFERENCE * (1 - progress);
  const displayPercent = Math.round(progress * 100);

  return createPortal(
    <button
      type="button"
      aria-label={isComplete ? "Reading complete" : "Reading progress"}
      className="fixed bottom-4 left-4 z-50 flex h-8 w-8 items-center justify-center"
    >
      <div className="relative flex items-center justify-center">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox="0 0 32 32"
          className="block"
        >
          {!isComplete && (
            <>
              <circle
                cx="16"
                cy="16"
                r={RADIUS}
                fill="none"
                stroke="rgba(156, 163, 175, 0.3)"
                strokeWidth={STROKE_WIDTH}
              />
              <circle
                cx="16"
                cy="16"
                r={RADIUS}
                fill="none"
                stroke="var(--color-app-link-text-hover)"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
              />
            </>
          )}
          {isComplete && (
            <circle
              cx="16"
              cy="16"
              r={RADIUS}
              fill="var(--color-app-link-text-hover)"
            />
          )}
        </svg>
        {!isComplete && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-custom-gray-900 dark:text-app-text-dark">
            {displayPercent}%
          </span>
        )}
        {isComplete && (
          <span className="absolute inset-0 flex items-center justify-center text-custom-gray-900">
            <Icon icon="line-md:thumbs-up-filled" className="h-4 w-4" />
          </span>
        )}
      </div>
    </button>,
    document.body
  );
}
