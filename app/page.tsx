// app/page.tsx or app/home/page.tsx (example path)
import {
  getCurrentUser,
  getTopMovieGenresForUser,
  getTopTvGenresForUser,
} from "@/utils/supabase/serverQueries";

import { MobileVideoProvider } from "@/context/MobileVideoContext";
import Banner_90x728 from "@/components/ads/Banner_90x728";

import { fetchContinueWatching } from "@/utils/serverFunctions/homeFunctions";
import { fetchPostsData } from "@/utils/serverFunctions/fetchPostsData";

import MobileTopBarHome from "./protected/home/MobileTopBarHome";
import GenreSelector from "./protected/home/GenreSelectorHome";
import InfiniteScrollHome from "./protected/home/InfiniteScrollHome";
import HomeMediaCardUI from "./protected/home/HomeMediaCardUI";
import HomePostCardUI from "@/components/post/HomePostCardUI";
import HorizontalScroll from "./protected/home/horizontal_scroll";

export default async function Page() {
  try {
    const user = await getCurrentUser();

    // If no user, render "logged-out" version quickly
    if (!user) {
      return (
        <>
          <MobileTopBarHome />
          <div className="flex w-full flex-col gap-4 lg:pr-8">
            <GenreSelector />
            <div className="hidden w-full items-center justify-center lg:mt-8 lg:flex">
              <Banner_90x728 />
            </div>
            <InfiniteScrollHome />
          </div>
        </>
      );
    }

    const user_id = user.id.toString();

    // Fetch everything in parallel
    const [followedPosts, continue_watching, movie_genres, tv_genres] =
      await Promise.all([
        fetchPostsData(user_id),
        fetchContinueWatching(user_id),
        getTopMovieGenresForUser(undefined, user),
        getTopTvGenresForUser(undefined, user),
      ]);

    return (
      <MobileVideoProvider>
        <GenreSelector movie_genres={movie_genres} tv_genres={tv_genres} />

        {/* Only show Banner if user is not premium */}
        {!user?.premium && (
          <div className="mt-8 hidden w-full items-center justify-center lg:flex">
            <Banner_90x728 />
          </div>
        )}

        <div className="w-full lg:w-auto lg:py-0" id="main-content">
          <MobileTopBarHome />

          {/* CONTINUE WATCHING SECTION */}
          {continue_watching?.length > 0 && (
            <section className="mt-8">
              <div className="lg:rounded-[16px] lg:bg-foreground/10">
                <p className="hidden px-8 py-8 font-medium lg:flex lg:text-lg">
                  Continue Watching
                </p>
                <HorizontalScroll>
                  {continue_watching.map((media) => (
                    <div
                      key={media.id}
                      className="snap-start scroll-ml-4 lg:scroll-ml-8"
                    >
                      <HomeMediaCardUI
                        media={media}
                        user_id={user_id}
                        rounded
                      />
                    </div>
                  ))}
                </HorizontalScroll>
              </div>
            </section>
          )}

          {/* POSTS SECTION */}
          {followedPosts && followedPosts.length > 0 && (
            <section className="mt-8">
              <div className="relative">
                <div className="gradient-edge absolute right-0 top-0 z-20 h-full w-[5%]" />
                <div
                  className="hidden-scrollbar flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto px-4 lg:px-0 lg:pr-4"
                  id="rotten-posts-one"
                >
                  {followedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex w-[80vw] flex-shrink-0 snap-start scroll-ml-4 lg:w-fit"
                    >
                      <HomePostCardUI
                        post_media_data={post}
                        user_id={user_id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SUGGESTIONS / INFINITE SCROLL */}
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
    // Provide a fallback UI or redirect if needed
    return <div>Something went wrong. Please try again later.</div>;
  }
}
