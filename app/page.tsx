import GetStartedButton from "@/components/LandingPage/GetStartedButton";
import ScrollingBackground from "@/components/LandingPage/ScrollingBackground";
import AuthButton from "@/components/auth/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
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
		<div className="flex-1 w-full flex flex-col items-center">
			<div className="w-screen">
				<ScrollingBackground />
			</div>
			<nav className="w-full flex justify-center bg-background h-16">
				<div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
					<div className="text-xl font-bold">BingeBuddy</div>
					{isSupabaseConnected && <AuthButton />}
				</div>
			</nav>
			<div className="w-screen h-screen">
				<div className="m-auto max-w-7xl h-full">
					<div className="z-10 w-full h-full p-4 flex items-center flex-col lg:flex-row-reverse lg:justify-evenly lg:h-3/4 ">
						<div className="">
							<div className="flex justify-center">
								<Image
									src="/assets/images/iphone 15.png"
									alt=""
									width={500}
									height={500}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-10 max-w-[500px]">
							<h1 className="text-4xl font-bold">
								Join a Community of <br /> Media Lovers
							</h1>
							<h2 className="text-xl">
								Our platform brings together fans of movies,
								anime, TV shows, K-drama, and more. Engage in
								discussions, share reviews, and discover new
								content through the eyes of fellow enthusiasts.
							</h2>
							<div className="flex flex-row gap-4">
								<GetStartedButton></GetStartedButton>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
