import ExploreCard from "@/components/explore/ExploreCard";
import GoBackArrow from "@/components/GoBackArrow";
import HomePostCard from "@/components/post/HomePostCard";
import YouTubeEmbed from "@/components/YoutubeEmbed";
import { fetchMediaData } from "@/utils/clientFunctions/fetchMediaData";
import { getPostsOfMedia } from "@/utils/supabase/queries";
import {
  getMediaCredits,
  getMediaDetails,
  getRecommendations,
  getReviews,
  getSimilar,
  getVideos,
} from "@/utils/tmdb";
import Link from "next/link";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";
import { getCurrentUser } from "@/utils/supabase/serverQueries";
import HomePostCardNew from "@/components/post/HomePostCardNew";

function transformRuntime(minutes: number): string {
  const hours: number = Math.floor(minutes / 60);
  const remainingMinutes: number = minutes % 60;

  if (hours > 0) {
    return `${hours} h ${remainingMinutes} m`;
  } else {
    if (remainingMinutes > 0) {
      return `${remainingMinutes} m`;
    } else {
      return "N/A";
    }
  }
}
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

export async function generateMetadata({ params }: any) {
  const media_id = parseInt(params.media_id, 10);
  const media_type = params.media_type;

  let mediaData;
  try {
    mediaData = await fetchMediaData(media_type, media_id);
  } catch (error) {
    console.error("Error fetching media data:", error);
    mediaData = null;
  }
  const media = mediaData;

  if (!media) {
    return {
      title: "No Media Found",
      description:
        "Connect with fellow enthusiasts and dive deep into your favorite media.",
    };
  }

  return {
    title: `${media.title || media.name} - RottenBrains`,
    description: `${media.overview}`,
  };
}

async function getTrailerOrFirstFive(media_type: string, media_id: number) {
  const mediaVideos = await getVideos(media_type, media_id);

  const trailers = mediaVideos.results.filter(
    (video: any) => video.type === "Trailer",
  );

  if (trailers.length > 0) {
    return trailers;
  } else {
    if (mediaVideos && mediaVideos.length > 0) {
      return mediaVideos.slice(0, 5);
    } else {
      return;
    }
  }
}

async function separateCredits(media_type: string, media_id: number) {
  const mediaCredits = await getMediaCredits(media_type, media_id);

  let directorOrCreator: any | null = null;
  let writers: any[] | null = null;
  let actors: any[] | null = null;

  // Find director or creator
  const director = mediaCredits.crew.find(
    (member: any) => member.job === "Director",
  );
  const creator = mediaCredits.crew.find(
    (member: any) => member.job === "Creator",
  );
  if (director) {
    directorOrCreator = director;
  } else if (creator) {
    directorOrCreator = creator;
  }

  // Find writers
  const writersList = mediaCredits.crew.filter(
    (member: any) => member.department === "Writing",
  );
  if (writersList.length > 0) {
    writers = writersList.map((writer: any) => writer);
  }

  // Find actors
  if (mediaCredits.cast.length > 0) {
    actors = mediaCredits.cast.map((actor: any) => actor);
  }

  return {
    directorOrCreator,
    writers,
    actors,
  };
}

