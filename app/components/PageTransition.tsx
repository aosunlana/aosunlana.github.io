"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Dir = 1 | -1;

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [direction, setDirection] = useState<Dir>(1);
  const popTriggeredRef = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      popTriggeredRef.current = true;
      setDirection(-1);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!popTriggeredRef.current) setDirection(1);
    popTriggeredRef.current = false;
  }, [pathname]);

  const variants = {
    initial: (dir: Dir) => ({
      x: dir === 1 ? "100%" : "-100%",
    }),
    animate: {
      x: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir: Dir) => ({
      x: dir === 1 ? "-100%" : "100%",
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative z-10 min-h-screen bg-white"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
