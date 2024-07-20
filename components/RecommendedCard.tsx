import { getRelativeTime } from "./RelativeTime";

const RecommendedCard = ({ media }: any) => {
	return (
		<div className=" p-2 rounded-[8px] mb-2 hover:border-accent flex flex-row gap-4 ">
			<div>
				<img
					src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
					alt={media.title || media.name}
					width={100}
					height={150}
					loading="lazy"
					className="max-w-[100px] max-h-[150px] bg-foreground/10 rounded-[4px]"
				/>
			</div>
			<div className="flex flex-col">
				<h3 className="text-lg">{media.title || media.name}</h3>
				<p className="text-foreground/50 text-sm">
					{(media.release_date && media.release_date.slice(0, 4)) ||
						(media.first_air_date &&
							media.first_air_date.slice(0, 4))}
				</p>
				<p className="text-foreground/50 text-sm">{media.media_type}</p>
			</div>
		</div>
	);
};

export default RecommendedCard;
