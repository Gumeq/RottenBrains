import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { OAuthButton } from "@/components/auth/OAuthSignIn";

type Params = Promise<{ message: string }>;

export default async function Login({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { message } = await searchParams;
  const signIn = async (formData: FormData) => {
    "use server";
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/protected/home");
  };

  const signInWithOAuth = async () => {
    "use server";
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }
  };

  return (
    <div className="mx-auto flex h-screen w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <script src="https://accounts.google.com/gsi/client" async></script>
      <Link
        href="/"
        className="group absolute left-8 top-8 flex items-center rounded-md bg-btn-background px-4 py-2 text-sm text-foreground no-underline hover:bg-btn-background-hover"
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

      <form className="animate-in flex w-full flex-1 flex-col justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="mb-2 rounded-md bg-accent px-4 py-2 text-foreground"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        <OAuthButton></OAuthButton>
        <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
          {message}
        </p>
        <p className="self-center text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-accent">
            {" "}
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
