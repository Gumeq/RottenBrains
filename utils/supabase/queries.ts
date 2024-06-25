import { IMedia, IPost } from "@/types";
import { createClient } from "@supabase/supabase-js";
import { createClient as CreateClientServer } from "@/utils/supabase/server";

export async function addUserToDB(
	email: string,
	username: string,
	name: string,
	imageURL: string
) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const { data, error } = await supabase
		.from("users")
		.insert([
			{
				username: username,
				name: name,
				email: email,
			},
		])
		.select();

	return;
}

export async function getUserFromDB(id: string) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	let { data: user, error } = await supabase
		.from("users")
		.select()
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching user from DB:", error.message);
		return null; // or handle the error as needed
	}

	return { user };
}

export async function getCurrentUser() {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	try {
		const supabase = CreateClientServer();
		const {
			data: { user: supabaseUser },
		} = await supabase.auth.getUser();

		if (supabaseUser) {
			const dbUser = await getUserFromDB(supabaseUser.id);
			const currentAccount = dbUser;
			return currentAccount;
		}
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function addPostToDB(post: IPost) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
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
	console.log("Created");
	return;
}

export const getSavedPosts = async (userId: string) => {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const { data, error } = await supabase
		.from("saves")
		.select(`post_id(*)`) // Type assertion to any
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching saved posts:", error.message);
		return null;
	}

	return data;
};

export const getPostsOfMedia = async (mediaid: number, media_type: string) => {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const { data, error } = await supabase
		.from("posts")
		.select("*") // Type assertion to any
		.eq("mediaid", mediaid)
		.eq("media_type", media_type)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching saved posts:", error.message);
		return null;
	}

	return data;
};

export const getUserPosts = async (userId: string) => {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const { data, error } = await supabase
		.from("posts")
		.select("*") // Type assertion to any
		.eq("creatorid", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching saved posts:", error.message);
		return null;
	}

	return data;
};

export const getPostsFromFollowedUsers = async (userId: string) => {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	try {
		const { data: followedUsers, error } = await supabase
			.from("follows")
			.select("following_id")
			.eq("user_id", userId);

		if (error) {
			throw new Error(`Error fetching followed users: ${error.message}`);
		}

		// Get followed user IDs
		const followedUserIds = followedUsers.map((user) => user.following_id);

		// Fetch posts from followed users
		const { data: postsData, error: postsError } = await supabase
			.from("posts")
			.select("*")
			.in("creatorid", followedUserIds)
			.order("created_at", { ascending: false });

		if (postsError) {
			throw new Error(`Error fetching posts: ${postsError.message}`);
		}

		return postsData;
	} catch (error) {
		console.error("Error in getPostsFromFollowedUsers:", error);
		return null;
	}
};

export const getUserNotifications = async (userId: string) => {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const { data, error } = await supabase
		.from("notifications")
		.select("*") // Type assertion to any
		.eq("user_id", userId)
		.eq("read", false)
		.order("created_at", { ascending: false })
		.limit(5);

	if (error) {
		console.error("Error fetching saved posts:", error.message);
		return null;
	}

	return data;
};
