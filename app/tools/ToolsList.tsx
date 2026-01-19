"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import gsap from "gsap";

interface Tool {
  name: string;
  description: string;
  icon: string; // Used as fallback
  logo?: string; // Path to logo image (e.g., "/logos/figma.svg")
  category: "Design" | "Development" | "Productivity" | "Hardware";
  url?: string;
  usage: string;
  impact: string;
}

const TOOLS: Tool[] = [
  // Design
  {
    name: "Figma",
    description: "Where all design work happens.",
    icon: "solar:palette-linear",
    logo: "/logos/placeholder.svg",
    category: "Design",
    url: "https://figma.com",
    usage: "Interface design, prototyping, and maintaining design systems.",
    impact: "It's the infinite canvas where I think, explore, and solidify visual ideas before a single line of code is written.",
  },
  {
    name: "Framer",
    description: "For shipping websites fast.",
    icon: "solar:window-frame-linear",
    logo: "/logos/placeholder.svg",
    category: "Design",
    url: "https://framer.com",
    usage: "Building high-fidelity interactive prototypes and shipping marketing sites.",
    impact: "Bridges the gap between static design and the real web. It lets me validate interactions and ship stunning sites in record time.",
  },
  
  // Development
  {
    name: "VS Code",
    description: "My editor of choice.",
    icon: "solar:code-circle-linear",
    logo: "/logos/placeholder.svg",
    category: "Development",
    url: "https://code.visualstudio.com",
    usage: "Full-stack development, debugging, and writing markdown.",
    impact: "My command center. With the right extensions and keybindings, it disappears and lets me flow directly into the codebase.",
  },
  {
    name: "Arc",
    description: "The browser I can't live without.",
    icon: "solar:globe-linear",
    logo: "/logos/placeholder.svg",
    category: "Development",
    url: "https://arc.net",
    usage: "Daily browsing, research, and managing multiple workspaces.",
    impact: "Spaces and profiles keep my context switching cost low. It feels like an OS for the web rather than just a browser.",
  },
  
  // Productivity
  {
    name: "Raycast",
    description: "Spotlight on steroids.",
    icon: "solar:bolt-linear",
    logo: "/logos/placeholder.svg",
    category: "Productivity",
    url: "https://raycast.com",
    usage: "System control, clipboard history, window management, and quick scripts.",
    impact: "It eliminates friction. I can navigate my entire system and perform complex tasks without ever lifting my hands from the keyboard.",
  },
  {
    name: "Notion",
    description: "Second brain for notes and docs.",
    icon: "solar:notebook-linear",
    logo: "/logos/placeholder.svg",
    category: "Productivity",
    url: "https://notion.so",
    usage: "Documentation, project planning, and organizing my life.",
    impact: "The flexibility allows me to build custom workflows for everything from reading lists to sprint planning. It keeps the chaos organized.",
  },
  {
    name: "Linear",
    description: "Issue tracking that feels like magic.",
    icon: "solar:checklist-minimalistic-linear",
    logo: "/logos/placeholder.svg",
    category: "Productivity",
    url: "https://linear.app",
    usage: "Task management, bug tracking, and roadmap planning.",
    impact: "It respects my time. Fast, keyboard-centric, and opinionated in the right ways. It turns project management into a flow state.",
  },
];

