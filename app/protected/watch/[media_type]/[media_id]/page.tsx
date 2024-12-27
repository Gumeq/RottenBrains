import Link from "next/link";
import VideoEmbed from "@/components/MediaEmbed";
import WatchDuration from "@/components/WatchDuration";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import ScrollButtons from "@/components/explore/ScrollButtons";
import { getRelativeTime } from "@/lib/functions";
import MediaCardSmall from "@/components/MediaCardSmall";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getPostsOfMedia } from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import { getMediaDetails, getRecommendations } from "@/utils/tmdb";
import WatchPageDetails from "@/components/WatchPageDetails";

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

export default async function mediaPage({
  params,
}: {
  params: { media_id: number };
}) {
  const media_id = params.media_id;
  const media_type = "movie";

  const user = await getCurrentUser();

  let postsOfMedia: any = [];
  if (user) {
    postsOfMedia = await getPostsOfMedia(user.user.id, media_type, media_id, 0);
  }

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
          user_id={user.user.id}
          media_duration={media.runtime || 24}
        />
      )}
      <div className="relative z-10 mx-auto mb-16 flex w-screen flex-col lg:w-full lg:px-4">
        <div className="small-screen-watch-margin flex w-full flex-col lg:mt-4 lg:flex-row lg:gap-4">
          <div className="flex flex-col gap-4 lg:w-[70%]">
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
            {postsOfMedia && postsOfMedia.length > 0 && (
              <div className="my-2 flex flex-col gap-2 pl-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <h2 className="font-bold">User posts</h2>
                  </div>
                  <ScrollButtons containerId="user_posts" scrollPercent={30} />
                </div>
                <div className="relative">
                  <div className="gradient-edge absolute right-0 top-0 z-10 h-full w-[5%]"></div>
                  <div
                    className="hidden-scrollbar flex flex-row flex-nowrap gap-2 overflow-x-auto pb-2"
                    id="user_posts"
                  >
                    {postsOfMedia.slice(0, 9).map((post: any) => (
                      <div
                        className="w-[85vw] flex-shrink-0 lg:w-fit"
                        key={post.id}
                      >
                        <HomePostCardNew post={post} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="custom-scrollbar flex flex-col gap-8 p-4 lg:w-[25%] lg:p-0">
            <p className="text-lg font-bold">Recommendations</p>
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
                  user_id={user?.user.id.toString()}
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
