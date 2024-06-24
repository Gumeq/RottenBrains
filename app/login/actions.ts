"use server";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function oAuthSignIn(provider: Provider) {
	if (!provider) {
		return redirect("/login?message=No provider selected");
	}

	const supabase = createClient();
	const redirectUrl = "https://binge-buddy-pink.vercel.app/auth/callback";
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: provider,
		options: {
			redirectTo: redirectUrl,
		},
	});
	if (error) {
		redirect("/login?message=Could not authenticate");
	}
	redirect(data.url);
}
