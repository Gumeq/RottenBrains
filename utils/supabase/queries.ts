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
					movieId: post.media_id,
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
		return data;
	} catch (error) {
		handleError("getSavedPosts", error);
		return null;
	}
};

export const getPostsOfMedia = async (
	user_id: string,
	media_type: string,
	media_id: number,
	page: number
): Promise<any | null> => {
	try {
		// Call the RPC function to fetch posts with media type and ID
		const { data: postsData, error: postsError } = await supabase.rpc(
			"fetch_posts_by_media",
			{
				current_user_id: user_id,
				media_type_param: media_type,
				media_id_param: media_id,
				result_limit: 6,
				result_offset: page * 6,
			}
		);

		if (postsError) throw postsError;

		return postsData;
	} catch (error) {
		console.error("getPostsByMedia", error);
		return null;
	}
};

export const getUserPosts = async (
	creator_id: string,
	user_id: string,
	page: number
): Promise<any | null> => {
	try {
		const supabase = createClient();

		// Call the new RPC function to fetch posts with creator details and like/save status
		const { data: postsData, error: postsError } = await supabase.rpc(
			"fetch_user_posts",
			{
				creator_id: creator_id,
				current_user_id: user_id,
				result_limit: 6,
				result_offset: page * 6,
			}
		);

		if (postsError) throw postsError;

		return postsData;
	} catch (error) {
		console.error("getUserPosts", error);
		return null;
	}
};

export const getUserLikedPosts = async (
	creator_id: string,
	user_id: string,
	page: number
): Promise<any | null> => {
	try {
		const supabase = createClient();

		// Call the new RPC function to fetch liked posts with creator details and like/save status
		const { data: postsData, error: postsError } = await supabase.rpc(
			"fetch_user_liked_posts",
			{
				creator_id: creator_id,
				current_user_id: user_id, // Assuming the current user is the same for this function
				result_limit: 6,
				result_offset: page * 6,
			}
		);

		if (postsError) throw postsError;

		return postsData;
	} catch (error) {
		console.error("getUserLikedPosts", error);
		return null;
	}
};

export const getUserSavedPosts = async (
	creator_id: string,
	user_id: string,
	page: number
): Promise<any | null> => {
	try {
		const supabase = createClient();

		// Call the new RPC function to fetch saved posts with creator details and like/save status
		const { data: postsData, error: postsError } = await supabase.rpc(
			"fetch_user_saved_posts",
			{
				creator_id: creator_id,
				current_user_id: user_id,
				result_limit: 6,
				result_offset: page * 6,
			}
		);

		if (postsError) throw postsError;

		return postsData;
	} catch (error) {
		console.error("getUserSavedPosts", error);
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

export const checkWatchHistoryExists = async (
	user_id: string,
	media_type: string,
	media_id: number,
	season_number?: number,
	episode_number?: number
) => {
	const { data: result, error } = await supabase.rpc(
		"check_watch_history_exists",
		{
			p_user_id: user_id,
			p_media_type: media_type,
			p_media_id: media_id,
			p_season_number: season_number,
			p_episode_number: episode_number,
		}
	);

	if (error) {
		throw new Error(error.message);
	}

	return result;
};

export const upsertWatchHistory = async (
	user_id: string,
	media_type: string,
	media_id: number,
	season_number?: number,
	episode_number?: number
) => {
	try {
		// Check if the item already exists using the SQL function
		const { data: exists, error: checkError } = await supabase.rpc(
			"check_watch_history_exists",
			{
				p_user_id: user_id,
				p_media_type: media_type,
				p_media_id: media_id,
				p_season_number: season_number,
				p_episode_number: episode_number,
			}
		);

		if (checkError) {
			console.error("Error checking existence:", checkError);
			throw new Error(checkError.message);
		}

		console.log("Exists:", exists);

		if (exists) {
			// If the item exists, update the created_at field
			const { error: updateError } = await supabase
				.from("watch_history")
				.update({ created_at: new Date().toISOString() })
				.match({
					user_id,
					media_type,
					media_id,
					season_number,
					episode_number,
				});

			if (updateError) {
				console.error("Error updating watch history:", updateError);
				throw new Error(updateError.message);
			}

			return { success: true, action: "updated" };
		} else {
			// If the item does not exist, insert a new row
			const { error: insertError } = await supabase
				.from("watch_history")
				.insert([
					{
						user_id,
						media_type,
						media_id,
						season_number,
						episode_number,
						created_at: new Date().toISOString(),
					},
				]);

			if (insertError) {
				console.error("Error inserting watch history:", insertError);
				throw new Error(insertError.message);
			}

			return { success: true, action: "inserted" };
		}
	} catch (error) {
		console.error("Error in upsertWatchHistory:", error);
		throw error;
	}
};

export const getWatchHistoryForUser = async (
	user_id: string,
	limit: number,
	offset: number
) => {
	try {
		const { data, error } = await supabase.rpc(
			"get_watch_history_for_user",
			{
				p_user_id: user_id,
				p_limit: limit,
				p_offset: offset,
			}
		);

		if (error) {
			console.error("Error fetching watch history:", error);
			throw new Error(error.message);
		}

		return data;
	} catch (error) {
		console.error("Error in getWatchHistoryForUser:", error);
		throw error;
	}
};
