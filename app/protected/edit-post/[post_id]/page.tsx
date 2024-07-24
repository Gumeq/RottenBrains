import PostForm from "@/components/frorms/PostForm";
import GoBackArrow from "@/components/GoBackArrow";
import { getPostById } from "@/utils/supabase/queries";
import React from "react";

export default async function Page({
	params,
}: {
	params: { post_id: string };
}) {
	const post_id = params.post_id;

	const post = await getPostById(post_id);

	console.log(post);
	return (
		<div className="w-screen">
			<div className="w-screen h-16 bg-white/10 flex-row gap-4 flex lg:hidden z-20 relative items-center px-4">
				<GoBackArrow />
				<p className="truncate text-lg">Update post</p>
			</div>
			<PostForm action="Update" post={post}></PostForm>
		</div>
	);
}
