import NotificationCard from "@/components/NotificationCard";
import { getCurrentUser, getUserNotifications } from "@/utils/supabase/queries";
import React from "react";

const NotificationPage = async () => {
	const user = await getCurrentUser();
	const notifications = await getUserNotifications(user?.user.id);
	console.log(notifications);
	return (
		<div className="md:max-w-lg w-screen h-full mx-auto">
			{notifications && (
				<div className="flex flex-col gap-2">
					{notifications.map((notification) => (
						<div>
							<NotificationCard
								notification={notification}
							></NotificationCard>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default NotificationPage;