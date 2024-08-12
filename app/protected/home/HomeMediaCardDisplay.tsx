import Link from "next/link";
import React from "react";

const HomeMediaCardDisplay = (media: any) => {
	media = media.media;
	let media_type: string;
	if ("title" in media) {
		media_type = "movie";
	} else {
		media_type = "tv";
	}
	return (
		<div className="">
			<div className="flex flex-col gap-2">
				<>
					<Link
						href={`/protected/media/${media_type}/${media.id}`}
						className="relative"
					>
						<div className="aspect-w-2 aspect-h-3 rounded-[8px] overflow-hidden">
							<picture>
								<img
									src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
									alt=""
									className="w-full h-full bg-background"
									loading="lazy"
								/>
							</picture>
						</div>
						<div className="absolute lg:p-2 p-1 bottom-0 w-full">
							<div className="w-full flex-row md:gap-2 justify-between flex">
								<div className="bg-black/20 px-2 py-1 lg:rounded-[6px] rounded-[7px] font-bold text-white  flex flex-row gap-1 items-center justify-center backdrop-blur-xl">
									<img
										src="/assets/icons/star-solid.svg"
										alt=""
										width={20}
										height={20}
										className="invert-on-dark"
									/>
									{media.vote_average.toFixed(1)}
								</div>
								<div className="bg-black/20 px-2 py-1 lg:rounded-[6px] rounded-[7px] font-bold text-white flex flex-row gap-1 items-center justify-center backdrop-blur-xl">
									{media.release_date
										? media.release_date.slice(0, 4)
										: media.first_air_date &&
										  media.first_air_date.slice(0, 4)}
								</div>
							</div>
						</div>
					</Link>
				</>
			</div>
		</div>
	);
};

export default HomeMediaCardDisplay;
