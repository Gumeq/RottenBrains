import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../login/submit-button";
import { addUserToDB } from "@/utils/supabase/queries";
import { OAuthButton } from "@/components/auth/OAuthSignIn";

export default function Register({
	searchParams,
}: {
	searchParams: { message: string };
}) {
	const signUp = async (formData: FormData) => {
		"use server";

		const origin = headers().get("origin");
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const username = formData.get("username") as string;
		const name = formData.get("name") as string;
		const supabase = createClient();

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${origin}/auth/callback`,
			},
		});

		if (error) {
			console.log(error);
			return redirect("/register?message=Could not authenticate user");
		}

		// If sign-up is successful, insert the user's additional information into another table
		if (data.user) {
			const initials = name
				.split(" ")
				.map((word) => word[0])
				.join("");
			const avatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
			// Make sure that the sign-up returned a valid user
			const { error: insertError } = await supabase
				.from("users") // Replace 'profiles' with your actual table name
				.insert([
					{
						id: data.user.id, // Use the user's unique ID from the sign-up
						email,
						username,
						name,
						imageURL: avatarUrl,
						// Add any other fields you need to store
					},
				]);

			// Handle errors during the insertion process
			if (insertError) {
				console.log(
					"Error inserting user profile:",
					insertError.message
				);
				return redirect(
					"/register?message=Could not create user profile"
				);
			}
		}

		return redirect("/login");
	};

	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto h-screen">
			<Link
				href="/"
				className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>{" "}
				Back
			</Link>

			<form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
				<label className="text-md" htmlFor="username">
					Username
				</label>
				<input
					className="rounded-md px-4 py-2 bg-inherit border mb-6"
					name="username"
					placeholder="crazyavocado"
					required
				/>
				<label className="text-md" htmlFor="name">
					Name
				</label>
				<input
					className="rounded-md px-4 py-2 bg-inherit border mb-6"
					name="name"
					placeholder="John Black"
					required
				/>
				<label className="text-md" htmlFor="email">
					Email
				</label>
				<input
					className="rounded-md px-4 py-2 bg-inherit border mb-6"
					name="email"
					placeholder="johnblack@gmail.com"
					required
				/>
				<label className="text-md" htmlFor="password">
					Password
				</label>
				<input
					className="rounded-md px-4 py-2 bg-inherit border mb-6"
					type="password"
					name="password"
					placeholder="••••••••"
					required
				/>
				<SubmitButton
					formAction={signUp}
					className="bg-accent rounded-md px-4 py-2 text-foreground mb-2"
					pendingText="Signing Up..."
				>
					Sign Up
				</SubmitButton>
				<OAuthButton></OAuthButton>
				{searchParams?.message && (
					<p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
						{searchParams.message}
					</p>
				)}
				<p className="self-center text-gray-400">
					Already have an account?
					<a href="/login" className="text-accent">
						{" "}
						Sign In
					</a>
				</p>
			</form>
		</div>
	);
}
