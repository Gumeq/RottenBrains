// middleware.ts

import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Call updateSession
  let response = (await updateSession(request)) || NextResponse.next();

  // Ensure x-pathname header is valid and encoded
  const pathname = decodeURIComponent(request.nextUrl.pathname || "");
  response.headers.set("x-pathname", pathname);

  // **Theme Detection Logic Starts Here**

  // Get theme cookie
  const themeCookie = request.cookies.get("theme");

  // Handle missing or invalid theme cookie
  if (!themeCookie) {
    // Detect system preference
    const prefersDark =
      request.headers.get("sec-ch-prefers-color-scheme") === "dark";

    // Set theme cookie with a default value (dark or light)
    response.cookies.set({
      name: "theme",
      value: prefersDark ? "dark" : "light",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  } else {
    // Validate existing cookie value
    try {
      decodeURIComponent(themeCookie.value); // Ensure it decodes properly
    } catch {
      // Delete corrupted cookie and reset
      response.cookies.set({
        name: "theme",
        value: "",
        path: "/",
        maxAge: 0, // Expire immediately
      });

      const prefersDark =
        request.headers.get("sec-ch-prefers-color-scheme") === "dark";

      response.cookies.set({
        name: "theme",
        value: prefersDark ? "dark" : "light",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
