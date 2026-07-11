"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// True when focus is in a field where arrow keys mean "move the cursor", so we
// don't yank the user to another craft while they're typing in a demo.
const isEditable = (el: Element | null) =>
  !!el &&
  (el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    (el as HTMLElement).isContentEditable);

/**
 * Left / Right arrow keys page between crafts. This uses the plain router (not
 * a view transition) on purpose: detail-to-detail must be a quiet client swap
 * of the demo only. A view transition here cross-fades the whole document and
 * flashes the chrome.
 */
export default function ArrowNav({ prevHref, nextHref }: { prevHref?: string; nextHref?: string }) {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isEditable(document.activeElement)) return;
      if (e.key === "ArrowLeft" && prevHref) {
        e.preventDefault();
        router.push(prevHref);
      } else if (e.key === "ArrowRight" && nextHref) {
        e.preventDefault();
        router.push(nextHref);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prevHref, nextHref, router]);

  return null;
}
