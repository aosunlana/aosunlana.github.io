"use client";

import { useState, type FormEvent } from "react";

const PASSWORD = "$#18dec1999";

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

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <p className="text-base text-custom-gray-900">
        Bookmarks content goes here.
      </p>
    </div>
  );
}
