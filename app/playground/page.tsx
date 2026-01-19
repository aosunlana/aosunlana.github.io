import type { Metadata } from "next";
import Header from "@/components/header/Header";
import PlaygroundList from "./PlaygroundList";
import SubPageMenu from "@/components/SubPageMenu";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Playground",
  description: "A collection of experimental components, interactions, and visual explorations. My digital playground for UI engineering.",
  openGraph: {
    title: "Playground",
    description: "A collection of experimental components, interactions, and visual explorations. My digital playground for UI engineering.",
  },
  twitter: {
    title: "Playground",
    description: "A collection of experimental components, interactions, and visual explorations. My digital playground for UI engineering.",
  },
};

export default function PlaygroundPage() {
  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark">
      <header className="w-full">
        {/* Widen header max-width to match the new layout */}
        <div className="mx-auto w-full max-w-[1200px] px-6 pt-[max(env(safe-area-inset-top),24px)] md:pt-8">
          <Header />
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Main container with wider max-width for sidebar layout */}
        <div className="mx-auto w-full max-w-[1200px] px-6 pt-12 pb-20">
          <section className="w-full">
            <PlaygroundList />
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full pt-[140px] md:pt-20">
        <div className="mx-auto w-full max-w-[600px] px-4 pb-[max(env(safe-area-inset-bottom),16px)] md:pb-4">
          <div className="mb-[16px]">
            <SubPageMenu />
          </div>
          <Footer />
        </div>
      </footer>
    </div>
  );
}
