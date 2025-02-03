import ImageWithFallback from "@/components/features/media/ImageWithFallback";
import PostModalFull from "@/components/features/posts/PostModalFul";
import CommentSection from "@/components/features/profile/CommentSection";
import PostModal from "@/components/features/profile/PostModal";
import PostStats from "@/components/features/profile/PostStatsModal";
import UserPosts from "@/components/features/profile/UserPosts";
import ProfilePicture from "@/components/ui/ProfilePicture";
import { fetchPostById } from "@/lib/server/fetchPostsData";
import { getImageUrlFromMediaDetails } from "@/lib/server/helperFunctions";
import { getCurrentUser } from "@/lib/supabase/serverQueries";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

type Params = Promise<{ userId: string }>;
type SearchParams = Promise<{ post_id?: string }>;
export default async function ProtectedPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { userId } = await params;
  const { post_id } = await searchParams;
  const current_user = await getCurrentUser();
  const post_media_data = post_id
    ? await fetchPostById(post_id, current_user.id)
    : null;
  return (
    <>
      {post_id && (
        <>
          {post_media_data ? (
            <PostModalFull
              post_media_data={post_media_data}
              user_id={userId}
            ></PostModalFull>
          ) : (
            <div></div>
          )}
        </>
      )}
      <UserPosts userId={userId}></UserPosts>
    </>
  );
}
