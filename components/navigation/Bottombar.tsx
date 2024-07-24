"use client";

import { sidebarLinks } from "@/constants";
import { useUser } from "@/context/UserContext";
import { INavLink } from "@/types";
import { fetchUserDataServer } from "@/utils/serverFunctions/fetchUserData";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import NotificationButton from "../notifications/RealtimeNotifications";

const Bottombar = () => {
	const { user } = useUser();
	// const icon = user?.imageURL;
	const pathname = usePathname();
	return (
		<div className="fixed bottom-0 z-50 flex items-center justify-center w-screen md:hidden">
			<ul className=" w-full h-16 bg-background flex flex-row items-center justify-between drop-shadow-xl px-4">
				{sidebarLinks.map((link: INavLink) => {
					const isActive = pathname.includes(link.route);
					return (
						<Link
							href={link.route}
							className=" h-full flex items-center justify-center"
						>
							<div
								className={`flex items-center p-2 m-1 rounded-full ${
									isActive ? "bg-foreground/20" : ""
								}`}
							>
								<img
									src={link.imgURL}
									alt={""}
									width={25}
									height={25}
									className="invert-on-dark w-[25px] h-[25px]"
								/>
								{/* <p className="text-sm">{link.label}</p> */}
							</div>
						</Link>
					);
				})}
				<li
					className={`flex items-center p-2 rounded-full ${
						pathname.includes("/protected/notifications")
							? "bg-foreground/20"
							: ""
					}`}
				>
					<NotificationButton></NotificationButton>
					{/* <p className="text-sm">Notifs</p> */}
				</li>
				<li>
					<Link
						href={"/protected/profile"}
						className={`flex items-center min-w-[45px] min-h-[45px]`}
					>
						<img
							src={user?.imageURL}
							alt={""}
							width={50}
							height={50}
							className="rounded-full overflow-hidden  border border-foreground/30 drop-shadow-xl"
						></img>
						{/* <p className="text-sm">Profile</p> */}
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Bottombar;
