import { NextResponse } from "next/server";

const COOKIE = "notes_auth";

// Clears the notes unlock cookie so the section locks again.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
