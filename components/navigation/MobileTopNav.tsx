import React from "react";

import { getCurrentUser } from "@/utils/supabase/serverQueries";
import ProfilePicture from "../ProfilePicture";
import AuthButton from "../auth/AuthButton";
import SearchBar from "../searchBar/SearchBar";

const MobileTopNav = async () => {
	const currentUser = await getCurrentUser();
	return (
		<div className="w-screen bg-background fixed top-0 z-30 flex md:hidden items-center justify-center px-2">
			<div className="flex flex-row gap-4 items-center justify-center">
				<div className="flex items-center">
					<ProfilePicture
						userId={currentUser?.user.id}
					></ProfilePicture>
				</div>
				<div className=" px-0 py-4 flex flex-row gap-2 ">
					<div className=" h-full md:w-full">
						<SearchBar link={true}></SearchBar>
					</div>
				</div>
				<AuthButton></AuthButton>
			</div>
		</div>
	);
};

export default MobileTopNav;
