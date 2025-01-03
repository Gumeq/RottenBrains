import { redirect } from "next/navigation";
import { createClient } from "./client";
import { IPost } from "@/types";

const supabase = createClient();

const handleError = (operation: string, error: any) => {
  console.error(`Error during ${operation}:`, error.message);
};

export const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};

export async function addUserToDB(
  email: string,
  username: string,
  name: string,
  image_url: string,
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
  page: number,
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
      },
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
  page: number,
): Promise<any | null> => {
  try {
    const supabase = createClient();

    // Call the new RPC function to fetch posts with creator details and like/save status
    const { data: postsData, error: postsError } = await supabase.rpc(
      "fetch_user_posts",
      {
        creator_id: creator_id,
        current_user_id: user_id,
        result_limit: 10,
        result_offset: page * 10,
      },
    );

    if (postsError) throw postsError;

    return postsData;
  } catch (error) {
    console.error("getUserPosts", error);
    return null;
  }
};
export const getUserPostsType = async (
  creator_id: string,
  user_id: string,
  page: number,
  media_type: string,
): Promise<any | null> => {
  try {
    const supabase = createClient();

    // Call the new RPC function to fetch posts with creator details and like/save status
    const { data: postsData, error: postsError } = await supabase.rpc(
      "fetch_user_posts_type",
      {
        creator_id: creator_id,
        current_user_id: user_id,
        result_limit: 10,
        result_offset: page * 10,
        media_type_filter: media_type,
      },
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
  page: number,
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
      },
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
  page: number,
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
      },
    );

    if (postsError) throw postsError;

    return postsData;
  } catch (error) {
    console.error("getUserSavedPosts", error);
    return null;
  }
};

export const getUserNotifications = async (
  userId: string,
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
            `,
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

export const getCommentReplies = async (
  comment_id: string,
): Promise<any | null> => {
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
            `,
      )
      .eq("parent_id", comment_id)
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
  userId: string | undefined,
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

export const uploadBackdropPicture = async (
  file: File,
  userId: string | undefined,
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
      .from("backdrop_pictures")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: publicURL } = supabase.storage
      .from("backdrop_pictures")
      .getPublicUrl(fileName);

    const { data: updateData, error: updateError } = await supabase
      .from("users")
      .update({ backdrop_url: publicURL.publicUrl })
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
        { count: "exact" },
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
        { count: "exact" },
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
  episode_number?: number,
) => {
  const { data: result, error } = await supabase.rpc(
    "check_watch_history_exists",
    {
      p_user_id: user_id,
      p_media_type: media_type,
      p_media_id: media_id,
      p_season_number: season_number,
      p_episode_number: episode_number,
    },
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
  new_time_spent: number,
  new_percentage_watched: string,
  season_number: number | null,
  episode_number: number | null,
) => {
  try {
    console.log("Starting upsertWatchHistory...");

    // Replace NULL with -1 for season_number and episode_number
    const normalizedSeasonNumber = season_number ?? -1;
    const normalizedEpisodeNumber = episode_number ?? -1;
    console.log("Normalized season_number:", normalizedSeasonNumber);
    console.log("Normalized episode_number:", normalizedEpisodeNumber);

    // Parse new_percentage_watched to a float
    const newPercentageFloat = parseFloat(new_percentage_watched);
    console.log("Parsed new_percentage_watched:", newPercentageFloat);

    // Step 1: Retrieve existing percentage_watched
    console.log("Fetching existing watch history...");
    const { data: existingData, error: fetchError } = await supabase
      .from("watch_history")
      .select("percentage_watched")
      .eq("user_id", user_id)
      .eq("media_type", media_type)
      .eq("media_id", media_id)
      .eq("season_number", normalizedSeasonNumber)
      .eq("episode_number", normalizedEpisodeNumber)
      .single(); // Retrieve one record

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        console.log(
          "No existing watch history found for this media. Assuming percentage_watched = 0.",
        );
      } else {
        console.error(
          "Error fetching existing watch history:",
          fetchError.message,
        );
        throw new Error(fetchError.message);
      }
    } else {
      console.log("Existing watch history found:", existingData);
    }

    // Calculate the total percentage watched
    const existingPercentage = existingData?.percentage_watched || 0;
    console.log("Existing percentage_watched:", existingPercentage);

    const updatedPercentage = Math.min(
      Number(existingPercentage) + Number(newPercentageFloat),
      100,
    ).toFixed(2);
    console.log("Updated percentage_watched (cumulative):", updatedPercentage);

    const updatedCreatedAt = new Date().toISOString(); // Current timestamp
    console.log("Updated created_at timestamp:", updatedCreatedAt);

    // Step 2: Prepare the data to upsert
    const watchHistoryData = {
      user_id,
      media_type,
      media_id,
      time_spent: new_time_spent,
      percentage_watched: updatedPercentage,
      season_number: normalizedSeasonNumber,
      episode_number: normalizedEpisodeNumber,
      created_at: updatedCreatedAt,
    };
    console.log("Prepared watch history data for upsert:", watchHistoryData);

    // Step 3: Perform the upsert operation
    console.log("Performing upsert operation...");
    const { data, error } = await supabase
      .from("watch_history")
      .upsert(watchHistoryData, {
        onConflict: "user_id,media_type,media_id,season_number,episode_number",
      })
      .select();

    if (error) {
      console.error("Error during upsert operation:", error.message);
      throw new Error(error.message);
    }

    console.log("Upsert successful. Returned data:", data);

    return { success: true, action: "upserted", data };
  } catch (error) {
    console.error("Error in upsertWatchHistory:", error);
    throw error;
  }
};

