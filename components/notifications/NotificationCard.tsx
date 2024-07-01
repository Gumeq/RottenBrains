"use client";

import { getUserFromDB } from "@/utils/supabase/queries";
import Image from "next/image";
import { useEffect, useState } from "react";

type Notification = {
	id: string;
	user_id: string;
	from_user_id: string;
	type: string;
	post_id?: string;
	read: boolean;
	created_at: string;
};

const NotificationCard = ({ notification }: { notification: Notification }) => {
	const [fromUser, setFromUser] = useState<any>(null);

	useEffect(() => {
		const fetchFromUser = async () => {
			const user = await getUserFromDB(notification.from_user_id);
			setFromUser(user);
		};

		fetchFromUser();
	}, [notification.from_user_id]);

	if (!fromUser) {
		return null; // or a loading spinner
	}

	const action = notification.type === "like" ? "liked" : "followed";

	return (
		<div className="rounded-xl bg-foreground/5 p-4 flex flex-row justify-between">
			<div className="flex flex-row items-center gap-4">
				<Image
					src={fromUser.user.imageURL}
					alt=""
					width={40}
					height={40}
					className="rounded-full overflow-hidden"
				/>
				<p>
					<span className="font-bold">{fromUser.user.username}</span>{" "}
					{action === "liked"
						? "liked your post"
						: "started following you"}
				</p>
			</div>
		</div>
	);
};

export default NotificationCard;
