"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

type PostLikedNumberProps = {
	postId: string;
};

const PostLikedNumber: React.FC<PostLikedNumberProps> = ({ postId }) => {
	const [likes, setLikes] = useState<number>(0);
	const supabase = createClient();

	useEffect(() => {
		// Fetch initial data
		const getLikes = async () => {
			const { data, error } = await supabase
				.from("posts")
				.select("total_likes")
				.eq("id", postId)
				.single();

			if (error) {
				console.error("Error fetching post likes:", error);
			} else {
				setLikes(data.total_likes || 0);
			}
		};

		getLikes();

		// Subscribe to real-time updates
		// Subscribe to changes in total_likes
		const channel = supabase
			.channel(`public:posts:id=eq.${postId}`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "posts",
					filter: `id=eq.${postId}`,
				},
				(payload) => {
					setLikes(payload.new.total_likes);
				}
			)
			.subscribe();

		// Cleanup subscription on component unmount
		return () => {
			supabase.removeChannel(channel);
		};
	}, [postId]);

	return <span>{likes}</span>;
};

export default PostLikedNumber;
