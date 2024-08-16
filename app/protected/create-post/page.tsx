import PostForm from "@/components/frorms/PostForm";
import GoBackArrow from "@/components/GoBackArrow";
import React from "react";

const page = () => {
  return (
    <div className="w-full">
      <div className="relative z-20 flex h-16 w-screen flex-row items-center gap-4 bg-background px-4 lg:hidden">
        <GoBackArrow />
        <p className="truncate text-lg">Create post</p>
      </div>
      <PostForm action="Create"></PostForm>
    </div>
  );
};

export default page;
