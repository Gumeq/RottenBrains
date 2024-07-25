import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default async function AuthButton() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const signOut = async () => {
		"use server";
		const supabase = createClient();
		await supabase.auth.signOut();
		return redirect("/login");
	};

	return user ? (
		<div className="flex items-center gap-4">
			<form action={signOut}>
				<button className="items-center gap-2 bg-foreground/10 px-6 py-2 rounded-[8px] z-10 hover:scale-105 drop-shadow-lg">
					Logout
				</button>
			</form>
		</div>
	) : (
		<Link
			href="/login"
			className="items-center gap-2 bg-accent px-6 py-2 rounded-[8px] z-10 hover:scale-105 drop-shadow-lg"
		>
			Get Started
		</Link>
	);
}
