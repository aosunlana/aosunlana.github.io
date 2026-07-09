export type Tool = {
  name: string;
  tagline: string; // short line under the name
  usage: string;
  impact: string;
  url: string;
};

export const tools: Tool[] = [
  {
    name: "Figma",
    tagline: "Where all design work happens.",
    usage: "Interface design, prototyping, and keeping design systems from falling apart.",
    impact:
      "This is where I actually think. I will push things around for an hour before I even know what I am making, and that is the point.",
    url: "https://figma.com",
  },
  {
    name: "Framer",
    tagline: "For shipping websites fast.",
    usage: "Building and shipping small sites and landing pages.",
    impact:
      "When a site needs to be live by tomorrow, I reach for Framer. I can go from an idea to a real URL in an afternoon.",
    url: "https://framer.com",
  },
  {
    name: "Trae",
    tagline: "My editor of choice.",
    usage: "Writing code, most days, most of the day.",
    impact:
      "It is where I live when I am building. The AI help is close enough to how I work that I forget it is there, which is the best thing I can say about an editor.",
    url: "https://trae.ai",
  },
  {
    name: "Claude Code",
    tagline: "My pair for building.",
    usage: "Pairing on code. Features, refactors, and the boring parts.",
    impact:
      "I talk through what I want and it does the typing. A good chunk of this site came together this way: me deciding, it building.",
    url: "https://claude.com/product/claude-code",
  },
  {
    name: "Vercel",
    tagline: "Where my projects live.",
    usage: "Hosting and shipping my Next.js sites and side projects.",
    impact:
      "Push to a branch and it is live in under a minute, with a preview URL for every change. I stopped thinking about deploys, which is the whole point.",
    url: "https://vercel.com",
  },
  {
    name: "Arc",
    tagline: "The browser I can't live without.",
    usage: "Research, reading, and testing my own sites.",
    impact:
      "I keep separate spaces so client work and my own projects do not end up in the same twenty tabs. After that, a normal browser feels rough.",
    url: "https://arc.net",
  },
  {
    name: "Raycast",
    tagline: "Spotlight on steroids.",
    usage: "Launcher, clipboard history, snippets, the odd script.",
    impact:
      "Half my muscle memory lives here. One shortcut instead of clicking through menus, and clipboard history alone has saved me more times than I can count.",
    url: "https://raycast.com",
  },
  {
    name: "Screen Studio",
    tagline: "For recordings that do not look like recordings.",
    usage: "Demo clips, walkthroughs, and the occasional bug report.",
    impact:
      "It makes a plain screen recording look considered, smooth zooms, clean cursor, no fuss. Most of the product clips I share are made with it.",
    url: "https://screen.studio",
  },
  {
    name: "Notion",
    tagline: "Second brain for notes and docs.",
    usage: "Notes, docs, and half-formed plans.",
    impact:
      "Ideas land here before they are any good. Most of them stay. The few that do not turn into real work.",
    url: "https://notion.so",
  },
  {
    name: "Linear",
    tagline: "Issue tracking that feels like magic.",
    usage: "Tracking work and issues.",
    impact:
      "It stays out of my way, which is rare for a project tool. I open it, see what is next, close it, and get back to building.",
    url: "https://linear.app",
  },
];
