import Link from "next/link";
import VideoEmbed from "@/components/features/watch/MediaEmbed";
import WatchDuration from "@/components/features/watch/WatchDuration";
import MediaCardSmall from "@/components/features/media/MediaCardSmall";
import { getMediaDetails, getRecommendations } from "@/lib/tmdb";
import WatchPageDetails from "@/components/features/watch/WatchPageDetails";
import NativeAd from "@/components/features/ads/Native";
import { fetchMediaData } from "@/lib/client/fetchMediaData";
import { getCurrentUser } from "@/lib/supabase/serverQueries";
import AdBanner from "@/components/features/ads/GoogleDisplayAd";

export async function generateMetadata({ params }: any) {
  const media_id = parseInt(params.media_id, 10);
  const media_type = "movie";

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
    title: `Watch ${media.title || media.name} Online | Rotten Brains`,
    description: `Stream ${media.title || media.name} now on Rotten Brains. ${media.overview} Enjoy watching and sharing with friends today!`,
  };
}
type Params = Promise<{ media_id: number }>;
export default async function mediaPage({ params }: { params: Params }) {
  const { media_id } = await params;
  const media_type = "movie";

  const user = await getCurrentUser();

  const recommendations = await getRecommendations(media_type, media_id);
  const media = await getMediaDetails(media_type, media_id);
  if (!media) {
    return <div>NO MEDIA FOUND</div>;
  }

  // Fetch media details for recommendations
  const recommendationMediaDetails = await Promise.all(
    recommendations.results.map((rec: any) =>
      getMediaDetails(rec.media_type || "movie", rec.id),
    ),
  );

  return (
    <>
      {user && (
        <WatchDuration
          media_type={media_type}
          media_id={media_id}
          user_id={user.id}
          media_duration={media.runtime || 24}
        />
      )}
      <div className="relative z-10 mb-16 flex w-screen flex-col md:w-full md:px-4">
        <div className="small-screen-watch-margin mx-auto flex w-full flex-col md:mt-4 md:w-full md:max-w-[1712px] md:flex-row md:gap-8">
          <div className="flex w-full flex-col gap-4 md:max-w-[1280px]">
            <VideoEmbed
              media_type={media_type}
              media_id={media_id}
              media={media}
            />
            <WatchPageDetails
              media={media}
              media_type="movie"
              media_id={media.id}
            ></WatchPageDetails>
          </div>
          <div className="custom-scrollbar lg;gap-4 flex flex-col gap-8 p-4 md:w-[400px] md:p-0">
            {!user?.premium && (
              <div className="mx-auto w-full max-w-[400px]">
                <AdBanner
                  dataAdFormat="auto"
                  dataFullWidthResponsive={true}
                  dataAdSlot="4196406083"
                />
              </div>
            )}
            {recommendationMediaDetails.map((mediaDetail: any) => (
              <Link
                href={
                  mediaDetail.title
                    ? `/protected/watch/${mediaDetail.media_type}/${mediaDetail.id}`
                    : `/protected/watch/${mediaDetail.media_type}/${mediaDetail.id}/1/1`
                }
                className="w-full"
                key={mediaDetail.id}
              >
                <MediaCardSmall
                  media_type={mediaDetail.media_type || "movie"}
                  media_id={mediaDetail.id}
                  user_id={user?.id.toString()}
                  media={mediaDetail}
                  rounded
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
