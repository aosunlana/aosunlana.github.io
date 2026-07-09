"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const isNotesPath = (path: string | null) =>
  path === "/notes" || (path?.startsWith("/notes/") ?? false);

/**
 * Re-locks the notes section as soon as the user navigates away from it.
 * Navigating between the notes list and a note's detail keeps it unlocked;
 * leaving to any other page clears the unlock cookie so the password is needed again.
 */
export default function NotesAutoLock() {
  const pathname = usePathname();
  const prev = useRef(pathname);

  useEffect(() => {
    const wasNotes = isNotesPath(prev.current);
    const nowNotes = isNotesPath(pathname);

    if (wasNotes && !nowNotes) {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/notes-lock");
      } else {
        fetch("/api/notes-lock", { method: "POST", keepalive: true });
      }
    }

    prev.current = pathname;
  }, [pathname]);

  return null;
}
