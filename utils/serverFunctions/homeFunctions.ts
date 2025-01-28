export async function fetchContinueWatching(
  continue_watching_media_array: any,
) {}

// const processedEpisodes = await Promise.all(
//       nextEpisodes.map(async (episode) => {
//         if (episode.episode_number && episode.next_episode) {
//           // Fetch media details
//           const details = await getMediaDetails(
//             episode.media_type,
//             episode.media_id,
//           );

//           if (
//             episode.season_number ===
//               details.last_episode_to_air.season_number &&
//             episode.episode_number ===
//               details.last_episode_to_air.episode_number
//           ) {
//             // Series finished, no more episodes
//             episode.next_season_number = null;
//             episode.next_episode_number = null;
//           } else {
//             const seasonNumber = episode.season_number;
//             const currentSeason = details.seasons.find(
//               (season: any) => season.season_number === seasonNumber,
//             );

//             if (
//               currentSeason &&
//               episode.episode_number < currentSeason.episode_count
//             ) {
//               // Next episode in the same season
//               episode.next_season_number = episode.season_number;
//               episode.next_episode_number = Number(episode.episode_number) + 1;
//             } else if (
//               currentSeason &&
//               episode.episode_number === currentSeason.episode_count &&
//               Number(episode.season_number) + 1 <=
//                 details.last_episode_to_air.season_number
//             ) {
//               // First episode of the next season
//               episode.next_season_number = Number(episode.season_number) + 1;
//               episode.next_episode_number = 1;
//             }
//           }
//         }
//         return episode;
//       }),
//     );

// {processedEpisodes.map((media) => {
// if (
//   (media.media_type === "movie" &&
//     media.next_episode === true) ||
//   (media.media_type === "tv" &&
//     !media.next_episode_number &&
//     media.next_episode === true)
// ) {
//   return null;
// }

// const isNextEpisodeAvailable =
//   media.media_type === "tv" &&
//   media.next_episode === true;

// const episodeNumber = isNextEpisodeAvailable
//   ? media.next_episode_number
//   : media.episode_number;

// const seasonNumber = isNextEpisodeAvailable
//   ? media.next_season_number
//   : media.season_number;

// return
