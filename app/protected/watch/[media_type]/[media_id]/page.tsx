import ExploreTab from "@/components/explore/ExploreTab";
import VideoEmbed from "@/components/MediaEmbed";
import MediaInfoComponent from "@/components/MediaInfoComponent";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getMediaDetails } from "@/utils/tmdb";

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
	params: { media_type: string; media_id: any };
}) {
	const media_id = parseInt(params.media_id, 10);
	const media_type = params.media_type;

	return (
		<>
			<div className=" max-w-7xl w-screen h-full mx-auto flex flex-col gap-4 px-4">
				<div className="w-full p-2 text-center bg-accent flex items-center justify-center font-bold rounded-xl">
					Warning: For the best experience use an adBlocker!
				</div>
				<div>
					<div>
						<VideoEmbed
							media_type={media_type}
							media_id={media_id}
						></VideoEmbed>
					</div>
				</div>
				<div>
					<MediaInfoComponent
						media_type={media_type}
						media_id={media_id}
					></MediaInfoComponent>
				</div>
				<div>
					<h1 className="text-xl pt-8 font-bold">Trending Movies</h1>
					<div className="w-1/6 h-[5px] bg-accent rounded-full my-1"></div>
					<ExploreTab action="Trending_Movies"></ExploreTab>
				</div>
			</div>
		</>
	);
}
