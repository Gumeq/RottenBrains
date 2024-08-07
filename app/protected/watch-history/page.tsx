import { getWatchHistoryForUser } from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import React from "react";
import MediaCard from "./media_card";

const page = async () => {
	const user = await getCurrentUser();
	console.log(user);
	const limit = 10;
	const offset = 0;
	const watchHistory = await getWatchHistoryForUser(
		user.user.id,
		limit,
		offset
	);
	return (
		<div className="w-screen mt-16 max-w-4xl mx-auto">
			<h1 className="font-bold text-4xl my-12">Watch History</h1>
			<div className="w-full flex flex-col gap-4">
				{watchHistory.map((media: any) => {
					console.log(media);
					return (
						<MediaCard
							media_type={media.media_type}
							media_id={media.media_id}
							season_number={media.season_number}
							episode_number={media.episode_number}
						></MediaCard>
					);
				})}
			</div>
		</div>
	);
};

export default page;
