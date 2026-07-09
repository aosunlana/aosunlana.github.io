"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Interactive craft demos, keyed by the `component` value on a `kind: "component"`
// craft. Each demo is a self-contained client component in ./demos that fills its
// container. Loaded lazily so a demo only ships when its craft is opened.
//
// Example:
//   const craftDemos = {
//     "magnetic-button": dynamic(() => import("./demos/MagneticButton"), { ssr: false }),
//   };
export const craftDemos: Record<string, ComponentType> = {
  "invite-stack": dynamic(() => import("./demos/InviteStack"), { ssr: false }),
  "command-search": dynamic(() => import("./demos/CommandSearch"), { ssr: false }),
};
