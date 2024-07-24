"use client";
import React from "react";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import SearchBar from "../searchBar/SearchBar";
import NotificationButton from "../notifications/RealtimeNotifications";
import ProfilePicture from "./ProfilePicture";
import { usePathname } from "next/navigation";

export function TopNavbarDesktop() {
	const pathname = usePathname();

	return (
		<nav className="fixed top-0 bg-background/30 backdrop-blur-xl w-screen items-center justify-center z-30 hidden xl:flex p-1">
			<div className="flex flex-col">
				<div className="flex flex-row gap-10 items-center justify-between w-screen max-w-[95vw]">
					<Link href={"/protected/home"}>
						<img
							src="/assets/images/logo-text.png"
							alt="text-logo"
							width={50}
							height={50}
							className="invert-on-dark"
						/>
					</Link>
					<ul className="flex flex-row justify-between gap-4">
						{sidebarLinks.map((link: INavLink) => {
							const isActive = pathname.includes(link.route);
							return (
								<Link
									href={link.route}
									className={`flex gap-4 items-center px-4 py-2 rounded-[4px] ${
										isActive ? "bg-foreground/20" : ""
									}`}
								>
									<img
										src={link.imgURL}
										alt={""}
										width={20}
										height={20}
										className="invert-on-dark"
									/>
									{link.label}
								</Link>
							);
						})}
						{/* <div className="flex flex-row items-center gap-4"></div> */}
					</ul>
					<div className="flex flex-row gap-8">
						<NotificationButton></NotificationButton>
						<div className="flex items-center">
							<ProfilePicture></ProfilePicture>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default TopNavbarDesktop;
