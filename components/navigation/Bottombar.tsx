import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { fetchUserDataServer } from "@/utils/serverFunctions/fetchUserData";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import Link from "next/link";
import React from "react";

const Bottombar = async () => {
	const user = await getCurrentUser();
	console.log(user.user.id);
	// const icon = user?.imageURL;

	return (
		<div className="fixed bottom-0 z-50 ">
			<ul className="bottom-bar flex flex-row gap-6">
				{sidebarLinks.map((link: INavLink) => {
					return (
						<Link
							href={link.route}
							className="flex gap-4 items-center p-4"
						>
							<img
								src={link.imgURL}
								alt={""}
								width={20}
								height={20}
								className="invert-on-dark"
							/>
						</Link>
					);
				})}
				<li>
					<Link href={"/protected/profile"}>
						<img
							src={user?.user.imageURL}
							alt={""}
							width={25}
							height={25}
							className="rounded-full overflow-hidden"
						></img>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Bottombar;
