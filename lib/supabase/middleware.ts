import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options); // Set cookies directly on supabaseResponse
          });
        },
      },
    },
  );

  // **Important:** Ensure getUser() is always called, per Supabase guidelines.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // **Ensure that session cookies persist by returning the updated response**
  return supabaseResponse;
}