export default function ToolsList() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevToolRef = useRef<string | null>(null);

  const toggleTool = (name: string) => {
    setActiveTool(prev => prev === name ? null : name);
  };

  useEffect(() => {
    const prev = prevToolRef.current;
    const curr = activeTool;

    // 1. Close previous if exists and different
    if (prev && prev !== curr) {
      const el = contentRefs.current.get(prev);
      if (el) {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut"
        });
      }
    }

    // 2. Open current if exists
    if (curr) {
      const el = contentRefs.current.get(curr);
      if (el) {
        // Reset state
        gsap.set(el, { height: "auto", opacity: 0 });
        const height = el.offsetHeight;
        gsap.set(el, { height: 0 });

        // Animate
        gsap.to(el, {
          height: height,
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(el, { height: "auto" }); // Ensure auto height for responsiveness
          }
        });
        
        gsap.to(el, {
          opacity: 1,
          duration: 0.4,
          delay: 0.15, // Wait for height to start expanding
          ease: "power2.out"
        });
      }
    }

    prevToolRef.current = curr;
  }, [activeTool]);

  return (
    <div className="rounded-3xl border border-custom-gray-200 dark:border-app-border-dark overflow-hidden bg-white dark:bg-custom-gray-900/20">
      {TOOLS.map((tool, index) => {
        const isActive = activeTool === tool.name;
        
        return (
          <div
            key={tool.name}
            className={`group relative overflow-hidden transition-colors duration-300 ${
              index !== TOOLS.length - 1
                ? "border-b border-custom-gray-200 dark:border-app-border-dark"
                : ""
            } ${isActive ? "bg-custom-gray-50 dark:bg-custom-gray-800/40" : "hover:bg-custom-gray-50 dark:hover:bg-custom-gray-800/20"}`}
          >
            {/* Header / Trigger */}
            <div 
              onClick={() => toggleTool(tool.name)}
              className="flex items-center gap-4 p-4 cursor-pointer select-none"
            >
              {/* Icon Box */}
              <div 
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 ${
                  isActive 
                    ? "bg-custom-gray-200 dark:bg-app-card-dark text-custom-gray-900 dark:text-white"
                    : "bg-custom-gray-100 dark:bg-app-card-dark text-custom-gray-900 dark:text-white group-hover:bg-custom-gray-200 dark:group-hover:bg-app-card-dark/80"
                }`}
              >
                {tool.logo ? (
                  <img src={tool.logo} alt={tool.name} className="h-6 w-6 object-contain" />
                ) : (
                  <Icon icon={tool.icon} className="h-6 w-6" />
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-custom-gray-900 dark:text-app-text-dark">
                  {tool.name}
                </h3>
                <p className="text-sm text-custom-gray-500 dark:text-custom-gray-400 truncate">
                  {tool.description}
                </p>
              </div>

              {/* Chevron */}
              <div 
                className={`text-custom-gray-400 dark:text-custom-gray-600 transition-transform duration-300 ${
                  isActive ? "rotate-180 text-custom-gray-900 dark:text-white" : "group-hover:text-custom-gray-900 dark:group-hover:text-white"
                }`}
              >
                <Icon icon="solar:alt-arrow-down-linear" className="w-5 h-5" />
              </div>
            </div>

            {/* Expandable Content */}
            <div 
              ref={(el) => {
                if (el) contentRefs.current.set(tool.name, el);
              }}
              className="h-0 overflow-hidden opacity-0"
            >
              <div className="p-4 pt-0 pl-[calc(1rem+48px+1rem)] pr-4 pb-6 space-y-5">
                {/* Info Grid */}
                <div className="grid gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-custom-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                      <Icon icon="solar:notes-minimalistic-linear" className="w-4 h-4 text-custom-gray-400" />
                      Usage
                    </h4>
                    <p className="text-custom-gray-600 dark:text-custom-gray-300 leading-relaxed">
                      {tool.usage}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-custom-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                      <Icon icon="solar:magic-stick-3-linear" className="w-4 h-4 text-custom-gray-400" />
                      Impact
                    </h4>
                    <p className="text-custom-gray-600 dark:text-custom-gray-300 leading-relaxed">
                      {tool.impact}
                    </p>
                  </div>
                </div>

                {/* Action Link */}
                {tool.url && (
                  <Link
                    href={tool.url}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm font-medium text-custom-gray-900 dark:text-white hover:text-custom-gray-600 dark:hover:text-custom-gray-300 transition-colors underline decoration-dotted underline-offset-4"
                  >
                    <span>Visit {tool.name}</span>
                    <Icon icon="solar:arrow-right-up-linear" className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
