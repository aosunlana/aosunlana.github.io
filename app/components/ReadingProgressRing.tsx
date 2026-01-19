"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import gsap from "gsap";

const SIZE = 32;
const STROKE_WIDTH = 2.5;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ReadingProgressRing() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const digitRef = useRef<HTMLSpanElement | null>(null);

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

  const isComplete = progress >= 0.995;
  const offset = CIRCUMFERENCE * (1 - progress);
  const displayPercent = Math.round(progress * 100);
  const clampedPercent = Math.min(displayPercent, 99);
  const tens = Math.floor(clampedPercent / 10);
  const units = clampedPercent % 10;

  useEffect(() => {
    if (!digitRef.current || isComplete) return;

    gsap.fromTo(
      digitRef.current,
      { y: 8, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.25, ease: "power2.out" }
    );
  }, [units, isComplete]);

  if (!mounted) return null;

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
          <span className="absolute inset-0 flex items-center justify-center overflow-hidden text-[9px] font-medium text-custom-gray-900 dark:text-app-text-dark">
            <span className="flex items-center justify-center gap-[1px]">
              <span className="block">
                {tens}
              </span>
              <span ref={digitRef} className="block">
                {units}
              </span>
              <span className="block">%</span>
            </span>
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
