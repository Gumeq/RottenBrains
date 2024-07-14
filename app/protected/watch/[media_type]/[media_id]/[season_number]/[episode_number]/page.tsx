import VideoEmbed from "@/components/MediaEmbed";
import MediaInfoComponent from "@/components/MediaInfoComponent";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";

export async function generateMetadata({ params }: any) {
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

	if (!media) {
		return {
			title: "No Media Found",
			description:
				"Connect with fellow enthusiasts and dive deep into your favorite media.",
		};
	}

	return {
		title: `${media.title || media.name} - RottenBrains`,
		description: `${media.overview}`,
	};
}

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
					<div className="">
						<VideoEmbed
							media_type={media_type}
							media_id={media_id}
							season_number={season_number}
							episode_number={episode_number}
						></VideoEmbed>
					</div>
				</div>
				<div className="">
					<MediaInfoComponent
						media_type={media_type}
						media_id={media_id}
						season_number={season_number}
					></MediaInfoComponent>
				</div>
			</div>
		</>
	);
}
