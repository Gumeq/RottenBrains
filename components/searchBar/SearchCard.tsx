import React from "react";

const SearchCard = (media: any) => {
	media = media.media;
	return (
		<div className="flex flex-row">
			<img
				src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
				alt="Movie Poster Not Available"
				width={100} // Width in pixels
				height={100} // Height in pixels
			/>
			<div className="flex flex-col pl-4">
				<p className="text-foreground text-lg font-bold">
					{media.title || media.name}
				</p>
				<p className="text-foreground/70">
					{media.release_date?.slice(0, 4) ||
						media.first_air_date?.slice(0, 4)}
				</p>
			</div>
		</div>
	);
};

export default SearchCard;
