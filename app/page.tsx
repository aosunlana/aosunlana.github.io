"use client";

import { motion, type Variants } from "framer-motion";
import Header from "./components/header/Header";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(3px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
};

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col items-start px-4 md:px-20 pt-[max(env(safe-area-inset-top),16px)] md:pt-4 text-custom-gray-900">
      <div className="w-full">
        <Header />
      </div>

      <motion.main
        className="flex-1 w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="max-w-[542px]">
          <motion.h2
            variants={item}
            className="text-2xl md:text-3xl font-medium pt-6 md:pt-16 pb-4 md:pb-6 leading-snug"
          >
            Exploring what happens <br />
            when <span className="text-custom-gray-400">designer</span> thinks
            like an <span className="text-custom-gray-400">engineer</span>
          </motion.h2>

          <motion.p variants={item} className="text-base md:text-lg leading-relaxed pb-4">
            Hi, 👋🏼 I&rsquo;m Emmanuel - a{" "}
            <span className="text-custom-gray-400">curious human</span> who
            designs interfaces and builds digital things for a living. Sometimes
            with Framer, sometimes with Figma, always with vibes.
          </motion.p>

          <motion.p variants={item} className="text-base md:text-lg leading-relaxed">
            <span className="text-custom-gray-400">
              <a
                href="/playground"
                className="underline decoration-dotted decoration-current underline-offset-8 hover:decoration-2 hover:text-custom-gray-800"
              >
                Explore my playground
              </a>
            </span>{" "}
            for a few things I&rsquo;ve designed that actually shipped and
            didn&rsquo;t break the internet - in a good way :)
          </motion.p>
        </div>
      </motion.main>

      <motion.footer variants={item} className="mt-auto w-full text-base md:text-lg leading-relaxed pb-10 pt-10">
        <p>
          Follow on X:{" "}
          <span className="text-custom-gray-400">
            <a
              href="https://x.com/hey_emmah"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted decoration-current underline-offset-8 hover:decoration-2 hover:text-custom-gray-800"
            >
              @hey_emmah;
            </a>
          </span>
        </p>
        <p className="pt-2">
          I believe obsession beats talent, and <br />
          I&rsquo;ve built my craft by refusing to let go until it&rsquo;s done
          right.
        </p>
        <p className="text-sm text-custom-gray-400 pt-2">
          &copy; {new Date().getFullYear()} Emmanuel. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
}
