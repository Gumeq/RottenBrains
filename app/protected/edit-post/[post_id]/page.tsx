import PostForm from "@/components/frorms/PostForm";
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
			<PostForm action="Update" post={post}></PostForm>
		</div>
	);
}
