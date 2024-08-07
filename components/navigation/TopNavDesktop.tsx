"use client";
import React, { useState } from "react";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import SearchBar from "../searchBar/SearchBar";
import NotificationButton from "../notifications/RealtimeNotifications";
import ProfilePicture from "./ProfilePicture";

export function TopNavbarDesktop() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const pathname = usePathname();

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<>
			<nav className="fixed top-0 bg-background/50 backdrop-blur-xl w-screen h-16 items-center justify-center z-30 hidden lg:flex p-1">
				<div className="flex flex-col items-center">
					<div className="flex flex-row gap-10 items-center justify-between w-screen pr-8">
						<div className="flex flex-row gap-16">
							<div className="flex flex-row">
								<button
									onClick={toggleSidebar}
									className="p-2 m-1 rounded-full hover:bg-foreground/20"
								>
									<img
										src="/assets/icons/menu.svg"
										alt="menu-icon"
										width={30}
										height={30}
										className="invert-on-dark p-1"
									/>
								</button>
								<Link
									href={"/protected/home"}
									className="p-2 m-1 rounded-[8px]"
								>
									<img
										src="/assets/images/logo-text-new.svg"
										alt="text-logo"
										width={70}
										height={70}
										className="invert p-1"
									/>
								</Link>
							</div>
						</div>

						<div className="h-full lg:w-[20vw] w-screen lg:p-0 p-2">
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

			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={toggleSidebar}
				></div>
			)}

			<div
				className={`fixed top-0 left-0 w-[250px] h-full bg-background shadow-lg z-50 sidebar ${
					isSidebarOpen ? "sidebar-visible" : "sidebar-hidden"
				}`}
			>
				<div className="flex flex-row">
					<button
						onClick={toggleSidebar}
						className="p-2 m-1 rounded-full hover:bg-foreground/20"
					>
						<img
							src="/assets/icons/menu.svg"
							alt="menu-icon"
							width={30}
							height={30}
							className="invert-on-dark p-1"
						/>
					</button>
					<Link
						href={"/protected/home"}
						className="p-2 m-1 rounded-[8px]"
					>
						<img
							src="/assets/images/logo-text-new.svg"
							alt="text-logo"
							width={70}
							height={70}
							className="invert p-1"
						/>
					</Link>
				</div>
				<ul className="flex flex-col justify-start gap-2 mt-4 p-4">
					{sidebarLinks.map((link: any) => (
						<Link
							href={link.route}
							key={link.route}
							className="p-2 hover:bg-foreground/20 rounded-[8px]"
						>
							<div className="flex flex-row gap-2 items-center">
								<img
									src={`${
										pathname.includes(link.route)
											? link.image_url_active
											: link.image_url
									}`}
									alt={""}
									width={25}
									height={25}
									className="invert-on-dark w-[25px] h-[25px]"
								/>
								<p className="text-lg">{link.label}</p>
							</div>
						</Link>
					))}
					<Link
						href={"/protected/watch-history"}
						className="p-2 hover:bg-foreground/20 rounded-[8px]"
					>
						<div className="flex flex-row gap-2 items-center">
							<img
								src={`${
									pathname.includes("watch-history")
										? "/assets/icons/film-solid.svg"
										: "/assets/icons/film-outline.svg"
								}`}
								alt={""}
								width={25}
								height={25}
								className="invert-on-dark w-[25px] h-[25px]"
							/>
							<p className="text-lg">Watch History</p>
						</div>
					</Link>
				</ul>
				<div className="w-[90%] mx-auto h-[1px] bg-foreground/20"></div>
			</div>
		</>
	);
}

export default TopNavbarDesktop;
