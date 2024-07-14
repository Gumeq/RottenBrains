import { getMediaDetails } from "@/utils/tmdb";
import React from "react";
import TVShowDetails from "./TVSeasons";

type MediaInfoProps = {
	media_type: string;
	media_id: number;
	season_number?: number;
};

const MediaInfoComponent = async ({
	media_type,
	media_id,
	season_number,
}: MediaInfoProps) => {
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
	return (
		<div>
			<div>
				{media_type === "tv" && season_number && (
					<TVShowDetails
						tv_show_id={media_id}
						season_number={season_number}
					></TVShowDetails>
				)}
			</div>
			<div className="w-full flex flex-col md:flex-row gap-2 md:gap-0 rounded-xl items-center">
				<div className="min-w-[300px] min-h-[450px] rounded-xl overflow-hidden drop-shadow-2xl">
					<img
						src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
						alt=""
						width="300"
						height="450"
					/>
				</div>
				<div className="w-full md:h-5/6 bg-foreground/10 rounded-r-xl">
					<div className="flex flex-col p-8 text-foreground/70 gap-2 w-full ">
						<p className="text-2xl font-bold py-2 text-foreground">
							{media.title || media.name}
						</p>
						<p className="py-2 max-w-[90%]">{media.overview}</p>
						<p>
							Genre:{" "}
							{media.genres
								.map((genre: any) => genre.name)
								.join(", ")}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MediaInfoComponent;
