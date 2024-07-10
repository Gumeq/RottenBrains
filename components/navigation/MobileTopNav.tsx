import React from "react";

import { getCurrentUser } from "@/utils/supabase/serverQueries";
import ProfilePicture from "../ProfilePicture";

import SearchBar from "../searchBar/SearchBar";
import AuthButton from "../auth/AuthButton";
import NotificationButton from "../notifications/RealtimeNotifications";
import Link from "next/link";

const MobileTopNav = async () => {
	return (
		<div className="w-screen bg-background fixed top-0 z-30 flex md:hidden items-center justify-center p-2">
			<div className="flex flex-row items-center justify-between w-full py-2">
				<Link href={"/protected/home"}>
					<img
						src="/assets/images/logo-text.png"
						alt="text-logo"
						width={80}
						height={80}
						className="invert-on-dark"
					/>
				</Link>
				<div className="  flex flex-row ">
					<div className=" h-full w-full">
						<SearchBar link={true}></SearchBar>
					</div>
				</div>
				<NotificationButton></NotificationButton>
			</div>
		</div>
	);
};

export default MobileTopNav;
