"use client";

import Loader from "@/components/Loader";
import NotificationCard from "@/components/notifications/NotificationCard";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const NotificationsPage = () => {
	const [notifications, setNotifications] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const supabase = createClient();
	const { user } = useUser();
	const userId = user?.id;

	useEffect(() => {
		if (!userId) {
			return;
		}

		const fetchNotifications = async () => {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("notifications")
				.select(
					`
					*, 
					users:from_user_id (*),
					post_id:posts (*),
					comment_id:comments(*)
				`
				)
				.eq("user_id", userId)
				.limit(25)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching notifications:", error);
			} else {
				console.log("Fetched notifications:", data); // Log notifications data
				setNotifications(data);
			}
			setIsLoading(false);
		};

		fetchNotifications();
	}, [userId, supabase]);

	useEffect(() => {
		if (notifications.length > 0 && userId) {
			const markAllAsRead = async () => {
				const { error } = await supabase
					.from("notifications")
					.update({ read: true })
					.eq("user_id", userId)
					.eq("read", false);

				if (error) {
					console.error(
						"Error marking notifications as read:",
						error
					);
				}
			};

			markAllAsRead();
		}
	}, [notifications, userId, supabase]);

	const unreadNotifications = notifications.filter(
		(notification) => !notification.read
	);
	const readNotifications = notifications.filter(
		(notification) => notification.read
	);

	if (isLoading) {
		return (
			<div className="w-screen h-[50vh] flex items-center justify-center">
				<Loader></Loader>
			</div>
		);
	}

	return (
		<div className="max-w-xl mx-auto w-screen p-2">
			{unreadNotifications.length > 0 && (
				<div className="mb-2">
					<h2 className="text-lg font-bold p-2">New</h2>
					<ul className="flex flex-col gap-1">
						{unreadNotifications.map((notification) => (
							<li key={notification.id}>
								<NotificationCard notification={notification} />
							</li>
						))}
					</ul>
				</div>
			)}
			<div>
				<h2 className="text-lg font-bold p-2">Older</h2>
				<ul className="flex flex-col gap-1">
					{readNotifications.map((notification) => (
						<li key={notification.id}>
							<NotificationCard notification={notification} />
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default NotificationsPage;
