import {
	getNewestUsers,
	getWatchHistoryForUser,
} from "@/utils/supabase/queries";
import { fetchVidsrc } from "@/utils/vidsrc";
import {
	getCurrentUser,
	getPostsFromFollowedUsers,
} from "@/utils/supabase/serverQueries";
import HomeMediaCard from "./HomeMediaCard";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import { fetchExploreData } from "@/utils/clientFunctions/fetchExploreData";
import HomeMediaCardDisplay from "./HomeMediaCardDisplay";
import HomePostCard from "@/components/post/HomePostCard";
import ScrollButtons from "@/components/explore/ScrollButtons";
import { getRecommendations } from "@/utils/tmdb";

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

	const { dataMovies, dataTv, dataEpisodes } = await fetchVidsrc();

	const watchHistory = await getWatchHistoryForUser(user.user.id, 10, 0);
	const allRecommendations = await Promise.all(
		watchHistory.map(async (item: any) => {
			const recs = await getRecommendations(
				item.media_type,
				item.media_id
			);
			return recs.results;
		})
	);
	const flattenedRecommendations = allRecommendations
		.flat()
		.reduce((acc, current) => {
			const x = acc.find((item: any) => item.id === current.id);
			if (!x) {
				return acc.concat([current]);
			} else {
				return acc;
			}
		}, []);
	for (let i = flattenedRecommendations.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[flattenedRecommendations[i], flattenedRecommendations[j]] = [
			flattenedRecommendations[j],
			flattenedRecommendations[i],
		];
	}
	const followed_posts_one = await getPostsFromFollowedUsers(
		user.user.id.toString(),
		0
	);
	const followed_posts_two = await getPostsFromFollowedUsers(
		user.user.id.toString(),
		1
	);
	const now_in_cinemas = await fetchExploreData("Now_in_cinemas");
	const trending_tv = await fetchExploreData("Trending_TV");
	return (
		<div className="flex flex-col gap-8 lg:p-4 p-0 lg:w-auto w-screen">
			<div>
				<div className="flex flex-row gap-2 items-center mb-4">
					<img
						src="/assets/icons/history.svg"
						alt=""
						width={24}
						height={24}
						className="invert-on-dark"
					/>
					<h2 className="text-xl font-bold">Your watch history</h2>
				</div>
				<div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
					{watchHistory &&
						watchHistory.map((media: any) => {
							return (
								<HomeMediaCard
									media_type={media.media_type}
									media_id={media.media_id}
									season_number={media.season_number}
									episode_number={media.episode_number}
									percentage_watched={parseFloat(
										media.percentage_watched
									)}
								></HomeMediaCard>
							);
						})}
				</div>
			</div>
			<div>
				<div className="flex flex-row items-center justify-between mb-4">
					<div className="flex flex-row gap-2 items-center">
						<div className="w-[24px] h-[24px] rounded-full bg-accent "></div>
						<h2 className="text-xl font-bold">
							Latest Rotten Brains posts
						</h2>
					</div>
					<ScrollButtons containerId="rotten-posts-one"></ScrollButtons>
				</div>
				<div className="relative">
					<div className="gradient-edge absolute w-[5%] h-full top-0 right-0 z-20"></div>
					<div
						className="flex flex-row gap-4 overflow-x-auto hidden-scrollbar"
						id={"rotten-posts-one"}
					>
						{followed_posts_one &&
							followed_posts_one.map((post: any) => {
								return (
									<>
										<div className="flex-shrink-0 lg:flex hidden">
											<HomePostCardNew
												post={post}
											></HomePostCardNew>
										</div>
										<div className="flex-shrink-0 lg:hidden flex">
											<HomePostCard
												post={post}
											></HomePostCard>
										</div>
									</>
								);
							})}
					</div>
				</div>
			</div>
			<div>
				<div className="flex flex-row gap-2 items-center mb-4">
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
			</div>

			<div>
				<div className="flex flex-row gap-2 items-center mb-4">
					<img
						src="/assets/icons/history.svg"
						alt=""
						width={24}
						height={24}
						className="invert-on-dark"
					/>
					<h2 className="text-xl font-bold">Recommended</h2>
				</div>
				<div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
					{flattenedRecommendations.length >= 20 &&
						flattenedRecommendations
							.slice(0, 20)
							.map((media: any) => {
								return (
									<HomeMediaCard
										media_type={media.media_type}
										media_id={media.id}
									></HomeMediaCard>
								);
							})}
				</div>
			</div>
			<div>
				<div className="flex flex-row items-center justify-between mb-4">
					<div className="flex flex-row gap-2 items-center">
						<div className="w-[24px] h-[24px] rounded-full bg-accent "></div>
						<h2 className="text-xl font-bold">
							Older Rotten Brains posts
						</h2>
					</div>
					<ScrollButtons containerId="rotten-posts-two"></ScrollButtons>
				</div>
				<div className="relative">
					<div className="gradient-edge absolute w-[5%] h-full top-0 right-0 z-20"></div>
					<div
						className="flex flex-row gap-4 overflow-x-auto hidden-scrollbar"
						id={"rotten-posts-two"}
					>
						{followed_posts_two &&
							followed_posts_two.map((post: any) => {
								return (
									<>
										<div className="flex-shrink-0 lg:flex hidden">
											<HomePostCardNew
												post={post}
											></HomePostCardNew>
										</div>
										<div className="flex-shrink-0 lg:hidden flex">
											<HomePostCard
												post={post}
											></HomePostCard>
										</div>
									</>
								);
							})}
					</div>
				</div>
			</div>
			<div>
				<div className="flex flex-row gap-2 items-center mb-4">
					<img
						src="/assets/icons/history.svg"
						alt=""
						width={24}
						height={24}
						className="invert-on-dark"
					/>
					<h2 className="text-xl font-bold">Recommended</h2>
				</div>
				<div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
					{flattenedRecommendations.length >= 40 &&
						flattenedRecommendations
							.slice(20, 40)
							.map((media: any) => {
								return (
									<HomeMediaCard
										media_type={media.media_type}
										media_id={media.id}
									></HomeMediaCard>
								);
							})}
				</div>
			</div>
			<div>
				<div className="flex flex-row gap-2 items-center mb-4">
					<div className="w-[24px] h-[24px] rounded-full bg-accent "></div>
					<h2 className="text-xl font-bold">Trending tv shows</h2>
				</div>
				<div className="grid 2xl:grid-cols-8 lg:grid-cols-4 grid-cols-2 gap-4">
					{trending_tv &&
						trending_tv.results.slice(0, 8).map((media: any) => {
							return (
								<HomeMediaCardDisplay
									media={media}
									media_type={"movie"}
								></HomeMediaCardDisplay>
							);
						})}
				</div>
			</div>
			<div>
				<div className="flex flex-row gap-2 items-center mb-4">
					<img
						src="/assets/icons/history.svg"
						alt=""
						width={24}
						height={24}
						className="invert-on-dark"
					/>
					<h2 className="text-xl font-bold">Recommended</h2>
				</div>
				<div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
					{flattenedRecommendations.length >= 60 &&
						flattenedRecommendations
							.slice(40, 60)
							.map((media: any) => {
								return (
									<HomeMediaCard
										media_type={media.media_type}
										media_id={media.id}
									></HomeMediaCard>
								);
							})}
				</div>
			</div>
			<div className="w-full h-16"></div>
		</div>
	);
};

export default HomeContent;
