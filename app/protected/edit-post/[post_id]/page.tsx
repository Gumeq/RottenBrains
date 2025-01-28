import PostForm from "@/components/frorms/PostForm";
import GoBackArrow from "@/components/GoBackArrow";
import { getPostById } from "@/utils/supabase/serverQueries";
import React from "react";

type Params = Promise<{ post_id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { post_id } = await params;

  const post = await getPostById(post_id);

  return (
    <div className="w-screen">
      <div className="relative z-20 flex h-16 w-screen flex-row items-center gap-4 bg-white/10 px-4 lg:hidden">
        <GoBackArrow />
        <p className="truncate text-lg">Update post</p>
      </div>
      <PostForm action="Update" post={post}></PostForm>
    </div>
  );
}
