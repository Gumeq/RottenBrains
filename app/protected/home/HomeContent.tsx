import {
  getNewestUsers,
  getNextEpisodes,
  getTopMovieGenresForUser,
  getTopTvGenresForUser,
} from "@/utils/supabase/queries";
import {
  getCurrentUser,
  getPostsFromFollowedUsers,
} from "@/utils/supabase/serverQueries";
import HomeMediaCard from "./HomeMediaCard";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import ScrollButtons from "@/components/explore/ScrollButtons";
import MobileTopBarHome from "./MobileTopBarHome";
import {
  getMovieRecommendationsForUser,
  getTvRecommendationsForUser,
} from "@/lib/recommendations";
import InfiniteScrollHome from "./InfiniteScrollHome";
import { MobileVideoProvider } from "@/context/MobileVideoContext";
import { getGenreNameById } from "@/lib/functions";
import { getFromGenres, getMediaDetails } from "@/utils/tmdb";
import { AlignVerticalJustifyEnd } from "lucide-react";
import GenreSelector from "./GenreSelectorHome";

const HomeContent = async () => {
  try {
    // Parallelize initial data fetching
    const [users, user] = await Promise.all([
      getNewestUsers(),
      getCurrentUser(),
    ]);

    if (!user || !users) {
      return null;
    }

    const userId = user.user.id.toString();

    // Fetch other data in parallel
    const [
      followedPosts,
      movieRecsData,
      topMovieGenres,
      topTvGenres,
      tvRecsData,
      nextEpisodes,
    ] = await Promise.all([
      getPostsFromFollowedUsers(userId, 0),
      getMovieRecommendationsForUser(userId, 1),
      getTopMovieGenresForUser(userId),
      getTopTvGenresForUser(userId),
      getTvRecommendationsForUser(userId, 1),
      getNextEpisodes(userId),
    ]);

    const movieRecommendations = movieRecsData.results;
    const tvRecommendations = tvRecsData.results;

    const topMovieGenreCode = topMovieGenres[0]?.genre_code;
    const topTvGenreCode = topTvGenres[0]?.genre_code;

    // Fetch genre media in parallel
    const [topMovieGenreMedia, topTvGenreMedia] = await Promise.all([
      getFromGenres("movie", 1, topMovieGenreCode),
      getFromGenres("tv", 1, topTvGenreCode),
    ]);

    const topMovieGenreName = getGenreNameById(Number(topMovieGenreCode));
    const topTvGenreName = getGenreNameById(Number(topTvGenreCode));

    // Optimize nextEpisodes processing
    const processedEpisodes = await Promise.all(
      nextEpisodes.map(async (episode) => {
        if (episode.episode_number && episode.next_episode) {
          // Fetch media details
          const details = await getMediaDetails(
            episode.media_type,
            episode.media_id,
          );

          if (
            episode.season_number ===
              details.last_episode_to_air.season_number &&
            episode.episode_number ===
              details.last_episode_to_air.episode_number
          ) {
            // Series finished, no more episodes
            episode.next_season_number = null;
            episode.next_episode_number = null;
          } else {
            const seasonNumber = episode.season_number;
            const currentSeason = details.seasons.find(
              (season: any) => season.season_number === seasonNumber,
            );

            if (
              currentSeason &&
              episode.episode_number < currentSeason.episode_count
            ) {
              // Next episode in the same season
              episode.next_season_number = episode.season_number;
              episode.next_episode_number = Number(episode.episode_number) + 1;
            } else if (
              currentSeason &&
              episode.episode_number === currentSeason.episode_count &&
              Number(episode.season_number) + 1 <=
                details.last_episode_to_air.season_number
            ) {
              // First episode of the next season
              episode.next_season_number = Number(episode.season_number) + 1;
              episode.next_episode_number = 1;
            }
          }
        }
        return episode;
      }),
    );

    return (
      <MobileVideoProvider>
        <GenreSelector user_id={userId}></GenreSelector>
        <div className="flex w-full flex-col gap-8 p-0 pb-4 lg:w-auto lg:p-4 lg:py-0">
          <MobileTopBarHome />
          {/* Watch History Section */}
          <div className="mt-4 rounded-[16px] pl-2 lg:p-0">
            <div className="mb-4 flex flex-row items-center justify-between">
              <h2 className="px-2 font-semibold lg:px-0 lg:text-lg">
                Continue Watching
              </h2>
              <ScrollButtons containerId="watch_history_main" />
            </div>
            <div className="w-full pl-4 lg:pl-0">
              <div>
                {processedEpisodes.length > 0 ? (
                  <div
                    className="hidden-scrollbar flex flex-row gap-4 overflow-x-auto"
                    id="watch_history_main"
                  >
                    {processedEpisodes.map((media) => {
                      if (
                        (media.media_type === "movie" &&
                          media.next_episode === true) ||
                        (media.media_type === "tv" &&
                          !media.next_episode_number &&
                          media.next_episode === true)
                      ) {
                        return null; // Skip rendering for watched movies
                      }

                      const isNextEpisodeAvailable =
                        media.media_type === "tv" &&
                        media.next_episode === true;

                      const episodeNumber = isNextEpisodeAvailable
                        ? media.next_episode_number
                        : media.episode_number;

                      const seasonNumber = isNextEpisodeAvailable
                        ? media.next_season_number
                        : media.season_number;

                      return (
                        <div key={media.media_id} className="h-auto w-screen">
                          <HomeMediaCard
                            user_id={user.user.id}
                            media_type={media.media_type}
                            media_id={media.media_id}
                            episode_number={episodeNumber || undefined}
                            season_number={seasonNumber || undefined}
                            rounded={true}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-[8px] bg-foreground/5">
                    <img
                      src="/assets/images/logo_new_black.svg"
                      alt=""
                      className="invert-on-dark h-16 w-16 opacity-50"
                    />
                    <p className="text-foreground/50">
                      Start watching to display history
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Posts Section */}
          <div className="">
            <div className="mb-4 flex flex-row items-center justify-between pl-4 lg:pl-0">
              <div className="flex flex-row items-center gap-2">
                <img
                  src="/assets/icons/review-outline.svg"
                  alt="Posts Icon"
                  className="invert-on-dark"
                />
                <h2 className="text-xl font-bold">Posts</h2>
              </div>
              <ScrollButtons containerId="rotten-posts-one" />
            </div>
            <div className="relative pl-4 lg:p-0">
              {followedPosts && followedPosts.length > 0 ? (
                <>
                  <div className="gradient-edge absolute right-0 top-0 z-20 h-full w-[5%]" />
                  <div
                    className="hidden-scrollbar flex flex-row gap-2 overflow-x-auto pr-[5%] lg:gap-4"
                    id="rotten-posts-one"
                  >
                    {followedPosts.map((post: any) => (
                      <div
                        key={post.id}
                        className="flex w-[80vw] flex-shrink-0 lg:w-fit"
                      >
                        <HomePostCardNew post={post} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-[8px] bg-foreground/5">
                  <img
                    src="/assets/images/logo_new_black.svg"
                    alt=""
                    className="invert-on-dark h-16 w-16 opacity-50"
                  />
                  <p className="text-foreground/50">
                    Follow friends to show recent posts
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Top Movie Genre Section */}
          <div>
            <div className="flex flex-col gap-4 pl-4 lg:pl-0">
              <div className="flex flex-row items-center justify-between lg:p-0">
                <div className="flex flex-row items-center gap-2">
                  <h2 className="font-bold">
                    Because you like {topMovieGenreName} movies
                  </h2>
                </div>
                <ScrollButtons containerId="top-genre-movies" />
              </div>
              <div
                className="hidden-scrollbar relative flex flex-row gap-4 overflow-x-auto"
                id={"top-genre-movies"}
              >
                {topMovieGenreMedia.results.length > 0 &&
                  topMovieGenreMedia.results.slice(0, 20).map((media: any) => (
                    <div key={media.id}>
                      <HomeMediaCard
                        user_id={user.user.id}
                        media_type="movie"
                        media_id={media.id}
                        rounded={true}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {/* Top TV Genre Section */}
          <div>
            <div className="flex flex-col gap-4 pl-4 lg:pl-0">
              <div className="flex flex-row items-center justify-between lg:p-0">
                <div className="flex flex-row items-center gap-2">
                  <h2 className="font-bold">
                    Because you like {topTvGenreName} shows
                  </h2>
                </div>
                <ScrollButtons containerId="top-genre-tv" />
              </div>
              <div
                className="hidden-scrollbar relative flex flex-row gap-4 overflow-x-auto"
                id={"top-genre-tv"}
              >
                {topTvGenreMedia.results.length > 0 &&
                  topTvGenreMedia.results.slice(0, 20).map((media: any) => (
                    <div key={media.id}>
                      <HomeMediaCard
                        user_id={user.user.id}
                        media_type="tv"
                        media_id={media.id}
                        rounded={true}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {/* TV Recommendations Section
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">More you might like</h2>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              }}
            >
              {tvRecommendations.length > 0 &&
                tvRecommendations.slice(0, 20).map((media: any) => (
                  <div key={media.id}>
                    <HomeMediaCard
                      user_id={user.user.id}
                      media_type="tv"
                      media_id={media.id}
                    />
                  </div>
                ))}
            </div>
          </div> */}
          {/* Infinite Scroll Section */}
          <h2 className="pl-4 font-semibold lg:pl-0">More you might like</h2>
          <InfiniteScrollHome user_id={user.user.id} />
          <div className="h-16 w-full" />
        </div>
      </MobileVideoProvider>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    // Display an error message or component
    return <div>Something went wrong. Please try again later.</div>;
  }
};

export default HomeContent;
