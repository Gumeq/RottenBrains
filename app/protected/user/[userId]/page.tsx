import FollowButton from "@/components/post/FollowButton";
import HomePostCard from "@/components/post/HomePostCard";
import { getUserFromDB, getUserPosts } from "@/utils/supabase/queries";
import React from "react";
import Tabs from "./tabs";

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
	let userPosts;
	if (user) {
		userPosts = await getUserPosts(user.user.id, 0);
	}

	return (
		<div className="max-w-6xl mx-auto ">
			{user && (
				<div>
					<div className="flex flex-col gap-4 items-center p-8">
						<div>
							<img
								src={user.user.imageURL}
								alt={""}
								width={150}
								height={150}
								className="rounded-full"
							></img>
						</div>
						<div className="flex flex-col items-center">
							<p className="text-4xl font-bold">
								{user.user.username}
							</p>
							<p className="text-lg text-foreground/50">
								Member since {formattedDate}
							</p>
						</div>
						<div className="pt-4">
							<FollowButton
								user_to_follow_id={user.user.id}
							></FollowButton>
						</div>
					</div>
				</div>
			)}
			<div className="flex items-center w-full">
				<Tabs user={user}></Tabs>
			</div>
		</div>
	);
}
