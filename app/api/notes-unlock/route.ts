import { NextResponse } from "next/server";

const PASSWORD = "$#Dec181999";
const COOKIE = "notes_auth";
const TOKEN = "notes-ok-1";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    password = "";
  }

  if (password !== PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // Session cookie (no maxAge): the notes section stays unlocked only while the
  // tab is open, and the client re-locks it the moment the user leaves /notes.
  res.cookies.set(COOKIE, TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res;
}
