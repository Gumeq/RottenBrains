import {
	getNewestUsers,
	getWatchHistoryForUser,
} from "@/utils/supabase/queries";
import LoadMore from "./LoadMore";
import Link from "next/link";
import FollowButton from "@/components/post/FollowButton";
import { fetchVidsrc } from "@/utils/vidsrc";
import { fetchMediaDetails } from "@/utils/tmdb";
import ProfilePicture from "@/components/ProfilePicture";
import { cancelFrame } from "framer-motion";
import {
	getCurrentUser,
	getPostsFromFollowedUsers,
} from "@/utils/supabase/serverQueries";
import HomeMediaCard from "./HomeMediaCard";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import ExploreTab from "@/components/explore/ExploreTab";
import { fetchExploreData } from "@/utils/clientFunctions/fetchExploreData";
import HomeMediaCardDisplay from "./HomeMediaCardDisplay";
import HomePostCard from "@/components/post/HomePostCard";

async function fetchMoviesAndTvDetails() {
	const { dataMovies, dataTv, dataEpisodes } = await fetchVidsrc();

	if (dataMovies && dataTv && dataEpisodes) {
		const newMovies = dataMovies.result;
		const newTvShows = dataTv.result;
		const newEpisodes = dataEpisodes.result;

		const movieDetailsArray = newMovies.map((item: any) => ({
			tmdb_id: item.tmdb_id,
			type: "movie",
		}));

		const tvDetailsArray = newTvShows.map((item: any) => ({
			tmdb_id: item.tmdb_id,
			type: "tv",
		}));

		const episodesDetailsArray = newEpisodes.map((item: any) => ({
			tmdb_id: item.tmdb_id,
			type: "movie",
		}));

		const movieDetails = await fetchMediaDetails(movieDetailsArray);
		const tvDetails = await fetchMediaDetails(tvDetailsArray);
		// const episodeDetails = await fetchMediaDetails(episodesDetailsArray);

		return { movieDetails, tvDetails };
	} else {
		console.error("Failed to fetch movies or TV shows data.");
		return { movieDetails: [], tvDetails: [] };
	}
}

// Server component fetching and displaying posts
const HomeContent = async () => {
	const users = await getNewestUsers();
	const user = await getCurrentUser();
	if (!user) {
		return;
	}
	// const { movieDetails, tvDetails } = await fetchMoviesAndTvDetails();
	if (!users) {
		return;
	}
	const watchHistory = await getWatchHistoryForUser(user.user.id, 10, 0);
	const followed_posts_one = await getPostsFromFollowedUsers(
		user.user.id.toString(),
		0
	);
	const followed_posts_two = await getPostsFromFollowedUsers(
		user.user.id.toString(),
		1
	);
	const now_in_cinemas = await fetchExploreData("Now_in_cinemas");
	return (
		<div className="flex flex-col gap-4 p-4 lg:w-auto w-screen">
			<div className="flex flex-row gap-2 items-center">
				<img
					src="/assets/icons/history.svg"
					alt=""
					width={24}
					height={24}
					className="invert-on-dark"
				/>
				<h2 className="text-xl font-bold">Your watch history</h2>
			</div>
			<div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 grid-cols-1 gap-4">
				{watchHistory &&
					watchHistory.map((media: any) => {
						return (
							<HomeMediaCard
								media_type={media.media_type}
								media_id={media.media_id}
								season_number={media.season_number}
								episode_number={media.episode_number}
							></HomeMediaCard>
						);
					})}
			</div>
			<div className="flex flex-row gap-2 items-center">
				<div className="w-[24px] h-[24px] rounded-full bg-accent "></div>
				<h2 className="text-xl font-bold">
					Latest Rotten Brains posts
				</h2>
			</div>
			<div className="flex flex-row gap-4 overflow-x-auto custom-scrollbar">
				{followed_posts_one &&
					followed_posts_one.map((post: any) => {
						return (
							<>
								<div className="flex-shrink-0 pb-2 lg:flex hidden">
									<HomePostCardNew
										post={post}
									></HomePostCardNew>
								</div>
								<div className="flex-shrink-0 pb-2 lg:hidden flex">
									<HomePostCard post={post}></HomePostCard>
								</div>
							</>
						);
					})}
			</div>
			<div className="flex flex-row gap-2 items-center">
				<div className="w-[24px] h-[24px] rounded-full bg-accent "></div>
				<h2 className="text-xl font-bold">Now in cinemas</h2>
			</div>
			<div className="grid 2xl:grid-cols-8 lg:grid-cols-4 grid-cols-2 gap-4">
				{now_in_cinemas &&
					now_in_cinemas.results.slice(0, 8).map((media: any) => {
						return (
							<HomeMediaCardDisplay
								media={media}
								media_type={"movie"}
							></HomeMediaCardDisplay>
						);
					})}
			</div>
			<h2 className="text-xl font-bold mt-4">Older Rotten posts</h2>
			<div className="flex flex-row gap-4 overflow-x-auto custom-scrollbar">
				{followed_posts_two &&
					followed_posts_two.map((post: any) => {
						return (
							<>
								<div className="flex-shrink-0 pb-2 lg:flex hidden">
									<HomePostCardNew
										post={post}
									></HomePostCardNew>
								</div>
								<div className="flex-shrink-0 pb-2 lg:hidden flex">
									<HomePostCard post={post}></HomePostCard>
								</div>
							</>
						);
					})}
			</div>
			<div className="w-full h-16"></div>
		</div>
	);
};

export default HomeContent;

// <h1 className="text-lg font-bold my-4">For you</h1>
// <div className="w-full border-b my-2"></div>
// <div><LoadMore></LoadMore></div>

{
	/* <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4">
	{movieDetails &&
		movieDetails.slice(0, 10).map((media: any) => {
			return (
				<HomeMediaCard
					media_type={"movie"}
					media_id={media.id}
				></HomeMediaCard>
			);
		})}
</div>; */
}
