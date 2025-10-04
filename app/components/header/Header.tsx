// app/components/header/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full">
      <div className="flex items-center gap-4 md:gap-5 pb-8 ">
        {/* Avatar tile */}
        <Link
          href="/"
          aria-label="Profile"
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-custom-gray-100 overflow-hidden"
        >
          <Image
            src="/avatar.svg"
            alt="Avatar"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />
        </Link>

        {/* Name + Role */}
        <div>
          <h1 className="text-[18px] leading-9 tracking-[0.5px] font-semibold text-custom-gray-900">
            Emmanuel A. Priestley
          </h1>
          <p className="text-base leading-6 tracking-[0.5px] text-custom-gray-500">
            Product Designer <span className="text-custom-gray-500">//</span> Design Engineer
          </p>
        </div>
      </div>
    </header>
  );
}
