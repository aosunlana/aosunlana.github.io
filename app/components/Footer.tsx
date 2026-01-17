// app/components/Footer.tsx
"use client";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Always stacked, no visible gap between rows */}
      <div className="w-full flex flex-col">
        {/* Links wrapper */}
        <nav className="w-full">
          <ul className="flex w-full rounded-[16px] border border-custom-gray-200 overflow-hidden bg-white">
            {[
              { label: "Twitter", href: "https://x.com/@0xEmm4h2B1" },
              { label: "GitHub", href: "https://github.com/hey-emmah" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/" },
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
                    "text-base leading-6 tracking-[0.5px] text-custom-gray-900",
                    // right border on first three only
                    i < arr.length - 1 ? "border-r border-custom-gray-200" : "",
                  ].join(" ")}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright box */}
        <div className="w-full rounded-[16px] border border-custom-gray-200 bg-white h-12 px-4 flex items-center justify-center -mt-[0.5px]">
          <p className="text-base leading-6 tracking-[0.5px] text-custom-gray-500 text-center">
            &copy; {new Date().getFullYear()} Emmanuel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
