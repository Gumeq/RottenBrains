import Link from "next/link";
import VideoEmbed from "@/components/MediaEmbed";
import WatchDuration from "@/components/WatchDuration";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import ScrollButtons from "@/components/explore/ScrollButtons";
import { getRelativeTime } from "@/lib/functions";
import MediaCardSmall from "@/components/MediaCardSmall";
import TVShowDetails from "@/components/TVSeasons";
import { getPostsOfMedia } from "@/utils/supabase/queries";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";

export async function generateMetadata({ params }: any) {
  const media_id = parseInt(params.media_id, 10);
  const media_type = "tv";
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
    title: `${media.title || media.name} Season ${season_number} Episode ${episode_number} - RottenBrains`,
    description: `${media.overview}`,
  };
}

export default async function mediaPage({
  params,
}: {
  params: {
    media_id: number;
    season_number: number;
    episode_number: number;
  };
}) {
  const media_id = params.media_id;
  const media_type = "tv";
  const season_number = params.season_number;
  const episode_number = Number(params.episode_number);

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

  if (media && media.seasons) {
    // Find next episode
    const seasons = media.seasons.filter(
      (season: { season_number: number }) => season.season_number !== 0,
    );

    const currentSeasonIndex = seasons.findIndex(
      (season: { season_number: number }) =>
        season.season_number === Number(season_number),
    );

    const currentSeason = seasons[Number(currentSeasonIndex)];

    if (currentSeason && episode_number < currentSeason.episode_count) {
      // Next episode in the same season
      nextEpisode = await getEpisodeDetails(
        media.id,
        season_number,
        episode_number + 1,
      );
    } else if (currentSeasonIndex + 1 < seasons.length) {
      // First episode of the next season
      const nextSeasonNumber = seasons[currentSeasonIndex + 1].season_number;
      nextEpisode = await getEpisodeDetails(media.id, nextSeasonNumber, 1);
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
          media_duration={episode.runtime || 100}
        />
      )}
      <div className="relative z-10 mx-auto mb-16 flex w-screen flex-col lg:w-[95vw] lg:max-w-[1700px]">
        <div className="small-screen-watch-margin flex flex-col lg:mt-4 lg:flex-row lg:gap-4">
          <div className="flex flex-col gap-4 lg:w-[75%]">
            <VideoEmbed
              media_type={media_type}
              media_id={media_id}
              season_number={season_number}
              episode_number={episode_number}
              media={media}
              episode={episode}
            />
            <div className="mx-auto flex w-[98vw] flex-col gap-4 rounded-[8px] bg-foreground/5 p-4 text-sm lg:w-full">
              <p className="">{episode.overview}</p>
              <div className="flew-warp flex flex-row gap-2">
                {media.genres.map((genre: any) => {
                  return (
                    <div className="rounded-[4px] bg-foreground/5 px-2 py-1 text-foreground/80">
                      {genre.name}
                    </div>
                  );
                })}
              </div>
              <p className="text-foreground/50">
                {getRelativeTime(episode.air_date)}
              </p>
              <Link
                href={`/protected/media/${media_type}/${media_id}`}
                className="flex h-32 w-full flex-row items-center gap-4 overflow-hidden rounded-[8px] bg-foreground/5"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                  alt={`${media.title || media.name} Poster`}
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
                      Details
                    </p>
                    <img
                      src="/assets/icons/chevron-forward.svg"
                      alt="Details"
                      className="invert-on-dark opacity-50"
                    />
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex w-full flex-col gap-4 px-4 lg:flex-row lg:p-0">
              {/* <Link
                href={`/protected/discover/${media_type}`}
                className="flex h-32 w-full flex-row items-center gap-4 rounded-[8px] bg-foreground/5 p-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <img
                    src={`/assets/icons/${media_type}-outline.svg`}
                    alt={`${media_type} Icon`}
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
                      alt="Browse"
                      className="invert-on-dark opacity-50"
                    />
                  </div>
                </div>
              </Link> */}
            </div>
            <div className="border-y border-foreground/20 lg:border-none lg:p-0">
              {postsOfMedia && postsOfMedia.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2">
                      <h2 className="text-xl font-bold">User posts</h2>
                    </div>
                    <ScrollButtons
                      containerId="user_posts"
                      scrollPercent={30}
                    />
                  </div>
                  <div className="relative">
                    <div className="gradient-edge absolute right-0 top-0 z-10 h-full w-[5%]"></div>
                    <div
                      className="hidden-scrollbar flex flex-row flex-nowrap gap-2 overflow-x-auto pb-2"
                      id="user_posts"
                    >
                      {postsOfMedia.slice(0, 9).map((post: any) => (
                        <div
                          className="w-[92vw] flex-shrink-0 lg:w-fit"
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
          </div>
          <div className="mt-2 flex flex-col gap-2 lg:w-[25%]">
            {nextEpisode && (
              <>
                <h3 className="px-2 font-semibold lg:px-0">Next Episode</h3>
                <Link
                  href={`/protected/watch/tv/${media.id}/${nextEpisode.season_number}/${nextEpisode.episode_number}`}
                >
                  <MediaCardSmall
                    media_type={"tv"}
                    media_id={media.id}
                    season_number={nextEpisode.season_number}
                    episode_number={nextEpisode.episode_number}
                    user_id={user?.user.id.toString()}
                    media={nextEpisode}
                  />
                </Link>
              </>
            )}
            <h3 className="px-2 font-semibold lg:px-0">All Episodes</h3>
            {media_type === "tv" && season_number && (
              <TVShowDetails
                tv_show_id={media_id}
                season_number={season_number}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
