"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/context/UserContext";

const NotificationButton = () => {
	const [hasUnread, setHasUnread] = useState(false);
	const router = useRouter();
	const supabase = createClient();
	const { user } = useUser();

	useEffect(() => {
		if (!user) {
			return;
		}
		const userId = user.id;

		const fetchUnreadNotifications = async () => {
			const { data, error } = await supabase
				.from("notifications")
				.select("read")
				.eq("user_id", userId)
				.eq("read", false);

			if (error) {
				console.error("Error fetching notifications:", error);
				return;
			}

			setHasUnread(data && data.length > 0);
		};

		const fetchInitialDataAndSubscribe = async () => {
			await fetchUnreadNotifications();

			const channel = supabase
				.channel(`public:notifications:user_id=eq.${userId}`)
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "notifications",
					},
					(payload) => {
						if (payload.new.user_id === userId) {
							setHasUnread(true);
						}
					}
				)
				.on(
					"postgres_changes",
					{
						event: "UPDATE",
						schema: "public",
						table: "notifications",
					},
					(payload) => {
						if (payload.new.user_id === userId) {
							fetchUnreadNotifications();
						}
					}
				)
				.subscribe();

			return () => {
				supabase.removeChannel(channel);
			};
		};

		fetchInitialDataAndSubscribe();
	}, [user, supabase]);

	const handleClick = () => {
		router.push("/protected/notifications");
	};

	return (
		<button onClick={handleClick} className="pointer relative">
			<img
				src={"/assets/icons/bell-solid.svg"}
				alt="Notification Bell"
				width={25}
				height={25}
				className="invert-on-dark max-w-[25px] max-h-[25px]"
			/>
			{hasUnread && (
				<span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent"></span>
			)}
		</button>
	);
};

export default NotificationButton;
