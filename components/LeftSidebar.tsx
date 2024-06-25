import React from "react";
import AuthButton from "./AuthButton";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import Image from "next/image";
import { getCurrentUser } from "@/utils/supabase/queries";
import SearchBar from "./SearchBar";
import ProfilePicture from "./ProfilePicture";

export async function LeftSidebar() {
	const currentUser = await getCurrentUser();

	return (
		<div className="fixed top-0 bg-background w-screen items-center justify-center z-30 hidden xl:flex">
			<div className="flex flex-col">
				<div className="flex flex-row gap-10 items-center justify-center">
					<div className="flex items-center">
						<ProfilePicture
							userId={currentUser?.user.id}
						></ProfilePicture>
					</div>
					<div className=" px-0 py-4 flex flex-row gap-2 w-[400px]">
						<div className=" h-full md:w-full">
							<SearchBar link={true}></SearchBar>
						</div>
					</div>
					<AuthButton></AuthButton>
				</div>
				<ul className="flex flex-row gap-6 p-2">
					{sidebarLinks.map((link: INavLink) => {
						return (
							<Link
								href={link.route}
								className="flex gap-4 items-center p-2 leftsidebar-link"
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
		</div>
	);
}

export default LeftSidebar;
