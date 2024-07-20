import React from "react";

import SearchBar from "../searchBar/SearchBar";
import NotificationButton from "../notifications/RealtimeNotifications";
import Link from "next/link";

const MobileTopNav = async () => {
	return (
		<div className="w-screen bg-background fixed top-0 z-30 flex md:hidden items-center justify-center p-2">
			<div className="flex flex-row items-center justify-between w-full">
				<Link href={"/protected/home"}>
					<img
						src="/assets/images/logo-text.png"
						alt="text-logo"
						width={60}
						height={60}
						className="invert-on-dark"
					/>
				</Link>
				{/* <div className=" h-full w-full mx-4">
					<SearchBar link={true}></SearchBar>
				</div> */}
				<NotificationButton></NotificationButton>
			</div>
		</div>
	);
};

export default MobileTopNav;
