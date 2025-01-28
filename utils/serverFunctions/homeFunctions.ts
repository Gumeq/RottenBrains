import { getNextEpisodes } from "../supabase/serverQueries";
import { getMediaDetails } from "../tmdb";
import { fetchMediaData } from "./fetchMediaData";

export async function fetchContinueWatching(user_id: string) {
  const continue_watching_media_array = await getNextEpisodes(user_id);
  const processed = await Promise.all(
    continue_watching_media_array.map(async (media: any) => {
      const processed = { ...media };
      processed.episode_number =
        processed.episode_number === -1 ? undefined : processed.episode_number;
      processed.season_number =
        processed.season_number === -1 ? undefined : processed.season_number;

      if (!processed.next_episode) {
        return processed;
      }

      if (processed.episode_number && processed.next_episode) {
        const details = await getMediaDetails(media.media_type, media.media_id);
        if (
          processed.season_number ===
            details.last_episode_to_air.season_number &&
          processed.episode_number ===
            details.last_episode_to_air.episode_number
        ) {
          // series finished no more episodes
          processed.next_episode = false;
          processed.next_season_number = undefined;
          processed.next_episode_number = undefined;
          return null;
        } else {
          const seasonNumber = processed.season_number;
          const currentSeason = details.seasons.find(
            (season: any) => season.season_number === seasonNumber,
          );
          if (
            currentSeason &&
            processed.episode_number < currentSeason.episode_count
          ) {
            // Next episode in the same season
            processed.episode_number = Number(processed.episode_number) + 1;
            return processed;
          } else if (
            currentSeason &&
            processed.episode_number === currentSeason.episode_count &&
            Number(processed.season_number) + 1 <=
              details.last_episode_to_air.season_number
          ) {
            // First episode of the next season
            processed.season_number = Number(processed.season_number) + 1;
            processed.episode_number = 1;
            return processed;
          }
        }
      }
    }),
  );

  const post_processed = processed.map((media) => {
    const post_processed = { ...media };
    if (!post_processed.episode_number) {
      return;
    }
    if (
      (post_processed.media_type === "movie" &&
        post_processed.next_episode === true) ||
      (post_processed.media_type === "tv" &&
        !post_processed.next_episode_number &&
        post_processed.next_episode === true)
    ) {
      return;
    } else {
      return post_processed;
    }
  });
  const post_processed_not_null = processed.filter(
    (item) => item !== null || undefined,
  );
  const post_process_data = await Promise.all(
    post_processed_not_null.map((media) => {
      return fetchMediaData(
        media.media_id,
        media.media_type,
        user_id,
        media.season_number,
        media.episode_number,
      );
    }),
  );
  return post_process_data;
}
