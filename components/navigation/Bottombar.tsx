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
	// const icon = user?.image_url;
	const pathname = usePathname();
	return (
		<div className="fixed bottom-0 z-50 flex items-center justify-center w-screen lg:hidden drop-shadow-xl border-t ">
			<ul className=" w-full h-16 bg-background flex flex-row items-center justify-between drop-shadow-xl px-4">
				{sidebarLinks.map((link: any) => {
					const isActive = pathname.includes(link.route);
					return (
						<Link
							href={link.route}
							className=" h-full flex items-center justify-center"
						>
							<div
								className={`flex flex-col gap-1 items-center p-2 m-1 rounded-full `}
							>
								<img
									src={`${
										isActive
											? link.image_url_active
											: link.image_url
									}`}
									alt={""}
									width={25}
									height={25}
									className="invert-on-dark w-[25px] h-[25px]"
								/>
								<p className="text-xs">{link.label}</p>
							</div>
						</Link>
					);
				})}
				<li
					className={`flex flex-col gap-1 items-center rounded-full `}
				>
					<NotificationButton></NotificationButton>
					<p className="text-sm">Notifs</p>
				</li>
				<li>
					<Link
						href={"/protected/profile"}
						className={`flex items-center min-w-[45px] min-h-[45px] flex-col gap-1`}
					>
						<img
							src={user?.image_url}
							alt={""}
							width={25}
							height={25}
							className="rounded-full overflow-hidden  border border-foreground/30 drop-shadow-xl"
						></img>
						<p className="text-sm">You</p>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Bottombar;
