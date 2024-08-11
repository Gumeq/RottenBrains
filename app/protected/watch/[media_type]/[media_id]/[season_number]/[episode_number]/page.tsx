import ExploreTab from "@/components/explore/ExploreTab";
import ScrollButtons from "@/components/explore/ScrollButtons";
import GoBackArrow from "@/components/GoBackArrow";
import VideoEmbed from "@/components/MediaEmbed";
import MediaInfoComponent from "@/components/MediaInfoComponent";
import HomePostCard from "@/components/post/HomePostCard";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import TVShowDetails from "@/components/TVSeasons";
import WatchDuration from "@/components/WatchDuration";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getPostsOfMedia, upsertWatchHistory } from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import { getMediaDetails } from "@/utils/tmdb";

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

	const user = await getCurrentUser();

	let postsOfMedia: any = [];
	if (user) {
		postsOfMedia = await getPostsOfMedia(
			user.user.id,
			media_type,
			media_id,
			0
		);
	}

	const media = await getMediaDetails(media_type, media_id);

	console.log(episode_number);

	return (
		<>
			{user && (
				<WatchDuration
					media_type={media_type}
					media_id={media_id}
					season_number={season_number}
					episode_number={episode_number}
					user_id={user.user.id}
					media_duration={media.runtime || 100}
				/>
			)}
			<div className=" lg:max-w-[1700px] lg:w-[95vw] w-screen mx-auto flex flex-col relative z-10 lg:mt-16 mb-16">
				<div className="w-screen h-16 bg-background flex-row gap-4 flex lg:hidden z-20 items-center px-4 fixed">
					<GoBackArrow />
					<p className="truncate text-lg">
						Watch {media.title || media.name}
					</p>
				</div>
				<div className="flex md:flex-row flex-col gap-4 mt-16 lg:mt-4">
					<div className="lg:w-[75%] flex flex-col gap-4">
						<VideoEmbed
							media_type={media_type}
							media_id={media_id}
							season_number={season_number}
							episode_number={episode_number}
						></VideoEmbed>
						<div className="">
							{postsOfMedia && (
								<div>
									{postsOfMedia.length > 0 && (
										<div className="flex flex-col gap-4">
											<div className="flex flex-row items-center justify-between">
												<div className="flex flex-row gap-2 items-center">
													{/* <div className="w-[24px] h-[24px] rounded-full bg-accent "></div> */}
													<h2 className="text-xl font-bold">
														User posts
													</h2>
												</div>
												<ScrollButtons
													containerId="user_posts"
													scrollPercent={30}
												></ScrollButtons>
											</div>
											<div className="relative">
												<div className="gradient-edge absolute w-[5%] h-full top-0 right-0 z-10"></div>
												<div
													className="lg:flex hidden flex-row flex-nowrap overflow-x-auto gap-4 pb-2 hidden-scrollbar"
													id="user_posts"
												>
													{postsOfMedia
														?.slice(0, 9)
														.map((post: any) => (
															<div>
																<HomePostCardNew
																	post={post}
																></HomePostCardNew>
															</div>
														))}
												</div>
												<div
													className="lg:hidden flex flex-row flex-nowrap overflow-x-auto gap-4 pb-2 hidden-scrollbar"
													id="user_posts"
												>
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
										</div>
									)}
								</div>
							)}
						</div>
					</div>
					<div className="md:w-[25%]">
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

{
	/* <div className="md:w-[25%] h-full">
	<div>
		{media_type === "tv" && season_number && (
			<TVShowDetails
				tv_show_id={media_id}
				season_number={season_number}
			></TVShowDetails>
		)}
	</div>
</div>; */
}
