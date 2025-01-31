import { getWatchTime } from "@/lib/supabase/serverQueries";
import { getMediaDetails } from "@/lib/tmdb";
import { getRelativeTime, transformRuntime } from "@/lib/utils";
import Link from "next/link";

const RecommendedCard = async ({ media_id, media_type, user_id }: any) => {
  const media = await getMediaDetails(media_type, media_id);
  const watchTime = await getWatchTime(user_id, "movie", media_id);
  return (
    <div className="mb-4 flex w-full flex-col gap-2 hover:border-accent hover:bg-foreground/20 lg:mb-2 lg:flex-row lg:p-2">
      <Link
        className="relative w-full flex-shrink-0 overflow-hidden lg:w-1/2 lg:rounded-[4px]"
        href={
          media_type === "movie"
            ? `/protected/watch/${media_type}/${media_id}`
            : `/protected/watch/${media_type}/${media_id}/1/1`
        }
      >
        {watchTime > 0 && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-accent"
            style={{
              width: `${watchTime}%`,
            }}
          ></div>
        )}
        <div className="absolute bottom-0 right-0 m-2 flex flex-row-reverse gap-2">
          <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
            {transformRuntime(media.runtime)}
          </div>
          <div className="rounded-[4px] bg-black/60 px-2 py-1 text-xs text-white">
            {media.vote_average.toFixed(1)} / 10
          </div>
        </div>
        <img
          src={
            media.images &&
            media.images.backdrops &&
            media.images.backdrops.length > 0
              ? `https://image.tmdb.org/t/p/w780${media.images.backdrops[0].file_path}`
              : `https://image.tmdb.org/t/p/w780${media.backdrop_path}`
          }
          alt=""
          loading="lazy"
          className="aspect-[16/9] bg-foreground/10 lg:rounded-[4px]"
        />
      </Link>
      <div className="flex flex-col gap-1 px-4 lg:px-0">
        <h3 className="">{media.title || media.name}</h3>
        <p className="text-sm text-foreground/50 lg:text-sm">
          {getRelativeTime(media.release_date || media.first_air_date)}
        </p>
        {/* <p className="line-clamp-2 text-foreground/50 lg:hidden">
          {episode.overview}
        </p> */}
      </div>
    </div>
  );
};

export default RecommendedCard;
