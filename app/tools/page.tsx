import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import SubPageMenu from "@/components/SubPageMenu";
import ToolsList from "./ToolsList";

export const metadata: Metadata = {
  title: "Tools",
  description: "The software and tools I use to design and build.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Tools",
    description: "The software and tools I use to design and build.",
  },
  twitter: {
    title: "Tools",
    description: "The software and tools I use to design and build.",
  },
};

export default function ToolsPage() {
  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark">
      {/* Breadcrumb (absolute, positioned by the component) */}
      <Header />

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-16 pb-20 md:pt-[22px]">
          <section className="w-full">
            <ToolsList />
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
