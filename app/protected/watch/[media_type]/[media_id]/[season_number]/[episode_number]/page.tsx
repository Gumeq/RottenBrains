import ExploreTab from "@/components/explore/ExploreTab";
import VideoEmbed from "@/components/MediaEmbed";
import MediaInfoComponent from "@/components/MediaInfoComponent";
import HomePostCard from "@/components/post/HomePostCard";
import TVShowDetails from "@/components/TVSeasons";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getPostsOfMedia } from "@/utils/supabase/queries";

export async function generateMetadata({ params }: any) {
	const media_id = parseInt(params.media_id, 10);
	const media_type = params.media_type;

	let mediaData;
	try {
		mediaData = await fetchMediaData(media_type, media_id);
	} catch (error) {
		console.error("Error fetching media data:", error);
		mediaData = null;
	}
	const media = mediaData;

	if (!media) {
		return {
			title: "No Media Found",
			description:
				"Connect with fellow enthusiasts and dive deep into your favorite media.",
		};
	}

	return {
		title: `${media.title || media.name} - RottenBrains`,
		description: `${media.overview}`,
	};
}

export default async function mediaPage({
	params,
}: {
	params: {
		media_type: string;
		media_id: number;
		season_number: number;
		episode_number: number;
	};
}) {
	const media_id = params.media_id;
	const media_type = params.media_type;
	const season_number = params.season_number;
	const episode_number = params.episode_number;

	const postsOfMedia = await getPostsOfMedia(media_id, media_type);

	return (
		<>
			<div className=" max-w-[1800px] w-screen h-full mx-auto flex flex-col px-4">
				<div className="w-full p-2 text-center bg-accent flex items-center justify-center font-bold rounded-xl my-2">
					For the best experience use an adBlocker!
				</div>
				<div className="flex md:flex-row flex-col gap-4">
					<div className="md:w-[75%] flex flex-col gap-4">
						<VideoEmbed
							media_type={media_type}
							media_id={media_id}
							season_number={season_number}
							episode_number={episode_number}
						></VideoEmbed>
						<div>
							<MediaInfoComponent
								media_type={media_type}
								media_id={media_id}
							></MediaInfoComponent>
						</div>
						<div className="">
							{postsOfMedia && (
								<div>
									{postsOfMedia.length > 0 && (
										<h2 className="text-xl font-bold">
											User Posts
										</h2>
									)}
									<div className="w-1/6 h-[5px] bg-accent rounded-full mb-4 "></div>
									<div className="flex flex-row flex-nowrap overflow-x-auto gap-2 pb-4 custom scrollbar">
										{postsOfMedia
											?.slice(0, 9)
											.map((post: any) => (
												<div>
													<HomePostCard
														post={post}
													></HomePostCard>
												</div>
											))}
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="md:w-[25%] h-full">
						<div>
							{media_type === "tv" && season_number && (
								<TVShowDetails
									tv_show_id={media_id}
									season_number={season_number}
								></TVShowDetails>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
