import { getMediaDetails } from "@/utils/tmdb";
import { getRelativeTime } from "./RelativeTime";
import Link from "next/link";
import { formatDate } from "@/app/protected/home/HomeMediaCard";

function transformRuntime(minutes: number): string {
	const hours: number = Math.floor(minutes / 60);
	const remainingMinutes: number = minutes % 60;

	if (hours > 0) {
		return `${hours} h ${remainingMinutes} m`;
	} else {
		return `${remainingMinutes} m`;
	}
}

const RecommendedCard = async ({ media_id, media_type }: any) => {
	let media: any;
	media = await getMediaDetails(media_type, media_id);
	return (
		<div className=" lg:p-2 rounded-[8px] lg:mb-2 mb-8 hover:border-accent flex lg:flex-row flex-col lg:gap-4 gap-2 hover:bg-foreground/20 w-full">
			<Link
				className="relative lg:rounded-[16px] overflow-hidden lg:w-1/2 w-full flex-shrink-0"
				href={
					media_type === "movie"
						? `/protected/watch/${media_type}/${media_id}`
						: `/protected/watch/${media_type}/${media_id}/1/1`
				}
			>
				<div className="absolute bottom-0 right-0 m-2 flex flex-row-reverse gap-2">
					<div className="text-sm px-4 py-1 rounded-[14px] bg-black/50 text-white">
						{transformRuntime(media.runtime)}
					</div>
				</div>
				<img
					src={
						media.images &&
						media.images.backdrops &&
						media.images.backdrops.length > 0
							? `https://image.tmdb.org/t/p/w780${media.images.backdrops[0].file_path}`
							: `https://image.tmdb.org/t/p/w780${media.backdrop_path}`
					}
					alt=""
					loading="lazy"
					className="aspect-[16/9] lg:rounded-[16px] bg-foreground/10"
				/>
			</Link>
			<div className="flex flex-col px-2 lg:px-0">
				<h3 className="text-lg line-clamp-2">
					{media.title || media.name}
				</h3>
				<div className="flex flex-row gap-4 items-center opacity-50">
					<p className="">
						{formatDate(media.release_date || media.first_air_date)}
					</p>
				</div>
				<h3 className="opacity-50 line-clamp-2 lg:hidden">
					{media.overview}
				</h3>
			</div>
		</div>
	);
};

export default RecommendedCard;
