"use client";

import { useEffect, useRef, useState } from "react";
import { DownloadSimple, Check } from "@phosphor-icons/react";

const RESUME_PATH = "/Emmanuel-Priestley-CV.pdf";
const DURATION = 1400; // ms for the simulated download

export default function ResumeButton() {
  const [status, setStatus] = useState<"idle" | "downloading" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resetRef.current) clearTimeout(resetRef.current);
    };
  }, []);

  const triggerDownload = () => {
    const link = document.createElement("a");
    link.href = RESUME_PATH;
    link.download = "Emmanuel-Priestley-CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const finish = () => {
    triggerDownload();
    setProgress(100);
    setStatus("done");
    resetRef.current = setTimeout(() => {
      setStatus("idle");
      setProgress(0);
    }, 1800);
  };

  const handleDownload = () => {
    if (status !== "idle") return;

    // Respect reduced motion: download right away with a brief confirmation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    setStatus("downloading");
    setProgress(0);
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const label =
    status === "downloading"
      ? `Downloading ${progress}%`
      : status === "done"
        ? "Downloaded"
        : "Download Resume";

  const fillWidth =
    status === "downloading" ? progress : status === "done" ? 100 : 0;

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={status !== "idle"}
      aria-live="polite"
      className="group relative inline-flex h-9 w-auto items-center justify-center gap-1.5 overflow-hidden rounded-lg border border-custom-gray-200 bg-white px-3.5 transition-colors hover:bg-custom-gray-50 disabled:cursor-default dark:border-app-border-dark dark:bg-app-card-dark dark:hover:bg-custom-gray-800/50"
    >
      {/* Progress fill */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 z-0 bg-custom-gray-200/80 dark:bg-app-button-hover-dark"
        style={{ width: `${fillWidth}%` }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {status === "done" ? (
          <Check
            size={15}
            weight="bold"
            aria-hidden="true"
            className="text-app-link-text-hover"
          />
        ) : (
          <DownloadSimple
            size={15}
            aria-hidden="true"
            className={`text-custom-gray-500 transition-colors group-hover:text-custom-gray-700 dark:text-custom-gray-400 dark:group-hover:text-custom-gray-300 ${
              status === "downloading" ? "animate-bounce" : ""
            }`}
          />
        )}
        <span className="text-[0.8125rem] font-medium tabular-nums text-custom-gray-700 dark:text-custom-gray-300">
          {label}
        </span>
      </span>
    </button>
  );
}
