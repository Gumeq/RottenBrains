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
		return redirect("/register");
	};

	return user ? (
		<div className="flex items-center gap-4">
			<form action={signOut}>
				<button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
					Logout
				</button>
			</form>
		</div>
	) : (
		<Link
			href="/login"
			className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
		>
			Get Started
		</Link>
	);
}
