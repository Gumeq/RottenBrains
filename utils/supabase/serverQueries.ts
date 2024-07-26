"use server";

import { getUserFromDB } from "./queries";
import { createClient } from "./server";
import { IPost } from "@/types";

const handleError = (operation: string, error: any) => {
	console.error(`Error during ${operation}:`, error.message);
};

export async function getCurrentUser(): Promise<any | null> {
	try {
		const supabase = createClient();
		const {
			data: { user: supabaseUser },
		} = await supabase.auth.getUser();

		if (supabaseUser) {
			return await getUserFromDB(supabaseUser.id);
		}
		return null;
	} catch (error) {
		handleError("getCurrentUser", error);
		return null;
	}
}

// export const getPostsFromFollowedUsers = async (
// 	userId: string,
// 	page: number
// ): Promise<any | null> => {
// 	try {
// 		const supabase = createClient();
// 		const { data: followedUsers, error } = await supabase
// 			.from("follows")
// 			.select("following_id")
// 			.eq("user_id", userId);
// 		if (error) throw error;

// 		const followedUserIds = followedUsers.map(
// 			(user: any) => user.following_id
// 		);

// 		const { data: postsData, error: postsError } = await supabase
// 			.from("posts")
// 			.select(
// 				`
//                 *,
//                 users (
//                     id,
//                     username,
//                     name,
//                     email,
//                     image_url
//                 )
//             `
// 			)
// 			.in("creatorid", followedUserIds)
// 			.order("created_at", { ascending: false })
// 			.range(page * 6, page * 6 + 5);
// 		if (postsError) throw postsError;

// 		return postsData;
// 	} catch (error) {
// 		handleError("getPostsFromFollowedUsers", error);
// 		return null;
// 	}
// };

export const getPostsFromFollowedUsers = async (
	userId: string,
	page: number
): Promise<any | null> => {
	try {
		const supabase = createClient();

		// Call the new RPC function to fetch posts with creator details and like/save status
		const { data: postsData, error: postsError } = await supabase.rpc(
			"fetch_posts_from_followed_users",
			{
				current_user_id: userId,
				result_limit: 6,
				result_offset: page * 6,
			}
		);

		if (postsError) throw postsError;

		return postsData;
	} catch (error) {
		console.error("getPostsFromFollowedUsers", error);
		return null;
	}
};
