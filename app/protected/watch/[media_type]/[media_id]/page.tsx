import ExploreTab from "@/components/explore/ExploreTab";
import GoBackArrow from "@/components/GoBackArrow";
import VideoEmbed from "@/components/MediaEmbed";
import MediaInfoComponent from "@/components/MediaInfoComponent";
import HomePostCard from "@/components/post/HomePostCard";
import RecommendedCard from "@/components/RecommendedCard";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getPostsOfMedia, upsertWatchHistory } from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import { getMediaDetails, getRecommendations } from "@/utils/tmdb";
import Link from "next/link";
import WatchDuration from "@/components/WatchDuration";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import ScrollButtons from "@/components/explore/ScrollButtons";
import { getRelativeTime } from "@/lib/functions";

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
  params: { media_type: string; media_id: number };
}) {
  const media_id = params.media_id;
  const media_type = params.media_type;

  const user = await getCurrentUser();

  let postsOfMedia: any = [];
  if (user) {
    postsOfMedia = await getPostsOfMedia(user.user.id, media_type, media_id, 0);
  }
  const recommendations = await getRecommendations(media_type, media_id);
  const media = await getMediaDetails(media_type, media_id);
  return (
    <>
      {user && (
        <WatchDuration
          media_type={media_type}
          media_id={media_id}
          user_id={user.user.id}
          media_duration={media.runtime || 100}
        />
      )}
      <div className="relative z-10 mx-auto mb-16 flex w-screen flex-col lg:w-[95vw] lg:max-w-[1700px]">
        <div className="fixed z-20 flex h-14 w-screen flex-row items-center gap-4 bg-background px-4 lg:hidden">
          <GoBackArrow />
          <p className="truncate text-lg">Watch {media.title || media.name}</p>
        </div>
        <div className="mt-14 flex flex-col gap-4 md:flex-row lg:mt-4">
          <div className="flex flex-col gap-4 lg:w-[75%]">
            <VideoEmbed
              media_type={media_type}
              media_id={media_id}
            ></VideoEmbed>
            <div className="hidden w-full flex-col gap-2 rounded-[16px] bg-foreground/10 p-4 text-sm lg:flex">
              <p className="font-semibold">
                {getRelativeTime(media.release_date)}
              </p>
              <p>{media.overview}</p>
            </div>
            <div className="">
              {postsOfMedia && (
                <div>
                  {postsOfMedia.length > 0 && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-2">
                          {/* <div className="w-[24px] h-[24px] rounded-full bg-accent "></div> */}
                          <h2 className="px-2 text-xl font-bold lg:p-0">
                            User posts
                          </h2>
                        </div>
                        <ScrollButtons
                          containerId="user_posts"
                          scrollPercent={30}
                        ></ScrollButtons>
                      </div>
                      <div className="relative px-2 lg:px-0">
                        <div className="gradient-edge absolute right-0 top-0 z-10 h-full w-[5%]"></div>
                        <div
                          className="hidden-scrollbar hidden flex-row flex-nowrap gap-4 overflow-x-auto pb-2 lg:flex"
                          id="user_posts"
                        >
                          {postsOfMedia?.slice(0, 9).map((post: any) => (
                            <div>
                              <HomePostCardNew post={post}></HomePostCardNew>
                            </div>
                          ))}
                        </div>
                        <div
                          className="hidden-scrollbar flex flex-row flex-nowrap gap-4 overflow-x-auto pb-2 lg:hidden"
                          id="user_posts"
                        >
                          {postsOfMedia?.slice(0, 9).map((post: any) => (
                            <div className="w-[90vw] flex-shrink-0">
                              <HomePostCardNew post={post}></HomePostCardNew>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="custom-scrollbar flex flex-col lg:w-[25%]">
            <p className="mb-2 px-2 text-lg font-bold lg:px-0">
              Recommendations
            </p>
            {recommendations &&
              recommendations.results.map((media: any) => (
                <Link
                  href={
                    media.media_type === "movie"
                      ? `/protected/watch/${media.media_type}/${media.id}`
                      : `/protected/watch/${media.media_type}/${media.id}/1/1`
                  }
                  className="w-full"
                >
                  <RecommendedCard
                    media_id={media.id}
                    media_type={media.media_type}
                  ></RecommendedCard>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
