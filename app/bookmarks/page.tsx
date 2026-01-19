"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import Header from "@/components/header/Header";

const PASSWORD = "$#18dec1999";

export default function BookmarksPage() {
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

  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark">
      <header className="w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-[max(env(safe-area-inset-top),16px)] md:pt-4">
          <Header />
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-6 pb-20 flex items-center justify-center">
          <p className="text-base text-custom-gray-900 dark:text-app-text-dark">
            Bookmarks content goes here.
          </p>
        </div>
      </main>
    </div>
  );
}
