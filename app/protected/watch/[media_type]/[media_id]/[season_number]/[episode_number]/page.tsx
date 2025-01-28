import Link from "next/link";
import VideoEmbed from "@/components/MediaEmbed";
import WatchDuration from "@/components/WatchDuration";
import ScrollButtons from "@/components/explore/ScrollButtons";
import { getRelativeTime } from "@/lib/functions";
import MediaCardSmall from "@/components/MediaCardSmall";
import TVShowDetails from "@/components/TVSeasons";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import { getEpisodeDetails, getMediaDetails } from "@/utils/tmdb";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import WatchPageDetails from "@/components/WatchPageDetails";
import NativeAd from "@/components/ads/Native";
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
          user_id={user.id}
          media_duration={episode.runtime || 100}
        />
      )}
      <div className="relative z-10 mb-16 flex w-full flex-col lg:w-full lg:px-4">
        <div className="small-screen-watch-margin mx-auto flex w-full flex-col lg:mt-4 lg:w-full lg:max-w-[1712px] lg:flex-row lg:gap-8">
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
          </div>
          <div className="flex flex-col gap-2 lg:mt-0 lg:max-w-[400px]">
            {user && !user.premium && (
              <div className="hidden w-full items-center justify-center lg:flex">
                <NativeAd></NativeAd>
              </div>
            )}
            {nextEpisode && (
              <div className="flex flex-col gap-2 lg:rounded-[8px] lg:p-0">
                <h3 className="px-2 font-semibold lg:px-0">Next Episode</h3>
                <Link
                  href={`/protected/watch/tv/${media.id}/${nextEpisode.season_number}/${nextEpisode.episode_number}`}
                  className="px-4 lg:px-0"
                >
                  <MediaCardSmall
                    media_type={"tv"}
                    media_id={media.id}
                    season_number={nextEpisode.season_number}
                    episode_number={nextEpisode.episode_number}
                    user_id={user?.id.toString()}
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
                user_id={user?.id.toString()}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
