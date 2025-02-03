import {
  getPostByIdNew,
  getPostsFromFollowedUsers,
} from "../supabase/serverQueries";
import { fetchMediaData } from "./fetchMediaData";

export async function fetchPostsData(user_id: string) {
  const posts = await getPostsFromFollowedUsers(user_id);
  const posts_media_data = await Promise.all(
    posts.map(async (post: any) => {
      const media_data = await fetchMediaData(
        post.post.media_id,
        post.post.media_type,
      );
      return { post_data: post, media_data: media_data };
    }),
  );
  return posts_media_data;
}

export async function fetchPostById(post_id: string, current_user_id?: string) {
  const post = await getPostByIdNew(post_id, current_user_id);
  const posts_media_data = await fetchMediaData(
    post.post.media_id,
    post.post.media_type,
  );
  return { post_data: post, media_data: posts_media_data };
}
