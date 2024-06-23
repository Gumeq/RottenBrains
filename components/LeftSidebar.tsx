import React from "react";
import AuthButton from "./AuthButton";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import Image from "next/image";
import { getCurrentUser } from "@/utils/supabase/queries";

export async function LeftSidebar() {
	const currentUser = await getCurrentUser();

	return (
		<div className="leftsidebar">
			<div className="flex flex-col gap-11">
				<div></div>
				<img
					src={currentUser?.user.imageURL}
					alt=""
					width={50}
					height={50}
					className="rounded-full"
				/>
				<ul className="flex flex-col gap-6">
					{sidebarLinks.map((link: INavLink) => {
						return (
							<Link
								href={link.route}
								className="flex gap-4 items-center p-4 leftsidebar-link"
							>
								<Image
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
			</div>
			<AuthButton></AuthButton>
		</div>
	);
}

export default LeftSidebar;
