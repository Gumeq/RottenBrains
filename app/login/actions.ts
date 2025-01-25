"use server";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function oAuthSignIn(provider: Provider) {
  if (!provider) {
    return redirect("/login?message=No provider selected");
  }

  const supabase = await createClient();

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";

  // Decide whether to use https or http
  // (if you have a more robust way to determine protocol, adjust accordingly)
  const isLocalhost = host.includes("localhost");
  const protocol = isLocalhost ? "http" : "https";

  // Dynamically build the callback URL
  const redirectUrl = `${protocol}://${host}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    return redirect("/login?message=Could not authenticate");
  }

  // If everything is good, redirect to the returned URL from Supabase
  redirect(data.url);
}
