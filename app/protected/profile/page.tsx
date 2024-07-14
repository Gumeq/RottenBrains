import AuthButton from "@/components/auth/AuthButton";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";
import Tabs from "./tabs";
import ProfilePicture from "./ProfilePictureChange";

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
				<div>
					<div className="flex flex-col gap-4 items-center p-8 ">
						<div>
							{/* <img
								src={user.user.imageURL}
								alt={""}
								width={150}
								height={150}
								className="rounded-full"
							></img> */}
							<ProfilePicture></ProfilePicture>
						</div>
						<div className="flex flex-col items-center justify-center">
							<p className="text-4xl font-bold">
								{user.user.username}
							</p>
							<p className="text-lg text-foreground/50">
								Member since {formattedDate}
							</p>
							<div className="pt-4">
								<AuthButton></AuthButton>
							</div>
						</div>
					</div>
				</div>
			)}
			{/* <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center gap-4">
				{userPosts &&
					userPosts.map((post: any) => (
						<div>
							<HomePostCard post={post}></HomePostCard>
						</div>
					))}
			</div> */}
			<div className="flex items-center w-full">
				<Tabs></Tabs>
			</div>
		</div>
	);
};

export default ProfilePage;
