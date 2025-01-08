import { fetchBlogPosts } from "@/utils/supabase/queries";
import React from "react";
import PostCardMain from "./PostCardMain";

const page = async () => {
  const posts = await fetchBlogPosts();
  console.log(posts);
  return (
    <div className="w-full">
      <div className="relative aspect-[10/1] w-full overflow-hidden bg-black">
        <img
          src="/assets/images/blog-bg-pattern.png"
          alt=""
          className="invert-on-dark absolute inset-0 h-full w-full object-cover opacity-5"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-full w-full max-w-[1500px] items-center justify-between p-4">
            <div>
              <h1 className="text-2xl font-bold">
                RottenBrains Developer Blog
              </h1>
              <h2 className="text-xl opacity-80">
                Bugs, news, code and more bugs.
              </h2>
            </div>
            <div className="w-1/3 bg-secondary p-4 text-lg">
              <h3>
                Welcome to the RottenBrains Developer Blog (Beta). Where you can
                find all the news about the website, my perfect coding skills
                and me slowly losing my sanity with databases.
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1500px] flex-row bg-foreground/5">
        <div className="w-2/3 p-4">
          <h4 className="mb-6 text-xl font-semibold">Latest Posts</h4>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
            {posts &&
              posts.length > 0 &&
              posts.map((post) => <PostCardMain key={post.id} post={post} />)}
          </div>
        </div>
        <div className="w-1/3 p-4">
          <h4 className="mb-6 text-xl font-semibold">More Stuff</h4>
        </div>
      </div>
    </div>
  );
};

export default page;

// return <Link href={"blog/8672ffad-d86d-4c58-bed8-cc8fc8f66729"}>BLOG</Link>;
