import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookieValue = request.cookies.get(name)?.value;
            return cookieValue ? decodeURIComponent(cookieValue) : undefined;
          },
          set(name: string, value: string, options: CookieOptions) {
            const encodedValue = encodeURIComponent(value);
            response.cookies.set({ name, value: encodedValue, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: "", ...options });
          },
        },
      },
    );

    // Refresh the session
    await supabase.auth.getUser();

    return response;
  } catch (e) {
    console.error("Error in updateSession:", e);

    // Optionally handle cookie cleanup here if the session fails
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
