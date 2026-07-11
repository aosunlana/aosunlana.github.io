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
  hidden?: boolean; // keep the entry but drop it from the grid + routes
};

export type Craft =
  // Static image mockup (e.g. a Figma export in /public/playground).
  | (Base & { kind: "image"; src: string; srcDark?: string; alt: string })
  // Live interactive component, keyed into the craft registry.
  | (Base & { kind: "component"; component: string })
  // Empty stage (image icon). The default when kind is omitted.
  | (Base & { kind?: "placeholder" });

// Newest first. Swap these for real crafts as they are ready.
const allCrafts: Craft[] = [
  {
    slug: "date-range-picker",
    title: "Date range picker",
    hidden: true,
    aspect: "3 / 2",
    date: "2026-07",
    background: "#f4f4f6",
    kind: "component",
    component: "date-range-picker",
    summary: "Two months, a set of presets, and a range that fills in under your cursor before you have even clicked the second date.",
    writeup: [
      {
        heading: "Why",
        paragraphs: [
          "This is the control everyone needs and nobody enjoys building, so most apps ship a rough one. I wanted the opposite. The bit that makes or breaks it is the moment between the two clicks, when you have a start but no end and you are just moving the mouse around. If that feels alive, the whole thing feels considered.",
        ],
      },
      {
        heading: "Try it",
        paragraphs: [
          "Click a day to set the start, then move across the grid. The range fills in as you go and only commits on the second click. Pick a preset on the side to jump to a common span, page between months with the arrows, or click into the grid and drive the whole thing with the keyboard.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "There is no date library here, just a handful of small helpers over the native Date. The selected range lives in one piece of state. The preview is a second range worked out on the fly from the start and whatever day you are hovering, so the highlight can run ahead of the real selection without ever committing it:",
        ],
        code: `// With a start but no end, the range previews to the
// day under the cursor, ordered so either direction works.
const preview = useMemo(() => {
  if (start && !end && hover) {
    return hover < start
      ? { start: hover, end: start }
      : { start, end: hover }
  }
  return { start, end }
}, [start, end, hover])`,
        after: [
          "Every day cell just asks the same question against that preview, am I the start, the end, or somewhere in between, and styles itself. The keyboard path reuses the exact click handler, so arrows move a focused day and Enter picks it with none of the logic written twice.",
        ],
      },
    ],
  },
  {
    slug: "segmented-tabs",
    title: "Segmented tabs",
    hidden: true,
    aspect: "4 / 3",
    date: "2026-07",
    background: "#f4f4f6",
    kind: "component",
    component: "segmented-tabs",
    summary: "One highlight that glides between tabs, in a pill or an underline, with the panel sliding whichever way you moved.",
    writeup: [
      {
        heading: "Why",
        paragraphs: [
          "Tabs are everywhere and usually snap between states with no life to them. I like the little detail where a single highlight slides from one tab to the next instead of blinking out and back in. Once that felt right I wanted to see how far the same idea stretched, so it does the pill and the underline off the same trick.",
        ],
      },
      {
        heading: "Try it",
        paragraphs: [
          "Click between the tabs and watch the highlight travel. Flip the switch up top to swap the pill for an underline, both glide the same way. The panel underneath slides in the direction you moved, left when you go forward and right when you go back, and you can drag the panel itself sideways to change tabs.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The gliding highlight is one element shared across every tab through a layoutId. Whichever tab is active renders it, and the layout animation carries it between positions on its own. The panel remembers which way you last moved and feeds that direction into the enter and exit, so the slide always matches the travel:",
        ],
        code: `// One highlight, shared by id, glides to the active tab.
{active && <motion.span layoutId="tab-pill" transition={GLIDE} />}

// The panel slides in whichever direction you moved.
<AnimatePresence mode="wait" custom={dir}>
  <motion.div
    key={tab.id}
    custom={dir}
    variants={{
      enter:  (d) => ({ opacity: 0, x: d * 34 }),
      center: { opacity: 1, x: 0 },
      exit:   (d) => ({ opacity: 0, x: d * -34 }),
    }}
  />
</AnimatePresence>`,
        after: [
          "Because the highlight is tied to an id rather than a class, switching the variant does not reset anything. The pill and the underline are two skins over the same moving part, which is why they behave identically no matter how fast you click around.",
        ],
      },
    ],
  },
  {
    slug: "toast-stack",
    title: "Toast stack",
    hidden: true,
    aspect: "4 / 3",
    date: "2026-07",
    background: "#eceef1",
    kind: "component",
    component: "toast-stack",
    summary: "Notifications that fan out behind each other, count down on a bar that waits when you hover, and flick away with a drag.",
    writeup: [
      {
        heading: "Why",
        paragraphs: [
          "A toast has more going on than it lets on. It has to appear without shoving the others around, count itself down, and get out of the way once you have read it. The part people skip is the courtesy, pausing the timer the second you reach over to read one. That is the whole reason I built it.",
        ],
      },
      {
        heading: "Try it",
        paragraphs: [
          "Fire a few from the buttons. They stack at the front and the older ones fan out behind, collapsing into a small plus count once there are more than a few. Hover the stack and it opens into a full list while every timer holds still. Drag any toast sideways to flick it away, or let the bar run out and it leaves on its own.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "One loop drives every countdown. Each tick it rebuilds the toasts with a little less time left and drops the ones that hit zero, and it simply skips that work while the pointer is over the stack. Rebuilding the list each tick is also what nudges the progress bars along, so the timing and the bars can never drift apart:",
        ],
        code: `// One loop ticks every toast down, and skips a beat
// whenever the pointer is resting over the stack.
setInterval(() => {
  if (hovering) return
  setToasts((cur) =>
    cur.map((t) => ({ ...t, remaining: t.remaining - TICK }))
       .filter((t) => t.remaining > 0))
}, TICK)

// A flick past the threshold dismisses the toast.
onDragEnd={(_, info) => {
  if (Math.abs(info.offset.x) > 90) dismiss(id)
}}`,
        after: [
          "The stacking is just each toast placed by its index, offset and scaled a touch while collapsed and laid out in a column while open. Since position comes from the index and not from measuring, adding or removing one lets the rest spring into their new spots without any bookkeeping.",
        ],
      },
    ],
  },
  {
    slug: "prompt-composer",
    title: "Prompt composer",
    aspect: "4 / 3",
    date: "2026-07",
    background: "#eceef1",
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
    background: "#eceef1",
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
    background: "#eceef1",
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

// Anything flagged `hidden` is kept in source but dropped from the grid, the
// detail routes, and prev/next. Remove the flag on a craft to bring it back.
export const crafts: Craft[] = allCrafts.filter((c) => !c.hidden);

export const getCraftIndex = (slug: string) =>
  crafts.findIndex((c) => c.slug === slug);
