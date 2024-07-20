import ExploreCard from "@/components/explore/ExploreCard";
import HomePostCard from "@/components/post/HomePostCard";
import YouTubeEmbed from "@/components/YoutubeEmbed";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getPostsOfMedia } from "@/utils/supabase/queries";
import {
	getMediaDetails,
	getRecommendations,
	getReviews,
	getSimilar,
	getVideos,
} from "@/utils/tmdb";
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
	params: { media_type: string; media_id: any };
}) {
	const media_id = parseInt(params.media_id, 10);
	const media_type = params.media_type;
	let mediaData;
	try {
		mediaData = await getMediaDetails(media_type, media_id);
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
		<div className="flex flex-col mx-auto md:max-w-7xl max-w-screen w-screen ">
			<div className="w-full flex flex-col md:flex-row gap-2 md:gap-0 rounded-xl items-center mb-4">
				<div className="min-w-[300px] min-h-[450px] rounded-[8px] overflow-hidden drop-shadow-2xl">
					<div className="absolute p-2 text-lg m-2 font-bold bg-background/50 backdrop-blur flex flex-row gap-2 items-center justify-center rounded-[6px]">
						<img
							src="/assets/icons/star-solid.svg"
							alt=""
							width={20}
							height={20}
							className="invert-on-dark"
							loading="lazy"
						/>
						<p>{media.vote_average.toFixed(1)}</p>
					</div>
					<img
						src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
						alt=""
						width="300"
						height="450"
					/>
				</div>
				<div className="w-full md:h-5/6 bg-foreground/10 md:rounded-r-[8px] relative">
					<div className="flex flex-col p-8 text-foreground/70 gap-2 w-full ">
						<p className="text-2xl font-bold py-2 text-foreground">
							{media.title || media.name}{" "}
							<span className="text-foreground/50">
								(
								{(media.release_date &&
									media.release_date.slice(0, 4)) ||
									media.first_air_date.slice(0, 4)}
								)
							</span>
						</p>
						<p className="italic text-foreground/70 text-lg">
							{media.tagline}
						</p>
						<p className="py-2 max-w-[90%]">{media.overview}</p>
						<p>
							Genre:{" "}
							{media.genres
								.map((genre: any) => genre.name)
								.join(", ")}
						</p>
						<div>
							{media.number_of_seasons && (
								<p className="">
									Seasons: {media.number_of_seasons}
								</p>
							)}
						</div>
						<div>
							{media_type === "movie" ? (
								<div>
									<Link
										href={`/protected/watch/${media_type}/${media_id}`}
										className="absolute bottom-0 right-0 m-4 px-4 py-2 bg-accent/80 font-bold rounded-[4px]"
									>
										Watch Now
									</Link>
								</div>
							) : (
								<div>
									<Link
										className="absolute bottom-0 right-0 m-4 px-4 py-2 bg-accent/80 font-bold rounded-[4px]"
										href={`/protected/watch/${media_type}/${media_id}/1/1`}
									>
										Watch Now
									</Link>
								</div>
							)}
						</div>

						<Link
							className="absolute top-0 right-0 m-4 font-bold rounded-[4px]"
							href={`/protected/create-post/${media_type}/${media_id}`}
						>
							<img
								src="/assets/icons/square-plus-regular.svg"
								alt=""
								width={30}
								height={30}
								className="invert-on-dark opacity-80"
							/>
						</Link>
					</div>
				</div>
			</div>
			<div className="">
				<div className="bg-accent/5 p-4 rounded-xl">
					<h2 className="text-xl font-bold">Videos</h2>
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
				</div>
				<div className="">
					{postsOfMedia && (
						<div>
							{postsOfMedia.length > 0 && (
								<h2 className="text-xl font-bold py-4 ">
									User Posts
								</h2>
							)}
							<div className="flex flex-row flex-wrap gap-4">
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
				<div className="max-w-7xl w-screen border-2 border-dotted border-accent p-4 my-4 rounded-xl">
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
