"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8, scale: 0.98, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, scale: 0.985, filter: "blur(4px)" }}
        transition={{ duration: 0.38, ease: EASE }}
      >
        {/* optional curtain */}
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[39] bg-white"
          initial={{ y: "100%" }}
          animate={{ y: "100%" }}
          exit={{ y: 0 }}
          transition={{ duration: 0.38, ease: EASE }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
