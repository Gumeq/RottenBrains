import { getUserFromDB } from "@/utils/supabase/queries";
import Image from "next/image";
import React from "react";

const NotificationCard = async ({ notification }: any) => {
	const from_user = await getUserFromDB(notification.from_user_id);

	const action = notification.type === "like" ? "liked" : "followed";

	return (
		<div className="rounded-xl bg-foreground/5 p-4 flex flex-row justify-between">
			<div className="flex flex-row items-center gap-4">
				<Image
					src={from_user?.user.imageURL}
					alt={""}
					width={40}
					height={40}
					className="rounded-full overflow-hidden"
				></Image>
				{action === "liked" && (
					<p>
						<span className="font-bold">
							{from_user?.user.username}
						</span>{" "}
						{action} your post
					</p>
				)}
				{action === "followed" && (
					<p>
						<span className="font-bold">
							{from_user?.user.username}
						</span>{" "}
						started following you
					</p>
				)}
			</div>
		</div>
	);
};

export default NotificationCard;
