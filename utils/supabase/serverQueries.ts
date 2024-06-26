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

export const getPostsFromFollowedUsers = async (
	userId: string
): Promise<any | null> => {
	try {
		const supabase = createClient();
		const { data: followedUsers, error } = await supabase
			.from("follows")
			.select("following_id")
			.eq("user_id", userId);
		if (error) throw error;

		const followedUserIds = followedUsers.map(
			(user: any) => user.following_id
		);

		const { data: postsData, error: postsError } = await supabase
			.from("posts")
			.select("*")
			.in("creatorid", followedUserIds)
			.order("created_at", { ascending: false });
		if (postsError) throw postsError;

		return postsData;
	} catch (error) {
		handleError("getPostsFromFollowedUsers", error);
		return null;
	}
};
