import { cancelFrame } from "framer-motion";
import Link from "next/link";
import React from "react";

function transformRuntime(minutes: number): string {
  const hours: number = Math.floor(minutes / 60);
  const remainingMinutes: number = minutes % 60;

  if (hours > 0) {
    return `${hours} h ${remainingMinutes} m`;
  } else {
    return `${remainingMinutes} m`;
  }
}

const MediaCardExploreMain = (media: any, color: any) => {
  media = media.media;
  const watchLink =
    media.media_type === "movie"
      ? `/protected/watch/${media.media_type}/${media.id}`
      : `/protected/watch/${media.media_type}/${media.id}/1/1`;
  return (
    <div className="relative aspect-[3/1] h-auto w-full overflow-hidden rounded-[8px]">
      <img
        src={`https://image.tmdb.org/t/p/w200${media.backdrop_path}`}
        alt=""
        className="absolute h-full w-full object-cover object-center opacity-50"
      />
      <div
        className={`absolute inset-0 h-full w-full opacity-50 backdrop-blur-xl`}
        style={{
          backgroundImage: `linear-gradient(180deg, black 0%, var(--background) 100%)`,
        }}
      ></div>
      <div className="absolute inset-0 z-10 flex flex-row gap-4 p-2">
        <Link
          href={`/protected/media/${media.media_type}/${media.id}`}
          className="aspect-[2/3] h-full min-h-full w-auto"
        >
          <img
            src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
            alt=""
            className="aspect-[2/3] h-full min-h-full w-auto rounded-[4px] drop-shadow-lg"
          />
        </Link>

        <div className="relative flex h-full w-full flex-col text-lg">
          <p>{media.title || media.name}</p>

          <p className="">
            {(media.release_date && media.release_date.slice(0, 4)) ||
              media.first_air_date.slice(0, 4)}
          </p>
          <Link href={watchLink} className="absolute bottom-0 right-0">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-foreground/20 hover:bg-foreground/40">
              <img
                src="/assets/icons/play-solid.svg"
                alt=""
                className="h-[15px] w-[15px] invert"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MediaCardExploreMain;
