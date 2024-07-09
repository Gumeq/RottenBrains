import React from "react";

import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

import { getCurrentUser } from "@/utils/supabase/serverQueries";
import ProfilePicture from "../ProfilePicture";

import SearchBar from "../searchBar/SearchBar";
import AuthButton from "../auth/AuthButton";
import NotificationButton from "../notifications/RealtimeNotifications";

export async function TopNavbarDesktop() {
	const user = await getCurrentUser();

	return (
		<div className="fixed top-0 bg-background w-screen items-center justify-center z-30 hidden xl:flex">
			<div className="flex flex-col">
				<div className="flex flex-row gap-10 items-center justify-center">
					<div className="flex items-center">
						<Link href={"/protected/profile"}>
							<img
								src={user?.user.imageURL}
								alt={""}
								width={35}
								height={35}
								className="rounded-full overflow-hidden max-w-[35px] max-h-[35px]"
							></img>
						</Link>
					</div>
					<div className=" px-0 py-4 flex flex-row gap-2 w-[400px]">
						<div className=" h-full md:w-full">
							<SearchBar link={true} user={true}></SearchBar>
						</div>
					</div>
					<ul className="flex flex-row p-2 justify-between gap-2">
						{sidebarLinks.map((link: INavLink) => {
							return (
								<Link
									href={link.route}
									className="flex gap-4 items-center p-2 leftsidebar-link"
								>
									<img
										src={link.imgURL}
										alt={""}
										width={20}
										height={20}
										className="invert"
									/>
									{link.label}
								</Link>
							);
						})}
					</ul>
					<NotificationButton></NotificationButton>
				</div>
			</div>
		</div>
	);
}

export default TopNavbarDesktop;
