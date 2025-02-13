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
import NavAdMobile from "@/components/features/ads/NavAdMobile";
import FixedAd from "@/components/features/ads/300x250Ad";

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
    title: `Watch ${media.title || media.name} Online Free HD | Rotten Brains`,
    description: `Stream ${media.title || media.name} now on Rotten Brains for free in HD. ${
      media.overview
    } Enjoy watching and sharing with friends today!`,
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
      {!user?.premium && (
        <div className="fixed bottom-0 z-30 mx-auto h-[50px] w-screen bg-white lg:hidden">
          <NavAdMobile dataAdSlot="8769026161" />
        </div>
      )}
      <div className="relative mb-16 w-full">
        <div className="small-screen-watch-margin mx-auto flex w-full flex-col lg:flex-row lg:gap-4">
          <div className="flex flex-col lg:w-3/4 lg:gap-4">
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
          {!user?.premium && (
            <div className="mx-auto w-screen lg:hidden">
              <AdBanner
                dataAdFormat="auto"
                dataFullWidthResponsive={true}
                dataAdSlot="4196406083"
              />
            </div>
          )}
          <section className="custom-scrollbar flex flex-col gap-8 p-4 lg:w-1/4 lg:gap-4 lg:p-0">
            {!user?.premium && (
              <div className="hidden h-full w-full lg:flex">
                <FixedAd dataAdSlot="6121238560" />
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
            {!user?.premium && (
              <div className="hidden h-full w-full lg:flex">
                <FixedAd dataAdSlot="6121238560" />
              </div>
            )}
          </section>
          {!user?.premium && (
            <div className="mx-auto w-screen lg:hidden">
              <AdBanner
                dataAdFormat="auto"
                dataFullWidthResponsive={true}
                dataAdSlot="4196406083"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
