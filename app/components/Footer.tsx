// app/components/Footer.tsx
"use client";

import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Always stacked, no visible gap between rows */}
      <div className="w-full flex flex-col">
        {/* Links wrapper */}
        <nav className="w-full">
          <ul className="flex w-full rounded-[16px] border border-custom-gray-200 dark:border-app-border-dark overflow-hidden ">
            {[
              { label: "Twitter", href: "https://x.com/hey_emmah" },
              { label: "GitHub", href: "https://github.com/hey-emmah" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/emmah-priestley/" },
              { label: "Email", href: "mailto:hello@emmah.xyz" },
            ].map(({ label, href }, i, arr) => (
              <li key={label} className="flex-1">
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className={[
                    "flex h-12 items-center justify-center px-4",
                    "text-base leading-6 tracking-[0.5px] text-custom-gray-900 dark:text-app-text-dark",
                    i < arr.length - 1
                      ? "border-r border-custom-gray-200 dark:border-app-border-dark"
                      : "",
                  ].join(" ")}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright box: text left, a full-height divider, then the theme
            switch (each icon separated by its own full-height divider). */}
        <div className="w-full rounded-[16px] border border-custom-gray-200 dark:border-app-border-dark h-12 pl-4 flex items-stretch justify-between -mt-[0.5px]">
          <p className="self-center min-w-0 truncate text-base leading-6 tracking-[0.5px] text-custom-gray-500 dark:text-app-text-dark">
            &copy; {new Date().getFullYear()} Emmanuel A. Priestley. All rights reserved.
          </p>
          <div className="flex shrink-0 items-stretch">
            <span
              aria-hidden="true"
              className="w-px self-stretch bg-custom-gray-200 dark:bg-app-border-dark"
            />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
