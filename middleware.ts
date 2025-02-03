import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // **Ensure session persistence**
  const response = await updateSession(request);

  // Ensure x-pathname header is valid and encoded
  const pathname = decodeURIComponent(request.nextUrl.pathname || "");
  response.headers.set("x-pathname", pathname);

  // **Theme Detection Logic**
  const themeCookie = request.cookies.get("theme");

  if (!themeCookie) {
    // Detect system preference
    const prefersDark =
      request.headers.get("sec-ch-prefers-color-scheme") === "dark";

    response.cookies.set({
      name: "theme",
      value: prefersDark ? "dark" : "light",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  } else {
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
