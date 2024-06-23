import HomePostCard from "@/components/HomePostCard";
import { getExploreData, getMediaData } from "@/utils/clientFunctions";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getPostsOfMedia } from "@/utils/supabase/queries";
import Image from "next/image";

export default async function Page({
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

	const postsOfMedia = await getPostsOfMedia(media_id, media_type);
	console.table(postsOfMedia);

	return (
		<div className="flex flex-col mx-auto max-w-screen w-[1500px]">
			<div className="flex flex-col md:flex-row gap-8  p-4 md:p-8 rounded-[20px] ">
				<div className="w-[300px] h-[450px] bg-foreground/10 rounded-[12px] overflow-hidden mx-auto">
					<Image
						src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
						alt=""
						width={300}
						height={450}
					></Image>
				</div>
				<div className=" flex flex-col justify-center gap-8">
					<div>
						<h1 className="text-4xl font-bold py-2">
							{media.title || media.name}
						</h1>
						<p className="text-foreground/50">
							{media.release_date || media.first_air_date}
						</p>
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
				</div>
			</div>
			<div className="flex flex-row gap-8 mx-auto">
				<div className="mt-8 flex bg-foreground/10 w-32 px-6 py-3 rounded-full ">
					<h2 className="text-xl m-auto">Posts</h2>
				</div>
				<div className="mt-8 flex bg-foreground/10 w-32 px-6 py-3 rounded-full ">
					<h2 className="text-xl m-auto">Videos</h2>
				</div>
			</div>
			<div className="flex flex-row flex-wrap gap-4 pt-4">
				{postsOfMedia &&
					postsOfMedia.map((post) => (
						<div>
							<HomePostCard post={post}></HomePostCard>
						</div>
					))}
			</div>

			<div className=" h-[500px]"></div>
		</div>
	);
}
