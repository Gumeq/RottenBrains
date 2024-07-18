import { createClient } from "../supabase/client";

const supabase = createClient();

export async function addNotification(
	from_userId: string,
	userId: string,
	type: string,
	postId?: string,
	comment_id?: string
) {
	if (type !== "comment") {
		const { error: notifError } = await supabase
			.from("notifications")
			.select("user_id,post_id,type")
			.eq("from_user_id", from_userId)
			.eq("user_id", userId)
			.eq("post_id", postId)
			.eq("type", type)
			.single();

		if (notifError) {
			if (type === "like") {
				const { data, error } = await supabase
					.from("notifications")
					.insert([
						{
							user_id: userId,
							from_user_id: from_userId,
							type,
							post_id: postId,
							read: false,
						},
					]);
			}
			if (type === "follow") {
				const { data, error } = await supabase
					.from("notifications")
					.insert([
						{
							user_id: userId,
							from_user_id: from_userId,
							type,
							read: false,
						},
					]);
			}
		}
	} else if (type === "comment") {
		const { data, error } = await supabase.from("notifications").insert([
			{
				user_id: userId,
				from_user_id: from_userId,
				type,
				post_id: postId,
				comment_id: comment_id,
				read: false,
			},
		]);
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
