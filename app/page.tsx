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
import Banner_90x728 from "@/components/ads/Banner_90x728";
import {
  fetchContinueWatching,
  fetchNewEpisodes,
} from "@/utils/serverFunctions/homeFunctions";
import { fetchPostsData } from "@/utils/serverFunctions/fetchPostsData";
import HomePostCardUI from "@/components/post/HomePostCardUI";
import MobileTopBarHome from "./protected/home/MobileTopBarHome";
import GenreSelector from "./protected/home/GenreSelectorHome";
import InfiniteScrollHome from "./protected/home/InfiniteScrollHome";
import HomeMediaCardUI from "./protected/home/HomeMediaCardUI";
import ContinueWatchingRow from "./protected/home/continue_watching_window";
import HorizontalScroll from "./protected/home/horizontal_scroll";

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
            <div className="hidden w-full items-center justify-center lg:mt-8 lg:flex">
              <Banner_90x728></Banner_90x728>
            </div>
            <InfiniteScrollHome />
          </div>
        </>
      );
    }

    const user_id = user.id.toString();

    const [followedPosts, continue_watching, movie_genres, tv_genres] =
      await Promise.all([
        fetchPostsData(user_id),
        fetchContinueWatching(user_id),
        getTopMovieGenresForUser(undefined, user),
        getTopTvGenresForUser(undefined, user),
      ]);

    return (
      <MobileVideoProvider>
        <GenreSelector
          movie_genres={movie_genres}
          tv_genres={tv_genres}
        ></GenreSelector>
        {user?.premium || (
          <div className="mt-8 hidden w-full items-center justify-center lg:flex">
            <Banner_90x728></Banner_90x728>
          </div>
        )}
        <div className="w-full lg:w-auto lg:py-0" id={"main-content"}>
          <MobileTopBarHome />
          {/* Watch History Section */}
          {continue_watching.length > 0 ? (
            <div className="mt-8">
              <div className="w-full lg:pl-0">
                {continue_watching.length > 0 ? (
                  <div className="lg:rounded-[16px] lg:bg-foreground/10">
                    <p className="hidden px-8 py-8 font-medium lg:flex lg:text-lg">
                      Continue Watching
                    </p>
                    <HorizontalScroll>
                      {continue_watching.map((media) => {
                        return (
                          <div className="snap-start scroll-ml-4 lg:scroll-ml-8">
                            <HomeMediaCardUI
                              media={media}
                              user_id={user_id}
                              rounded
                            ></HomeMediaCardUI>
                          </div>
                        );
                      })}
                    </HorizontalScroll>
                  </div>
                ) : (
                  <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-[8px] bg-foreground/10 lg:mt-8">
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
          ) : (
            <></>
          )}
          {/* Posts Section */}
          {followedPosts && followedPosts.length > 0 ? (
            <div className="mt-8">
              {/* <div className="mb-4 flex flex-row items-center justify-between pl-4 lg:pl-0">
                <div className="flex flex-row items-center gap-4">
                  <img
                    src="/assets/icons/review-outline.svg"
                    alt="Posts Icon"
                    className="invert-on-dark"
                  />
                  <h2 className="text-xl font-bold">Posts</h2>
                </div>
                <ScrollButtons containerId="rotten-posts-one" />
              </div> */}
              <div className="relative">
                {followedPosts && followedPosts.length > 0 ? (
                  <>
                    <div className="gradient-edge absolute right-0 top-0 z-20 h-full w-[5%]" />
                    <div
                      className="hidden-scrollbar flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto px-4 lg:px-0 lg:pr-4"
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
                  <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-[8px] bg-foreground/10 lg:mt-8">
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
          {/* <h2 className="pl-4 font-semibold lg:pl-0">More you might like</h2> */}
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
