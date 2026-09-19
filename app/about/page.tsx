"use client";

import Link from "next/link";
import {
  Envelope,
  GithubLogo,
  ArrowUpRight,
  Code,
  Stack,
} from "@phosphor-icons/react";
import SubPageMenu from "@/components/SubPageMenu";
import Footer from "@/components/Footer";
import Reveal from "./Reveal";
import ContactRow from "./ContactRow";

const EXPERIENCE = [
  {
    company: "Upsert Labs Limited",
    href: "https://eventhome.app",
    role: "Co-Founder & CEO",
    period: "— Present", // start date not confirmed
    body: "Building Upsert Labs Limited's product suite from the ground up: EventHome (event ticketing, marketing, and venue discovery for the Nigerian market — bank-transfer-first checkout, double-entry ledger accounting, atomic ticket inventory, offline-capable QR check-in), Upsert (a managed WordPress storefront platform — the only managed-WordPress store builder in Nigeria, zero commission, free themes and plugin requests), and Upsert Scout (an internal job-discovery and company-crawling tool: Playwright-based headless crawling, scheduled recrawls, retry/backoff resilience, JWT auth, verified company seed data). Own product, architecture, and payments integration (Paystack/Flutterwave) across all three.",
  },
  {
    company: "Tredar",
    href: null,
    role: "Founder",
    period: "— Present", // start date not confirmed
    body: "Co-founded and built the product for Tredar, a point-of-sale and commerce platform (tredar-pos, tredar-core), partnering with a co-founder on the business/sales side while owning engineering.",
  },
  {
    company: "Dreamlabs Innovations",
    href: null,
    role: "Software Engineer",
    period: "2026 · Recent", // exact start date unconfirmed; commits observed through at least April 2026
    body: "Lead contributor on Trava, a mobile app and API platform — top contributor by commit volume on both Trava.UI.Mobile and Trava.Core.Api.",
  },
  {
    company: "Aspen Publishing",
    href: null,
    role: "Software Engineer",
    period: "May 2024 - Jan 2025", // observed commit range
    body: "Contributed to Aspen Publishing's .NET/Azure backend and mobile systems (NL.Apps.Mobile, NL.Web.Grove, NL.Core.GateKeeper.Api), built to \"The Standard\" clean-architecture methodology — several hundred commits across mobile and backend services.",
  },
  {
    company: "Smarttasker",
    href: null,
    role: "Software Engineer",
    period: "Dates unconfirmed",
    body: "Contributed to Smarttasker Indonesia's landing page, API, and mobile app alongside the core team.",
  },
  {
    company: "BestBytes AI",
    href: null,
    role: "Exploratory work",
    period: "Dates unconfirmed",
    body: "Built two solo proof-of-concept services (an auth POC, an experimental \"RedRhino pHat\" POC), exploratory work alongside the BestBytes AI team.",
  },
];

const OPEN_SOURCE = [
  {
    name: "The Standard",
    domain: "hassanhabib/The-Standard",
    href: "https://github.com/hassanhabib/The-Standard",
    description:
      "Contributor to Hassan Habib's clean-architecture methodology and reference implementation for .NET.",
  },
  {
    name: "EventHighway",
    domain: "The-Standard-Organization/EventHighway",
    href: "https://github.com/The-Standard-Organization/EventHighway",
    description:
      "One of the most active contributors on the project — 137 commits.",
  },
  {
    name: "ADotNet",
    domain: "The-Standard-Organization/ADotNet",
    href: "https://github.com/The-Standard-Organization/ADotNet",
    description: "Minor contributor.",
  },
];

const WHAT_I_DO = [
  {
    title: "Product & Founding Engineering",
    body: "Building products end to end as a founder: architecture, backend, payments, and shipping to real users.",
  },
  {
    title: "Payments & Financial Infrastructure",
    body: "Double-entry ledgers, idempotent payment webhooks, atomic inventory, Paystack/Flutterwave integrations.",
  },
  {
    title: "Clean Architecture",
    body: "Building to \"The Standard\" methodology (Brokers/Services/Controllers, one-way dependency flow, high test coverage) across .NET and TypeScript codebases.",
  },
];

const TOOLBOX = [
  { label: "Backend", icon: Stack, items: "C#/.NET, TypeScript, Node.js, PostgreSQL, Drizzle" },
  { label: "Frontend", icon: Code, items: "React, Next.js, Tailwind CSS" },
];

const CONTACT = [
  { label: "Email", value: "adwhatsap@gmail.com", href: "mailto:adwhatsap@gmail.com", icon: Envelope },
  { label: "GitHub", value: "aosunlana", href: "https://github.com/aosunlana", icon: GithubLogo },
  // No verified Twitter/X or LinkedIn handle for Abdulsamad — omitted rather than guessed.
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
              Abdulsamad Osunlana
            </h1>
            <p className="mt-4 text-[1.0625rem] leading-7 text-custom-gray-600 dark:text-custom-gray-400">
              Software engineer and founder. I build event-commerce and
              storefront platforms end to end — from ledger-accurate payments
              infrastructure to the storefront a customer actually buys from.
              Currently building Upsert Labs Limited (EventHome, Upsert,
              Upsert Scout).
            </p>
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

        {/* Open Source */}
        <Reveal>
          <section className="mt-16">
            <h2 className={sectionTitle}>Open Source</h2>
            <div className="mt-4 flex flex-col">
              {OPEN_SOURCE.map((project) => (
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
