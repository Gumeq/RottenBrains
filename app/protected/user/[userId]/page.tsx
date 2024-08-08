import FollowButton from "@/components/post/FollowButton";
import HomePostCard from "@/components/post/HomePostCard";
import { getUserFromDB, getUserPosts } from "@/utils/supabase/queries";
import React from "react";
import Tabs from "./tabs";
import FollowInfo from "./FollowInfo";

export default async function userProfile({
	params,
}: {
	params: { userId: string };
}) {
	const userId = params.userId;
	const user = await getUserFromDB(userId);

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
		<div className="max-w-6xl mx-auto w-screen mt-16">
			{user && (
				<div className="max-w-2xl mx-auto flex items-center justify-center py-4">
					<div className="flex md:flex-row w-full justify-between flex-col gap-4">
						<div className="flex flex-col gap-8 items-center justify-between">
							<div>
								<img
									src={user.user.image_url}
									alt={""}
									width={150}
									height={150}
									className="rounded-full"
								></img>
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
							<div className="">
								<FollowButton
									user_to_follow_id={user.user.id}
								></FollowButton>
							</div>
						</div>
					</div>
				</div>
			)}
			<div className="flex items-center w-full mt-4">
				<Tabs user={user}></Tabs>
			</div>
		</div>
	);
}
