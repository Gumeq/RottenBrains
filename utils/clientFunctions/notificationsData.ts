import { createClient } from "../supabase/client";

const supabase = createClient();

export async function addNotification(
	from_userId: string,
	userId: string,
	type: string,
	postId?: string
) {
	const { error: notifError } = await supabase
		.from("notifications")
		.select("user_id,post_id,type")
		.eq("from_user_id", from_userId)
		.eq("user_id", userId)
		.eq("post_id", postId)
		.eq("type", "like")
		.single();

	const { error: notifErrorFollow } = await supabase
		.from("notifications")
		.select("from_user_id,user_id,type")
		.eq("user_id", userId)
		.eq("from_user_id", from_userId)
		.eq("type", "follow")
		.single();

	if (notifError && type === "like") {
		const { data, error } = await supabase.from("notifications").insert([
			{
				user_id: userId,
				from_user_id: from_userId,
				type,
				post_id: postId,
				read: false,
			},
		]);

		if (error) {
			console.error("Error adding notification:", error);
		} else {
			console.log("Notification added:", data);
		}
	} else if (notifErrorFollow && type === "follow") {
		const { data, error } = await supabase.from("notifications").insert([
			{
				user_id: userId,
				from_user_id: from_userId,
				type,
				read: false,
			},
		]);

		if (error) {
			console.error("Error adding notification:", error);
		} else {
			console.log("Notification added:", data);
		}
	} else {
		console.log("notification already added");
	}
}

export async function markAsRead(notificationId: string) {
	const { error } = await supabase
		.from("notifications")
		.update({ read: true })
		.eq("id", notificationId);

	if (error) {
		console.error("Error marking notification as read:", error);
	}
}
