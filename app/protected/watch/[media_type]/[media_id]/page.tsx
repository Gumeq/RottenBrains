import Link from "next/link";
import VideoEmbed from "@/components/MediaEmbed";
import WatchDuration from "@/components/WatchDuration";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import ScrollButtons from "@/components/explore/ScrollButtons";
import { getRelativeTime } from "@/lib/functions";
import MediaCardSmall from "@/components/MediaCardSmall";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import { getMediaDetails, getRecommendations } from "@/utils/tmdb";
import WatchPageDetails from "@/components/WatchPageDetails";
import NativeAd from "@/components/ads/Native";

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
    title: `${media.title || media.name} - RottenBrains`,
    description: `${media.overview}`,
  };
}
type Params = Promise<{ media_id: number }>;
export default async function mediaPage({ params }: { params: Params }) {
  const { media_id } = await params;
  const media_type = "movie";

  const user = await getCurrentUser();

  const recommendations = await getRecommendations(media_type, media_id);
  const media = await getMediaDetails(media_type, media_id);

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
      <div className="relative z-10 mb-16 flex w-screen flex-col lg:w-full lg:px-4">
        <div className="small-screen-watch-margin mx-auto flex w-full flex-col lg:mt-4 lg:w-full lg:max-w-[1712px] lg:flex-row lg:gap-8">
          <div className="flex w-full flex-col gap-4 lg:max-w-[1280px]">
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
          <div className="custom-scrollbar lg;gap-4 flex flex-col gap-8 p-4 lg:w-[400px] lg:p-0">
            {user && !user.premium && (
              <div className="hidden w-full items-center justify-center lg:flex">
                <NativeAd></NativeAd>
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
