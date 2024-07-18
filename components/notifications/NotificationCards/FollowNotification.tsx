import FollowButton from "@/components/post/FollowButton";
import ProfilePicture from "@/components/ProfilePicture";
import React from "react";

const FollowNotification = ({ notification }: any) => {
	const fromUser = notification.users;
	return (
		<div className="rounded-[8px] bg-foreground/5 p-4 flex flex-row justify-between border border-foreground/10 ">
			<div className="flex flex-row items-center justify-between w-full">
				<div className="flex flex-row items-center gap-4">
					<ProfilePicture userId={fromUser.id}></ProfilePicture>
					<p className="">
						<span className="font-bold">{fromUser.username}</span>{" "}
						started following you!
					</p>
				</div>

				<FollowButton user_to_follow_id={fromUser.id}></FollowButton>
			</div>
		</div>
	);
};

export default FollowNotification;
