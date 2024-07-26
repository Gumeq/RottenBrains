import ExploreCard from "@/components/explore/ExploreCard";
import GoBackArrow from "@/components/GoBackArrow";
import HomePostCard from "@/components/post/HomePostCard";
import YouTubeEmbed from "@/components/YoutubeEmbed";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getPostsOfMedia } from "@/utils/supabase/queries";
import {
	getMediaCredits,
	getMediaDetails,
	getRecommendations,
	getReviews,
	getSimilar,
	getVideos,
} from "@/utils/tmdb";
import Link from "next/link";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";

function transformRuntime(minutes: number): string {
	const hours: number = Math.floor(minutes / 60);
	const remainingMinutes: number = minutes % 60;

	if (hours > 0) {
		return `${hours} h ${remainingMinutes} m`;
	} else {
		if (remainingMinutes > 0) {
			return `${remainingMinutes} m`;
		} else {
			return "N/A";
		}
	}
}
function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
	}
	return num.toString();
}

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

async function getTrailerOrFirstFive(media_type: string, media_id: number) {
	const mediaVideos = await getVideos(media_type, media_id);

	const trailers = mediaVideos.results.filter(
		(video: any) => video.type === "Trailer"
	);

	if (trailers.length > 0) {
		return trailers;
	} else {
		if (mediaVideos && mediaVideos.length > 0) {
			return mediaVideos.slice(0, 5);
		} else {
			return;
		}
	}
}

