import Header from "./components/header/Header";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col items-start pt px-4 md:px-20 pt-[max(env(safe-area-inset-top))] md:pt-4 text-custom-gray-900">
      <div className="w-full">
        <Header />
      </div>

      {/* BODY CONTENT */}
      <main className="flex-1 w-full">
        <div className="max-w-[542px]">
          <h2 className="text-2xl md:text-3xl font-medium pt-6 md:pt-16 pb-4 md:pb-6 leading-snug">
            Exploring what happens <br />
            when <span className="text-custom-gray-400">designer</span> thinks
            like an <span className="text-custom-gray-400">engineer</span>
          </h2>

          {/* SUBTEXT CONTENT */}
          <p className="text-base md:text-lg leading-relaxed pb-4">
            Hi, 👋🏼 I&rsquo;m Emmanuel - a{" "}
            <span className="text-custom-gray-400">curious human</span> who
            designs interfaces and builds digital things for a living. Sometimes
            with Framer, sometimes with Figma, always with vibes.
          </p>

          <p className="text-base md:text-lg leading-relaxed">
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
          </p>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="mt-auto w-full text-base md:text-lg leading-relaxed pb-10 pt-10">
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
      </footer>
    </div>
  );
}
