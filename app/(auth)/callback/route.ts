import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // If "next" is in the params, use it as the redirect URL
  const next = searchParams.get("next") ?? "/protected/test";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            // Fetch all cookies as an array of objects with name and value
            return cookieStore
              .getAll()
              .map(({ name, value }) => ({ name, value }));
          },
          setAll(cookiesToSet) {
            try {
              // Set all cookies in the provided array
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch (error) {
              console.error("Error setting cookies:", error);
            }
          },
        },
      },
    );

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the provided "next" parameter or default location
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Redirect to an error page with instructions if there's an issue
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
