"use client";

import Header from "@/components/header/Header";
import SubPageMenu from "@/components/SubPageMenu";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Icon } from "@iconify/react";
import ResumeButton from "./ResumeButton";

// --- DATA ---
const EXPERIENCE = [
  {
    company: "Tempo (YC23)",
    role: "Product Designer",
    period: "2023 — Present",
    description: "Designing products that scale. Working on core features and design systems to help teams move faster.",
    link: "https://www.tempo.new/"
  },
  {
    company: "Sidebridge",
    role: "Product Designer",
    period: "2022 — 2023",
    description: "Crafted components and pixel-perfect systems for the marketing site and product.",
    link: "https://sidebridge.io"
  },
  {
    company: "Rayform",
    role: "Design Engineer",
    period: "2021 — 2022",
    description: "Built experimental ideas and interactive prototypes, bridging the gap between design and code.",
    link: "https://rayform-tech.framer.website/"
  }
];

const SKILLS = [
  "Product Design", "Design Systems", "Prototyping",
  "React", "Next.js", "TypeScript", "Tailwind CSS",
  "Framer Motion", "Figma", "Node.js"
];



const CAPABILITIES = [
  {
    title: "Design Engineering",
    description: "Bridging the gap between design and code. I build what I design, ensuring pixel-perfect execution.",
    icon: "solar:code-square-linear",
    className: "col-span-1 sm:col-span-2" // Full width on desktop
  },
  {
    title: "Interaction Design",
    description: "Creating fluid, meaningful interactions that make products feel alive and intuitive.",
    icon: "solar:cursor-square-linear",
    className: "col-span-1"
  },
  {
    title: "System Architecture",
    description: "Building scalable design systems that maintain consistency across large products.",
    icon: "solar:layers-minimalistic-linear",
    className: "col-span-1"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark bg-white dark:bg-app-bg-dark">
      <header className="w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-[max(env(safe-area-inset-top),16px)] md:pt-4">
          <Header />
        </div>
      </header>

      <main className="flex-1 w-full max-w-[600px] mx-auto px-4 pt-10 pb-20">
        
        {/* HERO / ABOUT ME */}
        <section className="mb-20">
            <div className="flex flex-col gap-6">
                 <h1 className="text-[22px] leading-8 tracking-[1%] font-medium text-custom-gray-900 dark:text-app-text-dark">
                    Let&apos;s build something <br className="hidden sm:block"/> 
                    <span className="text-custom-gray-500 dark:text-custom-gray-400">extraordinary together.</span>
                </h1>
                
                <div className="space-y-4 text-base leading-6 tracking-[0.5%] text-custom-gray-600 dark:text-custom-gray-400 max-w-lg">
                    <p>
                    I&apos;m a Product Designer turned Design Engineer who loves turning complex ideas into simple, delightful experiences. 
                    </p>
                </div>

                <div className="pt-2">
                    <ResumeButton />
                </div>
            </div>
        </section>

        {/* EXPERIENCE TIMELINE - Redesigned */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-[22px] leading-8 tracking-[1%] font-medium flex items-center gap-2 text-custom-gray-900 dark:text-app-text-dark">
                <Icon icon="solar:history-linear" className="w-5 h-5 text-custom-gray-400" />
                Experience
            </h2>
          </div>
         
          <div className="space-y-8">
            {EXPERIENCE.map((exp, index) => (
              <Link 
                key={index} 
                href={exp.link} 
                target="_blank" 
                className="group block relative pl-4 border-l-2 border-custom-gray-100 dark:border-custom-gray-800 hover:border-custom-gray-300 dark:hover:border-custom-gray-600 transition-colors py-1"
              >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                    <h3 className="text-base font-medium text-custom-gray-900 dark:text-app-text-dark group-hover:text-custom-gray-600 dark:group-hover:text-custom-gray-300 transition-colors">
                      {exp.company}
                    </h3>
                    <span className="text-base leading-6 tracking-[0.5%] text-custom-gray-400 dark:text-custom-gray-600">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-base leading-6 tracking-[0.5%] text-custom-gray-500 dark:text-custom-gray-400 mb-2">
                      {exp.role}
                  </div>
                  <p className="text-base leading-6 tracking-[0.5%] text-custom-gray-600 dark:text-custom-gray-400 max-w-md">
                    {exp.description}
                  </p>
                  
                  {/* Hover Indicator */}
                  <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-custom-gray-300 dark:bg-custom-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>

        {/* CAPABILITIES - Bento Grid */}
        <section className="mb-20">
          <h2 className="text-[22px] leading-8 tracking-[1%] font-medium mb-8 flex items-center gap-2 text-custom-gray-900 dark:text-app-text-dark">
            <Icon icon="solar:star-linear" className="w-5 h-5 text-custom-gray-400" />
            What I can do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CAPABILITIES.map((cap, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-2xl bg-custom-gray-50 dark:bg-custom-gray-900/50 border border-custom-gray-100 dark:border-custom-gray-800 hover:border-custom-gray-200 dark:hover:border-custom-gray-700 transition-colors ${cap.className}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-custom-gray-800 flex items-center justify-center text-custom-gray-700 dark:text-custom-gray-200 mb-4 border border-custom-gray-100 dark:border-custom-gray-700">
                   <Icon icon={cap.icon} className="w-5 h-5" />
                </div>
                <h3 className="text-base font-medium text-custom-gray-900 dark:text-app-text-dark mb-2">{cap.title}</h3>
                <p className="text-base leading-6 tracking-[0.5%] text-custom-gray-500 dark:text-custom-gray-400">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS - Clean Tags */}
        <section className="mb-20">
          <h2 className="text-[22px] leading-8 tracking-[1%] font-medium mb-6 flex items-center gap-2 text-custom-gray-900 dark:text-app-text-dark">
             <Icon icon="solar:code-circle-linear" className="w-5 h-5 text-custom-gray-400" />
             Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-md bg-white dark:bg-custom-gray-900 border border-custom-gray-200 dark:border-custom-gray-800 text-base leading-6 tracking-[0.5%] font-medium text-custom-gray-600 dark:text-custom-gray-400 hover:text-custom-gray-900 dark:hover:text-custom-gray-200 hover:border-custom-gray-300 dark:hover:border-custom-gray-600 transition-all cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </section>



      </main>

      {/* FOOTER */}
      <footer className="w-full pt-[100px] md:pt-20">
        <div className="mx-auto w-full max-w-[600px] px-4 pb-[max(env(safe-area-inset-bottom),16px)] md:pb-4">
          <div className="mb-[16px]">
            <SubPageMenu />
          </div>
          <Footer />
        </div>
      </footer>
    </div>
  );
}
