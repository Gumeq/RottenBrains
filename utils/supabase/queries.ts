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
	image_url: string
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

export const getPostById = async (post_id: string): Promise<any | null> => {
	try {
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("id", post_id)
			.single();
		if (error) throw error;
		return data;
	} catch (error) {
		handleError("getPostById", error);
	}
};

export const getSavedPosts = async (userId: string): Promise<any | null> => {
	try {
		const { data, error } = await supabase
			.from("saves")
			.select("post_id(*)")
			.eq("user_id", userId)
			.order("created_at", { ascending: false });
		if (error) throw error;
		console.log(data);
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
			.select(
				`
                *,
                users (
                    id,
                    username,
                    name,
                    email,
                    image_url
                )
            `
			)
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

export const getUserPosts = async (
	userId: string,
	page: number
): Promise<any | null> => {
	try {
		const { data, error } = await supabase
			.from("posts")
			.select(
				`
                *,
                users (
                    id,
                    username,
                    name,
                    email,
                    image_url
                )
            `
			)
			.eq("creatorid", userId)
			.order("created_at", { ascending: false })
			.range(page * 6, page * 6 + 5);
		if (error) throw error;
		return data;
	} catch (error) {
		handleError("getUserPosts", error);
		return null;
	}
};

export const getUserLikedPosts = async (
	userId: string,
	page: number
): Promise<any | null> => {
	try {
		const { data, error } = await supabase
			.from("likes")
			.select(
				`
                *,
                posts (
                    *,
					users (*)
                )
            `
			)
			.eq("user_id", userId)
			.order("created_at", { ascending: false })
			.range(page * 6, page * 6 + 5);
		if (error) throw error;
		return data;
	} catch (error) {
		handleError("getUserPosts", error);
		return null;
	}
};

export const getUserSavedPosts = async (
	userId: string,
	page: number
): Promise<any | null> => {
	try {
		const { data, error } = await supabase
			.from("saves")
			.select(
				`
                *,
                posts (
                    *,
					users (*)
                )
            `
			)
			.eq("user_id", userId)
			.order("created_at", { ascending: false })
			.range(page * 6, page * 6 + 5);
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
			.select(
				`
                *,
                users (
                    id,
                    username,
                    name,
                    email,
                    image_url
                )
            `
			)
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

export const uploadProfilePicture = async (
	file: File,
	userId: string | undefined
) => {
	if (!userId) {
		console.error("User not found or not authenticated");
		return false;
	}

	// Validate MIME type
	const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
	if (!validMimeTypes.includes(file.type)) {
		console.error(`Unsupported MIME type: ${file.type}`);
		return false;
	}

	try {
		const fileName = `${userId}/${Date.now()}`;
		const { data, error } = await supabase.storage
			.from("profile_pictures")
			.upload(fileName, file, {
				cacheControl: "3600",
				upsert: false,
			});

		if (error) {
			throw error;
		}

		const { data: publicURL } = supabase.storage
			.from("profile_pictures")
			.getPublicUrl(fileName);

		const { data: updateData, error: updateError } = await supabase
			.from("users")
			.update({ image_url: publicURL.publicUrl })
			.eq("id", userId);

		if (updateError) {
			throw updateError;
		}

		return true;
	} catch (error) {
		console.error("Error uploading profile picture:", error);
		return false;
	}
};

export async function getFollowers(id: string): Promise<any | null> {
	try {
		const {
			data: followers,
			error,
			count: followers_count,
		} = await supabase
			.from("follows")
			.select(
				`
                *,
                users:user_id (
                    id,
                    username,
                    name,
                    email,
                    image_url
                )
            `,
				{ count: "exact" }
			)
			.eq("following_id", id);

		if (error) throw error;

		return { followers_count, followers };
	} catch (error) {
		console.error("Error in getFollowers:", error);
		return null;
	}
}

export async function getFollowing(id: string): Promise<any | null> {
	try {
		const {
			data: following,
			error,
			count: following_count,
		} = await supabase
			.from("follows")
			.select(
				`
                *,
                users:following_id (
                    id,
                    username,
                    name,
                    email,
                    image_url
                )
            `,
				{ count: "exact" }
			)
			.eq("user_id", id);

		if (error) throw error;

		return { following_count, following };
	} catch (error) {
		console.error("Error in getFollowing:", error);
		return null;
	}
}

export async function getPostCount(id: string): Promise<any | null> {
	try {
		const { error, count: post_count } = await supabase
			.from("posts")
			.select("*", { count: "exact" })
			.eq("creatorid", id);

		if (error) throw error;

		return { post_count };
	} catch (error) {
		console.error("Error in getPostCount:", error);
		return null;
	}
}

export const getNewestUsers = async () => {
	try {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.order("created_at", { ascending: false })
			.limit(10);
		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error in getNewestUsers:", error);
		return null;
	}
};
