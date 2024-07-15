import AuthButton from "@/components/auth/AuthButton";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";
import Tabs from "./tabs";
import ProfilePicture from "./ProfilePictureChange";
import ConnectButton from "@/utils/tmdb/ConnectButton";
import FollowInfo from "../user/[userId]/FollowInfo";
import FollowButton from "@/components/post/FollowButton";

const ProfilePage = async () => {
	const user = await getCurrentUser();

	const dateString = user?.user.created_at;
	const date = new Date(dateString);
	// Create a formatter for the desired format
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
	};
	const formatter = new Intl.DateTimeFormat("en-US", options);
	const formattedDate = formatter.format(date);

	return (
		<div className="max-w-6xl mx-auto ">
			{user && (
				<div className="max-w-2xl mx-auto flex items-center justify-center py-4">
					<div className="flex flex-row w-full justify-between">
						<div className="flex flex-col gap-8 items-center justify-between">
							<div>
								<ProfilePicture></ProfilePicture>
							</div>
							<div className="flex flex-col gap-2 items-center">
								<p className="text-2xl font-bold">
									{user.user.username}
								</p>
								<p className="text-md text-foreground/50">
									Member since {formattedDate}
								</p>
							</div>
						</div>
						<div className="flex flex-col justify-center items-center gap-8">
							<div>
								<FollowInfo user={user.user}></FollowInfo>
							</div>
							<div className="flex flex-row gap-2">
								<FollowButton
									user_to_follow_id={user.user.id}
								></FollowButton>
								<AuthButton></AuthButton>
							</div>
						</div>
					</div>
				</div>
			)}
			<div className="flex items-center w-full">
				<Tabs></Tabs>
			</div>
		</div>
	);
};

export default ProfilePage;
