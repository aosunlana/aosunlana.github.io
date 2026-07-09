"use client";

import { useEffect } from "react";
import { useTransitionRouter } from "next-view-transitions";

/** Pressing Escape leaves the craft and returns to the given href. */
export default function EscapeToExit({ href }: { href: string }) {
  const router = useTransitionRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        router.push(href);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [href, router]);

  return null;
}
