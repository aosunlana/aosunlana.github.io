"use client";

import { useEffect, useState } from "react";

/** 3 columns on desktop, 2 on tablet, 1 on mobile. Defaults to 3 for SSR. */
export function useColumnCount() {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const mid = window.matchMedia("(min-width: 640px)");
    const update = () => setCols(wide.matches ? 3 : mid.matches ? 2 : 1);
    update();
    wide.addEventListener("change", update);
    mid.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      mid.removeEventListener("change", update);
    };
  }, []);

  return cols;
}
