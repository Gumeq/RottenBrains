import { getNewestUsers } from "@/utils/supabase/queries";
import LoadMore from "./LoadMore";
import Link from "next/link";
import FollowButton from "@/components/post/FollowButton";
import { fetchVidsrc } from "@/utils/vidsrc";
import { fetchMediaDetails } from "@/utils/tmdb";

async function fetchMoviesAndTvDetails() {
	const { dataMovies, dataTv } = await fetchVidsrc("new", 1);

	if (dataMovies && dataTv) {
		const newMovies = dataMovies.result.items;
		const newTvShows = dataTv.result.items;

		const movieDetailsArray = newMovies.map((item: any) => ({
			tmdb_id: item.tmdb_id,
			type: item.type,
		}));

		const tvDetailsArray = newTvShows.map((item: any) => ({
			tmdb_id: item.tmdb_id,
			type: item.type,
		}));

		const movieDetails = await fetchMediaDetails(movieDetailsArray);
		const tvDetails = await fetchMediaDetails(tvDetailsArray);

		// console.log("Movie Details:", movieDetails);
		// console.log("TV Details:", tvDetails);

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
	return (
		<>
			<div className="w-screen flex items-center flex-col">
				<div className="min-w-[350px] w-[20vw] ">
					<h1 className="text-lg font-bold my-4">For you</h1>
					<div className="w-full border-b my-2"></div>
					<div className="">
						<LoadMore></LoadMore>
					</div>
				</div>
			</div>
			<div className="w-[30%] h-screen fixed left-0 z-20 hidden lg:flex  flex-col items-center p-4 ">
				<div>
					<h2 className="text-foreground/50 my-2">
						Newest movies added
					</h2>
					<div className="gap-2 w-full  grid grid-cols-5">
						{movieDetails.slice(0, 10).map((item: any) => (
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
						{tvDetails.slice(0, 10).map((item: any) => (
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
					{users?.map((user: any) => (
						<Link
							href={`/protected/user/${user.id}`}
							key={user.id}
							className="flex flex-row gap-2 items-center"
						>
							<img
								src={user.image_url}
								alt="prof-pic"
								className="w-10 h-10 aspect-[1/1] rounded-full"
							/>
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
					))}
				</div>
				<br />
			</div>
		</>
	);
};

export default PostsPage;
