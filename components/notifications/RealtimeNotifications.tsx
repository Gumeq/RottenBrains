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
		const fetchInitialDataAndSubscribe = async () => {
			const userId = user?.id;

			if (!userId) {
				return;
			}

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

			return () => {
				supabase.removeChannel(channel);
			};
		};

		fetchInitialDataAndSubscribe();
	}, [router, supabase]);

	const handleClick = () => {
		router.push("/protected/notifications"); // Navigate to the notifications page
	};

	return (
		<button onClick={handleClick} className="pointer relative">
			<img
				src={"/assets/icons/bell-solid.svg"}
				alt="Notification Bell"
				width={20}
				height={20}
				className="invert-on-dark"
			/>
			{hasUnread && (
				<span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent"></span>
			)}
		</button>
	);
};

export default NotificationButton;
