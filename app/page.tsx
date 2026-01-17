"use client";

import Header from "./components/header/Header";
import Showcase from "./components/Showcase";
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
        <div className="mx-auto w-full max-w-[600px] px-4 flex items-center">
          <section className="w-full">
            <h1 className="text-[22px] leading-8 tracking-[1%] font-medium pt-6 pb-6 md:pt-4">
              Exploring what happens <br />
              when <span className="text-custom-gray-500">designer</span> thinks
              like an <span className="text-custom-gray-500">engineer</span>
            </h1>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              A{" "}
              <span className="text-custom-gray-500 font-medium">
                Product Designer
              </span>{" "}
              who loves turning complex ideas into simple, delightful
              experiences. I design interfaces, craft systems, and bring digital
              products to life, sometimes with Framer, sometimes with Figma,
              always with a strong sense of purpose and vibes :)
            </p>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              Over the past 5 years, I&rsquo;ve designed across Fintech,
              Autotech, Edutech, Insurance, exploring the world of AI and
              collaborating with teams at:
            </p>

            <div>
              <Showcase />    
            </div>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              While my foundation is firmly in Product Design, I&rsquo;m
              actively exploring the horizon of{" "}
              <span className="text-custom-gray-500">Design Engineering</span>,
              blurring the line between design and development. I believe the
              future of product design isn&rsquo;t just about how things look,
              but also about how fast and seamlessly they can be built, tested,
              and shipped.
            </p>

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              This portfolio is my sandbox: a mix of projects I&rsquo;ve{" "}
              <span className="text-custom-gray-500">
                <a
                  href="/playground"
                  className="underline decoration-dotted decoration-current underline-offset-6 hover:decoration-2 hover:text-custom-gray-800"
                >
                  designed, shipped, and iterated
                </a>
              </span>{" "}
              on some that made an impact quietly, without breaking the
              internet, and that&rsquo;s a win in itself :)
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
          <Footer />
        </div>
      </footer>
    </div>
  );
}
