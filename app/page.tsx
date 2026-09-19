"use client";

import Link from "next/link";
import Header from "./components/header/Header";
import SubPageMenu from "./components/SubPageMenu";
import BrandWidget from "./components/BrandWidget";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900">
      {/* HEADER (centered container) */}
      <header className="w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-[max(env(safe-area-inset-top),16px)] md:pt-4">
          <Header />
        </div>
      </header>

      {/* MAIN (centered container + vertical centering) */}
      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 flex items-center dark:text-app-text-dark">
          <section className="w-full">
            <h2 className="font-display text-[23px] leading-8 tracking-[1%] font-semibold pt-6 pb-6 md:pt-4">
              I build products end to end <br />
              from the <span className="text-custom-gray-500 dark:text-app-link-text-default ">ledger</span> to{" "}
              <span className="text-custom-gray-500 dark:text-app-link-text-default">checkout</span>.
            </h2>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              I&rsquo;m a{" "}
              <span className="text-custom-gray-500 dark:text-app-link-text-default font-medium">
                software engineer and founder
              </span>{" "}
              building event-commerce and storefront platforms. I care as much
              about a balanced double-entry ledger and an idempotent payment
              webhook as I do about the storefront a customer actually buys
              from.
            </p>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              I&rsquo;m currently building Upsert Labs Limited, and have
              worked across engineering teams at:
            </p>

            <div className="pt-[16px] pb-[16px]">
              <BrandWidget />
            </div>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              My foundation is backend and payments engineering, built to{" "}
              <span className="text-custom-gray-500 dark:text-app-link-text-default">
                &ldquo;The Standard&rdquo;
              </span>{" "}
              clean-architecture methodology, and I contribute to its open-source
              ecosystem (The Standard, EventHighway, ADotNet) alongside my own
              work.
            </p>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              This site collects{" "}
              <span className="text-custom-gray-500 dark:text-app-link-text-default">
                <Link
                  href="/about"
                  className="underline decoration-dotted decoration-current underline-offset-6 hover:decoration-2 hover:text-app-link-text-hover"
                >
                  where I&rsquo;ve worked and what I&rsquo;ve built
                </Link>
              </span>{" "}
              so far.
            </p>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              <span className="font-medium">What&rsquo;s next?</span> Growing
              EventHome and Upsert into the default event-commerce and
              storefront platforms for the Nigerian market.
            </p>
          </section>
        </div>
      </main>

      {/* FOOTER (centered container) */}
      <footer className="w-full pt-[140px] md:pt-20">
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
