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
		<div className="w-[130px] bg-foreground/10 rounded-xl overflow-hidden my-2 md:w-[200px] hover:border-2 border-accent">
			<Link href={`/protected/media/${media_type}/${media.id}`}>
				<div>
					<div className="aspect-w-2 aspect-h-3">
						<img
							src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
							alt=""
							height="200"
							width="200"
							className=""
						/>
					</div>
					{/* <div className="p-2 flex flex-col gap-2">
						<p className="font-bold truncate text-lg">
							{media.title || media.name}
						</p>

						<div className="flex flex-row gap-1 items-center align-center">
							<img
								src="/assets/icons/star-solid.svg"
								alt=""
								width="15"
								height="15"
								className="invert-on-dark"
							/>
							<p>{media.vote_average?.toFixed(1)}</p>
						</div>

						<p className="text-gray-400 text-sm">
							{media.release_date || media.first_air_date}
						</p>
					</div> */}
				</div>
			</Link>
		</div>
	);
};

export default ExploreCard;
