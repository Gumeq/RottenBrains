"use client";

import ProfilePicture from "../ProfilePicture";

const NotificationCard = ({ notification }: { notification: any }) => {
	const fromUser = notification.users;
	console.log(fromUser);

	if (!fromUser) {
		return <p>no user</p>; // or a loading spinner
	}

	const action = notification.type === "like" ? "liked" : "followed";

	return (
		<div className="rounded-xl bg-foreground/5 p-4 flex flex-row justify-between">
			<div className="flex flex-row items-center gap-4">
				<ProfilePicture userId={fromUser.id}></ProfilePicture>
				<p>
					<span className="font-bold">{fromUser.username}</span>{" "}
					{action === "liked"
						? "liked your post"
						: "started following you"}
				</p>
			</div>
		</div>
	);
};

export default NotificationCard;
