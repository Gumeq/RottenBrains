import { getRelativeTime, transformRuntime } from "@/lib/functions";
import { getMediaDetails } from "@/utils/tmdb";
import Link from "next/link";

const RecommendedCard = async ({ media_id, media_type }: any) => {
  let media: any;
  media = await getMediaDetails(media_type, media_id);
  return (
    <div className="mb-8 flex w-full flex-col gap-2 rounded-[8px] hover:border-accent hover:bg-foreground/20 lg:mb-2 lg:flex-row lg:gap-4 lg:p-2">
      <Link
        className="relative w-full flex-shrink-0 overflow-hidden lg:w-1/2 lg:rounded-[16px]"
        href={
          media_type === "movie"
            ? `/protected/watch/${media_type}/${media_id}`
            : `/protected/watch/${media_type}/${media_id}/1/1`
        }
      >
        <div className="absolute bottom-0 right-0 m-2 flex flex-row-reverse gap-2">
          <div className="rounded-[14px] bg-black/50 px-4 py-1 text-sm text-white">
            {transformRuntime(media.runtime)}
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
          className="aspect-[16/9] bg-foreground/10 lg:rounded-[16px]"
        />
      </Link>
      <div className="flex flex-col px-2 lg:px-0">
        <h3 className="line-clamp-2 text-lg">{media.title || media.name}</h3>
        <div className="flex flex-row items-center gap-4 opacity-50">
          <p className="">
            {getRelativeTime(media.release_date || media.first_air_date)}
          </p>
        </div>
        <h3 className="line-clamp-2 opacity-50 lg:hidden">{media.overview}</h3>
      </div>
    </div>
  );
};

export default RecommendedCard;
