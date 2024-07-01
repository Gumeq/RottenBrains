import { createClient } from "./client";
import { IPost } from "@/types";

const supabase = createClient();

const handleError = (operation: string, error: any) => {
	console.error(`Error during ${operation}:`, error.message);
};

export async function addUserToDB(
	email: string,
	username: string,
	name: string,
	imageURL: string
): Promise<void> {
	try {
		const { data, error } = await supabase
			.from("users")
			.insert([{ username, name, email }])
			.select();
		if (error) throw error;
		console.log("User added:", data);
	} catch (error) {
		handleError("addUserToDB", error);
	}
}

export async function getUserFromDB(id: string): Promise<any | null> {
	try {
		const { data: user, error } = await supabase
			.from("users")
			.select()
			.eq("id", id)
			.single();
		if (error) throw error;
		return { user };
	} catch (error) {
		handleError("getUserFromDB", error);
		return null;
	}
}

export async function addPostToDB(post: IPost): Promise<void> {
	try {
		const { data, error } = await supabase
			.from("Posts")
			.insert([
				{
					movieId: post.mediaId,
					vote_user: post.vote_user,
					review_user: post.review_user,
					creatorId: post.creatorId,
				},
			])
			.select();
		if (error) throw error;
		console.log("Post created:", data);
	} catch (error) {
		handleError("addPostToDB", error);
	}
}

export const getSavedPosts = async (userId: string): Promise<any | null> => {
	try {
		const { data, error } = await supabase
			.from("saves")
			.select("post_id(*)")
			.eq("user_id", userId)
			.order("created_at", { ascending: false });
		if (error) throw error;
		return data;
	} catch (error) {
		handleError("getSavedPosts", error);
		return null;
	}
};

export const getPostsOfMedia = async (
	mediaid: number,
	media_type: string
): Promise<any | null> => {
	try {
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("mediaid", mediaid)
			.eq("media_type", media_type)
			.order("created_at", { ascending: false });
		if (error) throw error;
		return data;
	} catch (error) {
		handleError("getPostsOfMedia", error);
		return null;
	}
};

export const getUserPosts = async (userId: string): Promise<any | null> => {
	try {
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("creatorid", userId)
			.order("created_at", { ascending: false });
		if (error) throw error;
		return data;
	} catch (error) {
		handleError("getUserPosts", error);
		return null;
	}
};

export const getUserNotifications = async (
	userId: string
): Promise<any | null> => {
	try {
		const { data, error } = await supabase
			.from("notifications")
			.select("*")
			.eq("user_id", userId)
			.eq("read", false)
			.order("created_at", { ascending: false })
			.limit(25);
		if (error) throw error;
		return data;
	} catch (error) {
		handleError("getUserNotifications", error);
		return null;
	}
};

export const markAllAsRead = async (userId: string): Promise<any | null> => {
	const { error } = await supabase
		.from("notifications")
		.update({ read: true })
		.eq("user_id", userId)
		.eq("read", false);
	if (error) {
		console.error("Error marking notifications as read:", error);
	}
};

export const getPostComments = async (postId: string): Promise<any | null> => {
	try {
		const { data, error } = await supabase
			.from("comments")
			.select("*")
			.eq("post_id", postId)
			.order("created_at", { ascending: false })
			.limit(10);
		if (error) throw error;
		return data;
	} catch (error) {
		handleError("getPostComments", error);
		return null;
	}
};
