import type { Metadata } from "next";
// import { useState, type FormEvent } from "react";
// import { Icon } from "@iconify/react";
import Header from "@/components/header/Header";

// import ConstructionPlaceholder from "@/components/ConstructionPlaceholder";
import SubPageMenu from "@/components/SubPageMenu";
import Footer from "@/components/Footer";
import BookmarksList from "./BookmarksList";
import { getEnrichedBookmarks } from "@/lib/bookmarks";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Links, references, and things worth keeping.",
  alternates: { canonical: "/bookmarks" },
  openGraph: {
    title: "Bookmarks",
    description: "Links, references, and things worth keeping.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookmarks",
    description: "Links, references, and things worth keeping.",
  },
};

// const PASSWORD = "$#18dec1999";

export default async function BookmarksPage() {
  const bookmarks = await getEnrichedBookmarks();
  /* PASSWORD PROTECTION - COMMENTED OUT FOR NOW
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm border border-custom-gray-200 dark:border-app-border-dark rounded-2xl p-6 bg-white dark:bg-app-card-dark space-y-4"
        >
          <h1 className="text-lg font-semibold text-custom-gray-900 dark:text-app-text-dark text-center">
            Enter password
          </h1>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border border-custom-gray-200 dark:border-app-border-dark rounded-xl px-3 pr-10 py-2 text-sm outline-none bg-white dark:bg-app-card-dark text-custom-gray-900 dark:text-app-text-dark text-center focus:ring-2 focus:ring-app-link-text-hover focus:border-app-link-text-hover"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-custom-gray-400 dark:text-app-text-dark focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon
                icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"}
                className="h-5 w-5"
              />
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-app-link-text-hover text-custom-gray-900 text-sm font-medium hover:bg-app-link-text-hover/90 transition"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }
  */

  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark">
      {/* Breadcrumb (absolute, positioned by the component) */}
      <Header />

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-16 pb-20 md:pt-[22px]">
          <section className="w-full">

            <BookmarksList initialBookmarks={bookmarks} />
          </section>
        </div>
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
