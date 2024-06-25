import HomePostCard from "@/components/HomePostCard";
import { getUserFromDB, getUserPosts } from "@/utils/supabase/queries";
import Image from "next/image";
import React from "react";

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
		userPosts = await getUserPosts(user.user.id);
		console.table(userPosts);
	}

	return (
		<div className="max-w-6xl mx-auto ">
			{user && (
				<div>
					<div className="flex flex-row gap-4 items-center p-8">
						<div>
							<Image
								src={user.user.imageURL}
								alt={""}
								width={150}
								height={150}
								className="rounded-full"
							></Image>
						</div>
						<div className="flex flex-col">
							<p className="text-4xl font-bold">
								{user.user.username}
							</p>
							<p className="text-lg text-foreground/50">
								Member since {formattedDate}
							</p>
						</div>
					</div>
				</div>
			)}
			<div className="flex flex-row flex-wrap gap-4">
				{userPosts &&
					userPosts.map((post: any) => (
						<div>
							<HomePostCard post={post}></HomePostCard>
						</div>
					))}
			</div>
		</div>
	);
}
