
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const protectedPaths = [
    "/"
  ];
  const url = req.nextUrl.clone();
  const isProtectedPath = protectedPaths.some(path => url.pathname.startsWith(path));
  const sessionCookie = req.cookies.get("next-auth.session-token")?.value || req.cookies.get("__Secure-next-auth.session-token")?.value;


  if (isProtectedPath) {
    if (!sessionCookie) {
      // No session cookie, redirect to login
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}
