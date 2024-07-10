import AuthButton from "@/components/auth/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { useState } from "react";

export default async function Index() {
	const canInitSupabaseClient = () => {
		// This function is just for the interactive tutorial.
		// Feel free to remove it once you have Supabase connected.
		try {
			createClient();
			return true;
		} catch (e) {
			return false;
		}
	};

	const isSupabaseConnected = canInitSupabaseClient();

	return (
		<div className="flex-1 w-full flex flex-col items-center gap-8">
			{/* <div className="w-screen">
				<ScrollingBackground />
			</div> */}
			<nav className="w-full flex justify-center bg-background h-16">
				<div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
					<div className="text-xl font-bold">
						<img
							src="/assets/images/logo-text.png"
							alt=""
							width={80}
							height={80}
							className="invert-on-dark"
						/>
					</div>
					{isSupabaseConnected && <AuthButton />}
				</div>
			</nav>
			<div className="flex flex-col gap-4 w-screen max-w-7xl items-center justify-center px-8 my-16">
				<img
					src="/assets/images/logo-text.png"
					alt="logo-text.png"
					className="invert-on-dark"
				/>
				<h1 className="text-2xl font-bold max-w-xl text-center opacity-80 text-foreground">
					Review movies, share with friends, and watch your favorites
					all in one place.
				</h1>
				<div className="flex md:flex-row flex-col gap-4">
					<Link href={"/protected/home"}>
						<div className="font-bold px-8 py-4 my-4 bg-accent rounded-lg text-xl">
							Get Started
						</div>
					</Link>
					<Link href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}>
						<div className="font-bold px-8 py-4 my-4 border-2 border-accent rounded-lg text-xl">
							Hmmm...
						</div>
					</Link>
				</div>
			</div>
			<div className="w-screen flex justify-center bg-accent/10 p-4 py-8">
				<div className="flex flex-col max-w-[95vw] md:flex-row gap-4 w-screen md:max-w-7xl md:divide-x  md:divide-y-0 divide-y my-4">
					<div className="w-full flex-col gap-4 flex justify-center py-4 text-center">
						<h3 className="text-xl font-bold">Review</h3>
						<p>
							Share your thoughts and ratings on the latest movies
						</p>
					</div>
					<div className="w-full flex-col gap-4 flex justify-center py-4 text-center">
						<h3 className="text-xl font-bold">Share</h3>
						<p>Connect with friends and see their reviews</p>
					</div>
					<div className="w-full flex-col gap-4 flex justify-center py-4 text-center">
						<h3 className="text-xl font-bold">Watch</h3>
						<p>
							Stream your favorite movies directly on our platform
						</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-4 w-screen max-w-7xl  items-center justify-center border-dashed border-2 border-accent rounded-xl  p-16  my-4 px-8">
				<h2 className="text-2xl font-bold max-w-xl text-center text-foreground">
					Join the Brain Rotting Community Today!
				</h2>
				<h3 className="text-xl max-w-xl text-center opacity-80 text-foreground">
					Sign up now and start sharing your reviews
				</h3>
				<Link href={"/login"}>
					<div className="font-bold px-8 py-4 my-4 bg-accent rounded-lg text-xl">
						Sign up
					</div>
				</Link>
			</div>
			<div className="flex flex-row gap-8 w-screen max-w-7xl  items-center justify-between p-16  my-4 px-8">
				<div className="flex flex-col gap-2">
					<h3 className="text-lg font-bold">Quick Links</h3>
					<div className="flex flex-col gap-4 text-foreground/80 ">
						<Link href={"/protected/home"}>Home</Link>
						<Link href={"/protected/explore"}>Explore</Link>
						<Link href={"/protected/create-post"}>Create Post</Link>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h3 className="text-lg font-bold">Socials</h3>
					<div className="flex flex-col gap-4 text-foreground/80 ">
						<Link href={"/"}>Discord</Link>
						<Link href={"/"}>Instagram</Link>
						<Link href={"/"}>Telegram</Link>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<img
						src="/assets/images/logo.png"
						alt=""
						width={200}
						height={200}
					/>
					<img
						src="/assets/images/logo-text.png"
						alt=""
						className="invert-on-dark"
						width={200}
						height={200}
					/>
					<p>© Developed by Gumeq 2024</p>
				</div>
			</div>
		</div>
	);
}
