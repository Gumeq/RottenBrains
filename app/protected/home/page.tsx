import { getNewestUsers } from "@/utils/supabase/queries";
import LoadMore from "./LoadMore";
import Link from "next/link";
import FollowButton from "@/components/post/FollowButton";
import { fetchVidsrc } from "@/utils/vidsrc";
import { fetchMediaDetails } from "@/utils/tmdb";
import ProfilePicture from "@/components/ProfilePicture";
import { cancelFrame } from "framer-motion";

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
const PostsPage = async () => {
	const users = await getNewestUsers();
	const { movieDetails, tvDetails } = await fetchMoviesAndTvDetails();
	if (!users) {
		return;
	}
	return (
		<>
			<div className="w-screen flex items-center flex-col lg:mt-16">
				<div className="min-w-[350px] w-[20vw] ">
					<h1 className="text-lg font-bold my-4">For you</h1>
					<div className="w-full border-b my-2"></div>
					<div>
						<LoadMore></LoadMore>
					</div>
				</div>
			</div>
			<div className="w-[30%] h-screen fixed left-0 z-20 hidden lg:flex  flex-col items-center p-4 mt-16">
				<div>
					<h2 className="text-foreground/50 my-2">
						Newest movies added
					</h2>
					<div className="gap-2 w-full  grid grid-cols-5">
						{movieDetails.slice(0, 5).map((item: any) => (
							<Link
								href={`/protected/media/movie/${item.id}`}
								className="text-foreground/50"
							>
								<img
									src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
									alt=""
								/>
							</Link>
						))}
					</div>
				</div>
				<br />
				<div>
					<h2 className="text-foreground/50 my-2 ">
						Newest shows added
					</h2>
					<div className="gap-2 w-full  grid grid-cols-5">
						{tvDetails.slice(0, 5).map((item: any) => (
							<Link
								href={`/protected/media/movie/${item.id}`}
								className="text-foreground/50"
							>
								<img
									src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
									alt=""
									className="rounded-[4px]"
								/>
							</Link>
						))}
					</div>
				</div>
			</div>
			<div className="w-[30%] h-screen  fixed right-0 z-20 my-20 hidden lg:block">
				<h2 className="text-foreground/50">Suggested for you</h2>
				<div className="flex flex-col gap-4 my-2">
					{users.map((user: any) => (
						<div
							key={user.id}
							className="flex flex-row gap-2 items-center"
						>
							<ProfilePicture user={user}></ProfilePicture>
							<Link
								href={`/protected/user/${user.id}`}
								className="flex flex-row"
							>
								<div className="flex flex-col">
									<p>{user.username}</p>
									<p className="text-foreground/50 text-sm">
										Suggested for you
									</p>
								</div>
								<div className="mx-4">
									<FollowButton
										user_to_follow_id={user.id}
									></FollowButton>
								</div>
							</Link>
						</div>
					))}
				</div>
				<br />
			</div>
		</>
	);
};

export default PostsPage;
