import Link from "next/link";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ExploreCard = async (media: any) => {
	media = media.media;
	let media_type: string;
	if ("title" in media) {
		media_type = "movie";
	} else {
		media_type = "tv";
	}

	const watchLink =
		media_type === "movie"
			? `/protected/watch/${media_type}/${media.id}`
			: `/protected/watch/${media_type}/${media.id}/1/1`;

	return (
		<div className="w-[130px] md:w-[250px] rounded-[8px]">
			<div className="flex flex-col gap-2">
				{!media ? (
					<>
						<Skeleton
							height={300}
							baseColor="#d1d5db"
							highlightColor="#e5e7eb"
						/>
						<div className="w-full flex-row md:gap-2 justify-between hidden md:flex">
							<Skeleton
								width={50}
								height={20}
								baseColor="#d1d5db"
								highlightColor="#e5e7eb"
							/>
							<Skeleton
								width={50}
								height={20}
								baseColor="#d1d5db"
								highlightColor="#e5e7eb"
							/>
						</div>
						<Skeleton
							width={`100%`}
							height={20}
							baseColor="#d1d5db"
							highlightColor="#e5e7eb"
						/>
						<Skeleton
							height={40}
							baseColor="#d1d5db"
							highlightColor="#e5e7eb"
						/>
					</>
				) : (
					<>
						<Link
							href={`/protected/media/${media_type}/${media.id}`}
						>
							<div className="aspect-w-2 aspect-h-3 rounded-xl overflow-hidden">
								<img
									src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
									alt=""
									height="300"
									width="200"
									className=""
									loading="lazy"
								/>
							</div>
						</Link>
						<div className="px-1 flex flex-row gap-2 justify-between w-[100%] h-auto items-center">
							<p className="font-bold truncate md:text-lg text-md">
								{media.title || media.name}
							</p>
						</div>
						<div className="w-full flex-row md:gap-2 justify-between hidden md:flex">
							<div className="bg-foreground/5 px-2 py-1 rounded-lg font-bold text-sm flex flex-row gap-1 items-center justify-center">
								<img
									src="/assets/icons/star-solid.svg"
									alt=""
									width={10}
									height={10}
									className="invert-on-dark"
								/>
								{media.vote_average.toFixed(1)}
							</div>
							<div className="bg-foreground/5 px-2 py-1 rounded-lg font-bold text-sm">
								{media.release_date
									? media.release_date.slice(0, 4)
									: media.first_air_date &&
									  media.first_air_date.slice(0, 4)}
							</div>
						</div>
						<div className="flex items-center justify-center w-full">
							<Link href={watchLink} className="w-full">
								<div className="px-4 py-2 bg-foreground/5 rounded-md w-full flex items-center justify-center flex-row gap-4 font-bold hover:bg-accent">
									<img
										src="/assets/icons/play-solid.svg"
										alt=""
										width={10}
										height={10}
										className="invert-on-dark"
									/>
									<p>Watch</p>
								</div>
							</Link>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default ExploreCard;