export default async function mediaPage({
  params,
}: {
  params: { media_type: string; media_id: any };
}) {
  const media_id = parseInt(params.media_id, 10);
  const media_type = params.media_type;
  let mediaData;
  try {
    mediaData = await getMediaDetails(media_type, media_id);
  } catch (error) {
    console.error("Error fetching media data:", error);
    mediaData = null;
  }
  const media = mediaData;
  if (!media) {
    return <h1>No Media Found</h1>;
  }

  const user = await getCurrentUser();

  let postsOfMedia: any = [];
  if (user) {
    postsOfMedia = await getPostsOfMedia(user.user.id, media_type, media_id, 0);
  }
  const mediaVideos = await getVideos(media_type, media_id);
  const trailers = await getTrailerOrFirstFive(media_type, media_id);
  const mediaRecommendations = await getRecommendations(media_type, media_id);
  const mediaSimilar = await getSimilar(media_type, media_id);
  const mediaReviews = await getReviews(media_type, media_id);
  const mediaCredits = await separateCredits(media_type, media_id);

  const watchLink =
    media_type === "movie"
      ? `/protected/watch/${media_type}/${media.id}`
      : `/protected/watch/${media_type}/${media.id}/1/1`;

  return (
    <div className="relative lg:w-full">
      <div className="fixed z-20 flex h-16 w-full flex-row items-center gap-4 bg-white/10 px-4 backdrop-blur-xl lg:hidden">
        <GoBackArrow />
        <p className="truncate text-lg">{media.title || media.name}</p>
      </div>
      {/* <div className="">
				<img
					src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
					alt=""
					className="w-screen h-[300vh] object-cover blur-[100px] absolute top-0 mask2 opacity-30 overflow-hidden bg-black"
				/>
			</div> */}
      <div className="relative h-auto w-screen py-4 lg:w-auto">
        <div
          className="relative mt-16 flex h-auto w-screen lg:w-auto"
          id="overview"
        >
          <div className="mx-auto flex h-full w-screen flex-col gap-4 px-2 lg:my-8 lg:w-auto lg:gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-4xl">{media.title || media.name}</p>
              {media.tagline && (
                <p className="italic opacity-50">"{media.tagline}"</p>
              )}
              <div className="">
                <div className="flex h-full flex-col justify-between gap-2 lg:flex-row lg:items-center">
                  <div className="flex flex-row items-center gap-4 opacity-50">
                    <p className="">
                      {(media.release_date && media.release_date.slice(0, 4)) ||
                        media.first_air_date.slice(0, 4)}
                    </p>
                    {media_type === "tv" && (
                      <>
                        <div className="h-2 w-2 rounded-full bg-foreground"></div>
                        <p>TV-{media.number_of_seasons}</p>
                      </>
                    )}
                    <div className="h-2 w-2 rounded-full bg-foreground"></div>
                    <p>
                      {media_type === "movie"
                        ? transformRuntime(media.runtime)
                        : transformRuntime(media.episode_run_time)}
                    </p>
                  </div>
                  <div className="flex h-full flex-row items-center justify-between gap-4">
                    <Link
                      href={`/protected/create-post/${media_type}/${media_id}`}
                      className="z-10 flex flex-row items-center gap-2 rounded-[8px] bg-foreground/10 px-6 py-2 drop-shadow-lg hover:scale-105"
                    >
                      <img
                        src="/assets/icons/star-outline.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="invert-on-dark"
                        loading="lazy"
                      />
                      <p className="text-lg">Rate</p>
                    </Link>
                    <div className="flex flex-row items-center gap-2 rounded-[8px] bg-foreground/20 px-6 py-2 drop-shadow-lg">
                      <img
                        src="/assets/icons/star-solid.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="invert-on-dark"
                        loading="lazy"
                      />
                      <p className="text-foreground/50">
                        <span className="text-lg text-foreground/100">
                          {media.vote_average.toFixed(1)}
                        </span>
                        /10 <span>({formatNumber(media.vote_count)})</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-auto flex-col gap-4 lg:h-[45vh] lg:flex-row lg:gap-8">
              <div className="h-full">
                <img
                  src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                  alt=""
                  className="h-full rounded-[4px] drop-shadow-lg"
                />
              </div>
              <div className="relative h-full">
                <Link
                  className="absolute bottom-0 z-10 m-4 flex flex-row items-center gap-2 rounded-[8px] bg-black/20 px-6 py-2 drop-shadow-lg backdrop-blur-lg hover:scale-105"
                  href={watchLink}
                >
                  <img
                    src="/assets/icons/play-solid.svg"
                    alt=""
                    className="h-[20px] w-[20px] invert"
                  />
                  <p className="text-white">Watch</p>
                </Link>
                <img
                  src={`https://image.tmdb.org/t/p/w1280${media.backdrop_path}`}
                  alt=""
                  className="h-full rounded-[4px] drop-shadow-lg"
                />
              </div>
            </div>
            <div className="flex w-full flex-row gap-4 px-2 lg:w-auto">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4">
                  <p className="w-[100px] text-xl font-bold text-foreground/50">
                    Genre
                  </p>
                  <div className="flex w-[60vw] flex-row flex-wrap gap-2 lg:w-[300px] xl:w-[600px]">
                    {mediaData.genres.map((genre: any) => (
                      <div className="flex items-center rounded-full bg-foreground/20 px-6 py-2 text-center">
                        {genre.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="w-[100px] text-wrap text-xl font-bold text-foreground/50">
                    Plot
                  </p>
                  <p className="w-[60vw] lg:w-[300px] xl:w-[600px]">
                    {mediaData.overview}
                  </p>
                </div>

                <div className="flex flex-row gap-4">
                  <p className="w-[100px] text-xl font-bold text-foreground/50">
                    {media_type === "movie" ? "Director" : "Creator"}
                  </p>
                  <div className="w-[60vw] lg:w-[300px] xl:w-[600px]">
                    {media_type === "movie"
                      ? mediaCredits.directorOrCreator?.name
                      : mediaData.created_by[0]?.name}
                  </div>
                </div>

                <div className="flex flex-row gap-4">
                  <p className="w-[100px] text-xl font-bold text-foreground/50">
                    Writers
                  </p>
                  <span className="w-[60vw] lg:w-[300px] xl:w-[600px]">
                    <div className="flex flex-row flex-wrap">
                      {mediaCredits.writers
                        ? mediaCredits.writers
                            .slice(0, 5)
                            .map((writer, index) => (
                              <Link
                                href={`/protected/person/${writer.id}`}
                                key={index}
                              >
                                {writer.name},{" "}
                              </Link>
                            ))
                        : "N/A"}
                    </div>
                  </span>
                </div>

                <div className="flex flex-row gap-4">
                  <p className="w-[100px] text-xl font-bold text-foreground/50">
                    Stars
                  </p>
                  <div className="w-[60vw] lg:w-[300px] xl:w-[600px]">
                    {mediaCredits.actors
                      ? mediaCredits.actors.slice(0, 5).map((actor, index) => (
                          <Link
                            href={`/protected/person/${actor.id}`}
                            key={index}
                          >
                            {actor.name},{" "}
                          </Link>
                        ))
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mx-auto flex w-screen flex-col gap-8 p-2 lg:w-[75vw] lg:p-0">
        <div className="">
          <div className="my-2 flex flex-row items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent"></div>
            <h1 className="text-xl font-bold">Videos</h1>
          </div>
          <div className="custom-scrollbar flex items-center gap-4 overflow-x-auto whitespace-nowrap py-4">
            {mediaVideos &&
              mediaVideos.results.slice(0, 10).map((video: any) => (
                <div className="inline-block">
                  <YouTubeEmbed
                    videoId={video.key}
                    key={video.key}
                  ></YouTubeEmbed>
                </div>
              ))}
          </div>
        </div>
        <div className="">
          {postsOfMedia && (
            <div>
              {postsOfMedia.length > 0 && (
                <div className="my-2 flex flex-row items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <h1 className="text-xl font-bold">User Posts</h1>
                </div>
              )}
              <div className="flex flex-row flex-wrap gap-4">
                {postsOfMedia?.slice(0, 9).map((post: any) => (
                  <div>
                    <HomePostCardNew post={post}></HomePostCardNew>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="">
          <div className="my-2 flex flex-row items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent"></div>
            <h1 className="text-xl font-bold">Recommended</h1>
          </div>
          <div className="invisible-scroll custom-scrollbar flex flex-row gap-2 overflow-x-auto">
            {mediaRecommendations &&
              mediaRecommendations.results.slice(0, 20).map((media: any) => (
                <div>
                  <ExploreCard media={media}></ExploreCard>
                </div>
              ))}
          </div>
        </div>
        <div className="">
          <div className="my-2 flex flex-row items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent"></div>
            <h1 className="text-xl font-bold">You might like</h1>
          </div>
          <div className="invisible-scroll custom-scrollbar flex flex-row gap-2 overflow-x-auto">
            {mediaSimilar &&
              mediaSimilar.results.slice(0, 20).map((media: any) => (
                <div>
                  <ExploreCard media={media}></ExploreCard>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="h-[500px]"></div>
    </div>
  );
}
