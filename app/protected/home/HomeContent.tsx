import {
  getCurrentUser,
  getLatestNewEpisodes,
  getNextEpisodes,
  getPostsFromFollowedUsers,
  getTopMovieGenresForUser,
  getTopTvGenresForUser,
} from "@/utils/supabase/serverQueries";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import ScrollButtons from "@/components/explore/ScrollButtons";
import { MobileVideoProvider } from "@/context/MobileVideoContext";
import { getGenreNameById } from "@/lib/functions";
import { getFromGenres, getMediaDetails } from "@/utils/tmdb";
import InfiniteScrollHome from "./InfiniteScrollHome";
import GenreSelector from "./GenreSelectorHome";
import MobileTopBarHome from "./MobileTopBarHome";
import HomeMediaCard from "./HomeMediaCard";
import Banner_90x728 from "@/components/ads/Banner_90x728";
import Banner_250x300 from "@/components/ads/Banner_250x300";

const HomeContent = async () => {
  try {
    // Parallelize initial data fetching
    const user = await getCurrentUser();
    if (!user) {
      return (
        <>
          <MobileTopBarHome />
          <div className="flex w-full flex-col gap-4 lg:pr-8">
            <GenreSelector></GenreSelector>
            <div className="hidden w-full items-center justify-center lg:flex">
              <Banner_90x728></Banner_90x728>
            </div>
            <InfiniteScrollHome />
          </div>
        </>
      );
    }

    const userId = user.id.toString();
    const [
      followedPosts,
      topMovieGenres,
      topTvGenres,
      nextEpisodes,
      newEpisodes,
    ] = await Promise.all([
      getPostsFromFollowedUsers(userId, 0),
      getTopMovieGenresForUser(undefined, user),
      getTopTvGenresForUser(undefined, user),
      getNextEpisodes(userId),
      getLatestNewEpisodes(userId),
    ]);

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
        <GenreSelector></GenreSelector>
        {user && !user.premium && (
          <div className="mt-4 hidden w-full items-center justify-center lg:flex">
            <Banner_90x728></Banner_90x728>
          </div>
        )}
        <div className="flex w-full flex-col gap-8 p-0 pb-4 lg:w-auto lg:p-4 lg:py-0">
          <MobileTopBarHome />
          {/* Watch History Section */}
          {processedEpisodes.length > 0 ? (
            <div className="mt-4 rounded-[16px] lg:p-0">
              <div className="mb-4 flex flex-row items-center justify-between">
                <h2 className="px-2 font-semibold lg:px-0 lg:text-lg">
                  Continue Watching
                </h2>
                <ScrollButtons containerId="watch_history_main" />
              </div>
              <div className="w-full lg:pl-0">
                <div>
                  {processedEpisodes.length > 0 ? (
                    <div
                      className="hidden-scrollbar flex snap-x snap-mandatory flex-row gap-2 overflow-x-auto px-4"
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
                          return null;
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
                          <div
                            key={media.media_id}
                            className="h-auto w-screen snap-start scroll-ml-4"
                          >
                            <HomeMediaCard
                              user_id={user.id}
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
          ) : (
            <></>
          )}
          {/* Posts Section */}
          {followedPosts && followedPosts.length > 0 ? (
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
              <div className="relative">
                {followedPosts && followedPosts.length > 0 ? (
                  <>
                    <div className="gradient-edge absolute right-0 top-0 z-20 h-full w-[5%]" />
                    <div
                      className="hidden-scrollbar flex snap-x snap-mandatory flex-row gap-2 overflow-x-auto px-4"
                      id="rotten-posts-one"
                    >
                      {followedPosts.map((post: any) => (
                        <div
                          key={post.id}
                          className="flex w-[80vw] flex-shrink-0 snap-start scroll-ml-4 lg:w-fit"
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
          ) : (
            <></>
          )}
          {newEpisodes && newEpisodes.length > 0 ? (
            <div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between px-4 lg:p-0">
                  <div className="flex flex-row items-center gap-2">
                    <h2 className="font-bold">New Episodes</h2>
                  </div>
                  <ScrollButtons containerId="new-episodes" />
                </div>
                <div
                  className="hidden-scrollbar relative flex snap-x snap-mandatory flex-row gap-2 overflow-x-auto px-4"
                  id={"new-episodes"}
                >
                  {newEpisodes.slice(0, 10).map((media: any) => (
                    <div key={media.id} className="snap-start scroll-ml-4">
                      <HomeMediaCard
                        user_id={user.id}
                        media_type="tv"
                        media_id={media.tv_id}
                        season_number={media.season_number}
                        episode_number={media.episode_number}
                        rounded={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {/* Top Movie Genre Section */}
          <div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center justify-between px-4 lg:p-0">
                <div className="flex flex-row items-center gap-2">
                  <h2 className="font-bold">
                    Because you like {topMovieGenreName} movies
                  </h2>
                </div>
                <ScrollButtons containerId="top-genre-movies" />
              </div>
              <div
                className="hidden-scrollbar relative flex snap-x snap-mandatory flex-row gap-2 overflow-x-auto px-4"
                id={"top-genre-movies"}
              >
                {topMovieGenreMedia.results.length > 0 &&
                  topMovieGenreMedia.results.slice(0, 20).map((media: any) => (
                    <div key={media.id} className="snap-start scroll-ml-4">
                      <HomeMediaCard
                        user_id={user.id}
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
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center justify-between px-4 lg:p-0">
                <div className="flex flex-row items-center gap-2">
                  <h2 className="font-bold">
                    Because you like {topTvGenreName} shows
                  </h2>
                </div>
                <ScrollButtons containerId="top-genre-tv" />
              </div>
              <div
                className="hidden-scrollbar relative flex snap-x snap-mandatory flex-row gap-2 overflow-x-auto px-4"
                id={"top-genre-tv"}
              >
                {topTvGenreMedia.results.length > 0 &&
                  topTvGenreMedia.results.slice(0, 20).map((media: any) => (
                    <div key={media.id} className="snap-start scroll-ml-4">
                      <HomeMediaCard
                        user_id={user.id}
                        media_type="tv"
                        media_id={media.id}
                        rounded={true}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <h2 className="pl-4 font-semibold lg:pl-0">More you might like</h2>
          <InfiniteScrollHome user_id={user.id} />
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
