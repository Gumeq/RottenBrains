// middleware.ts

import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Call updateSession
  let response = await updateSession(request);

  // If updateSession doesn't return a response, create a new one
  if (!response) {
    response = NextResponse.next();
  }

  // Set x-pathname header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  // Set the modified headers to the request
  response.headers.set("x-pathname", request.nextUrl.pathname);

  // **Theme Detection Logic Starts Here**

  // Check if theme cookie exists
  const themeCookie = request.cookies.get("theme");

  if (!themeCookie) {
    // Detect system preference
    const prefersDark =
      request.headers.get("sec-ch-prefers-color-scheme") === "dark";

    // Set theme cookie
    response.cookies.set("theme", prefersDark ? "dark" : "light", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
