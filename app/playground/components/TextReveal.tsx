"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Icon } from "@iconify/react";

export default function TextReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    // Split text logic manually for simplicity since we don't have SplitText plugin
    const content = text.textContent || "";
    text.innerHTML = content
      .split("")
      .map((char) => `<span class="inline-block opacity-0 translate-y-4">${char === " " ? "&nbsp;" : char}</span>`)
      .join("");

    const chars = text.querySelectorAll("span");

    const anim = gsap.to(chars, {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.5,
      ease: "back.out(1.7)",
      paused: true,
    });

    const handleMouseEnter = () => anim.restart();

    container.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="flex flex-col items-center justify-center gap-4 cursor-pointer p-8"
    >
      <div className="p-3 rounded-full bg-custom-gray-100 dark:bg-custom-gray-800 text-custom-gray-900 dark:text-white mb-2">
        <Icon icon="solar:restart-linear" className="w-6 h-6" />
      </div>
      <h3 ref={textRef} className="text-2xl font-bold text-custom-gray-900 dark:text-white">
        Hello World
      </h3>
      <p className="text-sm text-custom-gray-500">Hover to replay</p>
    </div>
  );
}
