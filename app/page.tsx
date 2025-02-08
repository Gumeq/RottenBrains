import { MobileVideoProvider } from "@/hooks/MobileVideoContext";
import Banner_90x728 from "@/components/features/ads/Banner_90x728";
import {
  fetchContinueWatching,
  fetchNewEpisodes,
} from "@/lib/server/homeFunctions";
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
import AdBanner from "@/components/features/ads/GoogleDisplayAd";

export default async function Page() {
  const user = await getCurrentUser();

  // Render a basic "logged-out" version quickly if no user is available
  if (!user) {
    return (
      <>
        <NavTop />
        <div className="flex w-full flex-col gap-4 md:pr-8">
          <GenreSelector />
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
      <div
        className="flex w-full flex-col gap-8 md:w-auto md:py-0"
        id="main-content"
      >
        <NavTop />

        <ErrorBoundary
          fallback={<div>Could not load "Continue Watching".</div>}
        >
          {continue_watching?.length > 0 && (
            <section className="mt-14 md:mt-0">
              <div className="md:rounded-[16px] md:bg-foreground/10">
                <p className="hidden px-8 py-8 font-medium md:flex md:text-lg">
                  Continue Watching
                </p>
                <HorizontalScroll>
                  {continue_watching.map((media: any) => (
                    <div
                      key={media.id}
                      className="snap-start scroll-ml-4 md:scroll-ml-8"
                    >
                      <MediaCardUI media={media} user_id={user_id} rounded />
                    </div>
                  ))}
                </HorizontalScroll>
              </div>
            </section>
          )}
        </ErrorBoundary>
        {!user?.premium && (
          <div className="mx-auto w-full max-w-[800px]">
            <AdBanner
              dataAdFormat="auto"
              dataFullWidthResponsive={true}
              dataAdSlot="4196406083"
            />
          </div>
        )}
        <ErrorBoundary fallback={<div>Could not load posts.</div>}>
          {followedPosts && followedPosts.length > 0 && (
            <section className="">
              <div className="relative">
                <div className="gradient-edge absolute right-0 top-0 z-20 h-full w-[5%]" />
                <div
                  className="hidden-scrollbar flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto px-4 md:px-0 md:pr-4"
                  id="rotten-posts-one"
                >
                  {followedPosts.map((post: any) => (
                    <div
                      key={post.id}
                      className="flex w-[80vw] flex-shrink-0 snap-start scroll-ml-4 md:w-fit"
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

        <GenreSelector movie_genres={movie_genres} tv_genres={tv_genres} />

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
