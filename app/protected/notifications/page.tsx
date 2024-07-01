"use client";

import NotificationCard from "@/components/notifications/NotificationCard";
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
	const user = fetchUserData();
	const userId = user?.id;

	useEffect(() => {
		// Fetch all notifications for the user
		const fetchNotifications = async () => {
			const { data, error } = await supabase
				.from("notifications")
				.select("*")
				.eq("user_id", userId)
				.eq("read", false)
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
	}, [notifications, userId]);

	return (
		<div className="max-w-xl mx-auto w-screen">
			<ul>
				{notifications.map((notification) => (
					<li key={notification.id}>
						<NotificationCard
							notification={notification}
						></NotificationCard>
					</li>
				))}
			</ul>
		</div>
	);
};

export default NotificationsPage;
