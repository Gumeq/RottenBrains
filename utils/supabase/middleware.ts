import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const updateSession = async (request: NextRequest) => {
  try {
    // Initialize the response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Get the cookie store
    const cookieStore = cookies();

    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll(); // Retrieve all cookies
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if middleware refreshes sessions.
            }
          },
        },
      },
    );

    // Refresh the session
    await supabase.auth.getUser();

    return response;
  } catch (e) {
    console.error("Error in updateSession:", e);

    // Return the original response on failure
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
