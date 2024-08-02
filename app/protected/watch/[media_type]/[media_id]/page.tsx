import ExploreTab from "@/components/explore/ExploreTab";
import GoBackArrow from "@/components/GoBackArrow";
import VideoEmbed from "@/components/MediaEmbed";
import MediaInfoComponent from "@/components/MediaInfoComponent";
import HomePostCard from "@/components/post/HomePostCard";
import RecommendedCard from "@/components/RecommendedCard";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getPostsOfMedia } from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import { getMediaDetails, getRecommendations } from "@/utils/tmdb";
import Link from "next/link";

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
	params: { media_type: string; media_id: number };
}) {
	const media_id = params.media_id;
	const media_type = params.media_type;

	const user = await getCurrentUser();

	let postsOfMedia: any = [];
	if (user) {
		postsOfMedia = await getPostsOfMedia(
			user.user.id,
			media_type,
			media_id,
			0
		);
		console.log(postsOfMedia);
	}
	const recommendations = await getRecommendations(media_type, media_id);
	const media = await getMediaDetails(media_type, media_id);
	return (
		<>
			<div>
				<img
					src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
					alt=""
					className="w-screen lg:h-[150vh] h-[300vh] object-cover blur-[100px] absolute top-0 mask2 opacity-30 overflow-hidden"
				/>
			</div>
			<div className=" lg:max-w-[80vw] w-screen h-full mx-auto flex flex-col relative z-10">
				<div className="w-screen h-16 bg-white/10 flex-row gap-4 flex lg:hidden z-20 items-center px-4 fixed backdrop-blur-xl">
					<GoBackArrow />
					<p className="truncate text-lg">
						Watch {media.title || media.name}
					</p>
				</div>
				<div className="w-full p-2 text-center bg-accent flex items-center justify-center font-bold lg:rounded-xl my-2 px-2 mt-16 lg:mt-2">
					For the best experience use an adBlocker!
				</div>
				<div className="flex md:flex-row flex-col gap-4 px-2">
					<div className="lg:w-[75%] flex flex-col gap-4">
						<VideoEmbed
							media_type={media_type}
							media_id={media_id}
						></VideoEmbed>
						{/* <div>
							<MediaInfoComponent
								media_type={media_type}
								media_id={media_id}
							></MediaInfoComponent>
						</div> */}
						<div className="">
							{postsOfMedia && (
								<div>
									{postsOfMedia.length > 0 && (
										<h2 className="text-xl font-bold">
											User Posts
										</h2>
									)}
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
					<div className="md:w-[25%] lg:h-[75vh] h-full flex flex-col overflow-y-auto custom-scrollbar">
						<p className="text-lg font-bold mb-2">
							Recommendations
						</p>
						{recommendations &&
							recommendations.results.map((media: any) => (
								<Link
									href={
										media.media_type === "movie"
											? `/protected/watch/${media.media_type}/${media.id}`
											: `/protected/watch/${media.media_type}/${media.id}/1/1`
									}
								>
									<RecommendedCard
										media={media}
									></RecommendedCard>
								</Link>
							))}
					</div>
				</div>
			</div>
		</>
	);
}

{
	/* <div className="md:w-[25%] h-full flex flex-col ">
	<p className="text-lg font-bold mb-2">Recommendations</p>
	{recommendations &&
		recommendations.results.map((media: any) => (
			<Link
				href={
					media.media_type === "movie"
						? `/protected/watch/${media.media_type}/${media.id}`
						: `/protected/watch/${media.media_type}/${media.id}/1/1`
				}
			>
				<RecommendedCard media={media}></RecommendedCard>
			</Link>
		))}
</div>; */
}
