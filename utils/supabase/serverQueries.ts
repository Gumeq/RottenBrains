"use server";

import { getUserFromDB } from "./queries";
import { createClient } from "./server";

const handleError = (operation: string, error: any) => {
  console.error(`Error during ${operation}:`, error.message);
};

export async function getCurrentUser(): Promise<any | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error("Supabase auth user not found or invalid response");
    }

    const { user: supabaseUser } = data;

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
  userId: string,
  page: number,
): Promise<any | null> => {
  try {
    const supabase = await createClient();

    // Call the new RPC function to fetch posts with creator details and like/save status
    const { data: postsData, error: postsError } = await supabase.rpc(
      "fetch_posts_from_followed_users",
      {
        current_user_id: userId,
        result_limit: 10,
        result_offset: page * 10,
      },
    );

    if (postsError) throw postsError;

    return postsData;
  } catch (error) {
    console.error("getPostsFromFollowedUsers", error);
    return null;
  }
};