export const getWatchHistoryForUser = async (
  user_id: string,
  limit: number,
  offset: number,
) => {
  try {
    const { data, error } = await supabase.rpc("get_watch_history_for_user", {
      p_user_id: user_id,
      p_limit: limit,
      p_offset: offset,
    });

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

export async function isMediaWatched(
  userId: string,
  mediaType: string,
  mediaId: number,
): Promise<boolean> {
  try {
    // Call the SQL function `is_item_watched`
    const { data, error } = await supabase.rpc("is_item_watched", {
      input_user_id: userId,
      input_media_type: mediaType,
      input_media_id: mediaId,
    });

    if (error) {
      console.error("Error calling is_item_watched:", error);
      return false;
    }

    return data ?? false; // Return the result or `false` if null
  } catch (err) {
    console.error("Unexpected error:", err);
    return false;
  }
}

export async function getBatchWatchedItemsForUser(
  userId: string,
  batch: any[],
) {
  try {
    // Create the batch payload in the format { media_type, media_id }
    const batchPayload = batch.map((item) => ({
      media_type: item.media_type,
      media_id: item.id,
    }));

    console.log(batchPayload);

    // Call the Supabase function
    const { data, error } = await supabase.rpc("get_batch_watched_items", {
      input_user_id: userId,
      input_items: batchPayload,
    });

    if (error) {
      console.error("Error fetching batch watched items:", error);
      return [];
    }
    console.log(data);
    return data; // Return the watched items array
  } catch (err) {
    console.error("Unexpected error in getBatchWatchedItemsForUser:", err);
    return [];
  }
}

export const getWatchTime = async (
  user_id: string,
  media_type: string,
  media_id: number,
  season_number?: number | null,
  episode_number?: number | null,
) => {
  try {
    const { data, error } = await supabase.rpc("get_percentage_watched", {
      p_user_id: user_id,
      p_media_type: media_type,
      p_media_id: media_id,
      p_season_number: season_number || null,
      p_episode_number: episode_number || null,
    });

    return data;
  } catch (error) {
    console.log("Error in getWatchTime:", error);
  }
};

export const addToWatchList = async (
  user_id: string,
  media_type: string,
  media_id: number,
  watch_list_type: string,
) => {
  try {
    // Call the PostgreSQL function instead of direct insert
    const { data, error } = await supabase.rpc("add_to_watch_list", {
      p_user_id: user_id,
      p_media_type: media_type,
      p_media_id: media_id,
      p_watch_list_type: watch_list_type,
    });
    return data;
  } catch (error) {
    console.log("Catch Error:", error);
  }
};

export const getWatchLaterForUser = async (
  user_id: string,
  limit: number,
  offset: number,
) => {
  try {
    const { data, error } = await supabase.rpc("get_watch_later", {
      p_user_id: user_id,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      console.error("Error fetching watch later:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error in getWatchHistoryForUser:", error);
    throw error;
  }
};

export const getWatchListFull = async (
  user_id: string,
  limit: number,
  offset: number,
) => {
  try {
    const { data, error } = await supabase.rpc("get_watch_list_full", {
      p_user_id: user_id,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      console.error("Error fetching watch later:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error in getWatchHistoryForUser:", error);
    throw error;
  }
};

export const getWatchListSpecific = async (
  user_id: string,
  limit: number,
  offset: number,
  watch_list_type: string,
) => {
  try {
    const { data, error } = await supabase.rpc("get_watch_list_specific", {
      p_user_id: user_id,
      p_limit: limit,
      p_offset: offset,
      p_watch_list_type: watch_list_type,
    });

    if (error) {
      console.error("Error fetching watch later:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error in getWatchHistoryForUser:", error);
    throw error;
  }
};

export const getTopMovieGenresForUser = async (user_id: string) => {
  try {
    const { data, error } = await supabase.rpc(
      "get_top_movie_genres_for_user",
      {
        p_user_id: user_id,
      },
    );

    if (error) {
      console.error("Error fetching watch later:", error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("Error in getWatchHistoryForUser:", error);
    throw error;
  }
};

export const getTopTvGenresForUser = async (user_id: string) => {
  try {
    const { data, error } = await supabase.rpc("get_top_tv_genres_for_user", {
      p_user_id: user_id,
    });

    if (error) {
      console.error("Error fetching watch later:", error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("Error in getWatchHistoryForUser:", error);
    throw error;
  }
};

interface UpdateGenreStatsParams {
  genreIds: bigint[];
  mediaType: string;
  userId: string;
}

export async function updateGenreStats({
  genreIds,
  mediaType,
  userId,
}: UpdateGenreStatsParams) {
  const { data, error } = await supabase.rpc("update_genre_stats", {
    genre_ids: genreIds,
    media_type: mediaType,
    user_id: userId,
  });

  if (error) {
    console.error("Error updating genre stats:", error);
    throw new Error("Failed to update genre stats");
  } else {
    console.log("added genres");
  }

  return data;
}

type Episode = {
  media_id: number;
  media_type: string;
  season_number: number;
  episode_number: number;
  next_episode: boolean; // Indicates if this is the next episode
  next_season_number?: number | null;
  next_episode_number?: number | null;
};

export const getNextEpisodes = async (userId: string): Promise<Episode[]> => {
  const { data, error } = await supabase.rpc("get_next_episodes", {
    user_id_input: userId,
  });

  if (error) {
    console.error("Error fetching next episodes:", error);
    throw new Error("Failed to fetch next episodes");
  }

  return data as Episode[];
};
