import PostForm from "@/components/frorms/PostForm";
import GoBackArrow from "@/components/GoBackArrow";
import { getPostById } from "@/utils/supabase/queries";
import React from "react";

export default async function Page({
	params,
}: {
	params: { media_type: string; media_id: string };
}) {
	const media_id = params.media_id;
	const media_type = params.media_type;
	const media = { media_id: media_id, media_type: media_type };
	return (
		<div className="w-screen">
			<div className="w-screen h-16 bg-white/10 flex-row gap-4 flex lg:hidden z-20 relative items-center px-4">
				<GoBackArrow />
				<p className="truncate text-lg">Create post</p>
			</div>
			<PostForm action="Create" from_media={media}></PostForm>
		</div>
	);
}
