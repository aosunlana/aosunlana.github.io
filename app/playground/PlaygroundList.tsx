"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./components/MagneticButton";
import CardStack from "./components/CardStack";
import TextReveal from "./components/TextReveal";
import PlaygroundCard from "./components/PlaygroundCard";

type Category = "All" | "Code Components" | "Designs";

interface PlaygroundItem {
  id: string;
  title: string;
  description: string;
  category: "Code Components" | "Designs";
  component: React.ReactNode;
  tags: string[];
  code?: string;
}

const ITEMS: PlaygroundItem[] = [
  {
    id: "magnetic-button",
    title: "Magnetic Button",
    description: "A button that magnetically attracts to the cursor movement.",
    category: "Code Components",
    component: (
      <div className="flex items-center justify-center h-full min-h-[200px] w-full bg-custom-gray-50 dark:bg-custom-gray-900/50 rounded-xl">
        <MagneticButton>Hover Me</MagneticButton>
      </div>
    ),
    tags: ["GSAP", "Interaction", "Mouse"],
    code: `"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function MagneticButton({ children }: { children: React.ReactNode }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const textXTo = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const textYTo = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      xTo(x * 0.35);
      yTo(y * 0.35);
      textXTo(x * 0.1);
      textYTo(y * 0.1);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      textXTo(0);
      textYTo(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className="relative px-8 py-4 rounded-full bg-custom-gray-900 dark:bg-white text-white dark:text-custom-gray-900 font-medium overflow-hidden"
    >
      <span ref={textRef} className="relative z-10 inline-block">
        {children}
      </span>
    </button>
  );
}`
  },
  {
    id: "card-stack",
    title: "Card Stack",
    description: "Interactive card stack that fans out on hover.",
    category: "Code Components",
    component: (
      <div className="flex items-center justify-center h-full min-h-[200px] w-full bg-custom-gray-50 dark:bg-custom-gray-900/50 rounded-xl overflow-hidden">
        <CardStack />
      </div>
    ),
    tags: ["GSAP", "Animation", "Cards"],
    code: `"use client";

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
}`
  },
  {
    id: "text-reveal",
    title: "Text Reveal",
    description: "Staggered text character reveal animation.",
    category: "Code Components",
    component: (
      <div className="flex items-center justify-center h-full min-h-[200px] w-full bg-custom-gray-50 dark:bg-custom-gray-900/50 rounded-xl">
        <TextReveal />
      </div>
    ),
    tags: ["GSAP", "Typography", "SplitText"],
    code: `"use client";

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
      .map((char) => \`<span class="inline-block opacity-0 translate-y-4">\${char === " " ? "&nbsp;" : char}</span>\`)
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
}`
  },
  {
    id: "glass-card",
    title: "Glassmorphism Card",
    description: "Modern frosted glass effect using backdrop-filter.",
    category: "Designs",
    component: (
      <div className="flex items-center justify-center h-full min-h-[200px] w-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center rounded-xl">
        <div className="w-64 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <h4 className="text-lg font-bold mb-2">Glass Effect</h4>
          <p className="text-sm text-white/80">Using backdrop-filter: blur() to create depth and hierarchy.</p>
        </div>
      </div>
    ),
    tags: ["CSS", "UI Design", "Glassmorphism"],
    code: `<div className="w-64 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
  <h4 className="text-lg font-bold mb-2">Glass Effect</h4>
  <p className="text-sm text-white/80">
    Using backdrop-filter: blur() to create depth and hierarchy.
  </p>
</div>

/* CSS */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}`
  },
  {
    id: "gradient-border",
    title: "Gradient Border",
    description: "Smooth gradient border effect using background-origin.",
    category: "Designs",
    component: (
      <div className="flex items-center justify-center h-full min-h-[200px] w-full bg-custom-gray-900 rounded-xl">
        <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 overflow-hidden">
          <div className="bg-custom-gray-900 rounded-2xl p-6 text-white relative z-10">
            <h4 className="text-lg font-bold">Gradient Border</h4>
          </div>
        </div>
      </div>
    ),
    tags: ["CSS", "Tailwind", "Border"],
    code: `<div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 overflow-hidden">
  <div className="bg-custom-gray-900 rounded-2xl p-6 text-white relative z-10">
    <h4 className="text-lg font-bold">Gradient Border</h4>
  </div>
</div>`
  },
];

const TABS: Category[] = ["All", "Code Components", "Designs"];

export default function PlaygroundList() {
  const [activeTab, setActiveTab] = useState<Category>("All");

  const filteredItems = ITEMS.filter(
    (item) => activeTab === "All" || item.category === activeTab
  );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-24">
      {/* Sidebar - Sticky on Desktop */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="lg:sticky lg:top-32">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-custom-gray-900 dark:text-white mb-4 tracking-tight">
              Playground
            </h1>
            <p className="text-custom-gray-500 dark:text-custom-gray-400 leading-relaxed">
              A collection of experimental components, interactions, and visual explorations.
            </p>
          </div>

          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible no-scrollbar pb-4 lg:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap text-left w-full ${
                  activeTab === tab
                    ? "bg-custom-gray-900 dark:bg-white text-white dark:text-custom-gray-900 shadow-lg shadow-custom-gray-900/10 dark:shadow-white/10"
                    : "text-custom-gray-500 dark:text-custom-gray-400 hover:bg-custom-gray-100 dark:hover:bg-custom-gray-800 hover:text-custom-gray-900 dark:hover:text-white"
                }`}
              >
                <span>{tab}</span>
                {activeTab === tab && (
                  <motion.span 
                    layoutId="activeDot"
                    className="w-1.5 h-1.5 rounded-full bg-white dark:bg-custom-gray-900" 
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="hidden lg:block mt-12 pt-12 border-t border-custom-gray-100 dark:border-white/5">
             <div className="text-xs font-mono text-custom-gray-400 uppercase tracking-widest mb-4">
                Stats
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <div className="text-2xl font-bold text-custom-gray-900 dark:text-white">
                      {ITEMS.filter(i => i.category === "Code Components").length}
                   </div>
                   <div className="text-xs text-custom-gray-500">Components</div>
                </div>
                <div>
                   <div className="text-2xl font-bold text-custom-gray-900 dark:text-white">
                      {ITEMS.filter(i => i.category === "Designs").length}
                   </div>
                   <div className="text-xs text-custom-gray-500">Designs</div>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Masonry Grid */}
      <div className="flex-1 min-w-0">
        <motion.div 
          layout
          className="columns-1 md:columns-2 gap-8 space-y-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="break-inside-avoid"
              >
                <PlaygroundCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredItems.length === 0 && (
           <div className="py-20 text-center text-custom-gray-400">
              No items found in this category.
           </div>
        )}
      </div>
    </div>
  );
}
