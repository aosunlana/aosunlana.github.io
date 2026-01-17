"use client";

import { useState, type FormEvent } from "react";
import Header from "@/components/header/Header";

const PASSWORD = "#$18dec1999";

export default function BookmarksPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 bg-white">
      <header className="w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-[max(env(safe-area-inset-top),16px)] md:pt-4">
          <Header />
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-6 pb-20 flex items-center justify-center">
          {!authenticated ? (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-sm border border-custom-gray-200 rounded-2xl p-6 bg-white space-y-4"
            >
              <h1 className="text-lg font-semibold text-custom-gray-900">
                Enter password
              </h1>
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full border border-custom-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Password"
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90 transition"
              >
                Continue
              </button>
            </form>
          ) : (
            <p className="text-base text-custom-gray-900">
              Bookmarks content goes here.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
