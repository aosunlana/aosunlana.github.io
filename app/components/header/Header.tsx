"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Icon as SolarIcon } from "@iconify/react";

/* ---- Clarity setup ---- */
async function ensureClarity() {
  await import("@cds/core/icon/register.js");
  const { ClarityIcons } = await import("@cds/core/icon");
  const { digitalSignatureIcon } = await import(
    "@cds/core/icon/shapes/digital-signature.js"
  );
  ClarityIcons.addIcons(digitalSignatureIcon);
}
const CdsDigitalSignatureIcon = ({ className }: { className?: string }) => (
  // @ts-ignore web component
  <cds-icon shape="digital-signature" class={className}></cds-icon>
);

/* Wrap Iconify names so they look like React components */
const Solar = (name: string) =>
  function Wrapped({ className }: { className?: string }) {
    return <SolarIcon icon={name} className={className} />;
  };

// Pick styles you like: -outline | -bold | -bold-duotone
const Handshake = Solar("solar:handshake-outline");
const Palette2 = Solar("solar:palette-2-outline");
const Library = Solar("solar:library-outline");
const FolderWithFiles = Solar("solar:folder-with-files-outline");
const SmileCircle = Solar("solar:smile-circle-outline");

type IconType = React.ComponentType<{ className?: string }>;
type Tab = { label: string; href: string; icon: IconType };

const TABS: Tab[] = [
  { label: "Hello", href: "/", icon: Handshake },
  { label: "Playground", href: "/playground", icon: Palette2 },
  { label: "Tools", href: "/tools", icon: Library },
  { label: "Bookmarks", href: "/bookmarks", icon: FolderWithFiles },
  { label: "Notes", href: "/notes", icon: CdsDigitalSignatureIcon }, // Clarity
  { label: "Let’s Talk", href: "/lets-talk", icon: SmileCircle },
];

export default function Header() {
  const pathname = usePathname();
  useEffect(() => {
    void ensureClarity();
  }, []);

  return (
    <header className="w-full flex justify-center">
      <nav aria-label="Primary" className="mt-6 max-w-full">
        <ul className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm overflow-x-auto">
          <li className="shrink-0">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 overflow-hidden"
              aria-label="Profile"
            >
              <Image
                src="/avatar.svg"
                alt="Avatar"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            </Link>
          </li>
          {TABS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                    active
                      ? "border-gray-300 bg-gray-100 text-gray-900"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active
                        ? "text-gray-700"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
