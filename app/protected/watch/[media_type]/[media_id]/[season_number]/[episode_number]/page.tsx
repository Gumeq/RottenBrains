import VideoEmbed from "@/components/MediaEmbed";
import MediaInfoComponent from "@/components/MediaInfoComponent";

export default async function mediaPage({
	params,
}: {
	params: {
		media_type: string;
		media_id: any;
		season_number: number;
		episode_number: number;
	};
}) {
	const media_id = parseInt(params.media_id, 10);
	const media_type = params.media_type;
	const season_number = params.season_number;
	const episode_number = params.episode_number;

	return (
		<>
			<div className=" max-w-7xl w-screen h-full mx-auto flex flex-col gap-4">
				<div className="w-full h-10  bg-accent flex items-center justify-center font-bold rounded-xl">
					Warning: For the best experience use an adBlocker!
				</div>
				<div className="">
					<div className="aspect-w-16 aspect-h-9 w-full">
						<VideoEmbed
							media_type={media_type}
							media_id={media_id}
							season_number={season_number}
							episode_number={episode_number}
						></VideoEmbed>
					</div>
				</div>
				<div className="w-">
					<MediaInfoComponent
						media_type={media_type}
						media_id={media_id}
					></MediaInfoComponent>
				</div>
			</div>
		</>
	);
}
