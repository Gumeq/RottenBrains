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
import WatchPageDetails from "@/components/WatchPageDetails";
type Params = Promise<{
  media_id: number;
  season_number: number;
  episode_number: number;
  media_type: string;
}>;

export async function generateMetadata({ params }: { params: Params }) {
  const { media_id } = await params;
  const { media_type } = await params;
  const { season_number } = await params;
  const { episode_number } = await params;

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

export default async function mediaPage({ params }: { params: Params }) {
  const { media_id } = await params;
  const { media_type } = await params;
  const { season_number } = await params;
  const { episode_number } = await params;

  console.log(media_type, media_id, season_number, episode_number);

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
        Number(episode_number) + 1,
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
      <div className="relative z-10 mb-16 flex w-screen flex-col lg:w-full lg:px-4">
        <div className="small-screen-watch-margin mx-auto flex flex-col lg:mt-4 lg:w-full lg:max-w-[1712px] lg:flex-row lg:gap-8">
          <div className="flex w-full flex-col gap-4 lg:max-w-[1280px]">
            <VideoEmbed
              media_type={media_type}
              media_id={media_id}
              season_number={season_number}
              episode_number={episode_number}
              media={media}
              episode={episode}
            />
            <WatchPageDetails
              media={media}
              media_type="tv"
              media_id={media.id}
              season_number={season_number}
              episode_number={episode_number}
              episode={episode}
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
          <div className="mt-2 flex flex-col gap-2 lg:mt-0 lg:max-w-[400px]">
            {nextEpisode && (
              <div className="flex flex-col gap-2 p-4 lg:rounded-[8px] lg:p-0">
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
                    rounded={true}
                  />
                </Link>
              </div>
            )}
            <h3 className="px-2 font-semibold lg:px-0">All Episodes</h3>
            {media_type === "tv" && season_number && (
              <TVShowDetails
                tv_show_id={media_id}
                season_number={season_number}
                user_id={user?.user.id.toString()}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
