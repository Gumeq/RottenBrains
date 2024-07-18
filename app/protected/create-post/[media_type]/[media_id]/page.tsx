import PostForm from "@/components/frorms/PostForm";
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
			<PostForm action="Create" from_media={media}></PostForm>
		</div>
	);
}
