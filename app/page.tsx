import { MobileVideoProvider } from "@/hooks/MobileVideoContext";
import Banner_90x728 from "@/components/features/ads/Banner_90x728";
import { fetchContinueWatching } from "@/lib/server/homeFunctions";
import { fetchPostsData } from "@/lib/server/fetchPostsData";
import HomePostCardUI from "@/components/features/posts/HomePostCardUI";
import {
  getCurrentUser,
  getTopMovieGenresForUser,
  getTopTvGenresForUser,
} from "@/lib/supabase/serverQueries";
import MediaCardUI from "@/components/features/media/MediaCardUI";
import NavTop from "@/components/features/navigation/mobile/NavTop";
import GenreSelector from "@/components/features/home/GenreSelector";
import InfiniteScrollHome from "@/components/features/home/InfiniteScroll";
import HorizontalScroll from "@/components/features/home/HorizontalScroll";
import { ErrorBoundary } from "@/components/common/ErrorBoundry";

export default async function Page() {
  const user = await getCurrentUser();

  // Render a basic "logged-out" version quickly if no user is available
  if (!user) {
    return (
      <>
        <NavTop />
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

  // Fetch data in parallel and handle errors gracefully using Promise.allSettled
  const [
    postsResult,
    continueWatchingResult,
    movieGenresResult,
    tvGenresResult,
  ] = await Promise.allSettled([
    fetchPostsData(user_id),
    fetchContinueWatching(user_id),
    getTopMovieGenresForUser(undefined, user),
    getTopTvGenresForUser(undefined, user),
  ]);

  const followedPosts =
    postsResult.status === "fulfilled" ? postsResult.value : [];
  const continue_watching =
    continueWatchingResult.status === "fulfilled"
      ? continueWatchingResult.value
      : [];
  const movie_genres =
    movieGenresResult.status === "fulfilled" ? movieGenresResult.value : [];
  const tv_genres =
    tvGenresResult.status === "fulfilled" ? tvGenresResult.value : [];

  return (
    <MobileVideoProvider>
      <GenreSelector movie_genres={movie_genres} tv_genres={tv_genres} />
      {!user?.premium && (
        <div className="mt-8 hidden w-full items-center justify-center lg:flex">
          <Banner_90x728 />
        </div>
      )}
      <div className="w-full lg:w-auto lg:py-0" id="main-content">
        <NavTop />

        <ErrorBoundary
          fallback={<div>Could not load "Continue Watching".</div>}
        >
          {continue_watching?.length > 0 && (
            <section className="mt-8">
              <div className="lg:rounded-[16px] lg:bg-foreground/10">
                <p className="hidden px-8 py-8 font-medium lg:flex lg:text-lg">
                  Continue Watching
                </p>
                <HorizontalScroll>
                  {continue_watching.map((media: any) => (
                    <div
                      key={media.id}
                      className="snap-start scroll-ml-4 lg:scroll-ml-8"
                    >
                      <MediaCardUI media={media} user_id={user_id} rounded />
                    </div>
                  ))}
                </HorizontalScroll>
              </div>
            </section>
          )}
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>Could not load posts.</div>}>
          {followedPosts && followedPosts.length > 0 && (
            <section className="mt-8">
              <div className="relative">
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
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </ErrorBoundary>

        <InfiniteScrollHome
          user_id={user.id}
          movie_genres={movie_genres}
          tv_genres={tv_genres}
        />
        <div className="h-16 w-full" />
      </div>
    </MobileVideoProvider>
  );
}
