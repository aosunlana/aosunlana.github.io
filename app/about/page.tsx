"use client";

import Link from "next/link";
import {
  Envelope,
  XLogo,
  GithubLogo,
  LinkedinLogo,
  ArrowUpRight,
  PenNib,
  Code,
} from "@phosphor-icons/react";
import SubPageMenu from "@/components/SubPageMenu";
import Footer from "@/components/Footer";
import ResumeButton from "./ResumeButton";
import Reveal from "./Reveal";
import ContactRow from "./ContactRow";

const EXPERIENCE = [
  {
    company: "Tempo (YC S23)",
    href: "https://www.tempo.new/",
    role: "Design Engineer",
    period: "2025",
    body: "Designed and helped build an AI visual IDE that let developers and designers ship interfaces faster. I worked end to end, from research and prototyping to the polished UI.",
  },
  {
    company: "Digit Insurance",
    href: "https://www.godigit.com/",
    role: "Product Designer",
    period: "2022 - 2025",
    body: "Owned design end to end for a digital insurance platform at one of India's largest digital-first insurers. Ran research, shipped UI, and worked closely with product, engineering, and marketing.",
  },
  {
    company: "Carbon (formerly Vella Finance)",
    href: "https://www.getcarbon.co/",
    role: "Product Designer",
    period: "2021 - 2023",
    body: "Built and kept up the product's visual language and design system at a pan-African fintech, working with engineering to ship to a high bar.",
  },
  {
    company: "Earlier",
    href: null,
    role: "Product and UI Design",
    period: "2019 - 2022",
    body: "Earlier product and UI work across fintech and early-stage teams (LAHPay, Hespat, and freelance).",
  },
];

const BUILDING = [
  {
    name: "Veer",
    domain: "useveer.xyz",
    href: "https://useveer.xyz",
    description:
      "Animate any logo or icon in the browser, then export it or copy the code.",
  },
  {
    name: "MyTherapist",
    domain: "mytherapist.tools",
    href: "https://mytherapist.tools",
    description:
      "A hand-tested directory of therapy software, so choosing a tool doesn't mean ten open tabs.",
  },
];

const WHAT_I_DO = [
  {
    title: "Design Engineering",
    body: "I design a thing, then build the real version, so nothing gets lost between the Figma file and what ships.",
  },
  {
    title: "Interaction Design",
    body: "The motion and feedback that make an interface feel right. Usually the part nobody notices until it is missing.",
  },
  {
    title: "Design Systems",
    body: "Components and patterns that keep a growing product consistent, and keep the design and the code from drifting apart.",
  },
];

const TOOLBOX = [
  { label: "Design", icon: PenNib, items: "Product Design, Design Systems, Prototyping, Figma, Framer Motion" },
  { label: "Build", icon: Code, items: "React, Next.js, TypeScript, Tailwind, Node.js" },
];

const CONTACT = [
  { label: "Email", value: "hello@emmah.xyz", href: "mailto:hello@emmah.xyz", icon: Envelope },
  { label: "Twitter", value: "@hey_emmah", href: "https://x.com/hey_emmah", icon: XLogo },
  { label: "GitHub", value: "hey-emmah", href: "https://github.com/hey-emmah", icon: GithubLogo },
  { label: "LinkedIn", value: "in/emmah-priestley", href: "https://www.linkedin.com/in/emmah-priestley/", icon: LinkedinLogo },
];

