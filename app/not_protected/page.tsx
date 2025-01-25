import React from "react";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import { getSinglePost } from "@/utils/supabase/queries";

const page = async () => {
  const user_id = "1e5e1d45-21c2-4866-959d-e582964b08ae";
  const posts = await getSinglePost();
  return (
    <div className="flex min-h-32 w-full flex-row gap-4">
      {posts &&
        posts.map((post) => {
          return (
            <>
              <HomePostCardNew post={post} />
            </>
          );
        })}
    </div>
  );
};

export default page;
