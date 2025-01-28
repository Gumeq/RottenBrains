import {
  getCurrentUser,
  getLatestNewEpisodes,
  getPostsFromFollowedUsers,
  getTopMovieGenresForUser,
  getTopTvGenresForUser,
} from "@/utils/supabase/serverQueries";
import ScrollButtons from "@/components/explore/ScrollButtons";
import { MobileVideoProvider } from "@/context/MobileVideoContext";
import { getGenreNameById } from "@/lib/functions";
import { getFromGenres, getMediaDetails } from "@/utils/tmdb";
import InfiniteScrollHome from "./InfiniteScrollHome";
import GenreSelector from "./GenreSelectorHome";
import MobileTopBarHome from "./MobileTopBarHome";
import HomeMediaCard from "./HomeMediaCard";
import Banner_90x728 from "@/components/ads/Banner_90x728";
import {
  fetchContinueWatching,
  fetchNewEpisodes,
} from "@/utils/serverFunctions/homeFunctions";
import HomeMediaCardUI from "./HomeMediaCardUI";
import { fetchPostsData } from "@/utils/serverFunctions/fetchPostsData";
import HomePostCardUI from "@/components/post/HomePostCardUI";

const page = async () => {
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

    const user_id = user.id.toString();

    const [
      followedPosts,
      continue_watching,
      newEpisodes,
      movie_genres,
      tv_genres,
    ] = await Promise.all([
      fetchPostsData(user_id),
      fetchContinueWatching(user_id),
      fetchNewEpisodes(user_id),
      getTopMovieGenresForUser(undefined, user),
      getTopTvGenresForUser(undefined, user),
    ]);

    return (
      <MobileVideoProvider>
        <GenreSelector></GenreSelector>
        {!user && !user.premium && (
          <div className="mt-4 hidden w-full items-center justify-center lg:flex">
            <Banner_90x728></Banner_90x728>
          </div>
        )}
        <div className="flex w-full flex-col gap-8 p-0 pb-4 lg:w-auto lg:p-4 lg:py-0">
          <MobileTopBarHome />
          {/* Watch History Section */}
          {continue_watching.length > 0 ? (
            <div className="mt-4 rounded-[16px] lg:p-0">
              <div className="mb-4 flex flex-row items-center justify-between">
                <h2 className="px-2 font-semibold lg:px-0 lg:text-lg">
                  Continue Watching
                </h2>
                <ScrollButtons containerId="watch_history_main" />
              </div>
              <div className="w-full lg:pl-0">
                <div>
                  {continue_watching.length > 0 ? (
                    <div
                      className="hidden-scrollbar flex snap-x snap-mandatory flex-row gap-2 overflow-x-auto px-4"
                      id="watch_history_main"
                    >
                      {continue_watching.map((media) => {
                        return (
                          <HomeMediaCardUI media={media}></HomeMediaCardUI>
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
                          <HomePostCardUI
                            post_media_data={post}
                            user_id={user_id}
                          ></HomePostCardUI>
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
                      <HomeMediaCardUI
                        user_id={user_id}
                        media={media}
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
          {/* <div>
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
          </div> */}
          <h2 className="pl-4 font-semibold lg:pl-0">More you might like</h2>
          <InfiniteScrollHome
            user_id={user.id}
            movie_genres={movie_genres}
            tv_genres={tv_genres}
          />
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

export default page;
