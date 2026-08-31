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
    slug: "text-toolbar",
    title: "Selection toolbar",
    aspect: "3 / 2",
    date: "2026-08",
    background: "#eceef1",
    kind: "component",
    component: "text-toolbar",
    summary:
      "Select any words and a formatting bar floats above the selection. The controls format the real text and reflect its current state.",
    writeup: [
      {
        heading: "Why",
        paragraphs: [
          "Every editor has a formatting bar that floats over selected text, and most get it subtly wrong. I built this to get the four things they miss right at the same time: where the bar sits, how it tracks the selection, how its buttons reflect the current formatting, and how the selection survives a click on the bar.",
        ],
      },
      {
        heading: "The trap",
        paragraphs: [
          "The bar looks trivial and is not. Click a bold button in a naive build and the browser moves focus to that button, which collapses your selection, so the command has nothing left to act on. Give the bar a fixed offset and it drifts the moment a selection wraps two lines or sits near the top of the viewport. Hold formatting state in React and it lies the instant someone presses Cmd B on the keyboard instead of the button. Each one is its own small fight.",
        ],
      },
      {
        heading: "Try it",
        paragraphs: [
          "Select a run of text. The bar appears above it and follows the selection, flipping below when there is no room at the top. Bold, italic, underline, strike, size, weight, color, highlight, and alignment all change the real text and light up to match what is selected. Keyboard shortcuts stay in sync, and on a narrow screen the extra controls fold into a menu.",
        ],
      },
      {
        heading: "Positioning",
        paragraphs: [
          "On every selection change I read the live range's bounding rectangle and place the bar from it, not from the mouse. It sits ten pixels above the selection and flips underneath when there is no room near the top, then clamps to a twenty pixel inset so it never hugs an edge. Because it reads the real geometry, a selection that wraps two lines still gets a bar centered over the whole run.",
        ],
        code: `// Place the bar off the live selection rectangle, not the cursor.
const rect = range.getBoundingClientRect()
let top = rect.top - barHeight - 10       // above the selection
if (top < 2) top = rect.bottom + 10       // flip below near the top
left = Math.min(Math.max(left, 20), vw - barWidth - 20)  // keep off edges`,
      },
      {
        heading: "Keeping the selection alive",
        paragraphs: [
          "This is the part that trips people. A mousedown on any button steals focus from the text and the selection is gone before the command runs. So every control cancels its own mousedown, which keeps focus and the selection exactly where they were. The command then acts on a selection that is still there, and you can stack bold, then italic, then a color without reselecting once.",
        ],
        code: `// Cancel mousedown so the click never costs you the selection.
<button onMouseDown={(e) => e.preventDefault()} onClick={() => exec("bold")}>`,
      },
      {
        heading: "Reading state back",
        paragraphs: [
          "Bold, italic, underline, strike, and alignment go through the document commands, so their pressed state reads straight back with queryCommandState after any change, a shortcut included. Size, weight, and color have no such query, so I wrap the range in a managed span and read the applied style off the selection instead. Both paths land in the same place: the buttons show what the text actually is right now, never a copy of it held in React that can fall out of step.",
        ],
      },
      {
        heading: "The last mile",
        paragraphs: [
          "A full bar does not fit on a phone, and wrapping it onto two rows reads as broken. The secondary controls collapse behind one overflow button that opens a categorized list: alignment, style, weight, size. The primary actions stay on the bar, so the common case is still a single tap.",
          "The Ask AI pill is an honest affordance, not a canned response pretending to be one. Enter and exit run on a short spring, and under prefers-reduced-motion that becomes a plain fade with no movement. Every control is a real labelled button, so the bar is reachable and legible without a mouse.",
        ],
      },
      {
        heading: "What I would change",
        paragraphs: [
          "execCommand is deprecated, and it is still the honest choice here because it is the only API that reports formatting state back across browsers without me rebuilding it. In a production editor I would move the model into a real document tree and keep this bar as the view, so state never depends on querying the DOM. The interaction work, the positioning and the selection handling, carries over to that version unchanged.",
        ],
      },
    ],
  },
  {
    slug: "select-delete",
    title: "Select and delete",
    aspect: "3 / 2",
    date: "2026-07",
    background: "#eceef1",
    hidden: true,
    kind: "component",
    component: "select-delete",
    summary: "Multi-select a list, a floating bar rises, and delete throws the rows into the trash. Change your mind and they fly back.",
    writeup: [
      {
        heading: "Why",
        paragraphs: [
          "Bulk delete is usually a boring row of checkboxes and a confirm dialog. I wanted the act of throwing things away to feel like actually throwing things away, so the rows you picked lift out and fly into the trash, and the lid opens to catch them.",
        ],
      },
      {
        heading: "Try it",
        paragraphs: [
          "Click rows to select them, shift-click for a range, and a bar rises with the count and the actions. Hit delete and the selected rows arc into the trash while the rest close the gap; an Undo bar puts them back exactly where they were. Archive moves rows aside instead. It is all keyboard driven too: arrows and space to select, Cmd or Ctrl A for all, Delete to remove, Escape to clear, Cmd or Ctrl Z to undo.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The flight is a measure then clone then reflow trick, the same FLIP thinking real list animations use. On delete I snapshot each selected row's position, remove it from the data so the list immediately closes up, then fly a clone of it on top into the trash. The clone is a fixed element animating only transform and opacity in a portal, so the handoff from the real row to the clone is invisible and nothing janks.",
        ],
        code: `// Snapshot the row, remove it from data (list reflows), then fly a clone.
const rect = rowEl.getBoundingClientRect()          // where it is now
setItems((cur) => cur.filter((i) => !selected.has(i.id)))  // list closes up
setClones((c) => [...c, { item, rect, dx, dy }])    // clone flies on top
// clone: position:fixed, animate x/y along an arc + scale 0.16 + fade`,
        after: [
          "The flying part is decorative, so the whole thing has to make sense with it turned off. That is the real work: under prefers-reduced-motion the rows just fade and collapse with no flight, selection is exposed as an aria-multiselectable listbox, every change is announced in a live region, and focus lands on the undo control after a delete. The throw was the fun part; making it correct with the animation off was the actual one.",
        ],
      },
    ],
  },
  {
    slug: "focus-picker",
    title: "Focus picker",
    aspect: "3 / 2",
    date: "2026-07",
    background: "#eceef1",
    kind: "component",
    component: "focus-picker",
    summary: "A scroll wheel where the row in the middle leans forward onto a white card while the rest fall back in scale, opacity, and blur.",
    writeup: [
      {
        heading: "Why",
        paragraphs: [
          "A picker where the middle item leans forward is a small thing that just feels good to use. I wanted to see if I could get the falloff to feel right rather than mechanical, where the rows nearest the center lift toward you and the edges melt away, so your eye always knows where the choice is.",
        ],
      },
      {
        heading: "Try it",
        paragraphs: [
          "Scroll the wheel or grab and drag it, and it snaps so a row always lands in the center on a white card. A soft tick plays as each row passes the middle, like the iPhone picker, and you can mute it with the toggle under the wheel. Click any row to glide it to the center, or use the keyboard: the arrow keys move and center the choice, Home and End jump to the ends, and Enter confirms.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "It is a real scroll container with CSS scroll snap, not a faked transform stack, so the wheel gets native momentum and stays accessible. On scroll, a handler throttled with requestAnimationFrame measures each row's distance from the center, normalizes it over a falloff span, and maps that one number to scale, opacity, and blur. It only touches transform, opacity, and filter, so the whole thing rides the compositor and never janks.",
        ],
        code: `// One distance drives all three. Written plainly on purpose.
const n = Math.min(1, distanceFromCenter / SPAN)   // 0 at center, 1 at edges
row.style.transform = \`scale(\${1 - n * 0.22})\`      // 1 down to 0.78
row.style.opacity   = String(1 - n * 0.72)           // 1 down to 0.28
row.style.filter    = \`blur(\${n * 3}px)\`             // 0 up to 3px`,
        after: [
          "The pretty part was the easy part. Underneath it is a single-select listbox, and that was the actual work: one active option at a time with aria-selected, roving tabindex so focus follows the selection, arrow and Home and End keys, and the active label announced in a live region. The tick is synthesized live with the Web Audio API, no sound file, just a short click on each row change that you can mute. Under reduced motion the blur and smooth scroll drop out and the selection still reads clearly, because the white card and aria-selected carry the meaning, not the effect.",
        ],
      },
    ],
  },
  {
    slug: "task-dissolve",
    title: "Task dissolve",
    aspect: "3 / 2",
    date: "2026-06",
    background: "#eceef1",
    kind: "component",
    component: "task-dissolve",
    summary: "Check a task off and the card turns to dust and blows away. Change your mind and it comes right back.",
    writeup: [
      {
        heading: "Why",
        paragraphs: [
          "Checking something off is a small, good feeling, and a checkbox that just greys out does not earn it. I wanted the card to actually leave, to come apart and drift off, so finishing a task looks like the thing is really gone. The undo is there because the moment you make deleting feel final, people want a way back.",
        ],
      },
      {
        heading: "Try it",
        paragraphs: [
          "Hover the card and it leans toward your cursor. Tap the checkbox and the title strikes through, the card lifts for a beat, then it scatters into dust and blows up and to the right while the next task cascades into place. An Undo bar appears and brings back every task you have cleared, all at once. It pauses its timer when you hover it, and Cmd or Ctrl Z works too. Clear the whole list and you land on a done state you can reset.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Two libraries share the card. GSAP drives the interactive parts, a quickTo tilt that follows your cursor and a staggered reveal that cascades the rows in when a card reaches the front, while framer-motion handles the mount, the advance, and the Undo bar. The dust itself is real, not a stock effect. At the moment you check the box I rasterize the card DOM to a canvas, read the pixels, and sample them into a grid of small colored squares. Each square becomes a particle with the color it sat on plus its own velocity, gravity, and lifetime, and they animate on one oversized canvas so they can blow clear of the card without clipping. The real card is hidden the instant the snapshot exists:",
        ],
        code: `// Snapshot the card, then sample it into particles.
const snap = await toCanvas(cardNode, { pixelRatio: dpr })
const px = snap.getContext("2d").getImageData(0, 0, w, h).data
for (let y = 0; y < rows; y++)
  for (let x = 0; x < cols; x++) {
    const i = (sy * w + sx) * 4
    if (px[i + 3] < 36) continue           // skip transparent cells
    particles.push({
      x, y, r: px[i], g: px[i + 1], b: px[i + 2],
      vx: 0.7 + nx * 2.4, vy: -1.4 - Math.random() * 2.6,
    })
  }`,
        after: [
          "The motion is all decorative, so the whole thing has to work with it switched off. Under prefers-reduced-motion the tilt, the cascade, and the canvas all drop out, the card just fades, and if the rasterize ever fails it takes the same quiet path. The completion is announced in a live region rather than through the animation, so a screen reader hears \"Task completed\" whether the dust runs or not.",
        ],
      },
    ],
  },
  {
    slug: "date-range-picker",
    title: "Date range picker",
    hidden: true,
    aspect: "3 / 2",
    date: "2026-05",
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
    date: "2026-04",
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
    date: "2026-03",
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
    date: "2026-01",
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
    date: "2025-12",
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
    date: "2025-10",
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
