import ExploreCard from "@/components/explore/ExploreCard";
import HomePostCard from "@/components/post/HomePostCard";
import YouTubeEmbed from "@/components/YoutubeEmbed";
import { getExploreData, getMediaData } from "@/utils/clientFunctions";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getPostsOfMedia } from "@/utils/supabase/queries";
import {
	getRecommendations,
	getReviews,
	getSimilar,
	getVideos,
} from "@/utils/tmdb";
import { divide } from "lodash";
import Image from "next/image";

export default async function mediaPage({
	params,
}: {
	params: { media_type: string; media_id: any };
}) {
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
		return <h1>No Media Found</h1>;
	}

	const postsOfMedia = await getPostsOfMedia(media_id, media_type);
	const mediaVideos = await getVideos(media_type, media_id);
	const mediaRecommendations = await getRecommendations(media_type, media_id);
	const mediaSimilar = await getSimilar(media_type, media_id);
	const mediaReviews = await getReviews(media_type, media_id);

	return (
		<div className="flex flex-col mx-auto max-w-7xl w-[1500px]">
			<div className="flex flex-col md:flex-row gap-8  p-4 md:p-8 rounded-[20px] ">
				<div className="w-[300px] h-[450px] bg-foreground/10 rounded-[12px] overflow-hidden mx-auto">
					<Image
						src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
						alt=""
						width={300}
						height={450}
					></Image>
				</div>
				<div className=" flex flex-col gap-8 max-w-3xl">
					<div className="flex flex-col gap-2">
						<h1 className="text-4xl font-bold py-2">
							{media.title || media.name}{" "}
							<span className="text-2xl text-foreground/50">
								(
								{(media.release_date &&
									media.release_date.slice(0, 4)) ||
									media.first_air_date.slice(0, 4)}
								)
							</span>
						</h1>
						<div>
							{media.number_of_seasons && (
								<p className="text-2xl text-foreground/70">
									{media.number_of_seasons} Seasons
								</p>
							)}
						</div>
					</div>

					<div className="flex flex-row gap-4 flex-wrap">
						{media?.genres.map((genre: any) => (
							<div
								key={genre.id}
								className="py-2 px-4 bg-foreground/5 rounded-full"
							>
								<p>{genre.name}</p>
							</div>
						))}
					</div>
					<div>
						<p className="italic text-foreground/70 text-lg">
							{media.tagline}
						</p>
					</div>
					<div>
						<h2 className="text-xl pb-2 font-semibold">Overview</h2>
						<p className="max-w-full lg:w-[1000px]">
							{media.overview}
						</p>
					</div>
					<div>
						{media.next_episode_to_air && (
							<div>
								<div className="flex flex-row gap-2 items-center text-xl font-bold py-4">
									<h2 className="">Next Episode:</h2>
									<p>{media.next_episode_to_air.air_date}</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<div></div>
			<div className="">
				<h2 className="text-xl font-bold pt-4">Videos</h2>
				<div className="flex flex-col md:flex-row gap-4 py-4 items-center justify-center">
					{mediaVideos &&
						mediaVideos.results
							.slice(0, 3)
							.map((video: any) => (
								<YouTubeEmbed
									videoId={video.key}
								></YouTubeEmbed>
							))}
				</div>
				<div className=" py-4  ">
					{postsOfMedia && (
						<div>
							{postsOfMedia.length > 0 && (
								<h2 className="text-xl font-bold py-4 ">
									User Posts
								</h2>
							)}
							<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center gap-4 p-2">
								{postsOfMedia?.slice(0, 9).map((post: any) => (
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
				<h2 className="text-xl font-bold pt-4">Recommended</h2>
				<div className="max-w-7xl w-screen">
					<div className="flex flex-row overflow-x-auto gap-2 invisible-scroll custom-scrollbar">
						{mediaRecommendations &&
							mediaRecommendations.results
								.slice(0, 20)
								.map((media: any) => (
									<div>
										<ExploreCard
											media={media}
										></ExploreCard>
									</div>
								))}
					</div>
				</div>
				<h2 className="text-xl font-bold pt-4">You might like</h2>
				<div className="max-w-7xl w-screen">
					<div className="flex flex-row overflow-x-auto gap-2 invisible-scroll custom-scrollbar">
						{mediaSimilar &&
							mediaSimilar.results
								.slice(0, 20)
								.map((media: any) => (
									<div>
										<ExploreCard
											media={media}
										></ExploreCard>
									</div>
								))}
					</div>
				</div>
				<div className="max-w-7xl w-screen">
					<div className="flex  flex-col gap-2 invisible-scroll custom-scrollbar">
						{mediaReviews && (
							<div>
								<h2 className="text-xl font-bold pt-4">
									Reviews
								</h2>
								{mediaReviews.results
									.slice(0, 2)
									.map((review: any) => (
										<div>
											<div className="max-h-[200px]  p-2 overflow-y-auto custom-scrollbar">
												<h3 className="font-bold text-lg py-2">
													{review.author}
												</h3>
												<p>"{review.content}"</p>
											</div>
										</div>
									))}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className=" h-[500px]"></div>
		</div>
	);
}
