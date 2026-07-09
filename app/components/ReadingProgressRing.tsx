"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Smiley, ThumbsUp } from "@phosphor-icons/react";

const SIZE = 32;
const STROKE_WIDTH = 2.5;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SCROLL_IDLE_DELAY = 2000;

export default function ReadingProgressRing() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isScrollIdle, setIsScrollIdle] = useState(false);
  const idleTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current);
      }
      setIsScrollIdle(false);

      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;

      if (total <= 0) {
        setProgress(1);
        return;
      }

      const current = window.scrollY;
      const ratio = Math.min(Math.max(current / total, 0), 1);
      setProgress(ratio);

      idleTimeoutRef.current = window.setTimeout(() => {
        setIsScrollIdle(true);
      }, SCROLL_IDLE_DELAY);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  const isComplete = progress >= 0.995;
  const offset = CIRCUMFERENCE * (1 - progress);

  if (!mounted) return null;

  return createPortal(
    <button
      type="button"
      aria-label={isComplete ? "Reading complete" : "Reading progress"}
      className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-app-card-dark/90 backdrop-blur-sm ${
        !isScrollIdle && !isComplete
          ? "border border-custom-gray-200 dark:border-app-border-dark"
          : ""
      }`}
    >
      <div className="relative flex items-center justify-center">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox="0 0 32 32"
          className="block"
        >
          {!isComplete && !isScrollIdle && (
            <>
              <circle
                cx="16"
                cy="16"
                r={RADIUS}
                fill="none"
                stroke="rgba(156, 163, 175, 0.3)"
                strokeWidth={STROKE_WIDTH}
              />
              {!isScrollIdle && (
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
              )}
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
        {!isComplete && isScrollIdle && (
          <span className="absolute inset-0 flex items-center justify-center text-custom-gray-900 dark:text-app-text-dark">
            <Smiley size={32} weight="fill" aria-hidden="true" />
          </span>
        )}
        {isComplete && (
          <span className="absolute inset-0 flex items-center justify-center text-custom-gray-900">
            <ThumbsUp size={16} weight="fill" aria-hidden="true" />
          </span>
        )}
      </div>
    </button>,
    document.body
  );
}
