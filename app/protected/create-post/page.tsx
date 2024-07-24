import PostForm from "@/components/frorms/PostForm";
import GoBackArrow from "@/components/GoBackArrow";
import React from "react";

const page = () => {
	return (
		<div className="w-screen">
			<div className="w-screen h-16 bg-white/10 flex-row gap-4 flex lg:hidden z-20 relative items-center px-4">
				<GoBackArrow />
				<p className="truncate text-lg">Create post</p>
			</div>
			<PostForm action="Create"></PostForm>
		</div>
	);
};

export default page;
