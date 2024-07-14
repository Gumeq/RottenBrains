"use client";

import NotificationCard from "@/components/notifications/NotificationCard";
import { useUser } from "@/context/UserContext";
import fetchUserData from "@/utils/clientFunctions/fetchUserData";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type Notification = {
	id: string;
	user_id: string;
	type: string;
	post_id?: string;
	read: boolean;
	created_at: string;
	from_user_id: string;
};

const NotificationsPage = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const supabase = createClient();
	const { user } = useUser();
	const userId = user?.id;

	useEffect(() => {
		// Fetch all notifications for the user
		const fetchNotifications = async () => {
			const { data, error } = await supabase
				.from("notifications")
				.select(
					`
                *,
                users:from_user_id (
                    id,
                    username,
                    name,
                    email,
                    imageURL
                )
            `
				)
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching notifications:", error);
			} else {
				setNotifications(data);
			}
		};

		fetchNotifications();
	}, [userId]);

	useEffect(() => {
		if (notifications.length > 0) {
			// Mark all unread notifications as read after fetching them
			const markAllAsRead = async () => {
				const { error } = await supabase
					.from("notifications")
					.update({ read: true })
					.eq("user_id", userId)
					.eq("read", false)
					.limit(25);

				if (error) {
					console.error(
						"Error marking notifications as read:",
						error
					);
				}
			};

			markAllAsRead();
		}
	}, [notifications, userId]);

	const unreadNotifications = notifications.filter(
		(notification) => !notification.read
	);
	const readNotifications = notifications.filter(
		(notification) => notification.read
	);

	console.log(notifications);

	return (
		<div className="max-w-xl mx-auto w-screen">
			{unreadNotifications.length > 0 && (
				<div className="mb-4">
					<h2 className="text-lg font-bold">New</h2>
					<ul className="flex flex-col gap-2">
						{unreadNotifications.map((notification) => (
							<li key={notification.id}>
								<NotificationCard
									notification={notification}
								></NotificationCard>
							</li>
						))}
					</ul>
				</div>
			)}
			<div>
				<h2 className="text-lg font-bold">Older</h2>
				<ul className="flex flex-col gap-2">
					{readNotifications.map((notification) => (
						<li key={notification.id}>
							<NotificationCard
								notification={notification}
							></NotificationCard>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default NotificationsPage;
