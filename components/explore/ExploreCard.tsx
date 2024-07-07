import { IMedia } from "@/types";
import Link from "next/link";
import React from "react";

const ExploreCard = (media: any) => {
	media = media.media;
	let media_type: string;
	if ("title" in media) {
		media_type = "movie";
	} else {
		media_type = "tv";
	}
	return (
		<div className="w-[130px] md:w-[200px] hover:border-2 border-accent">
			<Link href={`/protected/media/${media_type}/${media.id}`}>
				<div>
					<div className="aspect-w-2 aspect-h-3 rounded-xl overflow-hidden ">
						<img
							src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
							alt=""
							height="200"
							width="200"
							className=""
						/>
					</div>
					<div className="py-2 px-1 flex flex-row gap-2 justify-between w-[100%] h-auto items-center">
						<p className="font-bold truncate text-lg">
							{media.title || media.name}
						</p>
						<div className="bg-foreground/5 px-2 py-1 rounded-lg font-bold text-sm">
							{media_type === "movie" ? "Movie" : "Tv"}
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default ExploreCard;
