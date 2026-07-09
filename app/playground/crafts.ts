// A craft is one "stage" in the Playground. It can be a static image mockup
// (exported from Figma), a live interactive component, or a placeholder.
//
// Shared fields live on Base; the `kind` discriminates how CraftStage renders.

// An optional writeup section shown below the stage on the detail page.
export type CraftSection = {
  heading?: string; // short label, e.g. "Context" or "How it's built"
  paragraphs: string[]; // one entry per paragraph
};

type Base = {
  slug: string;
  title: string;
  date?: string;
  aspect: string; // grid card + stage aspect, e.g. "4 / 3"
  background?: string; // stage background, defaults to a dark surface
  summary?: string; // one line, used for the detail metadata + OG image
  writeup?: CraftSection[]; // optional case-study copy below the stage
  // A static image shown on the GRID card. Recommended for `component` crafts so
  // the grid stays light (the live demo only mounts on the detail stage).
  poster?: string;
  posterDark?: string;
};

export type Craft =
  // Static image mockup (e.g. a Figma export in /public/playground).
  | (Base & { kind: "image"; src: string; srcDark?: string; alt: string })
  // Live interactive component, keyed into the craft registry.
  | (Base & { kind: "component"; component: string })
  // Empty stage (image icon). The default when kind is omitted.
  | (Base & { kind?: "placeholder" });

// Newest first. Swap these for real crafts as they are ready.
export const crafts: Craft[] = [
  {
    slug: "invite-stack",
    title: "Invite stack",
    aspect: "4 / 3",
    date: "2026-07",
    background: "#fafafa",
    kind: "component",
    component: "invite-stack",
    summary: "The invite control you see in every app. A row of faces, and a plus to add more.",
    writeup: [
      {
        heading: "Why",
        paragraphs: [
          "Every product has an invite somewhere, and most of them feel rushed. I used this as an excuse to slow down on the small moments: the hover, adding someone by email, the way a new face slots into the row.",
        ],
      },
      {
        heading: "Try it",
        paragraphs: [
          "Type a few emails, separated by commas, and send. Each person drops into the stack and the tag flips from sent to accepted. Or copy the link and it is on your clipboard.",
          "Hover a face to see the name, and the little cross to take them back out.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The row is a flex line with negative margins so the circles sit over each other, and each face comes from DiceBear. When someone joins, the layout slides everyone across on its own.",
          "The form opens with a height and fade, checks the email as you type, and the copy button writes to the clipboard, then shows a tick for a second.",
        ],
      },
    ],
  },
  { slug: "placeholder-01", title: "Placeholder 01", aspect: "4 / 3" },
  { slug: "placeholder-02", title: "Placeholder 02", aspect: "3 / 4" },
  { slug: "placeholder-03", title: "Placeholder 03", aspect: "1 / 1" },
  { slug: "placeholder-04", title: "Placeholder 04", aspect: "16 / 9" },
  { slug: "placeholder-05", title: "Placeholder 05", aspect: "4 / 3" },
  { slug: "placeholder-06", title: "Placeholder 06", aspect: "3 / 4" },
];

export const getCraftIndex = (slug: string) =>
  crafts.findIndex((c) => c.slug === slug);
