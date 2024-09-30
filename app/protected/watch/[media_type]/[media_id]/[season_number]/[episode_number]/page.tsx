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
        <div className="small-screen-watch-margin flex flex-col gap-4 md:flex-row lg:mt-4">
          <div className="flex flex-col gap-4 lg:w-[75%]">
            <VideoEmbed
              media_type={media_type}
              media_id={media_id}
              season_number={season_number}
              episode_number={episode_number}
            ></VideoEmbed>
            <div className="mx-auto flex w-[96vw] flex-col gap-2 rounded-[8px] bg-foreground/10 p-4 text-sm lg:w-full">
              <p className="font-semibold">
                {getRelativeTime(episode.air_date)}
              </p>
              <p>{episode.overview}</p>
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
                    {(media.release_date && media.release_date.slice(0, 4)) ||
                      media.first_air_date.slice(0, 4)}
                  </p>
                  <div className="flex flex-row items-center gap-1">
                    <p className="text-sm font-semibold uppercase text-foreground/50">
                      Browse {media_type}
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
