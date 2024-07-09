import VideoEmbed from "@/components/MediaEmbed";
import MediaInfoComponent from "@/components/MediaInfoComponent";
import { getMediaDetails } from "@/utils/tmdb";

export async function generateMetadata({ params }: any) {
	const { media_type, media_id } = params;
	const media = await getMediaDetails(media_type, media_id);
	// Fetch or derive additional data if necessary
	const title = `${media.title || media.name}`;

	return {
		title,
		description: `Watch ${
			media.title || media.name
		} with ID ${media_id} on our platform.`,
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
			<div className=" max-w-7xl w-screen h-full mx-auto flex flex-col gap-4">
				<div className="w-full h-10  bg-accent flex items-center justify-center font-bold rounded-xl">
					Warning: For the best experience use an adBlocker!
				</div>
				<div className="py-4">
					<div className="aspect-w-16 aspect-h-9 w-full">
						<VideoEmbed
							media_type={media_type}
							media_id={media_id}
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
