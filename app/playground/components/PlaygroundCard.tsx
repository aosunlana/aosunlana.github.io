"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface PlaygroundItem {
  id: string;
  title: string;
  description: string;
  category: "Code Components" | "Designs";
  component: React.ReactNode;
  tags: string[];
  code?: string;
}

export default function PlaygroundCard({ item }: { item: PlaygroundItem }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="group flex flex-col gap-4 mb-8 break-inside-avoid">
      {/* 3D Container - Removed fixed aspect ratio to allow natural height for masonry */}
      <div className="relative w-full perspective-1000">
        <motion.div
          className="relative w-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT FACE */}
          <div 
            className="relative w-full rounded-2xl overflow-hidden bg-custom-gray-50 dark:bg-custom-gray-900/40 border border-custom-gray-100 dark:border-white/5 backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Component Container - Min height ensures consistency but allows growth */}
            <div className="p-2 sm:p-2">
               <div className="flex items-center justify-center min-h-[240px] w-full bg-white dark:bg-custom-gray-900/50 rounded-xl overflow-hidden">
                {item.component}
               </div>
            </div>

            {/* Type Badge & View Code Button - Floating Top Right */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={() => setIsFlipped(true)}
                className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-custom-gray-900/80 backdrop-blur-md text-xs font-medium text-custom-gray-600 dark:text-custom-gray-300 border border-custom-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-custom-gray-800 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Icon icon="solar:code-linear" className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Code</span>
              </button>
            </div>
          </div>

          {/* BACK FACE */}
          <div 
            className="absolute inset-0 w-full h-full rounded-2xl border border-custom-gray-200 dark:border-white/10 overflow-hidden bg-custom-gray-900 backface-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/10 flex items-center justify-between px-3 bg-custom-gray-900/50 backdrop-blur z-10">
              <span className="text-[10px] uppercase tracking-wider font-medium text-custom-gray-500 font-mono">source.tsx</span>
              <button
                onClick={() => setIsFlipped(false)}
                className="p-1 rounded-full hover:bg-white/10 text-custom-gray-400 hover:text-white transition-colors"
              >
                <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
              </button>
            </div>

            {/* Code Content */}
            <div className="absolute inset-0 pt-10 pb-0 px-0 overflow-auto custom-scrollbar bg-[#0d1117]">
              <pre className="p-4 text-xs font-mono text-custom-gray-300 leading-relaxed">
                <code>{item.code || "// Code not available yet"}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info - Minimalist Technical Style */}
      <div className="px-1">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-base font-medium text-custom-gray-900 dark:text-app-text-dark">
            {item.title}
          </h3>
          <span className="text-[10px] uppercase tracking-wider text-custom-gray-400 dark:text-custom-gray-600 font-mono">
            {item.category === "Code Components" ? "01. Component" : "02. Design"}
          </span>
        </div>
        <p className="text-sm text-custom-gray-500 dark:text-custom-gray-400 leading-relaxed mb-3">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] font-mono text-custom-gray-400 dark:text-custom-gray-500 before:content-['#'] before:mr-0.5 before:text-custom-gray-300 dark:before:text-custom-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
