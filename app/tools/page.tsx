import type { Metadata } from "next";
import Header from "@/components/header/Header";
import ConstructionPlaceholder from "@/components/ConstructionPlaceholder";
import SubPageMenu from "@/components/SubPageMenu";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Tools",
  description: "Tools and software I use.",
};

export default function ToolsPage() {
  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark">
      <header className="w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-[max(env(safe-area-inset-top),16px)] md:pt-4">
          <Header />
        </div>
      </header>

      <main className="flex-1 w-full flex items-center justify-center">
        <ConstructionPlaceholder />
      </main>

      {/* FOOTER (centered container) */}
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