async function separateCredits(media_type: string, media_id: number) {
	const mediaCredits = await getMediaCredits(media_type, media_id);

	let directorOrCreator: any | null = null;
	let writers: any[] | null = null;
	let actors: any[] | null = null;

	// Find director or creator
	const director = mediaCredits.crew.find(
		(member: any) => member.job === "Director"
	);
	const creator = mediaCredits.crew.find(
		(member: any) => member.job === "Creator"
	);
	if (director) {
		directorOrCreator = director;
	} else if (creator) {
		directorOrCreator = creator;
	}

	// Find writers
	const writersList = mediaCredits.crew.filter(
		(member: any) => member.department === "Writing"
	);
	if (writersList.length > 0) {
		writers = writersList.map((writer: any) => writer);
	}

	// Find actors
	if (mediaCredits.cast.length > 0) {
		actors = mediaCredits.cast.map((actor: any) => actor);
	}

	return {
		directorOrCreator,
		writers,
		actors,
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
	const trailers = await getTrailerOrFirstFive(media_type, media_id);
	const mediaRecommendations = await getRecommendations(media_type, media_id);
	const mediaSimilar = await getSimilar(media_type, media_id);
	const mediaReviews = await getReviews(media_type, media_id);
	const mediaCredits = await separateCredits(media_type, media_id);

	const watchLink =
		media_type === "movie"
			? `/protected/watch/${media_type}/${media.id}`
			: `/protected/watch/${media_type}/${media.id}/1/1`;

	return (
		<div className="lg:w-screen ">
			<div className="w-screen h-16 bg-foreground/10 flex-row gap-4 flex lg:hidden z-20 relative items-center px-4">
				<GoBackArrow />
				<p className="truncate text-lg">{media.title || media.name}</p>
			</div>
			<div className="">
				<img
					src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
					alt=""
					className="w-screen lg:h-[150vh] h-[300vh] object-cover blur-[100px] absolute top-0 mask2 opacity-30 overflow-hidden bg-black"
				/>
			</div>
			<div className=" relative lg:h-screen h-auto w-screen lg:w-auto py-4 ">
				<div
					className=" relative lg:h-screen h-auto flex w-screen lg:w-auto"
					id="overview"
				>
					<div className="h-full mx-auto flex flex-col lg:gap-8 gap-4 w-screen lg:w-auto px-2 lg:my-8">
						<div className=" flex flex-col gap-4">
							<p className="text-4xl">
								{media.title || media.name}
							</p>
							{media.tagline && (
								<p className="italic opacity-50">
									"{media.tagline}"
								</p>
							)}
							<div className="">
								<div className="flex lg:flex-row flex-col justify-between lg:items-center gap-2 h-full">
									<div className="flex flex-row gap-4 items-center opacity-50">
										<p className="">
											{(media.release_date &&
												media.release_date.slice(
													0,
													4
												)) ||
												media.first_air_date.slice(
													0,
													4
												)}
										</p>
										{media_type === "tv" && (
											<>
												<div className="w-2 h-2 bg-foreground rounded-full"></div>
												<p>
													TV-{media.number_of_seasons}
												</p>
											</>
										)}
										<div className="w-2 h-2 bg-foreground rounded-full"></div>
										<p>
											{media_type === "movie"
												? transformRuntime(
														media.runtime
												  )
												: transformRuntime(
														media.episode_run_time
												  )}
										</p>
									</div>
									<div className="flex flex-row gap-4 items-center justify-between h-full">
										<Link
											href={`/protected/create-post/${media_type}/${media_id}`}
											className=" flex flex-row items-center gap-2 bg-foreground/10 px-6 py-2 rounded-[8px] z-10 hover:scale-105 drop-shadow-lg"
										>
											<img
												src="/assets/icons/star-outline.svg"
												alt=""
												width={20}
												height={20}
												className="invert-on-dark"
												loading="lazy"
											/>
											<p className="text-lg">Rate</p>
										</Link>
										<div className=" bg-foreground/20 flex flex-row items-center gap-2 rounded-[8px] px-6 py-2 drop-shadow-lg">
											<img
												src="/assets/icons/star-solid.svg"
												alt=""
												width={20}
												height={20}
												className="invert-on-dark"
												loading="lazy"
											/>
											<p className="text-foreground/50">
												<span className="text-foreground/100 text-lg">
													{media.vote_average.toFixed(
														1
													)}
												</span>
												/10{" "}
												<span>
													(
													{formatNumber(
														media.vote_count
													)}
													)
												</span>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="lg:h-[45%] h-auto flex lg:flex-row flex-col lg:gap-8 gap-4 ">
							<div className="h-full   ">
								<img
									src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
									alt=""
									className="h-full rounded-[4px] drop-shadow-lg"
								/>
							</div>
							<div className="h-full relative">
								<Link
									className="absolute bottom-0 m-4 flex flex-row z-10 bg-black/20 backdrop-blur-lg items-center gap-2  px-6 py-2 rounded-[8px] hover:scale-105 drop-shadow-lg"
									href={watchLink}
								>
									<img
										src="/assets/icons/play-solid.svg"
										alt=""
										className="w-[20px] h-[20px] invert"
									/>
									<p className="text-white">Watch</p>
								</Link>
								<img
									src={`https://image.tmdb.org/t/p/w1280${media.backdrop_path}`}
									alt=""
									className="h-full rounded-[4px] drop-shadow-lg "
								/>
							</div>
						</div>
						<div className=" px-2 flex flex-row gap-4 lg:w-auto w-full">
							<div className="flex flex-col gap-4">
								<div className="flex flex-row items-center gap-4 ">
									<p className="font-bold text-xl text-foreground/50 w-[100px]">
										Genre
									</p>
									<div className="flex flex-row gap-2 xl:w-[600px] lg:w-[300px] w-[60vw] flex-wrap">
										{mediaData.genres.map((genre: any) => (
											<div className="px-6 py-2 bg-foreground/20 rounded-full text-center flex items-center">
												{genre.name}
											</div>
										))}
									</div>
								</div>
								<div className="flex flex-row gap-4">
									<p className="font-bold text-xl text-wrap text-foreground/50 w-[100px]">
										Plot
									</p>
									<p className="xl:w-[600px] lg:w-[300px] w-[60vw]">
										{mediaData.overview}
									</p>
								</div>

								<div className="flex flex-row gap-4 ">
									<p className="font-bold text-xl text-foreground/50 w-[100px]">
										{media_type === "movie"
											? "Director"
											: "Creator"}
									</p>
									<div className="xl:w-[600px] lg:w-[300px] w-[60vw]">
										{media_type === "movie"
											? mediaCredits.directorOrCreator
													?.name
											: mediaData.created_by[0]?.name}
									</div>
								</div>

								<div className="flex flex-row gap-4 ">
									<p className="font-bold text-xl text-foreground/50 w-[100px]">
										Writers
									</p>
									<p className="xl:w-[600px] lg:w-[300px] w-[60vw]">
										<div className="flex flex-row">
											{mediaCredits.writers
												? mediaCredits.writers
														.slice(0, 5)
														.map(
															(writer, index) => (
																<Link
																	href={`/protected/person/${writer.id}`}
																	key={index}
																>
																	{
																		writer.name
																	}
																	,{" "}
																</Link>
															)
														)
												: "N/A"}
										</div>
									</p>
								</div>

								<div className="flex flex-row gap-4">
									<p className="font-bold text-xl text-foreground/50 w-[100px]">
										Stars
									</p>
									<div className="xl:w-[600px] lg:w-[300px] w-[60vw]">
										{mediaCredits.actors
											? mediaCredits.actors
													.slice(0, 5)
													.map((actor, index) => (
														<Link
															href={`/protected/person/${actor.id}`}
															key={index}
														>
															{actor.name},{" "}
														</Link>
													))
											: "N/A"}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="lg:w-[75vw] w-screen mx-auto relative lg:-mt-[10vh] p-2 lg:p-0 flex flex-col gap-8">
				<div className="">
					<h2 className="text-xl font-bold" id="videos">
						Videos
					</h2>
					<div className="flex gap-4 py-4 items-center overflow-x-auto whitespace-nowrap custom-scrollbar">
						{mediaVideos &&
							mediaVideos.results
								.slice(0, 10)
								.map((video: any) => (
									<div className="inline-block">
										<YouTubeEmbed
											videoId={video.key}
											key={video.key}
										></YouTubeEmbed>
									</div>
								))}
					</div>
				</div>
				<div className="">
					{postsOfMedia && (
						<div>
							{postsOfMedia.length > 0 && (
								<div className="flex flex-row gap-2 items-center my-2">
									<div className="w-2 h-2 bg-accent rounded-full"></div>
									<h1 className="text-xl font-bold">
										User Posts
									</h1>
								</div>
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
				<div className="flex flex-row gap-2 items-center my-2">
					<div className="w-2 h-2 bg-accent rounded-full"></div>
					<h1 className="text-xl font-bold">Recommended</h1>
				</div>
				<div className="">
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
				<div className="flex flex-row gap-2 items-center my-2">
					<div className="w-2 h-2 bg-accent rounded-full"></div>
					<h1 className="text-xl font-bold">You might like</h1>
				</div>
				<div className="">
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
				{/* <div className="max-w-7xl w-screen border-2 border-dotted border-accent p-4 my-4 rounded-xl">
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
				</div> */}
			</div>
			<div className=" h-[500px]"></div>
		</div>
	);
}
