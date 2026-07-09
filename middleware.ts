import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "notes_auth";
const TOKEN = "notes-ok-1";

// Gate the notes section: without a valid cookie the request is rewritten to the
// unlock page, so the note content is never served until the password is entered.
export function middleware(req: NextRequest) {
  if (req.cookies.get(COOKIE)?.value === TOKEN) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/notes-unlock";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/notes", "/notes/:path*"],
};
