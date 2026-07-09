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
              I design interfaces and build <br />
              the <span className="text-custom-gray-500 dark:text-app-link-text-default ">version</span> that{" "}
              <span className="text-custom-gray-500 dark:text-app-link-text-default">ships</span>.
            </h2>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              I started in{" "}
              <span className="text-custom-gray-500 dark:text-app-link-text-default font-medium">
                product design
              </span>{" "}
              and kept crossing into code. Now I do both: design the thing, then
              build it. I pay attention to the small details people feel but
              rarely name, and to how quickly an idea can become something real.
            </p>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              Over the past few years I&rsquo;ve designed across fintech and
              insurance, and worked with teams at:
            </p>

            <div className="pt-[16px] pb-[16px]">
              <BrandWidget />    
            </div>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              My foundation is in Product Design, and I&rsquo;ve moved steadily
              into{" "}
              <span className="text-custom-gray-500 dark:text-app-link-text-default">Design Engineering</span>.
              I care as much about how a product is built and shipped as how it
              looks.
            </p>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              This site collects a few things I&rsquo;ve{" "}
              <span className="text-custom-gray-500 dark:text-app-link-text-default">
                <Link
                  href="/playground"
                  className="underline decoration-dotted decoration-current underline-offset-6 hover:decoration-2 hover:text-app-link-text-hover"
                >
                  designed, shipped, and iterated
                </Link>
              </span>{" "}
              on, plus experiments and notes.
            </p>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              <span className="font-medium">What&rsquo;s next?</span> Pushing
              the boundary of design by combining creativity with code.
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
