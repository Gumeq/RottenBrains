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
			<nav
				className={`fixed top-0 bg-background w-screen h-16 items-center justify-center z-30 hidden p-1 ${
					pathname.includes("home") ? "lg:hidden" : "lg:flex"
				}`}
			>
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
					<div className="w-[90%] mx-auto h-[1px] bg-foreground/20 my-2"></div>
					<Link
						className="w-full flex flex-row gap-1 p-2 items-center hover:bg-foreground/20 rounded-[8px]"
						href={"/protected/profile"}
					>
						<h3 className=" text-lg font-bold">You</h3>
						<img
							src="/assets/icons/chevron-forward.svg"
							alt=""
							className="invert-on-dark w-[20px] h-[20px] opacity-50"
						/>
					</Link>
					<Link
						href={"/protected/profile"}
						className="p-2 hover:bg-foreground/20 rounded-[8px]"
					>
						<div className="flex flex-row gap-2 items-center">
							<img
								src={`${
									pathname.includes("profile")
										? "/assets/icons/person-solid.svg"
										: "/assets/icons/person-outline.svg"
								}`}
								alt={""}
								width={25}
								height={25}
								className="invert-on-dark w-[25px] h-[25px]"
							/>
							<p className="text-lg">Your profile</p>
						</div>
					</Link>
					<Link
						href={"/protected/watch-history"}
						className="p-2 hover:bg-foreground/20 rounded-[8px]"
					>
						<div className="flex flex-row gap-2 items-center">
							<img
								src={`${
									pathname.includes("watch-history")
										? "/assets/icons/history.svg"
										: "/assets/icons/history.svg"
								}`}
								alt={""}
								width={25}
								height={25}
								className="invert-on-dark w-[25px] h-[25px]"
							/>
							<p className="text-lg">History</p>
						</div>
					</Link>
					<Link
						href={"/protected/liked"}
						className="p-2 hover:bg-foreground/20 rounded-[8px]"
					>
						<div className="flex flex-row gap-2 items-center">
							<img
								src={`${
									pathname.includes("liked")
										? "/assets/icons/heart-solid.svg"
										: "/assets/icons/heart-outline.svg"
								}`}
								alt={""}
								width={25}
								height={25}
								className="invert-on-dark w-[25px] h-[25px]"
							/>
							<p className="text-lg">Liked posts (soon)</p>
						</div>
					</Link>
					<Link
						href={"/protected/liked"}
						className="p-2 hover:bg-foreground/20 rounded-[8px]"
					>
						<div className="flex flex-row gap-2 items-center">
							<img
								src={`${
									pathname.includes("saved")
										? "/assets/icons/bookmark-solid.svg"
										: "/assets/icons/bookmark-outline.svg"
								}`}
								alt={""}
								width={25}
								height={25}
								className="invert-on-dark w-[25px] h-[25px]"
							/>
							<p className="text-lg">Saved posts (soon)</p>
						</div>
					</Link>
					<Link
						href={"/protected/watch_list"}
						className="p-2 hover:bg-foreground/20 rounded-[8px]"
					>
						<div className="flex flex-row gap-2 items-center">
							<img
								src={`${
									pathname.includes("watch_list")
										? "/assets/icons/view_list-solid.svg"
										: "/assets/icons/view_list-outline.svg"
								}`}
								alt={""}
								width={25}
								height={25}
								className="invert-on-dark w-[25px] h-[25px]"
							/>
							<p className="text-lg">Watch list (soon)</p>
						</div>
					</Link>
					<Link
						href={"/protected/watch_list"}
						className="p-2 hover:bg-foreground/20 rounded-[8px]"
					>
						<div className="flex flex-row gap-2 items-center">
							<img
								src={`${
									pathname.includes("watch_later")
										? "/assets/icons/schedule-solid.svg"
										: "/assets/icons/schedule-outline.svg"
								}`}
								alt={""}
								width={25}
								height={25}
								className="invert-on-dark w-[25px] h-[25px]"
							/>
							<p className="text-lg">Watch later (soon)</p>
						</div>
					</Link>
				</ul>
				<div className="w-[90%] mx-auto h-[1px] bg-foreground/20"></div>
			</div>
		</>
	);
}

export default TopNavbarDesktop;
