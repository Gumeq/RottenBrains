import HomePostCard from "@/components/HomePostCard";
import { getCurrentUser, getSavedPosts } from "@/utils/supabase/queries";
import Image from "next/image";
import React from "react";

export async function ProfilePage() {
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
	let savedPosts;
	if (user) {
		savedPosts = await getSavedPosts(user.user.id);
		console.table(savedPosts);
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
				{savedPosts &&
					savedPosts.map((post: any) => (
						<div>
							<HomePostCard post={post.post_id}></HomePostCard>
						</div>
					))}
			</div>
		</div>
	);
}

export default ProfilePage;
