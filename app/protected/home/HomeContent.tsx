import {
  getNewestUsers,
  getTopMovieGenresForUser,
  getTopTvGenresForUser,
  getWatchHistoryForUser,
} from "@/utils/supabase/queries";
import {
  getCurrentUser,
  getPostsFromFollowedUsers,
} from "@/utils/supabase/serverQueries";
import HomeMediaCard from "./HomeMediaCard";
import HomePostCardNew from "@/components/post/HomePostCardNew";
import { fetchExploreData } from "@/utils/clientFunctions/fetchExploreData";
import HomeMediaCardDisplay from "./HomeMediaCardDisplay";
import HomePostCard from "@/components/post/HomePostCard";
import ScrollButtons from "@/components/explore/ScrollButtons";
import { getRecommendations } from "@/utils/tmdb";
import { useToast } from "@/components/ui/use-toast";
import MobileTopBarHome from "./MobileTopBarHome";
import {
  getMovieRecommendationsForUser,
  getTvRecommendationsForUser,
} from "@/lib/recommendations";
import { Suspense } from "react";
import InfiniteScrollHome from "./InfiniteScrollHome";

// Server component fetching and displaying posts
const HomeContent = async () => {
  const users = await getNewestUsers();
  const user = await getCurrentUser();
  if (!user) {
    return;
  }
  if (!users) {
    return;
  }

  const watchHistory = await getWatchHistoryForUser(user.user.id, 20, 0);
  const filteredWatchHistory = watchHistory.filter(
    (item: any) => item.percentage_watched <= 90,
  );
  const followed_posts_one = await getPostsFromFollowedUsers(
    user.user.id.toString(),
    0,
  );
  const followed_posts_two = await getPostsFromFollowedUsers(
    user.user.id.toString(),
    1,
  );
  const now_in_cinemas = await fetchExploreData("Now_in_cinemas");
  const trending_tv = await fetchExploreData("Trending_TV");

  let movieRecommendations = await getMovieRecommendationsForUser(
    user.user.id,
    1,
  );
  let tvRecommendations = await getTvRecommendationsForUser(user.user.id, 1);
  movieRecommendations = movieRecommendations.results;
  tvRecommendations = tvRecommendations.results;

  return (
    <div className="flex w-screen flex-col gap-8 p-0 pb-4 lg:w-auto lg:p-4 lg:py-0">
      <MobileTopBarHome></MobileTopBarHome>
      <div className="mt-16 lg:mt-0">
        <div className="mb-4 flex flex-row items-center justify-between px-2 lg:p-0">
          <div className="flex flex-row items-center gap-2">
            <img
              src="/assets/icons/history.svg"
              alt=""
              width={24}
              height={24}
              className="invert-on-dark"
            />
            <h2 className="text-xl font-bold">Continue watching</h2>
          </div>
          <ScrollButtons containerId="watch_history_main"></ScrollButtons>
        </div>

        <div
          className="hidden-scrollbar flex flex-row gap-4 overflow-x-auto px-2 lg:px-0"
          id={"watch_history_main"}
        >
          {filteredWatchHistory &&
            filteredWatchHistory.slice(0, 20).map((media: any) => {
              return (
                <div className="inline-block h-auto w-[80vw] flex-shrink-0 lg:inline lg:w-auto">
                  <HomeMediaCard
                    user_id={user.user.id}
                    media_type={media.media_type}
                    media_id={media.media_id}
                    season_number={media.season_number}
                    episode_number={media.episode_number}
                    percentage_watched={parseFloat(media.percentage_watched)}
                  ></HomeMediaCard>
                </div>
              );
            })}
        </div>
      </div>
      <div>
        <div className="mb-4 flex flex-row items-center justify-between px-2 lg:p-0">
          <div className="flex flex-row items-center gap-2">
            <img
              src="/assets/icons/review-outline.svg"
              alt=""
              className="invert-on-dark"
            />
            <h2 className="text-xl font-bold">Latest Rotten Brains posts</h2>
          </div>
          <ScrollButtons containerId="rotten-posts-one"></ScrollButtons>
        </div>
        <div className="relative px-2 lg:p-0">
          <div className="gradient-edge absolute right-0 top-0 z-20 h-full w-[5%]"></div>
          <div
            className="hidden-scrollbar flex flex-row gap-4 overflow-x-auto pr-[5%]"
            id={"rotten-posts-one"}
          >
            {followed_posts_one &&
              followed_posts_one.map((post: any) => {
                return (
                  <>
                    <div className="hidden flex-shrink-0 lg:flex">
                      <HomePostCardNew post={post}></HomePostCardNew>
                    </div>
                    <div className="flex flex-shrink-0 lg:hidden">
                      <HomePostCard post={post}></HomePostCard>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4 flex flex-row items-center gap-2 px-2 lg:p-0">
          <img
            src="/assets/icons/movie-outline.svg"
            alt=""
            className="invert-on-dark"
          />
          <h2 className="text-xl font-bold">Now in cinemas</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 px-4 lg:grid-cols-4 lg:p-0 2xl:grid-cols-8">
          {now_in_cinemas &&
            now_in_cinemas.results.slice(0, 8).map((media: any) => {
              return (
                <HomeMediaCardDisplay
                  media={media}
                  media_type={"movie"}
                ></HomeMediaCardDisplay>
              );
            })}
        </div>
      </div>

      <div>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          }}
        >
          {movieRecommendations.length > 0 &&
            movieRecommendations.slice(0, 20).map((media: any) => {
              return (
                <HomeMediaCard
                  key={media.id}
                  user_id={user.user.id}
                  media_type={"movie"}
                  media_id={media.id}
                />
              );
            })}
        </div>
      </div>
      <div>
        <div className="mb-4 flex flex-row items-center justify-between px-2 lg:p-0">
          <div className="flex flex-row items-center gap-2">
            <img
              src="/assets/icons/review-outline.svg"
              alt=""
              className="invert-on-dark"
            />
            <h2 className="text-xl font-bold">Older Rotten Brains posts</h2>
          </div>
          <ScrollButtons containerId="rotten-posts-two"></ScrollButtons>
        </div>
        <div className="relative px-2 lg:p-0">
          <div className="gradient-edge absolute right-0 top-0 z-20 h-full w-[5%]"></div>
          <div
            className="hidden-scrollbar flex flex-row gap-4 overflow-x-auto pr-[5%]"
            id={"rotten-posts-two"}
          >
            {followed_posts_two &&
              followed_posts_two.map((post: any) => {
                return (
                  <>
                    <div className="hidden flex-shrink-0 lg:flex">
                      <HomePostCardNew post={post}></HomePostCardNew>
                    </div>
                    <div className="flex flex-shrink-0 lg:hidden">
                      <HomePostCard post={post}></HomePostCard>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </div>
      <div>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          }}
        >
          {tvRecommendations.length > 0 &&
            tvRecommendations.slice(0, 20).map((media: any) => {
              return (
                <HomeMediaCard
                  user_id={user.user.id}
                  media_type={"tv"}
                  media_id={media.id}
                ></HomeMediaCard>
              );
            })}
        </div>
      </div>
      <div>
        <div className="mb-4 flex flex-row items-center gap-2 px-2 lg:px-0">
          <img
            src="/assets/icons/tv-outline.svg"
            alt=""
            className="invert-on-dark"
          />
          <h2 className="text-xl font-bold">Trending tv shows</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 px-4 lg:grid-cols-4 lg:p-0 2xl:grid-cols-8">
          {trending_tv &&
            trending_tv.results.slice(0, 8).map((media: any) => {
              return (
                <HomeMediaCardDisplay
                  media={media}
                  media_type={"movie"}
                ></HomeMediaCardDisplay>
              );
            })}
        </div>
      </div>
      {/* <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recommendations.length > 40 &&
            recommendations
              .slice(40, recommendations.length)
              .map((media: any) => {
                return (
                  <HomeMediaCard
                    user_id={user.user.id}
                    media_type={"movie"}
                    media_id={media.id}
                  ></HomeMediaCard>
                );
              })}
        </div>
      </div> */}
      {/* <InfiniteScrollHome user_id={user.user.id}></InfiniteScrollHome> */}
      <div className="h-16 w-full"></div>
    </div>
  );
};

export default HomeContent;