const sectionTitle =
  "text-xs font-medium uppercase tracking-wider text-custom-gray-400 dark:text-custom-gray-500";

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-custom-gray-900 dark:bg-app-bg-dark dark:text-app-text-dark">
      <main className="mx-auto w-full max-w-[600px] flex-1 px-4 pt-16 pb-16 md:pt-[22px]">
        {/* Breadcrumb pinned to the top-left corner of the viewport */}
        <nav
          aria-label="Breadcrumb"
          className="absolute left-4 top-3 z-40 flex h-9 items-center gap-2 text-sm text-custom-gray-500 md:left-6 dark:text-custom-gray-400"
        >
          <Link
            href="/"
            className="transition-colors hover:text-custom-gray-900 dark:hover:text-app-text-dark"
          >
            Index
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-custom-gray-900 dark:text-app-text-dark">About</span>
        </nav>

        {/* Hero */}
        <Reveal>
          <div>
            <h1 className="font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.01em] sm:text-[40px]">
              Emmanuel A. Priestley
            </h1>
            <p className="mt-4 text-[1.0625rem] leading-7 text-custom-gray-600 dark:text-custom-gray-400">
              Design engineer. I design the thing, then build it. I&apos;m a
              product designer who learned to build. I spent a few years on
              fintech and insurance products, then got tired of handing designs
              off and watching the details slip, so I started shipping them
              myself. Going from a rough idea to a real, working thing is still
              the part I like most.
            </p>
            <div className="mt-6">
              <ResumeButton />
            </div>
          </div>
        </Reveal>

        {/* Experience */}
        <Reveal>
          <section className="mt-16">
            <h2 className={sectionTitle}>Experience</h2>
            <div className="mt-4 flex flex-col">
              {EXPERIENCE.map((exp) => {
                const Row = exp.href ? "a" : "div";
                return (
                  <Row
                    key={exp.company}
                    {...(exp.href
                      ? { href: exp.href, target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group -mx-3 rounded-xl px-3 py-3 transition-colors hover:bg-custom-gray-100/70 dark:hover:bg-app-card-dark/40"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-medium text-custom-gray-900 transition-colors group-hover:text-app-link-text-hover dark:text-app-text-dark">
                        {exp.company}
                        <span className="ml-2 font-normal text-custom-gray-500 dark:text-custom-gray-400">
                          {exp.role}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-custom-gray-400 dark:text-custom-gray-500">
                        {exp.period}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[0.95rem] leading-6 text-custom-gray-500 dark:text-custom-gray-400">
                      {exp.body}
                    </p>
                  </Row>
                );
              })}
            </div>
          </section>
        </Reveal>

        {/* Building */}
        <Reveal>
          <section className="mt-16">
            <h2 className={sectionTitle}>Building</h2>
            <div className="mt-4 flex flex-col">
              {BUILDING.map((project) => (
                <a
                  key={project.domain}
                  href={project.href}
                  target="_blank"
                  rel="noopener"
                  className="group -mx-3 flex items-start justify-between gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-custom-gray-100/70 dark:hover:bg-app-card-dark/40"
                >
                  <span className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 font-medium text-custom-gray-900 transition-colors group-hover:text-app-link-text-hover dark:text-app-text-dark">
                      {project.name}
                      <ArrowUpRight
                        size={15}
                        aria-hidden="true"
                        className="text-custom-gray-400 transition-colors group-hover:text-app-link-text-hover dark:text-custom-gray-500"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </span>
                    <span className="text-[0.95rem] leading-6 text-custom-gray-500 dark:text-custom-gray-400">
                      {project.description}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-custom-gray-400 dark:text-custom-gray-500">
                    {project.domain}
                  </span>
                </a>
              ))}
            </div>
          </section>
        </Reveal>

        {/* What I do */}
        <Reveal>
          <section className="mt-16">
            <h2 className={sectionTitle}>What I do</h2>
            <div className="mt-4 flex flex-col">
              {WHAT_I_DO.map((item) => (
                <div key={item.title} className="py-3">
                  <h3 className="font-medium text-custom-gray-900 dark:text-app-text-dark">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[0.95rem] leading-6 text-custom-gray-500 dark:text-custom-gray-400">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Toolbox */}
        <Reveal>
          <section className="mt-16">
            <h2 className={sectionTitle}>Toolbox</h2>
            <dl className="mt-4 flex flex-col gap-3">
              {TOOLBOX.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <div
                    key={group.label}
                    className="flex flex-col gap-1 sm:flex-row sm:gap-6"
                  >
                    <dt className="flex w-24 shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-custom-gray-400 dark:text-custom-gray-500 sm:pt-0.5">
                      <GroupIcon size={14} aria-hidden="true" className="shrink-0" />
                      {group.label}
                    </dt>
                    <dd className="text-[0.95rem] text-custom-gray-700 dark:text-custom-gray-300">
                      {group.items}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        </Reveal>

        {/* Contact */}
        <Reveal>
          <section className="mt-16">
            <h2 className={sectionTitle}>Contact</h2>
            <ul className="mt-4 flex flex-col">
              {CONTACT.map((c) => (
                <li key={c.label}>
                  <ContactRow
                    label={c.label}
                    value={c.value}
                    href={c.href}
                    icon={c.icon}
                  />
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </main>

      {/* Footer */}
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
