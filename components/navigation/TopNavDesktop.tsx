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
		<nav className="fixed top-0 bg-background w-screen items-center justify-center z-30 hidden xl:flex p-2">
			<div className="flex flex-col">
				<div className="flex flex-row gap-10 items-center justify-between w-screen max-w-4xl">
					<Link href={"/protected/home"}>
						<img
							src="/assets/images/logo-text.png"
							alt="text-logo"
							width={80}
							height={80}
							className="invert-on-dark"
						/>
					</Link>

					<div className=" px-0 py-4 flex flex-row gap-2 w-[400px]">
						<div className=" h-full md:w-full">
							<SearchBar link={true} user={true}></SearchBar>
						</div>
					</div>
					<ul className="flex flex-row p-2 justify-between gap-2">
						{sidebarLinks.map((link: INavLink) => {
							const isActive = pathname.includes(link.route);
							return (
								<Link
									href={link.route}
									className={`flex gap-4 items-center p-2 leftsidebar-link ${
										isActive ? "bg-accent" : ""
									}`}
								>
									<img
										src={link.imgURL}
										alt={""}
										width={20}
										height={20}
										className="invert-on-dark"
									/>
									{/* {link.label} */}
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
