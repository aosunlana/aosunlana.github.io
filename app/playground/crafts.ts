// A craft is one "stage" in the Playground. It can be a static image mockup
// (exported from Figma), a live interactive component, or a placeholder.
//
// Shared fields live on Base; the `kind` discriminates how CraftStage renders.

// An optional writeup section shown below the stage on the detail page.
export type CraftSection = {
  heading?: string; // short label, e.g. "Context" or "How it's built"
  paragraphs: string[]; // one entry per paragraph
  code?: string; // optional code snippet rendered after the paragraphs
  after?: string[]; // optional paragraphs rendered after the code block
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
    slug: "prompt-composer",
    title: "Prompt composer",
    aspect: "4 / 3",
    date: "2026-07",
    background: "#eeeef0",
    kind: "component",
    component: "prompt-composer",
    summary: "A chat box, the kind you type into all day. Quiet while you write, with the rest of it a tap away when you need it.",
    writeup: [
      {
        heading: "Why",
        paragraphs: [
          "I live in one of these, so I knew what I wanted before I started. Stay boring while I type. Do not make me dig for the model or the tools. Keep everything else folded up until I ask. Most of the work was leaving things out, not piling them in.",
        ],
      },
      {
        heading: "Try it",
        paragraphs: [
          "Type and the send button turns dark. Tools are on or off, so turning one on drops a small chip you can tap to remove. The model list is searchable, with a beta tag on one and a soon tag on another. Voice turns the bar into a recorder with a moving waveform, and drops the transcript back in when you hit stop.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "There is no magic here. It is a few booleans and a couple of small bits of state, and the UI just reads them, so a chip and its tick in the menu can never disagree. The menus also check how much room is above them and cap their height, so a long list does not run off the top.",
          "The two parts worth showing are the send button and the voice swap. The button watches one value and fades its background. Voice is two layouts under one AnimatePresence, and swapping on wait lets the box resize while it is faded, which is why it never pops:",
        ],
        code: `// One flag drives the send button, resting to armed.
const canSend = text.trim().length > 0

<motion.button
  disabled={!canSend}
  animate={{ backgroundColor: canSend ? "#1a1a1a" : "#e6e6e8" }}
  transition={{ duration: 0.25 }}
/>

// Voice and text are two layouts behind one crossfade.
// Swapping on "wait" hides the height change, so the bar
// resizes while both are faded and never jumps.
<AnimatePresence mode="wait">
  {recording
    ? <Recorder key="rec" />
    : <Composer key="text" />}
</AnimatePresence>`,
        after: [
          "That is the pattern the whole thing leans on. Read a value, animate a property off it, and let the state be the single source of truth. No part of the UI reaches over to poke another, so there is nothing to keep in sync by hand.",
        ],
      },
    ],
  },
  {
    slug: "command-search",
    title: "Command search",
    aspect: "3 / 2",
    date: "2026-07",
    background: "#2e2e2e",
    kind: "component",
    component: "command-search",
    summary: "A search box that starts empty and quiet, then turns into grouped, live results as you type.",
    writeup: [
      {
        heading: "Why",
        paragraphs: [
          "I hit a box like this before I even know what I am after, so I cared most about two things. What it shows me before I type, and how it marks a match without lighting up the whole row. Those took the longest by far.",
        ],
      },
      {
        heading: "Try it",
        paragraphs: [
          "Click the bar and it opens. With nothing typed you get the resting view: a few filters, your last searches, a couple of quick actions, a recent file. Open More for extra filters, or hit sort to flip the people list around.",
          "Start typing and it turns into results, people first, then files, reactions, collections. Type mar and the matches glow, even the ones sitting inside an email. Put an @ in front and a little people picker drops in. Click anywhere outside and it shrinks back to one bar.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The trick with the matches is that I do not just find them, I wrap them. A small function walks the text and splits it around each hit, so the match can be its own styled piece rather than a highlight painted over the row. That is why it works the same in a name, a domain, or a comma list.",
        ],
        code: `// Split the text around each hit and mark the matches.
function highlight(text, q) {
  const out = []
  const lower = text.toLowerCase()
  let i = 0
  for (let at; (at = lower.indexOf(q, i)) !== -1; i = at + q.length) {
    out.push(text.slice(i, at))
    out.push(<mark className="text-amber-500">{text.slice(at, at + q.length)}</mark>)
  }
  out.push(text.slice(i))
  return out
}`,
        after: [
          "Searching a person is relational, not literal. Every file and list carries the people on it, so looking up a name pulls in the things they touch, not only the rows their name shows up in. Resting and results are two separate layouts too, swapped on whether the box is empty, so I could tune each one without the other getting in the way.",
        ],
      },
    ],
  },
  {
    slug: "invite-stack",
    title: "Invite stack",
    aspect: "4 / 3",
    date: "2026-07",
    background: "#fafafa",
    kind: "component",
    component: "invite-stack",
    summary: "The row of faces with a plus on the end that shows up in every app. I slowed down and sweated the small parts.",
    writeup: [
      {
        heading: "Why",
        paragraphs: [
          "Every app has an invite screen and most of them feel like an afterthought. I took it as a chance to fuss over the small stuff instead: the hover, typing an email, the way a new face slides into the row and pushes the rest over.",
        ],
      },
      {
        heading: "Try it",
        paragraphs: [
          "Type a few emails with commas between them and send. Each one drops into the stack and its tag flips from sent to accepted. Or copy the link and it is on your clipboard.",
          "Hover a face to see who it is, and a little cross to pull them back out.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The overlap is the fun part. It is a plain flex row with a negative margin so each circle sits on the one before it, and a ring the colour of the background to fake the little cut-out gap. The sliding is not mine to write, though. A layout animation handles it, so adding or removing a face reflows the whole row on its own:",
        ],
        code: `// Negative margin overlaps the circles; the ring fakes the
// cut-out; layout animates the reflow when the list changes.
{members.map((m) => (
  <motion.div
    key={m.id}
    layout
    className="-ml-3 rounded-full ring-2 ring-white"
  >
    <Avatar seed={m.seed} />
  </motion.div>
))}`,
        after: [
          "The rest is little touches stacked up. The invite form opens on its own height and fade, the address gets checked as you type, and the copy button writes to the clipboard, flashes a tick for a second, then settles back. None of it is hard on its own. It just needed someone to bother.",
        ],
      },
    ],
  },
];

export const getCraftIndex = (slug: string) =>
  crafts.findIndex((c) => c.slug === slug);
