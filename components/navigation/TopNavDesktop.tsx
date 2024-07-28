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
		<nav className="fixed top-0 bg-background backdrop-blur-xl w-screen h-16 items-center justify-center z-30 hidden lg:flex p-1">
			<div className="flex flex-col items-center">
				<div className="flex flex-row gap-10 items-center justify-between w-screen lg:max-w-[80vw] max-w-">
					<div className="flex flex-row gap-16">
						<Link
							href={"/protected/home"}
							className="px-4 py-2  bg-accent rounded-[8px]"
						>
							<img
								src="/assets/images/logo-text.png"
								alt="text-logo"
								width={60}
								height={60}
								className=""
							/>
						</Link>
						<ul className="flex flex-row justify-between gap-8">
							{sidebarLinks.map((link: INavLink) => {
								const isActive = pathname.includes(link.route);
								return (
									<Link
										href={link.route}
										className={`flex gap-4 items-center px-4 py-2 rounded-[4px] justify-center ${
											isActive ? "underline" : ""
										}`}
									>
										{/* <img
											src={link.imgURL}
											alt={""}
											width={15}
											height={15}
											className="invert-on-dark"
										/> */}
										<p className="text-xl ">{link.label}</p>
									</Link>
								);
							})}
							{/* <div className="flex flex-row items-center gap-4"></div> */}
						</ul>
					</div>

					<div className=" h-full lg:w-[20vw] w-screen lg:p-0 p-2">
						<SearchBar link={true} user={true}></SearchBar>
					</div>

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
