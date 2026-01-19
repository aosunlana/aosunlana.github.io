import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import SubPageMenu from "@/components/SubPageMenu";
import ToolsList from "./ToolsList";
import { getTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools",
  description: "A curated list of the software, hardware, and tools I use to design and build digital products.",
  openGraph: {
    title: "Tools",
    description: "A curated list of the software, hardware, and tools I use to design and build digital products.",
  },
  twitter: {
    title: "Tools",
    description: "A curated list of the software, hardware, and tools I use to design and build digital products.",
  },
};

export default function ToolsPage() {
  const tools = getTools();

  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark">
      {/* HEADER */}
      <header className="w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-[max(env(safe-area-inset-top),16px)] md:pt-4">
          <Header />
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-6 pb-20">
          <section className="w-full">
          

            <ToolsList tools={tools} />
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
