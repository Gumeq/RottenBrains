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
import MediaCardSmall from "@/components/MediaCardSmall";

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
        <div className="small-screen-watch-margin flex flex-col gap-4 md:flex-row lg:mt-4">
          <div className="flex flex-col gap-4 lg:w-[75%]">
            <VideoEmbed
              media_type={media_type}
              media_id={media_id}
            ></VideoEmbed>
            <div className="mx-auto flex w-[96vw] flex-col gap-2 rounded-[8px] bg-foreground/10 p-4 text-sm lg:w-full">
              <p className="font-semibold">
                {getRelativeTime(media.release_date)}
              </p>
              <p>{media.overview}</p>
            </div>
            <div className="flex w-full flex-col gap-4 px-2 lg:flex-row lg:p-0">
              <Link
                href={`/protected/media/${media_type}/${media_id}`}
                className="flex h-32 w-full flex-row items-center gap-4 overflow-hidden rounded-[8px] bg-foreground/10"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                  alt=""
                  className="h-full"
                />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{media.title || media.name}</p>
                  <p className="text-sm text-foreground/50">
                    {media.release_date.slice(0, 4) ||
                      media.first_air_date.slice(0, 4)}
                  </p>
                  <div className="flex flex-row items-center gap-1">
                    <p className="text-sm font-semibold uppercase text-foreground/50">
                      Details
                    </p>
                    <img
                      src="/assets/icons/chevron-forward.svg"
                      alt=""
                      className="invert-on-dark opacity-50"
                    />
                  </div>
                </div>
              </Link>
              <Link
                href={`/protected/discover/${media_type}`}
                className="flex h-32 w-full flex-row items-center gap-4 rounded-[8px] bg-foreground/10 p-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <img
                    src={`/assets/icons/${media_type}-outline.svg`}
                    alt=""
                    className="h-[70%] w-[70%] opacity-80 invert"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold uppercase">{media_type}</p>
                  <div className="flex flex-row items-center gap-1">
                    <p className="text-sm font-semibold uppercase text-foreground/50">
                      Browse all {media_type}
                    </p>
                    <img
                      src="/assets/icons/chevron-forward.svg"
                      alt=""
                      className="invert-on-dark opacity-50"
                    />
                  </div>
                </div>
              </Link>
            </div>
            <div className="border-y border-foreground/20 p-2 lg:border-none lg:p-0">
              {postsOfMedia && (
                <div>
                  {postsOfMedia.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-2">
                          {/* <div className="w-[24px] h-[24px] rounded-full bg-accent "></div> */}
                          <h2 className="text-xl font-bold">User posts</h2>
                        </div>
                        <ScrollButtons
                          containerId="user_posts"
                          scrollPercent={30}
                        ></ScrollButtons>
                      </div>
                      <div className="relative">
                        <div className="gradient-edge absolute right-0 top-0 z-10 h-full w-[5%]"></div>
                        <div
                          className="hidden-scrollbar flex flex-row flex-nowrap gap-2 overflow-x-auto pb-2"
                          id="user_posts"
                        >
                          {postsOfMedia?.slice(0, 9).map((post: any) => (
                            <div className="w-[92vw] flex-shrink-0 lg:w-fit">
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
          <div className="custom-scrollbar flex flex-col px-2 lg:w-[25%]">
            <p className="mb-2 text-lg font-bold">Recommendations</p>
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
                  <MediaCardSmall
                    media_id={media.id}
                    media_type={media.media_type}
                    user_id={user.user.id.toString()}
                  ></MediaCardSmall>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
