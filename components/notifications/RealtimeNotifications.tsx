"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import fetchUserData from "@/utils/clientFunctions/fetchUserData";

type Notification = {
	id: string;
	user_id: string;
	type: string;
	post_id?: string;
	read: boolean;
	created_at: string;
};

const NotificationButton = () => {
	const user = fetchUserData();
	const userId = user?.id;
	const [hasUnread, setHasUnread] = useState(false);
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		// Fetch initial unread notifications
		const fetchUnreadNotifications = async () => {
			const { data, error } = await supabase
				.from("notifications")
				.select("read")
				.eq("user_id", userId)
				.eq("read", false);

			if (error) {
				console.error("Error fetching notifications:", error);
			} else {
				setHasUnread(data.length > 0);
			}
		};

		fetchUnreadNotifications();

		// Set up real-time subscription for new notifications
		const channel = supabase
			.channel(`public:notifications:user_id=eq.${userId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${userId}`,
				},
				(payload) => {
					setHasUnread(true);
				}
			)
			.subscribe();

		// Clean up subscription on component unmount
		return () => {
			supabase.removeChannel(channel);
		};
	}, [userId, router, supabase]);

	const handleClick = () => {
		router.push("/protected/notifications"); // Navigate to the notifications page
	};

	return (
		<button onClick={handleClick} className="pointer relative">
			<img
				src={"/assets/icons/bell-solid.svg"}
				alt={""}
				width={20}
				height={20}
				className="invert-on-dark"
			></img>
			{hasUnread && (
				<span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent"></span>
			)}
		</button>
	);
};

export default NotificationButton;
