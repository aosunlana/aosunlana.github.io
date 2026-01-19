"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        container,
        { autoAlpha: 0, y: 20, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
      );

      const elements = container.querySelectorAll(
        "header, main, section, article, h1, h2, h3, p, a, li"
      );

      if (elements.length) {
        tl.from(
          elements,
          {
            autoAlpha: 0,
            y: 10,
            duration: 0.4,
            stagger: 0.04,
            ease: "power2.out",
          },
          "-=0.25"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div ref={containerRef} className="min-h-screen">
      {children}
    </div>
  );
}
