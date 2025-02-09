"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useUser } from "@/hooks/UserContext";
import MenuButtonWithSidebar from "./NavMenuSidebarButton";
import ProfilePictureNew from "@/components/features/navigation/NavProfilePicture";
import NotificationButton from "../../notifications/NotificationButton";

const NavTop = () => {
	const { user } = useUser();
	const topBarRef = useRef<HTMLDivElement>(null);

	const lastScrollY = useRef(0);
	const ticking = useRef(false);

	const topBarHeight = 48; // Adjust this if your top bar height is different

	const controlNavbar = () => {
		if (typeof window !== "undefined") {
			const deltaY = window.scrollY - lastScrollY.current;

			if (topBarRef.current) {
				const currentTransform = topBarRef.current.style.transform;
				const match = currentTransform.match(/translateY\((-?\d+)px\)/);
				let currentTranslateY = match ? parseInt(match[1]) : 0;

				let newTranslateY = currentTranslateY - deltaY;
				newTranslateY = Math.min(
					0,
					Math.max(-topBarHeight, newTranslateY)
				);

				topBarRef.current.style.transform = `translateY(${newTranslateY}px)`;
				topBarRef.current.style.transition = "transform 0.1s ease-out";
			}

			lastScrollY.current = window.scrollY;
			ticking.current = false;
		}
	};

	const onScroll = () => {
		if (!ticking.current) {
			window.requestAnimationFrame(controlNavbar);
			ticking.current = true;
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.addEventListener("scroll", onScroll);
			return () => window.removeEventListener("scroll", onScroll);
		}
	}, []); // Empty dependency array ensures this runs once on mount

	return (
		<>
			{/* Top bar */}
			<div
				ref={topBarRef}
				className="fixed left-0 top-0 z-50 flex h-12 w-full items-center justify-between bg-background px-4 lg:hidden"
				style={{
					transform: "translateY(0)",
					willChange: "transform",
				}}
			>
				<div className="flex flex-row gap-4">
					<MenuButtonWithSidebar />
					<Link
						href={"/"}
						className="flex flex-row items-center gap-1"
					>
						<img
							src="/assets/images/logo_new_black.svg"
							alt="text-logo"
							className="invert-on-dark h-4 w-auto"
						/>
						{user && user.premium ? (
							<p className="text-lg font-black">Premium</p>
						) : (
							<p className="text-lg font-black">Rotten Brains</p>
						)}
					</Link>
				</div>
				{user ? (
					<div className="flex flex-row items-center gap-4">
						<NotificationButton
							user_id={user.id}
						></NotificationButton>
						<ProfilePictureNew></ProfilePictureNew>
					</div>
				) : (
					<Link
						href={"/login"}
						className="flex flex-row items-center gap-2 rounded-lg bg-foreground/10 px-2 py-1"
					>
						<img
							src="/assets/icons/account-circle-outline.svg"
							className="invert-on-dark h-5 w-5"
							alt=""
						/>
						<p className="">Sign in</p>
					</Link>
				)}
			</div>
		</>
	);
};

export default NavTop;
