"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CardStack() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".card");
    
    const tl = gsap.timeline({ paused: true });
    
    tl.to(cards[0], { rotate: -10, x: -20, y: -5, duration: 0.3, ease: "power2.out" }, 0)
      .to(cards[1], { rotate: 0, x: 0, y: -20, duration: 0.3, ease: "power2.out" }, 0)
      .to(cards[2], { rotate: 10, x: 20, y: -5, duration: 0.3, ease: "power2.out" }, 0);

    const handleMouseEnter = () => tl.play();
    const handleMouseLeave = () => tl.reverse();

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-40 h-40 flex items-center justify-center cursor-pointer">
      <div className="card absolute w-32 h-40 bg-blue-500 rounded-xl border border-white/10" style={{ zIndex: 1 }}></div>
      <div className="card absolute w-32 h-40 bg-purple-500 rounded-xl border border-white/10" style={{ zIndex: 2 }}></div>
      <div className="card absolute w-32 h-40 bg-pink-500 rounded-xl border border-white/10" style={{ zIndex: 3 }}></div>
      <div className="absolute z-10 text-white font-medium mix-blend-overlay">Hover Me</div>
    </div>
  );
}
