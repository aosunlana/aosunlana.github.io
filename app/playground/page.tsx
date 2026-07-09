import type { Metadata } from "next";
import Header from "@/components/header/Header";
import PlaygroundList from "./PlaygroundList";
import SubPageMenu from "@/components/SubPageMenu";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Playground",
  description: "A collection of experimental components, interactions, and visual explorations. My digital playground for UI engineering.",
  alternates: { canonical: "/playground" },
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
      {/* Breadcrumb (absolute, positioned by the component) */}
      <Header />

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[1800px] pt-16 pb-20 md:pt-16">
          <h1 className="sr-only">Playground</h1>
          <PlaygroundList />
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
