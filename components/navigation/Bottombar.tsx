import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { fetchUserDataServer } from "@/utils/serverFunctions/fetchUserData";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import Link from "next/link";
import React from "react";

const Bottombar = async () => {
	const user = await getCurrentUser();
	// const icon = user?.imageURL;

	return (
		<div className="fixed bottom-0 z-50 ">
			<ul className="bottom-bar flex flex-row gap-2">
				{sidebarLinks.map((link: INavLink) => {
					return (
						<Link href={link.route} className="p-2">
							<div className="flex flex-col gap-1 items-center">
								<img
									src={link.imgURL}
									alt={""}
									width={15}
									height={15}
									className="invert-on-dark"
								/>
								<p className="text-sm">{link.label}</p>
							</div>
						</Link>
					);
				})}
				<li>
					<Link
						href={"/protected/profile"}
						className="flex flex-col gap-1 items-center"
					>
						<img
							src={user?.user.imageURL}
							alt={""}
							width={20}
							height={20}
							className="rounded-full overflow-hidden min-w-[20px] min-h-[20px]"
						></img>
						<p className="text-sm">Profile</p>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Bottombar;
