import EpisodeCard from "@/components/EpisodeCard";
import ExploreTab from "@/components/explore/ExploreTab";
import ScrollButtons from "@/components/explore/ScrollButtons";
import GoBackArrow from "@/components/GoBackArrow";
import VideoEmbed from "@/components/MediaEmbed";
import MediaInfoComponent from "@/components/MediaInfoComponent";
import HomePostCard from "@/components/post/HomePostCard";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import TVShowDetails from "@/components/TVSeasons";
import WatchDuration from "@/components/WatchDuration";
import { getRelativeTime } from "@/lib/functions";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getPostsOfMedia, upsertWatchHistory } from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import Link from "next/link";

export async function generateMetadata({ params }: any) {
  const media_id = parseInt(params.media_id, 10);
  const media_type = params.media_type;
  const season_number = parseInt(params.season_number);
  const episode_number = parseInt(params.episode_number);

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
    title: `${media.title || media.name} Season ${season_number} Episode ${episode_number}  - RottenBrains`,
    description: `${media.overview}`,
  };
}

export default async function mediaPage({
  params,
}: {
  params: {
    media_type: string;
    media_id: number;
    season_number: number;
    episode_number: number;
  };
}) {
  const media_id = params.media_id;
  const media_type = params.media_type;
  const season_number = params.season_number;
  const episode_number = params.episode_number;

  const user = await getCurrentUser();

  let postsOfMedia: any = [];
  if (user) {
    postsOfMedia = await getPostsOfMedia(user.user.id, media_type, media_id, 0);
  }

  const media = await getMediaDetails(media_type, media_id);
  const episode = await getEpisodeDetails(
    media_id,
    season_number,
    episode_number,
  );

  let nextEpisode = null;

  if (
    media_type === "tv" &&
    season_number !== undefined &&
    episode_number !== undefined
  ) {
    const seasonIndex = season_number;
    const currentSeason = media.seasons[seasonIndex];
    if (currentSeason && episode_number < currentSeason.episode_count) {
      // Next episode in the same season
      nextEpisode = await getEpisodeDetails(
        media.id,
        season_number,
        Number(episode_number) + 1,
      );
    } else if (Number(seasonIndex) + 1 < media.seasons.length) {
      // First episode of the next season
      const nextSeason = media.seasons[Number(seasonIndex) + 1].season_number;
      console.log(nextSeason);
      nextEpisode = await getEpisodeDetails(media.id, nextSeason, 1);
    }
  }

  return (
    <>
      {user && (
        <WatchDuration
          media_type={media_type}
          media_id={media_id}
          season_number={season_number}
          episode_number={episode_number}
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
              season_number={season_number}
              episode_number={episode_number}
            ></VideoEmbed>
            <div className="hidden w-full flex-col gap-2 rounded-[16px] bg-foreground/10 p-4 text-sm lg:flex">
              <p className="font-semibold">
                {getRelativeTime(episode.air_date)}
              </p>
              <p>{episode.overview}</p>
            </div>
            <div className="">
              {postsOfMedia && (
                <div>
                  {postsOfMedia.length > 0 && (
                    <div className="flex flex-col gap-4">
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
          <div className="flex flex-col gap-2 md:w-[25%]">
            <h3 className="px-2 font-semibold lg:px-0">Next Episode</h3>
            {nextEpisode && (
              <Link
                href={`/protected/watch/${media_type}/${media.id}/${nextEpisode.season_number}/${nextEpisode.episode_number}`}
              >
                <EpisodeCard
                  media_id={media.id}
                  season_number={nextEpisode.season_number}
                  episode_number={nextEpisode.episode_number}
                ></EpisodeCard>
              </Link>
            )}
            <br />
            <h3 className="px-2 font-semibold lg:px-0">All Episodes</h3>
            {media_type === "tv" && season_number && (
              <TVShowDetails
                tv_show_id={media_id}
                season_number={season_number}
              ></TVShowDetails>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

{
  /* <div className="md:w-[25%] h-full">
	<div>
		{media_type === "tv" && season_number && (
			<TVShowDetails
				tv_show_id={media_id}
				season_number={season_number}
			></TVShowDetails>
		)}
	</div>
</div>; */
}
